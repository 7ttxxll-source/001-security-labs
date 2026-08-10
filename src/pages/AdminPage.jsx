import { useEffect, useMemo, useState } from "react"
import { useAccess } from "../auth/AccessContext"
import { BRAND, ROUTES } from "../siteConfig"
import ProductManager from "../admin/ProductManager"
import SuggestionsManager from "../admin/SuggestionsManager"
import UsersManager from "../admin/UsersManager"
import AuditManager from "../admin/AuditManager"
import { adminApi } from "../admin/adminApi"
import { PagesManager, DocsManager, FaqManager, AnnouncementsManager, MediaManager, SeoManager, AppearanceManager, MaintenanceManager, PermissionsManager, VersionsManager } from "../admin/ContentManagers"
import "./AdminPage.css"

const modules = [
  { id: "overview", label: "الرئيسية", sub: "نظرة عامة", live: true, permission: "admin.read" },
  { id: "products", label: "المنتجات", sub: "إضافة وتعديل ونشر البوتات", live: true, permission: "products.read" },
  { id: "suggestions", label: "الاقتراحات", sub: "المراجعة وحالات المتابعة", live: true, permission: "suggestions.read" },
  { id: "users", label: "المستخدمون", sub: "حسابات Discord المسجلة", live: true, permission: "users.read" },
  { id: "permissions", label: "الصلاحيات", sub: "أدوار فريق لوحة الإدارة", live: true, permission: "admin.read", ownerOnly: true },
  { id: "audit", label: "سجل العمليات", sub: "تتبع التغييرات الإدارية", live: true, permission: "audit.read" },
  { id: "pages", label: "الصفحات", sub: "محتوى صفحات المنصة", live: true, permission: "pages.read" },
  { id: "docs", label: "التوثيق والدليل", sub: "أدلة كل منتج", live: true, permission: "docs.read" },
  { id: "faq", label: "الأسئلة الشائعة", sub: "FAQ لكل منتج", live: true, permission: "faq.read" },
  { id: "announcements", label: "الإعلانات", sub: "إعلانات المنصة", live: true, permission: "announcements.read" },
  { id: "media", label: "الوسائط", sub: "الشعارات والبنرات والروابط", live: true, permission: "media.read" },
  { id: "seo", label: "محركات البحث", sub: "العناوين والوصف", live: true, permission: "seo.read" },
  { id: "appearance", label: "المظهر", sub: "إعدادات الواجهة", live: true, permission: "appearance.read" },
  { id: "maintenance", label: "الصيانة", sub: "حالة المنصة", live: true, permission: "maintenance.read" },
  { id: "versions", label: "المسودات والإصدارات", sub: "تاريخ حفظ المحتوى", live: true, permission: "versions.read", ownerOnly: true },
]

const roleOverview = {
  OWNER: {
    title: <>تحكم كامل بالمنصة<br /><em>بدون تعديل الكود.</em></>,
    text: "من هنا تدير المنتجات والتثبيت والمحتوى والمستخدمين والإعدادات الحساسة. العمليات المهمة تُسجل تلقائيًا في سجل التدقيق.",
    mark: "OWNER",
  },
  ADMIN: {
    title: <>إدارة المنصة<br /><em>ضمن صلاحية ADMIN.</em></>,
    text: "عندك وصول إداري واسع، لكن ملكية المنصة وتعيين الأدوار المحمية تبقى مقفلة للـ OWNER.",
    mark: "ADMIN",
  },
  PRODUCT_MANAGER: {
    title: <>إدارة المنتجات<br /><em>فقط ضمن صلاحيتك.</em></>,
    text: "تقدر تضيف وتعدل وتنشر المنتجات وتضبط التثبيت والمتطلبات. إعدادات المنصة والمحتوى والصلاحيات غير متاحة لهذا الدور.",
    mark: "PRODUCT",
  },
  CONTENT_MANAGER: {
    title: <>إدارة المحتوى<br /><em>فقط ضمن صلاحيتك.</em></>,
    text: "تقدر تدير الصفحات والتوثيق وFAQ والإعلانات والوسائط وSEO بدون الوصول لإعدادات المنصة الحساسة.",
    mark: "CONTENT",
  },
  SUPPORT: {
    title: <>إدارة المتابعة<br /><em>ضمن نطاق الدعم.</em></>,
    text: "وصولك مخصص للاقتراحات والمتابعة المرتبطة بالدعم فقط.",
    mark: "SUPPORT",
  },
  VIEWER: {
    title: <>عرض إداري<br /><em>بدون صلاحيات تعديل.</em></>,
    text: "هذا الدور للقراءة والمراجعة فقط. أي عملية تعديل محمية من جهة الخادم.",
    mark: "VIEWER",
  },
}

function Avatar({ user }) {
  if (user?.avatar_url) return <img src={user.avatar_url} alt="" />
  return <span>{(user?.global_name || user?.username || "H").slice(0, 1).toUpperCase()}</span>
}

function AdminLogo() {
  return <div className="admin-logo" aria-hidden="true"><strong>H</strong><small>001</small></div>
}

function Metric({ label, value, note }) {
  return <article className="admin-metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>
}

function PlannedModule({ module }) {
  return (
    <section className="admin-planned-module" dir="rtl">
      <span>قسم مجهز للمرحلة التالية</span>
      <h2>{module.label}</h2>
      <strong>{module.sub}</strong>
      <p>القسم موجود في هيكل لوحة الإدارة، لكن ما بنحط أزرار وهمية. أول ما نربطه بقاعدة البيانات والنشر الآمن راح يصير فعال من نفس المكان.</p>
      <div><i>قريبًا</i><small>سيتم ربطه بنفس نظام الحفظ وسجل العمليات.</small></div>
    </section>
  )
}

export default function AdminPage() {
  const { session, logout } = useAccess()
  const [status, setStatus] = useState({ loading: true, data: null, error: null })
  const [activeModule, setActiveModule] = useState("overview")
  const [stats, setStats] = useState({ products: 0, publishedProducts: 0, suggestions: 0, pendingSuggestions: 0, users: 0, auditEvents: 0 })
  const [statsError, setStatsError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    adminApi("/api/admin/me")
      .then((data) => { if (!cancelled) setStatus({ loading: false, data, error: null }) })
      .catch((error) => { if (!cancelled) setStatus({ loading: false, data: null, error: error.message }) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!status.data?.authorized) return
    let cancelled = false
    adminApi("/api/admin/stats")
      .then((data) => {
        if (cancelled) return
        setStats(data.stats || stats)
        setStatsError("")
      })
      .catch((error) => {
        if (!cancelled) setStatsError(error.message)
      })
    return () => { cancelled = true }
  }, [status.data?.authorized, refreshKey])

  const owner = status.data?.user || session.user
  const role = status.data?.role || "USER"
  const permissions = status.data?.permissions || []
  const can = (permission) => role === "OWNER" || permissions.includes("*") || permissions.includes(permission)
  const visibleModules = useMemo(
    () => modules.filter((item) => (!item.ownerOnly || role === "OWNER") && can(item.permission)),
    [role, status.data?.permissions],
  )
  const active = useMemo(() => visibleModules.find((item) => item.id === activeModule) || visibleModules[0] || modules[0], [activeModule, visibleModules])
  const activeId = active?.id || "overview"
  const overview = roleOverview[role] || roleOverview.VIEWER

  const handleLogout = async () => {
    await logout()
    window.location.assign(ROUTES.home)
  }

  if (status.loading) {
    return (
      <section className="admin-boot" dir="rtl">
        <AdminLogo />
        <span><i /> جاري التحقق من صلاحية الحساب</span>
        <h1>جاري فتح لوحة التحكم...</h1>
        <p>يتم التحقق من جلسة Discord ودور الحساب قبل عرض الأدوات الإدارية المصرح بها.</p>
      </section>
    )
  }

  if (status.error) {
    return (
      <section className="admin-denied" dir="rtl">
        <AdminLogo />
        <span>تم رفض الوصول</span>
        <h1>هذه المنطقة لحسابات الإدارة المصرح لها فقط.</h1>
        <p>سجل الدخول بحساب Discord المصرح له بدخول HAMOOD ADMIN ثم حاول مرة ثانية.</p>
        <a href={ROUTES.home}>العودة للمنصة ←</a>
      </section>
    )
  }

  const databaseOnline = status.data?.controlCenter?.database === "ONLINE" && !statsError

  return (
    <section className="admin-app" dir="rtl">
      <aside className="admin-sidebar">
        <a className="admin-brand" href={ROUTES.admin}>
          <AdminLogo />
          <div><strong>HAMOOD ADMIN</strong><small>مركز التحكم / V4.5</small></div>
        </a>

        <div className="admin-owner-card">
          <div className="admin-owner-avatar"><Avatar user={owner} /></div>
          <div><small>{status.data?.role || "OWNER"} / VERIFIED</small><strong>{owner?.global_name || owner?.username || "HAMOOD"}</strong><span>@{owner?.username || "_o1f"}</span></div>
          <i>مصرح</i>
        </div>

        <nav className="admin-nav" aria-label="أقسام لوحة الإدارة">
          {visibleModules.map((item) => (
            <button key={item.id} className={activeId === item.id ? "is-active" : ""} type="button" onClick={() => setActiveModule(item.id)}>
              <span><strong>{item.label}</strong><small>{item.sub}</small></span>
              <i className={item.live ? "is-live" : "is-planned"}>{item.live ? "●" : "○"}</i>
            </button>
          ))}
        </nav>

        <div className="admin-side-footer">
          <a href={ROUTES.home}>فتح الموقع ↗</a>
          <button type="button" onClick={handleLogout}>تسجيل الخروج</button>
          <small>{BRAND.rights}</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span><i /> {status.data?.role === "OWNER" ? "OWNER VERIFIED" : `${status.data?.role || "ADMIN"} ACCESS`}</span><h1>{active.label}</h1><small>{active.sub}</small></div>
          <div className="admin-top-actions">
            <span className={`admin-system-pill ${databaseOnline ? "is-ok" : "is-warning"}`}>قاعدة البيانات: {databaseOnline ? "متصلة" : "تحتاج إعداد"}</span>
            <a href={ROUTES.products}>عرض المنتجات</a>
            <span className="admin-owner-badge">{status.data?.role || "OWNER"}</span>
          </div>
        </header>

        {activeId === "overview" && (
          <div className="admin-dashboard">
            <section className="admin-command-hero">
              <div>
                <span>HAMOOD LABS / ROLE-BASED CONTROL CENTER</span>
                <h2>{overview.title}</h2>
                <p>{overview.text}</p>
              </div>
              <div className="admin-command-mark" aria-hidden="true"><strong>001</strong><small>{overview.mark}</small></div>
            </section>

            {!databaseOnline && (
              <section className="admin-setup-alert">
                <strong>⚠ قاعدة البيانات المحلية تحتاج تفعيل migrations</strong>
                <p>واجهة V4.5 تعتمد على D1 للمحتوى والمنتجات والإعدادات. طبق migrations مرة واحدة ثم ترجع كل الأدوات ONLINE.</p>
                <code>npx wrangler d1 migrations apply hamood-labs --local</code>
              </section>
            )}

            <section className="admin-metrics-grid">
              {can("products.read") && <Metric value={String(stats.publishedProducts).padStart(2, "0")} label="منتجات منشورة" note={`الإجمالي ${stats.products}`} />}
              {can("suggestions.read") && <Metric value={String(stats.pendingSuggestions).padStart(2, "0")} label="اقتراحات تحتاج مراجعة" note={`الإجمالي ${stats.suggestions}`} />}
              {can("users.read") && <Metric value={String(stats.users).padStart(2, "0")} label="مستخدمون مسجلون" note="Discord OAuth" />}
              {can("audit.read") && <Metric value={String(stats.auditEvents).padStart(2, "0")} label="عمليات مسجلة" note="Audit Log" />}
            </section>

            <section className="admin-grid-two">
              <article className="admin-panel">
                <div className="admin-panel-title"><div><span>حالة النظام</span><h3>الأنظمة الأساسية</h3></div><i>V4.5</i></div>
                <div className="admin-status-list">
                  <div><span>تسجيل Discord</span><strong>شغال</strong></div>
                  <div><span>حماية OWNER</span><strong>مفعلة</strong></div>
                  <div><span>قاعدة بيانات D1</span><strong className={databaseOnline ? "" : "warn"}>{databaseOnline ? "متصلة" : "تحتاج migrations"}</strong></div>
                  {can("products.read") && <div><span>إدارة المنتجات</span><strong className={databaseOnline ? "" : "warn"}>{databaseOnline ? "شغالة" : "بانتظار القاعدة"}</strong></div>}
                  {can("products.write") && <div><span>زر تثبيت البوت الديناميكي</span><strong className={databaseOnline ? "" : "warn"}>{databaseOnline ? "شغال" : "بانتظار القاعدة"}</strong></div>}
                  {can("audit.read") && <div><span>سجل العمليات</span><strong className={databaseOnline ? "" : "warn"}>{databaseOnline ? "شغال" : "بانتظار القاعدة"}</strong></div>}
                </div>
              </article>

              <article className="admin-panel admin-quick-actions">
                <div className="admin-panel-title"><div><span>اختصارات</span><h3>وش تبي تسوي؟</h3></div></div>
                {can("products.write") && <button type="button" onClick={() => setActiveModule("products")}><span>+ إضافة بوت جديد</span><small>بيانات + متطلبات + تثبيت + نشر</small></button>}
                {can("suggestions.read") && <button type="button" onClick={() => setActiveModule("suggestions")}><span>مراجعة الاقتراحات</span><small>{stats.pendingSuggestions} تحتاج مراجعة</small></button>}
                {can("audit.read") && <button type="button" onClick={() => setActiveModule("audit")}><span>فتح سجل العمليات</span><small>راجع آخر التغييرات الإدارية</small></button>}
                <a href={ROUTES.products} target="_blank" rel="noreferrer"><span>فتح الموقع كزائر ↗</span><small>شوف النتيجة المنشورة</small></a>
              </article>
            </section>
          </div>
        )}

        {activeId === "products" && <ProductManager onDataChanged={() => setRefreshKey((value) => value + 1)} />}
        {activeId === "suggestions" && <SuggestionsManager onDataChanged={() => setRefreshKey((value) => value + 1)} />}
        {activeId === "users" && <UsersManager />}
        {activeId === "permissions" && <PermissionsManager />}
        {activeId === "audit" && <AuditManager />}
        {activeId === "pages" && <PagesManager />}
        {activeId === "docs" && <DocsManager />}
        {activeId === "faq" && <FaqManager />}
        {activeId === "announcements" && <AnnouncementsManager />}
        {activeId === "media" && <MediaManager />}
        {activeId === "seo" && <SeoManager />}
        {activeId === "appearance" && <AppearanceManager />}
        {activeId === "maintenance" && <MaintenanceManager />}
        {activeId === "versions" && <VersionsManager />}
        {!active.live && <PlannedModule module={active} />}
      </main>
    </section>
  )
}
