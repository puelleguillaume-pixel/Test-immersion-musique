import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildKeyLayout } from "@/lib/keyLayout";

interface HeroSceneProps {
  reducedMotion: boolean;
}

const NOIR = 0x08070a;
const IVOIRE = 0xf4efe6;
const CUIR = 0xe21f26;
const CUIR_DEEP = 0x6e0f14;
const BRUME = 0x5b6b82;

/**
 * Full-screen Three.js hero: two mirrored rows of stylised piano keys — a
 * faint, desaturated "real" row above, and a glossy, red/blue-lit
 * reflection below — so the piano itself is never shown raw, only echoed,
 * per the brand's core visual idea. Reacts to mouse (parallax) and scroll
 * (tilt), and is entirely skipped by the parent for `lite` devices /
 * prefers-reduced-motion, which render `PianoReflectionFallback` instead.
 */
export function HeroScene({ reducedMotion }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(NOIR, 0.045);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);
    camera.lookAt(0, -0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // -- lighting: warm red key light + cool blue-gray fill, cinematic contrast
    const ambient = new THREE.AmbientLight(0x1a1c22, 1.1);
    const redLight = new THREE.PointLight(CUIR, 22, 20, 2);
    redLight.position.set(-4, 2, 4);
    const blueLight = new THREE.PointLight(BRUME, 14, 22, 2);
    blueLight.position.set(5, -1, 3);
    const rim = new THREE.PointLight(IVOIRE, 6, 18, 2);
    rim.position.set(0, 3, -4);
    scene.add(ambient, redLight, blueLight, rim);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const layout = buildKeyLayout(4);
    const span = layout[layout.length - 1].x;

    function makeKeyMesh(kind: "white" | "black" | "accent") {
      const width = kind === "black" ? 0.42 : 0.82;
      const depth = kind === "black" ? 0.62 : 1;
      const height = kind === "black" ? 0.22 : 0.14;
      const geo = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
      const color = kind === "accent" ? CUIR : kind === "black" ? 0x0b0a0d : IVOIRE;
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        roughness: kind === "black" ? 0.35 : 0.18,
        metalness: 0.12,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        emissive: kind === "accent" ? new THREE.Color(CUIR_DEEP) : new THREE.Color(0x000000),
        emissiveIntensity: kind === "accent" ? 0.5 : 0,
      });
      return new THREE.Mesh(geo, mat);
    }

    // "real" row — faint, desaturated, barely-there silhouette
    const realGroup = new THREE.Group();
    layout.forEach((k) => {
      const mesh = makeKeyMesh(k.kind);
      mesh.position.set(k.x - span / 2, 0, k.kind === "black" ? 0.2 : 0);
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      mat.transparent = true;
      mat.opacity = 0.22;
      realGroup.add(mesh);
    });
    realGroup.position.y = 0.9;
    realGroup.rotation.x = -0.18;
    rootGroup.add(realGroup);

    // "reflection" row — vivid, glossy, mirrored below
    const reflectGroup = new THREE.Group();
    const reflectMeshes: THREE.Mesh[] = [];
    layout.forEach((k) => {
      const mesh = makeKeyMesh(k.kind);
      mesh.position.set(k.x - span / 2, 0, k.kind === "black" ? 0.2 : 0);
      reflectGroup.add(mesh);
      reflectMeshes.push(mesh);
    });
    reflectGroup.scale.y = -1;
    reflectGroup.position.y = -0.9;
    reflectGroup.rotation.x = 0.18;
    rootGroup.add(reflectGroup);

    // reflective "floor" the keys sit on
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d0b10,
      roughness: 0.15,
      metalness: 0.7,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    rootGroup.add(floor);

    rootGroup.scale.setScalar(1.05);

    // -- pointer + scroll reactive parallax
    const pointer = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let scrollProgress = 0;
    const onScroll = () => {
      const h = mount.clientHeight || window.innerHeight;
      scrollProgress = Math.min(Math.max(window.scrollY / h, 0), 1.4);
    };

    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // -- resize
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // -- render loop
    let raf = 0;
    let frame = 0;
    const clock = new THREE.Clock();

    function tick() {
      const t = clock.getElapsedTime();
      frame += 1;

      if (!reducedMotion) {
        targetRot.y += (pointer.x * 0.28 - targetRot.y) * 0.045;
        targetRot.x += (-pointer.y * 0.12 - targetRot.x) * 0.045;
        rootGroup.rotation.y = targetRot.y + Math.sin(t * 0.12) * 0.03;
        rootGroup.rotation.x = targetRot.x;
        rootGroup.position.y = -scrollProgress * 1.4;
        camera.position.z = 9 - scrollProgress * 1.6;
        camera.fov = 42 + scrollProgress * 6;
        camera.updateProjectionMatrix();

        reflectMeshes.forEach((mesh, i) => {
          mesh.rotation.z = Math.sin(t * 0.9 + i * 0.6) * 0.035;
          mesh.position.y = Math.sin(t * 1.3 + i * 0.4) * 0.02;
        });
        redLight.intensity = 20 + Math.sin(t * 0.7) * 4;
        blueLight.intensity = 12 + Math.cos(t * 0.5) * 3;
      }

      renderer.render(scene, camera);

      // when motion is reduced we still need one frame rendered, then stop
      if (!reducedMotion || frame < 2) {
        raf = requestAnimationFrame(tick);
      }
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
