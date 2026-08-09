import { useEffect } from "react"

import GuardianShowcase from "./components/GuardianShowcase"
import "./components/GuardianShowcase.css"

import SupportFaq from "./components/SupportFaq"
import "./components/SupportFaq.css"

import "./App.css"

const GUARDIAN_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1535228662641725520"

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

const telemetryItems = [
  "LIVE PROTECTION / ARMED",
  "ROLE GUARD / ARMED",
  "CHANNEL GUARD / ARMED",
  "WEBHOOK GUARD / ARMED",
  "THREAT CORE / ARMED",
  "BLACK BOX / READY",
  "RECOVERY / READY",
  "SHA-256 / VERIFIED",
]

const particles = [
  ["8%", "18%", "2px", "0s"],
  ["14%", "72%", "3px", "1.1s"],
  ["21%", "38%", "2px", "2.4s"],
  ["28%", "81%", "2px", "0.8s"],
  ["34%", "14%", "3px", "1.8s"],
  ["41%", "61%", "2px", "3.1s"],
  ["48%", "26%", "2px", "2s"],
  ["54%", "76%", "3px", "0.4s"],
  ["61%", "18%", "2px", "2.8s"],
  ["67%", "54%", "2px", "1.5s"],
  ["73%", "84%", "3px", "2.2s"],
  ["79%", "31%", "2px", "0.9s"],
  ["85%", "67%", "2px", "3.5s"],
  ["91%", "22%", "3px", "1.3s"],
  ["95%", "74%", "2px", "2.7s"],
]

function useMotionSystem() {
  useEffect(() => {
    const site = document.querySelector(".site")

    if (!site) {
      return undefined
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const revealSelectors = [
      "[data-reveal]",
      ".guardian-showcase .guardian-heading",
      ".guardian-showcase .guardian-terminal",
      ".guardian-showcase .guardian-capabilities article",
      ".guardian-showcase .attack-flow-heading",
      ".guardian-showcase .flow-item",
      ".guardian-showcase .comparison-heading",
      ".guardian-showcase .comparison-card",
      ".guardian-showcase .guardian-cta",
      ".support-faq .support-intro",
      ".support-faq .faq-item",
      ".support-faq .support-panel",
    ]

    const targets = document.querySelectorAll(
      revealSelectors.join(","),
    )

    targets.forEach((element, index) => {
      element.classList.add("motion-target")

      element.style.setProperty(
        "--reveal-delay",
        `${(index % 6) * 70}ms`,
      )

      if (reduceMotion) {
        element.classList.add("is-visible")
      }
    })

    let observer

    if (!reduceMotion) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible")
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px",
        },
      )

      targets.forEach((target) => {
        observer.observe(target)
      })
    }

    let animationFrame = null

    const updatePointer = (event) => {
      if (reduceMotion) {
        return
      }

      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      animationFrame = requestAnimationFrame(() => {
        site.style.setProperty(
          "--pointer-x",
          `${event.clientX}px`,
        )

        site.style.setProperty(
          "--pointer-y",
          `${event.clientY}px`,
        )
      })
    }

    const updateScroll = () => {
      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight

      const progress =
        documentHeight > 0
          ? window.scrollY / documentHeight
          : 0

      site.style.setProperty(
        "--scroll-progress",
        String(progress),
      )

      site.style.setProperty(
        "--parallax-y",
        `${Math.min(window.scrollY * 0.06, 120)}px`,
      )
    }

    window.addEventListener(
      "pointermove",
      updatePointer,
      { passive: true },
    )

    window.addEventListener(
      "scroll",
      updateScroll,
      { passive: true },
    )

    updateScroll()

    const guardianCard =
      document.querySelector(".guardian-card")

    const handleCardMove = (event) => {
      if (!guardianCard || reduceMotion) {
        return
      }

      const rect =
        guardianCard.getBoundingClientRect()

      const x =
        (event.clientX - rect.left) /
        rect.width

      const y =
        (event.clientY - rect.top) /
        rect.height

      guardianCard.style.setProperty(
        "--card-rotate-y",
        `${(x - 0.5) * 7}deg`,
      )

      guardianCard.style.setProperty(
        "--card-rotate-x",
        `${(0.5 - y) * 7}deg`,
      )
    }

    const resetCard = () => {
      if (!guardianCard) {
        return
      }

      guardianCard.style.setProperty(
        "--card-rotate-y",
        "0deg",
      )

      guardianCard.style.setProperty(
        "--card-rotate-x",
        "0deg",
      )
    }

    guardianCard?.addEventListener(
      "pointermove",
      handleCardMove,
    )

    guardianCard?.addEventListener(
      "pointerleave",
      resetCard,
    )

    const magneticButtons =
      document.querySelectorAll(
        ".primary-button, .nav-button, .final-install-button",
      )

    const magneticCleanups = []

    magneticButtons.forEach((button) => {
      const move = (event) => {
        if (reduceMotion) {
          return
        }

        const rect =
          button.getBoundingClientRect()

        const x =
          event.clientX -
          rect.left -
          rect.width / 2

        const y =
          event.clientY -
          rect.top -
          rect.height / 2

        button.style.setProperty(
          "--magnetic-x",
          `${x * 0.08}px`,
        )

        button.style.setProperty(
          "--magnetic-y",
          `${y * 0.08}px`,
        )
      }

      const leave = () => {
        button.style.setProperty(
          "--magnetic-x",
          "0px",
        )

        button.style.setProperty(
          "--magnetic-y",
          "0px",
        )
      }

      button.addEventListener(
        "pointermove",
        move,
      )

      button.addEventListener(
        "pointerleave",
        leave,
      )

      magneticCleanups.push(() => {
        button.removeEventListener(
          "pointermove",
          move,
        )

        button.removeEventListener(
          "pointerleave",
          leave,
        )
      })
    })

    return () => {
      observer?.disconnect()

      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      window.removeEventListener(
        "pointermove",
        updatePointer,
      )

      window.removeEventListener(
        "scroll",
        updateScroll,
      )

      guardianCard?.removeEventListener(
        "pointermove",
        handleCardMove,
      )

      guardianCard?.removeEventListener(
        "pointerleave",
        resetCard,
      )

      magneticCleanups.forEach(
        (cleanup) => cleanup(),
      )
    }
  }, [])
}

function MotionBackground() {
  return (
    <>
      <div
        className="page-progress"
        aria-hidden="true"
      />

      <div
        className="pointer-aura"
        aria-hidden="true"
      />

      <div
        className="global-grid"
        aria-hidden="true"
      />

      <div
        className="global-beam"
        aria-hidden="true"
      />
    </>
  )
}

function Header() {
  return (
    <header className="navbar">
      <a
        className="brand"
        href="#home"
        aria-label="001 Security Labs Home"
      >
        <div className="brand-mark">
          <span>001</span>
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
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a
        className="nav-button"
        href={GUARDIAN_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Add 001 Guardian to Discord"
      >
        <span>
          ADD GUARDIAN
        </span>

        <span aria-hidden="true">
          ↗
        </span>
      </a>
    </header>
  )
}

function HeroStats() {
  return (
    <div
      className="hero-stats"
      data-reveal
    >
      {heroStats.map((stat, index) => (
        <div
          key={stat.value}
          style={{ display: "contents" }}
        >
          <div className="stat">
            <span className="stat-number">
              {stat.value}
            </span>

            <span className="stat-label">
              {stat.label}
            </span>

            <span
              className="stat-signal"
              aria-hidden="true"
            />
          </div>

          {index <
            heroStats.length - 1 && (
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
    <div
      className="guardian-card"
      data-reveal
    >
      <div
        className="card-corner corner-one"
        aria-hidden="true"
      />

      <div
        className="card-corner corner-two"
        aria-hidden="true"
      />

      <div className="card-top">
        <div>
          <span className="card-kicker">
            001 PRODUCT / 01
          </span>

          <h2>GUARDIAN</h2>
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
        <div className="scanner-coordinate coordinate-x" />
        <div className="scanner-coordinate coordinate-y" />

        <div className="scanner-ring ring-one" />
        <div className="scanner-ring ring-two" />
        <div className="scanner-ring ring-three" />

        <div className="scanner-orbit">
          <span />
        </div>

        <div className="scanner-core">
          <div className="shield">
            001
          </div>
        </div>

        <div className="scanner-line" />
      </div>

      <div className="security-state">
        {guardianStates.map(
          (state, index) => (
            <div
              className="state-row"
              key={state.label}
            >
              <span>
                {state.label}
              </span>

              <div className="state-status">
                <i
                  style={{
                    animationDelay:
                      `${index * 0.25}s`,
                  }}
                />

                <strong>
                  {state.value}
                </strong>
              </div>
            </div>
          ),
        )}
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

      <div
        className="hero-radar"
        aria-hidden="true"
      />

      <div
        className="hero-particles"
        aria-hidden="true"
      >
        {particles.map(
          (
            [
              left,
              top,
              size,
              delay,
            ],
            index,
          ) => (
            <span
              key={index}
              className="hero-particle"
              style={{
                "--particle-left": left,
                "--particle-top": top,
                "--particle-size": size,
                "--particle-delay": delay,
              }}
            />
          ),
        )}
      </div>

      <div className="hero-content">
        <div className="status-pill hero-enter hero-enter-one">
          <span className="status-dot" />

          001 SECURITY NETWORK ONLINE

          <span className="status-wave">
            ///
          </span>
        </div>

        <p className="eyebrow hero-enter hero-enter-two">
          001 SECURITY LABS PRESENTS
        </p>

        <h1 className="hero-enter hero-enter-three">
          SECURITY BUILT

          <span>
            FOR WHAT HAPPENS NEXT.
          </span>
        </h1>

        <p className="hero-description hero-enter hero-enter-four">
          Advanced Discord security
          engineered for live detection,
          forensic evidence, incident
          intelligence, threat correlation
          and structural recovery.
        </p>

        <div className="hero-actions hero-enter hero-enter-five">
          <a
            className="primary-button"
            href="#guardian"
          >
            <span className="button-label">
              View 001 Guardian
            </span>

            <span
              className="button-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          <a
            className="secondary-button"
            href={GUARDIAN_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Add Guardian
          </a>
        </div>

        <HeroStats />
      </div>

      <GuardianStatusCard />

      <div
        className="scroll-indicator"
        aria-hidden="true"
      >
        <span>
          SCROLL TO ANALYZE
        </span>

        <i />
      </div>
    </section>
  )
}

function TelemetryStrip() {
  const content = [
    ...telemetryItems,
    ...telemetryItems,
  ]

  return (
    <div
      className="telemetry-strip"
      aria-hidden="true"
    >
      <div className="telemetry-track">
        {content.map(
          (item, index) => (
            <span key={`${item}-${index}`}>
              <i />
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  )
}

function Products() {
  return (
    <section
      className="products"
      id="products"
    >
      <div
        className="section-heading"
        data-reveal
      >
        <p>
          001 / PRODUCTS
        </p>

        <h2>
          Built for serious
          <span>
            {" "}
            communities.
          </span>
        </h2>

        <span>
          Security infrastructure for
          Discord communities where
          permissions, evidence, uptime and
          recovery actually matter.
        </span>
      </div>

      <a
        href="#guardian"
        className="product-card"
        aria-label="View 001 Guardian"
        data-reveal
      >
        <div className="product-scan" />

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
            Guardian combines continuous
            monitoring, actor attribution,
            forensic Black Box snapshots,
            structured incidents, Threat Core
            correlation and supported recovery
            workflows inside one security
            platform.
          </p>

          <div className="feature-tags">
            {guardianFeatures.map(
              (feature, index) => (
                <span
                  key={feature}
                  style={{
                    "--feature-delay":
                      `${index * 80}ms`,
                  }}
                >
                  {feature}
                </span>
              ),
            )}
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

function FinalInstall() {
  return (
    <section
      className="final-install"
      data-reveal
    >
      <div
        className="final-install-grid"
        aria-hidden="true"
      />

      <div
        className="final-orbit final-orbit-one"
        aria-hidden="true"
      />

      <div
        className="final-orbit final-orbit-two"
        aria-hidden="true"
      />

      <div className="final-install-copy">
        <div className="final-status">
          <span />

          GUARDIAN DEPLOYMENT READY
        </div>

        <p className="eyebrow">
          001 GUARDIAN / V1.0.0
        </p>

        <h2>
          Ready to protect
          <span>
            {" "}
            your server?
          </span>
        </h2>

        <p>
          Deploy 001 Guardian and activate
          live protection, forensic evidence,
          incident intelligence, threat
          correlation and recovery.
        </p>

        <div className="final-install-meta">
          <span>
            ZERO SETUP
          </span>

          <span>
            AUTO PROVISION
          </span>

          <span>
            LIVE MONITORING
          </span>
        </div>
      </div>

      <div className="final-install-action">
        <div
          className="final-guardian-mark"
          aria-hidden="true"
        >
          <span>
            001
          </span>
        </div>

        <a
          href={GUARDIAN_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="final-install-button"
          aria-label="Add 001 Guardian to your Discord server"
        >
          <span>
            ADD 001 GUARDIAN
          </span>

          <strong>
            TO YOUR SERVER
          </strong>

          <i aria-hidden="true">
            →
          </i>
        </a>

        <small>
          OFFICIAL DISCORD INSTALL
        </small>
      </div>
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
          Advanced Discord Security &
          Recovery Systems
        </span>
      </div>

      <div className="footer-center">
        <span className="footer-pulse" />

        SECURITY NETWORK ONLINE
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
  useMotionSystem()

  return (
    <main className="site">
      <MotionBackground />

      <Header />

      <Hero />

      <TelemetryStrip />

      <Products />

      <GuardianShowcase />

      <SupportFaq />

      <FinalInstall />

      <Footer />
    </main>
  )
}

export default App