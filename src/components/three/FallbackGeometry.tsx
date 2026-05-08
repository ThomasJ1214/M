import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FallbackGeometryProps {
  accentColor?: string
  scrollRotation?: number
}

export function FallbackGeometry({ accentColor = '#1C69D4', scrollRotation = 0 }: FallbackGeometryProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.003 + scrollRotation * 0.001
  })

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1A1A1A',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5,
  }), [])

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor,
    metalness: 0.8,
    roughness: 0.2,
    emissive: accentColor,
    emissiveIntensity: 0.15,
  }), [accentColor])

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#7799AA',
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.9,
    transparent: true,
    opacity: 0.35,
  }), [])

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C0C0C0',
    metalness: 1.0,
    roughness: 0.05,
  }), [])

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    metalness: 0.6,
    roughness: 0.4,
  }), [])

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#888888',
    metalness: 0.9,
    roughness: 0.1,
  }), [])

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Main body */}
      <mesh material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.6, 1.8]} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.55, 0]} material={bodyMaterial} castShadow>
        <boxGeometry args={[2.4, 0.55, 1.6]} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.6, 0.7, 0]} rotation={[0, 0, Math.PI / 6]} material={glassMaterial}>
        <boxGeometry args={[0.05, 0.7, 1.45]} />
      </mesh>

      {/* Rear glass */}
      <mesh position={[-0.6, 0.7, 0]} rotation={[0, 0, -Math.PI / 6]} material={glassMaterial}>
        <boxGeometry args={[0.05, 0.7, 1.45]} />
      </mesh>

      {/* Side windows */}
      <mesh position={[0, 0.75, 0.81]} material={glassMaterial}>
        <boxGeometry args={[2.0, 0.4, 0.02]} />
      </mesh>
      <mesh position={[0, 0.75, -0.81]} material={glassMaterial}>
        <boxGeometry args={[2.0, 0.4, 0.02]} />
      </mesh>

      {/* Front bumper accent stripe */}
      <mesh position={[2.05, -0.1, 0]} material={accentMaterial}>
        <boxGeometry args={[0.05, 0.08, 1.4]} />
      </mesh>

      {/* Rear diffuser accent */}
      <mesh position={[-2.05, -0.15, 0]} material={accentMaterial}>
        <boxGeometry args={[0.08, 0.12, 1.3]} />
      </mesh>

      {/* Side skirts */}
      <mesh position={[0, -0.22, 0.92]} material={accentMaterial}>
        <boxGeometry args={[3.5, 0.12, 0.08]} />
      </mesh>
      <mesh position={[0, -0.22, -0.92]} material={accentMaterial}>
        <boxGeometry args={[3.5, 0.12, 0.08]} />
      </mesh>

      {/* Headlights */}
      <mesh position={[2.1, 0.05, 0.55]} material={chromeMaterial}>
        <boxGeometry args={[0.05, 0.18, 0.5]} />
      </mesh>
      <mesh position={[2.1, 0.05, -0.55]} material={chromeMaterial}>
        <boxGeometry args={[0.05, 0.18, 0.5]} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-2.1, 0.05, 0.55]}>
        <boxGeometry args={[0.05, 0.18, 0.5]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2.1, 0.05, -0.55]}>
        <boxGeometry args={[0.05, 0.18, 0.5]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>

      {/* M badge */}
      <mesh position={[2.12, 0.22, 0]} material={chromeMaterial}>
        <circleGeometry args={[0.1, 16]} />
      </mesh>

      {/* Hood scoop / kidney grille area */}
      <mesh position={[2.05, 0.12, 0]} material={bodyMaterial}>
        <boxGeometry args={[0.1, 0.24, 0.7]} />
      </mesh>

      {/* Wheels */}
      {[
        [1.4, -0.38, 1.0],
        [1.4, -0.38, -1.0],
        [-1.4, -0.38, 1.0],
        [-1.4, -0.38, -1.0],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Tire */}
          <mesh material={wheelMaterial} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.35, 0.14, 16, 32]} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={rimMaterial}>
            <cylinderGeometry args={[0.24, 0.24, 0.22, 12]} />
          </mesh>
          {/* Spokes */}
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh
              key={j}
              material={rimMaterial}
              rotation={[Math.PI / 2, (j * Math.PI * 2) / 5, 0]}
            >
              <boxGeometry args={[0.04, 0.36, 0.06]} />
            </mesh>
          ))}
          {/* Center cap */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
            <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Roof antenna */}
      <mesh position={[-0.4, 1.05, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 4]} />
      </mesh>

      {/* Ground shadow plane */}
      <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </group>
  )
}
