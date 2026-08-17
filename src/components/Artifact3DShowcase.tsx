import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Sparkles, RotateCw, ZoomIn, Info, ShieldCheck, ShoppingBag } from 'lucide-react';
import { MarketplaceProduct } from '../types';

interface Artifact3DShowcaseProps {
  product: MarketplaceProduct;
  onAddToCart: (product: MarketplaceProduct) => void;
  onClose: () => void;
  language: string;
}

export const Artifact3DShowcase: React.FC<Artifact3DShowcaseProps> = ({
  product,
  onAddToCart,
  onClose,
  language
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(2.2);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0a09);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1db, lightIntensity);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Pedestal
    const pedGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.2, 32);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(pedGeo, pedMat);
    pedestal.position.y = -0.7;
    scene.add(pedestal);

    // Artifact Group
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Procedural 3D Mesh Representation based on craft category
    if (product.category === 'dokra') {
      // 1. Dokra Lost-Wax Brass Tribal Musician Figure
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.88,
        roughness: 0.35,
        bumpScale: 0.05
      });

      // Body torso
      const bodyGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.8, 16);
      const body = new THREE.Mesh(bodyGeo, brassMat);
      body.position.y = 0.1;
      artifactGroup.add(body);

      // Head with traditional turban
      const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const head = new THREE.Mesh(headGeo, brassMat);
      head.position.y = 0.65;
      artifactGroup.add(head);

      const turbanGeo = new THREE.TorusGeometry(0.18, 0.06, 8, 24);
      turbanGeo.rotateX(Math.PI / 2);
      const turban = new THREE.Mesh(turbanGeo, brassMat);
      turban.position.y = 0.72;
      artifactGroup.add(turban);

      // Tribal Mandar Drum
      const drumGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.45, 16);
      drumGeo.rotateZ(Math.PI / 3);
      const drum = new THREE.Mesh(drumGeo, brassMat);
      drum.position.set(0.1, 0.15, 0.22);
      artifactGroup.add(drum);

      // Arms holding drum
      const armGeo = new THREE.TorusGeometry(0.24, 0.04, 8, 16, Math.PI);
      const arms = new THREE.Mesh(armGeo, brassMat);
      arms.position.set(0, 0.3, 0.15);
      arms.rotation.x = -Math.PI / 4;
      artifactGroup.add(arms);

    } else if (product.category === 'painting') {
      // 2. Sohrai Framed Earth Painting Canvas
      const frameGeo = new THREE.BoxGeometry(1.4, 1.1, 0.06);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      artifactGroup.add(frame);

      // Canvas Face with Ochre texture
      const canvasTex = document.createElement('canvas');
      canvasTex.width = 512;
      canvasTex.height = 384;
      const cctx = canvasTex.getContext('2d')!;
      cctx.fillStyle = '#fef3c7';
      cctx.fillRect(0, 0, 512, 384);

      // Draw Sohrai motif
      cctx.strokeStyle = '#78350f';
      cctx.lineWidth = 10;
      cctx.beginPath();
      cctx.arc(256, 180, 80, 0, Math.PI * 2);
      cctx.stroke();

      cctx.fillStyle = '#b45309';
      cctx.font = 'bold 22px serif';
      cctx.textAlign = 'center';
      cctx.fillText('SOHRAI EARTH ART', 256, 280);
      cctx.fillText('Natural Ochre & Manganese Pigments', 256, 310);

      const artFaceGeo = new THREE.PlaneGeometry(1.3, 1.0);
      const artFaceMat = new THREE.MeshStandardMaterial({
        map: new THREE.CanvasTexture(canvasTex),
        roughness: 0.9
      });
      const artFace = new THREE.Mesh(artFaceGeo, artFaceMat);
      artFace.position.z = 0.035;
      artifactGroup.add(artFace);

    } else {
      // 3. Tussar Silk / Bamboo / Lac General Geometry
      const silkGeo = new THREE.TorusKnotGeometry(0.45, 0.16, 64, 16);
      const silkMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.4,
        metalness: 0.3,
        wireframe: false
      });
      const silkMesh = new THREE.Mesh(silkGeo, silkMat);
      silkMesh.position.y = 0.2;
      artifactGroup.add(silkMesh);
    }

    // Drag-to-Rotate Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      artifactGroup.rotation.y += deltaX * 0.01;
      artifactGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        artifactGroup.rotation.y = time * 0.6;
      }

      keyLight.intensity = lightIntensity;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, autoRotate, lightIntensity]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        {/* Left: 3D Interactive WebGL Stage */}
        <div className="relative w-full lg:w-3/5 h-[360px] lg:h-[480px] bg-stone-950">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* 3D Overlay Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              3D Interactive Model
            </span>
          </div>

          {/* 3D Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all ${
                autoRotate
                  ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                  : 'bg-stone-900/80 text-stone-300 border-stone-700'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? 'Auto Rotation: ON' : 'Auto Rotation: OFF'}</span>
            </button>

            <div className="flex items-center gap-2 bg-stone-900/80 px-3 py-1 rounded-lg border border-stone-700 text-[11px] text-stone-300">
              <span>Studio Light:</span>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.2"
                value={lightIntensity}
                onChange={e => setLightIntensity(parseFloat(e.target.value))}
                className="w-16 accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Product & Provenance Details */}
        <div className="w-full lg:w-2/5 p-6 flex flex-col justify-between bg-stone-900 text-stone-100 border-t lg:border-t-0 lg:border-l border-stone-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-bold uppercase tracking-wider">
                {product.category} Craft
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-black font-serif text-amber-100">{product.name}</h2>
            {product.hindiName && (
              <p className="text-xs text-amber-400 font-medium">{product.hindiName}</p>
            )}

            <div className="flex items-baseline gap-2 my-3">
              <span className="text-2xl font-black text-white">₹{product.price.toLocaleString()}</span>
              <span className="text-xs text-stone-400">Direct artisan fair-price</span>
            </div>

            <div className="space-y-2 text-xs text-stone-300 my-4 border-y border-stone-800 py-3">
              <p>
                <strong className="text-white">Artisan:</strong> {product.artisanName}
              </p>
              <p>
                <strong className="text-white">Village / Guild:</strong> {product.village}
              </p>
              <p>
                <strong className="text-white">Materials:</strong> {product.materials}
              </p>
              <p className="text-stone-400 italic mt-2">{product.craftHeritage}</p>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>Cryptographically logged to Jharkhand Tribal Provenance Blockchain</span>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (₹{product.price})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
