
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import { ReferralTier } from '@/types/referrals';
import { Card } from '@/components/ui/card';

interface ReferralTiers3DProps {
  tiers: ReferralTier[];
}

const TierCard = ({ tier, index }: { tier: ReferralTier; index: number }) => {
  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.8}
      floatIntensity={0.8}
      position={[index * 4 - 8, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[3, 4.5, 0.3]} />
        <meshStandardMaterial 
          color={tier.level === 'crown' ? '#FFD700' : '#1A1F2C'}
          metalness={0.9}
          roughness={0.1}
          emissive={tier.level === 'crown' ? '#FFD700' : '#1A1F2C'}
          emissiveIntensity={0.2}
        />
      </mesh>

      <Center position={[0, 1.2, 0.2]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={32}
          bevelEnabled
          bevelSize={0.02}
          bevelThickness={0.02}
        >
          {tier.name}
          <meshStandardMaterial 
            color={tier.level === 'crown' ? '#ffffff' : '#F97316'} 
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>

      <Center position={[0, 0.2, 0.2]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.6}
          height={0.1}
          curveSegments={32}
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.01}
        >
          {`${tier.bonusPercentage}%`}
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>

      <Center position={[0, -0.8, 0.2]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.25}
          height={0.1}
          curveSegments={32}
        >
          {tier.benefits[0]}
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.6}
            roughness={0.4}
          />
        </Text3D>
      </Center>
    </Float>
  );
};

const Scene = ({ tiers }: ReferralTiers3DProps) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      {tiers.map((tier, index) => (
        <TierCard key={tier.level} tier={tier} index={index} />
      ))}
      
      <OrbitControls 
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const ReferralTiers3D: React.FC<ReferralTiers3DProps> = ({ tiers }) => {
  return (
    <Card className="w-full h-[500px] bg-gradient-to-br from-gray-900 to-black overflow-hidden border-gray-800">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Loading 3D View...
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
          <Scene tiers={tiers} />
        </Canvas>
      </Suspense>
    </Card>
  );
};

export default ReferralTiers3D;
