import React from 'react';
import { DiceRoller } from '../components/Dice/DiceContainer'; // 👈 确保路径对应你刚才保存的位置
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // 假设你装了 lucide-react，或者用文本 "<" 代替

export const DicePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: '#f0f9ff', // 浅蓝背景
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 简单的顶部导航栏 */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginRight: '8px',
          }}
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          Level 1 Challenge
        </h2>
      </div>

      {/* 3D 骰子区域 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <DiceRoller />
      </div>
    </div>
  );
};
