import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three-stdlib';

// --- 常量配置 ---
const WALL_LIMIT = 6;
const BOX_SIZE = 2.5;

// 颜色配置
const PALETTE = ['#EAA14D', '#E05A47', '#4D9BEA', '#5FB376'];
const COMMON_COLORS = {
  dots: '#FFFFFF',
  outline: '#725349',
  shadow: '#F3BD2E',
};

interface DoubleDiceProps {
  onResult: (result: number[]) => void;
  disabled?: boolean;
}

export const DoubleDice: React.FC<DoubleDiceProps> = ({
  onResult,
  disabled,
}) => {
  const { scene, gl, camera } = useThree();

  const worldRef = useRef<CANNON.World>(null!);
  const diceRefs = useRef<any[]>([]);
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -15));

  const isHoldingRef = useRef(false);
  const needsCheckRef = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // --- 初始化 ---
  useEffect(() => {
    const world = new CANNON.World();
    world.gravity.set(0, -40, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as any).iterations = 20;
    world.allowSleep = true;
    worldRef.current = world;

    const wallMat = new CANNON.Material();
    const diceMat = new CANNON.Material();
    world.addContactMaterial(
      new CANNON.ContactMaterial(wallMat, diceMat, {
        friction: 0.3,
        restitution: 0.5,
      })
    );

    createPhysicsWalls(world, wallMat);
    createDice(2, world, scene, diceMat);

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

  // --- 动画循环 ---
  useFrame(() => {
    if (!worldRef.current) return;
    const world = worldRef.current;
    const time = performance.now() * 0.01;

    if (isHoldingRef.current) {
      // 拖拽逻辑
      raycaster.current.setFromCamera(mouse.current, camera);
      const targetPoint = new THREE.Vector3();
      const intersect = raycaster.current.ray.intersectPlane(
        dragPlaneRef.current,
        targetPoint
      );

      if (intersect) {
        diceRefs.current.forEach((obj, i) => {
          const offsetX = Math.sin(time + i) * 1.0;
          const offsetZ = Math.cos(time + i * 2) * 1.0;

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

          obj.body.position.x += (targetX - obj.body.position.x) * 0.25;
          obj.body.position.y += (15 - obj.body.position.y) * 0.25;
          obj.body.position.z += (targetZ - obj.body.position.z) * 0.25;

          obj.body.quaternion.setFromEuler(
            time * 2 + obj.spinOffset,
            time * 3 + obj.spinOffset,
            time * 1.5
          );

          obj.body.velocity.set(0, 0, 0);
          obj.body.angularVelocity.set(0, 0, 0);
          obj.isReturning = false;
          obj.stableCount = 0; // 拖拽时重置稳定计数
        });
      }
    } else {
      // 物理模拟
      diceRefs.current.forEach((obj) => {
        if (obj.body.position.y < -10) {
          obj.body.position.set(0, 5, 0);
          obj.body.velocity.set(0, 0, 0);
          obj.stableCount = 0;
        }

        if (obj.isReturning) {
          obj.body.position.x += (0 - obj.body.position.x) * 0.15;
          obj.body.position.z += (0 - obj.body.position.z) * 0.15;
          obj.body.position.y += (12 - obj.body.position.y) * 0.1;
          obj.body.quaternion.setFromEuler(time * 5, time * 5, 0);
          obj.body.velocity.set(0, 0, 0);
          obj.body.angularVelocity.set(0, 0, 0);
          obj.stableCount = 0;

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
      world.step(1 / 60);
    }

    // 同步 Mesh
    diceRefs.current.forEach((obj) => {
      const { mesh, outline, shadow, body } = obj;
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
      outline.position.copy(mesh.position);
      outline.quaternion.copy(mesh.quaternion);
      shadow.position.x = body.position.x;
      shadow.position.z = body.position.z;
      const height = Math.max(0, body.position.y - 1);
      const scale = Math.max(0.5, 1 - height * 0.04);
      shadow.scale.setScalar(scale);
      shadow.material.opacity = Math.max(0, 0.2 - height * 0.01);
    });

    if (needsCheckRef.current) checkResult();
  });

  // --- 事件监听 ---
  useEffect(() => {
    const canvas = gl.domElement;
    const updateMouse = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      // 如果 disabled 为 true，直接禁止交互
      if (disabled) return;
      e.preventDefault();
      isHoldingRef.current = true;
      needsCheckRef.current = false;
      let cx, cy;
      if ('changedTouches' in e) {
        cx = e.changedTouches[0].clientX;
        cy = e.changedTouches[0].clientY;
      } else {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      updateMouse(cx, cy);
      diceRefs.current.forEach((obj) => {
        obj.body.wakeUp();
        obj.spinOffset = Math.random() * 100;
        obj.isReturning = false;
        obj.stableCount = 0; // 重置稳定计数
      });
    };

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

    const onUp = () => {
      if (!isHoldingRef.current) return;
      isHoldingRef.current = false;
      releaseDice();
    };

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
  }, [gl, disabled]);

  // --- 辅助逻辑 ---
  const createDice = (
    count: number,
    world: CANNON.World,
    scene: THREE.Scene,
    mat: CANNON.Material
  ) => {
    const geometry = new RoundedBoxGeometry(
      BOX_SIZE,
      BOX_SIZE,
      BOX_SIZE,
      4,
      0.4
    );
    const outlineGeo = geometry.clone();
    const shadowGeo = new THREE.CircleGeometry(BOX_SIZE * 0.6, 32);
    const shape = new CANNON.Box(
      new CANNON.Vec3(BOX_SIZE / 2, BOX_SIZE / 2, BOX_SIZE / 2)
    );

    const outlineMat = new THREE.MeshBasicMaterial({
      color: COMMON_COLORS.outline,
      side: THREE.BackSide,
    });
    const shadowMat = new THREE.MeshBasicMaterial({
      color: COMMON_COLORS.shadow,
      transparent: true,
      opacity: 0.2,
    });

    for (let i = 0; i < count; i++) {
      const randomColor = PALETTE[i % PALETTE.length];
      const diceMaterials = [];
      for (let j = 1; j <= 6; j++) {
        diceMaterials.push(
          new THREE.MeshBasicMaterial({
            map: createDiceTexture(j, randomColor),
            color: 'white',
          })
        );
      }
      const matArray = [
        diceMaterials[0],
        diceMaterials[5],
        diceMaterials[1],
        diceMaterials[4],
        diceMaterials[2],
        diceMaterials[3],
      ];

      const mesh = new THREE.Mesh(geometry, matArray);
      scene.add(mesh);

      const outline = new THREE.Mesh(outlineGeo, outlineMat);
      outline.scale.setScalar(1.06);
      scene.add(outline);

      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      scene.add(shadow);

      const startX = (i - (count - 1) / 2) * 3;
      const body = new CANNON.Body({
        mass: 5,
        shape: shape,
        position: new CANNON.Vec3(startX, BOX_SIZE, 0),
        material: mat,
        sleepSpeedLimit: 0.5,
      });
      body.quaternion.setFromEuler(Math.random(), Math.random(), Math.random());
      world.addBody(body);

      // 🔥 新增 stableCount 属性
      diceRefs.current.push({
        mesh,
        outline,
        shadow,
        body,
        spinOffset: 0,
        isReturning: false,
        stableCount: 0,
      });
    }
  };

  const releaseDice = () => {
    diceRefs.current.forEach((obj) => {
      const { body } = obj;
      const isOutside =
        Math.abs(body.position.x) > WALL_LIMIT ||
        Math.abs(body.position.z) > WALL_LIMIT;
      if (isOutside) obj.isReturning = true;
      else {
        body.wakeUp();
        applyThrowForce(body);
      }
    });
    setTimeout(() => {
      needsCheckRef.current = true;
    }, 500);
  };

  const applyThrowForce = (body: CANNON.Body) => {
    body.velocity.set(
      -body.position.x * 1.5 + (Math.random() - 0.5) * 15,
      -15 - Math.random() * 10,
      -body.position.z * 1.5 + (Math.random() - 0.5) * 15
    );
    body.angularVelocity.set(
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 35
    );
  };

  // 🔥 核心修改：稳定性检测逻辑
  const checkResult = () => {
    let allStable = true;

    for (let obj of diceRefs.current) {
      if (obj.isReturning) {
        allStable = false;
        obj.stableCount = 0;
        break;
      }

      // 检查当前速度 (更严格的阈值)
      const speed = obj.body.velocity.lengthSquared();
      const angularSpeed = obj.body.angularVelocity.lengthSquared();

      // 阈值设为 0.01 (非常小)
      if (speed < 0.01 && angularSpeed < 0.01) {
        // 如果速度很慢，增加稳定性计数
        obj.stableCount += 1;
      } else {
        // 只要有一点动，就重置计数
        obj.stableCount = 0;
        allStable = false;
      }

      // 只有连续静止 15 帧 (约 0.25秒) 才算真的停下
      if (obj.stableCount < 15) {
        allStable = false;
      }
    }

    if (allStable) {
      needsCheckRef.current = false; // 停止检测

      const faceNormals = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];
      const faceDotValues = [1, 6, 2, 5, 3, 4];
      const results: number[] = [];

      diceRefs.current.forEach(({ mesh }) => {
        let maxDot = -Infinity;
        let resultValue = 1;
        faceNormals.forEach((normal, i) => {
          const worldNormal = normal.clone().applyQuaternion(mesh.quaternion);
          if (worldNormal.y > maxDot) {
            maxDot = worldNormal.y;
            resultValue = faceDotValues[i];
          }
        });
        results.push(resultValue - 1);
      });
      onResult(results);
    }
  };

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

  return null;
};

// --- 工具函数：生成贴图 (逻辑保持不变 0-5) ---

// 在 Three.js 中，要给骰子的每一面贴上不同的点数，
// 这里没有使用现成的图片文件，而是使用 HTML5 Canvas 动态画出来的。
function createDiceTexture(logicalNumber: number, colorHex: string) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  const visualNumber = logicalNumber - 1;

  const isTraditional = colorHex === '#FFFFFF';
  let dotColor = COMMON_COLORS.dots;
  if (isTraditional) {
    if (visualNumber === 1 || visualNumber === 4) dotColor = '#E03E3E';
    else dotColor = '#331e18';
  }
  ctx.fillStyle = dotColor;

  const dotSize = size / 5;
  const currentDotSize =
    isTraditional && visualNumber === 1 ? dotSize * 1.5 : dotSize;
  const center = size / 2;
  const q1 = size / 4;
  const q3 = (size * 3) / 4;

  const drawDot = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, currentDotSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  if (visualNumber === 1) {
    drawDot(center, center);
  } else if (visualNumber === 2) {
    drawDot(q1, q1);
    drawDot(q3, q3);
  } else if (visualNumber === 3) {
    drawDot(q1, q1);
    drawDot(center, center);
    drawDot(q3, q3);
  } else if (visualNumber === 4) {
    drawDot(q1, q1);
    drawDot(q3, q1);
    drawDot(q1, q3);
    drawDot(q3, q3);
  } else if (visualNumber === 5) {
    drawDot(q1, q1);
    drawDot(center, center);
    drawDot(q1, q3);
    drawDot(q3, q3);
    drawDot(q3, q1);
  }

  return new THREE.CanvasTexture(canvas);
}
