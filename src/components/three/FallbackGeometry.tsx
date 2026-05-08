import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type CarModelType = 'sedan' | 'coupe' | 'suv' | 'grancoupe' | 'roadster' | 'default'

interface FallbackGeometryProps {
  accentColor?: string
  scrollRotation?: number
  modelType?: CarModelType
  autoRotate?: boolean
}

interface CarDimensions {
  bodyLength: number
  bodyHeight: number
  bodyWidth: number
  cabinLength: number
  cabinHeight: number
  cabinOffsetY: number
  cabinOffsetX: number
  roofAngle: number
  groundOffset: number
  wheelbase: number
  wheelRadius: number
  wheelWidth: number
}

function getDimensions(type: CarModelType): CarDimensions {
  switch (type) {
    case 'coupe':
      return {
        bodyLength: 4.0, bodyHeight: 0.52, bodyWidth: 1.75,
        cabinLength: 2.0, cabinHeight: 0.48, cabinOffsetY: 0.5, cabinOffsetX: -0.1,
        roofAngle: Math.PI / 7,
        groundOffset: -0.42, wheelbase: 1.3,
        wheelRadius: 0.32, wheelWidth: 0.13,
      }
    case 'suv':
      return {
        bodyLength: 4.6, bodyHeight: 0.85, bodyWidth: 2.0,
        cabinLength: 2.8, cabinHeight: 0.72, cabinOffsetY: 0.78, cabinOffsetX: 0,
        roofAngle: Math.PI / 14,
        groundOffset: -0.6, wheelbase: 1.55,
        wheelRadius: 0.4, wheelWidth: 0.16,
      }
    case 'grancoupe':
      return {
        bodyLength: 4.4, bodyHeight: 0.54, bodyWidth: 1.82,
        cabinLength: 2.6, cabinHeight: 0.46, cabinOffsetY: 0.5, cabinOffsetX: -0.05,
        roofAngle: Math.PI / 8,
        groundOffset: -0.44, wheelbase: 1.4,
        wheelRadius: 0.34, wheelWidth: 0.14,
      }
    case 'roadster':
      return {
        bodyLength: 3.8, bodyHeight: 0.44, bodyWidth: 1.72,
        cabinLength: 1.6, cabinHeight: 0.28, cabinOffsetY: 0.36, cabinOffsetX: 0.1,
        roofAngle: Math.PI / 5,
        groundOffset: -0.38, wheelbase: 1.2,
        wheelRadius: 0.3, wheelWidth: 0.13,
      }
    case 'sedan':
      return {
        bodyLength: 4.3, bodyHeight: 0.6, bodyWidth: 1.82,
        cabinLength: 2.5, cabinHeight: 0.55, cabinOffsetY: 0.57, cabinOffsetX: 0,
        roofAngle: Math.PI / 10,
        groundOffset: -0.44, wheelbase: 1.4,
        wheelRadius: 0.34, wheelWidth: 0.14,
      }
    default:
      return {
        bodyLength: 4.2, bodyHeight: 0.6, bodyWidth: 1.8,
        cabinLength: 2.4, cabinHeight: 0.55, cabinOffsetY: 0.55, cabinOffsetX: 0,
        roofAngle: Math.PI / 10,
        groundOffset: -0.4, wheelbase: 1.4,
        wheelRadius: 0.35, wheelWidth: 0.14,
      }
  }
}

export function FallbackGeometry({
  accentColor = '#1C69D4',
  scrollRotation = 0,
  modelType = 'default',
  autoRotate = true,
}: FallbackGeometryProps) {
  const groupRef = useRef<THREE.Group>(null)
  const d = useMemo(() => getDimensions(modelType), [modelType])

  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return
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
    transmission: 0.85,
    transparent: true,
    opacity: 0.3,
  }), [])

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8C8C8',
    metalness: 1.0,
    roughness: 0.05,
  }), [])

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    metalness: 0.6,
    roughness: 0.4,
  }), [])

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#909090',
    metalness: 0.95,
    roughness: 0.08,
  }), [])

  const tailMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.6,
    metalness: 0.2,
    roughness: 0.5,
  }), [accentColor])

  const halfW = d.bodyWidth / 2
  const halfL = d.bodyLength / 2
  const isRoadster = modelType === 'roadster'

  return (
    <group ref={groupRef} position={[0, d.groundOffset + 0.4, 0]}>
      {/* Main body */}
      <mesh material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[d.bodyLength, d.bodyHeight, d.bodyWidth]} />
      </mesh>

      {/* Front hood slope */}
      <mesh
        position={[halfL * 0.55, d.bodyHeight * 0.3, 0]}
        rotation={[0, 0, Math.PI / 14]}
        material={bodyMaterial}
        castShadow
      >
        <boxGeometry args={[halfL * 0.7, d.bodyHeight * 0.15, d.bodyWidth * 0.95]} />
      </mesh>

      {/* Cabin */}
      {!isRoadster && (
        <mesh
          position={[d.cabinOffsetX, d.cabinOffsetY, 0]}
          material={bodyMaterial}
          castShadow
        >
          <boxGeometry args={[d.cabinLength, d.cabinHeight, d.bodyWidth * 0.92]} />
        </mesh>
      )}

      {/* Roadster low cockpit */}
      {isRoadster && (
        <mesh position={[0.15, 0.36, 0]} material={bodyMaterial} castShadow>
          <boxGeometry args={[1.4, 0.28, d.bodyWidth * 0.85]} />
        </mesh>
      )}

      {/* Windshield */}
      <mesh
        position={[d.cabinOffsetX + d.cabinLength * 0.42, d.cabinOffsetY + 0.04, 0]}
        rotation={[0, 0, Math.PI / 5]}
        material={glassMaterial}
      >
        <boxGeometry args={[0.04, d.cabinHeight * 0.9, d.bodyWidth * 0.88]} />
      </mesh>

      {/* Rear glass (not for roadster) */}
      {!isRoadster && (
        <mesh
          position={[d.cabinOffsetX - d.cabinLength * 0.42, d.cabinOffsetY + 0.04, 0]}
          rotation={[0, 0, -(modelType === 'grancoupe' ? Math.PI / 4.5 : Math.PI / 5.5)]}
          material={glassMaterial}
        >
          <boxGeometry args={[0.04, d.cabinHeight * 0.85, d.bodyWidth * 0.86]} />
        </mesh>
      )}

      {/* Side windows */}
      <mesh position={[d.cabinOffsetX, d.cabinOffsetY + 0.1, halfW * 0.97]} material={glassMaterial}>
        <boxGeometry args={[d.cabinLength * 0.82, d.cabinHeight * 0.65, 0.02]} />
      </mesh>
      <mesh position={[d.cabinOffsetX, d.cabinOffsetY + 0.1, -halfW * 0.97]} material={glassMaterial}>
        <boxGeometry args={[d.cabinLength * 0.82, d.cabinHeight * 0.65, 0.02]} />
      </mesh>

      {/* Front bumper accent */}
      <mesh position={[halfL + 0.02, -d.bodyHeight * 0.1, 0]} material={accentMaterial}>
        <boxGeometry args={[0.05, 0.08, d.bodyWidth * 0.78]} />
      </mesh>

      {/* Front kidney grille */}
      <mesh position={[halfL + 0.03, d.bodyHeight * 0.18, 0.28]} material={bodyMaterial}>
        <boxGeometry args={[0.08, 0.22, 0.3]} />
      </mesh>
      <mesh position={[halfL + 0.03, d.bodyHeight * 0.18, -0.28]} material={bodyMaterial}>
        <boxGeometry args={[0.08, 0.22, 0.3]} />
      </mesh>

      {/* Rear diffuser */}
      <mesh position={[-halfL - 0.02, -d.bodyHeight * 0.15, 0]} material={accentMaterial}>
        <boxGeometry args={[0.06, 0.1, d.bodyWidth * 0.7]} />
      </mesh>

      {/* Side skirts */}
      <mesh position={[0, -d.bodyHeight * 0.38, halfW + 0.02]} material={accentMaterial}>
        <boxGeometry args={[d.bodyLength * 0.78, 0.1, 0.06]} />
      </mesh>
      <mesh position={[0, -d.bodyHeight * 0.38, -halfW - 0.02]} material={accentMaterial}>
        <boxGeometry args={[d.bodyLength * 0.78, 0.1, 0.06]} />
      </mesh>

      {/* Headlights */}
      <mesh position={[halfL + 0.03, d.bodyHeight * 0.06, halfW * 0.62]} material={chromeMaterial}>
        <boxGeometry args={[0.05, 0.16, 0.44]} />
      </mesh>
      <mesh position={[halfL + 0.03, d.bodyHeight * 0.06, -halfW * 0.62]} material={chromeMaterial}>
        <boxGeometry args={[0.05, 0.16, 0.44]} />
      </mesh>

      {/* Taillights — emissive */}
      <mesh position={[-halfL - 0.02, d.bodyHeight * 0.06, halfW * 0.62]} material={tailMaterial}>
        <boxGeometry args={[0.04, 0.15, 0.5]} />
      </mesh>
      <mesh position={[-halfL - 0.02, d.bodyHeight * 0.06, -halfW * 0.62]} material={tailMaterial}>
        <boxGeometry args={[0.04, 0.15, 0.5]} />
      </mesh>

      {/* M badge front */}
      <mesh position={[halfL + 0.05, d.bodyHeight * 0.25, 0]} material={chromeMaterial}>
        <circleGeometry args={[0.09, 16]} />
      </mesh>

      {/* Exhaust tips (rear, 2 or 4) */}
      {[halfW * 0.4, halfW * 0.62].map((z, i) => (
        <mesh key={i} position={[-halfL - 0.03, -d.bodyHeight * 0.3, z]} material={chromeMaterial}>
          <cylinderGeometry args={[0.05, 0.045, 0.08, 8]} />
        </mesh>
      ))}
      {modelType !== 'suv' && [-halfW * 0.4, -halfW * 0.62].map((z, i) => (
        <mesh key={i} position={[-halfL - 0.03, -d.bodyHeight * 0.3, z]} material={chromeMaterial}>
          <cylinderGeometry args={[0.05, 0.045, 0.08, 8]} />
        </mesh>
      ))}

      {/* Wheels */}
      {([
        [d.wheelbase, d.groundOffset - 0.4 + 0.02, halfW * 0.96],
        [d.wheelbase, d.groundOffset - 0.4 + 0.02, -halfW * 0.96],
        [-d.wheelbase, d.groundOffset - 0.4 + 0.02, halfW * 0.96],
        [-d.wheelbase, d.groundOffset - 0.4 + 0.02, -halfW * 0.96],
      ] as [number, number, number][]).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh material={wheelMaterial} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[d.wheelRadius, d.wheelWidth, 16, 32]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={rimMaterial}>
            <cylinderGeometry args={[d.wheelRadius * 0.68, d.wheelRadius * 0.68, d.wheelWidth * 1.3, 14]} />
          </mesh>
          {/* 5-spoke rims */}
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh
              key={j}
              material={rimMaterial}
              rotation={[Math.PI / 2, (j * Math.PI * 2) / 5, 0]}
            >
              <boxGeometry args={[0.035, d.wheelRadius * 0.95, 0.055]} />
            </mesh>
          ))}
          {/* Center cap accent */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, d.wheelWidth * 1.5, 8]} />
            <meshStandardMaterial color={accentColor} metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
      ))}

      {/* SUV roof rails */}
      {modelType === 'suv' && (
        <>
          <mesh position={[0, d.cabinOffsetY + d.cabinHeight * 0.6, halfW * 0.82]} material={chromeMaterial}>
            <boxGeometry args={[d.cabinLength * 0.85, 0.05, 0.05]} />
          </mesh>
          <mesh position={[0, d.cabinOffsetY + d.cabinHeight * 0.6, -halfW * 0.82]} material={chromeMaterial}>
            <boxGeometry args={[d.cabinLength * 0.85, 0.05, 0.05]} />
          </mesh>
        </>
      )}

      {/* Roof antenna */}
      {!isRoadster && (
        <mesh position={[-d.cabinLength * 0.2, d.cabinOffsetY + d.cabinHeight * 0.6, 0]} material={chromeMaterial}>
          <cylinderGeometry args={[0.009, 0.009, 0.28, 4]} />
        </mesh>
      )}

      {/* Ground shadow */}
      <mesh position={[0, d.groundOffset - 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[d.bodyLength + 1.5, d.bodyWidth + 1]} />
        <shadowMaterial opacity={0.35} />
      </mesh>
    </group>
  )
}
