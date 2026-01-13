// Salle.jsx
import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

/* -------------------------------
   LUMIÈRES PLAFOND (2 BARRES)
-------------------------------- */
function CeilingLights({ on }) {
  const y = 2.20699 - 0.02;
  const width = 0.106127;
  const height = 2.98857;

  return (
    <>
      <rectAreaLight
        position={[0.9468565, y, -3.011125]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={width}
        height={height}
        intensity={on ? 10 : 0}
        color="#ffffff"
      />
      <rectAreaLight
        position={[3.197385, y, -3.011125]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={width}
        height={height}
        intensity={on ? 10 : 0}
        color="#ffffff"
      />
    </>
  );
}

/* -------------------------------
   HELPERS
-------------------------------- */

// "laptop_lid.014.quaternion" -> "laptop_lid.014"
function nodeNameFromClip(clip) {
  if (!clip?.tracks?.length) return null;
  const trackName = clip.tracks[0]?.name || "";
  const parts = trackName.split(".");
  if (parts.length < 2) return null;
  return parts.slice(0, -1).join(".");
}

function normName(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// fallback si getObjectByName échoue (noms modifiés par export GLB)
function findObjectByNameLoose(scene, wanted) {
  const w = normName(wanted);
  let found = null;
  scene.traverse((o) => {
    if (found) return;
    if (!o.name) return;
    if (normName(o.name) === w) found = o;
  });
  return found;
}

export default function Salle({ on, laptopToPlay }) {
  const group = useRef();

  const { scene, animations } = useGLTF("/salle.glb");
  const { actions } = useAnimations(animations, group);

  const [, setSwitchLocked] = useState(false);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  /* -------------------------------
     SWITCH : TAG INTERACTIF
  -------------------------------- */
  const switchObj = useMemo(() => scene.getObjectByName("Switch"), [scene]);

  useEffect(() => {
    if (!switchObj) return;
    switchObj.traverse((c) => {
      if (!c.isMesh) return;
      c.userData.interactable = true;
      c.userData.kind = "switch";
      c.userData.isSwitch = true;
      c.userData.interactLabel = "Interrupteur";
    });
  }, [switchObj]);

  /* -------------------------------
     SWITCH : ANIMATION (comme avant)
  -------------------------------- */
  const switchActionName = useMemo(() => {
    if (!actions) return null;
    return (
      Object.keys(actions).find((k) => k.toLowerCase().includes("switch")) || null
    );
  }, [actions]);

  useEffect(() => {
    if (!switchActionName) return;

    const a = actions[switchActionName];
    if (!a) return;

    a.setLoop(THREE.LoopOnce, 1);
    // eslint-disable-next-line react-hooks/immutability
    a.clampWhenFinished = true;

    setSwitchLocked(true);
    a.stop();
    a.reset();

    if (on) {
      a.time = 0;
      a.timeScale = 1;
      a.play();
    } else {
      a.time = a.getClip().duration;
      a.timeScale = -1;
      a.play();
    }

    const t = setTimeout(
      () => setSwitchLocked(false),
      a.getClip().duration * 1000
    );
    return () => clearTimeout(t);
  }, [on, actions, switchActionName]);

  /* -------------------------------
     TAG LAPTOPS : MAC + LEGION + ACER
     - MAC : LaptopCloseAction
     - Legion : suffixes (whitelist)
     - Acer : suffixes (whitelist)
     - On tag UNIQUEMENT les lids (node animé)
     - On stocke 2 clés: laptopAction + actionName (compat)
  -------------------------------- */
  useEffect(() => {
    if (!scene || !actions) return;

    // Nettoyage des tags laptop (ne touche pas au switch)
    scene.traverse((o) => {
      if (!o.isMesh) return;
      if (o.userData?.kind === "laptop" || o.userData?.isLaptop) {
        delete o.userData.interactable;
        delete o.userData.kind;
        delete o.userData.isLaptop;
        delete o.userData.interactLabel;
        delete o.userData.laptopAction;
        delete o.userData.actionName;
      }
    });

    // ---------- MAC ----------
    if (actions["LaptopCloseAction"]) {
      const a = actions["LaptopCloseAction"];
      const nodeName = nodeNameFromClip(a.getClip?.());
      let node = nodeName ? scene.getObjectByName(nodeName) : null;
      if (!node && nodeName) node = findObjectByNameLoose(scene, nodeName);

      if (node) {
        node.traverse((c) => {
          if (!c.isMesh) return;

          c.userData.isLaptop = true;
          c.userData.kind = "laptop";
          c.userData.interactable = true;
          c.userData.interactLabel = "MAC";

          // compat
          c.userData.laptopAction = "LaptopCloseAction";
          c.userData.actionName = "LaptopCloseAction";
        });
      }
    }

    // ---------- PC LEGION (whitelist suffixes) ----------
    const legionSuffixes = new Set(["002", "005", "007", "014", "015", "016"]);

    // ---------- PC ACER (whitelist suffixes) ----------
    const acerSuffixes = new Set(["001", "003", "004", "006", "012", "013"]);

    Object.keys(actions)
      .filter((k) => /^LaptopCloseAction\.\d+$/i.test(k))
      .forEach((actionKey) => {
        const m = actionKey.match(/\.(\d+)$/);
        const suffix = m ? m[1] : null;
        if (!suffix) return;

        // Choix du label selon suffix whitelist
        let label = null;
        if (legionSuffixes.has(suffix)) label = "PC Legion";
        else if (acerSuffixes.has(suffix)) label = "PC Acer";
        else return; // on ignore les autres PC

        const a = actions[actionKey];
        if (!a) return;

        const nodeName = nodeNameFromClip(a.getClip?.());
        if (!nodeName) return;

        let node = scene.getObjectByName(nodeName);
        if (!node) node = findObjectByNameLoose(scene, nodeName);
        if (!node) return;

        node.traverse((c) => {
          if (!c.isMesh) return;

          c.userData.isLaptop = true;
          c.userData.kind = "laptop";
          c.userData.interactable = true;
          c.userData.interactLabel = label;

          // compat
          c.userData.laptopAction = actionKey; // ex: LaptopCloseAction.013
          c.userData.actionName = actionKey;
        });
      });
  }, [scene, actions]);

  /* -------------------------------
     PLAY LAPTOP : forward/reverse comme switch
     laptopToPlay = { actionName, forward }
  -------------------------------- */
  useEffect(() => {
    if (!actions) return;
    if (!laptopToPlay?.actionName) return;

    const { actionName, forward } = laptopToPlay;

    const a = actions[actionName];
    if (!a) {
      console.warn("Action introuvable:", actionName, Object.keys(actions));
      return;
    }

    a.setLoop(THREE.LoopOnce, 1);
    // eslint-disable-next-line react-hooks/immutability
    a.clampWhenFinished = true;

    // robust
    a.enabled = true;
    a.paused = false;

    a.stop();
    a.reset();

    const dur = a.getClip().duration;
    const eps = 0.0001;

    if (forward) {
      a.time = 0;
      a.timeScale = 1;
    } else {
      a.time = Math.max(0, dur - eps);
      a.timeScale = -1;
    }

    a.play();
  }, [actions, laptopToPlay]);

  /* -------------------------------
     LED VISIBLES (EMISSIVE)
  -------------------------------- */
  useEffect(() => {
    if (!scene) return;

    const isLed = (name) => /^led(Droite|Gauche)[123]002$/i.test(name);

    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      if (!isLed(obj.name)) return;

      if (obj.material?.clone) obj.material = obj.material.clone();

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (!m) return;
        m.emissive = new THREE.Color("#ffffff");
        m.emissiveIntensity = on ? 3.5 : 0;
        m.needsUpdate = true;
      });
    });
  }, [scene, on]);

  /* -------------------------------
     COLLIDERS AUTO CHAISES + TABLES
  -------------------------------- */
  const furnitureColliders = useMemo(() => {
    if (!scene) return [];

    scene.updateMatrixWorld(true);

    const colliders = [];
    const box = new THREE.Box3();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      const name = (obj.name || "").toLowerCase();
      const isTable = name.includes("table");
      const isChair = name.includes("chaise") || name.includes("chair");

      if (!isTable && !isChair) return;

      box.setFromObject(obj);
      box.getSize(size);
      box.getCenter(center);

      if (size.x < 0.2 || size.y < 0.2 || size.z < 0.2) return;

      colliders.push({
        key: obj.uuid,
        half: [size.x / 2, size.y / 2, size.z / 2],
        pos: [center.x, center.y, center.z],
      });
    });

    return colliders;
  }, [scene]);

  return (
    <group ref={group}>
      <CeilingLights on={on} />

      {/* Tout est piloté par Salle3D via le raycaster */}
      <primitive object={scene} />

      {/* -------------------------------
         COLLISIONS FIXES : SOL + MURS + TABLE PROF (manuel)
      -------------------------------- */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[20, 0.1, 20]} position={[2, -0.8, -3]} />

        <CuboidCollider args={[0.1, 2, 6]} position={[0, 2, -3]} />
        <CuboidCollider args={[0.1, 2, 6]} position={[5, 2, -3]} />
        <CuboidCollider args={[3, 2, 0.1]} position={[2, 2, -6]} />
        <CuboidCollider args={[3, 2, 0.1]} position={[2, 2, 0]} />

        <CuboidCollider
          args={[0.82536, 0.373887, 0.316618]}
          position={[4.00966, 0.373887, -0.926552]}
        />
      </RigidBody>

      {/* -------------------------------
         COLLISIONS AUTO : CHAISES + TABLES
      -------------------------------- */}
      <RigidBody type="fixed" colliders={false}>
        {furnitureColliders.map((c) => (
          <CuboidCollider key={c.key} args={c.half} position={c.pos} />
        ))}
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/salle.glb");
