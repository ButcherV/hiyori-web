import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { D12Dice } from './D12Dice';
import { OrbitControls } from '@react-three/drei'; // 移除了 Environment

export const DiceRoller = () => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);

    setTimeout(() => {
      setRolling(false);
      const newResult = Math.floor(Math.random() * 12);
      setResult(newResult);
      console.log('Rolled:', newResult === 11 ? '⭐️' : newResult);
    }, 1500);
  };

  return (
    // 调试用：加个深色背景，确保容器本身有高度
    <div
      style={{
        width: '100%',
        height: '300px',
        position: 'relative',
        background: '#e0e7ff',
        borderRadius: '16px',
      }}
    >
      {/* 降低像素比 dpr，防止手机显存爆炸 */}
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
        {/* 1. 基础环境光 */}
        <ambientLight intensity={0.7} />
        {/* 2. 定向光 (替代 SpotLight，计算更便宜) */}
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        {/* ❌ 暂时移除 Environment，因为它需要联网下载 huge HDR 文件 */}
        {/* <Environment preset="city" /> */}

        <D12Dice rolling={rolling} result={result} />
        <OrbitControls enableZoom={false} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <button
          onClick={handleRoll}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            background: rolling ? '#ccc' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {rolling ? 'Rolling...' : 'Roll Dice 🎲'}
        </button>
      </div>
    </div>
  );
};
