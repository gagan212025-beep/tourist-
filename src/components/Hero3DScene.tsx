import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Compass, MapPin, Eye, ArrowRight } from 'lucide-react';

interface Hero3DSceneProps {
  onSelectDestination: (destId: string) => void;
  onExploreClick: () => void;
  onPlanTripClick: () => void;
  language: string;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({
  onSelectDestination,
  onExploreClick,
  onPlanTripClick,
  language
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPin, setHoveredPin] = useState<{ id: string; name: string; tag: string } | null>(null);
  const [is3DActive, setIs3DActive] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1410, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D canvas', e);
      setIs3DActive(false);
      return;
    }

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x3a6048, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffdf99, 3.2);
    sunLight.position.set(6, 12, 5);
    scene.add(sunLight);

    const forestGlow = new THREE.PointLight(0x10b981, 2.5, 15);
    forestGlow.position.set(0, 2, 0);
    scene.add(forestGlow);

    // 1. Terrain Mesh (Chotanagpur Undulating Plateau)
    const terrainGeo = new THREE.PlaneGeometry(24, 20, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Create organic plateau hills and valleys
      const height =
        Math.sin(x * 0.45) * Math.cos(z * 0.45) * 1.2 +
        Math.sin(x * 0.9 + z * 0.6) * 0.5 +
        Math.exp(-((x * x + z * z) * 0.04)) * 0.8;
      posAttr.setY(i, height - 1.2);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x143422,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: false,
      flatShading: true
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrain);

    // Wireframe grid overlay for cyber-digital feel
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const wireTerrain = new THREE.Mesh(terrainGeo, wireMat);
    wireTerrain.position.y += 0.02;
    scene.add(wireTerrain);

    // 2. Flowing River Ribbon
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, -0.6, -6),
      new THREE.Vector3(-4, -0.7, -2),
      new THREE.Vector3(0, -0.8, 1),
      new THREE.Vector3(3, -0.7, 4),
      new THREE.Vector3(8, -0.6, 7)
    ]);
    const riverGeo = new THREE.TubeGeometry(curve, 40, 0.45, 8, false);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    scene.add(river);

    // 3. Floating Interactive Landmark Pins
    const pinData = [
      { id: 'netarhat', name: 'Netarhat Plateau', tag: 'Magnolia Sunset & Hills (3,514 ft)', pos: [-3.2, 0.8, -1.5], color: 0xf59e0b },
      { id: 'patratu-valley', name: 'Patratu Valley', tag: 'Winding Serpentine Ghats & Dam', pos: [2.5, 0.2, 1.2], color: 0x06b6d4 },
      { id: 'betla-national-park', name: 'Betla National Park', tag: 'Palamau Tigers & 16th C Forts', pos: [-4.8, 0.4, 2.0], color: 0x10b981 },
      { id: 'hundru-falls', name: 'Hundru Falls', tag: '320 ft Subarnarekha Cascade', pos: [3.8, 0.6, -2.2], color: 0x38bdf8 }
    ];

    const pinGroup = new THREE.Group();
    scene.add(pinGroup);

    const pinMeshes: { mesh: THREE.Mesh; data: typeof pinData[0] }[] = [];

    pinData.forEach(p => {
      // Beacon base ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.35, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(p.pos[0], p.pos[1] - 0.35, p.pos[2]);
      pinGroup.add(ring);

      // Pin Crystal Diamond
      const crystalGeo = new THREE.OctahedronGeometry(0.28, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.2
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(p.pos[0], p.pos[1], p.pos[2]);
      pinGroup.add(crystal);

      pinMeshes.push({ mesh: crystal, data: p });
    });

    // 4. Forest Fireflies & Leaf Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = Math.random() * 5 - 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: Math.random() * 0.006 + 0.002,
        z: (Math.random() - 0.5) * 0.008
      });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction / Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);
    let targetCameraX = 0;
    let targetCameraY = 4.5;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      targetCameraX = mouse.x * 1.5;
      targetCameraY = 4.5 - mouse.y * 0.8;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map(pm => pm.mesh));
      if (intersects.length > 0) {
        const hit = pinMeshes.find(pm => pm.mesh === intersects[0].object);
        if (hit) {
          onSelectDestination(hit.data.id);
        }
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    // Window Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera smooth interpolation
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0.5, 0);

      // Rotate crystal pins & pulse beacons
      pinMeshes.forEach((pm, idx) => {
        pm.mesh.rotation.y = elapsedTime * 1.2 + idx;
        pm.mesh.rotation.x = Math.sin(elapsedTime * 0.8 + idx) * 0.3;
        pm.mesh.position.y = pm.data.pos[1] + Math.sin(elapsedTime * 2 + idx) * 0.12;
      });

      // Animate fireflies
      const pos = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let px = pos.getX(i) + particleVelocities[i].x;
        let py = pos.getY(i) + particleVelocities[i].y;
        let pz = pos.getZ(i) + particleVelocities[i].z;

        if (py > 6) py = -0.5;
        if (px > 9) px = -9;
        if (px < -9) px = 9;
        if (pz > 8) pz = -8;
        if (pz < -8) pz = 8;

        pos.setXYZ(i, px, py, pz);
      }
      pos.needsUpdate = true;

      // Raycast hovering
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map(pm => pm.mesh));
      if (intersects.length > 0) {
        const hit = pinMeshes.find(pm => pm.mesh === intersects[0].object);
        if (hit) {
          setHoveredPin({ id: hit.data.id, name: hit.data.name, tag: hit.data.tag });
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredPin(null);
        container.style.cursor = 'default';
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectDestination]);

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] bg-stone-950 overflow-hidden border-b border-stone-800">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Decorative Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80 pointer-events-none z-10" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-10 pointer-events-none">
        {/* Top Tag */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md pointer-events-auto shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi'
                ? 'स्मार्ट डिजिटल पर्यटन मंच — झारखण्ड'
                : 'Next-Gen AI & 3D Eco-Tourism Platform'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-stone-400 text-xs bg-stone-900/80 px-3 py-1.5 rounded-full border border-stone-800 backdrop-blur-md pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Interactive 3D Plateau Engine</span>
          </div>
        </div>

        {/* Center Main Headline */}
        <div className="max-w-2xl space-y-4 my-auto">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-100 tracking-tight font-serif leading-tight drop-shadow-md">
              {language === 'hi' ? (
                <>
                  झारखण्ड दर्शन <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                    वन, प्रपात एवं जनजातीय धरोहर
                  </span>
                </>
              ) : (
                <>
                  Explore Jharkhand <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                    Land of Forests, Waterfalls & Heritage
                  </span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-xl drop-shadow">
              {language === 'hi'
                ? 'नेतरहाट की मनमोहक घाटियों से लेकर बेतला के घने जंगलों तक, प्रमाणित जनजातीय गाइडों, पारंपरिक होमस्टे और सुरक्षित ब्लॉकचेन सत्यापन के साथ अपनी यात्रा की योजना बनाएं।'
                : 'From the mist-crowned heights of Netarhat to the historic tiger forts of Betla. Connect with certified tribal naturalists, authentic homestays, and tamper-proof blockchain verified artisan guilds.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 pointer-events-auto">
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-950 hover:brightness-110 active:scale-95 transition-all text-white"
            >
              <Compass className="w-4 h-4 text-amber-200" />
              <span>{language === 'hi' ? 'गंतव्य अन्वेषण करें' : 'Explore 15+ Destinations'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onPlanTripClick}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900/90 text-stone-200 hover:text-white border border-stone-700 hover:border-emerald-500/50 font-semibold text-sm backdrop-blur-md hover:bg-stone-800 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'AI यात्रा योजना बनाएं' : 'AI Trip Planner'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Interactive Hover Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-stone-800/80">
          <div className="flex items-center gap-2">
            {hoveredPin ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-xs text-emerald-200 backdrop-blur-md animate-fade-in pointer-events-auto">
                <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span className="font-bold text-white">{hoveredPin.name}:</span>
                <span>{hoveredPin.tag}</span>
                <span className="text-amber-400 font-semibold ml-1 underline">Click to view</span>
              </div>
            ) : (
              <p className="text-xs text-stone-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Hover or click glowing 3D beacon pins to teleport to top destinations</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-400 pointer-events-auto">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Netarhat (3.5k ft)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Patratu Dam
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Betla Tigers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
