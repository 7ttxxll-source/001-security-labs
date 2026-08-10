export const quickFacts = [
  { label: "الحالة", value: "متاح الآن", technical: "ACTIVE" },
  { label: "الإصدار", value: "V1.0.0", technical: "CURRENT" },
  { label: "النوع", value: "حماية واسترجاع", technical: "SECURITY" },
  { label: "الإعداد", value: "تلقائي", technical: "AUTO SETUP" },
]

export const systemModules = [
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

export const lifecycle = [
  { number: "01", tech: "DETECT", title: "رصد الحدث", text: "Guardian يلتقط النشاط الأمني المدعوم وقت حدوثه." },
  { number: "02", tech: "ATTRIBUTION", title: "تحديد المنفذ", text: "يستخدم سياق Discord Audit Logs لمحاولة ربط الفعل بالحساب المسؤول." },
  { number: "03", tech: "PRESERVE", title: "حفظ الحالة", text: "يحفظ الحالة المدعومة المرتبطة بالحدث قبل ما تضيع تفاصيل مهمة." },
  { number: "04", tech: "EVIDENCE", title: "تأمين الدليل", text: "Black Box ينشئ اللقطة ويربطها بالحادث مع تحقق سلامة SHA-256." },
  { number: "05", tech: "INCIDENT", title: "إنشاء الحادث", text: "يتحول الحدث إلى Incident منظم قابل للتحقيق والمراجعة." },
  { number: "06", tech: "CORRELATE", title: "ربط التهديد", text: "إذا ارتبطت أحداث أخرى بنفس النشاط، Threat Core يعرضها ضمن تهديد واحد." },
  { number: "07", tech: "RECOVER", title: "التحقق والاسترجاع", text: "Guardian يفحص الحالة الحالية ويجهز مسار الاسترجاع المدعوم قبل أي تطبيق." },
]

export const guideSteps = [
  { number: "01", id: "guide-install", title: "التثبيت الرسمي", text: "ابدأ من زر التثبيت الموجود في صفحة Guardian، اختر السيرفر المطلوب، وراجع صلاحيات Discord قبل الإكمال." },
  { number: "02", id: "guide-auto-setup", title: "الإعداد التلقائي", text: "بعد الإضافة، Auto Setup يجهز البنية الخاصة بـGuardian ويحافظ على مكونات النظام المدعومة تلقائيًا." },
  { number: "03", id: "guide-panel", title: "لوحة Guardian", text: "افتح لوحة Guardian لمراجعة حالة الحماية، الحوادث المفتوحة، التهديدات النشطة، وحالة أنظمة الاسترجاع." },
  { number: "04", id: "guide-investigate", title: "التحقيق في الحادث", text: "قبل أي قرار، راجع المنفذ والهدف ونوع التغيير ومستوى الخطورة واللقطة المرتبطة بالحادث." },
  { number: "05", id: "guide-decision", title: "الاسترجاع أو اعتماد التغيير", text: "إذا كان التغيير ضارًا استخدم الاسترجاع المدعوم. وإذا كان مقصودًا، اعتمد التغيير حتى يتعامل معه Guardian كتغيير موثوق." },
  { number: "06", id: "guide-threat", title: "التعامل مع Threat", text: "إذا جمع Threat Core أكثر من Incident، راجع الأهداف كلها وخطة الاسترجاع قبل تأكيد أي عملية متعددة الأهداف." },
  { number: "07", id: "guide-verify", title: "التحقق بعد التنفيذ", text: "بعد الاسترجاع، راجع نتيجة التحقق وحالة Incident أو Threat وتأكد أن الحالة النهائية مطابقة لما تتوقعه." },
  { number: "08", id: "guide-records", title: "مراجعة السجل والأدلة", text: "استخدم سجل الحوادث واللقطات المدعومة لفهم ما حدث قبل اتخاذ إجراء إداري إضافي داخل السيرفر." },
]

export const commandGroups = ["الكل", "تحكم", "تحليل", "استرجاع", "أدوات"]

export const commands = [
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

export const installChecklist = [
  { code: "01", title: "اختر السيرفر الصحيح", text: "تأكد أنك تثبت Guardian في السيرفر المقصود وأن حسابك يملك الصلاحية المطلوبة لإضافة التطبيق." },
  { code: "02", title: "راجع الصلاحيات", text: "Discord يعرض الصلاحيات المطلوبة قبل الإكمال. راجعها ثم أكمل فقط إذا كنت موافقًا على نطاق عمل النظام." },
  { code: "03", title: "اترك Auto Setup يكتمل", text: "بعد الإضافة، لا تبدأ الاختبارات مباشرة. انتظر حتى يجهز Guardian مكونات التحكم المدعومة ويظهر أنه Ready." },
  { code: "04", title: "اختبر بشكل آمن", text: "ابدأ باختبار مدروس على رتبة أو قناة تجريبية قبل الاعتماد على النظام داخل بيئة تشغيل حقيقية." },
]
