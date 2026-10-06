import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";
import type { Product } from "@/data/products";

function Shape({ shape, color }: { shape: Product["shape"]; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.4; });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} castShadow>
        {shape === "torus" && <torusGeometry args={[1, 0.38, 64, 128]} />}
        {shape === "box" && <boxGeometry args={[1.5, 1.5, 1.5, 8, 8, 8]} />}
        {shape === "sphere" && <icosahedronGeometry args={[1.3, 12]} />}
        {shape === "knot" && <torusKnotGeometry args={[0.9, 0.3, 200, 32]} />}
        {shape === "cone" && <octahedronGeometry args={[1.4, 0]} />}
        <MeshDistortMaterial color={color} metalness={0.85} roughness={0.15} distort={shape === "sphere" ? 0.3 : 0.12} speed={2} />
      </mesh>
    </Float>
  );
}

export default function ProductScene({ shape = "knot", color = "#06b6d4", controls = true }: { shape?: Product["shape"]; color?: string; controls?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={60} color="#06b6d4" />
      <pointLight position={[-4, -2, 2]} intensity={50} color="#8b5cf6" />
      <Shape shape={shape} color={color} />
      <Environment preset="city" />
      {controls && <OrbitControls enableZoom={false} enablePan={false} />}
    </Canvas>
  );
}
