import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

function Block({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

export default function Home() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="w-screen h-full overflow-hidden relative">
      <Canvas
        className="w-screen h-screen"
        camera={{
          position: [0, 0, isMobile ? 8 : 6],
          fov: isMobile ? 75 : 60,
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={isMobile ? 0.7 : 1} />
        <Environment preset="city" />

        <Block position={[-2, 0, 0]} color="#14F195" />
        <Block position={[2, 0, 0]} color="#9945FF" />
        <Block position={[0, 2, -1]} color="#00FFA3" />
        <Block position={[0, -2, -1]} color="#FFD700" />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={isMobile ? 2.5 : 4}
          enablePan={!isMobile}
        />
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className={`font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg ${isMobile ? "text-3xl" : "text-5xl"}`}>
          🚀 Welcome to SolanaFun
        </h1>
        <p className={`mt-4 text-gray-300 max-w-2xl ${isMobile ? "text-base px-2" : "text-lg"}`}>
          Explore interactive Solana dApps — Tip creators, climb the leaderboard, and play with on-chain fun!
        </p>
      </div>
    </div>
  );
}

