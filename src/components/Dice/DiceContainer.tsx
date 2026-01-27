import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { DoubleDice } from './DoubleDice';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface DiceRollerProps {
  onRoll?: (values: number[]) => void;
  disabled?: boolean;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  onRoll,
  disabled = false,
}) => {
  // const [status, setStatus] = useState('Drag & Release!');

  useEffect(() => {
    console.log('DiceRoller mounted! 🚀');
  }, []);

  const handleResult = (vals: number[]) => {
    // const total = vals[0] + vals[1];
    // setStatus(`Rolled: ${vals[0]} + ${vals[1]} = ${total}`);
    if (onRoll) onRoll(vals);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
        touchAction: 'none',
        pointerEvents: disabled ? 'none' : 'auto',

        // 可选：稍微降低一点透明度，给用户“不可操作”的视觉暗示
        opacity: disabled ? 0.8 : 1,
        // cursor: disabled ? 'default' : 'grab',
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        orthographic
        gl={{ toneMapping: THREE.NoToneMapping }}
        camera={{
          position: [50, 50, 50],
          zoom: 15,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* 1. 环境光：大幅降低 (1.5 -> 0.4) 
            让暗部真的暗下去，才有立体感 */}
        <ambientLight intensity={0.4} />

        {/* 2. 主光源：增强 (2 -> 3.5)
            像手术灯一样打下来，制造高光 */}
        <directionalLight
          position={[10, 20, 10]}
          intensity={3.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
          // 让阴影硬一点，不要太虚
          shadow-bias={-0.0001}
        />

        {/* 3. 侧逆光/轮廓光：稍微亮一点，勾勒边缘 */}
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="white" />

        {/* <Environment preset="city" /> */}

        {/* 调试地板：如果能看到红色网格，说明渲染成功了 */}
        {/* <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="red" wireframe opacity={0.1} transparent />
        </mesh> */}

        <DoubleDice onResult={handleResult} disabled={disabled} />

        <OrbitControls
          target={[0, 0, 0]}
          enableZoom={false} /* 禁止缩放 */
          enableRotate={false} /* 禁止旋转 */
          enablePan={false} /* 禁止平移 */
        />
      </Canvas>

      {/* <div
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
      </div> */}
    </div>
  );
};
