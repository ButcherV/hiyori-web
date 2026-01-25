import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three-stdlib';

/**
 * ============================================================================
 * 1. 常量与配置 (Constants & Configuration)
 * ============================================================================
 */

// 物理墙壁的范围限制（超过这个范围骰子会被“弹”回来）
const WALL_LIMIT = 6;
// 骰子的大小
const BOX_SIZE = 2.5;

// // 骰子配色方案（随机池）
// const PALETTE = ['#EAA14D', '#E05A47', '#4D9BEA', '#5FB376'];
// 颜色配置 (混合了红、蓝、绿、橙、紫、青)
// const PALETTE = [
//   '#FF6B6B', // 珊瑚红
//   '#4ECDC4', // 蒂芙尼蓝
//   '#FFD166', // 芥末黄
//   '#6A4C93', // 葡萄紫
//   '#1A535C', // 深海蓝
//   '#F05D23', // 柿子橙
// ];

// // 通用颜色配置
// const COMMON_COLORS = {
//   dots: '#FFFFFF', // 点数颜色
//   outline: '#725349', // 描边颜色
//   shadow: '#F3BD2E', // 假阴影颜色
// };

// 🟢 新配色（启用）：Vivid / Sharp 工业色系
// 这些颜色在柔光背景下会非常跳脱，对比度极高
const PALETTE = [
  '#FF3B30', // Apple Red (极高红) - 视觉冲击力强
  '#007AFF', // System Blue (纯净蓝) - 科技感
  '#FF9500', // Safety Orange (安全橙) - 活力
  '#34C759', // Grass Green (锐利绿) - 清晰
  '#5856D6', // Deep Purple (深紫) - 沉稳
  '#FFCC00', // Traffic Yellow (交通黄) - 极高亮
];

// 🟢 通用颜色优化
const COMMON_COLORS = {
  dots: '#FFFFFF', // 点数保持纯白，对比最强

  // 🔴 关键修改：描边颜色
  // 原来的 '#725349' (暖褐) -> 改为 '#1F2937' (深蓝灰/近黑)
  // 这会让骰子的边缘像漫画或 CAD 图纸一样清晰锐利
  outline: '#1F2937',

  // 阴影颜色也稍微冷一点，不要太黄
  shadow: '#94A3B8',
};

interface DoubleDiceProps {
  // 当骰子停稳后，向父组件汇报结果的回调
  onResult: (result: number[]) => void;
  // 是否禁用交互（禁用时无法拖拽）
  disabled?: boolean;
}

/**
 * ============================================================================
 * 2. 主组件：DoubleDice
 * 功能：
 * - 初始化 Cannon.js 物理世界
 * - 管理渲染循环 (useFrame) 同步物理与视觉
 * - 处理鼠标/触摸交互
 * ============================================================================
 */
export const DoubleDice: React.FC<DoubleDiceProps> = ({
  onResult,
  disabled,
}) => {
  // 获取 Three.js 的核心对象
  const { scene, gl, camera } = useThree();

  // --- Refs (使用 Ref 来存储不触发重渲染的可变数据) ---

  // 物理世界实例
  const worldRef = useRef<CANNON.World>(null!);
  // 存储所有骰子对象的引用（包含 Mesh, Body, 阴影等）
  const diceRefs = useRef<any[]>([]);
  // 一个不可见的水平面，用于把鼠标的 2D 坐标映射到 3D 空间进行拖拽
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -15));

  // 交互状态标记
  const isHoldingRef = useRef(false); // 是否正在拖拽中
  const needsCheckRef = useRef(false); // 是否需要开始检测骰子停止

  // 射线投射器和鼠标向量（复用对象以避免 GC）
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  /**
   * --------------------------------------------------------------------------
   * 生命周期：初始化物理世界 (Initialization)
   * --------------------------------------------------------------------------
   */
  useEffect(() => {
    // 1. 创建物理世界
    const world = new CANNON.World();
    world.gravity.set(0, -40, 0); // 重力设大一点，手感更干脆
    world.broadphase = new CANNON.NaiveBroadphase(); // 碰撞检测算法
    (world.solver as any).iterations = 20; // 求解迭代次数，越高越精确但越耗能
    world.allowSleep = true; // 允许物体静止休眠，节省性能
    worldRef.current = world;

    // 2. 设置材质与摩擦系数
    const wallMat = new CANNON.Material();
    const diceMat = new CANNON.Material();
    world.addContactMaterial(
      new CANNON.ContactMaterial(wallMat, diceMat, {
        friction: 0.3, // 摩擦力
        restitution: 0.5, // 弹性（0=无弹性，1=完全弹性）
      })
    );

    // 3. 创建场景物体
    createPhysicsWalls(world, wallMat); // 创建四周隐形墙
    createDice(2, world, scene, diceMat); // 创建2颗骰子

    // 4. 清理函数
    return () => {
      diceRefs.current.forEach((obj) => {
        scene.remove(obj.mesh);
        scene.remove(obj.outline);
        scene.remove(obj.shadow);
        world.removeBody(obj.body);
      });
      diceRefs.current = [];
    };
  }, [scene]);

  /**
   * --------------------------------------------------------------------------
   * 核心循环：useFrame
   * 功能：每一帧运行（约 60fps），负责物理计算和画面同步
   * --------------------------------------------------------------------------
   */
  useFrame(() => {
    if (!worldRef.current) return;
    const world = worldRef.current;
    const time = performance.now() * 0.01; // 用于生成一些正弦波动的参数

    // === 分支 A: 用户正在拖拽 (God Mode) ===
    if (isHoldingRef.current) {
      // 通过射线计算鼠标在拖拽平面上的 3D 坐标
      raycaster.current.setFromCamera(mouse.current, camera);
      const targetPoint = new THREE.Vector3();
      const intersect = raycaster.current.ray.intersectPlane(
        dragPlaneRef.current,
        targetPoint
      );

      if (intersect) {
        diceRefs.current.forEach((obj, i) => {
          // 给每个骰子一点偏移，让它们不重叠，并随时间轻微浮动
          const offsetX = Math.sin(time + i) * 1.0;
          const offsetZ = Math.cos(time + i * 2) * 1.0;

          // 限制拖拽范围，不让骰子被拖出墙外
          let targetX = targetPoint.x + offsetX;
          let targetZ = targetPoint.z + offsetZ;
          targetX = Math.max(
            -WALL_LIMIT + 1,
            Math.min(WALL_LIMIT - 1, targetX)
          );
          targetZ = Math.max(
            -WALL_LIMIT + 1,
            Math.min(WALL_LIMIT - 1, targetZ)
          );

          // 💡 关键物理技巧：Lerp (线性插值)
          // 不直接设置位置，而是让物体“追逐”鼠标，产生丝滑的延迟感
          obj.body.position.x += (targetX - obj.body.position.x) * 0.25;
          obj.body.position.y += (15 - obj.body.position.y) * 0.25; // 悬浮高度 15
          obj.body.position.z += (targetZ - obj.body.position.z) * 0.25;

          // 让骰子在空中自转，增加动感
          obj.body.quaternion.setFromEuler(
            time * 2 + obj.spinOffset,
            time * 3 + obj.spinOffset,
            time * 1.5
          );

          // 拖拽时清除速度，防止积累巨大的动量
          obj.body.velocity.set(0, 0, 0);
          obj.body.angularVelocity.set(0, 0, 0);

          obj.isReturning = false;
          obj.stableCount = 0; // 重置稳定计数器
        });
      }
    }
    // === 分支 B: 物理模拟 (Physics Mode) ===
    else {
      diceRefs.current.forEach((obj) => {
        // 1. 掉落保护：如果穿模掉到世界下方，重置回上方
        if (obj.body.position.y < -10) {
          obj.body.position.set(0, 5, 0);
          obj.body.velocity.set(0, 0, 0);
          obj.stableCount = 0;
        }

        // 2. 回归逻辑 (Magic Magnet)
        // 如果骰子飞出墙外，会被一股神秘力量吸回中心
        if (obj.isReturning) {
          obj.body.position.x += (0 - obj.body.position.x) * 0.15;
          obj.body.position.z += (0 - obj.body.position.z) * 0.15;
          obj.body.position.y += (12 - obj.body.position.y) * 0.1;
          // 旋转回正
          obj.body.quaternion.setFromEuler(time * 5, time * 5, 0);

          // 消除物理速度
          obj.body.velocity.set(0, 0, 0);
          obj.body.angularVelocity.set(0, 0, 0);
          obj.stableCount = 0;

          // 如果已经回到中心范围内，重新激活物理，给它一脚踢出去
          if (
            Math.abs(obj.body.position.x) < WALL_LIMIT &&
            Math.abs(obj.body.position.z) < WALL_LIMIT
          ) {
            obj.isReturning = false;
            obj.body.wakeUp();
            applyThrowForce(obj.body);
          }
        }
      });

      // 更新物理世界 (步长 1/60秒)
      world.step(1 / 60);
    }

    // === 同步：将物理计算结果应用到视觉 Mesh 上 ===
    diceRefs.current.forEach((obj) => {
      const { mesh, outline, shadow, body } = obj;

      // 同步位置和旋转
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);

      // 描边跟随
      outline.position.copy(mesh.position);
      outline.quaternion.copy(mesh.quaternion);

      // 阴影跟随 (只在地面移动，大小和透明度随高度变化)
      shadow.position.x = body.position.x;
      shadow.position.z = body.position.z;
      const height = Math.max(0, body.position.y - 1);
      const scale = Math.max(0.5, 1 - height * 0.04); // 越高越小
      shadow.scale.setScalar(scale);
      shadow.material.opacity = Math.max(0, 0.2 - height * 0.01); // 越高越淡
    });

    // 如果松手了，开始检查骰子是否停稳
    if (needsCheckRef.current) checkResult();
  });

  /**
   * --------------------------------------------------------------------------
   * 事件监听
   * 功能：处理鼠标按下、移动、抬起。
   * 特点：包含了 "disabled" 状态的硬拦截。
   * --------------------------------------------------------------------------
   */
  useEffect(() => {
    const canvas = gl.domElement;

    // 归一化鼠标坐标 (-1 到 +1)
    const updateMouse = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    // 按下：开始拖拽
    const onDown = (e: MouseEvent | TouchEvent) => {
      // 🔒 逻辑锁：如果被禁用，直接忽略交互
      if (disabled) return;

      e.preventDefault();
      isHoldingRef.current = true;
      needsCheckRef.current = false; // 拖拽时不检查结果

      // 获取坐标兼容触摸和鼠标
      let cx, cy;
      if ('changedTouches' in e) {
        cx = e.changedTouches[0].clientX;
        cy = e.changedTouches[0].clientY;
      } else {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      updateMouse(cx, cy);

      // 唤醒所有物理刚体，准备运动
      diceRefs.current.forEach((obj) => {
        obj.body.wakeUp();
        obj.spinOffset = Math.random() * 100; // 随机自转相位
        obj.isReturning = false;
        obj.stableCount = 0;
      });
    };

    // 移动：更新坐标
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isHoldingRef.current) return;
      let cx, cy;
      if ('changedTouches' in e) {
        cx = e.changedTouches[0].clientX;
        cy = e.changedTouches[0].clientY;
      } else {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      updateMouse(cx, cy);
    };

    // 抬起：发射骰子
    const onUp = () => {
      if (!isHoldingRef.current) return;
      isHoldingRef.current = false;
      releaseDice(); // 执行抛出逻辑
    };

    // 绑定事件 (使用 passive: false 以便能 preventDefault)
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [gl, disabled]); // 依赖项包含 disabled，确保状态切换时监听器更新

  /**
   * ==========================================================================
   * 3. 核心工具函数 (Helper Functions)
   * 这里的函数负责具体的实现细节
   * ==========================================================================
   */

  /**
   * 功能：创建骰子的 3D Mesh 和 物理 Body
   * 细节：
   * - 视觉：Mesh (本体) + Outline (描边) + Shadow (阴影)
   * - 物理：CANNON.Box (为了性能使用立方体碰撞盒，而不是圆角)
   */
  const createDice = (
    count: number,
    world: CANNON.World,
    scene: THREE.Scene,
    mat: CANNON.Material
  ) => {
    // 几何体：圆角立方体，为了好看
    const geometry = new RoundedBoxGeometry(
      BOX_SIZE,
      BOX_SIZE,
      BOX_SIZE,
      4,
      0.4
    );
    const outlineGeo = geometry.clone(); // 描边用的几何体
    const shadowGeo = new THREE.CircleGeometry(BOX_SIZE * 0.6, 32); // 阴影几何体

    // 物理形状：标准立方体
    const shape = new CANNON.Box(
      new CANNON.Vec3(BOX_SIZE / 2, BOX_SIZE / 2, BOX_SIZE / 2)
    );

    // 材质
    const outlineMat = new THREE.MeshBasicMaterial({
      color: COMMON_COLORS.outline,
      side: THREE.BackSide, // 关键：只渲染背面，配合放大实现描边效果
    });
    const shadowMat = new THREE.MeshBasicMaterial({
      color: COMMON_COLORS.shadow,
      transparent: true,
      opacity: 0.2,
    });

    // 🔥 先洗牌，保证颜色不重复
    // 1. 复制一份颜色数组，以免修改原数组
    // 2. 使用 sort + Math.random 简单打乱顺序
    const shuffledColors = [...PALETTE].sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      // 顺序取色
      // const randomColor = PALETTE[i % PALETTE.length];

      // 随机取色
      const randomColor = shuffledColors[i % shuffledColors.length];

      // 💡 生成 6 个面的纹理材质
      const diceMaterials = [];
      for (let j = 1; j <= 6; j++) {
        diceMaterials.push(
          new THREE.MeshStandardMaterial({
            map: createDiceTexture(j, randomColor),
            color: 'white',

            // 🟢 物理质感参数 (Plastic/Resin Look)
            roughness: 0.45, // 粗糙度极低 -> 表面非常光滑
            metalness: 0.0, // 金属度为0 -> 塑料/树脂质感

            // 可选：增加一点环境贴图强度，让它反一点光
            envMapIntensity: 1,
          })
        );
      }
      // 调整材质顺序以匹配立方体面的索引 (右左上下前后)
      const matArray = [
        diceMaterials[0],
        diceMaterials[5],
        diceMaterials[1],
        diceMaterials[4],
        diceMaterials[2],
        diceMaterials[3],
      ];

      // 1. 创建视觉 Mesh
      const mesh = new THREE.Mesh(geometry, matArray);
      scene.add(mesh);

      // 2. 创建描边 Mesh (放大一点点)
      const outline = new THREE.Mesh(outlineGeo, outlineMat);
      outline.scale.setScalar(1.06);
      scene.add(outline);

      // 3. 创建阴影 Mesh
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2; // 放平
      scene.add(shadow);

      // 4. 创建物理 Body
      const startX = (i - (count - 1) / 2) * 3; // 稍微错开位置
      const body = new CANNON.Body({
        mass: 5, // 质量
        shape: shape,
        position: new CANNON.Vec3(startX, BOX_SIZE, 0),
        material: mat,
        sleepSpeedLimit: 0.5,
      });
      // 初始给个随机旋转
      body.quaternion.setFromEuler(Math.random(), Math.random(), Math.random());
      world.addBody(body);

      // 存入 Refs 供后续使用
      diceRefs.current.push({
        mesh,
        outline,
        shadow,
        body,
        spinOffset: 0,
        isReturning: false,
        stableCount: 0, // 用于判断是否停稳
      });
    }
  };

  /**
   * 功能：松手后的逻辑
   * - 如果骰子被拖到了界外，标记为 returning (吸回)
   * - 如果在界内，施加一个随机的抛出力
   */
  const releaseDice = () => {
    diceRefs.current.forEach((obj) => {
      const { body } = obj;
      const isOutside =
        Math.abs(body.position.x) > WALL_LIMIT ||
        Math.abs(body.position.z) > WALL_LIMIT;

      if (isOutside) {
        obj.isReturning = true;
      } else {
        body.wakeUp();
        applyThrowForce(body);
      }
    });
    // 0.5秒后开始检查是否停稳，给一点飞翔的时间
    setTimeout(() => {
      needsCheckRef.current = true;
    }, 500);
  };

  /**
   * 功能：施加抛出力 (Throw Force)
   * 逻辑：根据位置反向施力，让它稍微往中间飞，加上随机扰动
   */
  const applyThrowForce = (body: CANNON.Body) => {
    body.velocity.set(
      -body.position.x * 1.5 + (Math.random() - 0.5) * 15, // X轴：往反方向推 + 随机
      -15 - Math.random() * 10, // Y轴：用力往下砸
      -body.position.z * 1.5 + (Math.random() - 0.5) * 15 // Z轴：往反方向推 + 随机
    );
    // 施加剧烈的随机旋转
    body.angularVelocity.set(
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 35
    );
  };

  /**
   * 功能：检测骰子是否停稳并计算点数
   * 逻辑：
   * 1. 检查速度：线速度和角速度都必须非常小。
   * 2. 检查持续时间：必须连续 15 帧都保持静止（防止只是弹跳到了最高点瞬间静止）。
   * 3. 计算点数：利用向量点积 (Dot Product) 判断哪个面朝上。
   */
  const checkResult = () => {
    let allStable = true;

    for (let obj of diceRefs.current) {
      if (obj.isReturning) {
        allStable = false;
        obj.stableCount = 0;
        break;
      }

      // 速度阈值极小，确保完全停下
      const speed = obj.body.velocity.lengthSquared();
      const angularSpeed = obj.body.angularVelocity.lengthSquared();

      if (speed < 0.01 && angularSpeed < 0.01) {
        obj.stableCount += 1;
      } else {
        obj.stableCount = 0;
        allStable = false;
      }

      if (obj.stableCount < 15) {
        // 约 0.25 秒
        allStable = false;
      }
    }

    if (allStable) {
      needsCheckRef.current = false; // 停止检测

      // 💡 向量计算法求点数
      // 定义每个面在“骰子局部坐标系”下的法线向量
      const faceNormals = [
        new THREE.Vector3(1, 0, 0), // 右
        new THREE.Vector3(-1, 0, 0), // 左
        new THREE.Vector3(0, 1, 0), // 上
        new THREE.Vector3(0, -1, 0), // 下
        new THREE.Vector3(0, 0, 1), // 前
        new THREE.Vector3(0, 0, -1), // 后
      ];
      // 对应的点数
      const faceDotValues = [1, 6, 2, 5, 3, 4];
      const results: number[] = [];

      diceRefs.current.forEach(({ mesh }) => {
        let maxDot = -Infinity;
        let resultValue = 1;

        // 遍历6个面，看哪个面变换到世界坐标后，Y值最大（最接近垂直向上）
        faceNormals.forEach((normal, i) => {
          const worldNormal = normal.clone().applyQuaternion(mesh.quaternion);
          if (worldNormal.y > maxDot) {
            maxDot = worldNormal.y;
            resultValue = faceDotValues[i];
          }
        });
        // 这里的 -1 是为了适配 0-5 的业务逻辑
        results.push(resultValue - 1);
      });

      onResult(results); // 触发回调
    }
  };

  // 创建物理墙壁 (防止飞出去)
  const createPhysicsWalls = (world: CANNON.World, mat: CANNON.Material) => {
    const floorBody = new CANNON.Body({ mass: 0, material: mat });
    floorBody.addShape(new CANNON.Plane());
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    world.addBody(floorBody);

    const wallDistance = WALL_LIMIT + 3;
    const createWall = (x: number, z: number, rot: number) => {
      const body = new CANNON.Body({ mass: 0, material: mat });
      body.addShape(new CANNON.Plane());
      body.position.set(x, 0, z);
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rot);
      world.addBody(body);
    };
    createWall(wallDistance, 0, -Math.PI / 2);
    createWall(-wallDistance, 0, Math.PI / 2);
    createWall(0, -wallDistance, 0);
    createWall(0, wallDistance, Math.PI);
  };

  return null; // 此组件不渲染 DOM，只在 Canvas 内部管理 Scene
};

/**
 * ============================================================================
 * 4. 纯函数：Canvas 绘图 (Texture Generation)
 * 功能：使用 Canvas 2D API 动态画出骰子的贴图
 * 优点：无需加载外部图片，颜色可动态配置，清晰度可控
 * ============================================================================
 */
function createDiceTexture(logicalNumber: number, colorHex: string) {
  const size = 256; // 贴图分辨率
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. 涂背景色
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  // 💡 业务逻辑转换：
  // 传入的是 1-6，但我们需要 0-5 的面值
  // visualNumber: 实际上想要显示的点数 (0, 1, 2, 3, 4, 5)
  const visualNumber = logicalNumber - 1;

  // 2. 确定点的颜色
  const isTraditional = colorHex === '#FFFFFF';
  let dotColor = COMMON_COLORS.dots;
  if (isTraditional) {
    // 亚洲骰子传统：1点和4点是红色的
    if (visualNumber === 1 || visualNumber === 4) dotColor = '#E03E3E';
    else dotColor = '#331e18';
  }
  ctx.fillStyle = dotColor;

  // 3. 确定点的大小和位置
  const dotSize = size / 5;
  const currentDotSize =
    isTraditional && visualNumber === 1 ? dotSize * 1.5 : dotSize; // 1点通常大一点

  const center = size / 2;
  const q1 = size / 4; // 1/4 处
  const q3 = (size * 3) / 4; // 3/4 处

  // 画圆辅助函数
  const drawDot = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, currentDotSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  // 4. 根据点数画点
  // 注意：这里画的是 visualNumber (0-5)
  if (visualNumber === 1) {
    // 显示1个点
    drawDot(center, center);
  } else if (visualNumber === 2) {
    // 显示2个点
    drawDot(q1, q1);
    drawDot(q3, q3);
  } else if (visualNumber === 3) {
    // 显示3个点
    drawDot(q1, q1);
    drawDot(center, center);
    drawDot(q3, q3);
  } else if (visualNumber === 4) {
    // 显示4个点
    drawDot(q1, q1);
    drawDot(q3, q1);
    drawDot(q1, q3);
    drawDot(q3, q3);
  } else if (visualNumber === 5) {
    // 显示5个点
    drawDot(q1, q1);
    drawDot(center, center);
    drawDot(q1, q3);
    drawDot(q3, q3);
    drawDot(q3, q1);
  }
  // visualNumber === 0 时不画点，就是空白面

  return new THREE.CanvasTexture(canvas);
}
