const DISCORD_API = "https://discord.com/api/v10"
const DISCORD_AUTHORIZE = "https://discord.com/oauth2/authorize"

const OAUTH_STATE_COOKIE = "hl_oauth_state"
const OAUTH_RETURN_COOKIE = "hl_oauth_return"
const SESSION_COOKIE = "hl_session"

const OAUTH_TTL_SECONDS = 10 * 60
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60
const MAX_JSON_BYTES = 64 * 1024

const PUBLIC_PRODUCT_STATUSES = new Set(["PUBLISHED", "COMING_SOON", "MAINTENANCE"])
const PRODUCT_STATUSES = new Set(["DRAFT", "PUBLISHED", "COMING_SOON", "MAINTENANCE", "ARCHIVED"])
const SUGGESTION_STATUSES = new Set(["SUBMITTED", "REVIEWING", "PLANNED", "ACCEPTED", "DECLINED", "RELEASED"])
const INSTALL_MODES = new Set(["DISCORD_DEFAULT", "CUSTOM"])
const CONTENT_STATUSES = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"])
const ANNOUNCEMENT_TONES = new Set(["INFO", "SUCCESS", "WARNING", "CRITICAL"])
const PLATFORM_ROLES = new Set(["USER", "VIEWER", "SUPPORT", "PRODUCT_MANAGER", "CONTENT_MANAGER", "ADMIN", "OWNER"])
const ADMIN_ROLES = new Set(["VIEWER", "SUPPORT", "PRODUCT_MANAGER", "CONTENT_MANAGER", "ADMIN", "OWNER"])

const ROLE_PERMISSIONS = {
  // No admin access at all.
  USER: [],

  // Read-only admin landing view. No module data or mutation access.
  VIEWER: [
    "admin.read",
  ],

  // Support scope is intentionally narrow.
  SUPPORT: [
    "admin.read",
    "suggestions.read",
    "suggestions.write",
  ],

  // Product managers can only manage products and their install configuration.
  PRODUCT_MANAGER: [
    "admin.read",
    "products.read",
    "products.write",
  ],

  // Content managers manage public content only; no appearance, maintenance,
  // permissions, users, audit, versions or OWNER-sensitive controls.
  CONTENT_MANAGER: [
    "admin.read",
    "products.read",
    "pages.read",
    "pages.write",
    "docs.read",
    "docs.write",
    "faq.read",
    "faq.write",
    "announcements.read",
    "announcements.write",
    "media.read",
    "media.write",
    "seo.read",
    "seo.write",
  ],

  // ADMIN has broad platform access. Role assignment and OWNER invariants are
  // still guarded by requireOwner() at the API layer.
  ADMIN: ["*"],
  OWNER: ["*"],
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function apiHeaders(extra = {}) {
  return {
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
    ...extra,
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: apiHeaders({
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    }),
  })
}

function parseCookies(request) {
  const header = request.headers.get("Cookie") || ""
  const cookies = {}

  for (const part of header.split(";")) {
    const index = part.indexOf("=")
    if (index < 0) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (!key) continue
    cookies[key] = value
  }

  return cookies
}

function cookie(name, value, request, options = {}) {
  const secure = new URL(request.url).protocol === "https:"
  const parts = [`${name}=${value}`, `Path=${options.path || "/"}`, "SameSite=Lax"]

  if (options.httpOnly !== false) parts.push("HttpOnly")
  if (secure) parts.push("Secure")
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`)

  return parts.join("; ")
}

function clearCookie(name, request, path = "/") {
  return cookie(name, "", request, { path, maxAge: 0 })
}

function bytesToBase64Url(bytes) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = normalized.length % 4 ? "=".repeat(4 - (normalized.length % 4)) : ""
  const binary = atob(normalized + padding)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function encodeText(value) {
  return bytesToBase64Url(textEncoder.encode(value))
}

function decodeText(value) {
  return textDecoder.decode(base64UrlToBytes(value))
}

function randomToken(bytes = 32) {
  const value = new Uint8Array(bytes)
  crypto.getRandomValues(value)
  return bytesToBase64Url(value)
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

async function sign(value, secret) {
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), textEncoder.encode(value))
  return bytesToBase64Url(new Uint8Array(signature))
}

async function createSessionToken(user, env) {
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured")

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    v: 1,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    user: {
      id: user.id,
      username: user.username,
      global_name: user.global_name || null,
      avatar: user.avatar || null,
      avatar_url: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : null,
      role: env.DISCORD_OWNER_ID && user.id === env.DISCORD_OWNER_ID ? "OWNER" : "USER",
    },
  }

  const encoded = encodeText(JSON.stringify(payload))
  const signature = await sign(encoded, env.SESSION_SECRET)
  return `${encoded}.${signature}`
}

async function readSessionToken(token, env) {
  if (!token || !env.SESSION_SECRET) return null
  const [encoded, signature] = token.split(".")
  if (!encoded || !signature) return null

  try {
    const verified = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(env.SESSION_SECRET),
      base64UrlToBytes(signature),
      textEncoder.encode(encoded),
    )

    if (!verified) return null

    const payload = JSON.parse(decodeText(encoded))
    const now = Math.floor(Date.now() / 1000)
    if (!payload?.user?.id || !payload.exp || payload.exp <= now) return null
    return payload
  } catch {
    return null
  }
}

function safeReturnPath(rawValue, origin) {
  if (!rawValue) return "/"

  try {
    const target = new URL(rawValue, origin)
    if (target.origin !== origin) return "/"
    return `${target.pathname}${target.search}${target.hash}` || "/"
  } catch {
    return "/"
  }
}

function encodeReturnPath(path) {
  return encodeText(path)
}

function decodeReturnPath(value) {
  if (!value) return "/"
  try {
    return decodeText(value)
  } catch {
    return "/"
  }
}

function callbackUrl(request) {
  const url = new URL(request.url)
  return `${url.origin}/api/auth/discord/callback`
}

function authRedirect(origin, returnPath, params = {}) {
  const target = new URL(safeReturnPath(returnPath, origin), origin)
  for (const [key, value] of Object.entries(params)) {
    if (value != null) target.searchParams.set(key, value)
  }
  return target.toString()
}

function redirect(location, headers = {}) {
  return new Response(null, {
    status: 302,
    headers: apiHeaders({ Location: location, ...headers }),
  })
}

function assertAuthConfig(env) {
  if (!env.DISCORD_CLIENT_ID) throw new Error("DISCORD_CLIENT_ID is not configured")
  if (!env.DISCORD_CLIENT_SECRET) throw new Error("DISCORD_CLIENT_SECRET is not configured")
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured")
}

function hasDatabase(env) {
  return Boolean(env.DB && typeof env.DB.prepare === "function")
}

function requireDatabase(env) {
  if (!hasDatabase(env)) {
    const error = new Error("DATABASE_NOT_CONFIGURED")
    error.status = 503
    throw error
  }
  return env.DB
}

function normalizeText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max)
}

function normalizeNullableText(value, max = 5000) {
  const text = normalizeText(value, max)
  return text || null
}

function normalizeBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true"
}

function normalizeSlug(value) {
  return normalizeText(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function safeJsonParse(value, fallback) {
  if (value == null || value === "") return fallback
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function jsonArray(value, maxItems = 30, maxLength = 500) {
  const array = Array.isArray(value) ? value : safeJsonParse(value, [])
  if (!Array.isArray(array)) return []
  return array
    .slice(0, maxItems)
    .map((item) => normalizeText(item, maxLength))
    .filter(Boolean)
}

function permissionNotes(value) {
  const array = Array.isArray(value) ? value : safeJsonParse(value, [])
  if (!Array.isArray(array)) return []
  return array
    .slice(0, 30)
    .map((item) => ({
      name: normalizeText(item?.name, 100),
      why: normalizeText(item?.why, 600),
    }))
    .filter((item) => item.name || item.why)
}

function rowToProduct(row) {
  if (!row) return null
  const rawStatus = row.status || "DRAFT"
  const uiStatus = rawStatus === "PUBLISHED" ? "ACTIVE" : rawStatus
  const canInstall = Boolean(row.install_enabled && row.application_id && rawStatus === "PUBLISHED")

  return {
    id: row.code,
    databaseId: row.id,
    code: row.code,
    slug: row.slug,
    name: row.name,
    displayName: row.display_name,
    category: row.category,
    productType: row.product_type,
    version: row.version,
    status: uiStatus,
    databaseStatus: rawStatus,
    statusLabel:
      rawStatus === "PUBLISHED" ? "متاح الآن" :
      rawStatus === "COMING_SOON" ? "قريبًا" :
      rawStatus === "MAINTENANCE" ? "تحت الصيانة" :
      rawStatus === "DRAFT" ? "مسودة" : "مؤرشف",
    availabilityLabel:
      rawStatus === "PUBLISHED" ? (canInstall ? "READY TO INSTALL" : "AVAILABLE") :
      rawStatus === "COMING_SOON" ? "IN DEVELOPMENT" :
      rawStatus === "MAINTENANCE" ? "MAINTENANCE" : rawStatus,
    documentation: row.docs_url ? "LIVE" : "PLANNED",
    shortDescription: row.short_description,
    arabicDescription: row.arabic_description,
    href: row.slug === "guardian" ? "/products/guardian/" : `/products/${row.slug}/`,
    guideHref: row.docs_url || null,
    faqHref: row.faq_url || null,
    featured: Boolean(row.featured),
    applicationId: row.application_id || null,
    installEnabled: Boolean(row.install_enabled),
    installAvailable: canInstall,
    installRequiresLogin: Boolean(row.install_requires_login),
    installMode: row.install_mode || "DISCORD_DEFAULT",
    installScopes: safeJsonParse(row.install_scopes_json, []),
    installPermissions: row.install_permissions || "",
    installHref: canInstall ? `/api/install/${encodeURIComponent(row.slug)}` : null,
    requirements: safeJsonParse(row.requirements_json, []),
    permissionNotes: safeJsonParse(row.permission_notes_json, []),
    sortOrder: Number(row.sort_order || 100),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  }
}

async function parseJsonBody(request) {
  const length = Number(request.headers.get("Content-Length") || 0)
  if (length > MAX_JSON_BYTES) {
    const error = new Error("PAYLOAD_TOO_LARGE")
    error.status = 413
    throw error
  }

  const type = request.headers.get("Content-Type") || ""
  if (!type.toLowerCase().includes("application/json")) {
    const error = new Error("JSON_REQUIRED")
    error.status = 415
    throw error
  }

  try {
    return await request.json()
  } catch {
    const error = new Error("INVALID_JSON")
    error.status = 400
    throw error
  }
}

function assertSameOrigin(request) {
  const origin = request.headers.get("Origin")
  if (!origin) return
  if (origin !== new URL(request.url).origin) {
    const error = new Error("CROSS_ORIGIN_WRITE_BLOCKED")
    error.status = 403
    throw error
  }
}

async function startDiscordAuth(request, env) {
  assertAuthConfig(env)

  const url = new URL(request.url)
  const state = randomToken(32)
  const returnPath = safeReturnPath(url.searchParams.get("return"), url.origin)
  const redirectUri = callbackUrl(request)

  const authorize = new URL(DISCORD_AUTHORIZE)
  authorize.searchParams.set("client_id", env.DISCORD_CLIENT_ID)
  authorize.searchParams.set("response_type", "code")
  authorize.searchParams.set("redirect_uri", redirectUri)
  authorize.searchParams.set("scope", "identify")
  authorize.searchParams.set("state", state)

  const headers = new Headers(apiHeaders({ Location: authorize.toString() }))
  headers.append("Set-Cookie", cookie(OAUTH_STATE_COOKIE, state, request, { maxAge: OAUTH_TTL_SECONDS }))
  headers.append("Set-Cookie", cookie(OAUTH_RETURN_COOKIE, encodeReturnPath(returnPath), request, { maxAge: OAUTH_TTL_SECONDS }))

  return new Response(null, { status: 302, headers })
}

async function exchangeDiscordCode(code, request, env) {
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: callbackUrl(request),
  })

  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error("Discord token exchange failed", response.status, detail.slice(0, 300))
    throw new Error("Discord token exchange failed")
  }

  return response.json()
}

async function fetchDiscordUser(accessToken) {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error("Discord user fetch failed", response.status, detail.slice(0, 300))
    throw new Error("Discord user fetch failed")
  }

  return response.json()
}

async function upsertPlatformUser(user, env) {
  if (!hasDatabase(env)) return
  const role = env.DISCORD_OWNER_ID && user.id === env.DISCORD_OWNER_ID ? "OWNER" : "USER"
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : null

  try {
    await env.DB.prepare(`
      INSERT INTO users (discord_id, username, global_name, avatar_url, platform_role)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(discord_id) DO UPDATE SET
        username = excluded.username,
        global_name = excluded.global_name,
        avatar_url = excluded.avatar_url,
        platform_role = CASE
          WHEN excluded.platform_role = 'OWNER' THEN 'OWNER'
          ELSE users.platform_role
        END,
        last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
    `).bind(user.id, user.username, user.global_name || null, avatarUrl, role).run()
  } catch (error) {
    console.warn("Platform user sync skipped", error?.message || error)
  }
}

async function finishDiscordAuth(request, env) {
  assertAuthConfig(env)

  const url = new URL(request.url)
  const cookies = parseCookies(request)
  const returnPath = safeReturnPath(decodeReturnPath(cookies[OAUTH_RETURN_COOKIE]), url.origin)

  const oauthError = url.searchParams.get("error")
  if (oauthError) {
    const headers = new Headers(apiHeaders({
      Location: authRedirect(url.origin, returnPath, { auth_error: "cancelled" }),
    }))
    headers.append("Set-Cookie", clearCookie(OAUTH_STATE_COOKIE, request))
    headers.append("Set-Cookie", clearCookie(OAUTH_RETURN_COOKIE, request))
    return new Response(null, { status: 302, headers })
  }

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const expectedState = cookies[OAUTH_STATE_COOKIE]

  if (!code || !state || !expectedState || state !== expectedState) {
    const headers = new Headers(apiHeaders({
      Location: authRedirect(url.origin, returnPath, { auth_error: "state" }),
    }))
    headers.append("Set-Cookie", clearCookie(OAUTH_STATE_COOKIE, request))
    headers.append("Set-Cookie", clearCookie(OAUTH_RETURN_COOKIE, request))
    return new Response(null, { status: 302, headers })
  }

  try {
    const token = await exchangeDiscordCode(code, request, env)
    const discordUser = await fetchDiscordUser(token.access_token)
    await upsertPlatformUser(discordUser, env)
    const sessionToken = await createSessionToken(discordUser, env)

    const headers = new Headers(apiHeaders({
      Location: authRedirect(url.origin, returnPath, { auth: "success" }),
    }))
    headers.append("Set-Cookie", clearCookie(OAUTH_STATE_COOKIE, request))
    headers.append("Set-Cookie", clearCookie(OAUTH_RETURN_COOKIE, request))
    headers.append("Set-Cookie", cookie(SESSION_COOKIE, sessionToken, request, { maxAge: SESSION_TTL_SECONDS }))

    return new Response(null, { status: 302, headers })
  } catch (error) {
    console.error("OAuth callback error", error)
    const headers = new Headers(apiHeaders({
      Location: authRedirect(url.origin, returnPath, { auth_error: "exchange" }),
    }))
    headers.append("Set-Cookie", clearCookie(OAUTH_STATE_COOKIE, request))
    headers.append("Set-Cookie", clearCookie(OAUTH_RETURN_COOKIE, request))
    return new Response(null, { status: 302, headers })
  }
}

async function resolvePlatformRole(user, env) {
  if (!user?.id) return "USER"
  if (env.DISCORD_OWNER_ID && user.id === env.DISCORD_OWNER_ID) return "OWNER"
  if (!hasDatabase(env)) return "USER"

  try {
    const row = await env.DB.prepare("SELECT platform_role FROM users WHERE discord_id = ? LIMIT 1").bind(user.id).first()
    const role = normalizeText(row?.platform_role, 40).toUpperCase()
    return PLATFORM_ROLES.has(role) ? role : "USER"
  } catch {
    return "USER"
  }
}

async function readRequestSession(request, env) {
  const cookies = parseCookies(request)
  const session = await readSessionToken(cookies[SESSION_COOKIE], env)
  if (!session) return null
  const role = await resolvePlatformRole(session.user, env)
  return { ...session, user: { ...session.user, role } }
}

function isOwnerSession(session, env) {
  return Boolean(
    session?.user?.id &&
    env.DISCORD_OWNER_ID &&
    session.user.id === env.DISCORD_OWNER_ID
  )
}

function hasPermission(role, permission) {
  const normalizedRole = PLATFORM_ROLES.has(role) ? role : "USER"
  const permissions = ROLE_PERMISSIONS[normalizedRole] || []
  return permissions.includes("*") || permissions.includes(permission)
}

async function requireAdmin(request, env, permission = "admin.read") {
  const session = await readRequestSession(request, env)
  if (!session) {
    const error = new Error("AUTH_REQUIRED")
    error.status = 401
    throw error
  }
  if (!ADMIN_ROLES.has(session.user.role)) {
    const error = new Error("ADMIN_REQUIRED")
    error.status = 403
    throw error
  }
  if (permission && !hasPermission(session.user.role, permission)) {
    const error = new Error("PERMISSION_DENIED")
    error.status = 403
    throw error
  }
  return session
}

async function requireOwner(request, env) {
  const session = await readRequestSession(request, env)
  if (!session) {
    const error = new Error("AUTH_REQUIRED")
    error.status = 401
    throw error
  }
  if (!isOwnerSession(session, env)) {
    const error = new Error("OWNER_REQUIRED")
    error.status = 403
    throw error
  }
  return session
}


function permissionForAdminApi(path, method) {
  const write = method !== "GET"

  if (path === "/api/admin/me" || path === "/api/admin/stats") return { permission: "admin.read" }
  if (/^\/api\/admin\/products(?:\/\d+)?$/.test(path)) return { permission: write ? "products.write" : "products.read" }
  if (/^\/api\/admin\/suggestions(?:\/\d+)?$/.test(path)) return { permission: write ? "suggestions.write" : "suggestions.read" }
  if (path === "/api/admin/users") return { permission: "users.read" }
  if (path === "/api/admin/audit") return { permission: "audit.read" }
  if (/^\/api\/admin\/pages(?:\/\d+)?$/.test(path)) return { permission: write ? "pages.write" : "pages.read" }
  if (/^\/api\/admin\/docs(?:\/\d+)?$/.test(path)) return { permission: write ? "docs.write" : "docs.read" }
  if (/^\/api\/admin\/faq(?:\/\d+)?$/.test(path)) return { permission: write ? "faq.write" : "faq.read" }
  if (/^\/api\/admin\/announcements(?:\/\d+)?$/.test(path)) return { permission: write ? "announcements.write" : "announcements.read" }
  if (/^\/api\/admin\/media(?:\/\d+)?$/.test(path)) return { permission: write ? "media.write" : "media.read" }

  const settingMatch = path.match(/^\/api\/admin\/settings\/(seo|appearance|maintenance)$/)
  if (settingMatch) {
    const key = settingMatch[1]
    return { permission: `${key}.${write ? "write" : "read"}` }
  }

  if (path === "/api/admin/roles") return { ownerOnly: true }
  if (path === "/api/admin/versions") return { ownerOnly: true }
  if (/^\/api\/admin\/versions\/\d+\/rollback$/.test(path)) return { ownerOnly: true }

  return null
}

async function enforceAdminApiPolicy(request, env, path) {
  const policy = permissionForAdminApi(path, request.method)
  if (!policy) return null
  if (policy.ownerOnly) return requireOwner(request, env)
  return requireAdmin(request, env, policy.permission)
}

async function sessionResponse(request, env) {
  const session = await readRequestSession(request, env)
  if (!session) return json({ authenticated: false, user: null })
  return json({ authenticated: true, user: session.user })
}

async function adminMeResponse(request, env) {
  const session = await requireAdmin(request, env)
  await upsertPlatformUser(session.user, env)
  return json({
    authorized: true,
    role: session.user.role,
    permissions: ROLE_PERMISSIONS[session.user.role] || [],
    user: session.user,
    controlCenter: {
      version: "V4.5",
      auth: "ENFORCED",
      database: hasDatabase(env) ? "ONLINE" : "NOT_CONFIGURED",
      productsManager: hasDatabase(env) ? "ONLINE" : "WAITING_FOR_DATABASE",
      contentManager: hasDatabase(env) ? "ONLINE" : "WAITING_FOR_DATABASE",
      suggestions: hasDatabase(env) ? "ONLINE" : "WAITING_FOR_DATABASE",
      audit: hasDatabase(env) ? "ONLINE" : "WAITING_FOR_DATABASE",
    },
  })
}

async function guardAdminPage(request, env) {
  const url = new URL(request.url)
  const session = await readRequestSession(request, env)

  if (!session) {
    const login = new URL("/api/auth/discord", url.origin)
    login.searchParams.set("return", "/admin/")
    return redirect(login.toString())
  }

  if (!ADMIN_ROLES.has(session.user.role)) {
    const denied = new URL("/", url.origin)
    denied.searchParams.set("admin_error", "admin_required")
    return redirect(denied.toString())
  }

  return env.ASSETS.fetch(request)
}

function logoutResponse(request) {
  return json({ ok: true }, 200, { "Set-Cookie": clearCookie(SESSION_COOKIE, request) })
}

async function audit(env, session, action, entityType, entityId, summary, metadata = {}) {
  if (!hasDatabase(env) || !session?.user) return
  try {
    await env.DB.prepare(`
      INSERT INTO audit_logs (actor_id, actor_name, action, entity_type, entity_id, summary, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      session.user.id,
      session.user.global_name || session.user.username || session.user.id,
      action,
      entityType,
      entityId == null ? null : String(entityId),
      summary,
      JSON.stringify(metadata || {}),
    ).run()
  } catch (error) {
    console.warn("Audit log write failed", error?.message || error)
  }
}

function productInput(body, existing = null) {
  const status = normalizeText(body.status ?? existing?.status ?? "DRAFT", 30).toUpperCase()
  const installMode = normalizeText(body.installMode ?? existing?.install_mode ?? "DISCORD_DEFAULT", 30).toUpperCase()
  const slug = normalizeSlug(body.slug ?? existing?.slug ?? body.name ?? existing?.name)
  const code = normalizeText(body.code ?? existing?.code, 12).toUpperCase()
  const productType = normalizeText(body.productType ?? existing?.product_type ?? "discord_bot", 40).toLowerCase()
  const applicationId = normalizeNullableText(body.applicationId ?? existing?.application_id, 40)
  const installEnabled = normalizeBoolean(body.installEnabled ?? existing?.install_enabled)
  const requirements = jsonArray(body.requirements ?? existing?.requirements_json, 30, 500)
  const permissions = permissionNotes(body.permissionNotes ?? existing?.permission_notes_json)
  const scopes = jsonArray(body.installScopes ?? existing?.install_scopes_json ?? ["bot", "applications.commands"], 10, 80)

  if (!PRODUCT_STATUSES.has(status)) throw Object.assign(new Error("INVALID_PRODUCT_STATUS"), { status: 400 })
  if (!INSTALL_MODES.has(installMode)) throw Object.assign(new Error("INVALID_INSTALL_MODE"), { status: 400 })
  if (!slug) throw Object.assign(new Error("SLUG_REQUIRED"), { status: 400 })
  if (!code) throw Object.assign(new Error("PRODUCT_CODE_REQUIRED"), { status: 400 })
  if (!normalizeText(body.displayName ?? existing?.display_name, 100)) throw Object.assign(new Error("DISPLAY_NAME_REQUIRED"), { status: 400 })
  if (installEnabled && productType === "discord_bot" && !applicationId) {
    throw Object.assign(new Error("APPLICATION_ID_REQUIRED_FOR_INSTALL"), { status: 400 })
  }
  if (applicationId && !/^\d{10,30}$/.test(applicationId)) {
    throw Object.assign(new Error("INVALID_APPLICATION_ID"), { status: 400 })
  }

  return {
    code,
    slug,
    name: normalizeText(body.name ?? existing?.name ?? body.displayName ?? existing?.display_name, 100),
    displayName: normalizeText(body.displayName ?? existing?.display_name, 100),
    category: normalizeText(body.category ?? existing?.category ?? "Discord Bot", 100),
    productType,
    version: normalizeText(body.version ?? existing?.version ?? "V1.0.0", 40),
    status,
    shortDescription: normalizeText(body.shortDescription ?? existing?.short_description, 1400),
    arabicDescription: normalizeText(body.arabicDescription ?? existing?.arabic_description, 2400),
    applicationId,
    installEnabled,
    installRequiresLogin: normalizeBoolean(body.installRequiresLogin ?? existing?.install_requires_login ?? true),
    installMode,
    installScopes: scopes.length ? scopes : ["bot", "applications.commands"],
    installPermissions: normalizeText(body.installPermissions ?? existing?.install_permissions, 40),
    requirements,
    permissionNotes: permissions,
    docsUrl: normalizeNullableText(body.docsUrl ?? existing?.docs_url, 400),
    faqUrl: normalizeNullableText(body.faqUrl ?? existing?.faq_url, 400),
    featured: normalizeBoolean(body.featured ?? existing?.featured),
    sortOrder: Math.max(0, Math.min(9999, Number(body.sortOrder ?? existing?.sort_order ?? 100) || 100)),
  }
}

async function listPublicProducts(env) {
  const db = requireDatabase(env)
  const result = await db.prepare(`
    SELECT * FROM products
    WHERE status IN ('PUBLISHED', 'COMING_SOON', 'MAINTENANCE')
    ORDER BY sort_order ASC, id ASC
  `).all()
  return (result.results || []).map(rowToProduct)
}

async function publicProductsResponse(env) {
  return json({ products: await listPublicProducts(env) })
}

async function publicProductResponse(env, slug) {
  const db = requireDatabase(env)
  const row = await db.prepare("SELECT * FROM products WHERE slug = ? LIMIT 1").bind(slug).first()
  if (!row || !PUBLIC_PRODUCT_STATUSES.has(row.status)) return json({ error: "PRODUCT_NOT_FOUND" }, 404)
  return json({ product: rowToProduct(row) })
}

async function adminStatsResponse(request, env) {
  const session = await requireAdmin(request, env, "admin.read")
  const db = requireDatabase(env)
  const stats = {
    products: 0,
    publishedProducts: 0,
    suggestions: 0,
    pendingSuggestions: 0,
    users: 0,
    auditEvents: 0,
  }

  if (hasPermission(session.user.role, "products.read")) {
    const [products, published] = await db.batch([
      db.prepare("SELECT COUNT(*) AS count FROM products WHERE status != 'ARCHIVED'"),
      db.prepare("SELECT COUNT(*) AS count FROM products WHERE status = 'PUBLISHED'"),
    ])
    stats.products = Number(products?.results?.[0]?.count || 0)
    stats.publishedProducts = Number(published?.results?.[0]?.count || 0)
  }

  if (hasPermission(session.user.role, "suggestions.read")) {
    const [suggestions, pending] = await db.batch([
      db.prepare("SELECT COUNT(*) AS count FROM suggestions"),
      db.prepare("SELECT COUNT(*) AS count FROM suggestions WHERE status IN ('SUBMITTED','REVIEWING')"),
    ])
    stats.suggestions = Number(suggestions?.results?.[0]?.count || 0)
    stats.pendingSuggestions = Number(pending?.results?.[0]?.count || 0)
  }

  if (hasPermission(session.user.role, "users.read")) {
    const result = await db.prepare("SELECT COUNT(*) AS count FROM users").first()
    stats.users = Number(result?.count || 0)
  }

  if (hasPermission(session.user.role, "audit.read")) {
    const result = await db.prepare("SELECT COUNT(*) AS count FROM audit_logs").first()
    stats.auditEvents = Number(result?.count || 0)
  }

  return json({ stats })
}

async function adminProductsResponse(request, env) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "products.read" : "products.write")
  const db = requireDatabase(env)

  if (request.method === "GET") {
    const result = await db.prepare("SELECT * FROM products ORDER BY sort_order ASC, id ASC").all()
    return json({ products: (result.results || []).map(rowToProduct) })
  }

  assertSameOrigin(request)
  const body = await parseJsonBody(request)
  const data = productInput(body)
  const now = new Date().toISOString()
  const publishedAt = data.status === "PUBLISHED" ? now : null

  try {
    const result = await db.prepare(`
      INSERT INTO products (
        code, slug, name, display_name, category, product_type, version, status,
        short_description, arabic_description, application_id,
        install_enabled, install_requires_login, install_mode, install_scopes_json,
        install_permissions, requirements_json, permission_notes_json,
        docs_url, faq_url, featured, sort_order,
        created_by, updated_by, published_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.code, data.slug, data.name, data.displayName, data.category, data.productType,
      data.version, data.status, data.shortDescription, data.arabicDescription,
      data.applicationId, data.installEnabled ? 1 : 0, data.installRequiresLogin ? 1 : 0,
      data.installMode, JSON.stringify(data.installScopes), data.installPermissions,
      JSON.stringify(data.requirements), JSON.stringify(data.permissionNotes),
      data.docsUrl, data.faqUrl, data.featured ? 1 : 0, data.sortOrder,
      session.user.id, session.user.id, publishedAt, now,
    ).run()

    const id = result.meta?.last_row_id
    const row = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first()
    await recordVersion(env, session, "product", id, "PRODUCT_CREATED", row)
    await audit(env, session, "PRODUCT_CREATED", "product", id, `تم إنشاء المنتج ${data.displayName}`, { slug: data.slug, status: data.status })
    return json({ ok: true, product: rowToProduct(row) }, 201)
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "PRODUCT_CODE_OR_SLUG_EXISTS" }, 409)
    throw error
  }
}

async function adminProductByIdResponse(request, env, id) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "products.read" : "products.write")
  const db = requireDatabase(env)
  const existing = await db.prepare("SELECT * FROM products WHERE id = ? LIMIT 1").bind(id).first()
  if (!existing) return json({ error: "PRODUCT_NOT_FOUND" }, 404)

  if (request.method === "GET") return json({ product: rowToProduct(existing) })

  assertSameOrigin(request)

  if (request.method === "DELETE") {
    await db.prepare("UPDATE products SET status = 'ARCHIVED', install_enabled = 0, updated_by = ?, updated_at = ? WHERE id = ?")
      .bind(session.user.id, new Date().toISOString(), id).run()
    const archivedRow = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first()
    await recordVersion(env, session, "product", id, "PRODUCT_ARCHIVED", archivedRow)
    await audit(env, session, "PRODUCT_ARCHIVED", "product", id, `تمت أرشفة المنتج ${existing.display_name}`, { slug: existing.slug })
    return json({ ok: true })
  }

  const body = await parseJsonBody(request)
  const data = productInput(body, existing)
  const now = new Date().toISOString()
  const publishedAt = data.status === "PUBLISHED" ? (existing.published_at || now) : existing.published_at

  try {
    await db.prepare(`
      UPDATE products SET
        code = ?, slug = ?, name = ?, display_name = ?, category = ?, product_type = ?,
        version = ?, status = ?, short_description = ?, arabic_description = ?,
        application_id = ?, install_enabled = ?, install_requires_login = ?, install_mode = ?,
        install_scopes_json = ?, install_permissions = ?, requirements_json = ?, permission_notes_json = ?,
        docs_url = ?, faq_url = ?, featured = ?, sort_order = ?, updated_by = ?, updated_at = ?, published_at = ?
      WHERE id = ?
    `).bind(
      data.code, data.slug, data.name, data.displayName, data.category, data.productType,
      data.version, data.status, data.shortDescription, data.arabicDescription,
      data.applicationId, data.installEnabled ? 1 : 0, data.installRequiresLogin ? 1 : 0,
      data.installMode, JSON.stringify(data.installScopes), data.installPermissions,
      JSON.stringify(data.requirements), JSON.stringify(data.permissionNotes),
      data.docsUrl, data.faqUrl, data.featured ? 1 : 0, data.sortOrder,
      session.user.id, now, publishedAt, id,
    ).run()

    const row = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first()
    await recordVersion(env, session, "product", id, "PRODUCT_UPDATED", row)
    await audit(env, session, "PRODUCT_UPDATED", "product", id, `تم تحديث المنتج ${data.displayName}`, {
      slug: data.slug,
      status: data.status,
      installEnabled: data.installEnabled,
    })
    return json({ ok: true, product: rowToProduct(row) })
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "PRODUCT_CODE_OR_SLUG_EXISTS" }, 409)
    throw error
  }
}

async function createSuggestionResponse(request, env) {
  assertSameOrigin(request)
  const session = await readRequestSession(request, env)
  if (!session) return json({ error: "AUTH_REQUIRED" }, 401)
  const db = requireDatabase(env)
  const body = await parseJsonBody(request)

  const category = normalizeText(body.category, 80)
  const title = normalizeText(body.title, 120)
  const details = normalizeText(body.details, 6000)
  const useCase = normalizeText(body.useCase, 3000)

  if (!category || !title || !details) return json({ error: "SUGGESTION_FIELDS_REQUIRED" }, 400)

  const result = await db.prepare(`
    INSERT INTO suggestions (user_id, username, global_name, category, title, details, use_case)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    session.user.id,
    session.user.username,
    session.user.global_name || null,
    category,
    title,
    details,
    useCase,
  ).run()

  const id = Number(result.meta?.last_row_id || 0)
  const date = new Date()
  const ticketCode = `SUG-${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}-${String(id).padStart(4, "0")}`
  await db.prepare("UPDATE suggestions SET ticket_code = ? WHERE id = ?").bind(ticketCode, id).run()

  return json({ ok: true, ticket: { id, code: ticketCode, status: "SUBMITTED" } }, 201)
}

async function mineSuggestionsResponse(request, env) {
  const session = await readRequestSession(request, env)
  if (!session) return json({ authenticated: false, suggestions: [] })
  const db = requireDatabase(env)
  const result = await db.prepare(`
    SELECT id, ticket_code, category, title, status, admin_note, created_at, updated_at
    FROM suggestions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
  `).bind(session.user.id).all()
  return json({ authenticated: true, suggestions: result.results || [] })
}

async function adminSuggestionsResponse(request, env) {
  await requireAdmin(request, env, "suggestions.read")
  const db = requireDatabase(env)
  const url = new URL(request.url)
  const status = normalizeText(url.searchParams.get("status"), 30).toUpperCase()
  const where = status && SUGGESTION_STATUSES.has(status) ? "WHERE status = ?" : ""
  const statement = db.prepare(`SELECT * FROM suggestions ${where} ORDER BY created_at DESC LIMIT 200`)
  const result = where ? await statement.bind(status).all() : await statement.all()
  return json({ suggestions: result.results || [] })
}

async function adminSuggestionByIdResponse(request, env, id) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "suggestions.read" : "suggestions.write")
  const db = requireDatabase(env)
  const existing = await db.prepare("SELECT * FROM suggestions WHERE id = ? LIMIT 1").bind(id).first()
  if (!existing) return json({ error: "SUGGESTION_NOT_FOUND" }, 404)

  if (request.method === "GET") return json({ suggestion: existing })

  assertSameOrigin(request)
  const body = await parseJsonBody(request)
  const status = normalizeText(body.status ?? existing.status, 30).toUpperCase()
  const adminNote = normalizeText(body.adminNote ?? existing.admin_note, 3000)
  if (!SUGGESTION_STATUSES.has(status)) return json({ error: "INVALID_SUGGESTION_STATUS" }, 400)

  await db.prepare("UPDATE suggestions SET status = ?, admin_note = ?, updated_at = ? WHERE id = ?")
    .bind(status, adminNote, new Date().toISOString(), id).run()
  await audit(env, session, "SUGGESTION_UPDATED", "suggestion", id, `تم تحديث الاقتراح ${existing.ticket_code || id}`, { status })
  const row = await db.prepare("SELECT * FROM suggestions WHERE id = ?").bind(id).first()
  return json({ ok: true, suggestion: row })
}

async function adminUsersResponse(request, env) {
  await requireAdmin(request, env, "users.read")
  const db = requireDatabase(env)
  const result = await db.prepare(`
    SELECT discord_id, username, global_name, avatar_url, platform_role, first_seen_at, last_seen_at
    FROM users ORDER BY last_seen_at DESC LIMIT 200
  `).all()
  return json({ users: result.results || [] })
}

async function adminAuditResponse(request, env) {
  await requireAdmin(request, env, "audit.read")
  const db = requireDatabase(env)
  const result = await db.prepare(`
    SELECT id, actor_id, actor_name, action, entity_type, entity_id, summary, metadata_json, created_at
    FROM audit_logs ORDER BY created_at DESC LIMIT 250
  `).all()
  return json({ logs: result.results || [] })
}


async function readPlatformSetting(env, key, fallback = {}) {
  if (!hasDatabase(env)) return fallback
  try {
    const row = await env.DB.prepare("SELECT value_json FROM platform_settings WHERE key = ? LIMIT 1").bind(key).first()
    return safeJsonParse(row?.value_json, fallback)
  } catch {
    return fallback
  }
}

async function writePlatformSetting(env, session, key, value) {
  const now = new Date().toISOString()
  await env.DB.prepare(`
    INSERT INTO platform_settings (key, value_json, updated_by, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at
  `).bind(key, JSON.stringify(value || {}), session.user.id, now).run()
  await recordVersion(env, session, "setting", key, "SETTING_SAVED", { key, value })
  await audit(env, session, "SETTING_UPDATED", "setting", key, `تم تحديث إعدادات ${key}`, {})
}

async function recordVersion(env, session, entityType, entityId, action, snapshot) {
  if (!hasDatabase(env) || !session?.user) return
  try {
    await env.DB.prepare(`
      INSERT INTO content_versions (entity_type, entity_id, action, snapshot_json, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).bind(entityType, String(entityId), action, JSON.stringify(snapshot || {}), session.user.id).run()
  } catch (error) {
    console.warn("Version write failed", error?.message || error)
  }
}

function contentStatus(value, fallback = "DRAFT") {
  const status = normalizeText(value || fallback, 30).toUpperCase()
  return CONTENT_STATUSES.has(status) ? status : fallback
}

async function adminPagesResponse(request, env) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "pages.read" : "pages.write")
  const db = requireDatabase(env)
  if (request.method === "GET") {
    const result = await db.prepare("SELECT * FROM content_pages ORDER BY id ASC").all()
    return json({ pages: result.results || [] })
  }

  assertSameOrigin(request)
  const body = await parseJsonBody(request)
  const pageKey = normalizeSlug(body.pageKey || body.page_key || "")
  if (!pageKey) return json({ error: "PAGE_KEY_REQUIRED" }, 400)
  const now = new Date().toISOString()
  const result = await db.prepare(`
    INSERT INTO content_pages (page_key, title_ar, title_en, eyebrow, headline, accent, body_ar, body_en, status, updated_by, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    pageKey,
    normalizeText(body.titleAr, 300), normalizeText(body.titleEn, 300), normalizeText(body.eyebrow, 200),
    normalizeText(body.headline, 300), normalizeText(body.accent, 300), normalizeText(body.bodyAr, 6000),
    normalizeText(body.bodyEn, 6000), contentStatus(body.status, "DRAFT"), session.user.id, now,
  ).run()
  const id = Number(result.meta?.last_row_id || 0)
  const row = await db.prepare("SELECT * FROM content_pages WHERE id = ?").bind(id).first()
  await recordVersion(env, session, "page", id, "PAGE_CREATED", row)
  await audit(env, session, "PAGE_CREATED", "page", id, `تم إنشاء صفحة ${pageKey}`, {})
  return json({ ok: true, page: row }, 201)
}

async function adminPageByIdResponse(request, env, id) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "pages.read" : "pages.write")
  const db = requireDatabase(env)
  const existing = await db.prepare("SELECT * FROM content_pages WHERE id = ? LIMIT 1").bind(id).first()
  if (!existing) return json({ error: "PAGE_NOT_FOUND" }, 404)
  if (request.method === "GET") return json({ page: existing })
  assertSameOrigin(request)
  const body = await parseJsonBody(request)
  const now = new Date().toISOString()
  await db.prepare(`UPDATE content_pages SET title_ar=?, title_en=?, eyebrow=?, headline=?, accent=?, body_ar=?, body_en=?, status=?, updated_by=?, updated_at=? WHERE id=?`).bind(
    normalizeText(body.titleAr ?? existing.title_ar, 300), normalizeText(body.titleEn ?? existing.title_en, 300),
    normalizeText(body.eyebrow ?? existing.eyebrow, 200), normalizeText(body.headline ?? existing.headline, 300),
    normalizeText(body.accent ?? existing.accent, 300), normalizeText(body.bodyAr ?? existing.body_ar, 6000),
    normalizeText(body.bodyEn ?? existing.body_en, 6000), contentStatus(body.status ?? existing.status, existing.status),
    session.user.id, now, id,
  ).run()
  const row = await db.prepare("SELECT * FROM content_pages WHERE id = ?").bind(id).first()
  await recordVersion(env, session, "page", id, "PAGE_UPDATED", row)
  await audit(env, session, "PAGE_UPDATED", "page", id, `تم تحديث صفحة ${existing.page_key}`, { status: row.status })
  return json({ ok: true, page: row })
}

async function adminDocsResponse(request, env) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "docs.read" : "docs.write")
  const db = requireDatabase(env)
  if (request.method === "GET") {
    const result = await db.prepare(`SELECT d.*, p.display_name AS product_name, p.slug AS product_slug FROM documentation_entries d JOIN products p ON p.id=d.product_id ORDER BY p.sort_order, d.sort_order, d.id`).all()
    return json({ docs: result.results || [] })
  }
  assertSameOrigin(request)
  const body = await parseJsonBody(request)
  const productId = Number(body.productId || 0)
  const slug = normalizeSlug(body.slug || body.titleEn || body.titleAr)
  const titleAr = normalizeText(body.titleAr, 300)
  if (!productId || !slug || !titleAr) return json({ error: "DOC_FIELDS_REQUIRED" }, 400)
  const now = new Date().toISOString()
  const result = await db.prepare(`INSERT INTO documentation_entries (product_id,slug,title_ar,title_en,summary_ar,content_ar,content_en,status,sort_order,created_by,updated_by,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    productId, slug, titleAr, normalizeText(body.titleEn,300), normalizeText(body.summaryAr,1000), normalizeText(body.contentAr,20000), normalizeText(body.contentEn,20000), contentStatus(body.status), Number(body.sortOrder||100), session.user.id, session.user.id, now,
  ).run()
  const id=Number(result.meta?.last_row_id||0)
  const row=await db.prepare("SELECT * FROM documentation_entries WHERE id=?").bind(id).first()
  await recordVersion(env,session,"doc",id,"DOC_CREATED",row); await audit(env,session,"DOC_CREATED","doc",id,`تم إنشاء قسم توثيق ${titleAr}`,{})
  return json({ok:true,doc:row},201)
}

async function adminDocByIdResponse(request, env, id) {
  const session = await requireAdmin(request, env, request.method === "GET" ? "docs.read" : "docs.write")
  const db=requireDatabase(env); const existing=await db.prepare("SELECT * FROM documentation_entries WHERE id=? LIMIT 1").bind(id).first()
  if(!existing)return json({error:"DOC_NOT_FOUND"},404); if(request.method==="GET")return json({doc:existing})
  assertSameOrigin(request)
  if(request.method==="DELETE"){
    await db.prepare("UPDATE documentation_entries SET status='ARCHIVED',updated_by=?,updated_at=? WHERE id=?").bind(session.user.id,new Date().toISOString(),id).run()
    const row=await db.prepare("SELECT * FROM documentation_entries WHERE id=?").bind(id).first(); await recordVersion(env,session,"doc",id,"DOC_ARCHIVED",row); await audit(env,session,"DOC_ARCHIVED","doc",id,`تمت أرشفة ${existing.title_ar}`,{}); return json({ok:true})
  }
  const body=await parseJsonBody(request); const now=new Date().toISOString()
  await db.prepare(`UPDATE documentation_entries SET slug=?,title_ar=?,title_en=?,summary_ar=?,content_ar=?,content_en=?,status=?,sort_order=?,updated_by=?,updated_at=? WHERE id=?`).bind(
    normalizeSlug(body.slug??existing.slug), normalizeText(body.titleAr??existing.title_ar,300), normalizeText(body.titleEn??existing.title_en,300), normalizeText(body.summaryAr??existing.summary_ar,1000), normalizeText(body.contentAr??existing.content_ar,20000), normalizeText(body.contentEn??existing.content_en,20000), contentStatus(body.status??existing.status,existing.status), Number(body.sortOrder??existing.sort_order??100), session.user.id, now, id).run()
  const row=await db.prepare("SELECT * FROM documentation_entries WHERE id=?").bind(id).first(); await recordVersion(env,session,"doc",id,"DOC_UPDATED",row); await audit(env,session,"DOC_UPDATED","doc",id,`تم تحديث ${row.title_ar}`,{}); return json({ok:true,doc:row})
}

async function adminFaqResponse(request, env) {
  const session=await requireAdmin(request,env,request.method==="GET"?"faq.read":"faq.write"); const db=requireDatabase(env)
  if(request.method==="GET"){
    const result=await db.prepare(`SELECT f.*, p.display_name AS product_name, p.slug AS product_slug FROM faq_entries f LEFT JOIN products p ON p.id=f.product_id ORDER BY COALESCE(p.sort_order,9999), f.sort_order, f.id`).all(); return json({faq:result.results||[]})
  }
  assertSameOrigin(request); const body=await parseJsonBody(request); const questionAr=normalizeText(body.questionAr,1000), answerAr=normalizeText(body.answerAr,8000); if(!questionAr||!answerAr)return json({error:"FAQ_FIELDS_REQUIRED"},400)
  const now=new Date().toISOString(); const productId=body.productId?Number(body.productId):null
  const result=await db.prepare(`INSERT INTO faq_entries (product_id,question_ar,answer_ar,question_en,answer_en,status,sort_order,created_by,updated_by,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(productId,questionAr,answerAr,normalizeText(body.questionEn,1000),normalizeText(body.answerEn,8000),contentStatus(body.status),Number(body.sortOrder||100),session.user.id,session.user.id,now).run()
  const id=Number(result.meta?.last_row_id||0); const row=await db.prepare("SELECT * FROM faq_entries WHERE id=?").bind(id).first(); await recordVersion(env,session,"faq",id,"FAQ_CREATED",row); await audit(env,session,"FAQ_CREATED","faq",id,"تم إنشاء سؤال شائع",{}); return json({ok:true,item:row},201)
}

async function adminFaqByIdResponse(request, env, id) {
  const session=await requireAdmin(request,env,request.method==="GET"?"faq.read":"faq.write"); const db=requireDatabase(env); const existing=await db.prepare("SELECT * FROM faq_entries WHERE id=? LIMIT 1").bind(id).first(); if(!existing)return json({error:"FAQ_NOT_FOUND"},404); if(request.method==="GET")return json({item:existing}); assertSameOrigin(request)
  if(request.method==="DELETE"){await db.prepare("UPDATE faq_entries SET status='ARCHIVED',updated_by=?,updated_at=? WHERE id=?").bind(session.user.id,new Date().toISOString(),id).run(); const row=await db.prepare("SELECT * FROM faq_entries WHERE id=?").bind(id).first(); await recordVersion(env,session,"faq",id,"FAQ_ARCHIVED",row); await audit(env,session,"FAQ_ARCHIVED","faq",id,"تمت أرشفة سؤال شائع",{}); return json({ok:true})}
  const body=await parseJsonBody(request); const now=new Date().toISOString(); await db.prepare(`UPDATE faq_entries SET product_id=?,question_ar=?,answer_ar=?,question_en=?,answer_en=?,status=?,sort_order=?,updated_by=?,updated_at=? WHERE id=?`).bind(body.productId?Number(body.productId):existing.product_id,normalizeText(body.questionAr??existing.question_ar,1000),normalizeText(body.answerAr??existing.answer_ar,8000),normalizeText(body.questionEn??existing.question_en,1000),normalizeText(body.answerEn??existing.answer_en,8000),contentStatus(body.status??existing.status,existing.status),Number(body.sortOrder??existing.sort_order??100),session.user.id,now,id).run(); const row=await db.prepare("SELECT * FROM faq_entries WHERE id=?").bind(id).first(); await recordVersion(env,session,"faq",id,"FAQ_UPDATED",row); await audit(env,session,"FAQ_UPDATED","faq",id,"تم تحديث سؤال شائع",{}); return json({ok:true,item:row})
}

async function adminAnnouncementsResponse(request, env) {
  const session=await requireAdmin(request,env,request.method==="GET"?"announcements.read":"announcements.write"); const db=requireDatabase(env)
  if(request.method==="GET"){const result=await db.prepare("SELECT * FROM announcements ORDER BY created_at DESC").all(); return json({announcements:result.results||[]})}
  assertSameOrigin(request); const body=await parseJsonBody(request); const titleAr=normalizeText(body.titleAr,500); if(!titleAr)return json({error:"ANNOUNCEMENT_TITLE_REQUIRED"},400); const tone=normalizeText(body.tone||"INFO",30).toUpperCase(); const now=new Date().toISOString(); const result=await db.prepare(`INSERT INTO announcements (title_ar,body_ar,tone,status,starts_at,ends_at,created_by,updated_by,updated_at) VALUES (?,?,?,?,?,?,?,?,?)`).bind(titleAr,normalizeText(body.bodyAr,4000),ANNOUNCEMENT_TONES.has(tone)?tone:"INFO",contentStatus(body.status),normalizeNullableText(body.startsAt,60),normalizeNullableText(body.endsAt,60),session.user.id,session.user.id,now).run(); const id=Number(result.meta?.last_row_id||0); const row=await db.prepare("SELECT * FROM announcements WHERE id=?").bind(id).first(); await recordVersion(env,session,"announcement",id,"ANNOUNCEMENT_CREATED",row); await audit(env,session,"ANNOUNCEMENT_CREATED","announcement",id,`تم إنشاء إعلان ${titleAr}`,{}); return json({ok:true,announcement:row},201)
}

async function adminAnnouncementByIdResponse(request, env, id) {
  const session=await requireAdmin(request,env,request.method==="GET"?"announcements.read":"announcements.write"); const db=requireDatabase(env); const existing=await db.prepare("SELECT * FROM announcements WHERE id=? LIMIT 1").bind(id).first(); if(!existing)return json({error:"ANNOUNCEMENT_NOT_FOUND"},404); if(request.method==="GET")return json({announcement:existing}); assertSameOrigin(request)
  if(request.method==="DELETE"){await db.prepare("UPDATE announcements SET status='ARCHIVED',updated_by=?,updated_at=? WHERE id=?").bind(session.user.id,new Date().toISOString(),id).run(); const row=await db.prepare("SELECT * FROM announcements WHERE id=?").bind(id).first(); await recordVersion(env,session,"announcement",id,"ANNOUNCEMENT_ARCHIVED",row); await audit(env,session,"ANNOUNCEMENT_ARCHIVED","announcement",id,"تمت أرشفة إعلان",{}); return json({ok:true})}
  const body=await parseJsonBody(request); const tone=normalizeText(body.tone??existing.tone,30).toUpperCase(); const now=new Date().toISOString(); await db.prepare(`UPDATE announcements SET title_ar=?,body_ar=?,tone=?,status=?,starts_at=?,ends_at=?,updated_by=?,updated_at=? WHERE id=?`).bind(normalizeText(body.titleAr??existing.title_ar,500),normalizeText(body.bodyAr??existing.body_ar,4000),ANNOUNCEMENT_TONES.has(tone)?tone:existing.tone,contentStatus(body.status??existing.status,existing.status),normalizeNullableText(body.startsAt??existing.starts_at,60),normalizeNullableText(body.endsAt??existing.ends_at,60),session.user.id,now,id).run(); const row=await db.prepare("SELECT * FROM announcements WHERE id=?").bind(id).first(); await recordVersion(env,session,"announcement",id,"ANNOUNCEMENT_UPDATED",row); await audit(env,session,"ANNOUNCEMENT_UPDATED","announcement",id,`تم تحديث إعلان ${row.title_ar}`,{}); return json({ok:true,announcement:row})
}

async function adminMediaResponse(request, env) {
  const session=await requireAdmin(request,env,request.method==="GET"?"media.read":"media.write"); const db=requireDatabase(env)
  if(request.method==="GET"){const result=await db.prepare("SELECT * FROM media_assets ORDER BY id DESC").all(); return json({media:result.results||[]})}
  assertSameOrigin(request); const body=await parseJsonBody(request); const key=normalizeSlug(body.assetKey||body.label), label=normalizeText(body.label,300), url=normalizeText(body.url,2000); if(!key||!label||!url)return json({error:"MEDIA_FIELDS_REQUIRED"},400); const now=new Date().toISOString(); const result=await db.prepare(`INSERT INTO media_assets (asset_key,label,kind,url,alt_ar,status,updated_by,updated_at) VALUES (?,?,?,?,?,?,?,?)`).bind(key,label,normalizeText(body.kind||"IMAGE",30).toUpperCase(),url,normalizeText(body.altAr,500),contentStatus(body.status,"PUBLISHED"),session.user.id,now).run(); const id=Number(result.meta?.last_row_id||0); const row=await db.prepare("SELECT * FROM media_assets WHERE id=?").bind(id).first(); await recordVersion(env,session,"media",id,"MEDIA_CREATED",row); await audit(env,session,"MEDIA_CREATED","media",id,`تمت إضافة وسيط ${label}`,{}); return json({ok:true,item:row},201)
}

async function adminMediaByIdResponse(request, env, id) {
  const session=await requireAdmin(request,env,request.method==="GET"?"media.read":"media.write"); const db=requireDatabase(env); const existing=await db.prepare("SELECT * FROM media_assets WHERE id=? LIMIT 1").bind(id).first(); if(!existing)return json({error:"MEDIA_NOT_FOUND"},404); if(request.method==="GET")return json({item:existing}); assertSameOrigin(request)
  if(request.method==="DELETE"){await db.prepare("UPDATE media_assets SET status='ARCHIVED',updated_by=?,updated_at=? WHERE id=?").bind(session.user.id,new Date().toISOString(),id).run(); return json({ok:true})}
  const body=await parseJsonBody(request); const now=new Date().toISOString(); await db.prepare(`UPDATE media_assets SET label=?,kind=?,url=?,alt_ar=?,status=?,updated_by=?,updated_at=? WHERE id=?`).bind(normalizeText(body.label??existing.label,300),normalizeText(body.kind??existing.kind,30).toUpperCase(),normalizeText(body.url??existing.url,2000),normalizeText(body.altAr??existing.alt_ar,500),contentStatus(body.status??existing.status,existing.status),session.user.id,now,id).run(); const row=await db.prepare("SELECT * FROM media_assets WHERE id=?").bind(id).first(); await recordVersion(env,session,"media",id,"MEDIA_UPDATED",row); await audit(env,session,"MEDIA_UPDATED","media",id,`تم تحديث ${row.label}`,{}); return json({ok:true,item:row})
}

const SETTINGS_PERMISSIONS = {
  seo: { read: "seo.read", write: "seo.write" },
  appearance: { read: "appearance.read", write: "appearance.write" },
  maintenance: { read: "maintenance.read", write: "maintenance.write" },
}

async function adminSettingResponse(request, env, key) {
  const policy = SETTINGS_PERMISSIONS[key]
  if (!policy) return json({ error: "SETTING_NOT_FOUND" }, 404)
  const session = await requireAdmin(request, env, request.method === "GET" ? policy.read : policy.write)
  requireDatabase(env)
  if(request.method==="GET")return json({key,value:await readPlatformSetting(env,key,{})})
  assertSameOrigin(request); const body=await parseJsonBody(request); const value=(body&&typeof body.value==="object"&&body.value!==null)?body.value:body; await writePlatformSetting(env,session,key,value); return json({ok:true,key,value})
}

async function adminRolesResponse(request, env) {
  const session = await requireOwner(request, env)
  const db = requireDatabase(env)
  if(request.method==="GET"){const result=await db.prepare("SELECT discord_id,username,global_name,avatar_url,platform_role,last_seen_at FROM users ORDER BY last_seen_at DESC").all(); return json({users:result.results||[],roles:["USER","VIEWER","SUPPORT","PRODUCT_MANAGER","CONTENT_MANAGER","ADMIN"]})}
  assertSameOrigin(request); const body=await parseJsonBody(request); const discordId=normalizeText(body.discordId,40), role=normalizeText(body.role,40).toUpperCase(); if(!discordId||!PLATFORM_ROLES.has(role)||role==="OWNER")return json({error:"INVALID_ROLE_ASSIGNMENT"},400); if(env.DISCORD_OWNER_ID&&discordId===env.DISCORD_OWNER_ID)return json({error:"OWNER_ROLE_IMMUTABLE"},409); const existing=await db.prepare("SELECT * FROM users WHERE discord_id=? LIMIT 1").bind(discordId).first(); if(!existing)return json({error:"USER_NOT_FOUND"},404); await db.prepare("UPDATE users SET platform_role=? WHERE discord_id=?").bind(role,discordId).run(); await audit(env,session,"USER_ROLE_UPDATED","user",discordId,`تم تغيير صلاحية @${existing.username} إلى ${role}`,{role}); return json({ok:true,discordId,role})
}

async function adminVersionsResponse(request, env) {
  await requireOwner(request, env)
  const db = requireDatabase(env)
  const result = await db.prepare("SELECT id,entity_type,entity_id,action,snapshot_json,created_by,created_at FROM content_versions ORDER BY created_at DESC LIMIT 300").all()
  return json({ versions: result.results || [] })
}


async function rollbackVersionResponse(request, env, id) {
  const session = await requireOwner(request, env)
  assertSameOrigin(request)
  const db = requireDatabase(env)
  const version = await db.prepare("SELECT * FROM content_versions WHERE id = ? LIMIT 1").bind(id).first()
  if (!version) return json({ error: "VERSION_NOT_FOUND" }, 404)
  const snapshot = safeJsonParse(version.snapshot_json, null)
  if (!snapshot || typeof snapshot !== "object") return json({ error: "VERSION_SNAPSHOT_INVALID" }, 409)
  const now = new Date().toISOString()

  if (version.entity_type === "product") {
    await db.prepare(`UPDATE products SET code=?,slug=?,name=?,display_name=?,category=?,product_type=?,version=?,status=?,short_description=?,arabic_description=?,application_id=?,install_enabled=?,install_requires_login=?,install_mode=?,install_scopes_json=?,install_permissions=?,requirements_json=?,permission_notes_json=?,docs_url=?,faq_url=?,featured=?,sort_order=?,updated_by=?,updated_at=?,published_at=? WHERE id=?`).bind(
      snapshot.code, snapshot.slug, snapshot.name, snapshot.display_name, snapshot.category, snapshot.product_type, snapshot.version, snapshot.status,
      snapshot.short_description||"", snapshot.arabic_description||"", snapshot.application_id||null, Number(snapshot.install_enabled||0), Number(snapshot.install_requires_login??1), snapshot.install_mode||"DISCORD_DEFAULT",
      snapshot.install_scopes_json||"[]", snapshot.install_permissions||"", snapshot.requirements_json||"[]", snapshot.permission_notes_json||"[]", snapshot.docs_url||null, snapshot.faq_url||null,
      Number(snapshot.featured||0), Number(snapshot.sort_order||100), session.user.id, now, snapshot.published_at||null, Number(version.entity_id)).run()
  } else if (version.entity_type === "page") {
    await db.prepare(`UPDATE content_pages SET title_ar=?,title_en=?,eyebrow=?,headline=?,accent=?,body_ar=?,body_en=?,status=?,updated_by=?,updated_at=? WHERE id=?`).bind(
      snapshot.title_ar||"", snapshot.title_en||"", snapshot.eyebrow||"", snapshot.headline||"", snapshot.accent||"", snapshot.body_ar||"", snapshot.body_en||"", snapshot.status||"DRAFT", session.user.id, now, Number(version.entity_id)).run()
  } else if (version.entity_type === "doc") {
    await db.prepare(`UPDATE documentation_entries SET product_id=?,slug=?,title_ar=?,title_en=?,summary_ar=?,content_ar=?,content_en=?,status=?,sort_order=?,updated_by=?,updated_at=? WHERE id=?`).bind(
      snapshot.product_id, snapshot.slug, snapshot.title_ar||"", snapshot.title_en||"", snapshot.summary_ar||"", snapshot.content_ar||"", snapshot.content_en||"", snapshot.status||"DRAFT", Number(snapshot.sort_order||100), session.user.id, now, Number(version.entity_id)).run()
  } else if (version.entity_type === "faq") {
    await db.prepare(`UPDATE faq_entries SET product_id=?,question_ar=?,answer_ar=?,question_en=?,answer_en=?,status=?,sort_order=?,updated_by=?,updated_at=? WHERE id=?`).bind(
      snapshot.product_id||null, snapshot.question_ar||"", snapshot.answer_ar||"", snapshot.question_en||"", snapshot.answer_en||"", snapshot.status||"DRAFT", Number(snapshot.sort_order||100), session.user.id, now, Number(version.entity_id)).run()
  } else if (version.entity_type === "announcement") {
    await db.prepare(`UPDATE announcements SET title_ar=?,body_ar=?,tone=?,status=?,starts_at=?,ends_at=?,updated_by=?,updated_at=? WHERE id=?`).bind(
      snapshot.title_ar||"", snapshot.body_ar||"", snapshot.tone||"INFO", snapshot.status||"DRAFT", snapshot.starts_at||null, snapshot.ends_at||null, session.user.id, now, Number(version.entity_id)).run()
  } else if (version.entity_type === "media") {
    await db.prepare(`UPDATE media_assets SET label=?,kind=?,url=?,alt_ar=?,status=?,updated_by=?,updated_at=? WHERE id=?`).bind(
      snapshot.label||"", snapshot.kind||"IMAGE", snapshot.url||"", snapshot.alt_ar||"", snapshot.status||"PUBLISHED", session.user.id, now, Number(version.entity_id)).run()
  } else if (version.entity_type === "setting") {
    await writePlatformSetting(env, session, String(version.entity_id), snapshot.value || {})
  } else {
    return json({ error: "ROLLBACK_NOT_SUPPORTED_FOR_ENTITY" }, 409)
  }

  await audit(env, session, "VERSION_ROLLED_BACK", version.entity_type, version.entity_id, `تم استرجاع النسخة #${id}`, { versionId: id })
  return json({ ok: true, versionId: id })
}

async function publicPlatformContentResponse(env) {
  const db=requireDatabase(env)
  const pageRows=await db.prepare("SELECT * FROM content_pages WHERE status='PUBLISHED' ORDER BY id ASC").all()
  const pages={}
  for (const row of (pageRows.results || [])) pages[row.page_key] = row
  const now=new Date().toISOString()
  const announcements=await db.prepare(`SELECT id,title_ar,body_ar,tone FROM announcements WHERE status='PUBLISHED' AND (starts_at IS NULL OR starts_at='' OR starts_at<=?) AND (ends_at IS NULL OR ends_at='' OR ends_at>=?) ORDER BY id DESC LIMIT 3`).bind(now,now).all()
  const appearance=await readPlatformSetting(env,"appearance",{accent:"blue",compact:false,showNetworkStatus:true})
  const seo=await readPlatformSetting(env,"seo",{})
  return json({pages,home:pages.home||null,announcements:announcements.results||[],appearance,seo})
}

async function publicProductDocsResponse(env, slug) {
  const db=requireDatabase(env); const product=await db.prepare("SELECT id FROM products WHERE slug=? AND status IN ('PUBLISHED','COMING_SOON','MAINTENANCE') LIMIT 1").bind(slug).first(); if(!product)return json({docs:[]}); const result=await db.prepare("SELECT id,slug,title_ar,title_en,summary_ar,content_ar,content_en,sort_order FROM documentation_entries WHERE product_id=? AND status='PUBLISHED' ORDER BY sort_order,id").bind(product.id).all(); return json({docs:result.results||[]})
}

async function publicProductFaqResponse(env, slug) {
  const db=requireDatabase(env); const product=await db.prepare("SELECT id FROM products WHERE slug=? AND status IN ('PUBLISHED','COMING_SOON','MAINTENANCE') LIMIT 1").bind(slug).first(); if(!product)return json({faq:[]}); const result=await db.prepare("SELECT id,question_ar,answer_ar,question_en,answer_en,sort_order FROM faq_entries WHERE product_id=? AND status='PUBLISHED' ORDER BY sort_order,id").bind(product.id).all(); return json({faq:result.results||[]})
}

async function installProductResponse(request, env, slug) {
  const db = requireDatabase(env)
  const row = await db.prepare("SELECT * FROM products WHERE slug = ? LIMIT 1").bind(slug).first()
  if (!row || row.status !== "PUBLISHED") return json({ error: "PRODUCT_NOT_AVAILABLE" }, 404)
  if (!row.install_enabled || !row.application_id) return json({ error: "INSTALL_DISABLED" }, 409)

  const session = await readRequestSession(request, env)
  if (row.install_requires_login && !session) {
    const url = new URL(request.url)
    const login = new URL("/api/auth/discord", url.origin)
    login.searchParams.set("return", `/api/install/${encodeURIComponent(slug)}?resume=1`)
    return redirect(login.toString())
  }

  const install = new URL(DISCORD_AUTHORIZE)
  install.searchParams.set("client_id", row.application_id)

  if (row.install_mode === "CUSTOM") {
    const scopes = safeJsonParse(row.install_scopes_json, ["bot", "applications.commands"])
    const cleanedScopes = Array.isArray(scopes) ? scopes.filter((scope) => typeof scope === "string" && scope.trim()) : []
    if (cleanedScopes.length) install.searchParams.set("scope", cleanedScopes.join(" "))
    if (row.install_permissions) install.searchParams.set("permissions", row.install_permissions)
    install.searchParams.set("integration_type", "0")
  }

  return redirect(install.toString())
}


async function maintenanceResponseIfNeeded(request, env) {
  if (request.method !== "GET" || !hasDatabase(env)) return null
  const url = new URL(request.url)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/assets/")) return null
  const setting = await readPlatformSetting(env, "maintenance", { enabled: false, message: "المنصة تحت الصيانة حاليًا.", ownerBypass: true })
  if (!normalizeBoolean(setting?.enabled)) return null

  if (normalizeBoolean(setting?.ownerBypass)) {
    const session = await readRequestSession(request, env)
    if (session?.user?.role === "OWNER") return null
  }

  const message = normalizeText(setting?.message || "المنصة تحت الصيانة حاليًا. نرجع قريب.", 1000)
  const escaped = message.replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]))
  return new Response(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HAMOOD LABS — صيانة</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#03101a;color:#eef8ff;font-family:Arial,sans-serif}.box{width:min(720px,calc(100% - 40px));border:1px solid #184a66;background:#061723;padding:50px;text-align:center}.mark{font-size:14px;letter-spacing:4px;color:#49dca8}.box h1{font-size:54px;margin:16px 0}.box p{color:#8aa8b9;line-height:2}.rights{margin-top:36px;font-size:11px;color:#49677a}</style></head><body><main class="box"><div class="mark">HAMOOD LABS / MAINTENANCE</div><h1>المنصة تحت الصيانة.</h1><p>${escaped}</p><div class="rights">© 2026 HAMOOD LABS — ALL RIGHTS RESERVED</div></main></body></html>`, { status: 503, headers: apiHeaders({"Content-Type":"text/html; charset=utf-8","Retry-After":"300"}) })
}

async function genericProductPage(request, env) {
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/products\/([a-z0-9-]+)\/?$/i)
  if (!match || match[1].toLowerCase() === "guardian") return null

  if (hasDatabase(env)) {
    const row = await env.DB.prepare("SELECT status FROM products WHERE slug = ? LIMIT 1").bind(match[1].toLowerCase()).first()
    if (!row || !PUBLIC_PRODUCT_STATUSES.has(row.status)) return null
  }

  const templateUrl = new URL("/product/index.html", url.origin)
  return env.ASSETS.fetch(new Request(templateUrl.toString(), { method: "GET", headers: request.headers }))
}

async function handleApi(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  // V4.5 RBAC firewall: every known /api/admin route is permission-checked
  // before its handler runs. Individual handlers keep their own checks too.
  if (path.startsWith("/api/admin/")) await enforceAdminApiPolicy(request, env, path)

  if (request.method === "GET" && path === "/api/auth/discord") return startDiscordAuth(request, env)
  if (request.method === "GET" && path === "/api/auth/discord/callback") return finishDiscordAuth(request, env)
  if (request.method === "GET" && path === "/api/auth/session") return sessionResponse(request, env)
  if (request.method === "POST" && path === "/api/auth/logout") return logoutResponse(request)

  if (request.method === "GET" && path === "/api/platform/content") return publicPlatformContentResponse(env)
  if (request.method === "GET" && path === "/api/products") return publicProductsResponse(env)
  const publicDocsMatch = path.match(/^\/api\/products\/([a-z0-9-]+)\/docs$/i)
  if (request.method === "GET" && publicDocsMatch) return publicProductDocsResponse(env, publicDocsMatch[1].toLowerCase())
  const publicFaqMatch = path.match(/^\/api\/products\/([a-z0-9-]+)\/faq$/i)
  if (request.method === "GET" && publicFaqMatch) return publicProductFaqResponse(env, publicFaqMatch[1].toLowerCase())
  const publicProductMatch = path.match(/^\/api\/products\/([a-z0-9-]+)$/i)
  if (request.method === "GET" && publicProductMatch) return publicProductResponse(env, publicProductMatch[1].toLowerCase())

  if (request.method === "POST" && path === "/api/suggestions") return createSuggestionResponse(request, env)
  if (request.method === "GET" && path === "/api/suggestions/mine") return mineSuggestionsResponse(request, env)

  const installMatch = path.match(/^\/api\/install\/([a-z0-9-]+)$/i)
  if (request.method === "GET" && installMatch) return installProductResponse(request, env, installMatch[1].toLowerCase())

  if (request.method === "GET" && path === "/api/admin/me") return adminMeResponse(request, env)
  if (request.method === "GET" && path === "/api/admin/stats") return adminStatsResponse(request, env)
  if ((request.method === "GET" || request.method === "POST") && path === "/api/admin/products") return adminProductsResponse(request, env)

  const adminProductMatch = path.match(/^\/api\/admin\/products\/(\d+)$/)
  if (["GET", "PATCH", "DELETE"].includes(request.method) && adminProductMatch) {
    return adminProductByIdResponse(request, env, Number(adminProductMatch[1]))
  }

  if (request.method === "GET" && path === "/api/admin/suggestions") return adminSuggestionsResponse(request, env)
  const adminSuggestionMatch = path.match(/^\/api\/admin\/suggestions\/(\d+)$/)
  if (["GET", "PATCH"].includes(request.method) && adminSuggestionMatch) {
    return adminSuggestionByIdResponse(request, env, Number(adminSuggestionMatch[1]))
  }

  if (request.method === "GET" && path === "/api/admin/users") return adminUsersResponse(request, env)
  if (request.method === "GET" && path === "/api/admin/audit") return adminAuditResponse(request, env)

  if (["GET","POST"].includes(request.method) && path === "/api/admin/pages") return adminPagesResponse(request, env)
  const adminPageMatch = path.match(/^\/api\/admin\/pages\/(\d+)$/)
  if (["GET","PATCH"].includes(request.method) && adminPageMatch) return adminPageByIdResponse(request, env, Number(adminPageMatch[1]))

  if (["GET","POST"].includes(request.method) && path === "/api/admin/docs") return adminDocsResponse(request, env)
  const adminDocMatch = path.match(/^\/api\/admin\/docs\/(\d+)$/)
  if (["GET","PATCH","DELETE"].includes(request.method) && adminDocMatch) return adminDocByIdResponse(request, env, Number(adminDocMatch[1]))

  if (["GET","POST"].includes(request.method) && path === "/api/admin/faq") return adminFaqResponse(request, env)
  const adminFaqMatch = path.match(/^\/api\/admin\/faq\/(\d+)$/)
  if (["GET","PATCH","DELETE"].includes(request.method) && adminFaqMatch) return adminFaqByIdResponse(request, env, Number(adminFaqMatch[1]))

  if (["GET","POST"].includes(request.method) && path === "/api/admin/announcements") return adminAnnouncementsResponse(request, env)
  const adminAnnouncementMatch = path.match(/^\/api\/admin\/announcements\/(\d+)$/)
  if (["GET","PATCH","DELETE"].includes(request.method) && adminAnnouncementMatch) return adminAnnouncementByIdResponse(request, env, Number(adminAnnouncementMatch[1]))

  if (["GET","POST"].includes(request.method) && path === "/api/admin/media") return adminMediaResponse(request, env)
  const adminMediaMatch = path.match(/^\/api\/admin\/media\/(\d+)$/)
  if (["GET","PATCH","DELETE"].includes(request.method) && adminMediaMatch) return adminMediaByIdResponse(request, env, Number(adminMediaMatch[1]))

  const adminSettingMatch = path.match(/^\/api\/admin\/settings\/(seo|appearance|maintenance)$/)
  if (["GET","PATCH"].includes(request.method) && adminSettingMatch) return adminSettingResponse(request, env, adminSettingMatch[1])

  if (["GET","PATCH"].includes(request.method) && path === "/api/admin/roles") return adminRolesResponse(request, env)
  if (request.method === "GET" && path === "/api/admin/versions") return adminVersionsResponse(request, env)
  const rollbackMatch = path.match(/^\/api\/admin\/versions\/(\d+)\/rollback$/)
  if (request.method === "POST" && rollbackMatch) return rollbackVersionResponse(request, env, Number(rollbackMatch[1]))

  if (request.method === "GET" && path === "/api/health") {
    return json({
      service: "HAMOOD LABS",
      version: "V4.5",
      auth: "ONLINE",
      discordOAuth: Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET),
      database: hasDatabase(env),
      timestamp: new Date().toISOString(),
    })
  }

  return json({ error: "API_NOT_FOUND" }, 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    try {
      if (url.pathname.startsWith("/api/")) return await handleApi(request, env)
      if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) return await guardAdminPage(request, env)

      const maintenance = await maintenanceResponseIfNeeded(request, env)
      if (maintenance) return maintenance

      if (url.pathname.startsWith("/products/")) {
        const asset = await env.ASSETS.fetch(request)
        if (asset.status !== 404) return asset
        const dynamic = await genericProductPage(request, env)
        if (dynamic) return dynamic
        return asset
      }

      return env.ASSETS.fetch(request)
    } catch (error) {
      console.error("Worker request failure", error)
      if (url.pathname.startsWith("/api/")) {
        const status = Number(error?.status || 500)
        return json({ error: error?.message || "INTERNAL_SERVER_ERROR" }, status)
      }
      return env.ASSETS.fetch(request)
    }
  },
}
