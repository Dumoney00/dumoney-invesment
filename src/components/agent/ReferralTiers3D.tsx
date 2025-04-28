
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import { ReferralTier } from '@/types/referrals';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';

interface ReferralTiers3DProps {
  tiers: ReferralTier[];
}

const TierCard = ({ tier, index }: { tier: ReferralTier; index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Add subtle animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });
  
  // Determine if this is the crown tier that has multiple benefits
  const hasTwoBenefits = tier.benefits.length > 1;
  const isSpecialTier = tier.level === 'crown';
  const cardColor = isSpecialTier ? '#FFD700' : '#1A1F2C';
  const textColor = isSpecialTier ? '#ffffff' : '#F97316';
  
  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.8}
      floatIntensity={0.8}
      position={[index * 4 - 8, 0, 0]}
    >
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 4.8, 0.3]} />
        <meshStandardMaterial 
          color={cardColor}
          metalness={0.9}
          roughness={0.1}
          emissive={cardColor}
          emissiveIntensity={isSpecialTier ? 0.3 : 0.1}
        />
      </mesh>

      <Center position={[0, 1.5, 0.2]}>
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
            color={textColor} 
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>

      <Center position={[0, 0.5, 0.2]}>
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

      <Center position={[0, -0.6, 0.2]}>
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

      {hasTwoBenefits && (
        <Center position={[0, -1.2, 0.2]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.25}
            height={0.1}
            curveSegments={32}
          >
            {tier.benefits[1]}
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.6}
              roughness={0.4}
            />
          </Text3D>
        </Center>
      )}

      <Center position={[0, -2, 0.2]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.22}
          height={0.05}
          curveSegments={16}
        >
          {`${tier.minReferrals}+ Referrals`}
          <meshStandardMaterial 
            color="#a3a3a3" 
            metalness={0.4}
            roughness={0.6}
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
      <pointLight position={[-10, -10, -10]} intensity={0.7} color="#6366f1" />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#f59e0b" />
      
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
    <Card className="w-full h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden border-gray-800 shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_70%)]"></div>
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
