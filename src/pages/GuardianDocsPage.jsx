import { useEffect, useState } from "react"
import {
  GuardianCommands,
  GuardianGuide,
  GuardianInstallChecklist,
} from "../components/GuardianExperience"
import { PageHero } from "../components/PlatformShell"
import { GUARDIAN_INVITE_URL, ROUTES } from "../siteConfig"

export default function GuardianDocsPage() {
  const [managedDocs, setManagedDocs] = useState([])

  useEffect(() => {
    fetch("/api/products/guardian/docs", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("DOCS_UNAVAILABLE")))
      .then((data) => setManagedDocs(data.docs || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHero
        eyebrow="001 GUARDIAN / OFFICIAL DOCUMENTATION"
        title="USER GUIDE."
        accent="ARABIC FIRST."
        arabicTitle="دليل Guardian الكامل — مرتب وواضح."
        arabicText="هذي صفحة التوثيق فقط: خطوات الاستخدام، مرجع الأوامر والتثبيت. شرح المنتج نفسه موجود في Product Center والأسئلة المهمة لها صفحة مستقلة."
        actions={(
          <>
            <a className="primary-button" href="#guardian-guide">START GUIDE <span>↓</span></a>
            <a className="secondary-button" href={ROUTES.guardian}>BACK TO PRODUCT <span>←</span></a>
          </>
        )}
      >
        <div className="docs-status-card" data-tilt>
          <span>DOCUMENTATION STATUS</span>
          <strong>LIVE / 001</strong>
          <small>ARABIC GUIDE • COMMAND REFERENCE • INSTALL CHECKLIST</small>
        </div>
      </PageHero>

      <nav className="docs-jump-nav page-section" data-reveal aria-label="Guardian documentation navigation">
        <a href="#guardian-guide"><span>01</span><strong>دليل الاستخدام</strong></a>
        <a href="#guardian-commands"><span>02</span><strong>مرجع الأوامر</strong></a>
        <a href="#guardian-install"><span>03</span><strong>التثبيت</strong></a>
        <a href={ROUTES.guardianFaq}><span>04</span><strong>الأسئلة الشائعة</strong></a>
      </nav>

      <GuardianGuide />
      <GuardianCommands />
      <GuardianInstallChecklist inviteUrl={GUARDIAN_INVITE_URL} />

      {managedDocs.length > 0 && (
        <section className="managed-docs page-section" data-reveal dir="rtl">
          <div className="section-heading-split"><div><p className="eyebrow">MANAGED DOCUMENTATION</p><h2>تحديثات <span>التوثيق.</span></h2></div><div><strong>محتوى منشور من HAMOOD ADMIN.</strong><p>أي قسم تنشره من لوحة التحكم يظهر هنا تلقائيًا.</p></div></div>
          <div className="managed-content-grid">{managedDocs.map((item) => <article key={item.id}><span>{String(item.sort_order || 0).padStart(2,"0")}</span><h3>{item.title_ar}</h3>{item.summary_ar && <strong>{item.summary_ar}</strong>}<p>{item.content_ar}</p></article>)}</div>
        </section>
      )}

      <section className="docs-help-strip page-section" data-reveal>
        <div dir="rtl">
          <p className="eyebrow">NEED CLARIFICATION?</p>
          <h2>باقي عندك سؤال؟</h2>
          <p>راجع FAQ العربي أول، وإذا عندك اقتراح أو نقطة غير موجودة بالتوثيق تقدر تستخدم مركز الاقتراحات.</p>
        </div>
        <div className="route-hero-actions">
          <a className="primary-button" href={ROUTES.guardianFaq}>OPEN FAQ <span>→</span></a>
          <a className="secondary-button" href={ROUTES.suggestions}>SEND SUGGESTION <span>↗</span></a>
        </div>
      </section>
    </>
  )
}
