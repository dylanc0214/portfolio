/**
 * Hero3DScene
 * -----------
 * Renders a Three.js canvas in the Hero section background.
 *
 * Tech logos displayed:
 *   - python-logo.glb   → GLB model  (useGLTF)
 *   - react-logo.fbx    → FBX model  (useFBX)
 *   - html_fbx_Collection.fbx → FBX model (useFBX)\
 * Models are served from /public/models/ (Vite static assets).
 */

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useFBX, Float, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ─── Colour palette (mirrors CSS variables) ───────────────────────────────────
const COL_ORANGE = '#f43a09'
const COL_WARM   = '#ffb766'
const COL_GREEN  = '#68d388'
const COL_MINT   = '#c2edda'
const COL_BLUE   = '#61dafb'   // React blue
const COL_PYTHON = '#3776ab'   // Python blue
const COL_JAVA   = '#ea2d2e'   // Java red
const COL_HTML   = '#e34f26'   // HTML orange
const COL_JS     = '#f7df1e'   // JavaScript yellow

// ─── Utility: apply colour to every mesh in an FBX group ─────────────────────
function tintGroup(group: THREE.Group, color: string) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.25,
    roughness: 0.45,
  })
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      ;(child as THREE.Mesh).material = mat
    }
  })
}

// ─── GLB model loader ─────────────────────────────────────────────────────────
interface GlbModelProps {
  url: string
  position: [number, number, number]
  scale?: number
  floatSpeed?: number
  color?: string
}

function GlbModel({ url, position, scale = 1, floatSpeed = 1, color }: GlbModelProps) {
  const { scene } = useGLTF(url)
  const cloned = scene.clone(true)

  useEffect(() => {
    if (!color) return
    tintGroup(cloned as unknown as THREE.Group, color)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Float speed={floatSpeed} floatIntensity={1.2} rotationIntensity={0.5}>
      <primitive object={cloned} position={position} scale={scale} castShadow />
    </Float>
  )
}

// ─── FBX model loader ─────────────────────────────────────────────────────────
interface FbxModelProps {
  url: string
  position: [number, number, number]
  scale?: number
  floatSpeed?: number
  color: string
  rotation?: [number, number, number]
}

function FbxModel({ url, position, scale = 1, floatSpeed = 1, color, rotation = [0, 0, 0] }: FbxModelProps) {
  const group = useFBX(url)
  const cloned = group.clone(true)
  tintGroup(cloned, color)

  return (
    <Float speed={floatSpeed} floatIntensity={1.1} rotationIntensity={0.45}>
      <primitive object={cloned} position={position} scale={scale} rotation={rotation} castShadow />
    </Float>
  )
}

// ─── Placeholder shapes (only visible when ALL loaders fail/are loading) ──────
interface PlaceholderMeshProps {
  position: [number, number, number]
  geometry: 'box' | 'sphere' | 'torus' | 'octahedron'
  color: string
  scale?: number
  floatSpeed?: number
  floatIntensity?: number
}

function PlaceholderMesh({
  position,
  geometry,
  color,
  scale = 1,
  floatSpeed = 1,
  floatIntensity = 1,
}: PlaceholderMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.4 * floatSpeed
    meshRef.current.rotation.y += delta * 0.6 * floatSpeed
  })

  return (
    <Float speed={floatSpeed} floatIntensity={floatIntensity} rotationIntensity={0.4}>
      <mesh ref={meshRef} position={position} scale={scale} castShadow>
        {geometry === 'box'        && <boxGeometry args={[1, 1, 1]} />}
        {geometry === 'sphere'     && <sphereGeometry args={[0.6, 32, 32]} />}
        {geometry === 'torus'      && <torusGeometry args={[0.5, 0.2, 16, 50]} />}
        {geometry === 'octahedron' && <octahedronGeometry args={[0.7]} />}
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

const FALLBACK_PLACEHOLDERS: PlaceholderMeshProps[] = [
  { position: [-3,  1.2,  -1], geometry: 'box',        color: COL_ORANGE, scale: 0.9, floatSpeed: 1.0, floatIntensity: 1.2 },
  { position: [ 3,  0.8,  -1], geometry: 'octahedron', color: COL_GREEN,  scale: 1.0, floatSpeed: 1.3, floatIntensity: 0.9 },
  { position: [-1.5, -1,  -2], geometry: 'torus',      color: COL_WARM,   scale: 0.8, floatSpeed: 0.8, floatIntensity: 1.4 },
  { position: [ 1.5, -0.5, 0], geometry: 'sphere',     color: COL_MINT,   scale: 0.7, floatSpeed: 1.1, floatIntensity: 1.0 },
]

// ─── Tech models scene content ────────────────────────────────────────────────
function TechModels() {
  return (
    <Suspense
      fallback={
        <>
          {FALLBACK_PLACEHOLDERS.map((p, i) => (
            <PlaceholderMesh key={i} {...p} />
          ))}
        </>
      }
    >
      {/* Python logo — GLB */}
      <GlbModel
        url="/models/python-logo.glb"
        position={[-3.2, 1.5, -0.5]}
        scale={5}
        floatSpeed={1.0}
        color={COL_PYTHON}
      />

      
      {/* React logo — FBX */}
      <FbxModel
        url="/models/react-logo.fbx"
        position={[4.0, 1.0, -0.5]}
        scale={0.005}
        floatSpeed={1.4}
        color={COL_BLUE}
      />

      {/* HTML logo — FBX */}
      <FbxModel
        url="/models/html_fbx_Collection.fbx"
        position={[-2.5, -1.5, -1.0]}
        scale={0.005}
        floatSpeed={0.55}
        color={COL_HTML}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Java logo— GLB */}
      <GlbModel
        url="/models/java.glb"
        position={[2.5, -0.5, 0.5]}
        scale={0.50}
        floatSpeed={1.0}
        color={COL_JAVA}
      />

      {/* JavaScript logo— GLB */}
      <GlbModel
        url="/models/js-logo.glb"
        position={[0, 0.5, 1.0]}
        scale={8}
        floatSpeed={1.0}
        color={COL_JS}
      />

    </Suspense>
  )
}

// ─── Inner scene ─────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color={COL_MINT} />

      {/* Environment reflections */}
      <Environment preset="city" />

      {/* Slow auto-orbit — user can't accidentally rotate and obscure text */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />

      <TechModels />
    </>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────
export function Hero3DScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

// Preload assets for faster initial render
useGLTF.preload('/models/python-logo.glb')
useGLTF.preload('/models/java.glb')

export default Hero3DScene
