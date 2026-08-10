import GuardianShowcase from "../components/GuardianShowcase"
import {
  GuardianDirectory,
  GuardianLifecycle,
  GuardianQuickFacts,
  GuardianSystemMap,
} from "../components/GuardianExperience"
import { PageHero } from "../components/PlatformShell"
import { GUARDIAN_INVITE_URL, ROUTES } from "../siteConfig"

function GuardianProductNav() {
  return (
    <nav className="guardian-page-nav page-section" aria-label="Guardian product navigation" data-reveal>
      <a href="#guardian-overview"><span>01</span><strong>نبذة</strong></a>
      <a href="#guardian-map"><span>02</span><strong>خريطة النظام</strong></a>
      <a href="#guardian-directory"><span>03</span><strong>القدرات</strong></a>
      <a href="#guardian-flow"><span>04</span><strong>دورة الحادث</strong></a>
      <a href={ROUTES.guardianDocs}><span>05</span><strong>الدليل</strong></a>
      <a href={ROUTES.guardianFaq}><span>06</span><strong>FAQ</strong></a>
    </nav>
  )
}

export default function GuardianPage() {
  return (
    <>
      <PageHero
        eyebrow="001 GUARDIAN / OFFICIAL PRODUCT CENTER"
        title="001 GUARDIAN"
        accent="SECURITY + RECOVERY."
        arabicTitle="منتج الحماية الأول داخل HAMOOD LABS."
        arabicText="هذي صفحة Guardian فقط. هنا تتعرف على النظام وقدراته وطريقة استجابته للحوادث، بينما الدليل والأسئلة والأوامر موجودة في صفحات مستقلة عشان ما يصير كل شيء محشور في مكان واحد."
        actions={(
          <>
            <a className="primary-button" href={ROUTES.guardianDocs}>OPEN USER GUIDE <span>→</span></a>
            <a className="secondary-button" href={GUARDIAN_INVITE_URL} target="_blank" rel="noopener noreferrer">INSTALL GUARDIAN <span>↗</span></a>
          </>
        )}
      >
        <div className="guardian-route-status" data-tilt>
          <span><i /> PRODUCT 001 / ACTIVE</span>
          <strong>READY TO DEPLOY</strong>
          <small>V1.0.0 • AUTO SETUP • LIVE PROTECTION</small>
        </div>
      </PageHero>

      <GuardianProductNav />

      <section className="guardian-overview-page page-section" id="guardian-overview" data-reveal>
        <div className="guardian-overview-copy" dir="rtl">
          <span className="overview-live"><i /> المنتج 001 • متاح الآن</span>
          <h2>الحماية ما توقف عند التنبيه.</h2>
          <p>
            Guardian مصمم عشان يعطيك سياق الحادث كامل: وش صار، مين نفذ التغيير، وش الحالة المحفوظة، وين الدليل، وهل فيه استرجاع مدعوم وآمن للحالة المتأثرة.
          </p>
          <div className="guardian-overview-actions">
            <a className="primary-button" href="#guardian-map">استكشف النظام <span>↓</span></a>
            <a className="secondary-button" href={ROUTES.guardianDocs}>دليل الاستخدام <span>→</span></a>
          </div>
        </div>
        <GuardianQuickFacts />
      </section>

      <GuardianSystemMap />
      <GuardianDirectory />
      <GuardianLifecycle />

      <section className="guardian-demo-intro page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">LIVE SECURITY MODEL / VISUAL EXAMPLE</p>
            <h2>FROM EVENT TO <span>EVIDENCE.</span></h2>
          </div>
          <div dir="rtl">
            <strong>مثال بصري يوضح فلسفة Guardian.</strong>
            <p>الجزء التالي يعرض نموذجًا بصريًا لفكرة الرصد، حفظ الدليل وربط الحادث — بدون ما نكرر دليل الاستخدام أو FAQ داخل صفحة المنتج.</p>
          </div>
        </div>
      </section>

      <GuardianShowcase />

      <section className="guardian-next-actions page-section" data-reveal>
        <div>
          <p className="eyebrow">NEXT STEP / CHOOSE YOUR PATH</p>
          <h2>UNDERSTAND IT. <span>THEN DEPLOY IT.</span></h2>
          <p dir="rtl">إذا فهمت المنتج، انتقل للدليل الكامل أو الأسئلة الشائعة. التثبيت الرسمي موجود هنا وفي نهاية الدليل.</p>
        </div>
        <div className="guardian-next-grid">
          <a href={ROUTES.guardianDocs}><span>01</span><strong>USER GUIDE</strong><small dir="rtl">الدليل + الأوامر + التثبيت</small></a>
          <a href={ROUTES.guardianFaq}><span>02</span><strong>ARABIC FAQ</strong><small dir="rtl">أهم الأسئلة قبل التثبيت</small></a>
          <a href={GUARDIAN_INVITE_URL} target="_blank" rel="noopener noreferrer"><span>03</span><strong>INSTALL</strong><small dir="rtl">الرابط الرسمي لـ001 Guardian</small></a>
        </div>
      </section>
    </>
  )
}
