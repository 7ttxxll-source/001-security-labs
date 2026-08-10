import { useEffect, useState } from "react"

const accentMap = {
  blue: { blue: "#2c95ff", bright: "#64b9ff", cyan: "#6ed8ff" },
  cyan: { blue: "#00b8d9", bright: "#5ee9ff", cyan: "#8af2ff" },
  green: { blue: "#26c281", bright: "#63ffae", cyan: "#9affcb" },
  purple: { blue: "#8a6cff", bright: "#b39bff", cyan: "#c8baff" },
}

export function usePlatformContent() {
  const [content, setContent] = useState({ home: null, pages: {}, announcements: [], appearance: null, seo: null })

  useEffect(() => {
    let cancelled = false
    fetch("/api/platform/content", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("CONTENT_UNAVAILABLE")))
      .then((data) => { if (!cancelled) setContent({ home: data.home || null, pages: data.pages || {}, announcements: data.announcements || [], appearance: data.appearance || null, seo: data.seo || null }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const appearance = content.appearance || {}
    const palette = accentMap[appearance.accent] || accentMap.blue
    document.documentElement.style.setProperty("--blue", palette.blue)
    document.documentElement.style.setProperty("--blue-bright", palette.bright)
    document.documentElement.style.setProperty("--cyan", palette.cyan)
    document.documentElement.dataset.platformDensity = appearance.compact ? "compact" : "normal"
  }, [content.appearance])

  useEffect(() => {
    if (!content.seo) return
    if (content.seo.title && (window.location.pathname === "/" || window.location.pathname === "/index.html")) document.title = content.seo.title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    if (content.seo.description) meta.content = content.seo.description
  }, [content.seo])

  return content
}
