import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export default function FpsController({
  eyeHeight = 1.5,
  speed = 2.5,
  sprintMultiplier = 2,
}) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  const keys = useRef({
    forward: false,
    back: false,
    left: false,
    right: false,
    sprint: false,
  });

  const locked = useRef(false);

  const dir = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    camera.position.y = eyeHeight;

    const onKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
        case "KeyZ":
          keys.current.forward = true;
          break;
        case "KeyS":
          keys.current.back = true;
          break;
        case "KeyA":
        case "KeyQ":
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = true;
          break;
        default:
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "KeyZ":
          keys.current.forward = false;
          break;
        case "KeyS":
          keys.current.back = false;
          break;
        case "KeyA":
        case "KeyQ":
          keys.current.left = false;
          break;
        case "KeyD":
          keys.current.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [camera, eyeHeight]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onLock = () => {
      locked.current = true;
      camera.position.y = eyeHeight;
    };
    const onUnlock = () => {
      locked.current = false;
    };

    controls.addEventListener("lock", onLock);
    controls.addEventListener("unlock", onUnlock);
    return () => {
      controls.removeEventListener("lock", onLock);
      controls.removeEventListener("unlock", onUnlock);
    };
  }, [camera, eyeHeight]);

  useFrame((_, delta) => {
    if (!locked.current) return;

    const currentSpeed = speed * (keys.current.sprint ? sprintMultiplier : 1);

    dir.set(0, 0, 0);

    camera.getWorldDirection(forward);
    // eslint-disable-next-line react-hooks/immutability
    forward.y = 0;
    if (forward.lengthSq() > 0) forward.normalize();

    right.crossVectors(forward, up).normalize();

    if (keys.current.forward) dir.add(forward);
    if (keys.current.back) dir.sub(forward);
    if (keys.current.right) dir.add(right);
    if (keys.current.left) dir.sub(right);

    if (dir.lengthSq() > 0) {
      dir.normalize();
      camera.position.addScaledVector(dir, currentSpeed * delta);
    }

    // hauteur verrouillée
    // eslint-disable-next-line react-hooks/immutability
    camera.position.y = eyeHeight;
  });

  return <PointerLockControls ref={controlsRef} camera={camera} domElement={gl.domElement} />;
}
