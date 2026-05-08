import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, SpotLight } from '@react-three/drei'
import * as THREE from 'three'
import { FallbackGeometry, type CarModelType } from './FallbackGeometry'

interface HomepageSceneProps {
  accentColor: string
  scrollProgress: number
  scaleProgress: number
  opacityProgress: number
  modelType?: CarModelType
}

function SceneContent({ accentColor, scrollProgress, scaleProgress, modelType }: {
  accentColor: string
  scrollProgress: number
  scaleProgress: number
  modelType?: CarModelType
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.003 + scrollProgress * 0.02
  })

  return (
    <group ref={groupRef} scale={[scaleProgress, scaleProgress, scaleProgress]}>
      <FallbackGeometry accentColor={accentColor} scrollRotation={scrollProgress} modelType={modelType} />
    </group>
  )
}

export function HomepageScene({ accentColor, scrollProgress, scaleProgress, opacityProgress, modelType }: HomepageSceneProps) {
  return (
    <div style={{ opacity: opacityProgress, transition: 'opacity 0.1s linear' }} className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        aria-label="3D BMW M model"
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 3]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-4, -2, 2]} intensity={0.8} color="#4488ff" />
        <directionalLight position={[0, 2, -5]} intensity={1.2} color="#ff2244" />
        <SpotLight
          position={[0, 8, 0]}
          angle={0.4}
          penumbra={0.6}
          intensity={0.6}
          attenuation={5}
          anglePower={4}
        />
        <Environment preset="studio" />

        <Suspense fallback={null}>
          <SceneContent
            accentColor={accentColor}
            scrollProgress={scrollProgress}
            scaleProgress={scaleProgress}
            modelType={modelType}
          />
        </Suspense>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  )
}
