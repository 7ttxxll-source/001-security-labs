import { useEffect, useState } from "react"
import { PageHero } from "../components/PlatformShell"
import { useAccess } from "../auth/AccessContext"
import { usePlatformContent } from "../hooks/usePlatformContent"
import { BRAND, ROUTES } from "../siteConfig"

const categories = [
  "بوت جديد",
  "ميزة لمنتج موجود",
  "تحسين للموقع",
  "توثيق / FAQ",
  "مشكلة أو ملاحظة",
  "فكرة أخرى",
]

const statusLabels = {
  SUBMITTED: "تم الاستلام",
  REVIEWING: "قيد المراجعة",
  PLANNED: "مخطط لها",
  ACCEPTED: "مقبول",
  DECLINED: "مرفوض",
  RELEASED: "تم التنفيذ",
}

export default function SuggestionsPage() {
  const { session, loginWithDiscord } = useAccess()
  const { pages } = usePlatformContent()
  const managedPage = pages?.suggestions
  const [category, setCategory] = useState(categories[0])
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [useCase, setUseCase] = useState("")
  const [status, setStatus] = useState("")
  const [sending, setSending] = useState(false)
  const [mine, setMine] = useState([])

  const loadMine = async () => {
    try {
      const response = await fetch("/api/suggestions/mine", { credentials: "include", headers: { Accept: "application/json" } })
      const data = await response.json()
      if (response.ok && Array.isArray(data?.suggestions)) setMine(data.suggestions)
    } catch {
      // Non-critical on public page.
    }
  }

  useEffect(() => { loadMine() }, [session.user?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus("")

    if (!session.user) {
      loginWithDiscord(window.location.href)
      return
    }

    if (!title.trim() || !details.trim()) {
      setStatus("اكتب عنوانًا واضحًا واشرح الفكرة قبل الإرسال.")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ category, title, details, useCase }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || "SUBMIT_FAILED")

      setStatus(`تم إرسال اقتراحك بنجاح. رقم المتابعة: ${data.ticket.code}`)
      setTitle("")
      setDetails("")
      setUseCase("")
      await loadMine()
    } catch {
      setStatus("ما قدرنا نرسل الاقتراح الآن. تأكد أن قاعدة البيانات شغالة وحاول مرة ثانية.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow={managedPage?.eyebrow || "HAMOOD LABS / SUGGESTION CENTER"}
        title={managedPage?.headline || "YOUR IDEA."}
        accent={managedPage?.accent || "TRACKED."}
        arabicTitle={managedPage?.title_ar || "أرسل اقتراحك وتابع حالته."}
        arabicText={managedPage?.body_ar || "سجل دخولك بديسكورد، اكتب الفكرة، وبعد الإرسال تحصل على رقم متابعة. الإدارة تراجع الاقتراح من HAMOOD ADMIN وتحدث حالته بشكل واضح."}
        actions={(
          <>
            <a className="primary-button" href="#suggestion-form">إرسال اقتراح <span>↓</span></a>
            <a className="secondary-button" href={ROUTES.products}>المنتجات <span>←</span></a>
          </>
        )}
      >
        <div className="creator-contact-hero" data-tilt>
          <span>DISCORD ACCOUNT</span>
          <strong>{session.user ? (session.user.global_name || session.user.username) : "غير مسجل"}</strong>
          <small dir="rtl">{session.user ? `@${session.user.username}` : "تسجيل Discord مطلوب لإرسال الاقتراح"}</small>
          {!session.user && <button type="button" onClick={() => loginWithDiscord(window.location.href)}>LOGIN WITH DISCORD</button>}
        </div>
      </PageHero>

      <section className="suggestion-center page-section" id="suggestion-form" data-reveal>
        <div className="suggestion-form-copy" dir="rtl">
          <p className="eyebrow">SUGGESTION TICKET</p>
          <h2>اقتراح واضح، ورقم متابعة واضح.</h2>
          <p>ما عاد تحتاج تنسخ النص وترسله يدويًا. الاقتراح يدخل قاعدة بيانات HAMOOD LABS مباشرة ويرتبط بحساب Discord المسجل.</p>
          <div className="suggestion-rules">
            <span>01 <strong>وضح الفكرة</strong></span>
            <span>02 <strong>اشرح فائدتها</strong></span>
            <span>03 <strong>لا ترسل بيانات حساسة</strong></span>
            <span>04 <strong>تابع حالتها من نفس الصفحة</strong></span>
          </div>
        </div>

        <form className="suggestion-form" onSubmit={handleSubmit}>
          <label>
            <span>نوع الاقتراح</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label>
            <span>عنوان مختصر</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="مثال: بوت إدارة فعاليات حصري" maxLength={120} />
          </label>

          <label>
            <span>اشرح فكرتك</span>
            <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="وش الفكرة؟ كيف تشتغل؟ وش أهم الأشياء اللي تتوقعها منها؟" rows={7} maxLength={6000} />
          </label>

          <label>
            <span>ليش تشوفها مهمة؟</span>
            <textarea value={useCase} onChange={(event) => setUseCase(event.target.value)} placeholder="وش المشكلة اللي تحلها؟ ومين بيستفيد منها؟" rows={4} maxLength={3000} />
          </label>

          <button className="suggestion-submit" type="submit" disabled={sending}>
            {sending ? "جاري الإرسال..." : session.user ? "إرسال الاقتراح" : "سجل دخولك ثم أرسل"} <span>→</span>
          </button>

          {status && <div className="suggestion-status" role="status" dir="rtl">{status}</div>}
        </form>
      </section>

      <section className="suggestion-preview page-section" data-reveal>
        <div dir="rtl">
          <p className="eyebrow">MY SUGGESTIONS</p>
          <h2>اقتراحاتي <span>وحالتها.</span></h2>
          <p>آخر الاقتراحات المرتبطة بحساب Discord الحالي.</p>
        </div>
        <div className="suggestion-ticket-list">
          {mine.length ? mine.map((item) => (
            <article key={item.id} dir="rtl">
              <div><span>{item.ticket_code}</span><strong>{statusLabels[item.status] || item.status}</strong></div>
              <h3>{item.title}</h3>
              <p>{item.category}</p>
              {item.admin_note && <small>ملاحظة الإدارة: {item.admin_note}</small>}
            </article>
          )) : (
            <div className="product-empty-note" dir="rtl">{session.user ? "ما عندك اقتراحات مسجلة حتى الآن." : "سجل دخولك حتى تظهر اقتراحاتك هنا."}</div>
          )}
        </div>
      </section>

      <section className="discord-contact-zone page-section" data-reveal>
        <div className="discord-contact-badge" data-tilt>
          <span>CREATOR</span>
          <strong>{BRAND.discordUsername}</strong>
          <small>BUILT &amp; DEVELOPED BY HAMOOD — 001</small>
        </div>
        <div dir="rtl">
          <h2>كل اقتراح يدخل طابور المراجعة.</h2>
          <p>من لوحة الإدارة نقدر نغير حالته إلى: قيد المراجعة، مخطط له، مقبول، مرفوض أو تم التنفيذ.</p>
        </div>
      </section>
    </>
  )
}
