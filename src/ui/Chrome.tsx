import type { ReactNode } from "react";

export function Mascot({ mood = "wave" }: { mood?: "wave" | "jump" | "think" }) {
  return (
    <svg className={`mascot ${mood}`} viewBox="0 0 120 120" aria-hidden>
      <polygon
        points="60,8 74,42 110,46 82,70 90,106 60,88 30,106 38,70 10,46 46,42"
        fill="#ffd43b"
        stroke="#f59f00"
        strokeWidth="4"
      />
      <circle cx="48" cy="62" r="4.5" fill="#3b2a4a" />
      <circle cx="72" cy="62" r="4.5" fill="#3b2a4a" />
      <path d="M48 76 Q60 88 72 76" fill="none" stroke="#3b2a4a" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Confetti() {
  const colors = ["#ff8a5b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff", "#ff6b9d"];
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 28 }, (_, index) => (
        <i
          key={index}
          style={{
            left: `${(index * 37) % 100}%`,
            background: colors[index % colors.length],
            animationDelay: `${(index % 8) * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

export function StarRow({ n }: { n: number }) {
  return (
    <span className="star-row" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span key={index} className={index < n ? "got" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

export function TopBar({
  tint,
  ink,
  emoji,
  title,
  eyebrow,
  onBack,
  muted,
  onToggleMute,
  extra,
}: {
  tint: string;
  ink: string;
  emoji?: string;
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  muted: boolean;
  onToggleMute: () => void;
  extra?: ReactNode;
}) {
  return (
    <header className="topbar" style={{ background: tint, color: ink }}>
      {onBack ? (
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Go back">
          ←
        </button>
      ) : (
        <span className="icon-spacer" />
      )}
      <div className="topbar-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>
          {emoji && <span aria-hidden>{emoji} </span>}
          {title}
        </h1>
      </div>
      {extra}
      <button type="button" className="icon-btn" onClick={onToggleMute} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
        {muted ? "🔇" : "🔊"}
      </button>
    </header>
  );
}
