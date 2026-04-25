import { useState } from "react";

const C = {
  navy: "#0A0F2C", deep: "#0D1B4B", accent: "#00D4FF", neon: "#7B2FFF",
  lime: "#39FF14", white: "#F0F4FF", gray: "#8892B0", card: "#0F1A3E",
  cardHover: "#162040", red: "#FF3B5C", gold: "#FFD700", green: "#00C853",
};

const navItems = ["Home", "Local News", "Schools", "Sports", "Events", "Weather", "Student Spotlight"];

function Empty({ icon, label, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: C.gray }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icon || "📭"}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 13, color: C.gray }}>{sub}</div>}
    </div>
  );
}

function SubmitForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", school: "", email: "", headline: "", category: "", summary: "" });
  const [submitted, setSubmitted] = useState(false);
  const up = function(k, v) { setForm(function(f) { var n = Object.assign({}, f); n[k] = v; return n; }); };

  if (submitted) {
    return (
      <div style={{ background: C.card, borderRadius: 16, padding: 36, border: "1px solid #1a2a5e", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h3 style={{ color: C.lime, marginBottom: 10 }}>Submission Received!</h3>
        <p style={{ color: C.gray, fontSize: 14, lineHeight: 1.7 }}>
          Thanks for submitting to <strong style={{ color: C.white }}>KrynoluxDC</strong>! Our editorial team will review your story within <strong style={{ color: C.accent }}>48 hours</strong>.
        </p>
        <div style={{ background: "#0a0f2c", borderRadius: 10, padding: 14, marginTop: 16, fontSize: 13, color: C.gray }}>
          Submission ID: <span style={{ color: C.accent, fontFamily: "monospace" }}>KDC-{Date.now().toString().slice(-6)}</span>
        </div>
        <button onClick={function() { setStep(1); setForm({ name: "", school: "", email: "", headline: "", category: "", summary: "" }); setSubmitted(false); }} style={{ marginTop: 20, padding: "10px 24px", background: "transparent", border: "1px solid " + C.accent, borderRadius: 8, color: C.accent, cursor: "pointer", fontSize: 13 }}>Submit Another</button>
      </div>
    );
  }

  var inputStyle = { width: "100%", marginBottom: 12, padding: "10px 14px", background: "#0a0f2c", border: "1px solid #1a2a5e", borderRadius: 8, color: C.white, fontSize: 14, boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 28, border: "1px solid #1a2a5e", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map(function(n) {
          return <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= n ? C.accent : "#1a2a5e", transition: "background 0.3s" }} />;
        })}
      </div>
      {step === 1 && (
        <div>
          <h3 style={{ color: C.white, marginBottom: 18 }}>Step 1 — Your Info</h3>
          <input type="text" placeholder="Full Name" value={form.name} onChange={function(e) { up("name", e.target.value); }} style={inputStyle} />
          <input type="text" placeholder="School / Organization" value={form.school} onChange={function(e) { up("school", e.target.value); }} style={inputStyle} />
          <input type="email" placeholder="Email Address" value={form.email} onChange={function(e) { up("email", e.target.value); }} style={inputStyle} />
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 style={{ color: C.white, marginBottom: 18 }}>Step 2 — Your Story</h3>
          <input placeholder="Article Headline / Title" value={form.headline} onChange={function(e) { up("headline", e.target.value); }} style={inputStyle} />
          <select value={form.category} onChange={function(e) { up("category", e.target.value); }} style={Object.assign({}, inputStyle, { color: form.category ? C.white : C.gray })}>
            <option value="">Select Category</option>
            {["Local News", "Schools", "Sports", "Events", "Weather", "Opinion", "Student Spotlight"].map(function(c) { return <option key={c}>{c}</option>; })}
          </select>
          <textarea placeholder="Article summary / pitch (min 100 words)..." value={form.summary} onChange={function(e) { up("summary", e.target.value); }} rows={5} style={Object.assign({}, inputStyle, { resize: "vertical" })} />
        </div>
      )}
      {step === 3 && (
        <div>
          <h3 style={{ color: C.white, marginBottom: 14 }}>Step 3 — Review & Submit</h3>
          {[["Name", form.name], ["School", form.school], ["Email", form.email], ["Headline", form.headline], ["Category", form.category]].map(function(item) {
            return (
              <div key={item[0]} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a2a5e" }}>
                <span style={{ color: C.gray, fontSize: 13 }}>{item[0]}</span>
                <span style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{item[1] || "—"}</span>
              </div>
            );
          })}
          <p style={{ color: C.gray, fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>By submitting, you agree to KrynoluxDC's editorial guidelines and community standards. All content is reviewed before publishing.</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 1 && <button onClick={function() { setStep(function(s) { return s - 1; }); }} style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #1a2a5e", borderRadius: 8, color: C.gray, cursor: "pointer", fontSize: 14 }}>Back</button>}
        <button onClick={function() { if (step < 3) { setStep(function(s) { return s + 1; }); } else { setSubmitted(true); } }} style={{ flex: 2, padding: "12px", background: "linear-gradient(90deg," + C.neon + "," + C.accent + ")", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
          {step === 3 ? "Submit Story 🚀" : "Next →"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <div style={{ background: C.navy, minHeight: "100vh", fontFamily: "Inter, Segoe UI, sans-serif", color: C.white }}>
      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,15,44,0.97)", borderBottom: "1px solid #1a2a5e", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg," + C.neon + "," + C.accent + ")", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#fff" }}>K</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.accent }}>KrynoluxDC</div>
              <div style={{ color: C.gray, fontSize: 9, letterSpacing: 1 }}>YOUR VOICE. YOUR CITY. YOUR NEWS.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {navItems.map(function(n) {
              return (
                <button key={n} onClick={function() { setActiveNav(n); }} style={{ background: activeNav === n ? C.neon + "22" : "transparent", border: activeNav === n ? "1px solid " + C.accent + "66" : "1px solid transparent", color: activeNav === n ? C.accent : C.gray, padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{n}</button>
              );
            })}
            <button onClick={function() { setActiveNav("Submit"); }} style={{ background: "linear-gradient(90deg," + C.neon + "," + C.accent + ")", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✍️ Submit</button>
          </div>
        </div>
        <div style={{ background: C.red, padding: "5px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 11, letterSpacing: 1 }}>LIVE</span>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.4)" }} />
          <span style={{ fontSize: 12 }}>KrynoluxDC is live — stories coming soon. Submit yours today!</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px" }}>

        {/* SUBMIT PAGE */}
        {activeNav === "Submit" && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: C.accent, margin: 0 }}>Submit Your Story</h2>
              <p style={{ color: C.gray, marginTop: 8 }}>All submissions are reviewed by our editorial team within 48 hours.</p>
            </div>
            <SubmitForm />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginTop: 24 }}>
              {[["📋", "Editorial Review", "Every article is reviewed by a senior editor before publishing."], ["🔒", "Safe & Moderated", "All writers must agree to our community standards."], ["🏅", "Earn Badges", "Get recognized with badges and featured writer status."]].map(function(item) {
                return (
                  <div key={item[1]} style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid #1a2a5e" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item[0]}</div>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item[1]}</div>
                    <div style={{ color: C.gray, fontSize: 12, lineHeight: 1.5 }}>{item[2]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ALL OTHER PAGES — EMPTY STATE */}
        {activeNav !== "Submit" && (
          <div>
            {/* HERO */}
            <div style={{ background: "linear-gradient(135deg," + C.deep + " 0%,#1a0a3e 50%," + C.navy + " 100%)", borderRadius: 20, padding: "40px 32px", marginBottom: 28, border: "1px solid #1a2a5e", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "radial-gradient(circle," + C.neon + "22,transparent 70%)", borderRadius: "50%" }} />
              <span style={{ background: C.red, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>LAUNCHING SOON</span>
              <h1 style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, margin: "12px 0", lineHeight: 1.2, color: C.white }}>
                The DMV's First Youth-Led<br />News Network Is Here.
              </h1>
              <p style={{ color: C.gray, fontSize: 15, maxWidth: 520, lineHeight: 1.7, marginBottom: 20 }}>
                Real stories. Real students. Real impact. KrynoluxDC covers Fairfax, Loudoun, and Washington DC — written by the generation that lives it.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={function() { setActiveNav("Submit"); }} style={{ background: "linear-gradient(90deg," + C.neon + "," + C.accent + ")", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✍️ Submit Your Story</button>
              </div>
            </div>

            {/* SECTION LABEL */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 4, height: 24, background: "linear-gradient(180deg," + C.neon + "," + C.accent + ")", borderRadius: 2 }} />
              <h2 style={{ margin: 0, fontSize: 20, color: C.white }}>
                {activeNav === "Home" ? "🔥 Top Stories" : activeNav}
              </h2>
            </div>

            {/* EMPTY NEWS STATE */}
            <div style={{ background: C.card, borderRadius: 16, border: "1px solid #1a2a5e" }}>
              <Empty
                icon="📰"
                label="No stories published yet."
                sub="Be the first to submit a story to KrynoluxDC!"
              />
              <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
                <button onClick={function() { setActiveNav("Submit"); }} style={{ padding: "10px 28px", background: "linear-gradient(90deg," + C.neon + "," + C.accent + ")", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>✍️ Submit the First Story</button>
              </div>
            </div>

            {/* STUDENT SPOTLIGHT EMPTY */}
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 4, height: 24, background: "linear-gradient(180deg," + C.neon + "," + C.accent + ")", borderRadius: 2 }} />
                <h2 style={{ margin: 0, fontSize: 20, color: C.white }}>🌟 Student Spotlight</h2>
              </div>
              <div style={{ background: C.card, borderRadius: 16, border: "1px solid #1a2a5e" }}>
                <Empty icon="🎖️" label="No featured writers yet." sub="Student journalists will be highlighted here once articles are approved." />
              </div>
            </div>

            {/* DAILY RECAP EMPTY */}
            <div style={{ marginTop: 32, background: "linear-gradient(90deg,#0F1A3E,#1a0a3e)", borderRadius: 16, padding: 24, border: "1px solid #1a2a5e" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <span style={{ color: C.accent, fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>DAILY RECAP</span>
              </div>
              <div style={{ color: C.gray, fontSize: 13 }}>No recap available yet. Check back once stories are published.</div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #1a2a5e", padding: "24px 16px", maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, color: C.accent, fontSize: 16 }}>KrynoluxDC</div>
          <div style={{ color: C.gray, fontSize: 11 }}>krynolux.work · Fairfax · Loudoun · Washington DC</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["About", "Contact", "Privacy", "Guidelines"].map(function(l) {
            return <span key={l} style={{ color: C.gray, fontSize: 12, cursor: "pointer" }}>{l}</span>;
          })}
        </div>
        <div style={{ color: C.gray, fontSize: 11 }}>© 2026 KrynoluxDC · Youth-Led News</div>
      </div>
    </div>
  );
}