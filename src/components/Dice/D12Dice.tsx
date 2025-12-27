import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// import { Text } from '@react-three/drei'; // ❌ 暂时注释掉

// 预计算的向量
const FACE_VECTORS = [
  [0, 0.526, 0.851],
  [0, 0.526, -0.851],
  [0, -0.526, 0.851],
  [0, -0.526, -0.851],
  [0.851, 0, 0.526],
  [0.851, 0, -0.526],
  [-0.851, 0, 0.526],
  [-0.851, 0, -0.526],
  [0.526, 0.851, 0],
  [0.526, -0.851, 0],
  [-0.526, 0.851, 0],
  [-0.526, -0.851, 0],
].map((v) => new THREE.Vector3(...v).normalize());

interface DiceProps {
  rolling: boolean;
  result?: number | null;
}

export const D12Dice: React.FC<DiceProps> = ({ rolling }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (rolling) {
      meshRef.current.rotation.x += delta * 10;
      meshRef.current.rotation.y += delta * 7;
    } else {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#6366f1" />

        {/* 暂时用黑色小球代替文字，避免字体加载导致的崩溃 */}
        {FACE_VECTORS.map((vec, i) => (
          <mesh key={i} position={vec.clone().multiplyScalar(1.5)}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
        ))}
      </mesh>
    </group>
  );
};
