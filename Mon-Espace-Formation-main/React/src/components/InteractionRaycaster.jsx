import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function InteractionRaycaster({ onChange, maxDistance = 3 }) {
  const { camera, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const center = useMemo(() => new THREE.Vector2(0, 0), []);
  const last = useRef({ id: null, kind: null, label: "", actionName: null });

  useFrame(() => {
    raycaster.setFromCamera(center, camera);
    // eslint-disable-next-line react-hooks/immutability
    raycaster.far = maxDistance;

    const hits = raycaster.intersectObjects(scene.children, true);

    if (!hits.length) {
      if (last.current.id !== null) {
        last.current = { id: null, kind: null, label: "", actionName: null };
        onChange(false, "", null, null);
      }
      return;
    }

    // ✅ occlusion: le plus proche uniquement
    let obj = hits[0].object;
    while (obj && !obj.userData?.interactable) obj = obj.parent;

    if (!obj) {
      if (last.current.id !== null) {
        last.current = { id: null, kind: null, label: "", actionName: null };
        onChange(false, "", null, null);
      }
      return;
    }

    const id = obj.uuid;
    const kind = obj.userData.kind || null; // "switch" | "laptop"
    const label = obj.userData.interactLabel || "Objet";
    const actionName = obj.userData.actionName || obj.userData.laptopAction || null;

    if (
      last.current.id === id &&
      last.current.kind === kind &&
      last.current.label === label &&
      last.current.actionName === actionName
    ) {
      return;
    }

    last.current = { id, kind, label, actionName };
    onChange(true, label, kind, actionName);
  });

  return null;
}
