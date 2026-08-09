import GuardianShowcase from "./components/GuardianShowcase"
import "./components/GuardianShowcase.css"

function App() {
  return (
    <main className="site">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">001</div>

          <div>
            <div className="brand-name">001 SECURITY LABS</div>
            <div className="brand-sub">ADVANCED SECURITY SYSTEMS</div>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#guardian">Security</a>
          <a href="#contact">Support</a>
        </div>

        <a className="nav-button" href="#products">
          Explore Products
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="grid-background" />

        <div className="hero-content">
          <div className="status-pill">
            <span className="status-dot" />
            001 SECURITY NETWORK ONLINE
          </div>

          <p className="eyebrow">001 SECURITY LABS PRESENTS</p>

          <h1>
            SECURITY BUILT
            <span> FOR WHAT HAPPENS NEXT.</span>
          </h1>

          <p className="hero-description">
            Advanced Discord security systems engineered for detection,
            investigation, forensic evidence and structural recovery.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#guardian">
              View 001 Guardian
              <span>→</span>
            </a>

            <a className="secondary-button" href="#guardian">
              Explore Security
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Protection Ready</span>
            </div>

            <div className="stat-line" />

            <div className="stat">
              <span className="stat-number">SHA-256</span>
              <span className="stat-label">Evidence Integrity</span>
            </div>

            <div className="stat-line" />

            <div className="stat">
              <span className="stat-number">LIVE</span>
              <span className="stat-label">Threat Detection</span>
            </div>
          </div>
        </div>

        <div className="guardian-card">
          <div className="card-top">
            <div>
              <span className="card-kicker">001 PRODUCT / 01</span>
              <h2>GUARDIAN</h2>
            </div>

            <div className="live-badge">
              <span />
              ACTIVE
            </div>
          </div>

          <div className="scanner">
            <div className="scanner-ring ring-one" />
            <div className="scanner-ring ring-two" />
            <div className="scanner-ring ring-three" />

            <div className="scanner-core">
              <div className="shield">001</div>
            </div>

            <div className="scanner-line" />
          </div>

          <div className="security-state">
            <div className="state-row">
              <span>PROTECTION ENGINE</span>
              <strong>ARMED</strong>
            </div>

            <div className="state-row">
              <span>THREAT CORRELATION</span>
              <strong>ARMED</strong>
            </div>

            <div className="state-row">
              <span>BLACK BOX</span>
              <strong>READY</strong>
            </div>

            <div className="state-row">
              <span>RECOVERY SYSTEM</span>
              <strong>READY</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="products" id="products">
        <div className="section-heading">
          <p>001 / PRODUCTS</p>

          <h2>Built for serious communities.</h2>

          <span>
            Our first security platform is designed to protect, investigate
            and recover critical Discord infrastructure.
          </span>
        </div>

        <a href="#guardian" className="product-card">
          <div className="product-number">01</div>

          <div className="product-copy">
            <span className="product-type">DISCORD SECURITY SYSTEM</span>

            <h3>001 GUARDIAN</h3>

            <p>
              Live protection, Incident Engine, Black Box forensics,
              Threat Correlation and structural recovery in one system.
            </p>

            <div className="feature-tags">
              <span>Live Protection</span>
              <span>Black Box</span>
              <span>Incident Engine</span>
              <span>Recovery</span>
            </div>
          </div>

          <div className="product-arrow">↗</div>
        </a>
      </section>

      <GuardianShowcase />

      <footer id="contact">
        <div>
          <strong>001 SECURITY LABS</strong>
          <span>Advanced Discord Security & Recovery Systems</span>
        </div>

        <p>BUILT BY HAMOOD — 001</p>
      </footer>
    </main>
  )
}

export default App