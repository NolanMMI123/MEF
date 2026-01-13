import "./Salle3D.css";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { Physics } from "@react-three/rapier";

import Salle from "../components/Salle";
import Player from "../components/Player";
import Crosshair from "../components/Crosshair";
import ControlsHint from "../components/ControlsHint";
import InteractionRaycaster from "../components/InteractionRaycaster";
import InteractHint from "../components/InteractHint";

export default function Salle3D() {
  const navigate = useNavigate();

  const targetRef = useRef({ can: false, kind: null, actionName: null });

  const [lightOn, setLightOn] = useState(false);

  // ✅ lampe torche (remontée pour ControlsHint)
  const [flashOn, setFlashOn] = useState(false);

  // ✅ un état par laptop (clé = actionName)
  const [, setLaptopForwardMap] = useState({});
  const [laptopToPlay, setLaptopToPlay] = useState(null); // { actionName, forward }

  // HUD
  const [canInteract, setCanInteract] = useState(false);
  const [label, setLabel] = useState("");
  const [, setKind] = useState(null);

  const onChange = (v, l, k, actionName) => {
    setCanInteract(v);
    setLabel(l);
    setKind(k);
    targetRef.current = { can: v, kind: k, actionName };
  };

  const handleInteract = () => {
    const t = targetRef.current;
    if (!t.can) return;

    if (t.kind === "switch") {
      setLightOn((v) => !v);
      return;
    }

    if (t.kind === "laptop") {
      if (!t.actionName) return;

      setLaptopForwardMap((prev) => {
        const nextForward = !prev[t.actionName];
        setLaptopToPlay({ actionName: t.actionName, forward: nextForward });
        return { ...prev, [t.actionName]: nextForward };
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          height: "90vh",
          width: "100%",
          overflow: "hidden",
        }}
        onPointerDownCapture={() => handleInteract()}
      >
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{ fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.1} />

          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]}>
              <Salle on={lightOn} laptopToPlay={laptopToPlay} />

              <Player
                eyeHeight={1.5}
                flashOn={flashOn}
                setFlashOn={setFlashOn}
              />

              <InteractionRaycaster onChange={onChange} maxDistance={3} />
            </Physics>
          </Suspense>
        </Canvas>

        <Crosshair active={canInteract} />
        <InteractHint visible={canInteract} label={label} />
        <ControlsHint lightOn={lightOn} flashOn={flashOn} />

        <button
          type="button"
          onPointerDownCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (document.pointerLockElement) document.exitPointerLock();

            navigate("/");
          }}
          onClickCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 9999,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        >
          Quitter la salle
        </button>
      </div>
    </div>
  );
}
