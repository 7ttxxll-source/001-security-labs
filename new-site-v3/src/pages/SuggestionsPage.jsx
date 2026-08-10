import { useMemo, useState } from "react"
import { PageHero } from "../components/PlatformShell"
import { BRAND, ROUTES } from "../siteConfig"

const categories = [
  "بوت جديد",
  "ميزة لمنتج موجود",
  "تحسين للموقع",
  "توثيق / FAQ",
  "مشكلة أو ملاحظة",
  "فكرة أخرى",
]

export default function SuggestionsPage() {
  const [category, setCategory] = useState(categories[0])
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [useCase, setUseCase] = useState("")
  const [status, setStatus] = useState("")

  const formattedSuggestion = useMemo(() => [
    "HAMOOD LABS — SUGGESTION",
    `Category: ${category}`,
    `Title: ${title || "—"}`,
    "",
    "Details:",
    details || "—",
    "",
    "Use case / Why it matters:",
    useCase || "—",
  ].join("\n"), [category, title, details, useCase])

  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(message)
    } catch {
      setStatus("ما قدر المتصفح ينسخ تلقائيًا — انسخ النص يدويًا.")
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await copyText(
      formattedSuggestion,
      `تم نسخ الاقتراح. افتح Discord وأرسله للمطور ${BRAND.discordUsername}`,
    )
  }

  return (
    <>
      <PageHero
        eyebrow="HAMOOD LABS / SUGGESTION CENTER"
        title="BUILD THE NEXT"
        accent="IDEA WITH US."
        arabicTitle="عندك فكرة؟ خلها مرتبة وواضحة."
        arabicText="اقترح بوت جديد، ميزة، تحسين للموقع، سؤال للتوثيق أو أي فكرة ثانية. المركز يرتب اقتراحك ويجهزه للنسخ والإرسال للمطور مباشرة عبر Discord."
        actions={(
          <>
            <a className="primary-button" href="#suggestion-form">WRITE SUGGESTION <span>↓</span></a>
            <a className="secondary-button" href={ROUTES.products}>VIEW PRODUCTS <span>←</span></a>
          </>
        )}
      >
        <div className="creator-contact-hero" data-tilt>
          <span>OFFICIAL CREATOR / DISCORD</span>
          <strong>{BRAND.discordUsername}</strong>
          <small dir="rtl">اليوزر يبدأ بشرطة سفلية: _o1f</small>
          <button type="button" onClick={() => copyText(BRAND.discordUsername, `تم نسخ ${BRAND.discordUsername}`)}>
            COPY USERNAME
          </button>
        </div>
      </PageHero>

      <section className="suggestion-center page-section" id="suggestion-form" data-reveal>
        <div className="suggestion-form-copy" dir="rtl">
          <p className="eyebrow">SUGGESTION BUILDER</p>
          <h2>اكتب الفكرة — والموقع يرتبها لك.</h2>
          <p>
            حاليًا ما فيه إرسال تلقائي أو قاعدة بيانات للاقتراحات. بعد الضغط على تجهيز الاقتراح، الموقع ينسخ النص مرتب وتقدر ترسله مباشرة لحساب المطور في Discord.
          </p>
          <div className="suggestion-rules">
            <span>01 <strong>وضح الفكرة</strong></span>
            <span>02 <strong>اذكر المشكلة اللي تحلها</strong></span>
            <span>03 <strong>لا ترسل بيانات حساسة</strong></span>
            <span>04 <strong>اقتراح واحد واضح أفضل من عشر أفكار مبهمة</strong></span>
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
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="مثال: بوت إدارة فعاليات حصري"
              maxLength={90}
            />
          </label>

          <label>
            <span>اشرح فكرتك</span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="وش الفكرة؟ كيف تشتغل؟ وش أهم الأشياء اللي تتوقعها منها؟"
              rows={7}
            />
          </label>

          <label>
            <span>ليش تشوفها مهمة؟</span>
            <textarea
              value={useCase}
              onChange={(event) => setUseCase(event.target.value)}
              placeholder="وش المشكلة اللي تحلها؟ ومين بيستفيد منها؟"
              rows={4}
            />
          </label>

          <button className="suggestion-submit" type="submit">
            PREPARE + COPY SUGGESTION <span>→</span>
          </button>

          {status && <div className="suggestion-status" role="status" dir="rtl">{status}</div>}
        </form>
      </section>

      <section className="suggestion-preview page-section" data-reveal>
        <div>
          <p className="eyebrow">LIVE PREVIEW / READY TO SEND</p>
          <h2>YOUR SUGGESTION <span>FORMAT.</span></h2>
          <p dir="rtl">هذا هو النص اللي راح ينسخه الموقع. تقدر تراجعه قبل الإرسال.</p>
        </div>
        <pre>{formattedSuggestion}</pre>
      </section>

      <section className="discord-contact-zone page-section" data-reveal>
        <div className="discord-contact-badge" data-tilt>
          <span>DISCORD / CREATOR CONTACT</span>
          <strong>{BRAND.discordUsername}</strong>
          <small>BUILT &amp; DEVELOPED BY HAMOOD — 001</small>
        </div>
        <div dir="rtl">
          <h2>أرسل الاقتراح للمطور مباشرة.</h2>
          <p>انسخ اليوزر أو الاقتراح، افتح Discord وابحث عن <bdi>{BRAND.discordUsername}</bdi>. الشرطة السفلية هي أول حرف في اليوزر.</p>
          <div className="route-hero-actions">
            <button className="primary-button button-reset" type="button" onClick={() => copyText(BRAND.discordUsername, `تم نسخ ${BRAND.discordUsername}`)}>
              COPY {BRAND.discordUsername} <span>→</span>
            </button>
            <a className="secondary-button" href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer">
              OPEN DISCORD <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
