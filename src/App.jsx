import { useState, useEffect } from "react";

const NAV = ["Home", "Local News", "Schools", "Sports", "Events", "Weather", "Student Spotlight", "Submit"];

const TICKER = [
  "KrynoluxDC is live — submit your first story today!",
  "Covering Fairfax, Loudoun, and Washington DC",
  "Youth-led journalism for the DMV community",
  "Be the first student journalist on KrynoluxDC",
];

function Ticker() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(function() {
    const t = setInterval(function() {
      setFade(false);
      setTimeout(function() {
        setI(function(x) { return (x + 1) % TICKER.length; });
        setFade(true);
      }, 400);
    }, 4000);
    return function() { clearInterval(t); };
  }, []);
  return (
    <div style={{ background: "#C8102E", padding: "7px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ background: "white", color: "#C8102E", fontSize: 10, fontWeight: 900, padding: "2px 7px", borderRadius: 3, letterSpacing: 1, whiteSpace: "nowrap" }}>BREAKING</span>
        <span style={{ color: "white", fontSize: 13, opacity: fade ? 1 : 0, transition: "opacity 0.4s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {TICKER[i]}
        </span>
      </div>
    </div>
  );
}

function NavBar(props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(function() {
    const onScroll = function() { setScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", onScroll);
    return function() { window.removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 200, background: "white", borderBottom: scrolled ? "1px solid #e5e5e5" : "1px solid #e5e5e5", boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 0.3s" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 6, background: "#C8102E", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "white" }}>K</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, color: "#1a1a1a", letterSpacing: -0.5 }}>KrynoluxDC</div>
              <div style={{ fontSize: 9, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginTop: -2 }}>Youth-Led News · DMV</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#f5f5f5", borderRadius: 20, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>🔍</span>
              <span style={{ fontSize: 13, color: "#999" }}>Search stories...</span>
            </div>
            <button onClick={function() { props.setNav("Submit"); }} style={{ background: "#C8102E", border: "none", color: "white", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Submit Story</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "2px 0" }}>
          {NAV.map(function(n) {
            return (
              <button key={n} onClick={function() { props.setNav(n); }} style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: props.nav === n ? "3px solid #C8102E" : "3px solid transparent", color: props.nav === n ? "#C8102E" : "#444", cursor: "pointer", fontSize: 13, fontWeight: props.nav === n ? 700 : 500, whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeroSection(props) {
  return (
    <div style={{ background: "#fafafa", borderBottom: "1px solid #eee", padding: "40px 0 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 280 }}>
            <div style={{ display: "inline-block", background: "#C8102E", color: "white", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 3, letterSpacing: 1, marginBottom: 14 }}>FEATURED</div>
            <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 14px", fontFamily: "Georgia, serif" }}>
              The DMV's First Youth-Led News Network Has Arrived
            </h1>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
              Real stories from real students across Fairfax, Loudoun, and Washington DC. Written by the generation that lives it.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={function() { props.setNav("Submit"); }} style={{ background: "#C8102E", border: "none", color: "white", padding: "11px 22px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✍️ Submit Your Story</button>
              <button style={{ background: "white", border: "1px solid #ddd", color: "#333", padding: "11px 22px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Learn More</button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ background: "linear-gradient(135deg, #1a1a2e, #C8102E)", height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>📰</div>
              <div style={{ padding: "16px" }}>
                <div style={{ fontSize: 10, color: "#C8102E", fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>ABOUT KRYNOLUXDC</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Youth journalism for the DMV community</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>Student-written stories reviewed by our editorial team.</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 28, paddingTop: 20, borderTop: "1px solid #eee", flexWrap: "wrap" }}>
          {[["📰", "0", "Stories Published"], ["✍️", "0", "Student Writers"], ["🏫", "0", "Schools Covered"], ["📍", "3", "Counties"]].map(function(item) {
            return (
              <div key={item[2]} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{item[0]}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: "#1a1a1a" }}>{item[1]}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{item[2]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NewsCard(props) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={function() { setHov(true); }} onMouseLeave={function() { setHov(false); }}
      style={{ background: "white", borderRadius: 10, border: "1px solid #eee", overflow: "hidden", boxShadow: hov ? "0 8px 32px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.04)", transform: hov ? "translateY(-3px)" : "none", transition: "all 0.25s ease", cursor: "pointer" }}>
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#2d1b69)", height: props.big ? 200 : 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: props.big ? 56 : 40 }}>
        {props.emoji}
      </div>
      <div style={{ padding: props.big ? "18px" : "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ background: "#fff0f0", color: "#C8102E", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 3, letterSpacing: 0.5 }}>{props.category}</span>
          <span style={{ color: "#aaa", fontSize: 11 }}>{props.time}</span>
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: props.big ? 18 : 14, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3, fontFamily: "Georgia, serif" }}>{props.title}</h3>
        <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.6 }}>{props.summary}</p>
        {props.big && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, color: "#C8102E", fontSize: 13, fontWeight: 700 }}>
            Read More <span>→</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel(props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <div style={{ width: 4, height: 22, background: "#C8102E", borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: 0.5 }}>{props.label}</h2>
    </div>
  );
}

function WeatherWidget() {
  return (
    <div style={{ background: "linear-gradient(135deg,#1a1a2e,#C8102E)", borderRadius: 10, padding: 20, color: "white" }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8, marginBottom: 10 }}>DMV WEATHER</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 42, fontWeight: 900 }}>87°F</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Partly Cloudy · Fairfax</div>
        </div>
        <span style={{ fontSize: 44 }}>🌤️</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[["Mon","92°","☀️"],["Tue","88°","⛅"],["Wed","79°","🌧️"],["Thu","83°","🌤️"]].map(function(d) {
          return (
            <div key={d[0]} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "6px 2px" }}>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{d[0]}</div>
              <div style={{ fontSize: 16 }}>{d[2]}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{d[1]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Poll() {
  const [voted, setVoted] = useState(null);
  const opts = ["Climate & Environment", "School Policies", "Local Sports", "Youth Entrepreneurs"];
  const votes = [340, 280, 190, 210];
  const total = votes.reduce(function(a, b) { return a + b; }, 0);
  return (
    <div style={{ background: "white", borderRadius: 10, border: "1px solid #eee", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#C8102E", letterSpacing: 1, marginBottom: 8 }}>COMMUNITY POLL</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>What topic should we cover more?</div>
      {opts.map(function(o, i) {
        const pct = Math.round((votes[i] / total) * 100);
        return (
          <div key={o} onClick={function() { setVoted(i); }} style={{ marginBottom: 10, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: voted === i ? "#C8102E" : "#444", fontWeight: voted === i ? 700 : 400, marginBottom: 4 }}>
              <span>{o}</span><span>{pct}%</span>
            </div>
            <div style={{ background: "#f0f0f0", borderRadius: 4, height: 6 }}>
              <div style={{ width: pct + "%", height: "100%", background: voted === i ? "#C8102E" : "#ccc", borderRadius: 4, transition: "width 0.5s, background 0.3s" }} />
            </div>
          </div>
        );
      })}
      {voted !== null ? <div style={{ marginTop: 10, color: "#22a06b", fontSize: 12, fontWeight: 700 }}>✓ Thanks for voting!</div> : null}
    </div>
  );
}

function SubmitPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [cat, setCat] = useState("");
  const [body, setBody] = useState("");

  const inp = { width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 7, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "inherit" };

  if (done) {
    return (
      <div style={{ maxWidth: 560, margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: "#1a1a1a", marginBottom: 10 }}>Story Submitted!</h2>
        <p style={{ color: "#666", lineHeight: 1.7, marginBottom: 20 }}>Our editorial team will review your story within 48 hours. You'll hear back at the email you provided.</p>
        <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14, fontSize: 13, color: "#888" }}>
          Submission ID: <strong style={{ color: "#C8102E" }}>KDC-{Date.now().toString().slice(-6)}</strong>
        </div>
        <button onClick={function() { setDone(false); setStep(1); setName(""); setSchool(""); setEmail(""); setHeadline(""); setCat(""); setBody(""); }} style={{ marginTop: 20, padding: "10px 22px", background: "#C8102E", border: "none", borderRadius: 7, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Submit Another</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", marginBottom: 6 }}>Submit Your Story</h2>
      <p style={{ color: "#666", marginBottom: 28, fontSize: 14 }}>All submissions are reviewed by our editorial team before publishing.</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[1, 2, 3].map(function(n) {
          return (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= n ? "#C8102E" : "#eee", transition: "background 0.3s" }} />
          );
        })}
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #eee", padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        {step === 1 && (
          <div>
            <h3 style={{ color: "#1a1a1a", marginBottom: 18, fontSize: 16 }}>Step 1 — Your Info</h3>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Full Name</label>
            <input value={name} onChange={function(e) { setName(e.target.value); }} placeholder="Your full name" style={inp} />
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>School / Organization</label>
            <input value={school} onChange={function(e) { setSchool(e.target.value); }} placeholder="Your school" style={inp} />
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Email Address</label>
            <input value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="your@email.com" style={inp} />
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 style={{ color: "#1a1a1a", marginBottom: 18, fontSize: 16 }}>Step 2 — Your Story</h3>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Headline</label>
            <input value={headline} onChange={function(e) { setHeadline(e.target.value); }} placeholder="Article headline" style={inp} />
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Category</label>
            <select value={cat} onChange={function(e) { setCat(e.target.value); }} style={Object.assign({}, inp, { color: cat ? "#1a1a1a" : "#999" })}>
              <option value="">Select a category</option>
              {["Local News","Schools","Sports","Events","Weather","Opinion","Student Spotlight"].map(function(c) { return <option key={c} value={c}>{c}</option>; })}
            </select>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Article Body</label>
            <textarea value={body} onChange={function(e) { setBody(e.target.value); }} placeholder="Write your article or pitch here..." rows={6} style={Object.assign({}, inp, { resize: "vertical" })} />
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 style={{ color: "#1a1a1a", marginBottom: 18, fontSize: 16 }}>Step 3 — Review</h3>
            {[["Name", name], ["School", school], ["Email", email], ["Headline", headline], ["Category", cat]].map(function(item) {
              return (
                <div key={item[0]} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ color: "#888", fontSize: 13 }}>{item[0]}</span>
                  <span style={{ color: "#1a1a1a", fontSize: 13, fontWeight: 600 }}>{item[1] || "—"}</span>
                </div>
              );
            })}
            <p style={{ color: "#888", fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>By submitting you agree to KrynoluxDC's editorial guidelines and community standards.</p>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {step > 1 ? <button onClick={function() { setStep(step - 1); }} style={{ flex: 1, padding: "11px", background: "#f5f5f5", border: "none", borderRadius: 7, color: "#555", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Back</button> : null}
          <button onClick={function() { if (step < 3) { setStep(step + 1); } else { setDone(true); } }} style={{ flex: 2, padding: "11px", background: "#C8102E", border: "none", borderRadius: 7, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
            {step === 3 ? "Submit Story 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [nav, setNav] = useState("Home");

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a" }}>
      <Ticker />
      <NavBar nav={nav} setNav={setNav} />

      {nav === "Submit" ? (
        <SubmitPage />
      ) : (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" }}>
          <HeroSection setNav={setNav} />

          <div style={{ marginTop: 36 }}>
            <SectionLabel label="Latest Stories" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {[
                ["📰","LOCAL NEWS","No stories yet — be the first to submit!","Submit your local story to get featured here.","Just now"],
                ["🏫","SCHOOLS","School news coming soon","Cover campus life, policies, and achievements.","Today"],
                ["🏆","SPORTS","Sports coverage launching soon","Submit game recaps, player spotlights, and more.","Today"],
              ].map(function(item) {
                return <NewsCard key={item[1]} emoji={item[0]} category={item[1]} title={item[2]} summary={item[3]} time={item[4]} big={false} />;
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginTop: 40, alignItems: "start" }}>
            <div>
              <SectionLabel label="Featured" />
              <NewsCard emoji="🎤" category="COMMUNITY" title="KrynoluxDC is officially live — and we need your stories" summary="We are building the DMV's first youth-led news network. Students from Fairfax, Loudoun, and Washington DC are invited to submit their first stories and become founding journalists." time="Today" big={true} />

              <div style={{ marginTop: 32 }}>
                <SectionLabel label="Daily Recap" />
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #eee", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>Saturday, April 25, 2026</div>
                  <div style={{ color: "#555", fontSize: 14, lineHeight: 1.8 }}>
                    No stories published yet. Submit the first story to KrynoluxDC and kick off the daily recap!
                  </div>
                  <button onClick={function() { setNav("Submit"); }} style={{ marginTop: 14, padding: "9px 18px", background: "#C8102E", border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✍️ Submit First Story</button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <WeatherWidget />
              <Poll />
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #eee", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#C8102E", letterSpacing: 1, marginBottom: 10 }}>STUDENT SPOTLIGHT</div>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎖️</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>No featured writers yet</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>Student journalists will appear here once articles are approved.</div>
                  <button onClick={function() { setNav("Submit"); }} style={{ padding: "8px 16px", background: "#C8102E", border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Become a Writer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#1a1a1a", color: "white", marginTop: 60, padding: "32px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "white" }}>KrynoluxDC</div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 3 }}>krynolux.work · Fairfax · Loudoun · Washington DC</div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["About","Contact","Privacy","Guidelines","Submit"].map(function(l) {
              return <span key={l} style={{ color: "#888", fontSize: 13, cursor: "pointer" }}>{l}</span>;
            })}
          </div>
          <div style={{ color: "#555", fontSize: 12 }}>© 2026 KrynoluxDC · Youth-Led News</div>
        </div>
      </div>
    </div>
  );
}
