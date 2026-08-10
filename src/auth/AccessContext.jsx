import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

const AccessContext = createContext(null)

const ACCESS_KEY = "hamood_labs_access_mode"
const RETURN_KEY = "hamood_labs_return_to"

function readStoredAccessMode() {
  try {
    return window.localStorage.getItem(ACCESS_KEY)
  } catch {
    return null
  }
}

function writeStoredAccessMode(value) {
  try {
    if (value) window.localStorage.setItem(ACCESS_KEY, value)
    else window.localStorage.removeItem(ACCESS_KEY)
  } catch {
    // Storage can be unavailable in privacy modes. The current page still works.
  }
}

function authQueryState() {
  try {
    const url = new URL(window.location.href)
    return {
      success: url.searchParams.get("auth") === "success",
      error: url.searchParams.get("auth_error"),
    }
  } catch {
    return { success: false, error: null }
  }
}

function cleanAuthQuery() {
  try {
    const url = new URL(window.location.href)
    url.searchParams.delete("auth")
    url.searchParams.delete("auth_error")
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`)
  } catch {
    // Non-critical cleanup only.
  }
}

export function AccessProvider({ children }) {
  const initialAuthQuery = useRef(authQueryState())
  const [accessMode, setAccessMode] = useState(() => readStoredAccessMode())
  const [session, setSession] = useState({ status: "checking", user: null })
  const [accessGateOpen, setAccessGateOpen] = useState(
    () => initialAuthQuery.current.success || Boolean(initialAuthQuery.current.error) || !readStoredAccessMode(),
  )
  const [installLockOpen, setInstallLockOpen] = useState(false)
  const [oauthPhase, setOauthPhase] = useState(initialAuthQuery.current.success ? "verifying" : "idle")
  const [authError, setAuthError] = useState(initialAuthQuery.current.error)

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
        headers: { Accept: "application/json" },
      })

      const contentType = response.headers.get("content-type") || ""
      if (!response.ok || !contentType.includes("application/json")) {
        throw new Error("Authentication API unavailable")
      }

      const payload = await response.json()

      if (payload?.authenticated && payload?.user) {
        setSession({ status: "authenticated", user: payload.user })
        setAccessMode("discord")
        writeStoredAccessMode("discord")
        return payload.user
      }

      setSession({ status: "guest", user: null })
      return null
    } catch {
      setSession({ status: "guest", user: null })
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let verifiedTimer = null

    async function bootSession() {
      const user = await refreshSession()
      if (cancelled) return

      if (user) {
        if (initialAuthQuery.current.success) {
          setAccessGateOpen(true)
          setOauthPhase("verified")
          setAuthError(null)
          verifiedTimer = window.setTimeout(() => {
            setAccessGateOpen(false)
            setOauthPhase("idle")
            cleanAuthQuery()
          }, 1650)
        } else {
          setAccessGateOpen(false)
          setOauthPhase("idle")
        }
        return
      }

      if (initialAuthQuery.current.success) {
        setAuthError("session")
        setOauthPhase("idle")
        setAccessGateOpen(true)
      } else if (initialAuthQuery.current.error) {
        setOauthPhase("idle")
        setAccessGateOpen(true)
      } else if (!readStoredAccessMode()) {
        setAccessGateOpen(true)
      }
    }

    bootSession()

    return () => {
      cancelled = true
      if (verifiedTimer) window.clearTimeout(verifiedTimer)
    }
  }, [refreshSession])

  useEffect(() => {
    const handleInstallAttempt = (event) => {
      const anchor = event.target?.closest?.("a[href]")
      if (!anchor) return

      const href = anchor.getAttribute("href") || ""

      // Internal install routes are protected by the Worker itself.
      // Let the request reach /api/install/:slug so a guest can login and
      // continue straight into Discord installation after OAuth.
      if (href.startsWith("/api/install/")) return

      const isDiscordInstall =
        anchor.hasAttribute("data-discord-install") ||
        href.startsWith("https://discord.com/oauth2/authorize") ||
        href.startsWith("https://discord.com/api/oauth2/authorize")

      if (!isDiscordInstall || session.user) return

      event.preventDefault()
      event.stopPropagation()
      setInstallLockOpen(true)
    }

    document.addEventListener("click", handleInstallAttempt, true)
    return () => document.removeEventListener("click", handleInstallAttempt, true)
  }, [session.user])

  const continueAsGuest = () => {
    setAccessMode("guest")
    writeStoredAccessMode("guest")
    setAuthError(null)
    setOauthPhase("idle")
    setAccessGateOpen(false)
    cleanAuthQuery()
  }

  const loginWithDiscord = (returnTo = window.location.href) => {
    if (oauthPhase === "connecting") return

    setAuthError(null)
    setOauthPhase("connecting")

    try {
      window.sessionStorage.setItem(RETURN_KEY, returnTo)
    } catch {
      // Non-critical.
    }

    const target = `/api/auth/discord?return=${encodeURIComponent(returnTo)}`
    window.setTimeout(() => window.location.assign(target), 320)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      })
    } catch {
      // The local session state still gets reset below.
    }

    setSession({ status: "guest", user: null })
    setAccessMode(null)
    writeStoredAccessMode(null)
    setOauthPhase("idle")
    setAuthError(null)
    setInstallLockOpen(false)
    setAccessGateOpen(true)
    cleanAuthQuery()
  }

  const reopenAccessGate = () => {
    setAuthError(null)
    setOauthPhase("idle")
    setAccessGateOpen(true)
  }

  const closeAccessGate = () => {
    if (session.user) {
      setAccessGateOpen(false)
      setOauthPhase("idle")
      setAuthError(null)
      cleanAuthQuery()
      return
    }
    continueAsGuest()
  }

  const closeInstallLock = () => setInstallLockOpen(false)

  const value = useMemo(
    () => ({
      accessMode,
      session,
      accessGateOpen,
      installLockOpen,
      oauthPhase,
      authError,
      continueAsGuest,
      loginWithDiscord,
      logout,
      refreshSession,
      reopenAccessGate,
      closeAccessGate,
      closeInstallLock,
    }),
    [
      accessMode,
      session,
      accessGateOpen,
      installLockOpen,
      oauthPhase,
      authError,
      refreshSession,
    ],
  )

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}

export function useAccess() {
  const context = useContext(AccessContext)
  if (!context) throw new Error("useAccess must be used inside AccessProvider")
  return context
}
