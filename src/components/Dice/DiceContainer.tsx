import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { DoubleDice } from './DoubleDice';
// ❌ 删除 Environment 的引用，防止去国外 CDN 下载
import { OrbitControls } from '@react-three/drei';

interface DiceRollerProps {
  onRoll?: (total: number, values: number[]) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll }) => {
  const [status, setStatus] = useState('Drag & Release!');

  useEffect(() => {
    console.log('DiceRoller mounted! 🚀');
  }, []);

  const handleResult = (vals: number[]) => {
    const total = vals[0] + vals[1];
    setStatus(`Rolled: ${vals[0]} + ${vals[1]} = ${total}`);
    if (onRoll) onRoll(total, vals);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '40vh',
        position: 'relative',
        background: '#F6F3EB',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
        touchAction: 'none',
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        orthographic
        camera={{
          position: [50, 50, 50],
          zoom: 15,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* 1. 增强环境光：因为去掉了 Environment，这里要亮一点 */}
        <ambientLight intensity={1.5} />

        {/* 2. 主光源：模拟太阳光 */}
        <directionalLight
          position={[10, 20, 10]}
          intensity={2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* 3. 补光灯：防止背光面太黑 */}
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#818cf8"
        />

        {/* ❌ 彻底删除这行，它就是罪魁祸首 */}
        {/* <Environment preset="city" /> */}

        {/* 调试地板：如果能看到红色网格，说明渲染成功了 */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="red" wireframe opacity={0.1} transparent />
        </mesh>

        <DoubleDice onResult={handleResult} />

        <OrbitControls target={[0, 0, 0]} enableZoom={true} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '15px',
          width: '100%',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
            color: '#725349',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {status}
        </div>
      </div>
    </div>
  );
};
