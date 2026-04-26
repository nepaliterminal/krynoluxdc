import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LIGHT = {
  bg: "#f8f8ff", card: "#ffffff", border: "#e0e0f0",
  text: "#1a1a2e", sub: "#444466", gray: "#888899",
  input: "#ffffff", inputBorder: "#d0d0e8", inputText: "#1a1a2e",
  navBg: "#ffffff", sideCard: "linear-gradient(135deg,#f0eaff,#e8f4ff)",
  footerBg: "#1a1a2e", recapBg: "#ffffff", modalBg: "#ffffff",
};
const DARK = {
  bg: "#0f0f1a", card: "#1a1a2e", border: "#2a2a4a",
  text: "#f0f0ff", sub: "#b0b0cc", gray: "#7070aa",
  input: "#12122a", inputBorder: "#3a3a6a", inputText: "#f0f0ff",
  navBg: "#12122a", sideCard: "linear-gradient(135deg,#1a1040,#0a1830)",
  footerBg: "#080810", recapBg: "#1a1a2e", modalBg: "#1a1a2e",
};

const G = {
  purple: "#7B2FFF", blue: "#1E90FF",
  grad: "linear-gradient(135deg,#7B2FFF,#1E90FF)",
  green: "#22a06b", red: "#e53e3e",
};

const NAV = ["Home","Local News","Schools","Sports","Events","Weather","Student Spotlight"];
const CATS = ["Local News","Schools","Sports","Events","Weather","Opinion","Student Spotlight"];
const TICKER = [
  "KrynoluxDC is here — submit your first story today!",
  "Covering Fairfax, Loudoun, and Washington DC",
  "Youth-led journalism for the DMV community",
  "News by kids. For the community.",
];
const CAT_EMOJI = {
  "Local News":"📰","Schools":"🏫","Sports":"🏆",
  "Events":"🎉","Weather":"🌤️","Opinion":"💬","Student Spotlight":"🌟",
};

const WX_CODES = {
  0:"Clear Sky",1:"Mainly Clear",2:"Partly Cloudy",3:"Overcast",
  45:"Foggy",48:"Icy Fog",51:"Light Drizzle",53:"Drizzle",55:"Heavy Drizzle",
  61:"Light Rain",63:"Rain",65:"Heavy Rain",71:"Light Snow",73:"Snow",75:"Heavy Snow",
  80:"Rain Showers",81:"Rain Showers",82:"Heavy Showers",95:"Thunderstorm",99:"Thunderstorm",
};
const WX_EMOJI = {
  0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",53:"🌦️",55:"🌧️",
  61:"🌧️",63:"🌧️",65:"🌧️",71:"❄️",73:"❄️",75:"❄️",80:"🌦️",81:"🌧️",82:"⛈️",95:"⛈️",99:"⛈️",
};
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function GradText(props) {
  return (
    <span style={{ background: G.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {props.children}
    </span>
  );
}

function Logo(props) {
  var s = props.size || 40;
  return (
    <img
      src={props.circle ? "/logo-circle.png" : "/logo-square.png"}
      alt="KrynoluxDC Logo"
      style={{ width: s, height: s, borderRadius: props.circle ? "50%" : s * 0.18, objectFit: "cover", display: "block", flexShrink: 0 }}
      onError={function(e) {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
    />
  );
}

function LogoFallback(props) {
  var s = props.size || 40;
  return (
    <div style={{ width: s, height: s, borderRadius: props.circle ? "50%" : s * 0.18, background: G.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 14px rgba(123,47,255,0.3)" }}>
      <span style={{ color: "white", fontWeight: 900, fontSize: s * 0.48, fontFamily: "Georgia,serif", lineHeight: 1 }}>K</span>
    </div>
  );
}

function LogoWithFallback(props) {
  const [err, setErr] = useState(false);
  var s = props.size || 40;
  if (err) return <LogoFallback size={s} circle={props.circle} />;
  return (
    <img
      src={props.circle ? "/logo-circle.png" : "/logo-square.png"}
      alt="KrynoluxDC"
      onError={function() { setErr(true); }}
      style={{ width: s, height: s, borderRadius: props.circle ? "50%" : s * 0.18, objectFit: "cover", display: "block", flexShrink: 0 }}
    />
  );
}

function TickerBar() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(function() {
    const t = setInterval(function() {
      setFade(false);
      setTimeout(function() { setI(function(x) { return (x + 1) % TICKER.length; }); setFade(true); }, 400);
    }, 4000);
    return function() { clearInterval(t); };
  }, []);
  return (
    <div style={{ background: G.grad, padding: "6px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>UPDATE</span>
        <span style={{ color: "white", fontSize: 13, opacity: fade ? 1 : 0, transition: "opacity 0.4s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{TICKER[i]}</span>
      </div>
    </div>
  );
}

function Modal(props) {
  const T = props.dark ? DARK : LIGHT;
  if (!props.open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={props.onClose}>
      <div style={{ background: T.modalBg, borderRadius: 16, padding: 32, maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto", border: "1px solid " + T.border, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: T.text, fontFamily: "Georgia,serif" }}><GradText>{props.title}</GradText></h2>
          <button onClick={props.onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.gray }}>✕</button>
        </div>
        <div style={{ color: T.sub, lineHeight: 1.8, fontSize: 14 }}>{props.children}</div>
      </div>
    </div>
  );
}

function Navbar(props) {
  const T = props.dark ? DARK : LIGHT;
  const [scrolled, setScrolled] = useState(false);
  useEffect(function() {
    const fn = function() { setScrolled(window.scrollY > 10); };
    window.addEventListener("scroll", fn);
    return function() { window.removeEventListener("scroll", fn); };
  }, []);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 200, background: T.navBg, borderBottom: "1px solid " + T.border, boxShadow: scrolled ? "0 2px 16px rgba(123,47,255,0.12)" : "none", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid " + T.border, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={function() { props.setNav("Home"); }}>
            <LogoWithFallback size={44} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5, lineHeight: 1.1 }}>
                <GradText>KRYNOLUX</GradText>
                <span style={{ color: G.blue, fontWeight: 900 }}>DC</span>
              </div>
              <div style={{ fontSize: 9, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>News by Kids. For the Community.</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={props.toggleDark} style={{ background: "transparent", border: "1px solid " + T.border, borderRadius: 20, padding: "7px 14px", cursor: "pointer", fontSize: 15, color: T.text, transition: "all 0.2s" }} title={props.dark ? "Light Mode" : "Dark Mode"}>
              {props.dark ? "☀️" : "🌙"}
            </button>
            <button onClick={function() { props.setNav("Submit"); }} style={{ background: G.grad, border: "none", color: "white", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 2px 10px rgba(123,47,255,0.3)" }}>
              ✍️ Submit Story
            </button>
          </div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "2px 0" }}>
          {NAV.map(function(n) {
            return (
              <button key={n} onClick={function() { props.setNav(n); }} style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: props.nav === n ? "3px solid " + G.purple : "3px solid transparent", color: props.nav === n ? G.purple : T.sub, cursor: "pointer", fontSize: 13, fontWeight: props.nav === n ? 700 : 500, whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Hero(props) {
  const T = props.dark ? DARK : LIGHT;
  return (
    <div style={{ background: props.dark ? "linear-gradient(135deg,#1a0a3a,#0a1030)" : "linear-gradient(135deg,#f0eaff,#e8f4ff)", borderBottom: "1px solid " + T.border, padding: "48px 0 36px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 260 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: G.grad, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: 0.5 }}>
              🗞️ DMV YOUTH NEWS NETWORK
            </div>
            <h1 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, color: T.text, lineHeight: 1.15, margin: "0 0 14px", fontFamily: "Georgia,serif" }}>
              Real Stories.<br /><GradText>Real Students.</GradText><br />Real Impact.
            </h1>
            <p style={{ fontSize: 16, color: T.sub, lineHeight: 1.75, margin: "0 0 22px", maxWidth: 500 }}>
              KrynoluxDC covers Fairfax, Loudoun, and Washington DC — written by the generation that lives it.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={function() { props.setNav("Submit"); }} style={{ background: G.grad, border: "none", color: "white", padding: "12px 24px", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px rgba(123,47,255,0.3)" }}>✍️ Submit Your Story</button>
              <button onClick={function() { props.setNav("Local News"); }} style={{ background: T.card, border: "1px solid " + T.border, color: G.purple, padding: "12px 24px", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>📰 Read News</button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200, display: "flex", justifyContent: "center" }}>
            <div style={{ background: G.grad, borderRadius: 24, padding: 4, boxShadow: "0 8px 40px rgba(123,47,255,0.25)" }}>
              <div style={{ background: T.card, borderRadius: 21, padding: "28px 24px", textAlign: "center" }}>
                <LogoWithFallback size={72} circle={true} />
                <div style={{ marginTop: 14, fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>
                  <GradText>KRYNOLUX</GradText>
                  <span style={{ color: G.blue }}>DC</span>
                </div>
                <div style={{ color: T.gray, fontSize: 10, letterSpacing: 1, marginTop: 2 }}>NEWS BY KIDS. FOR THE COMMUNITY.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsCard(props) {
  const T = props.dark ? DARK : LIGHT;
  const [hov, setHov] = useState(false);
  var a = props.article;
  return (
    <div onMouseEnter={function() { setHov(true); }} onMouseLeave={function() { setHov(false); }}
      style={{ background: T.card, borderRadius: 12, border: "1px solid " + (hov ? G.purple + "55" : T.border), overflow: "hidden", boxShadow: hov ? "0 8px 32px rgba(123,47,255,0.15)" : "0 2px 8px rgba(0,0,0,0.05)", transform: hov ? "translateY(-3px)" : "none", transition: "all 0.25s ease", cursor: "pointer" }}>
      {a.image_url ? (
        <img src={a.image_url} alt={a.headline} style={{ width: "100%", height: props.big ? 200 : 140, objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ background: props.dark ? "linear-gradient(135deg,#1a0a3a,#0a1030)" : "linear-gradient(135deg,#f0eaff,#e8f4ff)", height: props.big ? 200 : 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: props.big ? 52 : 38, borderBottom: "1px solid " + T.border }}>
          {CAT_EMOJI[a.category] || "📰"}
        </div>
      )}
      <div style={{ padding: props.big ? "18px" : "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ background: G.purple + "22", color: G.purple, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.5, border: "1px solid " + G.purple + "33" }}>
            {(a.category || "NEWS").toUpperCase()}
          </span>
          <span style={{ color: T.gray, fontSize: 11 }}>{a.created_at ? a.created_at.slice(0, 10) : "Today"}</span>
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: props.big ? 19 : 15, fontWeight: 800, color: T.text, lineHeight: 1.3, fontFamily: "Georgia,serif" }}>
          {a.headline || "Untitled Story"}
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: T.sub, lineHeight: 1.6 }}>
          {a.body ? (a.body.length > 120 ? a.body.slice(0, 120) + "..." : a.body) : ""}
        </p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: T.gray }}>By {a.name || "KrynoluxDC"}{a.school ? " · " + a.school : ""}</span>
          {props.big && <span style={{ color: G.purple, fontSize: 13, fontWeight: 700 }}>Read More →</span>}
        </div>
      </div>
    </div>
  );
}

function SectionLabel(props) {
  const T = props.dark ? DARK : LIGHT;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 4, height: 22, background: G.grad, borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: T.text, textTransform: "uppercase", letterSpacing: 0.5 }}>{props.label}</h2>
    </div>
  );
}

function WeatherWidget(props) {
  const [wx, setWx] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(function() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=38.8462&longitude=-77.3064&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&forecast_days=5&timezone=America%2FNew_York")
      .then(function(r) { return r.json(); })
      .then(function(d) { setWx(d); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);
  var temp = wx ? Math.round(wx.current.temperature_2m) : "--";
  var code = wx ? wx.current.weathercode : 0;
  var desc = WX_CODES[code] || "Clear";
  var emoji = WX_EMOJI[code] || "🌤️";
  return (
    <div style={{ background: G.grad, borderRadius: 12, padding: 20, color: "white", boxShadow: "0 4px 20px rgba(123,47,255,0.2)" }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.85, marginBottom: 10 }}>⛅ DMV WEATHER · FAIRFAX, VA</div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px 0", opacity: 0.8 }}>Loading weather...</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 42, fontWeight: 900 }}>{temp}°F</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>{desc}</div>
            </div>
            <span style={{ fontSize: 44 }}>{emoji}</span>
          </div>
          {wx && (
            <div style={{ display: "flex", gap: 5 }}>
              {wx.daily.time.slice(0, 5).map(function(date, i) {
                var d = new Date(date);
                var dayName = DAYS[d.getDay()];
                var hi = Math.round(wx.daily.temperature_2m_max[i]);
                var lo = Math.round(wx.daily.temperature_2m_min[i]);
                var wCode = wx.daily.weathercode[i];
                return (
                  <div key={date} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.18)", borderRadius: 8, padding: "6px 2px" }}>
                    <div style={{ fontSize: 10, opacity: 0.75 }}>{i === 0 ? "Today" : dayName}</div>
                    <div style={{ fontSize: 15 }}>{WX_EMOJI[wCode] || "🌤️"}</div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{hi}°</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{lo}°</div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Poll(props) {
  const T = props.dark ? DARK : LIGHT;
  const [voted, setVoted] = useState(null);
  const opts = ["Climate & Environment","School Policies","Local Sports","Youth Entrepreneurs"];
  const votes = [340,280,190,210];
  const total = votes.reduce(function(a,b){return a+b;},0);
  return (
    <div style={{ background: T.card, borderRadius: 12, border: "1px solid " + T.border, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, background: G.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1, marginBottom: 8 }}>📊 COMMUNITY POLL</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>What should we cover more?</div>
      {opts.map(function(o,i) {
        const pct = Math.round((votes[i]/total)*100);
        return (
          <div key={o} onClick={function(){setVoted(i);}} style={{ marginBottom: 10, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: voted===i ? G.purple : T.sub, fontWeight: voted===i ? 700 : 400, marginBottom: 4 }}>
              <span>{o}</span><span>{pct}%</span>
            </div>
            <div style={{ background: props.dark ? "#2a2a4a" : "#f0eaff", borderRadius: 4, height: 7 }}>
              <div style={{ width: pct+"%", height: "100%", background: voted===i ? G.grad : (props.dark ? "linear-gradient(90deg,#5a3a99,#3a70bb)" : "linear-gradient(90deg,#c0a0ff,#90c8ff)"), borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
        );
      })}
      {voted !== null ? <div style={{ marginTop: 8, color: G.green, fontSize: 12, fontWeight: 700 }}>✓ Thanks for voting!</div> : null}
    </div>
  );
}

function SubmitPage(props) {
  const T = props.dark ? DARK : LIGHT;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [cat, setCat] = useState("");
  const [body, setBody] = useState("");

  const inp = { width: "100%", padding: "10px 14px", border: "1px solid " + T.inputBorder, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "inherit", color: T.inputText, background: T.input, display: "block" };

  async function handleSubmit() {
    setLoading(true); setErrMsg("");
    const { error } = await supabase.from("submissions").insert([{
      name: name, school: school, email: email,
      headline: headline, category: cat, body: body, status: "pending",
    }]);
    setLoading(false);
    if (error) { setErrMsg("Something went wrong. Please try again."); }
    else { setDone(true); }
  }

  if (done) {
    return (
      <div style={{ maxWidth: 540, margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: G.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>🎉</div>
        <h2 style={{ color: T.text, marginBottom: 10, fontFamily: "Georgia,serif" }}>Story Submitted!</h2>
        <p style={{ color: T.sub, lineHeight: 1.7, marginBottom: 20 }}>Our editorial team will review your story within 48 hours.</p>
        <div style={{ background: T.card, borderRadius: 10, padding: 16, fontSize: 13, color: T.sub, border: "1px solid " + T.border }}>
          Submission ID: <strong style={{ background: G.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KDC-{Date.now().toString().slice(-6)}</strong>
        </div>
        <button onClick={function(){ setDone(false); setStep(1); setName(""); setSchool(""); setEmail(""); setHeadline(""); setCat(""); setBody(""); }} style={{ marginTop: 20, padding: "10px 24px", background: G.grad, border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Submit Another</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: T.text, marginBottom: 6, fontFamily: "Georgia,serif" }}><GradText>Submit Your Story</GradText></h2>
      <p style={{ color: T.sub, marginBottom: 28, fontSize: 14 }}>All submissions are reviewed by our editorial team before publishing.</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[1,2,3].map(function(n) { return <div key={n} style={{ flex: 1, height: 5, borderRadius: 3, background: step >= n ? G.grad : T.border, transition: "background 0.3s" }} />; })}
      </div>
      <div style={{ background: T.card, borderRadius: 14, border: "1px solid " + T.border, padding: 28, boxShadow: "0 4px 24px rgba(123,47,255,0.08)" }}>
        {step === 1 && (
          <div>
            <h3 style={{ color: T.text, marginBottom: 18, fontSize: 16 }}>Step 1 — Your Info</h3>
            <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Full Name</label>
            <input value={name} onChange={function(e){setName(e.target.value);}} placeholder="Your full name" style={inp} />
            <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>School / Organization</label>
            <input value={school} onChange={function(e){setSchool(e.target.value);}} placeholder="Your school" style={inp} />
            <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Email Address</label>
            <input value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="your@email.com" style={inp} />
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 style={{ color: T.text, marginBottom: 18, fontSize: 16 }}>Step 2 — Your Story</h3>
            <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Headline</label>
            <input value={headline} onChange={function(e){setHeadline(e.target.value);}} placeholder="Article headline" style={inp} />
            <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Category</label>
            <select value={cat} onChange={function(e){setCat(e.target.value);}} style={Object.assign({},inp,{color:cat?T.inputText:T.gray})}>
              <option value="">Select a category</option>
              {CATS.map(function(c){return <option key={c} value={c}>{c}</option>;})}
            </select>
            <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Article Body</label>
            <textarea value={body} onChange={function(e){setBody(e.target.value);}} placeholder="Write your article or pitch here..." rows={6} style={Object.assign({},inp,{resize:"vertical"})} />
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 style={{ color: T.text, marginBottom: 18, fontSize: 16 }}>Step 3 — Review</h3>
            {[["Name",name],["School",school],["Email",email],["Headline",headline],["Category",cat]].map(function(item){
              return (
                <div key={item[0]} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid " + T.border }}>
                  <span style={{ color: T.gray, fontSize: 13 }}>{item[0]}</span>
                  <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{item[1] || "—"}</span>
                </div>
              );
            })}
            <p style={{ color: T.gray, fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>By submitting you agree to KrynoluxDC's editorial guidelines and community standards.</p>
            {errMsg ? <div style={{ marginTop: 10, color: G.red, fontSize: 13, fontWeight: 600 }}>⚠️ {errMsg}</div> : null}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {step > 1 ? <button onClick={function(){setStep(step-1);}} style={{ flex: 1, padding: "11px", background: T.bg, border: "1px solid " + T.border, borderRadius: 8, color: T.sub, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Back</button> : null}
          <button onClick={function(){ if(step<3){setStep(step+1);}else{handleSubmit();} }} disabled={loading} style={{ flex: 2, padding: "11px", background: loading ? T.border : G.grad, border: "none", borderRadius: 8, color: "white", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700 }}>
            {loading ? "Submitting..." : step===3 ? "Submit Story 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AboutPage(props) {
  const T = props.dark ? DARK : LIGHT;
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "Georgia,serif", color: T.text, marginBottom: 8 }}><GradText>About KrynoluxDC</GradText></h1>
      <p style={{ color: T.sub, fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>KrynoluxDC is a youth-led news organization covering the Fairfax, Loudoun, and Washington DC metro area. Founded by students, for the community, our mission is to amplify young voices and report on stories that matter to our generation.</p>
      <p style={{ color: T.sub, fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>Every article published on KrynoluxDC is written and reviewed by students. Our editorial team reviews submissions for accuracy, fairness, and community standards before anything goes live.</p>
      <h2 style={{ color: T.text, fontFamily: "Georgia,serif", marginBottom: 10 }}>Our Mission</h2>
      <p style={{ color: T.sub, fontSize: 15, lineHeight: 1.9 }}>To provide accurate, engaging, and community-focused news written by the next generation of journalists across the DMV region.</p>
    </div>
  );
}

function ContactPage(props) {
  const T = props.dark ? DARK : LIGHT;
  const inp = { width: "100%", padding: "10px 14px", border: "1px solid " + T.inputBorder, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "inherit", color: T.inputText, background: T.input, display: "block" };
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "Georgia,serif", color: T.text, marginBottom: 8 }}><GradText>Contact Us</GradText></h1>
      <p style={{ color: T.sub, fontSize: 14, marginBottom: 28 }}>Have a question, tip, or want to partner with us? Reach out below.</p>
      <div style={{ background: T.card, borderRadius: 14, border: "1px solid " + T.border, padding: 28 }}>
        <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Your Name</label>
        <input placeholder="Full name" style={inp} />
        <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Email</label>
        <input placeholder="your@email.com" style={inp} />
        <label style={{ fontSize: 12, color: T.gray, display: "block", marginBottom: 4 }}>Message</label>
        <textarea placeholder="Your message..." rows={5} style={Object.assign({},inp,{resize:"vertical"})} />
        <button style={{ width: "100%", padding: "11px", background: G.grad, border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Send Message</button>
      </div>
      <div style={{ marginTop: 24, color: T.sub, fontSize: 13 }}>
        <p>📧 You can also reach us at <strong style={{ color: T.text }}>contact@krynolux.work</strong></p>
        <p>📍 Serving Fairfax County, Loudoun County, and Washington DC</p>
      </div>
    </div>
  );
}

function PrivacyPage(props) {
  const T = props.dark ? DARK : LIGHT;
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "Georgia,serif", color: T.text, marginBottom: 8 }}><GradText>Privacy Policy</GradText></h1>
      <p style={{ color: T.gray, fontSize: 13, marginBottom: 24 }}>Last updated: April 2026</p>
      {[
        ["Information We Collect","We collect information you provide when submitting stories, including your name, school, and email address. This information is used solely to process your submission and contact you about it."],
        ["How We Use Information","Your information is used to review and publish your submitted articles and to contact you regarding your submissions. We do not sell or share your personal information with third parties."],
        ["Data Storage","Submissions are stored securely in our database. Email addresses are never displayed publicly on the website."],
        ["Your Rights","You may request deletion of your submitted content or personal information at any time by contacting us at contact@krynolux.work."],
        ["Children's Privacy","KrynoluxDC is designed for users of all ages. We take special care to protect the privacy of minors and do not knowingly collect unnecessary personal data."],
      ].map(function(item) {
        return (
          <div key={item[0]} style={{ marginBottom: 24 }}>
            <h3 style={{ color: T.text, marginBottom: 8 }}>{item[0]}</h3>
            <p style={{ color: T.sub, fontSize: 14, lineHeight: 1.8 }}>{item[1]}</p>
          </div>
        );
      })}
    </div>
  );
}

function GuidelinesPage(props) {
  const T = props.dark ? DARK : LIGHT;
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "Georgia,serif", color: T.text, marginBottom: 8 }}><GradText>Editorial Guidelines</GradText></h1>
      <p style={{ color: T.sub, fontSize: 15, lineHeight: 1.9, marginBottom: 24 }}>KrynoluxDC is committed to accurate, fair, and community-focused journalism. All contributors must follow these guidelines.</p>
      {[
        ["Accuracy","All facts must be verified before submission. Cite at least two sources for any factual claim. Corrections will be issued publicly when errors are found."],
        ["Fairness","Stories must represent all sides fairly. Do not publish one-sided opinions as news. Clearly label opinion pieces as such."],
        ["Respect","All content must be respectful and appropriate for a wide audience including younger readers. Hate speech, bullying, or discriminatory content is not permitted."],
        ["Originality","All submitted work must be original and written by the submitting student. Plagiarism will result in permanent removal from the platform."],
        ["Privacy","Do not publish personal information about individuals without their consent. Protect the identity of sources who request anonymity."],
        ["Community Standards","Stories should be relevant to the Fairfax, Loudoun, or DC community. Focus on stories that uplift, inform, and engage the local community."],
      ].map(function(item) {
        return (
          <div key={item[0]} style={{ marginBottom: 20, padding: "16px 20px", background: T.card, borderRadius: 10, border: "1px solid " + T.border, borderLeft: "4px solid " + G.purple }}>
            <h3 style={{ color: T.text, marginBottom: 6, fontSize: 15 }}>{item[0]}</h3>
            <p style={{ color: T.sub, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item[1]}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [nav, setNav] = useState("Home");
  const [dark, setDark] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const T = dark ? DARK : LIGHT;

  useEffect(function() { loadStories(); }, []);

  async function loadStories() {
    setLoading(true);
    const { data } = await supabase.from("submissions").select("*").eq("status","approved").order("created_at",{ascending:false});
    if (data) { setStories(data); }
    setLoading(false);
  }

  var filtered = nav === "Home" ? stories : stories.filter(function(s){return s.category===nav;});

  var pageContent = null;
  if (nav === "Submit") pageContent = <SubmitPage dark={dark} />;
  else if (nav === "About") pageContent = <AboutPage dark={dark} />;
  else if (nav === "Contact") pageContent = <ContactPage dark={dark} />;
  else if (nav === "Privacy") pageContent = <PrivacyPage dark={dark} />;
  else if (nav === "Guidelines") pageContent = <GuidelinesPage dark={dark} />;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter,-apple-system,sans-serif", color: T.text, transition: "background 0.3s,color 0.3s" }}>
      <TickerBar />
      <Navbar nav={nav} setNav={setNav} dark={dark} toggleDark={function(){setDark(!dark);}} />

      {pageContent ? pageContent : (
        <div>
          {nav === "Home" && <Hero setNav={setNav} dark={dark} />}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
            {nav !== "Home" && (
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid " + T.border }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, fontFamily: "Georgia,serif" }}><GradText>{nav}</GradText></h1>
                <p style={{ color: T.sub, marginTop: 6, fontSize: 14 }}>Latest {nav} stories from the DMV</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <SectionLabel label={nav==="Home"?"Latest Stories":nav} dark={dark} />
                  <button onClick={loadStories} style={{ padding: "5px 12px", background: "transparent", border: "1px solid " + T.border, borderRadius: 6, color: G.purple, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🔄 Refresh</button>
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: 60, color: T.gray }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                    <div>Loading stories...</div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ background: T.card, borderRadius: 14, border: "1px solid " + T.border, padding: "48px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>📭</div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: T.text, marginBottom: 8, fontFamily: "Georgia,serif" }}>No stories yet</div>
                    <div style={{ color: T.sub, fontSize: 14, marginBottom: 20 }}>Be the first to submit a story!</div>
                    <button onClick={function(){setNav("Submit");}} style={{ padding: "10px 22px", background: G.grad, border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✍️ Submit First Story</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 20 }}><NewsCard article={filtered[0]} big={true} dark={dark} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}>
                      {filtered.slice(1).map(function(s){return <NewsCard key={s.id} article={s} big={false} dark={dark} />;}) }
                    </div>
                  </div>
                )}
                {nav === "Home" && (
                  <div style={{ marginTop: 32 }}>
                    <SectionLabel label="Daily Recap" dark={dark} />
                    <div style={{ background: T.recapBg, borderRadius: 12, border: "1px solid " + T.border, padding: 20 }}>
                      <div style={{ fontSize: 13, color: T.gray, marginBottom: 12 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
                      {stories.length === 0 ? (
                        <div style={{ color: T.sub, fontSize: 14 }}>No stories yet. Submit the first story to start the daily recap!</div>
                      ) : stories.slice(0,5).map(function(s,i){
                          return (
                            <div key={s.id} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i<4?"1px solid "+T.border:"none" }}>
                              <span>{CAT_EMOJI[s.category]||"📰"}</span>
                              <span style={{ color: T.sub, fontSize: 13, lineHeight: 1.5 }}>{s.headline}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <WeatherWidget dark={dark} />
                <Poll dark={dark} />
                <div style={{ background: T.card, borderRadius: 12, border: "1px solid " + T.border, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, background: G.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1, marginBottom: 12 }}>🌟 STUDENT SPOTLIGHT</div>
                  {stories.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "16px 0" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎖️</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>No featured writers yet</div>
                      <div style={{ fontSize: 12, color: T.gray, marginBottom: 14 }}>Writers appear here once articles are approved.</div>
                      <button onClick={function(){setNav("Submit");}} style={{ padding: "8px 16px", background: G.grad, border: "none", borderRadius: 7, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Become a Writer</button>
                    </div>
                  ) : Array.from(new Map(stories.map(function(s){return[s.name,s];})).values()).slice(0,3).map(function(s){
                      return (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid " + T.border }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: G.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
                            {(s.name||"?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: T.gray }}>{s.school}{s.category?" · "+s.category:""}</div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
                <div style={{ background: dark?"linear-gradient(135deg,#1a0a3a,#0a1030)":"linear-gradient(135deg,#f0eaff,#e8f4ff)", borderRadius: 12, padding: 20, border: "1px solid " + T.border }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 8 }}>✍️ Are you a student journalist?</div>
                  <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.6, marginBottom: 14 }}>Submit your story and join the KrynoluxDC team!</p>
                  <button onClick={function(){setNav("Submit");}} style={{ width: "100%", padding: "10px", background: G.grad, border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Get Started →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: T.footerBg, color: "white", padding: "36px 20px", marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 28, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <LogoWithFallback size={38} circle={true} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: 17, background: G.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KRYNOLUXDC</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: 1 }}>krynolux.work</div>
                </div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7 }}>News by Kids. For the Community.<br />Fairfax · Loudoun · Washington DC</div>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>PAGES</div>
              {[["About","About"],["Contact","Contact"],["Submit","Submit"],["Privacy","Privacy"],["Guidelines","Guidelines"]].map(function(l){
                return (
                  <div key={l[0]} onClick={function(){setNav(l[1]);window.scrollTo(0,0);}} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", marginBottom: 6, transition: "color 0.2s" }}
                    onMouseEnter={function(e){e.target.style.color="white";}}
                    onMouseLeave={function(e){e.target.style.color="rgba(255,255,255,0.5)";}}>
                    {l[0]}
                  </div>
                );
              })}
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>COVERAGE</div>
              {["Fairfax County","Loudoun County","Washington DC","Local Schools","Youth Sports","Community Events"].map(function(l){
                return <div key={l} style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 5 }}>{l}</div>;
              })}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>KrynoluxDC · Youth-Led News Network · All rights reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
}