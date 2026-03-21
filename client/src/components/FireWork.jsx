
import { useEffect, useState } from "react";

const DOTS = 10;
const RADIUS = 20;

export default function Firework({ x, y, onFinish }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
    const t = setTimeout(onFinish, 800);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="fixed left-0 top-0 pointer-events-none">
      {Array.from({ length: DOTS }).map((_, i) => {
        const angle = (360 / DOTS) * i;

        return (
          <span
            key={i}
            className={`absolute bg-green-700 transition-all duration-700 ease-out`}
            style={{
              left: x,
              top: y,
              width: animate ? "6px" : "14px",
              height: "2px",
              borderRadius: animate ? "9999px" : "2px",
              transform: animate
                ? `translate(-50%, -50%) rotate(${angle}deg) translateX(${RADIUS}px)`
                : `translate(-50%, -50%) rotate(${angle}deg) translateX(0px)`,
              transformOrigin: "left center",
            }}
          />
        );
      })}
    </div>
  );
}