export type Stroke = [number, number][];
export type TraceItem = { id: string; label: string; strokes: Stroke[] };
export type TraceGroup = { id: string; label: string; items: TraceItem[] };

function line(parts: string): Stroke[] {
  return parts.split("|").map((stroke) =>
    stroke
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [x, y] = pair.split(",").map(Number);
        return [42 + x * 216, 32 + y * 236] as [number, number];
      }),
  );
}

function arc(cx: number, cy: number, rx: number, ry: number, start: number, end: number, steps = 18): Stroke {
  const points: Stroke = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = start + ((end - start) * i) / steps;
    points.push([42 + (cx + Math.cos(angle) * rx) * 216, 32 + (cy + Math.sin(angle) * ry) * 236]);
  }
  return points;
}

function ring(cx: number, cy: number, rx: number, ry: number): Stroke {
  return arc(cx, cy, rx, ry, 0, Math.PI * 2, 28);
}

function poly(sides: number, radius: number, turn = -Math.PI / 2): Stroke {
  const points: Stroke = [];
  for (let i = 0; i <= sides; i += 1) {
    const angle = turn + (i / sides) * Math.PI * 2;
    points.push([150 + Math.cos(angle) * radius, 156 + Math.sin(angle) * radius]);
  }
  return points;
}

function wave(fromX: number, toX: number, y: number, height: number, humps: number): Stroke {
  const points: Stroke = [];
  const steps = humps * 12;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    points.push([fromX + (toX - fromX) * t, y + Math.sin(t * humps * Math.PI * 2) * height]);
  }
  return points;
}

function spiral(): Stroke {
  const points: Stroke = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const angle = t * Math.PI * 5;
    const radius = 18 + t * 78;
    points.push([150 + Math.cos(angle) * radius, 156 + Math.sin(angle) * radius]);
  }
  return points;
}

function heart(): Stroke {
  const points: Stroke = [];
  for (let i = 0; i <= 42; i += 1) {
    const t = (i / 42) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    points.push([150 + x * 6.4, 168 - y * 6.4]);
  }
  return points;
}

const capitals: [string, string][] = [
  ["A", "0.50,0.02 0.08,0.98|0.50,0.02 0.92,0.98|0.24,0.58 0.76,0.58"],
  ["B", "0.22,0.02 0.22,0.98|0.22,0.02 0.62,0.02 0.80,0.18 0.62,0.48 0.22,0.48|0.22,0.48 0.68,0.48 0.84,0.68 0.64,0.98 0.22,0.98"],
  ["C", ""],
  ["D", "0.22,0.02 0.22,0.98|0.22,0.02 0.55,0.02 0.82,0.28 0.82,0.72 0.55,0.98 0.22,0.98"],
  ["E", "0.78,0.02 0.22,0.02 0.22,0.98 0.78,0.98|0.22,0.50 0.64,0.50"],
  ["F", "0.78,0.02 0.22,0.02 0.22,0.98|0.22,0.50 0.62,0.50"],
  ["G", ""],
  ["H", "0.22,0.02 0.22,0.98|0.78,0.02 0.78,0.98|0.22,0.50 0.78,0.50"],
  ["I", "0.30,0.02 0.70,0.02|0.50,0.02 0.50,0.98|0.30,0.98 0.70,0.98"],
  ["J", "0.28,0.02 0.78,0.02|0.62,0.02 0.62,0.74 0.40,0.98 0.16,0.74"],
  ["K", "0.22,0.02 0.22,0.98|0.76,0.02 0.22,0.50 0.80,0.98"],
  ["L", "0.26,0.02 0.26,0.98 0.78,0.98"],
  ["M", "0.08,0.98 0.08,0.04 0.50,0.58 0.92,0.04 0.92,0.98"],
  ["N", "0.18,0.98 0.18,0.02 0.82,0.98 0.82,0.02"],
  ["O", ""],
  ["P", "0.24,0.02 0.24,0.98|0.24,0.02 0.66,0.02 0.82,0.20 0.66,0.48 0.24,0.48"],
  ["Q", ""],
  ["R", "0.24,0.02 0.24,0.98|0.24,0.02 0.66,0.02 0.82,0.20 0.66,0.48 0.24,0.48|0.46,0.48 0.82,0.98"],
  ["S", ""],
  ["T", "0.16,0.02 0.84,0.02|0.50,0.02 0.50,0.98"],
  ["U", "0.18,0.02 0.18,0.70 0.50,0.98 0.82,0.70 0.82,0.02"],
  ["V", "0.10,0.02 0.50,0.98 0.90,0.02"],
  ["W", "0.06,0.02 0.28,0.98 0.50,0.38 0.72,0.98 0.94,0.02"],
  ["X", "0.12,0.02 0.88,0.98|0.88,0.02 0.12,0.98"],
  ["Y", "0.12,0.02 0.50,0.46 0.88,0.02|0.50,0.46 0.50,0.98"],
  ["Z", "0.16,0.02 0.84,0.02 0.16,0.98 0.84,0.98"],
];

const smalls: [string, string][] = [
  ["a", ""],
  ["b", "0.28,0.02 0.28,0.98"],
  ["c", ""],
  ["d", "0.72,0.02 0.72,0.98"],
  ["e", ""],
  ["f", "0.62,0.16 0.48,0.02 0.36,0.16 0.40,0.98|0.24,0.42 0.62,0.42"],
  ["g", ""],
  ["h", "0.28,0.02 0.28,0.98"],
  ["i", "0.48,0.28 0.48,0.34|0.48,0.48 0.48,0.98"],
  ["j", "0.58,0.28 0.58,0.34|0.58,0.48 0.58,0.82 0.40,0.98 0.24,0.82"],
  ["k", "0.30,0.02 0.30,0.98|0.68,0.48 0.30,0.68 0.70,0.98"],
  ["l", "0.48,0.02 0.48,0.86 0.62,0.98"],
  ["m", ""],
  ["n", ""],
  ["o", ""],
  ["p", "0.30,0.48 0.30,1.08"],
  ["q", "0.70,0.48 0.70,1.08"],
  ["r", "0.32,0.48 0.32,0.98|0.32,0.62 0.50,0.48 0.68,0.56"],
  ["s", ""],
  ["t", "0.46,0.16 0.46,0.86 0.62,0.98|0.28,0.42 0.66,0.42"],
  ["u", "0.30,0.48 0.30,0.82 0.50,0.98 0.70,0.78 0.70,0.48"],
  ["v", "0.22,0.48 0.50,0.98 0.78,0.48"],
  ["w", "0.12,0.48 0.30,0.98 0.50,0.62 0.70,0.98 0.88,0.48"],
  ["x", "0.24,0.48 0.76,0.98|0.76,0.48 0.24,0.98"],
  ["y", "0.24,0.48 0.50,0.78 0.76,0.48|0.50,0.78 0.36,1.08"],
  ["z", "0.24,0.48 0.76,0.48 0.24,0.98 0.76,0.98"],
];

function capitalStrokes(letter: string, path: string): Stroke[] {
  if (letter === "C") return [arc(0.52, 0.5, 0.34, 0.42, Math.PI * 0.55, Math.PI * 1.7)];
  if (letter === "G") return [arc(0.52, 0.5, 0.34, 0.42, Math.PI * 0.35, Math.PI * 1.7), line("0.52,0.50 0.82,0.50")[0]];
  if (letter === "O") return [ring(0.5, 0.5, 0.32, 0.42)];
  if (letter === "Q") return [ring(0.48, 0.46, 0.3, 0.38), line("0.62,0.68 0.86,0.96")[0]];
  if (letter === "S") return [arc(0.5, 0.28, 0.24, 0.2, Math.PI * 0.2, Math.PI * 1.15), arc(0.5, 0.7, 0.26, 0.22, Math.PI * 1.15, Math.PI * 2.15)];
  return line(path);
}

function smallStrokes(letter: string, path: string): Stroke[] {
  if (letter === "a") return [ring(0.52, 0.74, 0.2, 0.2), line("0.70,0.54 0.70,0.96")[0]];
  if (letter === "b") return [...line(path), ring(0.5, 0.74, 0.2, 0.2)];
  if (letter === "c") return [arc(0.52, 0.74, 0.2, 0.2, Math.PI * 0.4, Math.PI * 1.75)];
  if (letter === "d") return [...line(path), ring(0.5, 0.74, 0.2, 0.2)];
  if (letter === "e") return [line("0.32,0.74 0.74,0.74")[0], arc(0.52, 0.74, 0.2, 0.2, 0.1, Math.PI * 1.7)];
  if (letter === "g") return [ring(0.5, 0.68, 0.18, 0.16), line("0.68,0.56 0.68,0.92 0.46,1.08 0.28,0.92")[0]];
  if (letter === "h") return [...line(path), arc(0.5, 0.7, 0.2, 0.22, Math.PI, Math.PI * 2.05)];
  if (letter === "m") return [line("0.18,0.98 0.18,0.52")[0], arc(0.36, 0.72, 0.16, 0.2, Math.PI, Math.PI * 2), arc(0.66, 0.72, 0.16, 0.2, Math.PI, Math.PI * 2.05)];
  if (letter === "n") return [line("0.30,0.98 0.30,0.52")[0], arc(0.52, 0.72, 0.2, 0.22, Math.PI, Math.PI * 2.05)];
  if (letter === "o") return [ring(0.5, 0.74, 0.2, 0.22)];
  if (letter === "p") return [...line(path), ring(0.5, 0.7, 0.18, 0.18)];
  if (letter === "q") return [...line(path), ring(0.5, 0.7, 0.18, 0.18)];
  if (letter === "s") return [arc(0.5, 0.64, 0.16, 0.14, Math.PI * 0.15, Math.PI * 1.2), arc(0.5, 0.86, 0.16, 0.14, Math.PI * 1.15, Math.PI * 2.2)];
  return line(path);
}

const numbers: [string, Stroke[]][] = [
  ["0", [ring(0.5, 0.5, 0.28, 0.4)]],
  ["1", line("0.38,0.22 0.50,0.02 0.50,0.98|0.32,0.98 0.70,0.98")],
  ["2", line("0.22,0.28 0.38,0.04 0.68,0.04 0.82,0.22 0.22,0.98 0.84,0.98")],
  ["3", [arc(0.48, 0.28, 0.26, 0.2, Math.PI * 1.05, Math.PI * 2.15), arc(0.48, 0.72, 0.28, 0.22, Math.PI * 1.15, Math.PI * 2.2)]],
  ["4", line("0.72,0.98 0.72,0.02 0.16,0.62 0.84,0.62")],
  ["5", line("0.78,0.04 0.28,0.04 0.22,0.46 0.58,0.40 0.80,0.62 0.58,0.98 0.22,0.88")],
  ["6", [arc(0.5, 0.62, 0.28, 0.3, Math.PI * 0.85, Math.PI * 2.7), ring(0.5, 0.7, 0.22, 0.22)]],
  ["7", line("0.18,0.04 0.84,0.04 0.36,0.98")],
  ["8", [ring(0.5, 0.3, 0.22, 0.2), ring(0.5, 0.72, 0.26, 0.24)]],
  ["9", [ring(0.5, 0.32, 0.22, 0.22), ...line("0.70,0.32 0.70,0.86 0.46,0.98 0.26,0.82")]],
];

const lineItems: TraceItem[] = [
  { id: "vertical", label: "Vertical", strokes: line("0.50,0.04 0.50,0.96") },
  { id: "horizontal", label: "Horizontal", strokes: line("0.06,0.50 0.94,0.50") },
  { id: "slant-right", label: "Slant right", strokes: line("0.16,0.08 0.84,0.92") },
  { id: "slant-left", label: "Slant left", strokes: line("0.16,0.92 0.84,0.08") },
  { id: "zigzag", label: "Zigzag", strokes: line("0.08,0.28 0.28,0.72 0.48,0.28 0.68,0.72 0.88,0.28") },
  { id: "wave", label: "Wave", strokes: [wave(48, 252, 150, 36, 3)] },
  { id: "curve", label: "Curve", strokes: [arc(0.5, 0.72, 0.38, 0.42, Math.PI, Math.PI * 2)] },
  { id: "spiral", label: "Spiral", strokes: [spiral()] },
  { id: "cross", label: "Cross", strokes: line("0.50,0.12 0.50,0.88|0.16,0.50 0.84,0.50") },
  { id: "x-line", label: "X line", strokes: line("0.16,0.16 0.84,0.84|0.84,0.16 0.16,0.84") },
  { id: "loop", label: "Loop", strokes: [ring(0.5, 0.5, 0.28, 0.34)] },
  { id: "humps", label: "Humps", strokes: [wave(48, 252, 170, 42, 2)] },
  { id: "stairs", label: "Stairs", strokes: line("0.12,0.88 0.12,0.68 0.36,0.68 0.36,0.48 0.60,0.48 0.60,0.28 0.84,0.28 0.84,0.10") },
  { id: "hook", label: "Hook", strokes: line("0.62,0.08 0.38,0.08 0.28,0.22 0.28,0.78 0.48,0.96 0.72,0.78") },
  { id: "dots", label: "Dotted line", strokes: line("0.08,0.50 0.22,0.50|0.34,0.50 0.48,0.50|0.60,0.50 0.74,0.50|0.86,0.50 0.96,0.50") },
];

const shapeItems: TraceItem[] = [
  { id: "circle", label: "Circle", strokes: [ring(0.5, 0.5, 0.34, 0.38)] },
  { id: "square", label: "Square", strokes: line("0.18,0.16 0.82,0.16 0.82,0.84 0.18,0.84 0.18,0.16") },
  { id: "triangle", label: "Triangle", strokes: line("0.50,0.08 0.90,0.88 0.10,0.88 0.50,0.08") },
  { id: "rectangle", label: "Rectangle", strokes: line("0.10,0.28 0.90,0.28 0.90,0.74 0.10,0.74 0.10,0.28") },
  { id: "oval", label: "Oval", strokes: [ring(0.5, 0.5, 0.26, 0.4)] },
  { id: "diamond", label: "Diamond", strokes: line("0.50,0.06 0.88,0.50 0.50,0.94 0.12,0.50 0.50,0.06") },
  { id: "star", label: "Star", strokes: [star()] },
  { id: "heart", label: "Heart", strokes: [heart()] },
  { id: "pentagon", label: "Pentagon", strokes: [poly(5, 96)] },
  { id: "hexagon", label: "Hexagon", strokes: [poly(6, 96)] },
  { id: "semicircle", label: "Semicircle", strokes: [arc(0.5, 0.62, 0.36, 0.36, Math.PI, Math.PI * 2), line("0.14,0.62 0.86,0.62")[0]] },
  { id: "crescent", label: "Crescent", strokes: [arc(0.46, 0.5, 0.34, 0.4, Math.PI * 0.7, Math.PI * 1.55), arc(0.62, 0.5, 0.22, 0.3, Math.PI * 1.45, Math.PI * 0.75)] },
  { id: "arrow", label: "Arrow", strokes: line("0.12,0.50 0.78,0.50|0.58,0.28 0.86,0.50 0.58,0.72") },
];

function star(): Stroke {
  const points: Stroke = [];
  for (let i = 0; i <= 5; i += 1) {
    const outer = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    const inner = outer + Math.PI / 5;
    points.push([150 + Math.cos(outer) * 100, 156 + Math.sin(outer) * 100]);
    if (i < 5) points.push([150 + Math.cos(inner) * 42, 156 + Math.sin(inner) * 42]);
  }
  return points;
}

export const traceGroups: TraceGroup[] = [
  { id: "lines", label: "Lines", items: lineItems },
  {
    id: "abc",
    label: "ABC",
    items: capitals.map(([letter, path]) => ({ id: `up-${letter}`, label: letter, strokes: capitalStrokes(letter, path) })),
  },
  {
    id: "small",
    label: "abc",
    items: smalls.map(([letter, path]) => ({ id: `low-${letter}`, label: letter, strokes: smallStrokes(letter, path) })),
  },
  {
    id: "numbers",
    label: "123",
    items: numbers.map(([label, strokes]) => ({ id: `n-${label}`, label, strokes })),
  },
  { id: "shapes", label: "Shapes", items: shapeItems },
];
