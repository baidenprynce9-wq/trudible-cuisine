
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FoodScene() {
  const plate = useRef<THREE.Group>(null);
  const food = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (plate.current) {
      plate.current.rotation.y += delta * 0.12;
      plate.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.035;
    }

    if (food.current) {
      food.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 5]} intensity={3} />
      <pointLight position={[-4, 2, 3]} intensity={2} color="#9baf9a" />

      <group ref={plate} rotation={[-0.3, 0, 0]}>
        {/* Main plate */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[2, 1.9, 0.18, 96]} />
          <meshStandardMaterial color="#f8f5ec" roughness={0.24} />
        </mesh>

        {/* Plate centre */}
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[1.65, 1.65, 0.025, 96]} />
          <meshStandardMaterial color="#dce4d8" roughness={0.4} />
        </mesh>

        <group ref={food}>
          {/* Yam */}
          {[-0.7, -0.2, 0.3].map((x, i) => (
            <mesh
              key={i}
              position={[x, 0.02, -0.45 + i * 0.12]}
              rotation={[0.1, 0.2, 0.1]}
            >
              <cylinderGeometry args={[0.24, 0.24, 0.8, 32]} />
              <meshStandardMaterial color="#e8d5a9" roughness={0.8} />
            </mesh>
          ))}

          {/* Plantain */}
          <mesh position={[0.65, 0.08, 0.45]} rotation={[0, 0, -0.5]}>
            <capsuleGeometry args={[0.2, 0.8, 8, 20]} />
            <meshStandardMaterial color="#d5b45f" roughness={0.65} />
          </mesh>

          {/* Garden egg stew */}
          <mesh position={[-0.55, 0.08, 0.5]}>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial color="#a64d35" roughness={0.65} />
          </mesh>

          {/* Floating avocado */}
          <Float speed={2} rotationIntensity={0.6} floatIntensity={0.7}>
            <mesh position={[1.35, 0.9, 0.1]}>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial color="#77966b" roughness={0.5} />
            </mesh>
          </Float>

          {/* Floating plantain ingredient */}
          <Float speed={1.6} rotationIntensity={0.7} floatIntensity={0.8}>
            <mesh position={[-1.4, 0.85, 0.3]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#d5b45f" roughness={0.6} />
            </mesh>
          </Float>
        </group>
      </group>

      <ContactShadows
        position={[0, -0.55, 0]}
        opacity={0.3}
        scale={5}
        blur={2}
      />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 5.5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <FoodScene />
    </Canvas>
  );
}
