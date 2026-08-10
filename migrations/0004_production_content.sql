PRAGMA foreign_keys = ON;

-- =========================================================
-- HAMOOD LABS
-- V4.5 Production Content Seed
-- =========================================================

-- ---------------------------------------------------------
-- 001 GUARDIAN Documentation
-- ---------------------------------------------------------

INSERT INTO documentation_entries (
    product_id,
    slug,
    title_ar,
    title_en,
    summary_ar,
    content_ar,
    content_en,
    status,
    sort_order,
    created_by,
    updated_by
)
SELECT
    p.id,
    'getting-started',
    'البدء مع GUARDIAN 001',
    'Getting Started',
    'ابدأ إعداد GUARDIAN 001 داخل سيرفرك خطوة بخطوة، من إضافة البوت إلى إكمال الإعداد الأساسي وتشغيل أنظمة الحماية.',
    'مرحباً بك في دليل البدء مع GUARDIAN 001.

قبل البدء:
- تأكد أن البوت تمت إضافته إلى السيرفر.
- تأكد أن رتبة GUARDIAN 001 أعلى من الرتب التي يحتاج النظام إلى إدارتها.
- تأكد من منح البوت الصلاحيات المطلوبة أثناء التثبيت.
- لا تخفض رتبة البوت أو تغير ترتيبها بعد الإعداد.

الخطوات الأساسية:
1. أضف GUARDIAN 001 إلى السيرفر من صفحة المنتج الرسمية.
2. وافق على الصلاحيات المطلوبة في Discord.
3. تأكد من ترتيب رتبة البوت داخل إعدادات السيرفر.
4. شغّل الإعداد الأساسي الخاص بالنظام.
5. راجع حالة أنظمة الحماية وتأكد أنها تعمل.
6. جرّب لوحة GUARDIAN وتأكد أن جميع الأقسام المطلوبة متاحة.

بعد إكمال الإعداد، يبدأ GUARDIAN 001 بمراقبة الأحداث الحساسة المدعومة وتسجيل الحوادث والأدلة وفق الأنظمة المفعلة.

مهم:
لا تعتمد على أي نظام حماية قبل التأكد من أن الإعداد اكتمل وأن البوت لديه الصلاحيات والترتيب المناسب داخل السيرفر.',
    'Basic setup:

1. Add 001 GUARDIAN from the official product page.
2. Approve the required Discord permissions.
3. Verify the bot role position.
4. Complete the initial GUARDIAN setup.
5. Check that the required protection systems are active.
6. Open the GUARDIAN interface and verify the available protection modules.

After setup is complete, 001 GUARDIAN can begin monitoring supported sensitive events and recording incident evidence according to the enabled protection systems.',
    'PUBLISHED',
    1,
    'SYSTEM_SEED',
    'SYSTEM_SEED'
FROM products p
WHERE p.slug = 'guardian'
AND NOT EXISTS (
    SELECT 1
    FROM documentation_entries d
    WHERE d.product_id = p.id
      AND d.slug = 'getting-started'
);


-- ---------------------------------------------------------
-- 001 GUARDIAN FAQ
-- ---------------------------------------------------------

INSERT INTO faq_entries (
    product_id,
    question_ar,
    answer_ar,
    question_en,
    answer_en,
    status,
    sort_order,
    created_by,
    updated_by
)
SELECT
    p.id,
    'هل يحتاج GUARDIAN 001 إلى صلاحية Administrator؟',
    'لا يشترط استخدام صلاحية Administrator بشكل عام. يجب منح GUARDIAN 001 الصلاحيات التي تحتاجها أنظمة الحماية المفعلة، مثل View Audit Log وManage Roles وManage Channels وManage Webhooks، مع التأكد من أن رتبة البوت في المكان المناسب داخل السيرفر.',
    'Does 001 GUARDIAN require Administrator permission?',
    'Administrator permission is not generally required. 001 GUARDIAN should only receive the permissions required by the enabled protection systems, such as View Audit Log, Manage Roles, Manage Channels and Manage Webhooks, while keeping the bot role in the correct server position.',
    'PUBLISHED',
    1,
    'SYSTEM_SEED',
    'SYSTEM_SEED'
FROM products p
WHERE p.slug = 'guardian'
AND NOT EXISTS (
    SELECT 1
    FROM faq_entries f
    WHERE f.product_id = p.id
      AND f.question_ar = 'هل يحتاج GUARDIAN 001 إلى صلاحية Administrator؟'
);


-- ---------------------------------------------------------
-- Platform Announcement
-- ---------------------------------------------------------

INSERT INTO announcements (
    title_ar,
    body_ar,
    tone,
    status,
    starts_at,
    ends_at,
    created_by,
    updated_by
)
SELECT
    '001 GUARDIAN متاح الآن',
    'تم إطلاق 001 GUARDIAN رسميًا على HAMOOD LABS. يمكنك الآن مراجعة المتطلبات، قراءة دليل الاستخدام، وإضافة البوت مباشرة إلى Discord.',
    'INFO',
    'PUBLISHED',
    NULL,
    NULL,
    'SYSTEM_SEED',
    'SYSTEM_SEED'
WHERE NOT EXISTS (
    SELECT 1
    FROM announcements
    WHERE title_ar = '001 GUARDIAN متاح الآن'
);