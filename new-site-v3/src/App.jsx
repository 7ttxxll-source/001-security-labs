import { useEffect } from "react"

import "./components/GuardianShowcase.css"
import "./components/GuardianExperience.css"
import "./components/SupportFaq.css"
import "./App.css"

import { SiteFooter, SiteHeader } from "./components/PlatformShell"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import GuardianPage from "./pages/GuardianPage"
import GuardianDocsPage from "./pages/GuardianDocsPage"
import GuardianFaqPage from "./pages/GuardianFaqPage"
import SuggestionsPage from "./pages/SuggestionsPage"
import { BRAND, ROUTES } from "./siteConfig"

const pageTitles = {
  [ROUTES.home]: `${BRAND.site} — Discord Bots & Security Systems`,
  [ROUTES.products]: `Products — ${BRAND.site}`,
  [ROUTES.guardian]: `001 Guardian — ${BRAND.site}`,
  [ROUTES.guardianDocs]: `001 Guardian Documentation — ${BRAND.site}`,
  [ROUTES.guardianFaq]: `001 Guardian FAQ — ${BRAND.site}`,
  [ROUTES.suggestions]: `Suggestions — ${BRAND.site}`,
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/index.html") return ROUTES.home
  let path = pathname.replace(/index\.html$/i, "")
  if (!path.endsWith("/")) path += "/"
  return path
}

function resolvePage(pathname) {
  const path = normalizePath(pathname)

  if (path === ROUTES.products) return <ProductsPage />
  if (path === ROUTES.guardian) return <GuardianPage />
  if (path === ROUTES.guardianDocs) return <GuardianDocsPage />
  if (path === ROUTES.guardianFaq) return <GuardianFaqPage />
  if (path === ROUTES.suggestions) return <SuggestionsPage />
  return <HomePage />
}

function useInteractiveSystem() {
  useEffect(() => {
    const currentPath = normalizePath(window.location.pathname)
    document.title = pageTitles[currentPath] ?? pageTitles[ROUTES.home]

    const site = document.querySelector(".site")
    if (!site) return undefined

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches

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
      element.style.setProperty("--reveal-delay", `${(index % 7) * 45}ms`)
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
        { threshold: 0.06, rootMargin: "0px 0px -32px 0px" },
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
          activeTilt.style.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`)
          activeTilt.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`)
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
        activeMagnetic.style.setProperty("--magnetic-x", `${x * 0.05}px`)
        activeMagnetic.style.setProperty("--magnetic-y", `${y * 0.05}px`)
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

    const hash = window.location.hash
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
      })
    }

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

function App() {
  useInteractiveSystem()
  const page = resolvePage(window.location.pathname)

  return (
    <main className="site multi-page-site">
      <MotionBackground />
      <SiteHeader />
      <div className="page-content">{page}</div>
      <SiteFooter />
    </main>
  )
}

export default App
