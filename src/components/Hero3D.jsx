import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  useGLTF,
  Html,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// Quantum Particle System Component
function QuantumParticles({ count = 100 }) {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 30 + Math.random() * 150; // Increased factor for wider movement
      const speed = 0.02 + Math.random() / 100; // Increased speed for more active particles
      const x = Math.random() * 60 - 30; // Increased range
      const y = Math.random() * 60 - 30; // Increased range
      const z = Math.random() * 60 - 30; // Increased range
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed);

      dummy.position.set(
        x + Math.cos(t) * factor,
        y + Math.sin(t * 2) * factor,
        z + Math.cos(t * 3) * factor
      );

      dummy.scale.setScalar(Math.cos(t) * 0.4 + 0.8); // Slightly larger scale variation
      dummy.rotation.y = Math.sin(t) * 3; // Increased rotation speed
      dummy.rotation.x = Math.cos(t) * 3; // Increased rotation speed
      dummy.updateMatrix();

      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;

    if (light.current) {
      light.current.position.x = Math.sin(state.clock.elapsedTime * 0.8) * 15; // Adjusted light movement
      light.current.position.z = Math.cos(state.clock.elapsedTime * 0.8) * 15; // Adjusted light movement
    }
  });

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[null, null, count]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#1E40AF"
          emissiveIntensity={0.5} // Increased emissive intensity
          transparent
          opacity={0.8}
        />
      </instancedMesh>
      <pointLight
        ref={light}
        color="#A855F7"
        intensity={3} // Increased light intensity
        distance={50} // Increased light distance
        position={[10, 10, 10]}
      />
    </>
  );
}

// Quantum Circuit Component
function QuantumCircuit() {
  const groupRef = useRef();
  const waveRefs = useRef([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.8;
    }

    // Animate quantum waves
    waveRefs.current.forEach((wave, i) => {
      if (wave) {
        const t = state.clock.elapsedTime * (1 + i * 0.3);
        wave.position.y = Math.sin(t) * 0.5;
        wave.scale.y = 1 + Math.sin(t * 2) * 0.2;
      }
    });
  });

  const wireGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.02, 0.02, 8, 8),
    []
  );
  const waveGeometry = useMemo(() => new THREE.PlaneGeometry(1, 4, 10, 10), []);

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {/* Quantum wires */}
      {[0, 2, 4].map((y, i) => (
        <mesh
          key={`wire-${i}`}
          position={[0, y - 2, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <primitive object={wireGeometry} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#0891B2"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Quantum waves instead of boxes */}
      {[-2, 0, 2].map((x, i) => (
        <group key={`wave-${i}`} position={[x, 0, 0]}>
          <mesh
            ref={(el) => (waveRefs.current[i] = el)}
            geometry={waveGeometry}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color="#7C3AED"
              emissive="#5B21B6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              wireframe={true}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Quantum Atom Component
function QuantumAtom() {
  const atomRef = useRef();
  const orbitsRef = useRef([]);

  useFrame((state) => {
    if (atomRef.current) {
      atomRef.current.rotation.y = state.clock.elapsedTime * 0.8; // Increased rotation speed
    }

    orbitsRef.current.forEach((orbit, i) => {
      if (orbit) {
        orbit.rotation.x = state.clock.elapsedTime * (1.2 + i * 0.6); // Increased orbit speed
        orbit.rotation.z = state.clock.elapsedTime * (0.7 + i * 0.4); // Increased orbit speed
      }
    });
  });

  return (
    <group ref={atomRef} position={[8, 2, 0]}>
      {/* Nucleus */}
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#5B21B6"
          emissiveIntensity={0.7}
        />
      </Sphere>

      {/* Electron orbits */}
      {[1.5, 2.5, 3.5].map((radius, i) => (
        <group key={`orbit-${i}`} ref={(el) => (orbitsRef.current[i] = el)}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 8, 32]} />
            <meshStandardMaterial
              color="#3B82F6"
              emissive="#1E40AF"
              emissiveIntensity={0.5} // Increased emissive intensity
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Electron */}
          <Sphere args={[0.1]} position={[radius, 0, 0]}>
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#F59E0B"
              emissiveIntensity={1.0} // Increased emissive intensity
            />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

// Try to load GLB models with fallback
function ModelWithFallback({
  modelPath,
  fallbackComponent: FallbackComponent,
  ...props
}) {
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} {...props} />;
  } catch (error) {
    console.log(`GLB model ${modelPath} not found, using procedural fallback`);
    return <FallbackComponent {...props} />;
  }
}

// Loading component for 3D scene
function Loader() {
  return (
    <Html center>
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">
          Loading quantum scene...
        </p>
      </motion.div>
    </Html>
  );
}

// Main 3D Scene Component
function Scene() {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Removed QuantumCircuit component */}
      <ModelWithFallback
        modelPath="/models/quantum-atom.glb"
        fallbackComponent={QuantumAtom}
        position={[3, 0, 0]}
        scale={[0.4, 0.4, 0.4]}
      />

      <QuantumParticles count={200} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        minDistance={5}
        maxDistance={50}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </>
  );
}

// Main Hero3D Component
const Hero3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3D;
