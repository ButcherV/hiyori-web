import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TraceCard.module.css';
import { KANA_PATHS } from '../../datas/kanaPaths';

// --- 常量配置 ---
const STANDARD_VIEWBOX = '0 0 109 109';
// 判定宽容度：检测管道的粗细 (109坐标系下，20px 算很宽容了)
const HIT_STROKE_WIDTH = 25;
// 起点容错范围：手指落下点离标准起点多远算“瞄准了”？
const START_POINT_RADIUS = 20;
// 准确率阈值：至少有多少比例的点落在路径内才算过？(0.6 = 60%)
const PASS_ACCURACY = 0.6;

interface TraceCardProps {
  char: string;
  onComplete: () => void;
}

export const TraceCard: React.FC<TraceCardProps> = ({ char, onComplete }) => {
  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔥 新增：逻辑检测专用 Canvas (不渲染到屏幕，只在内存里计算)
  // 用 ref 保持它，不用每次重绘都创建
  const logicCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- State ---
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // 统计算法用的变量
  const statsRef = useRef({
    totalPoints: 0, // 总采样点数
    hitPoints: 0, // 命中点数 (在路径内的点)
    lastX: 0,
    lastY: 0,
  });

  const paths = KANA_PATHS[char] || [];
  const isFinished = strokeIndex >= paths.length;

  // --- 初始化逻辑 Canvas ---
  // 这个 Canvas 永远保持 109x109 的标准尺寸，专门用来做“碰撞检测”
  useEffect(() => {
    if (!logicCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = 109;
      c.height = 109;
      logicCanvasRef.current = c;
    }
  }, []);

  // --- 视觉 Canvas 初始化 (负责显示) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = rect.width;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size * 0.055;
      ctx.strokeStyle = '#000000';
    }
  }, []);

  // 换字时重置
  useEffect(() => {
    setStrokeIndex(0);
    clearCanvas();
  }, [char]);

  // ---  helper: 准备当前笔画的“隐形检测通道” ---
  const prepareHitTestPath = (pathData: string) => {
    const logicCtx = logicCanvasRef.current?.getContext('2d');
    if (!logicCtx) return null;

    logicCtx.clearRect(0, 0, 109, 109);
    logicCtx.lineWidth = HIT_STROKE_WIDTH;
    logicCtx.lineCap = 'round';
    logicCtx.lineJoin = 'round';

    const p = new Path2D(pathData);
    logicCtx.stroke(p); // 在内存里把这条线“画”出来，供后续检测
    return { ctx: logicCtx, path: p };
  };

  // --- helper: 获取标准起点 (解析 SVG 字符串 M x,y) ---
  const getStartPoint = (pathData: string) => {
    // 简单的正则提取: M 20,30 或 M20.5,30.5
    const match = pathData.match(/M\s*([\d.]+)[ ,]([\d.]+)/);
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    }
    return null;
  };

  // --- 核心交互逻辑 ---

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // 1. 开始绘画 (增加了起点检测)
  const startDrawing = (e: any) => {
    e.stopPropagation();
    if (isFinished) return;

    // 获取当前笔画数据
    const currentPathData = paths[strokeIndex];
    if (!currentPathData) return;

    // A. 坐标转换：屏幕像素 -> 109标准坐标
    const { x, y } = getPos(e);
    const rect = containerRef.current!.getBoundingClientRect();
    const scale = 109 / rect.width; // 缩放比例
    const logicX = x * scale;
    const logicY = y * scale;

    // B. 起点检测：如果你离起点太远，根本不让你开始画 (防止倒着写)
    const startPt = getStartPoint(currentPathData);
    if (startPt) {
      const dist = Math.sqrt(
        Math.pow(logicX - startPt.x, 2) + Math.pow(logicY - startPt.y, 2)
      );
      if (dist > START_POINT_RADIUS) {
        console.log('离起点太远，忽略');
        return;
      }
    }

    // C. 准备开始
    setIsDrawing(true);
    statsRef.current = { totalPoints: 0, hitPoints: 0, lastX: x, lastY: y };

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  // 2. 绘画中 (增加了命中率采样)
  const draw = (e: any) => {
    e.stopPropagation();
    if (!isDrawing || isFinished) return;

    const { x, y } = getPos(e);

    // --- 视觉绘制 ---
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // --- 逻辑检测 (采样) ---
    // 我们不需要每个像素都算，手指移动事件本身的频率就足够做采样了
    const rect = containerRef.current!.getBoundingClientRect();
    const scale = 109 / rect.width;
    const logicX = x * scale;
    const logicY = y * scale;

    // 准备检测环境
    const currentPathData = paths[strokeIndex];
    const logicCheck = prepareHitTestPath(currentPathData);

    if (logicCheck) {
      statsRef.current.totalPoints++;
      // 🔥 核心 API: isPointInStroke
      // 问：这个点 (logicX, logicY) 是否落在加粗后的路径里？
      if (logicCheck.ctx.isPointInStroke(logicCheck.path, logicX, logicY)) {
        statsRef.current.hitPoints++;
      }
    }
  };

  // 3. 结束绘画 (增加了分数结算)
  const stopDrawing = (e: any) => {
    e.stopPropagation();
    if (!isDrawing) return;
    setIsDrawing(false);

    const { hitPoints, totalPoints } = statsRef.current;

    // 防止点击一下就触发：必须有一定的采样数
    if (totalPoints < 10) {
      clearCanvas();
      return;
    }

    // 🔥 算分：准确率 = 命中点 / 总点数
    const accuracy = hitPoints / totalPoints;
    console.log(`准确率: ${(accuracy * 100).toFixed(1)}%`);

    if (accuracy >= PASS_ACCURACY) {
      handleStrokeSuccess();
    } else {
      console.log('写歪了，重来');
      clearCanvas(); // 失败，擦除笔迹

      // 可选：给个震动反馈
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const handleStrokeSuccess = () => {
    clearCanvas(); // 擦除用户的笔迹
    const nextIndex = strokeIndex + 1;
    setStrokeIndex(nextIndex);
    if (nextIndex >= paths.length) {
      setTimeout(() => onComplete(), 500);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isFinished ? 'Done!' : `Stroke ${strokeIndex + 1} / ${paths.length}`}
      </div>

      <div className={styles.canvasArea} ref={containerRef}>
        {/* 底纹 (KanjiVG 数据是 109，所以 strokeWidth 设为 6-7 很合适) */}
        <svg className={styles.bgSvg} viewBox={STANDARD_VIEWBOX}>
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#e5e5ea"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* 已完成部分 */}
        <svg className={styles.bgSvg} viewBox={STANDARD_VIEWBOX}>
          {paths.map(
            (d, i) =>
              i < strokeIndex && (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#1c1c1e"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
          )}
        </svg>

        {/* 动画引导 */}
        <AnimatePresence>
          {!isFinished && paths[strokeIndex] && (
            <svg className={styles.bgSvg} viewBox={STANDARD_VIEWBOX}>
              <motion.path
                key={strokeIndex}
                d={paths[strokeIndex]}
                fill="none"
                stroke="#007aff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              />
            </svg>
          )}
        </AnimatePresence>

        <canvas
          ref={canvasRef}
          className={styles.drawCanvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={() => {
            setStrokeIndex(0);
            clearCanvas();
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
};
