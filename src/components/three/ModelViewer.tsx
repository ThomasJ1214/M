import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  SpotLight,
  useGLTF,
  PresentationControls,
} from '@react-three/drei'
import * as THREE from 'three'
import { FallbackGeometry } from './FallbackGeometry'
import { useIdleDetection } from '@/hooks/useIdleDetection'

interface ModelProps {
  path: string
  paintColor: string
  scrollRotation: number
  isExploded: boolean
  onLoad?: () => void
}

function GLBModel({ path, paintColor, scrollRotation, isExploded, onLoad }: ModelProps) {
  const { scene } = useGLTF(path)
  const groupRef = useRef<THREE.Group>(null)
  const baseRotation = useRef(0)
  const bodyParts = useRef<THREE.Mesh[]>([])
  const originalPositions = useRef<Map<THREE.Mesh, THREE.Vector3>>(new Map())

  useEffect(() => {
    if (!scene) return
    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        meshes.push(mesh)
        originalPositions.current.set(mesh, mesh.position.clone())

        // Apply paint color to main body
        if (mesh.name.toLowerCase().includes('body') ||
            mesh.name.toLowerCase().includes('paint') ||
            mesh.name.toLowerCase().includes('exterior')) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
          mat.color.set(paintColor)
          mesh.material = mat
        }
      }
    })
    bodyParts.current = meshes
    scene.castShadow = true
    onLoad?.()
  }, [scene, paintColor, onLoad])

  // Exploded view animation
  useEffect(() => {
    if (!bodyParts.current.length) return
    bodyParts.current.forEach((mesh, i) => {
      const orig = originalPositions.current.get(mesh)
      if (!orig) return
      if (isExploded) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2
        )
        mesh.position.copy(orig.clone().add(offset))
      } else {
        mesh.position.copy(orig)
      }
    })
  }, [isExploded])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    baseRotation.current += delta * 0.003
    groupRef.current.rotation.y = baseRotation.current + scrollRotation * Math.PI * 2
  })

  // Normalize model scale/position
  useEffect(() => {
    if (!scene || !groupRef.current) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3.5 / maxDim
    scene.scale.setScalar(scale)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center.multiplyScalar(scale))
  }, [scene])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function ModelScene({
  modelPath,
  paintColor,
  scrollRotation,
  isExploded,
  orbitEnabled,
  onLoad,
}: {
  modelPath: string
  paintColor: string
  scrollRotation: number
  isExploded: boolean
  orbitEnabled: boolean
  onLoad?: () => void
}) {
  const [useFallback, setUseFallback] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const baseRotation = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current || orbitEnabled) return
    baseRotation.current += delta * 0.003
    groupRef.current.rotation.y = baseRotation.current + scrollRotation * Math.PI * 2
  })

  if (useFallback) {
    return (
      <>
        <group ref={groupRef}>
          <FallbackGeometry accentColor={paintColor} scrollRotation={scrollRotation} />
        </group>
        {orbitEnabled && <OrbitControls enableZoom={false} enablePan={false} />}
      </>
    )
  }

  return (
    <>
      <Suspense fallback={
        <group ref={groupRef}>
          <FallbackGeometry accentColor={paintColor} scrollRotation={scrollRotation} />
        </group>
      }>
        <GLBModel
          path={modelPath}
          paintColor={paintColor}
          scrollRotation={scrollRotation}
          isExploded={isExploded}
          onLoad={onLoad}
        />
      </Suspense>
      {orbitEnabled && <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />}
    </>
  )
}

interface ModelViewerProps {
  modelPath: string
  paintColor?: string
  scrollRotation?: number
  height?: string | number
  interactive?: boolean
  onScreenshot?: () => void
  className?: string
}

export function ModelViewer({
  modelPath,
  paintColor = '#1A1A1A',
  scrollRotation = 0,
  height = '100%',
  interactive = false,
  className = '',
}: ModelViewerProps) {
  const [orbitEnabled, setOrbitEnabled] = useState(false)
  const [isExploded, setIsExploded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbitTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const handleHover = () => {
    if (!interactive) return
    setOrbitEnabled(true)
    clearTimeout(orbitTimerRef.current)
    orbitTimerRef.current = setTimeout(() => setOrbitEnabled(false), 3000)
  }

  useIdleDetection(
    30000,
    () => {}, // idle — GSAP camera animation handled inside canvas
    () => setOrbitEnabled(false)
  )

  const handleScreenshot = () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bmw-m-showcase.png'
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ height }}
      onMouseEnter={handleHover}
      onMouseLeave={() => clearTimeout(orbitTimerRef.current)}
    >
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        aria-label="Interactive 3D BMW M car viewer"
      >
        {/* Lighting Rig */}
        <ambientLight intensity={0.3} />
        {/* Key light — upper right, white */}
        <directionalLight
          position={[5, 8, 3]}
          intensity={2.5}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        {/* Fill light — lower left, blue-tinted */}
        <directionalLight position={[-4, -2, 2]} intensity={0.8} color="#4488ff" />
        {/* Rim light — behind, M-red tinted */}
        <directionalLight position={[0, 2, -5]} intensity={1.2} color="#ff2244" />
        {/* Ground spotlight */}
        <SpotLight
          position={[0, 8, 0]}
          angle={0.4}
          penumbra={0.6}
          intensity={0.8}
          color="#ffffff"
          castShadow
          attenuation={5}
          anglePower={4}
        />

        <Environment preset="studio" />

        <ModelScene
          modelPath={modelPath}
          paintColor={paintColor}
          scrollRotation={scrollRotation}
          isExploded={isExploded}
          orbitEnabled={orbitEnabled}
        />

        {/* Invisible ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.25} />
        </mesh>
      </Canvas>

      {interactive && (
        <div className="absolute bottom-6 left-6 flex gap-3 z-10">
          <button
            onClick={() => setIsExploded(v => !v)}
            className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 text-white/80 hover:border-[var(--m-blue)] hover:text-white transition-all"
            aria-label="Toggle exploded view"
          >
            {isExploded ? 'Collapse View' : 'Exploded View'}
          </button>
          <button
            onClick={handleScreenshot}
            className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 text-white/80 hover:border-[var(--m-blue)] hover:text-white transition-all"
            aria-label="Download screenshot"
          >
            Screenshot
          </button>
        </div>
      )}
    </div>
  )
}
