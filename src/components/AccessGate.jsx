import { useAccess } from "../auth/AccessContext"
import { BRAND } from "../siteConfig"

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.6 5.34A18.3 18.3 0 0 0 15.14 4l-.55 1.12a16.4 16.4 0 0 0-5.18 0L8.86 4A18.25 18.25 0 0 0 4.4 5.35C1.58 9.5.82 13.55 1.2 17.54A18.44 18.44 0 0 0 6.67 20.3l1.34-1.84a11.78 11.78 0 0 1-2.1-1.01l.52-.4c3.99 1.84 8.32 1.84 12.25 0l.52.4c-.67.4-1.37.74-2.1 1.02l1.34 1.83a18.42 18.42 0 0 0 5.47-2.76c.45-4.62-.77-8.63-4.21-12.2ZM8.54 15.1c-1.2 0-2.18-1.1-2.18-2.45s.96-2.45 2.18-2.45c1.23 0 2.2 1.11 2.18 2.45 0 1.35-.96 2.45-2.18 2.45Zm6.92 0c-1.2 0-2.18-1.1-2.18-2.45s.96-2.45 2.18-2.45c1.23 0 2.2 1.11 2.18 2.45 0 1.35-.95 2.45-2.18 2.45Z" />
    </svg>
  )
}

function UserAvatar({ user }) {
  const initial = (user?.global_name || user?.username || "D").slice(0, 1).toUpperCase()

  if (user?.avatar_url) {
    return <img className="access-user-avatar" src={user.avatar_url} alt="" />
  }

  return <span className="access-user-avatar access-user-avatar-fallback">{initial}</span>
}

function errorMessage(code) {
  if (code === "cancelled") return "تم إلغاء تسجيل الدخول من Discord. تقدر تحاول مرة ثانية متى ما حبيت."
  if (code === "state") return "انتهت أو لم تطابق جلسة التحقق. أعد محاولة تسجيل الدخول من جديد."
  if (code === "exchange") return "تعذر إكمال الربط مع Discord. تأكد من إعدادات التطبيق وحاول مرة ثانية."
  if (code === "session") return "تم الرجوع من Discord لكن تعذر إنشاء جلسة الموقع. أعد تسجيل الدخول."
  return "تعذر إكمال تسجيل الدخول. حاول مرة ثانية."
}

export function AccessGate() {
  const {
    accessGateOpen,
    continueAsGuest,
    loginWithDiscord,
    closeAccessGate,
    logout,
    session,
    oauthPhase,
    authError,
  } = useAccess()

  if (!accessGateOpen) return null

  const user = session.user
  const isConnecting = oauthPhase === "connecting"
  const isVerified = oauthPhase === "verified" && user

  return (
    <div className={`access-gate ${isVerified ? "is-verified" : ""}`} role="dialog" aria-modal="true" aria-labelledby="access-gate-title">
      <div className="access-gate-backdrop" aria-hidden="true" />
      <div className="access-orbit access-orbit-one" aria-hidden="true" />
      <div className="access-orbit access-orbit-two" aria-hidden="true" />
      <div className="access-scanline" aria-hidden="true" />

      <section className="access-gate-panel" data-tilt>
        <div className="access-panel-grid" aria-hidden="true" />
        <div className="access-panel-glow" aria-hidden="true" />

        <div className="access-brand-lockup">
          <div className="access-brand-mark" aria-hidden="true">
            <span>H</span>
            <small>001</small>
          </div>
          <div>
            <span className="access-system-state"><i /> ACCESS SYSTEM ONLINE</span>
            <strong>{BRAND.site}</strong>
            <small>{BRAND.subtitle}</small>
          </div>
        </div>

        {isVerified ? (
          <div className="access-verified-stage" aria-live="polite">
            <div className="access-verified-ring" aria-hidden="true"><span>✓</span></div>
            <p>DISCORD IDENTITY / VERIFIED</p>
            <h1 id="access-gate-title">IDENTITY <span>VERIFIED.</span></h1>
            <div className="access-verified-user">
              <UserAvatar user={user} />
              <div>
                <strong>{user.global_name || user.username}</strong>
                <small>@{user.username}</small>
              </div>
            </div>
            <span className="access-verified-progress"><i /></span>
            <small dir="rtl">تم ربط حساب Discord بنجاح. يتم فتح المنصة الآن.</small>
          </div>
        ) : user ? (
          <div className="access-connected-stage">
            <p>DISCORD ACCOUNT / CONNECTED</p>
            <h1 id="access-gate-title">WELCOME <span>BACK.</span></h1>

            <div className="access-connected-user">
              <UserAvatar user={user} />
              <div>
                <small>{user.role === "OWNER" ? "OWNER ACCESS" : "VERIFIED USER"}</small>
                <strong>{user.global_name || user.username}</strong>
                <span>@{user.username}</span>
              </div>
              <i>CONNECTED</i>
            </div>

            <div className={`access-connected-actions ${user.role === "OWNER" ? "is-owner" : ""}`}>
              <button type="button" className="access-enter-button" onClick={closeAccessGate}>
                ENTER PLATFORM <span>→</span>
              </button>
              {user.role === "OWNER" && (
                <a className="access-admin-button" href="/admin/">
                  OPEN ADMIN <span>↗</span>
                </a>
              )}
              <button type="button" className="access-logout-button" onClick={logout}>
                LOG OUT
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="access-gate-copy">
              <p>WELCOME / CHOOSE ACCESS MODE</p>
              <h1 id="access-gate-title">ENTER THE <span>LAB.</span></h1>
              <div dir="rtl">
                <strong>اختر طريقة دخولك إلى HAMOOD LABS</strong>
                <p>
                  سجل دخولك بدسكورد للوصول الكامل وتثبيت المنتجات، أو ادخل كزائر لتصفح المنصة والتوثيق والأنظمة المتاحة.
                </p>
              </div>
            </div>

            {authError && (
              <div className="access-auth-error" dir="rtl" role="alert">
                <strong>تعذر إكمال الربط</strong>
                <span>{errorMessage(authError)}</span>
              </div>
            )}

            <div className="access-choice-grid">
              <button
                className={`access-choice access-choice-discord ${isConnecting ? "is-connecting" : ""}`}
                type="button"
                onClick={() => loginWithDiscord()}
                disabled={isConnecting}
              >
                <span className="access-choice-icon"><DiscordGlyph /></span>
                <span className="access-choice-copy">
                  <small>{isConnecting ? "SECURE OAUTH HANDSHAKE" : "FULL PLATFORM ACCESS"}</small>
                  <strong>{isConnecting ? "CONNECTING TO DISCORD..." : "LOGIN WITH DISCORD"}</strong>
                  <em dir="rtl">ربط الحساب • تثبيت البوتات • حسابك الشخصي</em>
                </span>
                <span className="access-choice-arrow">{isConnecting ? "•••" : "→"}</span>
              </button>

              <button className="access-choice access-choice-guest" type="button" onClick={continueAsGuest} disabled={isConnecting}>
                <span className="access-choice-number">G</span>
                <span className="access-choice-copy">
                  <small>BROWSE ONLY</small>
                  <strong>CONTINUE AS GUEST</strong>
                  <em dir="rtl">تصفح المنتجات والدليل بدون ربط حساب</em>
                </span>
                <span className="access-choice-arrow">→</span>
              </button>
            </div>

            <div className="access-gate-note">
              <span><i /> DISCORD REQUIRED FOR INSTALL</span>
              <small dir="rtl">الزائر يقدر يتصفح المنصة كاملة، لكن تثبيت أي بوت يتطلب تسجيل الدخول بدسكورد.</small>
            </div>
          </>
        )}

        <div className="access-rights">
          <span>BUILT &amp; DEVELOPED BY {BRAND.creator}</span>
          <small>{BRAND.rights}</small>
        </div>
      </section>
    </div>
  )
}

export function InstallLockModal() {
  const {
    installLockOpen,
    closeInstallLock,
    loginWithDiscord,
    oauthPhase,
  } = useAccess()

  if (!installLockOpen) return null
  const isConnecting = oauthPhase === "connecting"

  return (
    <div className="install-lock-layer" role="dialog" aria-modal="true" aria-labelledby="install-lock-title">
      <button className="install-lock-backdrop" type="button" aria-label="Close" onClick={closeInstallLock} />
      <section className="install-lock-card" data-tilt>
        <button className="install-lock-close" type="button" onClick={closeInstallLock} aria-label="Close dialog">×</button>
        <span className="install-lock-status"><i /> IDENTITY REQUIRED</span>
        <div className="install-lock-symbol" aria-hidden="true">001</div>
        <h2 id="install-lock-title">DISCORD CONNECTION <span>REQUIRED.</span></h2>
        <div dir="rtl">
          <strong>قبل تثبيت أي بوت، اربط حسابك بدسكورد.</strong>
          <p>تقدر تكمل تصفح الموقع كزائر، لكن عملية التثبيت محمية وتتطلب حساب Discord مرتبط بالمنصة.</p>
        </div>
        <button
          className={`install-lock-login ${isConnecting ? "is-connecting" : ""}`}
          type="button"
          onClick={() => loginWithDiscord()}
          disabled={isConnecting}
        >
          <DiscordGlyph /> {isConnecting ? "CONNECTING TO DISCORD..." : "LOGIN WITH DISCORD"} <span>→</span>
        </button>
        <button className="install-lock-guest" type="button" onClick={closeInstallLock} disabled={isConnecting}>CONTINUE BROWSING AS GUEST</button>
      </section>
    </div>
  )
}
