import { BRAND, ROUTES, navigationItems } from "../siteConfig"
import { useAccess } from "../auth/AccessContext"
import { usePlatformContent } from "../hooks/usePlatformContent"

export function SiteHeader() {
  const path = window.location.pathname
  const { accessMode, session, loginWithDiscord, reopenAccessGate } = useAccess()
  usePlatformContent()

  return (
    <header className="navbar platform-navbar">
      <a className="brand" href={ROUTES.home} aria-label={`${BRAND.site} home`}>
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
        {navigationItems.map((item) => {
          const active = item.href === "/"
            ? path === "/"
            : path.startsWith(item.href)

          return (
            <a className={active ? "is-active" : ""} href={item.href} key={item.label}>
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="nav-platform-actions">
        <a className="nav-available" href={ROUTES.guardian} aria-label="001 Guardian available now">
          <span><i />001 AVAILABLE NOW</span>
          <small>VIEW PRODUCT →</small>
        </a>
        {session.user ? (
          <>
            {session.user.role && session.user.role !== "USER" && (
              <a className="nav-admin-entry" href={ROUTES.admin} title="فتح لوحة التحكم الخاصة بك">
                <span>⚙</span>
                <strong>لوحة التحكم</strong>
              </a>
            )}
            <button className="nav-account is-discord" type="button" onClick={reopenAccessGate}>
              <i /> {session.user.global_name || session.user.username || "DISCORD USER"}
            </button>
          </>
        ) : (
          <button
            className="nav-account"
            type="button"
            onClick={() => accessMode === "guest" ? loginWithDiscord() : reopenAccessGate()}
          >
            <i /> {accessMode === "guest" ? "GUEST / LOGIN" : "ACCESS"}
          </button>
        )}
      </div>
    </header>
  )
}

export function SiteAnnouncement() {
  const { announcements } = usePlatformContent()
  const announcement = announcements?.[0]
  if (!announcement) return null
  return (
    <aside className={`site-announcement tone-${String(announcement.tone || "INFO").toLowerCase()}`} dir="rtl">
      <span>إعلان</span>
      <strong>{announcement.title_ar}</strong>
      {announcement.body_ar && <p>{announcement.body_ar}</p>}
    </aside>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer platform-footer">
      <div className="footer-brand">
        <strong>{BRAND.site}</strong>
        <span>{BRAND.subtitle}</span>
      </div>

      <div className="footer-rights">
        <strong>BUILT &amp; DEVELOPED BY HAMOOD — 001</strong>
        <span>{BRAND.rights}</span>
        <small dir="rtl">جميع الحقوق محفوظة — هوية ومنتجات حصرية</small>
      </div>

      <a className="footer-discord" href={ROUTES.suggestions}>
        <span>DISCORD / CREATOR</span>
        <strong>{BRAND.discordUsername}</strong>
        <small dir="rtl">اقتراحات وتواصل</small>
      </a>
    </footer>
  )
}

export function CreatorRights() {
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
            <h2>HAMOOD <span>— 001</span></h2>
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
          <div className="creator-copyright">© 2026 • HAMOOD LABS • ALL RIGHTS RESERVED</div>
        </div>
      </div>
    </aside>
  )
}

export function ProductCard({ product }) {
  const isActive = product.status === "ACTIVE"

  return (
    <a
      id={product.slug}
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

      <div className="product-symbol" aria-hidden="true"><span>{product.id}</span></div>

      <div className="product-card-copy">
        <small>{product.category}</small>
        <h3>{product.displayName}</h3>
        <p>{product.shortDescription}</p>
        <p className="product-arabic" dir="rtl">{product.arabicDescription}</p>
        <div className="product-micro-meta">
          <span>{product.version}</span>
          <span>{product.documentation} DOCS</span>
          <span>{product.availabilityLabel}</span>
        </div>
      </div>

      <div className="product-card-footer">
        <span dir="rtl">{product.statusLabel}</span>
        <i>{isActive ? "OPEN PRODUCT →" : "STAY TUNED"}</i>
      </div>
    </a>
  )
}

export function PageHero({ eyebrow, title, accent, arabicTitle, arabicText, actions, children }) {
  return (
    <section className="route-hero page-section" data-reveal>
      <div className="route-hero-grid" aria-hidden="true" />
      <div className="route-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title} {accent && <span>{accent}</span>}</h1>
        {arabicTitle && (
          <div className="route-hero-arabic" dir="rtl">
            <strong>{arabicTitle}</strong>
            {arabicText && <p>{arabicText}</p>}
          </div>
        )}
        {actions && <div className="route-hero-actions">{actions}</div>}
      </div>
      {children && <div className="route-hero-side">{children}</div>}
    </section>
  )
}
