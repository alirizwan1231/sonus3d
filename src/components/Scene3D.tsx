"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { stage, VARIANTS } from "@/lib/stage";

function capTexture(accent: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 256, 256);
  g.beginPath();
  g.arc(128, 128, 112, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,255,255,0.05)";
  g.fill();
  g.lineWidth = 7;
  g.strokeStyle = accent;
  g.beginPath();
  g.arc(128, 128, 104, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = accent;
  g.font = "700 118px 'Space Grotesk', Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("S", 128, 136);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.25, 4.6);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3.5, 4.5, 3.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -2.4; key.shadow.camera.right = 2.4;
    key.shadow.camera.top = 2.4; key.shadow.camera.bottom = -2.4;
    key.shadow.radius = 6;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fb4ff, 1.5);
    rim.position.set(-4, 1.5, -3.5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xfff2e0, 0.5);
    fill.position.set(0, 0.5, 5);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 48),
      new THREE.ShadowMaterial({ opacity: 0.32 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.52;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ---------- materials ---------- */
    const v0 = VARIANTS[0];
    const shellMat = new THREE.MeshPhysicalMaterial({ color: v0.shell, metalness: 0.35, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.25 });
    const bandMat = new THREE.MeshPhysicalMaterial({ color: v0.band, metalness: 0.3, roughness: 0.42, clearcoat: 0.5 });
    const cushionMat = new THREE.MeshStandardMaterial({ color: v0.cushion, roughness: 0.92, metalness: 0.02 });
    const accentMat = new THREE.MeshStandardMaterial({ color: v0.accent, emissive: v0.accent, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.2 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x2a2b31, roughness: 0.3, metalness: 0.9 });
    const driverMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.95, metalness: 0.05 });
    const capMat = new THREE.MeshStandardMaterial({ map: capTexture(v0.accent), transparent: true, roughness: 0.4, metalness: 0.25 });

    /* ---------- build ---------- */
    const model = new THREE.Group();
    const inner = new THREE.Group();
    inner.position.y = 0.06;
    model.add(inner);
    scene.add(model);

    type Part = { obj: THREE.Object3D; home: THREE.Vector3; off: THREE.Vector3 };
    const parts: Part[] = [];
    const reg = (obj: THREE.Object3D, off: [number, number, number]) => {
      obj.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
      parts.push({ obj, home: obj.position.clone(), off: new THREE.Vector3(...off) });
      return obj;
    };

    // Headband + inner cushion
    const band = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.088, 20, 80, Math.PI), bandMat);
    band.position.set(0, 0.02, 0);
    inner.add(reg(band, [0, 0.42, 0]));
    const bandPad = new THREE.Mesh(new THREE.TorusGeometry(0.925, 0.055, 16, 72, Math.PI), cushionMat);
    bandPad.position.set(0, 0.0, 0);
    inner.add(reg(bandPad, [0, 0.24, 0]));

    const buildSide = (sign: 1 | -1) => {
      // yoke
      const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.44, 16), metalMat);
      yoke.position.set(sign * 1.02, -0.18, 0);
      inner.add(reg(yoke, [sign * 0.18, 0.12, 0]));

      const cup = new THREE.Group();
      cup.position.set(sign * 1.02, -0.46, 0);
      inner.add(cup);

      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.43, 0.27, 56), shellMat);
      shell.rotation.z = Math.PI / 2;
      cup.add(reg(shell, [0, 0, 0]));

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.015, 12, 72), accentMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(sign * 0.1, 0, 0);
      cup.add(reg(ring, [sign * 0.34, 0, 0]));

      const cap = new THREE.Mesh(new THREE.CircleGeometry(0.295, 48), capMat);
      cap.rotation.y = sign * (Math.PI / 2);
      cap.position.set(sign * 0.142, 0, 0);
      cup.add(reg(cap, [sign * 0.5, 0.06, 0]));

      const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.262, 0.108, 20, 56), cushionMat);
      cushion.rotation.y = Math.PI / 2;
      cushion.position.set(-sign * 0.13, 0, 0);
      cup.add(reg(cushion, [-sign * 0.45, -0.04, 0]));

      const driver = new THREE.Mesh(new THREE.CircleGeometry(0.25, 48), driverMat);
      driver.rotation.y = -sign * (Math.PI / 2);
      driver.position.set(-sign * 0.08, 0, 0);
      cup.add(reg(driver, [-sign * 0.3, 0, 0]));
    };
    buildSide(1);
    buildSide(-1);

    /* ---------- interaction ---------- */
    let dragY = 0.6, dragX = 0.08, autoY = 0;
    let dragging = false, lastX = 0, lastY = 0, lastInteract = performance.now();
    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now(); mount.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      dragY += (e.clientX - lastX) * 0.0085;
      dragX = THREE.MathUtils.clamp(dragX + (e.clientY - lastY) * 0.005, -0.45, 0.55);
      lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now();
    };
    const onUp = () => { dragging = false; lastInteract = performance.now(); };
    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup", onUp);
    mount.addEventListener("pointercancel", onUp);

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ---------- loop ---------- */
    const clock = new THREE.Clock();
    let raf = 0;
    let lastVariant = stage.variant;
    const cShell = new THREE.Color(v0.shell), cBand = new THREE.Color(v0.band), cAccent = new THREE.Color(v0.accent), cCushion = new THREE.Color(v0.cushion);
    let explode = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (performance.now() - lastInteract > 2600 && !dragging) autoY += dt * 0.3;

      const targetRotY = dragY + autoY + stage.yawTarget + stage.progress * Math.PI * 1.25;
      const targetRotX = dragX + stage.pitchTarget + stage.progress * 0.12;
      model.rotation.y += (targetRotY - model.rotation.y) * (1 - Math.exp(-dt * 7));
      model.rotation.x += (targetRotX - model.rotation.x) * (1 - Math.exp(-dt * 7));
      model.position.y = Math.sin(t * 0.9) * 0.045;
      const w1 = THREE.MathUtils.smoothstep(stage.progress, 0.3, 0.42) * (1 - THREE.MathUtils.smoothstep(stage.progress, 0.58, 0.68));
      const w2 = THREE.MathUtils.smoothstep(stage.progress, 0.68, 0.8);
      const xOff = camera.aspect < 1 ? 0.22 : 0.55;
      model.position.x = xOff * w1 - xOff * w2;

      const baseZ = camera.aspect >= 1 ? 4.6 : THREE.MathUtils.clamp((4.6 / camera.aspect) * 0.62, 5.2, 7.2);
      camera.position.z += (baseZ - stage.progress * 0.45 - camera.position.z) * (1 - Math.exp(-dt * 4));
      camera.lookAt(0, -0.04, 0);

      explode += (stage.explodeTarget - explode) * (1 - Math.exp(-dt * 3.2));
      const e = explode * explode * (3 - 2 * explode);
      for (const p of parts) p.obj.position.copy(p.home).addScaledVector(p.off, e);

      if (stage.variant !== lastVariant) {
        lastVariant = stage.variant;
        const old = capMat.map;
        capMat.map = capTexture(VARIANTS[lastVariant].accent);
        capMat.needsUpdate = true;
        old?.dispose();
      }
      const v = VARIANTS[stage.variant];
      const k = 1 - Math.exp(-dt * 6);
      cShell.lerp(new THREE.Color(v.shell), k); shellMat.color.copy(cShell);
      cBand.lerp(new THREE.Color(v.band), k); bandMat.color.copy(cBand);
      cAccent.lerp(new THREE.Color(v.accent), k); accentMat.color.copy(cAccent); accentMat.emissive.copy(cAccent);
      cCushion.lerp(new THREE.Color(v.cushion), k); cushionMat.color.copy(cCushion);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);
      mount.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); }
      });
      [shellMat, bandMat, cushionMat, accentMat, metalMat, driverMat, capMat].forEach((m) => { m.map?.dispose(); m.dispose(); });
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label="Interactive 3D model of SONUS One headphones. Drag to rotate." />;
}
