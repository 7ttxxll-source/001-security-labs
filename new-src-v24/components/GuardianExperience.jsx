import { useMemo, useState } from "react"

const quickFacts = [
  { label: "الحالة", value: "متاح الآن", technical: "ACTIVE" },
  { label: "الإصدار", value: "V1.0.0", technical: "CURRENT" },
  { label: "النوع", value: "حماية واسترجاع", technical: "SECURITY" },
  { label: "الإعداد", value: "تلقائي", technical: "AUTO SETUP" },
]

const systemModules = [
  {
    code: "LIVE",
    short: "LIVE GUARD",
    title: "الحماية المباشرة",
    status: "ARMED",
    text: "يراقب الأحداث الأمنية الحساسة لحظة حدوثها ويحوّل التغيير المهم إلى مسار أمني منظم بدل ما يضيع كتنبيه عابر.",
    points: ["رصد لحظي", "تطبيع الأحداث", "بداية مسار التحقيق"],
  },
  {
    code: "ROLE",
    short: "ROLE SECURITY",
    title: "حماية الرتب والصلاحيات",
    status: "ARMED",
    text: "يراقب تغييرات الرتب والصلاحيات الحساسة، ويحتفظ بالسياق اللازم لفهم من نفذ التغيير وما أثره الأمني.",
    points: ["صلاحيات حساسة", "تحديد المنفذ", "تقييم أثر التغيير"],
  },
  {
    code: "CH",
    short: "CHANNEL SECURITY",
    title: "حماية القنوات",
    status: "ARMED",
    text: "يرصد نشاط القنوات المدعوم ويحفظ الحالة الهيكلية المطلوبة حتى يقدر Guardian يحقق ويجهز الاسترجاع المدعوم.",
    points: ["حذف القنوات", "حفظ البنية", "استرجاع مدعوم"],
  },
  {
    code: "WH",
    short: "WEBHOOK SECURITY",
    title: "حماية Webhooks",
    status: "ARMED",
    text: "يراقب إنشاء وتعديل وحذف Webhooks مع استبعاد Token ورابط Webhook من الأدلة الجنائية الحساسة.",
    points: ["Create / Update / Delete", "بدون Token", "بدون Webhook URL"],
  },
  {
    code: "BOX",
    short: "BLACK BOX",
    title: "الصندوق الأسود",
    status: "READY",
    text: "ينشئ لقطات جنائية للحالات المدعومة ويربطها بالحادث مع SHA-256 للمساعدة في التحقق من سلامة الدليل.",
    points: ["Forensic Snapshot", "SHA-256", "ربط بالحادث"],
  },
  {
    code: "INC",
    short: "INCIDENT ENGINE",
    title: "محرك الحوادث",
    status: "READY",
    text: "يحوّل النشاط الأمني المهم إلى Incident منظم له هوية وحالة وسياق واضح يمكن التحقيق فيه واتخاذ قرار عليه.",
    points: ["Incident ID", "حالة منظمة", "تحقيق قابل للمراجعة"],
  },
  {
    code: "THR",
    short: "THREAT CORE",
    title: "محرك التهديدات",
    status: "ARMED",
    text: "يربط الحوادث المتعلقة ببعضها عندما تتحقق شروط الارتباط حتى تشوف الهجوم كعملية واحدة بدل تنبيهات منفصلة.",
    points: ["Threat Correlation", "عدة أهداف", "صورة أمنية أوسع"],
  },
  {
    code: "REC",
    short: "RECOVERY",
    title: "الاسترجاع الآمن",
    status: "READY",
    text: "يفحص الحالة الحالية أولًا ثم يجهز استرجاعًا مدعومًا مع تحقق قبل التنفيذ وبعده لتقليل خطر استرجاع حالة خاطئة.",
    points: ["Preflight Checks", "Safe Revert", "Post Verification"],
  },
  {
    code: "TRU",
    short: "TRUSTED ACTIONS",
    title: "الإجراءات الموثوقة",
    status: "READY",
    text: "يميّز عمليات Guardian الداخلية الموثوقة عن النشاط العدائي حتى ما تتحول عملية الاسترجاع نفسها إلى Incident كاذب.",
    points: ["Internal Trust", "منع False Positives", "Recovery Integrity"],
  },
]

const lifecycle = [
  { number: "01", tech: "DETECT", title: "رصد الحدث", text: "Guardian يلتقط النشاط الأمني المدعوم وقت حدوثه." },
  { number: "02", tech: "ATTRIBUTION", title: "تحديد المنفذ", text: "يستخدم سياق Discord Audit Logs لمحاولة ربط الفعل بالحساب المسؤول." },
  { number: "03", tech: "PRESERVE", title: "حفظ الحالة", text: "يحفظ الحالة المدعومة المرتبطة بالحدث قبل ما تضيع تفاصيل مهمة." },
  { number: "04", tech: "EVIDENCE", title: "تأمين الدليل", text: "Black Box ينشئ اللقطة ويربطها بالحادث مع تحقق سلامة SHA-256." },
  { number: "05", tech: "INCIDENT", title: "إنشاء الحادث", text: "يتحول الحدث إلى Incident منظم قابل للتحقيق والمراجعة." },
  { number: "06", tech: "CORRELATE", title: "ربط التهديد", text: "إذا ارتبطت أحداث أخرى بنفس النشاط، Threat Core يعرضها ضمن تهديد واحد." },
  { number: "07", tech: "RECOVER", title: "التحقق والاسترجاع", text: "Guardian يفحص الحالة الحالية ويجهز مسار الاسترجاع المدعوم قبل أي تطبيق." },
]

const guideSteps = [
  {
    number: "01",
    id: "guide-install",
    title: "التثبيت الرسمي",
    text: "ابدأ من زر التثبيت الموجود في نهاية صفحة Guardian، اختر السيرفر المطلوب، وراجع صلاحيات Discord قبل الإكمال.",
  },
  {
    number: "02",
    id: "guide-auto-setup",
    title: "الإعداد التلقائي",
    text: "بعد الإضافة، Auto Setup يجهز البنية الخاصة بـGuardian ويحافظ على مكونات النظام المدعومة تلقائيًا.",
  },
  {
    number: "03",
    id: "guide-panel",
    title: "لوحة Guardian",
    text: "افتح لوحة Guardian لمراجعة حالة الحماية، الحوادث المفتوحة، التهديدات النشطة، وحالة أنظمة الاسترجاع.",
  },
  {
    number: "04",
    id: "guide-investigate",
    title: "التحقيق في الحادث",
    text: "قبل أي قرار، راجع المنفذ والهدف ونوع التغيير ومستوى الخطورة واللقطة المرتبطة بالحادث.",
  },
  {
    number: "05",
    id: "guide-decision",
    title: "الاسترجاع أو اعتماد التغيير",
    text: "إذا كان التغيير ضارًا استخدم الاسترجاع المدعوم. وإذا كان مقصودًا، اعتمد التغيير حتى يتعامل معه Guardian كتغيير موثوق.",
  },
  {
    number: "06",
    id: "guide-threat",
    title: "التعامل مع Threat",
    text: "إذا جمع Threat Core أكثر من Incident، راجع الأهداف كلها وخطة الاسترجاع قبل تأكيد أي عملية متعددة الأهداف.",
  },
  {
    number: "07",
    id: "guide-verify",
    title: "التحقق بعد التنفيذ",
    text: "بعد الاسترجاع، راجع نتيجة التحقق وحالة Incident أو Threat وتأكد أن الحالة النهائية مطابقة لما تتوقعه.",
  },
  {
    number: "08",
    id: "guide-records",
    title: "مراجعة السجل والأدلة",
    text: "استخدم سجل الحوادث واللقطات المدعومة لفهم ما حدث قبل اتخاذ إجراء إداري إضافي داخل السيرفر.",
  },
]

const commandGroups = ["الكل", "تحكم", "تحليل", "استرجاع", "أدوات"]

const commands = [
  { command: "/guardian", group: "تحكم", title: "مركز Guardian", text: "الدخول إلى أوامر Guardian الأساسية ومسارات الإدارة المتاحة لك." },
  { command: "/panel", group: "تحكم", title: "لوحة التحكم", text: "عرض لوحة Guardian الرئيسية ومؤشرات الحماية والحوادث والتهديدات." },
  { command: "/role", group: "تحليل", title: "تحليل الرتب", text: "فحص معلومات الرتب والصلاحيات ضمن الأدوات الأمنية المتاحة في النظام." },
  { command: "/simulate", group: "تحليل", title: "محاكاة أمنية", text: "محاكاة أثر تغيير مدعوم بدون تنفيذ التغيير الحقيقي على السيرفر." },
  { command: "/optimize", group: "تحليل", title: "تحليل وتحسين", text: "عرض تحليل مساعد لاتخاذ قرار أمني أفضل قبل تعديل البنية أو الصلاحيات." },
  { command: "/snapshot", group: "أدوات", title: "لقطة حالة", text: "إنشاء أو مراجعة لقطة مدعومة للحالة بحسب مسار الأمر والصلاحيات المتاحة." },
  { command: "/safe-apply", group: "استرجاع", title: "تطبيق آمن", text: "تنفيذ تغيير مدعوم عبر بوابة أمان وفحوصات قبل التطبيق بدل التنفيذ المباشر." },
  { command: "/undo", group: "استرجاع", title: "تراجع موثوق", text: "التراجع عن عملية Guardian مدعومة عندما تتوفر معاملة قابلة للرجوع." },
  { command: "/time-machine", group: "استرجاع", title: "العودة لحالة محفوظة", text: "التعامل مع حالات محفوظة مدعومة ضمن نظام الاسترجاع والتحقق." },
  { command: "/duty", group: "أدوات", title: "تحليل الوظيفة", text: "أداة مساعدة لتحليل طبيعة الرتبة أو الاستخدام المتوقع ضمن سياق السيرفر." },
]

const installChecklist = [
  { code: "01", title: "اختر السيرفر الصحيح", text: "تأكد أنك تثبت Guardian في السيرفر المقصود وأن حسابك يملك الصلاحية المطلوبة لإضافة التطبيق." },
  { code: "02", title: "راجع الصلاحيات", text: "Discord يعرض الصلاحيات المطلوبة قبل الإكمال. راجعها ثم أكمل فقط إذا كنت موافقًا على نطاق عمل النظام." },
  { code: "03", title: "اترك Auto Setup يكتمل", text: "بعد الإضافة، لا تبدأ الاختبارات مباشرة. انتظر حتى يجهز Guardian مكونات التحكم المدعومة ويظهر أنه Ready." },
  { code: "04", title: "اختبر بشكل آمن", text: "ابدأ باختبار مدروس على رتبة أو قناة تجريبية قبل الاعتماد على النظام داخل بيئة تشغيل حقيقية." },
]

function GuardianSystemMap() {
  const [activeCode, setActiveCode] = useState("LIVE")
  const active = systemModules.find((item) => item.code === activeCode) ?? systemModules[0]

  return (
    <section className="guardian-system-map" id="guardian-map" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">INTERACTIVE SYSTEM MAP / 001 CORE</p>
          <h3 dir="rtl">شوف كيف أجزاء Guardian مرتبطة ببعض.</h3>
        </div>
        <p dir="rtl">
          مرر الماوس أو اضغط على أي وحدة. الخريطة تشرح وظيفة كل جزء بدون ما تحتاج تقرأ النظام كامل دفعة وحدة.
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

function GuardianLifecycle() {
  return (
    <section className="guardian-lifecycle" id="guardian-flow" data-reveal>
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

function GuardianCommands() {
  const [activeGroup, setActiveGroup] = useState("الكل")
  const filtered = useMemo(
    () => activeGroup === "الكل" ? commands : commands.filter((item) => item.group === activeGroup),
    [activeGroup],
  )

  return (
    <section className="guardian-commands" id="guardian-commands" data-reveal>
      <div className="guardian-subheading guardian-subheading-split">
        <div>
          <p className="eyebrow">COMMAND CENTER / USER REFERENCE</p>
          <h3 dir="rtl">مرجع أوامر Guardian.</h3>
        </div>
        <p dir="rtl">
          مرجع سريع لأسماء الأوامر الأساسية. ظهور الأمر أو إمكانية استخدامه يعتمد على الصلاحيات والمسار المتاح داخل السيرفر.
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

function GuardianInstallChecklist({ inviteUrl }) {
  return (
    <section className="guardian-install-zone" id="guardian-install" data-reveal>
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

function GuardianExperience({ inviteUrl }) {
  return (
    <section className="guardian-product-hub guardian-experience" id="guardian-product">
      <div className="product-hub-head" data-reveal>
        <div>
          <p className="eyebrow">001 GUARDIAN / OFFICIAL PRODUCT CENTER</p>
          <h2>001 GUARDIAN <span>Product Center.</span></h2>
        </div>
        <div className="product-hub-intro" dir="rtl">
          <strong>كل شيء تحتاجه قبل وبعد التثبيت</strong>
          <p>
            هنا تلقى نبذة النظام، الخريطة التفاعلية، قدرات الحماية، دورة الحادث، دليل الاستخدام، مرجع الأوامر، والأسئلة المهمة قبل التثبيت.
          </p>
        </div>
      </div>

      <nav className="guardian-product-nav guardian-sticky-nav" data-reveal aria-label="Guardian product navigation">
        <a href="#guardian-product"><span>01</span><strong>نبذة</strong></a>
        <a href="#guardian-map"><span>02</span><strong>خريطة النظام</strong></a>
        <a href="#guardian-directory"><span>03</span><strong>القدرات</strong></a>
        <a href="#guardian-flow"><span>04</span><strong>دورة الحادث</strong></a>
        <a href="#guardian-guide"><span>05</span><strong>الدليل</strong></a>
        <a href="#guardian-commands"><span>06</span><strong>الأوامر</strong></a>
        <a href="#support"><span>07</span><strong>FAQ</strong></a>
        <a href="#guardian-install"><span>08</span><strong>التثبيت</strong></a>
      </nav>

      <div className="guardian-product-overview guardian-overview-v2" data-reveal>
        <div className="guardian-overview-copy" dir="rtl">
          <span className="overview-live"><i /> المنتج 001 • متاح الآن</span>
          <h3>الحماية ما توقف عند التنبيه.</h3>
          <p>
            Guardian مصمم عشان يعطيك سياق الحادث كامل: وش صار، مين نفذ التغيير، وش الحالة المحفوظة، وين الدليل، وهل فيه استرجاع مدعوم وآمن للحالة المتأثرة.
          </p>
          <div className="guardian-overview-actions">
            <a className="primary-button" data-magnetic href="#guardian-map">
              استكشف النظام <span>↓</span>
            </a>
            <a className="secondary-button" data-magnetic href="#guardian-guide">
              افتح دليل الاستخدام <span>↓</span>
            </a>
          </div>
        </div>

        <div className="guardian-quick-facts">
          {quickFacts.map((item) => (
            <div key={item.label}>
              <span>{item.technical}</span>
              <strong dir="rtl">{item.value}</strong>
              <small dir="rtl">{item.label}</small>
            </div>
          ))}
        </div>
      </div>

      <GuardianSystemMap />

      <section className="guardian-directory" id="guardian-directory" data-reveal>
        <div className="guardian-subheading guardian-subheading-split">
          <div>
            <p className="eyebrow">SYSTEM DIRECTORY / COMPLETE OVERVIEW</p>
            <h3 dir="rtl">قائمة قدرات Guardian الحالية.</h3>
          </div>
          <p dir="rtl">
            كل بطاقة تشرح جزءًا من البنية الحالية بشكل مختصر، بينما الخريطة فوق توضح كيف تتكامل الوحدات داخل النظام.
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

      <GuardianLifecycle />

      <section className="guardian-guide guardian-guide-v2" id="guardian-guide" data-reveal>
        <div className="guardian-subheading guardian-subheading-split">
          <div>
            <p className="eyebrow">OFFICIAL USER GUIDE / 001</p>
            <h3 dir="rtl">دليل الاستخدام — من التثبيت إلى التحقق.</h3>
          </div>
          <p dir="rtl">
            دليل واضح للمستخدم الجديد. امشِ بالترتيب، وبعدها ارجع لأي خطوة تحتاجها وقت التشغيل.
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

      <GuardianCommands />
      <GuardianInstallChecklist inviteUrl={inviteUrl} />
    </section>
  )
}

export default GuardianExperience
