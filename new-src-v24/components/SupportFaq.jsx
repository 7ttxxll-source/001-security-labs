const faqItems = [
  {
    category: "النظام",
    question: "وش هو 001 Guardian بالضبط؟",
    answer:
      "001 Guardian نظام حماية واستجابة لديسكورد. يراقب الأحداث الأمنية الحساسة، يحاول تحديد المنفذ عبر Audit Logs، يحفظ الأدلة المدعومة، ينشئ الحوادث، يربط النشاط المترابط كتهديدات، ويجهز الاسترجاع المدعوم للعمليات التي يسمح بها النظام وDiscord.",
  },
  {
    category: "الإعداد",
    question: "وش يصير بعد ما أضيف Guardian للسيرفر؟",
    answer:
      "في التثبيت القياسي ومع تفعيل Auto Setup، يبدأ Guardian بتجهيز البنية الخاصة فيه ثم يعرض حالته داخل لوحة التحكم. الأفضل تنتظر لين يكتمل الإعداد ويظهر النظام Ready قبل تبدأ الاختبارات.",
  },
  {
    category: "المراقبة",
    question: "وش الأشياء اللي يراقبها Guardian حاليًا؟",
    answer:
      "يراقب التغييرات الحساسة في صلاحيات الرتب، نشاط القنوات المدعوم، وإنشاء وتعديل وحذف Webhooks، ثم يمرر الأحداث المهمة إلى منظومة الحوادث والأدلة والتهديدات.",
  },
  {
    category: "الخصوصية",
    question: "هل Guardian يخزن Webhook Token أو رابط الـWebhook؟",
    answer:
      "لا. Guardian يستبعد Webhook Tokens وروابط Webhook من تخزين Black Box الجنائي حتى لا تتحول بيانات حساسة إلى جزء من سجل الأدلة.",
  },
  {
    category: "الأدلة",
    question: "وش هو Black Box وليش مهم؟",
    answer:
      "Black Box ينشئ لقطات للحالة المدعومة حول الحدث الأمني ويربطها بالحوادث. اللقطات تستخدم تحقق SHA-256 للمساعدة في التحقق من سلامة الدليل قبل الاعتماد عليه في التحقيق أو الاسترجاع.",
  },
  {
    category: "الاسترجاع",
    question: "هل Guardian يقدر يرجع كل شيء بعد أي هجوم؟",
    answer:
      "لا، وما راح ندعي كذا. Discord يفرض حدودًا على الأشياء القابلة للاسترجاع. Guardian يسترجع فقط الحالات والعمليات التي يدعمها النظام وDiscord API وبعد فحوصات أمان للحالة الحالية.",
  },
  {
    category: "الحوادث",
    question: "وش الفرق بين Incident وThreat؟",
    answer:
      "Incident يمثل حادثًا أمنيًا منظمًا. Threat Core يربط الحوادث المتعلقة ببعضها عندما تتوفر شروط الارتباط، عشان تشوف النشاط كسياق واحد بدل مجموعة تنبيهات منفصلة.",
  },
  {
    category: "التحقيق",
    question: "وش أراجع قبل ما أضغط استرجاع؟",
    answer:
      "راجع المنفذ والهدف ونوع التغيير ومستوى الخطورة وحالة Black Box، ثم اقرأ بوابة الأمان وخطة الاسترجاع. إذا كانت الحالة الحالية تغيرت عن الحالة المتوقعة، Guardian قد يوقف العملية بدل تنفيذ استرجاع غير آمن.",
  },
  {
    category: "الثقة",
    question: "إذا كان التغيير مقصود، وش أسوي؟",
    answer:
      "من مسار التحقيق تقدر تعتمد التغيير الموثوق بدل استرجاعه. Guardian يستخدم Trusted Actions لتمييز عملياته الداخلية الموثوقة وتقليل الحوادث الكاذبة أثناء الاسترجاع.",
  },
  {
    category: "الصلاحيات",
    question: "هل Guardian يحتاج Administrator؟",
    answer:
      "التثبيت القياسي في V1 يستخدم Administrator حتى يقدر Guardian ينفذ المراقبة والإعداد والتحقيق والاسترجاع المدعوم بدون ما تتعطل وظائفه بسبب نقص الصلاحيات.",
  },
  {
    category: "الاستخدام",
    question: "أنا جديد على Guardian، من وين أبدأ؟",
    answer:
      "ابدأ من Product Center، بعدها افتح خريطة النظام عشان تفهم الوحدات، ثم امشِ على دليل الاستخدام بالترتيب. بعد ذلك راجع مرجع الأوامر والأسئلة المهمة قبل التثبيت.",
  },
  {
    category: "التوفر",
    question: "هل 001 Guardian متاح الآن؟",
    answer:
      "نعم. 001 Guardian V1.0.0 هو المنتج الجاهز حاليًا داخل HAMOOD LABS. تقدر تراجع صفحة المنتج ودليل الاستخدام ومرجع الأوامر في الموقع ثم تنتقل لرابط التثبيت الرسمي.",
  },
]

function SupportFaq() {
  return (
    <section className="support-faq" id="support">
      <div className="support-intro">
        <div>
          <p className="eyebrow">001 GUARDIAN / ARABIC FAQ</p>

          <h2 dir="rtl">
            أهم الأسئلة
            <span> قبل التثبيت.</span>
          </h2>
        </div>

        <div className="support-copy" dir="rtl">
          <p>افهم النظام قبل ما تعطيه صلاحيات داخل سيرفرك.</p>
          <span>
            هنا أهم الأسئلة المتعلقة بالحماية، الخصوصية، الصلاحيات، الأدلة،
            الاسترجاع وطريقة استخدام Guardian بشكل واضح قبل التثبيت.
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

              <span className="faq-question-wrap">
                <small dir="rtl">{item.category}</small>
                <strong dir="rtl">{item.question}</strong>
              </span>

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
          <p className="eyebrow">HAMOOD LABS / DOCUMENTATION</p>
          <h3>كل ما تحتاجه لبدء Guardian موجود داخل Product Center.</h3>
          <p>
            ارجع لدليل الاستخدام ومرجع الأوامر وخريطة النظام في أي وقت. ومع كل
            إصدار جديد نقدر نوسع التوثيق داخل نفس صفحة المنتج بدون ما نغير هوية المنصة.
          </p>
          <a className="support-guide-link" href="#guardian-guide">
            افتح دليل الاستخدام <span>←</span>
          </a>
        </div>

        <div className="support-status">
          <span>DOCUMENTATION</span>
          <strong>LIVE / 001</strong>
          <small>ARABIC GUIDE READY</small>
        </div>
      </div>
    </section>
  )
}

export default SupportFaq
