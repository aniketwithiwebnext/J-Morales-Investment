import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeHouse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFace, setActiveFace] = useState<string>("Structural Modeling");

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 350;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to blend with our custom gradient

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold houses
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // Group materials
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });

    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.85,
      shininess: 100,
    });

    // 1. House Base (Cube)
    const baseGeometry = new THREE.BoxGeometry(2, 1.4, 2);
    const baseSolid = new THREE.Mesh(baseGeometry, solidMaterial);
    const baseWire = new THREE.Mesh(baseGeometry, wireframeMaterial);
    baseSolid.position.y = 0.7;
    baseWire.position.y = 0.7;
    houseGroup.add(baseSolid);
    houseGroup.add(baseWire);

    // 2. House Roof (Cone/Pyramid structure)
    // CylinderGeometry with 4 radial segments acts as a modular pyramid roof!
    const roofGeometry = new THREE.CylinderGeometry(0, 1.7, 1.1, 4);
    roofGeometry.rotateY(Math.PI / 4); // Align perfectly with square base
    const roofSolid = new THREE.Mesh(roofGeometry, solidMaterial);
    const roofWire = new THREE.Mesh(roofGeometry, wireframeMaterial);
    roofSolid.position.y = 1.95;
    roofWire.position.y = 1.95;
    houseGroup.add(roofSolid);
    houseGroup.add(roofWire);

    // 3. Chimney (Box)
    const chimneyGeometry = new THREE.BoxGeometry(0.35, 0.8, 0.35);
    const chimneySolid = new THREE.Mesh(chimneyGeometry, solidMaterial);
    const chimneyWire = new THREE.Mesh(chimneyGeometry, wireframeMaterial);
    chimneySolid.position.set(0.65, 1.8, -0.4);
    chimneyWire.position.set(0.65, 1.8, -0.4);
    houseGroup.add(chimneySolid);
    houseGroup.add(chimneyWire);

    // 4. Ground Foundation Grid Helper
    const gridHelper = new THREE.GridHelper(8, 16, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 3, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0x60a5fa, 2, 30);
    accentLight.position.set(-5, 3, -5);
    scene.add(accentLight);

    // Mouse interactive target rotation coordinates
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Map to centralized -0.5 to 0.5 space
      mouseX = (x / rect.width) - 0.5;
      mouseY = (y / rect.height) - 0.5;

      targetRotationY = mouseX * 2.5;
      targetRotationX = mouseY * 1.5;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle rotation combined with mouse influence
      houseGroup.rotation.y += 0.004;
      
      // Interpolate smooth rotation transitions (lerp)
      houseGroup.rotation.y += (targetRotationY - houseGroup.rotation.y) * 0.08;
      houseGroup.rotation.x += (targetRotationX - houseGroup.rotation.x) * 0.08;

      // Gentle vertical floating motion
      houseGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Pulsing grid opacity
      if (gridHelper.material instanceof THREE.Material) {
        gridHelper.material.opacity = 0.3 + Math.sin(elapsedTime * 2) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle container resizing
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 350;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Rotating interactive UI tags based on time
    const labelInterval = setInterval(() => {
      const labels = [
        "Dynamic Structure Valuation",
        "Market Growth Analysis",
        "As-Is Fast Closings",
        "Transparent Cash Exchange",
        "Merriam Professional Escrow",
      ];
      setActiveFace((prev) => {
        const idx = labels.indexOf(prev);
        return labels[(idx + 1) % labels.length];
      });
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      clearInterval(labelInterval);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      baseGeometry.dispose();
      roofGeometry.dispose();
      chimneyGeometry.dispose();
      solidMaterial.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div id="interactive-canvas-container" className="relative w-full h-[360px] bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-md overflow-hidden flex flex-col justify-between p-6 shadow-2xl shadow-emerald-900/10">
      {/* HUD Info Header */}
      <div className="flex justify-between items-start z-10 pointer-events-none">
        <div>
          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block mb-1">
            CAD/3D Property Diagnostics
          </span>
          <h4 className="font-display text-lg font-semibold text-white">
            Interactive Structure Model
          </h4>
        </div>
        <div className="bg-emerald-950/50 border border-emerald-500/30 px-2 py-1 rounded text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>AUTOSYNC ACTIVE</span>
        </div>
      </div>

      {/* Render Target Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Footer Info HUD */}
      <div className="flex justify-between items-end z-10 pointer-events-none w-full">
        <div>
          <span className="font-mono text-[9px] text-slate-500 block">SYSTEM METRIC</span>
          <p className="font-mono text-xs text-white uppercase">{activeFace}</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-[9px] text-slate-500 block">ORIENTATION</span>
          <p className="font-mono text-[11px] text-slate-400">Y-axis Revolver / 60 FPS</p>
        </div>
      </div>
    </div>
  );
}
