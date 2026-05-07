import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── THEME ─────────────────────────────────────────────────────────────────────
const TH = {
  bg: "#f7f6f2", card: "#ffffff", border: "#e0ddd6",
  text: "#111111", sub: "#2d2d2d", muted: "#888888",
  input: "#ffffff", inputBorder: "#cccccc", inputText: "#111111",
  accent: "#7B2FFF", red: "#c0392b", green: "#1e7e34",
  gold: "#b7950b", blue: "#1a6faf", divider: "#e0ddd6",
};

const NAV_ITEMS = ["Home", "Local News", "Schools", "Sports", "Events", "Weather", "Student Spotlight"];
const CATS = ["Local News", "Schools", "Sports", "Events", "Weather", "Opinion", "Student Spotlight"];
const CAT_COLOR = {
  "Local News": "#c0392b", "Schools": "#1a6faf", "Sports": "#1e7e34",
  "Events": "#7d3c98", "Weather": "#d35400", "Opinion": "#2c3e50", "Student Spotlight": "#b7950b",
};
const WX_CODES = {
  0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 51: "Light Drizzle", 53: "Drizzle", 61: "Light Rain",
  63: "Rain", 65: "Heavy Rain", 71: "Light Snow", 73: "Snow", 80: "Showers", 95: "Thunderstorm",
};
const WX_EMOJI = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 51: "🌦️",
  53: "🌦️", 61: "🌧️", 63: "🌧️", 65: "🌧️", 71: "❄️", 73: "❄️", 80: "🌦️", 95: "⛈️",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TICKER_ITEMS = [
  "KrynoluxDC — Youth-led news for the DMV",
  "Covering Fairfax, Loudoun, and Washington DC",
  "Submit your story at krynolux.work",
  "News by kids. For the community.",
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function readingTime(body) {
  if (!body) return "1 min read";
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200)) + " min read";
}

async function sendEmail(payload) {
  try {
    const { error } = await supabase.functions.invoke("notify-writer", {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    return !error;
  } catch {
    return false;
  }
}

// ── BASE COMPONENTS ───────────────────────────────────────────────────────────
function Logo({ size = 40, circle = false }) {
  const [err, setErr] = useState(false);
  const radius = circle ? "50%" : 6;
  if (err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius,
        background: `linear-gradient(135deg, ${TH.accent}, #3b82f6)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: size * 0.5, color: "#fff",
        flexShrink: 0, fontFamily: "Georgia,serif",
      }}>K</div>
    );
  }
  return (
    <img
      src={circle ? "/logo-circle.png" : "/logo-square.jpg"}
      alt="KrynoluxDC"
      onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", flexShrink: 0, display: "block" }}
    />
  );
}

function CatBadge({ cat, large = false }) {
  const color = CAT_COLOR[cat] || TH.muted;
  return (
    <span style={{
      fontFamily: "Inter,sans-serif",
      fontSize: large ? 11 : 10,
      fontWeight: 800,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color,
      borderBottom: `2px solid ${color}`,
      paddingBottom: 1,
    }}>{cat}</span>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0 20px" }}>
      <div style={{ flex: 1, height: 1, background: TH.divider }} />
      {label && (
        <span style={{
          fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800,
          letterSpacing: 2, textTransform: "uppercase", color: TH.muted, whiteSpace: "nowrap",
        }}>{label}</span>
      )}
      <div style={{ flex: 1, height: 1, background: TH.divider }} />
    </div>
  );
}

function SideLabel({ children }) {
  return (
    <div style={{
      fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800,
      letterSpacing: 1.5, textTransform: "uppercase", color: TH.muted,
      marginBottom: 14, paddingBottom: 10,
      borderBottom: `2px solid ${TH.text}`,
    }}>{children}</div>
  );
}

// ── TICKER BAR ────────────────────────────────────────────────────────────────
function TickerBar() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(x => (x + 1) % TICKER_ITEMS.length);
        setFade(true);
      }, 350);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#0f0f0f", padding: "7px 0", borderBottom: `2px solid ${TH.accent}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{
          background: TH.accent, color: "#fff", fontSize: 9, fontWeight: 900,
          padding: "3px 8px", letterSpacing: 1.5, textTransform: "uppercase",
          whiteSpace: "nowrap", fontFamily: "Inter,sans-serif", flexShrink: 0,
        }}>Breaking</span>
        <span style={{
          color: "#bbbbbb", fontSize: 12.5, fontFamily: "Inter,sans-serif",
          opacity: fade ? 1 : 0, transition: "opacity 0.35s ease",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          letterSpacing: 0.2,
        }}>{TICKER_ITEMS[idx]}</span>
      </div>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ nav, setNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 300,
      background: TH.card,
      borderBottom: `1px solid ${TH.border}`,
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.09)" : "none",
      transition: "box-shadow 0.3s",
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 0", borderBottom: `1px solid ${TH.divider}`,
          gap: 12, flexWrap: "wrap",
        }}>
          {/* Logo + wordmark */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flexShrink: 0 }}
            onClick={() => { setNav("Home"); setMenuOpen(false); }}
          >
            <Logo size={46} />
            <div>
              <div style={{
                fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 24,
                color: TH.text, letterSpacing: -0.5, lineHeight: 1,
              }}>
                Krynolux<span style={{ color: TH.accent }}>DC</span>
              </div>
              <div style={{
                fontFamily: "Inter,sans-serif", fontSize: 9, color: TH.muted,
                letterSpacing: 1.6, textTransform: "uppercase", marginTop: 3,
              }}>News by Kids. For the Community.</div>
            </div>
          </div>

          {/* Date + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="date-desktop" style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted }}>
              {today}
            </span>
            <button
              onClick={() => { setNav("Submit"); setMenuOpen(false); }}
              style={{
                background: TH.accent, border: "none", color: "#fff",
                padding: "9px 18px", cursor: "pointer", fontSize: 12,
                fontWeight: 700, fontFamily: "Inter,sans-serif",
                letterSpacing: 0.3,
              }}
            >Submit a Story</button>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              style={{
                background: "none", border: `1px solid ${TH.border}`,
                padding: "6px 10px", cursor: "pointer", display: "flex",
                flexDirection: "column", gap: 4, alignItems: "center",
              }}
              aria-label="Menu"
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: "block", width: 18, height: 2, background: TH.text }} />
              ))}
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <nav style={{ display: "flex", overflowX: "auto", gap: 0, msOverflowStyle: "none", scrollbarWidth: "none" }}>
          {NAV_ITEMS.map(n => {
            const active = nav === n;
            return (
              <button
                key={n}
                onClick={() => { setNav(n); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="nav-link"
                style={{
                  padding: "11px 15px",
                  background: "none", border: "none",
                  borderBottom: active ? `3px solid ${TH.accent}` : "3px solid transparent",
                  color: active ? TH.accent : TH.muted,
                  cursor: "pointer",
                  fontSize: 11.5, fontWeight: active ? 700 : 500,
                  whiteSpace: "nowrap", fontFamily: "Inter,sans-serif",
                  letterSpacing: 0.5, textTransform: "uppercase",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >{n}</button>
            );
          })}
        </nav>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: TH.card, borderTop: `1px solid ${TH.border}`,
          borderBottom: `2px solid ${TH.accent}`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)", zIndex: 400, padding: "8px 0",
        }}>
          {[...NAV_ITEMS, ["About", "About"], ["Contact", "Contact"]].map(item => {
            const label = Array.isArray(item) ? item[0] : item;
            const key = Array.isArray(item) ? item[1] : item;
            return (
              <button
                key={key}
                onClick={() => { setNav(key); setMenuOpen(false); window.scrollTo(0, 0); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "12px 24px", background: "none", border: "none",
                  fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.text,
                  cursor: "pointer", borderBottom: `1px solid ${TH.divider}`,
                }}
              >{label}</button>
            );
          })}
        </div>
      )}
    </header>
  );
}

// ── ARTICLE MODAL ─────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (article) {
      document.body.style.overflow = "hidden";
      scrollRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [article]);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!article) return null;
  const a = article;
  const initials = (a.name || "K").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClose}
      className="modal-backdrop"
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        zIndex: 1000, display: "flex", alignItems: "flex-start",
        justifyContent: "center", padding: "32px 20px",
        overflowY: "auto",
      }}
    >
      <div
        ref={scrollRef}
        onClick={e => e.stopPropagation()}
        className="modal-card"
        style={{
          background: TH.card, width: "100%", maxWidth: 760,
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)", position: "relative",
        }}
      >
        {/* X close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 10,
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(0,0,0,0.45)", border: "none",
            color: "#fff", fontSize: 18, lineHeight: 1,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label="Close"
        >×</button>

        {/* Cover image */}
        {a.image_url ? (
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src={a.image_url} alt={a.headline}
              style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
            }} />
          </div>
        ) : (
          <div style={{
            width: "100%", height: 80,
            background: `linear-gradient(135deg, ${CAT_COLOR[a.category] || TH.accent}22, ${TH.bg})`,
            borderBottom: `3px solid ${CAT_COLOR[a.category] || TH.accent}`,
          }} />
        )}

        <div style={{ padding: "32px 44px 44px" }}>
          <div style={{ marginBottom: 14 }}>
            <CatBadge cat={a.category || "News"} large />
          </div>
          <h1 style={{
            fontFamily: "Georgia,serif", fontSize: 30, fontWeight: 700,
            color: TH.text, lineHeight: 1.2, margin: "0 0 20px",
          }}>{a.headline || "Untitled"}</h1>

          {/* Byline */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            paddingBottom: 20, marginBottom: 24,
            borderBottom: `1px solid ${TH.divider}`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: CAT_COLOR[a.category] || TH.text,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
              fontFamily: "Georgia,serif",
            }}>{initials}</div>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 14, color: TH.text }}>
                By {a.name || "KrynoluxDC"}
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, marginTop: 2 }}>
                {a.school ? a.school + " · " : ""}{fmtDate(a.created_at)} · {readingTime(a.body)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{
            fontFamily: "Georgia,serif", fontSize: 18, color: TH.sub,
            lineHeight: 1.9, whiteSpace: "pre-wrap",
          }}>
            {a.body || "No content available."}
          </div>

          <div style={{ marginTop: 36, paddingTop: 20, borderTop: `1px solid ${TH.divider}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={onClose}
              style={{
                background: "none", border: `1px solid ${TH.border}`,
                padding: "9px 22px", color: TH.muted, cursor: "pointer",
                fontSize: 13, fontFamily: "Inter,sans-serif",
              }}
            >← Back</button>
            <button
              onClick={async () => {
                const url = window.location.href;
                const text = `${a.headline} — KrynoluxDC`;
                if (navigator.share) {
                  await navigator.share({ title: a.headline, text, url }).catch(() => {});
                } else {
                  await navigator.clipboard.writeText(url);
                  alert("Link copied to clipboard!");
                }
              }}
              style={{
                background: TH.accent, border: "none",
                padding: "9px 22px", color: "#fff", cursor: "pointer",
                fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 700,
              }}
            >Share ↗</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NEWS CARDS ────────────────────────────────────────────────────────────────
function HeroCard({ article, onClick }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const a = article;
  return (
    <div
      onClick={() => onClick(a)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="card-click"
      style={{ cursor: "pointer", position: "relative", overflow: "hidden", background: TH.text }}
    >
      {a.image_url && !imgErr ? (
        <img
          src={a.image_url} alt={a.headline}
          onError={() => setImgErr(true)}
          style={{
            width: "100%", height: 480, objectFit: "cover", display: "block",
            transform: hov ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.6s ease", opacity: 0.85,
          }}
        />
      ) : (
        <div style={{
          width: "100%", height: 480, background: `linear-gradient(135deg, #1a1a2e, #16213e)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 80, opacity: 0.08 }}>📰</span>
        </div>
      )}
      {/* Overlay gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 36px 32px" }}>
        <div style={{ marginBottom: 10 }}>
          <span style={{
            background: CAT_COLOR[a.category] || TH.accent,
            color: "#fff", fontSize: 10, fontWeight: 800,
            padding: "4px 10px", letterSpacing: 1.2, textTransform: "uppercase",
            fontFamily: "Inter,sans-serif",
          }}>{a.category || "News"}</span>
        </div>
        <h2 style={{
          fontFamily: "Georgia,serif", fontSize: "clamp(22px, 3vw, 32px)",
          fontWeight: 700, color: "#fff", lineHeight: 1.2,
          margin: "0 0 12px", maxWidth: 640,
          textDecoration: hov ? "underline" : "none",
          textDecorationColor: "rgba(255,255,255,0.5)",
        }}>{a.headline || "Untitled"}</h2>
        {a.body && (
          <p style={{
            fontFamily: "Georgia,serif", fontSize: 15, color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6, margin: "0 0 14px", maxWidth: 560,
          }}>{a.body.slice(0, 160)}…</p>
        )}
        <div style={{
          fontFamily: "Inter,sans-serif", fontSize: 12,
          color: "rgba(255,255,255,0.55)", display: "flex", gap: 8, alignItems: "center",
        }}>
          <span>By {a.name || "KrynoluxDC"}</span>
          {a.school && <><span style={{ opacity: 0.4 }}>·</span><span>{a.school}</span></>}
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{fmtDate(a.created_at)}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{readingTime(a.body)}</span>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, onClick, horizontal = false }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const a = article;

  if (horizontal) {
    return (
      <div
        onClick={() => onClick(a)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="card-click"
        style={{
          cursor: "pointer", display: "flex", gap: 14, padding: "14px 0",
          borderBottom: `1px solid ${TH.divider}`, alignItems: "flex-start",
        }}
      >
        {a.image_url && !imgErr && (
          <div style={{ width: 80, height: 64, flexShrink: 0, overflow: "hidden" }}>
            <img
              src={a.image_url} alt=""
              onError={() => setImgErr(true)}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s",
              }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 5 }}><CatBadge cat={a.category || "News"} /></div>
          <h4 style={{
            fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700,
            color: TH.text, lineHeight: 1.35, margin: 0,
            textDecoration: hov ? "underline" : "none",
          }}>{a.headline || "Untitled"}</h4>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted, marginTop: 5 }}>
            {a.name || "KrynoluxDC"} · {readingTime(a.body)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(a)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="card-click"
      style={{
        cursor: "pointer", background: TH.card,
        border: `1px solid ${TH.border}`,
        display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: hov ? "0 6px 24px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ overflow: "hidden", flexShrink: 0 }}>
        {a.image_url && !imgErr ? (
          <img
            src={a.image_url} alt={a.headline}
            onError={() => setImgErr(true)}
            style={{
              width: "100%", height: 180, objectFit: "cover", display: "block",
              transform: hov ? "scale(1.04)" : "scale(1)", transition: "transform 0.4s ease",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: 180,
            background: `linear-gradient(135deg, ${CAT_COLOR[a.category] || TH.accent}15, ${TH.bg})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderBottom: `3px solid ${CAT_COLOR[a.category] || TH.accent}33`,
          }}>
            <span style={{ fontSize: 36, opacity: 0.12 }}>📰</span>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 8 }}><CatBadge cat={a.category || "News"} /></div>
        <h3 style={{
          fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 700,
          color: TH.text, lineHeight: 1.3, margin: "0 0 10px",
          textDecoration: hov ? "underline" : "none",
        }}>{a.headline || "Untitled"}</h3>
        {a.body && (
          <p style={{
            fontFamily: "Georgia,serif", fontSize: 13.5, color: TH.sub,
            lineHeight: 1.65, margin: "0 0 auto", flex: 1,
          }}>{a.body.slice(0, 110)}…</p>
        )}
        <div style={{
          fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted,
          marginTop: 14, paddingTop: 12, borderTop: `1px solid ${TH.divider}`,
          display: "flex", justifyContent: "space-between",
        }}>
          <span><strong style={{ color: TH.sub }}>{a.name || "KrynoluxDC"}</strong>{a.school ? ` · ${a.school}` : ""}</span>
          <span>{readingTime(a.body)}</span>
        </div>
      </div>
    </div>
  );
}

// ── WEATHER WIDGET ────────────────────────────────────────────────────────────
function WeatherWidget() {
  const [wx, setWx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=38.8462&longitude=-77.3064" +
      "&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode" +
      "&temperature_unit=fahrenheit&forecast_days=5&timezone=America%2FNew_York"
    )
      .then(r => r.json())
      .then(d => { setWx(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const temp = wx ? Math.round(wx.current.temperature_2m) : "--";
  const code = wx?.current?.weathercode ?? 0;

  return (
    <div style={{ background: TH.card, border: `1px solid ${TH.border}` }}>
      <div style={{
        padding: "10px 16px", borderBottom: `1px solid ${TH.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <SideLabel>DMV Weather</SideLabel>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        {loading ? (
          <div style={{ color: TH.muted, fontSize: 13, fontFamily: "Inter,sans-serif", padding: "10px 0" }}>
            Loading weather…
          </div>
        ) : !wx ? (
          <div style={{ color: TH.muted, fontSize: 13, fontFamily: "Inter,sans-serif" }}>Unavailable</div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 42, fontWeight: 700, color: TH.text, lineHeight: 1 }}>
                  {temp}°
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, marginTop: 4 }}>
                  {WX_CODES[code] || "Clear"} · Fairfax, VA
                </div>
              </div>
              <span style={{ fontSize: 44 }}>{WX_EMOJI[code] || "🌤️"}</span>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {wx.daily.time.slice(0, 5).map((date, i) => {
                const d = new Date(date);
                return (
                  <div key={date} style={{
                    flex: 1, textAlign: "center",
                    background: i === 0 ? `${TH.accent}10` : TH.bg,
                    padding: "8px 2px",
                    border: `1px solid ${i === 0 ? TH.accent + "40" : TH.border}`,
                  }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: i === 0 ? TH.accent : TH.muted, textTransform: "uppercase", fontWeight: i === 0 ? 700 : 400 }}>
                      {i === 0 ? "Now" : DAYS[d.getDay()]}
                    </div>
                    <div style={{ fontSize: 16, margin: "4px 0" }}>{WX_EMOJI[wx.daily.weathercode[i]] || "🌤️"}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, color: TH.text }}>
                      {Math.round(wx.daily.temperature_2m_max[i])}°
                    </div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: TH.muted }}>
                      {Math.round(wx.daily.temperature_2m_min[i])}°
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── POLL ──────────────────────────────────────────────────────────────────────
function Poll() {
  const [voted, setVoted] = useState(null);
  const opts = ["Climate & Environment", "School Policies", "Local Sports", "Youth Entrepreneurs"];
  const votes = [340, 280, 190, 210];
  const total = votes.reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: TH.card, border: `1px solid ${TH.border}` }}>
      <div style={{ padding: "10px 16px 0" }}>
        <SideLabel>Reader Poll</SideLabel>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <p style={{
          fontFamily: "Georgia,serif", fontSize: 15.5, fontWeight: 700,
          color: TH.text, marginBottom: 16, lineHeight: 1.4,
        }}>What should we cover more?</p>
        {opts.map((o, i) => {
          const pct = Math.round((votes[i] / total) * 100);
          const active = voted === i;
          return (
            <div
              key={o}
              onClick={() => setVoted(i)}
              style={{ marginBottom: 12, cursor: "pointer" }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "Inter,sans-serif", fontSize: 12,
                color: active ? TH.accent : TH.sub,
                fontWeight: active ? 700 : 400, marginBottom: 5,
              }}>
                <span>{o}</span>
                <span style={{ fontWeight: 700 }}>{voted !== null ? `${pct}%` : ""}</span>
              </div>
              <div style={{ background: TH.bg, border: `1px solid ${TH.border}`, height: 6, overflow: "hidden" }}>
                <div style={{
                  width: voted !== null ? `${pct}%` : "0%",
                  height: "100%",
                  background: active ? TH.accent : (CAT_COLOR[opts[i]] || TH.muted),
                  transition: "width 0.6s ease, background 0.3s",
                }} />
              </div>
            </div>
          );
        })}
        {voted !== null ? (
          <p style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.green, marginTop: 10, fontWeight: 600 }}>
            ✓ Thanks for voting! Results updated.
          </p>
        ) : (
          <p style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted, marginTop: 6 }}>
            Click an option to vote
          </p>
        )}
      </div>
    </div>
  );
}

// ── SUBMIT PAGE ───────────────────────────────────────────────────────────────
const STEP_LABELS = ["Your Info", "Your Story", "Review"];
const INP = {
  width: "100%", padding: "11px 14px",
  border: `1px solid ${TH.inputBorder}`, fontSize: 14,
  outline: "none", boxSizing: "border-box", marginBottom: 4,
  fontFamily: "Inter,sans-serif", color: TH.inputText,
  background: TH.input, display: "block", borderRadius: 3,
};

function FieldLabel({ children, required, muted }) {
  return (
    <label style={{
      fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800,
      color: muted ? TH.muted : (required ? TH.red : TH.sub),
      display: "block", marginBottom: 6,
      textTransform: "uppercase", letterSpacing: 0.9,
    }}>{children}{required ? " *" : ""}</label>
  );
}

function SubmitPage({ setNav }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [refId] = useState(() => "KDC-" + Date.now().toString().slice(-6));
  const [form, setForm] = useState({ name: "", school: "", email: "", headline: "", cat: "", body: "" });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length;

  function validate1() {
    if (!form.name.trim()) { setErr("Please enter your name."); return false; }
    if (!form.email.trim()) { setErr("Email address is required."); return false; }
    if (!form.email.includes("@")) { setErr("Please enter a valid email address."); return false; }
    setErr(""); return true;
  }

  function validate2() {
    if (!form.headline.trim()) { setErr("Please add a headline."); return false; }
    if (!form.body.trim()) { setErr("Please write your article."); return false; }
    setErr(""); return true;
  }

  function next() {
    if (step === 1 && !validate1()) return;
    if (step === 2 && !validate2()) return;
    if (step < 3) setStep(s => s + 1);
  }

  async function submit() {
    setLoading(true); setErr("");
    const { error } = await supabase.from("submissions").insert([{
      name: form.name.trim(), school: form.school.trim(), email: form.email.trim(),
      headline: form.headline.trim(), category: form.cat, body: form.body.trim(), status: "pending",
    }]);
    if (error) { setErr("Submission failed: " + error.message); setLoading(false); return; }
    await sendEmail({ email: form.email, name: form.name || "Writer", headline: form.headline || "Your article", status: "received", reason: "" });
    setLoading(false); setDone(true);
  }

  if (done) {
    return (
      <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `${TH.green}15`, border: `2px solid ${TH.green}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 32,
        }}>✓</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 700, color: TH.text, marginBottom: 12 }}>
          Story Received!
        </h2>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 15, color: TH.sub, lineHeight: 1.8, marginBottom: 24 }}>
          Thank you for submitting to KrynoluxDC. Our editorial team reviews all stories within 48 hours.
          A confirmation was sent to <strong style={{ color: TH.text }}>{form.email}</strong>.
        </p>
        <div style={{
          background: TH.bg, border: `1px solid ${TH.border}`, borderRadius: 4,
          padding: "14px 20px", marginBottom: 28,
          fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.muted,
        }}>
          Reference: <strong style={{ color: TH.text, letterSpacing: 1 }}>{refId}</strong>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => { setDone(false); setStep(1); setForm({ name: "", school: "", email: "", headline: "", cat: "", body: "" }); setErr(""); }}
            style={{ padding: "11px 24px", background: TH.text, border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 700 }}
          >Submit Another Story</button>
          <button
            onClick={() => setNav("Home")}
            style={{ padding: "11px 24px", background: "none", border: `1px solid ${TH.border}`, color: TH.sub, cursor: "pointer", fontSize: 13, fontFamily: "Inter,sans-serif" }}
          >Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px 80px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 36, paddingBottom: 20, borderBottom: `2px solid ${TH.text}` }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: TH.accent, marginBottom: 10 }}>
          Submit a Story
        </div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: TH.text, margin: "0 0 10px" }}>
          Share Your Story with the DMV
        </h1>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.muted, lineHeight: 1.7, margin: 0 }}>
          All submissions are reviewed by our editorial team. You'll receive a confirmation immediately and an update when your story is reviewed.
        </p>
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", gap: 0, marginBottom: 36 }}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done_ = step > n;
          const active = step === n;
          return (
            <div key={n} style={{ flex: 1, paddingRight: i < 2 ? 6 : 0 }}>
              <div style={{
                height: 4, marginBottom: 8, borderRadius: 2,
                background: done_ ? TH.green : active ? TH.accent : TH.divider,
                transition: "background 0.4s",
              }} />
              <div style={{
                fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: active || done_ ? 700 : 400,
                color: done_ ? TH.green : active ? TH.accent : TH.muted,
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                {done_ ? "✓ " : ""}{label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: TH.card, border: `1px solid ${TH.border}`, padding: "32px 36px" }}>
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: TH.text, marginBottom: 24 }}>About You</h3>
            <FieldLabel muted>Full Name</FieldLabel>
            <input value={form.name} onChange={e => { set("name", e.target.value); setErr(""); }} placeholder="Your full name" style={INP} />
            <div style={{ marginBottom: 12 }} />
            <FieldLabel muted>School or Organization</FieldLabel>
            <input value={form.school} onChange={e => set("school", e.target.value)} placeholder="e.g. Thomas Jefferson High School" style={INP} />
            <div style={{ marginBottom: 12 }} />
            <FieldLabel required>Email Address</FieldLabel>
            <input value={form.email} onChange={e => { set("email", e.target.value); setErr(""); }} placeholder="your@email.com" type="email" style={{ ...INP, borderColor: err && err.includes("email") ? TH.red : TH.inputBorder }} />
            <div style={{
              background: "#f0faf4", border: `1px solid ${TH.green}33`,
              borderLeft: `3px solid ${TH.green}`, padding: "10px 14px", marginTop: 8, borderRadius: 2,
            }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.green, fontWeight: 600 }}>
                📧 We'll email you a confirmation right away and notify you when your story is reviewed.
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: TH.text, marginBottom: 24 }}>Your Story</h3>
            <FieldLabel required>Headline</FieldLabel>
            <input value={form.headline} onChange={e => { set("headline", e.target.value); setErr(""); }} placeholder="A clear, descriptive headline" style={INP} />
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted, marginBottom: 16 }}>
              {form.headline.length}/100 characters
            </div>
            <FieldLabel muted>Category</FieldLabel>
            <select value={form.cat} onChange={e => set("cat", e.target.value)} style={{ ...INP, marginBottom: 16, color: form.cat ? TH.inputText : TH.muted }}>
              <option value="">Select a category…</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <FieldLabel required>Article</FieldLabel>
            <textarea
              value={form.body}
              onChange={e => { set("body", e.target.value); setErr(""); }}
              placeholder="Write your full article or story pitch here. The more detail, the better!"
              rows={9}
              style={{ ...INP, resize: "vertical", fontFamily: "Georgia,serif", lineHeight: 1.85, fontSize: 15.5 }}
            />
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: wordCount > 50 ? TH.green : TH.muted, marginTop: 4 }}>
              {wordCount} words{wordCount > 0 && wordCount < 50 ? " — aim for at least 50" : ""}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: TH.text, marginBottom: 24 }}>Review & Submit</h3>
            <div style={{ background: TH.bg, border: `1px solid ${TH.border}`, padding: "4px 0", marginBottom: 20 }}>
              {[["Name", form.name], ["School", form.school], ["Email", form.email], ["Headline", form.headline], ["Category", form.cat || "None selected"]].map(([label, val]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", gap: 20,
                  padding: "11px 18px", borderBottom: `1px solid ${TH.divider}`,
                }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 800, color: TH.muted, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: val ? TH.text : TH.muted, textAlign: "right" }}>{val || "—"}</span>
                </div>
              ))}
              <div style={{ padding: "11px 18px" }}>
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 800, color: TH.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Article</span>
                <p style={{ fontFamily: "Georgia,serif", fontSize: 13, color: TH.sub, lineHeight: 1.6, margin: "8px 0 0" }}>{form.body.slice(0, 200)}{form.body.length > 200 ? "…" : ""}</p>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted, marginTop: 4 }}>{wordCount} words</div>
              </div>
            </div>
            <div style={{
              background: "#f0faf4", border: `1px solid ${TH.green}33`,
              borderLeft: `3px solid ${TH.green}`, padding: "12px 16px", marginBottom: 16, borderRadius: 2,
            }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.green, fontWeight: 700 }}>
                📧 Confirmation sent to: {form.email}
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, marginTop: 3 }}>
                You'll also be notified when your story is approved or reviewed.
              </div>
            </div>
            <p style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, lineHeight: 1.7, margin: 0 }}>
              By submitting you agree to KrynoluxDC's editorial guidelines and community standards.
            </p>
          </div>
        )}

        {err && (
          <div style={{
            background: "#fdf0f0", border: `1px solid ${TH.red}33`,
            borderLeft: `3px solid ${TH.red}`, padding: "10px 14px",
            marginTop: 16, borderRadius: 2,
          }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.red, fontWeight: 600 }}>⚠ {err}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          {step > 1 && (
            <button
              onClick={() => { setStep(s => s - 1); setErr(""); }}
              style={{
                flex: 1, padding: "12px", background: TH.bg,
                border: `1px solid ${TH.border}`, color: TH.sub,
                cursor: "pointer", fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 500,
              }}
            >← Back</button>
          )}
          <button
            onClick={step < 3 ? next : submit}
            disabled={loading}
            style={{
              flex: 2, padding: "12px",
              background: loading ? TH.muted : step === 3 ? TH.green : TH.accent,
              border: "none", color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 700,
              letterSpacing: 0.3, transition: "background 0.2s",
            }}
          >
            {loading ? "Submitting…" : step === 3 ? "Submit Story →" : `Continue to ${STEP_LABELS[step]} →`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── STATIC PAGES ──────────────────────────────────────────────────────────────
function StaticPage({ section, title, children }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "52px 24px 80px" }}>
      <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: `2px solid ${TH.text}` }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: TH.accent, marginBottom: 10 }}>
          {section}
        </div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 36, fontWeight: 700, color: TH.text, margin: 0 }}>
          {title}
        </h1>
      </div>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 17, color: TH.sub, lineHeight: 1.95 }}>
        {children}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <StaticPage section="About Us" title="About KrynoluxDC">
      <p style={{ marginBottom: 22 }}>KrynoluxDC is the DMV's first youth-led digital news organization. We cover local news, schools, sports, events, and community stories across Fairfax County, Loudoun County, and Washington DC.</p>
      <p style={{ marginBottom: 22 }}>Every article published on KrynoluxDC is written by a student journalist and reviewed by our editorial team before going live — ensuring accuracy, fairness, and community relevance.</p>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, color: TH.text, margin: "36px 0 14px", paddingBottom: 10, borderBottom: `1px solid ${TH.divider}` }}>Our Mission</h2>
      <p>To give young journalists a credible platform to report on the stories that matter most to their generation and their community across the DMV.</p>
    </StaticPage>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSend() {
    if (!form.name.trim()) { setErr("Please enter your name."); return; }
    if (!form.email.includes("@")) { setErr("Please enter a valid email address."); return; }
    if (!form.message.trim()) { setErr("Please write a message."); return; }
    setLoading(true); setErr("");

    await supabase.from("contacts").insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }]);

    await sendEmail({
      status: "contact",
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });

    setLoading(false);
    setSent(true);
  }

  return (
    <StaticPage section="Get in Touch" title="Contact KrynoluxDC">
      <p style={{ marginBottom: 28 }}>Have a story tip, question, or want to partner with us? Reach out below.</p>
      {sent ? (
        <div style={{
          background: "#f0faf4", border: `1px solid ${TH.green}40`,
          borderLeft: `4px solid ${TH.green}`, padding: "20px 24px", borderRadius: 3,
        }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, color: TH.green, fontSize: 15, marginBottom: 4 }}>✓ Message sent!</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.muted }}>We'll get back to you at <strong>{form.email}</strong>.</div>
        </div>
      ) : (
        <div style={{ background: TH.card, border: `1px solid ${TH.border}`, padding: "32px 36px", marginBottom: 24 }}>
          <div style={{ marginBottom: 18 }}>
            <FieldLabel muted>Your Name</FieldLabel>
            <input
              type="text" placeholder="Full name" value={form.name}
              onChange={e => { set("name", e.target.value); setErr(""); }}
              style={INP}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <FieldLabel muted>Email</FieldLabel>
            <input
              type="email" placeholder="your@email.com" value={form.email}
              onChange={e => { set("email", e.target.value); setErr(""); }}
              style={INP}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <FieldLabel muted>Message</FieldLabel>
            <textarea
              placeholder="Your message…" rows={5} value={form.message}
              onChange={e => { set("message", e.target.value); setErr(""); }}
              style={{ ...INP, resize: "vertical" }}
            />
          </div>
          {err && (
            <div style={{
              background: "#fdf0f0", borderLeft: `3px solid ${TH.red}`,
              padding: "10px 14px", marginBottom: 14, borderRadius: 2,
              fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.red,
            }}>⚠ {err}</div>
          )}
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "11px 26px", background: loading ? TH.muted : TH.text,
              border: "none", color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 700,
            }}
          >{loading ? "Sending…" : "Send Message"}</button>
        </div>
      )}
      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.muted, marginTop: 20 }}>
        📧 <strong style={{ color: TH.text }}>contact@krynolux.work</strong> · Fairfax · Loudoun · Washington DC
      </p>
    </StaticPage>
  );
}

function PrivacyPage() {
  const sections = [
    ["Information We Collect", "We collect information you provide when submitting stories including your name, school, and email address. This is used solely to process your submission and contact you about it."],
    ["How We Use Information", "Your information is used to review and publish articles and to contact contributors. We do not sell or share your personal information with third parties."],
    ["Data Security", "All submitted data is stored securely. Email addresses are never displayed publicly on the website."],
    ["Your Rights", "You may request deletion of your content or personal data at any time by contacting us at contact@krynolux.work."],
    ["Children's Privacy", "KrynoluxDC serves users of all ages. We take special care to protect the privacy of minors and comply with applicable children's privacy laws."],
  ];
  return (
    <StaticPage section="Legal" title="Privacy Policy">
      {sections.map(([title, body]) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: TH.text, marginBottom: 10 }}>{title}</h3>
          <p style={{ margin: 0, color: TH.sub }}>{body}</p>
        </div>
      ))}
    </StaticPage>
  );
}

function GuidelinesPage() {
  const items = [
    ["Accuracy", "All facts must be verified before submission. We require at least two independent sources for any factual claim."],
    ["Fairness", "Stories must represent all perspectives fairly. Opinion pieces must be clearly labeled as such."],
    ["Respect", "All content must be appropriate for a general audience including younger readers."],
    ["Originality", "All submitted work must be original. Plagiarism results in permanent removal from the platform."],
    ["Privacy", "Do not publish identifying information about private individuals without their consent."],
    ["Community Relevance", "Stories should serve the interests of the Fairfax, Loudoun, or DC community."],
  ];
  return (
    <StaticPage section="Editorial Standards" title="Editorial Guidelines">
      <p style={{ marginBottom: 28 }}>KrynoluxDC holds all contributors to the highest standards of accuracy, fairness, and community responsibility.</p>
      {items.map(([title, body]) => (
        <div key={title} style={{ marginBottom: 20, paddingLeft: 20, borderLeft: `3px solid ${TH.accent}` }}>
          <h3 style={{ fontFamily: "Georgia,serif", fontSize: 18, color: TH.text, marginBottom: 6 }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 16, color: TH.sub }}>{body}</p>
        </div>
      ))}
    </StaticPage>
  );
}

// ── SCHOOL PORTAL ─────────────────────────────────────────────────────────────
const COUNTIES = ["Fairfax County", "Loudoun County", "Washington DC", "Arlington", "Alexandria", "Prince William County", "Montgomery County", "Other"];

function SchoolPortal() {
  const [view, setView] = useState("login"); // "login" | "register"
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("school_session") || "null"); } catch { return null; }
  });

  function doLogout() {
    sessionStorage.removeItem("school_session");
    setSession(null);
  }

  if (session) return <SchoolDashboard school={session} onLogout={doLogout} />;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏫</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 700, color: TH.text, margin: "0 0 8px" }}>School Portal</h1>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.muted, margin: 0 }}>
          Partner with KrynoluxDC to publish your students' stories directly on the DMV's youth news network.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", borderBottom: `2px solid ${TH.border}`, marginBottom: 28 }}>
        {[["login", "Sign In"], ["register", "Apply Now"]].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: "11px 0", background: "none", border: "none",
              borderBottom: view === v ? `3px solid ${TH.accent}` : "3px solid transparent",
              color: view === v ? TH.accent : TH.muted,
              fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13,
              cursor: "pointer", letterSpacing: 0.3,
              transition: "color 0.15s, border-color 0.15s",
              marginBottom: -2,
            }}
          >{label}</button>
        ))}
      </div>

      {view === "login"
        ? <SchoolLogin onLogin={s => { sessionStorage.setItem("school_session", JSON.stringify(s)); setSession(s); }} />
        : <SchoolRegister onDone={() => setView("login")} />
      }
    </div>
  );
}

function SchoolLogin({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);

  async function submit() {
    if (!email.includes("@")) { setErr("Enter a valid email."); return; }
    if (!pass) { setErr("Enter your password."); return; }
    setLoading(true); setErr("");
    const { data, error } = await supabase.from("school_accounts").select("*").eq("contact_email", email.trim()).eq("pass", pass).maybeSingle();
    setLoading(false);
    if (error || !data) { setErr("Incorrect email or password."); return; }
    if (data.status === "rejected") { setErr("This account has been rejected. Contact contact@krynolux.work for more info."); return; }
    onLogin(data);
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>School Email</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="contact@yourschool.edu"
          style={{ width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Inter,sans-serif", fontSize: 14, outline: "none", borderRadius: 3, boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Password</label>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Your password"
          style={{ width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Inter,sans-serif", fontSize: 14, outline: "none", borderRadius: 3, boxSizing: "border-box" }} />
      </div>
      {err && <div style={{ background: "#fdf0f0", borderLeft: `3px solid ${TH.red}`, padding: "10px 14px", marginBottom: 14, fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.red }}>{err}</div>}
      <button onClick={submit} disabled={loading}
        style={{ width: "100%", padding: "13px", background: TH.accent, border: "none", color: "#fff", fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", borderRadius: 3, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Signing in…" : "Sign In →"}
      </button>
    </div>
  );
}

function SchoolRegister({ onDone }) {
  const [form, setForm] = useState({ school_name: "", contact_name: "", contact_email: "", county: "", description: "", pass: "", pass2: "" });
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]   = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.school_name.trim()) { setErr("School name is required."); return; }
    if (!form.contact_name.trim()) { setErr("Contact name is required."); return; }
    if (!form.contact_email.includes("@")) { setErr("Enter a valid email."); return; }
    if (!form.county) { setErr("Select your county."); return; }
    if (form.pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (form.pass !== form.pass2) { setErr("Passwords don't match."); return; }
    setLoading(true); setErr("");

    const { error } = await supabase.from("school_accounts").insert([{
      school_name: form.school_name.trim(),
      contact_name: form.contact_name.trim(),
      contact_email: form.contact_email.trim(),
      county: form.county,
      description: form.description.trim(),
      pass: form.pass,
      status: "pending",
    }]);
    if (error) {
      setLoading(false);
      setErr(error.code === "23505" ? "That email is already registered." : "Something went wrong. Try again.");
      return;
    }
    await sendEmail({ status: "school_applied", name: form.contact_name.trim(), email: form.contact_email.trim(), school_name: form.school_name.trim() });
    setLoading(false);
    setDone(true);
  }

  if (done) return (
    <div style={{ background: "#f0faf4", border: `1px solid ${TH.green}40`, borderLeft: `4px solid ${TH.green}`, padding: "24px 28px", borderRadius: 3 }}>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, color: TH.green, marginBottom: 8 }}>✓ Application submitted!</div>
      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.sub, lineHeight: 1.7, margin: "0 0 16px" }}>
        We'll review your application within 48 hours and email you at <strong>{form.contact_email}</strong> with a decision.
      </p>
      <button onClick={onDone} style={{ background: TH.accent, border: "none", color: "#fff", padding: "10px 22px", fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", borderRadius: 3 }}>
        Back to Sign In →
      </button>
    </div>
  );

  const inp = { width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Inter,sans-serif", fontSize: 14, outline: "none", borderRadius: 3, boxSizing: "border-box", marginBottom: 0 };
  const lbl = { fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" };
  const fld = { marginBottom: 16 };

  return (
    <div>
      <div style={fld}>
        <label style={lbl}>School Name <span style={{ color: TH.red }}>*</span></label>
        <input type="text" value={form.school_name} onChange={e => { set("school_name", e.target.value); setErr(""); }} placeholder="e.g. Thomas Jefferson High School" style={inp} />
      </div>
      <div style={fld}>
        <label style={lbl}>Your Name (Contact) <span style={{ color: TH.red }}>*</span></label>
        <input type="text" value={form.contact_name} onChange={e => { set("contact_name", e.target.value); setErr(""); }} placeholder="Full name" style={inp} />
      </div>
      <div style={fld}>
        <label style={lbl}>Contact Email <span style={{ color: TH.red }}>*</span></label>
        <input type="email" value={form.contact_email} onChange={e => { set("contact_email", e.target.value); setErr(""); }} placeholder="your@school.edu" style={inp} />
      </div>
      <div style={fld}>
        <label style={lbl}>County / Area <span style={{ color: TH.red }}>*</span></label>
        <select value={form.county} onChange={e => { set("county", e.target.value); setErr(""); }} style={{ ...inp, background: "#fff" }}>
          <option value="">Select county…</option>
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={fld}>
        <label style={lbl}>About Your School / Why You Want to Join</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Tell us about your journalism program or interest…" style={{ ...inp, resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={lbl}>Password <span style={{ color: TH.red }}>*</span></label>
          <input type="password" value={form.pass} onChange={e => { set("pass", e.target.value); setErr(""); }} placeholder="Min. 6 characters" style={inp} />
        </div>
        <div>
          <label style={lbl}>Confirm Password <span style={{ color: TH.red }}>*</span></label>
          <input type="password" value={form.pass2} onChange={e => { set("pass2", e.target.value); setErr(""); }} placeholder="Repeat password" style={inp} />
        </div>
      </div>
      {err && <div style={{ background: "#fdf0f0", borderLeft: `3px solid ${TH.red}`, padding: "10px 14px", marginBottom: 14, fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.red }}>{err}</div>}
      <button onClick={submit} disabled={loading}
        style={{ width: "100%", padding: "13px", background: TH.accent, border: "none", color: "#fff", fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", borderRadius: 3, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Submitting…" : "Apply for School Account →"}
      </button>
      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
        Applications are reviewed within 48 hours. You'll receive a confirmation email after submitting.
      </p>
    </div>
  );
}

function SchoolDashboard({ school, onLogout }) {
  const [form, setForm]     = useState({ student_name: "", headline: "", cat: "", body: "" });
  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]     = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    supabase.from("submissions").select("*").eq("email", school.contact_email).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMyStories(data); });
  }, [school.contact_email]);

  if (school.status === "pending") return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, color: TH.text, marginBottom: 12 }}>Application Under Review</h2>
      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.muted, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 24px" }}>
        Your account for <strong>{school.school_name}</strong> is currently pending editorial approval. We'll email you at <strong>{school.contact_email}</strong> within 48 hours.
      </p>
      <button onClick={onLogout} style={{ background: "none", border: `1px solid ${TH.border}`, padding: "10px 22px", fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.muted, cursor: "pointer", borderRadius: 3 }}>Sign Out</button>
    </div>
  );

  async function handleSubmit() {
    if (!form.student_name.trim()) { setErr("Enter the student's name."); return; }
    if (!form.headline.trim()) { setErr("Enter a headline."); return; }
    if (!form.cat) { setErr("Select a category."); return; }
    if (form.body.trim().split(/\s+/).length < 50) { setErr("Story must be at least 50 words."); return; }
    setSubmitting(true); setErr("");
    const refId = "KDC-" + Date.now().toString().slice(-6);
    const { error } = await supabase.from("submissions").insert([{
      name: form.student_name.trim(),
      school: school.school_name,
      email: school.contact_email,
      headline: form.headline.trim(),
      category: form.cat,
      body: form.body.trim(),
      status: "pending",
      ref_id: refId,
    }]);
    if (error) { setErr("Submission failed. Try again."); setSubmitting(false); return; }
    await sendEmail({ status: "received", name: form.student_name.trim(), email: school.contact_email, headline: form.headline.trim() });
    const { data } = await supabase.from("submissions").select("*").eq("email", school.contact_email).order("created_at", { ascending: false });
    if (data) setMyStories(data);
    setForm({ student_name: "", headline: "", cat: "", body: "" });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  }

  const statusColor = { pending: TH.gold, approved: TH.green, rejected: TH.red };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 36, paddingBottom: 20, borderBottom: `2px solid ${TH.border}` }}>
        <div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: TH.accent, marginBottom: 4 }}>School Portal</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700, color: TH.text, margin: 0 }}>{school.school_name}</h2>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, marginTop: 4 }}>{school.contact_name} · {school.county}</div>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: `1px solid ${TH.border}`, padding: "9px 18px", fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, cursor: "pointer", borderRadius: 3 }}>Sign Out</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }} className="main-grid">
        {/* Submit form */}
        <div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: TH.muted, marginBottom: 20 }}>Submit a Student Story</div>
          {done && (
            <div style={{ background: "#f0faf4", borderLeft: `4px solid ${TH.green}`, padding: "14px 18px", marginBottom: 20, fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.green, fontWeight: 700 }}>
              ✓ Story submitted! Our editorial team will review it within 48 hours.
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Student's Name <span style={{ color: TH.red }}>*</span></label>
            <input type="text" value={form.student_name} onChange={e => { set("student_name", e.target.value); setErr(""); }} placeholder="First and last name"
              style={{ width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Inter,sans-serif", fontSize: 14, outline: "none", borderRadius: 3, boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Headline <span style={{ color: TH.red }}>*</span></label>
            <input type="text" value={form.headline} onChange={e => { set("headline", e.target.value); setErr(""); }} placeholder="Article headline"
              style={{ width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Inter,sans-serif", fontSize: 14, outline: "none", borderRadius: 3, boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Category <span style={{ color: TH.red }}>*</span></label>
            <select value={form.cat} onChange={e => { set("cat", e.target.value); setErr(""); }}
              style={{ width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Inter,sans-serif", fontSize: 14, outline: "none", borderRadius: 3, boxSizing: "border-box", background: "#fff" }}>
              <option value="">Select a category…</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: TH.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Story <span style={{ color: TH.red }}>*</span></label>
            <textarea value={form.body} onChange={e => { set("body", e.target.value); setErr(""); }} rows={10}
              placeholder="Write the full article here…"
              style={{ width: "100%", padding: "11px 14px", border: `1px solid ${TH.inputBorder}`, fontFamily: "Georgia,serif", fontSize: 15, outline: "none", borderRadius: 3, boxSizing: "border-box", resize: "vertical", lineHeight: 1.8 }} />
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted, marginTop: 4 }}>{form.body.trim().split(/\s+/).filter(Boolean).length} words</div>
          </div>
          {err && <div style={{ background: "#fdf0f0", borderLeft: `3px solid ${TH.red}`, padding: "10px 14px", marginBottom: 14, fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.red }}>{err}</div>}
          <button onClick={handleSubmit} disabled={submitting}
            style={{ background: TH.accent, border: "none", color: "#fff", padding: "13px 28px", fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", borderRadius: 3, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting…" : "Submit Story →"}
          </button>
        </div>

        {/* Past submissions */}
        <div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: TH.muted, marginBottom: 16 }}>Your Submissions ({myStories.length})</div>
          {myStories.length === 0
            ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.muted, padding: "20px 0" }}>No submissions yet.</div>
            : myStories.map(s => (
              <div key={s.id} style={{ background: TH.card, border: `1px solid ${TH.border}`, borderLeft: `3px solid ${statusColor[s.status] || TH.muted}`, padding: "12px 14px", marginBottom: 8, borderRadius: "0 3px 3px 0" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 14, fontWeight: 700, color: TH.text, marginBottom: 4, lineHeight: 1.3 }}>{s.headline}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, color: statusColor[s.status] || TH.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.status}</span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted }}>By {s.name}</span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted }}>{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ── NEWSLETTER STRIP (full-width, above footer) ───────────────────────────────
function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function subscribe() {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert([{ email: trimmed, source: "website" }]);
    if (error) { setStatus(error.code === "23505" ? "exists" : "error"); return; }
    await sendEmail({ status: "subscribed", email: trimmed });
    setStatus("done");
  }

  return (
    <div style={{ background: TH.accent, padding: "52px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>
          Newsletter
        </div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>
          Stay in the Loop
        </h2>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 15, color: "rgba(255,255,255,0.75)", margin: "0 0 28px", lineHeight: 1.7 }}>
          Get new stories from KrynoluxDC delivered straight to your inbox — youth journalism from Fairfax, Loudoun, and DC.
        </p>

        {status === "done" ? (
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "18px 28px", borderRadius: 4, display: "inline-block" }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 16, color: "#fff", fontWeight: 700 }}>✓ You're subscribed!</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>New stories will land in your inbox.</div>
          </div>
        ) : status === "exists" ? (
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)" }}>✓ That email is already subscribed!</div>
        ) : (
          <div style={{ display: "flex", gap: 0, maxWidth: 460, margin: "0 auto", borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus(null); }}
              onKeyDown={e => e.key === "Enter" && subscribe()}
              placeholder="Enter your email address"
              style={{
                flex: 1, padding: "14px 18px", border: "none",
                fontSize: 14, fontFamily: "Inter,sans-serif",
                outline: "none", background: "#fff", color: TH.text,
              }}
            />
            <button
              onClick={subscribe}
              disabled={status === "loading"}
              style={{
                padding: "14px 22px", background: TH.text, border: "none",
                color: "#fff", cursor: "pointer", fontSize: 13,
                fontFamily: "Inter,sans-serif", fontWeight: 800,
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >{status === "loading" ? "…" : "Subscribe"}</button>
          </div>
        )}
        {status === "error" && <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 10 }}>Something went wrong — try again.</div>}
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 14 }}>No spam. Unsubscribe any time.</div>
      </div>
    </div>
  );
}

// ── NEWSLETTER SIGNUP (sidebar) ───────────────────────────────────────────────
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "done" | "exists" | "error"

  async function subscribe() {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert([{ email: trimmed, source: "website" }]);
    if (error) { setStatus(error.code === "23505" ? "exists" : "error"); return; }
    await sendEmail({ status: "subscribed", email: trimmed });
    setStatus("done");
  }

  return (
    <div style={{ background: `linear-gradient(135deg, #1a1a2e, ${TH.accent}cc)`, padding: 22 }}>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Stay Informed</div>
      <p style={{ fontFamily: "Georgia,serif", fontSize: 15, color: "#fff", lineHeight: 1.6, marginBottom: 16, margin: "0 0 16px" }}>
        Get the latest DMV youth news straight to your inbox.
      </p>
      {status === "done" ? (
        <div style={{ background: "rgba(255,255,255,0.12)", padding: "12px 14px", borderRadius: 3 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: "#fff", fontWeight: 700 }}>✓ You're subscribed!</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>We'll send you new stories as they're published.</div>
        </div>
      ) : status === "exists" ? (
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>That email is already subscribed!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus(null); }}
            onKeyDown={e => e.key === "Enter" && subscribe()}
            placeholder="your@email.com"
            style={{
              padding: "10px 12px", border: "none", fontSize: 13,
              fontFamily: "Inter,sans-serif", borderRadius: 3, width: "100%",
              background: "rgba(255,255,255,0.15)", color: "#fff",
              outline: "none",
            }}
          />
          {status === "error" && <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "#ffaaaa" }}>Something went wrong. Try again.</div>}
          <button
            onClick={subscribe}
            disabled={status === "loading"}
            style={{
              background: "#fff", border: "none", color: TH.text,
              padding: "10px", cursor: "pointer", fontSize: 12,
              fontFamily: "Inter,sans-serif", fontWeight: 800, borderRadius: 3,
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >{status === "loading" ? "Subscribing…" : "Subscribe →"}</button>
        </div>
      )}
    </div>
  );
}

// ── SKELETON LOADER ───────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 16, mb = 8, radius = 3 }) {
  return (
    <div style={{
      width: w, height: h, background: `linear-gradient(90deg, ${TH.border} 25%, ${TH.bg} 50%, ${TH.border} 75%)`,
      backgroundSize: "200% 100%", borderRadius: radius, marginBottom: mb,
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [nav, setNav] = useState("Home");
  const [pageKey, setPageKey] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [search, setSearch] = useState("");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { loadStories(); }, []);

  async function loadStories() {
    setLoading(true);
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (data) setStories(data);
    setLoading(false);
  }

  function navigate(page) {
    setNav(page);
    setPageKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const q = search.trim().toLowerCase();
  const filtered = (nav === "Home" ? stories : stories.filter(s => s.category === nav))
    .filter(s => !q || s.headline?.toLowerCase().includes(q) || s.body?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q));
  const uniqueWriters = Array.from(new Map(stories.map(s => [s.name, s])).values()).slice(0, 4);

  const staticPages = {
    Submit: <SubmitPage setNav={navigate} />,
    About: <AboutPage />,
    Contact: <ContactPage />,
    Privacy: <PrivacyPage />,
    Guidelines: <GuidelinesPage />,
    "School Portal": <SchoolPortal />,
  };

  return (
    <div style={{ background: TH.bg, minHeight: "100vh", color: TH.text }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        /* ── Page transition ── */
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .page-enter {
          animation: pageEnter 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── Modal animations ── */
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-backdrop { animation: backdropIn 0.25s ease both; }
        .modal-card     { animation: modalSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }

        /* ── Button press ── */
        button {
          transition: transform 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease;
        }
        button:active {
          transform: scale(0.94) !important;
          opacity: 0.85;
        }

        /* ── Clickable card press ── */
        .card-click {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .card-click:active {
          transform: scale(0.97) !important;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08) !important;
        }

        /* ── Nav link press ── */
        .nav-link { transition: color 0.15s, border-color 0.15s; }
        .nav-link:active { opacity: 0.6; }

        /* ── Input focus glow ── */
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: ${TH.accent} !important;
          box-shadow: 0 0 0 3px ${TH.accent}22;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        /* ── Skeleton shimmer ── */
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${TH.bg}; }
        ::-webkit-scrollbar-thumb { background: ${TH.border}; border-radius: 3px; }
        nav::-webkit-scrollbar { display: none; }

        /* ── Mobile menu animation ── */
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: expandDown 0.2s ease both; }

        /* ── Responsive grid ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
          align-items: start;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .date-desktop { display: block; }

        @media (max-width: 960px) {
          .main-grid { grid-template-columns: 1fr; gap: 32px; }
          .sidebar   { position: static !important; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; gap: 20px; }
          .date-desktop { display: none; }
        }
      `}</style>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      <TickerBar />
      <Navbar nav={nav} setNav={navigate} />

      {staticPages[nav] ? (
        <div key={pageKey} className="page-enter">{staticPages[nav]}</div>
      ) : (
        <main key={pageKey} className="page-enter" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Home hero banner */}
          {nav === "Home" && (
            <div style={{
              textAlign: "center", padding: "44px 24px 32px",
              borderBottom: `3px solid ${TH.text}`, marginBottom: 36,
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `${TH.accent}10`, border: `1px solid ${TH.accent}30`,
                padding: "5px 14px", marginBottom: 16,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: TH.accent, display: "inline-block" }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: TH.accent }}>
                  Independent · Youth-Led · Local
                </span>
              </div>
              <h1 style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(32px, 5.5vw, 68px)",
                fontWeight: 700, color: TH.text, lineHeight: 1.05,
                margin: "0 0 14px", letterSpacing: -1,
              }}>The DMV's Student Newsroom</h1>
              <p style={{
                fontFamily: "Inter,sans-serif", fontSize: 15, color: TH.muted,
                maxWidth: 500, margin: "0 auto 24px", lineHeight: 1.75,
              }}>
                Real stories from student journalists across Fairfax, Loudoun, and Washington DC.
              </p>
              <button
                onClick={() => navigate("Submit")}
                style={{
                  background: TH.accent, border: "none", color: "#fff",
                  padding: "12px 28px", cursor: "pointer",
                  fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >Submit a Story →</button>
            </div>
          )}

          {/* Section header (non-home) */}
          {nav !== "Home" && (
            <div style={{
              padding: "36px 0 22px",
              borderBottom: `3px solid ${CAT_COLOR[nav] || TH.text}`,
              marginBottom: 32,
            }}>
              <div style={{
                fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800,
                letterSpacing: 1.5, textTransform: "uppercase",
                color: CAT_COLOR[nav] || TH.accent, marginBottom: 8,
              }}>{nav}</div>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: 36, fontWeight: 700, color: TH.text, margin: "0 0 8px" }}>{nav}</h1>
              <p style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.muted, margin: 0 }}>
                Latest {nav.toLowerCase()} coverage from Fairfax, Loudoun, and Washington DC
              </p>
            </div>
          )}

          {/* Search bar */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ position: "relative", maxWidth: 480 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: TH.muted, fontSize: 15, pointerEvents: "none" }}>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stories, writers…"
                style={{
                  width: "100%", padding: "10px 14px 10px 38px",
                  border: `1px solid ${TH.border}`, background: TH.card,
                  fontFamily: "Inter,sans-serif", fontSize: 13, color: TH.text,
                  outline: "none", borderRadius: 3,
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: TH.muted, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
              )}
            </div>
            {q && <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: TH.muted, marginTop: 8 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</div>}
          </div>

          {/* Main grid */}
          <div className="main-grid">

            {/* Articles column */}
            <div>
              {/* Section label */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18,
              }}>
                <div style={{
                  fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800,
                  letterSpacing: 1.5, textTransform: "uppercase", color: TH.muted,
                }}>
                  {nav === "Home" ? "Latest Stories" : nav}
                  {filtered.length > 0 && ` · ${filtered.length} ${filtered.length === 1 ? "story" : "stories"}`}
                </div>
                <button
                  onClick={loadStories}
                  style={{
                    background: "none", border: `1px solid ${TH.border}`,
                    padding: "5px 12px", color: TH.muted, cursor: "pointer",
                    fontSize: 11, fontFamily: "Inter,sans-serif",
                  }}
                >↻ Refresh</button>
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div>
                  <div style={{ background: TH.card, border: `1px solid ${TH.border}`, marginBottom: 24 }}>
                    <div style={{ width: "100%", height: 480, background: TH.border, marginBottom: 0 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {[1, 2, 3].map(k => (
                      <div key={k} style={{ background: TH.card, border: `1px solid ${TH.border}`, padding: 16 }}>
                        <div style={{ height: 150, background: TH.border, marginBottom: 12 }} />
                        <Skeleton h={10} w="50%" mb={10} />
                        <Skeleton h={16} mb={6} />
                        <Skeleton h={16} w="80%" mb={6} />
                        <Skeleton h={12} w="60%" mb={0} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && filtered.length === 0 && (
                <div style={{
                  background: TH.card, border: `1px solid ${TH.border}`,
                  padding: "80px 40px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.3 }}>📰</div>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: 22, color: TH.text, marginBottom: 10 }}>
                    No stories published yet
                  </h3>
                  <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: TH.muted, marginBottom: 24, lineHeight: 1.7 }}>
                    Be the first student journalist to submit a story to KrynoluxDC.
                  </p>
                  <button
                    onClick={() => navigate("Submit")}
                    style={{
                      background: TH.accent, border: "none", color: "#fff",
                      padding: "12px 28px", cursor: "pointer",
                      fontSize: 13, fontFamily: "Inter,sans-serif", fontWeight: 700,
                    }}
                  >Submit the First Story</button>
                </div>
              )}

              {/* Articles */}
              {!loading && filtered.length > 0 && (
                <>
                  {/* Hero card */}
                  <div style={{ marginBottom: 28 }}>
                    <HeroCard article={filtered[0]} onClick={setSelectedArticle} />
                  </div>

                  {/* Card grid */}
                  {filtered.length > 1 && (
                    <>
                      <Divider label="More Stories" />
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 36 }}>
                        {filtered.slice(1, 7).map(s => (
                          <ArticleCard key={s.id} article={s} onClick={setSelectedArticle} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Top stories list */}
                  {nav === "Home" && stories.length >= 3 && (
                    <>
                      <Divider label="Today's Recap" />
                      <div style={{ background: TH.card, border: `1px solid ${TH.border}` }}>
                        <div style={{
                          padding: "14px 20px", borderBottom: `1px solid ${TH.border}`,
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <span style={{ fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 700, color: TH.text }}>
                            Top Stories
                          </span>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted }}>
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                          </span>
                        </div>
                        <div style={{ padding: "4px 20px 8px" }}>
                          {stories.slice(0, 5).map((s, i) => (
                            <div
                              key={s.id}
                              onClick={() => setSelectedArticle(s)}
                              className="card-click"
                              style={{
                                display: "flex", gap: 16, padding: "12px 0",
                                borderBottom: i < 4 ? `1px solid ${TH.divider}` : "none",
                                cursor: "pointer", alignItems: "flex-start",
                              }}
                            >
                              <span style={{
                                fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700,
                                color: i < 3 ? TH.accent : TH.border, minWidth: 28, lineHeight: 1,
                                marginTop: 2,
                              }}>{i + 1}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: 4 }}><CatBadge cat={s.category} /></div>
                                <div style={{ fontFamily: "Georgia,serif", fontSize: 14.5, color: TH.text, lineHeight: 1.4 }}>
                                  {s.headline}
                                </div>
                                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted, marginTop: 4 }}>
                                  {s.name} · {readingTime(s.body)}
                                </div>
                              </div>
                              {s.image_url && (
                                <img src={s.image_url} alt="" style={{ width: 60, height: 48, objectFit: "cover", flexShrink: 0 }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Load more (remaining) */}
                  {filtered.length > 7 && (
                    <>
                      <Divider label="All Stories" />
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
                        {filtered.slice(7).map(s => (
                          <ArticleCard key={s.id} article={s} onClick={setSelectedArticle} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="sidebar" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 110 }}>
              <WeatherWidget />
              <Poll />

              {/* Student Spotlight */}
              <div style={{ background: TH.card, border: `1px solid ${TH.border}` }}>
                <div style={{ padding: "12px 16px 0" }}>
                  <SideLabel>Student Spotlight</SideLabel>
                </div>
                <div style={{ padding: "0 16px 16px" }}>
                  {stories.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "16px 0" }}>
                      <p style={{ fontFamily: "Georgia,serif", fontSize: 14, color: TH.muted, marginBottom: 14 }}>
                        Writers appear here once articles are published.
                      </p>
                      <button
                        onClick={() => navigate("Submit")}
                        style={{ background: TH.text, border: "none", color: "#fff", padding: "8px 18px", cursor: "pointer", fontSize: 12, fontFamily: "Inter,sans-serif", fontWeight: 700 }}
                      >Become a Writer</button>
                    </div>
                  ) : uniqueWriters.map((s, i) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 0",
                        borderBottom: i < uniqueWriters.length - 1 ? `1px solid ${TH.divider}` : "none",
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: CAT_COLOR[s.category] || TH.text,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
                        fontFamily: "Georgia,serif",
                      }}>
                        {(s.name || "K")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 13, color: TH.text }}>
                          {s.name}
                        </div>
                        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: TH.muted }}>
                          {s.school || "KrynoluxDC"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter signup */}
              <NewsletterSignup />
            </aside>
          </div>
        </main>
      )}

      {/* Newsletter strip */}
      <NewsletterStrip />

      {/* Footer */}
      <footer style={{ background: "#0f0f0f", color: "#fff", padding: "52px 24px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Logo size={40} circle />
                <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>
                  Krynolux<span style={{ color: TH.accent }}>DC</span>
                </div>
              </div>
              <p style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 260, margin: "0 0 16px" }}>
                News by Kids. For the Community. Covering Fairfax, Loudoun, and Washington DC.
              </p>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5 }}>
                krynolux.work
              </div>
            </div>

            {/* Sections */}
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Sections</div>
              {NAV_ITEMS.map(n => (
                <div
                  key={n}
                  onClick={() => { navigate(n); }}
                  style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10, cursor: "pointer", transition: "color 0.15s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{n}</div>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Company</div>
              {[["About", "About"], ["Contact", "Contact"], ["Submit a Story", "Submit"]].map(([label, key]) => (
                <div
                  key={key}
                  onClick={() => navigate(key)}
                  style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10, cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{label}</div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Legal</div>
              {[["Privacy Policy", "Privacy"], ["Editorial Guidelines", "Guidelines"], ["School Portal", "School Portal"]].map(([label, key]) => (
                <div
                  key={key}
                  onClick={() => navigate(key)}
                  style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10, cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{label}</div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              © {new Date().getFullYear()} KrynoluxDC · Youth-Led News Network · All rights reserved
            </span>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              Fairfax · Loudoun · Washington DC
            </span>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: 28, right: 24, zIndex: 500,
            width: 44, height: 44, borderRadius: "50%",
            background: TH.text, border: "none", color: "#fff",
            fontSize: 18, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pageEnter 0.25s ease both",
          }}
          aria-label="Back to top"
        >↑</button>
      )}
    </div>
  );
}
