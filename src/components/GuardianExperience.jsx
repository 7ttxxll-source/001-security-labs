import { useMemo, useState } from "react"
import {
  commandGroups,
  commands,
  guideSteps,
  installChecklist,
  lifecycle,
  quickFacts,
  systemModules,
} from "../data/guardian"

export function GuardianQuickFacts() {
  return (
    <div className="guardian-quick-facts">
      {quickFacts.map((item) => (
        <div key={item.label}>
          <span>{item.technical}</span>
          <strong dir="rtl">{item.value}</strong>
          <small dir="rtl">{item.label}</small>
        </div>
      ))}
    </div>
  )
}

export function GuardianSystemMap() {
  const [activeCode, setActiveCode] = useState("LIVE")
  const active = systemModules.find((item) => item.code === activeCode) ?? systemModules[0]

  return (
    <section className="guardian-system-map page-section" id="guardian-map" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">INTERACTIVE SYSTEM MAP / 001 CORE</p>
          <h3 dir="rtl">خريطة النظام التفاعلية.</h3>
        </div>
        <p dir="rtl">
          مرر الماوس أو اضغط على أي وحدة عشان تعرف وظيفتها وعلاقتها بباقي أجزاء Guardian.
        </p>
      </div>

      <div className="system-map-shell">
        <div className="system-map-visual" aria-label="Guardian interactive system map">
          <div className="system-map-ring ring-a" aria-hidden="true" />
          <div className="system-map-ring ring-b" aria-hidden="true" />
          <div className="system-map-cross cross-x" aria-hidden="true" />
          <div className="system-map-cross cross-y" aria-hidden="true" />

          <div className="system-map-core" aria-hidden="true">
            <span>001</span>
            <strong>GUARDIAN CORE</strong>
            <small>SECURITY / RECOVERY</small>
          </div>

          <div className="system-map-nodes">
            {systemModules.map((item, index) => (
              <button
                type="button"
                key={item.code}
                className={`system-map-node node-${index + 1} ${activeCode === item.code ? "is-active" : ""}`}
                onMouseEnter={() => setActiveCode(item.code)}
                onFocus={() => setActiveCode(item.code)}
                onClick={() => setActiveCode(item.code)}
                aria-pressed={activeCode === item.code}
              >
                <span>{item.code}</span>
                <small>{item.short}</small>
              </button>
            ))}
          </div>
        </div>

        <article className="system-map-detail" data-tilt>
          <div className="map-detail-top">
            <span>{active.code} / MODULE</span>
            <strong><i />{active.status}</strong>
          </div>
          <p className="map-detail-kicker">{active.short}</p>
          <h4 dir="rtl">{active.title}</h4>
          <p dir="rtl">{active.text}</p>
          <div className="map-detail-points">
            {active.points.map((point) => <span key={point} dir="rtl">{point}</span>)}
          </div>
          <div className="map-detail-footer">
            <span>001 SECURITY ARCHITECTURE</span>
            <strong>VERIFIED MODULE</strong>
          </div>
        </article>
      </div>
    </section>
  )
}

export function GuardianDirectory() {
  return (
    <section className="guardian-directory page-section" id="guardian-directory" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">SYSTEM DIRECTORY / COMPLETE OVERVIEW</p>
          <h3 dir="rtl">قدرات Guardian الحالية.</h3>
        </div>
        <p dir="rtl">
          كل بطاقة تشرح وحدة من النظام بشكل مختصر، والخريطة فوق توضح كيف تتكامل الوحدات مع بعض.
        </p>
      </div>

      <div className="guardian-directory-grid">
        {systemModules.map((item, index) => (
          <article key={item.code} data-tilt>
            <div><span>{String(index + 1).padStart(2, "0")}</span><small>{item.code}</small></div>
            <h4 dir="rtl">{item.title}</h4>
            <p dir="rtl">{item.text}</p>
            <div className="directory-status"><i />{item.status}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function GuardianLifecycle() {
  return (
    <section className="guardian-lifecycle page-section" id="guardian-flow" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">INCIDENT LIFECYCLE / FROM EVENT TO RECOVERY</p>
          <h3 dir="rtl">وش يصير من أول ثانية؟</h3>
        </div>
        <p dir="rtl">
          هذا المسار يوضح رحلة الحدث داخل Guardian من الرصد إلى التحقيق ثم الاسترجاع المدعوم عندما يكون متاحًا.
        </p>
      </div>

      <div className="lifecycle-track">
        {lifecycle.map((item, index) => (
          <article key={item.number} className="lifecycle-step">
            <div className="lifecycle-index">
              <span>{item.number}</span>
              <small>{item.tech}</small>
            </div>
            <div dir="rtl">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
            {index < lifecycle.length - 1 && <i aria-hidden="true">→</i>}
          </article>
        ))}
      </div>
    </section>
  )
}

export function GuardianGuide() {
  return (
    <section className="guardian-guide guardian-guide-v2 page-section" id="guardian-guide" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">OFFICIAL USER GUIDE / 001</p>
          <h3 dir="rtl">دليل الاستخدام — من التثبيت إلى التحقق.</h3>
        </div>
        <p dir="rtl">
          امشِ بالخطوات بالترتيب أول مرة، وبعدها ارجع لأي خطوة تحتاجها أثناء تشغيل النظام.
        </p>
      </div>

      <div className="guardian-docs-layout">
        <aside className="guide-index" aria-label="Guardian guide index">
          <span>GUIDE INDEX / 001</span>
          {guideSteps.map((step) => (
            <a key={step.number} href={`#${step.id}`}>
              <small>{step.number}</small>
              <strong>{step.title}</strong>
            </a>
          ))}
        </aside>

        <div className="guardian-guide-grid guardian-guide-list">
          {guideSteps.map((step) => (
            <article key={step.number} id={step.id}>
              <span>{step.number}</span>
              <div dir="rtl">
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function GuardianCommands() {
  const [activeGroup, setActiveGroup] = useState("الكل")
  const filtered = useMemo(
    () => activeGroup === "الكل" ? commands : commands.filter((item) => item.group === activeGroup),
    [activeGroup],
  )

  return (
    <section className="guardian-commands page-section" id="guardian-commands" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">COMMAND CENTER / USER REFERENCE</p>
          <h3 dir="rtl">مرجع أوامر Guardian.</h3>
        </div>
        <p dir="rtl">
          مرجع سريع للأوامر الأساسية. ظهور الأمر أو إمكانية استخدامه يعتمد على الصلاحيات والمسار المتاح داخل السيرفر.
        </p>
      </div>

      <div className="command-filters" role="tablist" aria-label="Guardian command filters">
        {commandGroups.map((group) => (
          <button
            type="button"
            key={group}
            className={activeGroup === group ? "is-active" : ""}
            onClick={() => setActiveGroup(group)}
            role="tab"
            aria-selected={activeGroup === group}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="command-grid">
        {filtered.map((item) => (
          <article key={item.command} className="command-card" data-tilt>
            <div className="command-card-top">
              <code>{item.command}</code>
              <span>{item.group}</span>
            </div>
            <h4 dir="rtl">{item.title}</h4>
            <p dir="rtl">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function GuardianInstallChecklist({ inviteUrl }) {
  return (
    <section className="guardian-install-zone page-section" id="guardian-install" data-reveal>
      <div className="install-zone-head">
        <div>
          <p className="eyebrow">INSTALLATION / FINAL CHECK</p>
          <h3 dir="rtl">جاهز؟ راجع الأربع نقاط ثم ثبّت Guardian.</h3>
        </div>
        <div className="install-ready-seal" data-tilt>
          <span><i /> AVAILABLE NOW</span>
          <strong>001</strong>
          <small>READY TO INSTALL</small>
        </div>
      </div>

      <div className="install-check-grid">
        {installChecklist.map((item) => (
          <article key={item.code}>
            <span>{item.code}</span>
            <div dir="rtl">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="official-install-card" data-tilt>
        <div>
          <span><i /> OFFICIAL DISCORD INSTALL</span>
          <h4>001 GUARDIAN</h4>
          <p dir="rtl">الرابط الرسمي لتثبيت المنتج 001 داخل سيرفرك.</p>
        </div>
        <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
          INSTALL 001 GUARDIAN <span>↗</span>
        </a>
      </div>
    </section>
  )
}
