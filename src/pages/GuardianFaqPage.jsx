import SupportFaq from "../components/SupportFaq"
import { PageHero } from "../components/PlatformShell"
import { ROUTES } from "../siteConfig"

export default function GuardianFaqPage() {
  return (
    <>
      <PageHero
        eyebrow="001 GUARDIAN / ARABIC FAQ"
        title="QUESTIONS."
        accent="CLEAR ANSWERS."
        arabicTitle="أهم الأسئلة قبل ما تثبت Guardian."
        arabicText="الخصوصية، الصلاحيات، Black Box، الاسترجاع، Threats وطريقة الاستخدام — كلها مجمعة هنا بدل ما تضيع داخل الصفحة الرئيسية."
        actions={(
          <>
            <a className="primary-button" href="#support">OPEN FAQ <span>↓</span></a>
            <a className="secondary-button" href={ROUTES.guardianDocs}>USER GUIDE <span>→</span></a>
          </>
        )}
      >
        <div className="faq-route-status" data-tilt>
          <span>FAQ / 001</span>
          <strong>12 QUESTIONS</strong>
          <small>ARABIC • PRODUCT-SPECIFIC • BEFORE INSTALL</small>
        </div>
      </PageHero>

      <SupportFaq />

      <section className="faq-suggestion-strip page-section" data-reveal>
        <div dir="rtl">
          <p className="eyebrow">QUESTION NOT LISTED?</p>
          <h2>ما لقيت سؤالك؟ اقترح إضافته.</h2>
          <p>مركز الاقتراحات مو بس للبوتات الجديدة؛ تقدر تقترح سؤال للتوثيق، تحسين في الموقع أو ميزة داخل Guardian.</p>
        </div>
        <a className="primary-button" href={ROUTES.suggestions}>OPEN SUGGESTION CENTER <span>→</span></a>
      </section>
    </>
  )
}
