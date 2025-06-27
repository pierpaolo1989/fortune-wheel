import React, { useEffect, useImperativeHandle,forwardRef, useRef, useState } from "react";

const MAX_SPIN_TIME = 5000;
const FULL_ROTATIONS = 5;

const WheelComponent = forwardRef(({
  initialSegments,
  segColors,
  onFinished = () => { },
  fontFamily = "Arial",
  primaryColor = "#000",
  primaryColoraround = "#fff",
  contrastColor = "#fff",
  buttonText = "SPIN",
  isOnlyOnce = true
}, ref) => {
  const [segments, setSegments] = useState(initialSegments);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialSegments.join("\n"));

  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [angleCurrent, setAngleCurrent] = useState(0);
  const angleRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const targetAngleRef = useRef(0);

  const size = 250; // era 150
  const center = size + 10;


  const spin = () => {
    if (isSpinning || (isOnlyOnce && hasFinished)) return;

    const randomIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = (2 * Math.PI) / segments.length;
    const stopAngle =
      FULL_ROTATIONS * 2 * Math.PI -
      (randomIndex * segmentAngle + segmentAngle / 2);

    targetAngleRef.current = stopAngle;
    startTimeRef.current = performance.now();
    setIsSpinning(true);
    animate();
  };

  const animate = () => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const t = Math.min(elapsed / MAX_SPIN_TIME, 1);
    const easeOut = Math.sin((t * Math.PI) / 2);

    const current =
      angleCurrent + (targetAngleRef.current - angleCurrent) * easeOut;
    angleRef.current = current;
    setAngleCurrent(current);
    drawWheel(current);

    if (t < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
      const result = getSegmentAtAngle(current);
      setIsSpinning(false);
      setHasFinished(true);
      onFinished(result);
    }
  };

  const getSegmentAtAngle = (angle) => {
    const segmentAngle = (2 * Math.PI) / segments.length;
    const adjusted = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
    return segments[Math.floor(adjusted / segmentAngle)];
  };

  const drawWheel = (angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segmentAngle = (2 * Math.PI) / segments.length;

    for (let i = 0; i < segments.length; i++) {
      const start = angle + i * segmentAngle;
      const end = start + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, size, start, end);
      ctx.closePath();
      ctx.fillStyle = segColors[i % segColors.length] || "#ccc";
      ctx.fill();
      ctx.lineWidth = 0.7; // o un valore a tua scelta
      ctx.strokeStyle = primaryColor;
      ctx.stroke();
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = contrastColor;
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.fillText(segments[i], size - 40, 0); // distanziato dalla circonferenza
      ctx.restore();
    }

    // Cerchio centrale
    ctx.beginPath();
    ctx.arc(center, center, 35, 0, 2 * Math.PI);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.strokeStyle = contrastColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = contrastColor;
    ctx.font = `bold 16px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillText(buttonText, center, center + 5);

    // Cerchio esterno
    ctx.beginPath();
    ctx.arc(center, center, size, 0, 2 * Math.PI);
    ctx.strokeStyle = primaryColoraround;
    ctx.lineWidth = 20;
    ctx.stroke();

    // Freccia
    ctx.beginPath();
    ctx.moveTo(center - 10, center - size - 10);
    ctx.lineTo(center + 10, center - size - 10);
    ctx.lineTo(center, center - size - 35);
    ctx.closePath();
    ctx.fillStyle = contrastColor;
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(angleCurrent);
  }, [segments]);

  const handleEditToggle = () => setEditing(!editing);

  const handleSave = () => {
    const names = inputValue
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "");
    if (names.length >= 2) {
      setSegments(names);
      setEditing(false);
      setHasFinished(false);
      setAngleCurrent(0);
    }
  };

// ⬇️ Espone la funzione reset al genitore
  useImperativeHandle(ref, () => ({
    reset: () => {
      cancelAnimationFrame(animationRef.current);
      setHasFinished(false);
      setIsSpinning(false);
      setAngleCurrent(0);
      angleRef.current = 0;
      targetAngleRef.current = 0;
      drawWheel(0); // Redisegna da zero
    }
  }));

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <div className="flex justify-center items-center flex-col w-full">
        <canvas
          ref={canvasRef}
          width={2 * center}
          height={2 * center}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: `${2 * center}px`,
            display: "block",
            margin: "0 auto",
            cursor: isSpinning || (isOnlyOnce && hasFinished) ? "default" : "pointer"
          }}
          onClick={spin}
        />
      </div>
      <div className="text-center mt-4">
        <button
          onClick={handleEditToggle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
          style={{ display: "block", marginTop: 20 }}
        >
          {editing ? "Annulla" : "Modifica nomi"}
        </button>
      </div>
      {editing && (
        <div style={{ marginTop: 10 }} className="text-center mt-4">
          <textarea
            rows={segments.length + 2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "monospace",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              boxSizing: "border-box",
              marginTop: "10px"
            }}
          />
          <br />
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
          >
            Salva
          </button>
        </div>
      )}
    </div>
  );
});

export default WheelComponent;
