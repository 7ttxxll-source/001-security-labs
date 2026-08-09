import GuardianShowcase from "./components/GuardianShowcase"
import "./components/GuardianShowcase.css"

import SupportFaq from "./components/SupportFaq"
import "./components/SupportFaq.css"

const navigationItems = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Products",
    href: "#products",
  },
  {
    label: "Security",
    href: "#guardian",
  },
  {
    label: "Support",
    href: "#support",
  },
]

const heroStats = [
  {
    value: "24/7",
    label: "Protection Ready",
  },
  {
    value: "SHA-256",
    label: "Evidence Integrity",
  },
  {
    value: "LIVE",
    label: "Threat Detection",
  },
]

const guardianStates = [
  {
    label: "PROTECTION ENGINE",
    value: "ARMED",
  },
  {
    label: "THREAT CORRELATION",
    value: "ARMED",
  },
  {
    label: "BLACK BOX",
    value: "READY",
  },
  {
    label: "RECOVERY SYSTEM",
    value: "READY",
  },
]

const guardianFeatures = [
  "Live Protection",
  "Black Box",
  "Incident Engine",
  "Threat Core",
  "Recovery",
  "Zero Setup",
]

function Header() {
  return (
    <header className="navbar">
      <a
        className="brand"
        href="#home"
        aria-label="001 Security Labs Home"
      >
        <div className="brand-mark">
          001
        </div>

        <div>
          <div className="brand-name">
            001 SECURITY LABS
          </div>

          <div className="brand-sub">
            ADVANCED SECURITY SYSTEMS
          </div>
        </div>
      </a>

      <nav
        className="nav-links"
        aria-label="Primary navigation"
      >
        {navigationItems.map((item) => (
          <a
            href={item.href}
            key={item.label}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="nav-button"
        href="#products"
      >
        Explore Products
      </a>
    </header>
  )
}

function HeroStats() {
  return (
    <div className="hero-stats">
      {heroStats.map((stat, index) => (
        <div
          key={stat.value}
          style={{
            display: "contents",
          }}
        >
          <div className="stat">
            <span className="stat-number">
              {stat.value}
            </span>

            <span className="stat-label">
              {stat.label}
            </span>
          </div>

          {index < heroStats.length - 1 && (
            <div
              className="stat-line"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function GuardianStatusCard() {
  return (
    <div className="guardian-card">
      <div className="card-top">
        <div>
          <span className="card-kicker">
            001 PRODUCT / 01
          </span>

          <h2>
            GUARDIAN
          </h2>
        </div>

        <div className="live-badge">
          <span />

          ACTIVE
        </div>
      </div>

      <div
        className="scanner"
        aria-hidden="true"
      >
        <div className="scanner-ring ring-one" />
        <div className="scanner-ring ring-two" />
        <div className="scanner-ring ring-three" />

        <div className="scanner-core">
          <div className="shield">
            001
          </div>
        </div>

        <div className="scanner-line" />
      </div>

      <div className="security-state">
        {guardianStates.map((state) => (
          <div
            className="state-row"
            key={state.label}
          >
            <span>
              {state.label}
            </span>

            <strong>
              {state.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section
      className="hero"
      id="home"
    >
      <div
        className="grid-background"
        aria-hidden="true"
      />

      <div className="hero-content">
        <div className="status-pill">
          <span className="status-dot" />

          001 SECURITY NETWORK ONLINE
        </div>

        <p className="eyebrow">
          001 SECURITY LABS PRESENTS
        </p>

        <h1>
          SECURITY BUILT

          <span>
            {" "}
            FOR WHAT HAPPENS NEXT.
          </span>
        </h1>

        <p className="hero-description">
          Advanced Discord security engineered for live detection,
          forensic evidence, incident intelligence, threat correlation
          and structural recovery.
        </p>

        <div className="hero-actions">
          <a
            className="primary-button"
            href="#guardian"
          >
            View 001 Guardian

            <span aria-hidden="true">
              →
            </span>
          </a>

          <a
            className="secondary-button"
            href="#guardian"
          >
            Explore Security
          </a>
        </div>

        <HeroStats />
      </div>

      <GuardianStatusCard />
    </section>
  )
}

function Products() {
  return (
    <section
      className="products"
      id="products"
    >
      <div className="section-heading">
        <p>
          001 / PRODUCTS
        </p>

        <h2>
          Built for serious communities.
        </h2>

        <span>
          Security infrastructure for Discord communities where
          permissions, evidence, uptime and recovery actually matter.
        </span>
      </div>

      <a
        href="#guardian"
        className="product-card"
        aria-label="View 001 Guardian"
      >
        <div className="product-number">
          01
        </div>

        <div className="product-copy">
          <span className="product-type">
            DISCORD SECURITY SYSTEM
          </span>

          <h3>
            001 GUARDIAN
          </h3>

          <p>
            Guardian combines continuous monitoring, actor attribution,
            forensic Black Box snapshots, structured incidents,
            Threat Core correlation and supported recovery workflows
            inside one security platform.
          </p>

          <div className="feature-tags">
            {guardianFeatures.map((feature) => (
              <span key={feature}>
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div
          className="product-arrow"
          aria-hidden="true"
        >
          ↗
        </div>
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact">
      <div>
        <strong>
          001 SECURITY LABS
        </strong>

        <span>
          Advanced Discord Security & Recovery Systems
        </span>
      </div>

      <div>
        <p>
          001 GUARDIAN / V1.0.0
        </p>

        <p>
          BUILT BY HAMOOD — 001
        </p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <main className="site">
      <Header />

      <Hero />

      <Products />

      <GuardianShowcase />

      <SupportFaq />

      <Footer />
    </main>
  )
}

export default App