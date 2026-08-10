import { useEffect } from "react"

import GuardianShowcase from "./components/GuardianShowcase"
import "./components/GuardianShowcase.css"

import SupportFaq from "./components/SupportFaq"
import "./components/SupportFaq.css"

import { platformCategories, productCatalog } from "./data/products"
import "./App.css"

const GUARDIAN_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1535228662641725520"

const BRAND = {
  site: "HAMOOD LABS",
  creator: "HAMOOD — 001",
  rights: "© 2026 HAMOOD LABS — ALL RIGHTS RESERVED",
  subtitle: "DISCORD BOTS • SECURITY SYSTEMS",
}

const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "Bots", href: "#bots" },
  { label: "Security", href: "#guardian" },
  { label: "Upcoming", href: "#upcoming" },
  { label: "Support", href: "#support" },
]

const heroStats = [
  { value: "24/7", label: "LIVE PROTECTION", arabic: "حماية لحظية" },
  { value: "SHA-256", label: "EVIDENCE INTEGRITY", arabic: "سلامة الأدلة" },
  { value: "001", label: "ACTIVE PRODUCT", arabic: "منتج فعّال" },
  { value: "002", label: "COMING NEXT", arabic: "الحصري القادم" },
]

const guardianStates = [
  { label: "PROTECTION ENGINE", value: "ARMED" },
  { label: "THREAT CORRELATION", value: "ARMED" },
  { label: "BLACK BOX", value: "READY" },
  { label: "RECOVERY SYSTEM", value: "READY" },
]

const telemetryItems = [
  "HAMOOD LABS / ONLINE",
  "001 GUARDIAN / ACTIVE",
  "LIVE PROTECTION / ARMED",
  "BLACK BOX / READY",
  "THREAT CORE / ARMED",
  "RECOVERY / READY",
  "002 CLASSIFIED / COMING SOON",
  "EXCLUSIVE SYSTEMS / BUILT BY HAMOOD — 001",
]

const particles = [
  ["7%", "19%", "2px", "0s"],
  ["12%", "68%", "3px", "1.2s"],
  ["19%", "39%", "2px", "2.1s"],
  ["26%", "82%", "2px", "0.8s"],
  ["33%", "13%", "3px", "1.7s"],
  ["41%", "58%", "2px", "3.2s"],
  ["48%", "27%", "2px", "2s"],
  ["56%", "76%", "3px", "0.4s"],
  ["63%", "18%", "2px", "2.7s"],
  ["69%", "53%", "2px", "1.5s"],
  ["74%", "84%", "3px", "2.2s"],
  ["81%", "30%", "2px", "0.9s"],
  ["87%", "66%", "2px", "3.4s"],
  ["92%", "21%", "3px", "1.3s"],
  ["96%", "73%", "2px", "2.8s"],
]

function useInteractiveSystem() {
  useEffect(() => {
    document.title = `${BRAND.site} — Discord Bots & Security Systems`

    const site = document.querySelector(".site")
    if (!site) return undefined

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
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

    const targets = document.querySelectorAll(revealSelectors.join(","))
    targets.forEach((element, index) => {
      element.classList.add("motion-target")
      element.style.setProperty("--reveal-delay", `${(index % 7) * 55}ms`)
      if (reduceMotion) element.classList.add("is-visible")
    })

    let observer
    if (!reduceMotion) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          })
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
      )
      targets.forEach((target) => observer.observe(target))
    }

    let pointerFrame = 0
    let scrollFrame = 0
    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2
    let pointerTarget = null
    let activeTilt = null
    let activeMagnetic = null

    const resetTilt = (element) => {
      if (!element) return
      element.style.setProperty("--tilt-x", "0deg")
      element.style.setProperty("--tilt-y", "0deg")
      element.style.setProperty("--local-x", "50%")
      element.style.setProperty("--local-y", "50%")
    }

    const resetMagnetic = (element) => {
      if (!element) return
      element.style.setProperty("--magnetic-x", "0px")
      element.style.setProperty("--magnetic-y", "0px")
    }

    const renderPointer = () => {
      pointerFrame = 0

      site.style.setProperty("--pointer-x", `${pointerX}px`)
      site.style.setProperty("--pointer-y", `${pointerY}px`)

      const nextTilt = pointerTarget?.closest?.("[data-tilt]") ?? null
      if (nextTilt !== activeTilt) {
        resetTilt(activeTilt)
        activeTilt = nextTilt
      }

      if (activeTilt) {
        const rect = activeTilt.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          const x = Math.min(1, Math.max(0, (pointerX - rect.left) / rect.width))
          const y = Math.min(1, Math.max(0, (pointerY - rect.top) / rect.height))
          activeTilt.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`)
          activeTilt.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`)
          activeTilt.style.setProperty("--local-x", `${x * 100}%`)
          activeTilt.style.setProperty("--local-y", `${y * 100}%`)
        }
      }

      const nextMagnetic = pointerTarget?.closest?.("[data-magnetic]") ?? null
      if (nextMagnetic !== activeMagnetic) {
        resetMagnetic(activeMagnetic)
        activeMagnetic = nextMagnetic
      }

      if (activeMagnetic) {
        const rect = activeMagnetic.getBoundingClientRect()
        const x = pointerX - rect.left - rect.width / 2
        const y = pointerY - rect.top - rect.height / 2
        activeMagnetic.style.setProperty("--magnetic-x", `${x * 0.055}px`)
        activeMagnetic.style.setProperty("--magnetic-y", `${y * 0.055}px`)
      }
    }

    const handlePointerMove = (event) => {
      if (reduceMotion || !finePointer) return
      pointerX = event.clientX
      pointerY = event.clientY
      pointerTarget = event.target
      if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer)
    }

    const handlePointerLeave = () => {
      pointerTarget = null
      resetTilt(activeTilt)
      resetMagnetic(activeMagnetic)
      activeTilt = null
      activeMagnetic = null
    }

    const renderScroll = () => {
      scrollFrame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      site.style.setProperty("--scroll-progress", String(progress))
    }

    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScroll)
    }

    const handleVisibility = () => {
      site.classList.toggle("effects-paused", document.hidden)
    }

    if (finePointer && !reduceMotion) {
      site.addEventListener("pointermove", handlePointerMove, { passive: true })
      site.addEventListener("pointerleave", handlePointerLeave, { passive: true })
    } else {
      site.classList.add("no-pointer-effects")
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("visibilitychange", handleVisibility)
    renderScroll()
    handleVisibility()

    return () => {
      observer?.disconnect()
      if (pointerFrame) cancelAnimationFrame(pointerFrame)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
      site.removeEventListener("pointermove", handlePointerMove)
      site.removeEventListener("pointerleave", handlePointerLeave)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("visibilitychange", handleVisibility)
      resetTilt(activeTilt)
      resetMagnetic(activeMagnetic)
    }
  }, [])
}

function MotionBackground() {
  return (
    <>
      <div className="page-progress" aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
      <div className="global-grid" aria-hidden="true" />
      <div className="global-beam" aria-hidden="true" />
      <div className="global-noise" aria-hidden="true" />
    </>
  )
}

function Header() {
  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label={`${BRAND.site} home`}>
        <div className="brand-mark" data-tilt>
          <span>H</span>
          <i>001</i>
        </div>

        <div className="brand-copy">
          <strong>{BRAND.site}</strong>
          <span>{BRAND.subtitle}</span>
        </div>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="nav-button"
        data-magnetic
        href={GUARDIAN_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        ADD GUARDIAN <span>↗</span>
      </a>
    </header>
  )
}

function CreatorRights() {
  return (
    <aside className="creator-rights-wrap" data-reveal>
      <div className="creator-rights-shadow" aria-hidden="true" />

      <div className="creator-rights-stage" data-tilt>
        <div className="creator-backplate creator-backplate-one" aria-hidden="true" />
        <div className="creator-backplate creator-backplate-two" aria-hidden="true" />

        <div className="creator-rights">
          <div className="creator-shine" aria-hidden="true" />
          <div className="creator-scan" aria-hidden="true" />
          <div className="creator-grid" aria-hidden="true" />
          <div className="creator-rail creator-rail-top" aria-hidden="true" />
          <div className="creator-rail creator-rail-bottom" aria-hidden="true" />

          <div className="creator-emblem" aria-hidden="true">
            <span>H</span>
            <small>001</small>
          </div>

          <div className="creator-copy">
            <div className="creator-kicker">
              <span className="creator-live-dot" />
              VERIFIED CREATOR IDENTITY
            </div>

            <p>BUILT &amp; DEVELOPED BY</p>
            <h2>
              HAMOOD <span>— 001</span>
            </h2>

            <div className="creator-meta">
              <strong>OFFICIAL CREATOR</strong>
              <span>EXCLUSIVE SYSTEM IDENTITY</span>
            </div>

            <p className="creator-arabic" dir="rtl">
              تصميم وتطوير حصري بواسطة حمود — 001 • جميع الحقوق محفوظة
            </p>
          </div>

          <div className="creator-verified-stamp" aria-hidden="true">
            <span>001</span>
            <small>VERIFIED</small>
          </div>

          <div className="creator-copyright">
            © 2026 • HAMOOD LABS • ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </aside>
  )
}

function GuardianStatusCard() {
  return (
    <div className="guardian-card" data-reveal data-tilt>
      <div className="card-corner corner-one" aria-hidden="true" />
      <div className="card-corner corner-two" aria-hidden="true" />
      <div className="card-spotlight" aria-hidden="true" />

      <div className="card-top">
        <div>
          <span className="card-kicker">FEATURED PRODUCT / 001</span>
          <h2>001 GUARDIAN</h2>
        </div>

        <div className="live-badge">
          <span /> ACTIVE
        </div>
      </div>

      <div className="scanner" aria-hidden="true">
        <div className="scanner-coordinate coordinate-x" />
        <div className="scanner-coordinate coordinate-y" />
        <div className="scanner-ring ring-one" />
        <div className="scanner-ring ring-two" />
        <div className="scanner-ring ring-three" />
        <div className="scanner-orbit"><span /></div>
        <div className="scanner-core"><div className="shield">001</div></div>
        <div className="scanner-line" />
      </div>

      <div className="security-state">
        {guardianStates.map((state, index) => (
          <div className="state-row" key={state.label}>
            <span>{state.label}</span>
            <div className="state-status">
              <i style={{ animationDelay: `${index * 0.22}s` }} />
              <strong>{state.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroStats() {
  return (
    <div className="hero-stats" data-reveal>
      {heroStats.map((stat) => (
        <div className="hero-stat" key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
          <small dir="rtl">{stat.arabic}</small>
        </div>
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-radar" aria-hidden="true" />
      <div className="hero-particles" aria-hidden="true">
        {particles.map(([left, top, size, delay], index) => (
          <span
            key={`${left}-${top}-${index}`}
            style={{
              "--particle-left": left,
              "--particle-top": top,
              "--particle-size": size,
              "--particle-delay": delay,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className="status-pill hero-enter hero-enter-one">
          <span className="status-dot" />
          HAMOOD LABS NETWORK ONLINE
          <i>///</i>
        </div>

        <p className="eyebrow hero-enter hero-enter-two">HAMOOD LABS PRESENTS</p>

        <h1 className="hero-enter hero-enter-three">
          POWERING WHAT
          <span>HAPPENS NEXT.</span>
        </h1>

        <div className="hero-arabic hero-enter hero-enter-four" dir="rtl">
          <strong>منصة تجارية للبوتات والأنظمة الذكية.</strong>
          <p>
            نبني بوتات ديسكورد حصرية وأنظمة حماية متقدمة بهوية مستقلة، وكل منتج
            له تجربته وصفحته داخل منصة واحدة قابلة للتوسع.
          </p>
        </div>

        <div className="hero-actions hero-enter hero-enter-five">
          <a className="primary-button" data-magnetic href="#bots">
            EXPLORE BOTS <span>→</span>
          </a>

          <a className="secondary-button" data-magnetic href="#guardian">
            VIEW 001 GUARDIAN <span>↗</span>
          </a>
        </div>

        <div className="hero-tags hero-enter hero-enter-five" dir="rtl">
          <span>بوتات ديسكورد حصرية</span>
          <span>أنظمة حماية متقدمة</span>
          <span>حصري جديد قريبًا</span>
        </div>

        <HeroStats />
      </div>

      <div className="hero-visual">
        <CreatorRights />
        <GuardianStatusCard />
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span><i />
      </div>
    </section>
  )
}

function TelemetryStrip() {
  const items = [...telemetryItems, ...telemetryItems]

  return (
    <div className="telemetry-strip" aria-hidden="true">
      <div className="telemetry-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}><i />{item}</span>
        ))}
      </div>
    </div>
  )
}

function PlatformIntro() {
  return (
    <section className="platform-intro" id="bots">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">HAMOOD LABS / ECOSYSTEM</p>
        <h2>
          One platform.
          <span> Multiple exclusive systems.</span>
        </h2>
        <p className="section-arabic" dir="rtl">
          الموقع مبني كمنصة منتجات من البداية، مو كصفحة لبوت واحد. نقدر نضيف
          أي بوت جديد مستقبلًا داخل نفس الهوية بدون ما نعيد بناء الموقع.
        </p>
      </div>

      <div className="platform-grid">
        {platformCategories.map((category) => (
          <article key={category.code} data-reveal data-tilt>
            <div className="platform-card-glow" aria-hidden="true" />
            <span className="platform-code">{category.code}</span>
            <h3>{category.title}</h3>
            <strong dir="rtl">{category.arabic}</strong>
            <p>{category.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  const isActive = product.status === "ACTIVE"

  return (
    <a
      href={product.href}
      className={`ecosystem-product ${isActive ? "is-active" : "is-coming"}`}
      data-reveal
      data-tilt
    >
      <div className="product-card-light" aria-hidden="true" />
      <div className="product-card-top">
        <span>{product.id}</span>
        <strong className={`product-status status-${product.status.toLowerCase()}`}>
          {product.status.replace("_", " ")}
        </strong>
      </div>

      <div className="product-symbol" aria-hidden="true">
        <span>{isActive ? "001" : product.id}</span>
      </div>

      <div className="product-card-copy">
        <small>{product.category}</small>
        <h3>{product.displayName}</h3>
        <p>{product.shortDescription}</p>
        <p className="product-arabic" dir="rtl">{product.arabicDescription}</p>
      </div>

      <div className="product-card-footer">
        <span dir="rtl">{product.statusLabel}</span>
        <i>{isActive ? "VIEW SYSTEM →" : "STAY TUNED"}</i>
      </div>
    </a>
  )
}

function ProductsEcosystem() {
  return (
    <section className="products-ecosystem" id="upcoming">
      <div className="ecosystem-heading" data-reveal>
        <div>
          <p className="eyebrow">PRODUCT DIRECTORY / LIVE + UPCOMING</p>
          <h2>THE HAMOOD LABS <span>BOT LINEUP.</span></h2>
        </div>

        <div dir="rtl">
          <strong>بوتات حالية وقادمة</strong>
          <p>
            أول منتج هو 001 Guardian، والمنتج الحصري الثاني موجود كإصدار قادم
            لين نكشف اسمه وهويته رسميًا.
          </p>
        </div>
      </div>

      <div className="product-rail">
        {productCatalog.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>

      <div className="future-slot" data-reveal>
        <div>
          <span>+</span>
          <strong>ADD FUTURE PRODUCT</strong>
        </div>
        <p dir="rtl">
          البنية جاهزة لإضافة 004 و005 وما بعدها بدون تغيير أساس الموقع.
        </p>
      </div>
    </section>
  )
}

function CreatorManifesto() {
  return (
    <section className="creator-manifesto" data-reveal>
      <div className="manifesto-grid" aria-hidden="true" />
      <div className="manifesto-orbit orbit-one" aria-hidden="true" />
      <div className="manifesto-orbit orbit-two" aria-hidden="true" />

      <div className="manifesto-mark" data-tilt>
        <span>H</span>
        <small>001</small>
      </div>

      <div className="manifesto-copy">
        <p className="eyebrow">CREATOR SIGNATURE / VERIFIED</p>
        <h2>HAMOOD — 001</h2>
        <strong>BUILT INDEPENDENTLY. DESIGNED TO STAND OUT.</strong>
        <p className="manifesto-arabic" dir="rtl">
          منصة حصرية تجمع أنظمة وبوتات متقدمة بهوية مستقلة، صُممت لتتوسع مع كل إصدار جديد وتقدم تجربة مختلفة بكل تفاصيلها.
        </p>
        <div className="manifesto-arabic-signature" dir="rtl">
          تصميم وتطوير حصري بواسطة HAMOOD — 001
        </div>
      </div>

      <div className="manifesto-rights">
        <span>OFFICIAL CREATOR</span>
        <strong>{BRAND.rights}</strong>
        <small>BUILT &amp; DEVELOPED BY HAMOOD — 001</small>
      </div>
    </section>
  )
}

function FinalInstall() {
  return (
    <section className="final-install" data-reveal>
      <div className="final-grid" aria-hidden="true" />

      <div>
        <p className="eyebrow">001 GUARDIAN / AVAILABLE NOW</p>
        <h2>Deploy the first <span>HAMOOD LABS</span> security system.</h2>
        <p dir="rtl">
          فعّل 001 Guardian الآن، وخلك قريب للإعلان عن البوت الحصري القادم.
        </p>
      </div>

      <a
        className="final-install-button"
        data-magnetic
        href={GUARDIAN_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>ADD 001 GUARDIAN</span>
        <strong>OFFICIAL DISCORD INSTALL</strong>
        <i>↗</i>
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>{BRAND.site}</strong>
        <span>{BRAND.subtitle}</span>
      </div>

      <div className="footer-rights">
        <strong>BUILT &amp; DEVELOPED BY HAMOOD — 001</strong>
        <span>{BRAND.rights}</span>
        <small dir="rtl">جميع الحقوق محفوظة — هوية ومنتجات حصرية</small>
      </div>

      <div className="footer-status">
        <span className="status-dot" />
        PLATFORM ONLINE
      </div>
    </footer>
  )
}

function App() {
  useInteractiveSystem()

  return (
    <main className="site">
      <MotionBackground />
      <Header />
      <Hero />
      <TelemetryStrip />
      <PlatformIntro />
      <ProductsEcosystem />
      <GuardianShowcase />
      <CreatorManifesto />
      <SupportFaq />
      <FinalInstall />
      <Footer />
    </main>
  )
}

export default App
