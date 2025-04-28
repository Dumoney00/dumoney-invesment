
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
      rotationIntensity={0.5} 
      floatIntensity={0.5}
      position={[index * 4 - 8, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial 
          color={tier.level === 'crown' ? '#FFD700' : '#1A1F2C'} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Center position={[0, 1, 0.15]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          {tier.name}
          <meshStandardMaterial color={tier.level === 'crown' ? '#ffffff' : '#F97316'} />
        </Text3D>
      </Center>
      <Center position={[0, 0, 0.15]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.3}
          height={0.1}
          curveSegments={12}
        >
          {`${tier.bonusPercentage}%`}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </Center>
      <Center position={[0, -0.5, 0.15]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.1}
          curveSegments={12}
        >
          {tier.benefits[0]}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </Center>
    </Float>
  );
};

const Scene = ({ tiers }: ReferralTiers3DProps) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {tiers.map((tier, index) => (
        <TierCard key={tier.level} tier={tier} index={index} />
      ))}
      <OrbitControls 
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const ReferralTiers3D: React.FC<ReferralTiers3DProps> = ({ tiers }) => {
  return (
    <Card className="w-full h-[400px] bg-[#0a0a0a] overflow-hidden border-gray-800">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400">Loading 3D View...</div>}>
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <Scene tiers={tiers} />
        </Canvas>
      </Suspense>
    </Card>
  );
};

export default ReferralTiers3D;
