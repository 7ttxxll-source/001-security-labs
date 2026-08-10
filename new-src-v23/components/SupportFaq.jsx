const faqItems = [
  {
    question: "وش هو 001 Guardian بالضبط؟",
    answer:
      "001 Guardian نظام حماية واستجابة لديسكورد. يراقب الأحداث الأمنية الحساسة، يحاول تحديد المنفذ عبر Audit Logs، يحفظ الأدلة المدعومة، ينشئ الحوادث، يربط النشاط المترابط كتهديدات ويجهز الاسترجاع الآمن للعمليات التي يدعمها Discord.",
  },
  {
    question: "هل Guardian يجهز نفسه تلقائيًا؟",
    answer:
      "نعم. في التثبيت القياسي ومع تفعيل Auto Setup، يجهز Guardian البنية الخاصة فيه ويحافظ عليها تلقائيًا بدل ما تحتاج تعيد الإعداد يدويًا كل مرة.",
  },
  {
    question: "وش الأشياء اللي يراقبها Guardian حاليًا؟",
    answer:
      "يراقب التغييرات الحساسة في صلاحيات الرتب، نشاط القنوات المدعوم، وإنشاء وتعديل وحذف Webhooks، ثم يمرر الأحداث المهمة إلى منظومة الحوادث والأدلة والتهديدات.",
  },
  {
    question: "هل Guardian يخزن Webhook Token أو رابط الـWebhook؟",
    answer:
      "لا. Guardian يستبعد Webhook Tokens وروابط Webhook من تخزين Black Box الجنائي حتى لا تتحول بيانات حساسة إلى جزء من سجل الأدلة.",
  },
  {
    question: "وش هو Black Box وليش مهم؟",
    answer:
      "Black Box يحفظ لقطات للحالة المدعومة حول الحدث الأمني ويربطها بالحوادث. اللقطات تستخدم تحقق SHA-256 للمساعدة في التحقق من سلامة الدليل قبل الاعتماد عليه في التحقيق أو الاسترجاع.",
  },
  {
    question: "هل Guardian يقدر يرجع كل شيء بعد أي هجوم؟",
    answer:
      "لا، وما راح ندعي كذا. Discord يفرض حدودًا على الأشياء القابلة للاسترجاع. Guardian يسترجع فقط الحالات والعمليات التي يدعمها النظام وDiscord API وبعد فحوصات أمان للحالة الحالية.",
  },
  {
    question: "وش الفرق بين Incident وThreat؟",
    answer:
      "Incident يمثل حادثًا أمنيًا منظمًا. Threat Core يربط الحوادث المتعلقة ببعضها عندما تتوفر شروط الارتباط، عشان تشوف النشاط كسياق واحد بدل مجموعة تنبيهات منفصلة.",
  },
  {
    question: "إذا كان التغيير مقصود، وش أسوي؟",
    answer:
      "من مسار التحقيق تقدر تعتمد التغيير الموثوق بدل استرجاعه. Guardian يستخدم Trusted Actions لتمييز عملياته الداخلية الموثوقة وتقليل الحوادث الكاذبة أثناء الاسترجاع.",
  },
  {
    question: "هل Guardian يحتاج Administrator؟",
    answer:
      "التثبيت القياسي في V1 يستخدم Administrator حتى يقدر Guardian ينفذ المراقبة والإعداد والتحقيق والاسترجاع المدعوم بدون ما تتعطل وظائفه بسبب نقص الصلاحيات.",
  },
  {
    question: "هل 001 Guardian متاح الآن؟",
    answer:
      "نعم، 001 Guardian V1.0.0 هو المنتج الجاهز حاليًا داخل HAMOOD LABS. تقدر تراجع صفحة المنتج ودليل الاستخدام في الموقع ثم تنتقل لرابط التثبيت الرسمي.",
  },
]

function SupportFaq() {
  return (
    <section className="support-faq" id="support">
      <div className="support-intro">
        <div>
          <p className="eyebrow">001 GUARDIAN / FAQ</p>

          <h2 dir="rtl">
            أسئلة مهمة
            <span> قبل التثبيت.</span>
          </h2>
        </div>

        <div className="support-copy" dir="rtl">
          <p>افهم النظام قبل ما تعطيه صلاحيات داخل سيرفرك.</p>
          <span>
            جمعنا هنا أهم الأسئلة المتعلقة بالحماية، الخصوصية، الصلاحيات،
            الاسترجاع وطريقة عمل Guardian عشان تكون الصورة واضحة قبل التثبيت.
          </span>
        </div>
      </div>

      <div className="faq-grid">
        {faqItems.map((item, index) => (
          <details className="faq-item" key={item.question}>
            <summary>
              <span className="faq-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong dir="rtl">{item.question}</strong>

              <span className="faq-toggle" aria-hidden="true">+</span>
            </summary>

            <div className="faq-answer">
              <p dir="rtl">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="support-panel">
        <div dir="rtl">
          <p className="eyebrow">HAMOOD LABS / 001 SUPPORT</p>
          <h3>تحتاج مساعدة مع Guardian؟</h3>
          <p>
            ابدأ بدليل الاستخدام الموجود فوق. قسم الدعم الرسمي يتوسع مع المنصة،
            وبيكون مخصص لمساعدة مستخدمي منتجات HAMOOD LABS الحالية والقادمة.
          </p>
        </div>

        <div className="support-status">
          <span>SUPPORT NETWORK</span>
          <strong>COMING SOON</strong>
        </div>
      </div>
    </section>
  )
}

export default SupportFaq
