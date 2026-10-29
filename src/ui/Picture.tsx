import { labelWord } from "../i18n";
import type { Bit, Opt, ShapeName, Side } from "../types";

function Face({ cx = 60, cy = 62 }: { cx?: number; cy?: number }) {
  return (
    <g>
      <circle cx={cx - 14} cy={cy - 6} r="4" fill="#3b2a4a" />
      <circle cx={cx + 14} cy={cy - 6} r="4" fill="#3b2a4a" />
      <path
        d={`M${cx - 12} ${cy + 8} Q${cx} ${cy + 18} ${cx + 12} ${cy + 8}`}
        fill="none"
        stroke="#3b2a4a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

export function ShapeIcon({ shape, className = "shape-svg" }: { shape: ShapeName; className?: string }) {
  switch (shape) {
    case "circle":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r="46" fill="#60a5fa" />
          <Face />
        </svg>
      );
    case "square":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <rect x="18" y="18" width="84" height="84" rx="16" fill="#34d399" />
          <Face />
        </svg>
      );
    case "triangle":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <polygon points="60,14 108,104 12,104" fill="#fb7185" />
          <Face cy={74} />
        </svg>
      );
    case "rectangle":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <rect x="10" y="34" width="100" height="54" rx="14" fill="#fbbf24" />
          <Face />
        </svg>
      );
    case "star":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <polygon points="60,8 73,42 110,46 82,70 90,106 60,88 30,106 38,70 10,46 47,42" fill="#facc15" />
          <Face cy={64} />
        </svg>
      );
    case "heart":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <path
            d="M60 102 C20 70 14 42 34 30 C48 22 58 30 60 40 C62 30 72 22 86 30 C106 42 100 70 60 102Z"
            fill="#fb7185"
          />
          <Face cy={58} />
        </svg>
      );
    case "oval":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <ellipse cx="60" cy="60" rx="40" ry="50" fill="#c4b5fd" />
          <Face />
        </svg>
      );
    case "diamond":
      return (
        <svg className={className} viewBox="0 0 120 120" aria-hidden>
          <polygon points="60,10 108,60 60,110 12,60" fill="#38bdf8" />
          <Face />
        </svg>
      );
    default:
      return null;
  }
}

function Cluster({ emoji, n }: { emoji: string; n: number }) {
  return (
    <div className={`cluster ${n === 1 ? "one" : ""}`}>
      {Array.from({ length: n }, (_, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
          {emoji}
        </span>
      ))}
    </div>
  );
}

export function Picture({ bit }: { bit: Bit }) {
  let art = <span className="hero-emoji">{bit.emoji || "⭐"}</span>;
  if (bit.shape) art = <ShapeIcon shape={bit.shape} />;
  else if (bit.letter) {
    art = (
      <div className="letter-art">
        <b>{bit.letter}</b>
        <span>{bit.emoji}</span>
      </div>
    );
  } else if (bit.count) {
    art = (
      <div className="count-block">
        <b>{bit.word}</b>
        <Cluster emoji={bit.emoji} n={bit.count} />
      </div>
    );
  } else if (bit.swatch) {
    art = (
      <div className="blob" style={{ background: bit.swatch }}>
        <i className="eye left" />
        <i className="eye right" />
        <i className="smile" />
        {bit.emoji && <span className="blob-emoji">{bit.emoji}</span>}
      </div>
    );
  }

  return (
    <div className="stage-art" style={{ background: bit.tint }}>
      <span className="art-cloud one">☁️</span>
      <span className="art-cloud two">☁️</span>
      <span className="art-sun">☀️</span>
      {art}
      <span className="art-grass" />
    </div>
  );
}

export function ChoiceArt({ opt, shadow = false }: { opt: Opt; shadow?: boolean }) {
  if (opt.shape) return <ShapeIcon shape={opt.shape} className="shape-svg small" />;
  if (opt.swatch) {
    return (
      <span className="choice-swatch" style={{ background: opt.swatch }}>
        <span>{opt.emoji}</span>
      </span>
    );
  }
  return <span className={`opt-emoji ${shadow ? "as-shadow" : ""}`}>{opt.emoji}</span>;
}

export function SideFace({ side, onPress }: { side: Side; onPress: () => void }) {
  return (
    <button type="button" className={`side motion-${side.motion ?? "still"}`} onClick={onPress}>
      {side.count ? (
        <span className="side-cluster">
          {Array.from({ length: side.count }, (_, index) => (
            <span key={index}>{side.emoji}</span>
          ))}
        </span>
      ) : (
        <span className="side-emoji">{side.emoji}</span>
      )}
      <b>{labelWord(side.word)}</b>
    </button>
  );
}
