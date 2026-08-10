PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS content_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key TEXT NOT NULL UNIQUE,
  title_ar TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  eyebrow TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  accent TEXT NOT NULL DEFAULT '',
  body_ar TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS documentation_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  summary_ar TEXT NOT NULL DEFAULT '',
  content_ar TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_by TEXT,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(product_id, slug),
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_docs_product_status_sort ON documentation_entries(product_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS faq_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  question_ar TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  question_en TEXT NOT NULL DEFAULT '',
  answer_en TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_by TEXT,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_faq_product_status_sort ON faq_entries(product_id, status, sort_order, id);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ar TEXT NOT NULL,
  body_ar TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL DEFAULT 'INFO',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  starts_at TEXT,
  ends_at TEXT,
  created_by TEXT,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_announcements_status_dates ON announcements(status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS media_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'IMAGE',
  url TEXT NOT NULL,
  alt_ar TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS content_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_versions_entity_created ON content_versions(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_platform_role ON users(platform_role, last_seen_at DESC);

INSERT OR IGNORE INTO content_pages (
  page_key, title_ar, title_en, eyebrow, headline, accent, body_ar, body_en, status
) VALUES (
  'home',
  'منصة رئيسية للبوتات والأنظمة الحصرية.',
  'HAMOOD LABS Product Platform',
  'HAMOOD LABS / PRODUCT PLATFORM',
  'POWERING WHAT',
  'HAPPENS NEXT.',
  'تجمع HAMOOD LABS المنتجات الحالية والقادمة في مكان واحد. كل منتج له صفحة مستقلة ومتطلبات واضحة وتوثيق وتثبيت رسمي عندما يكون جاهزًا.',
  'One platform for current and upcoming HAMOOD LABS products.',
  'PUBLISHED'
);

INSERT OR IGNORE INTO platform_settings (key, value_json) VALUES
  ('appearance', '{"accent":"blue","compact":false,"showNetworkStatus":true}'),
  ('seo', '{"title":"HAMOOD LABS","description":"Official HAMOOD LABS platform for Discord bots and security systems.","keywords":"HAMOOD LABS, Discord Bots, 001 Guardian"}'),
  ('maintenance', '{"enabled":false,"message":"المنصة تحت الصيانة حاليًا. نرجع قريب.","ownerBypass":true}');

INSERT OR IGNORE INTO content_pages (page_key,title_ar,title_en,eyebrow,headline,accent,body_ar,body_en,status) VALUES
('products','كل البوتات والأنظمة في مكان واحد.','Products Directory','HAMOOD LABS / PRODUCT DIRECTORY','ALL SYSTEMS.','ONE ECOSYSTEM.','استعرض المنتجات المتاحة والقادمة. أي منتج جديد يتم نشره من لوحة الإدارة يظهر هنا تلقائيًا مع صفحته ومتطلباته وزر التثبيت إذا كان جاهزًا.','Browse every HAMOOD LABS product in one ecosystem.','PUBLISHED'),
('guardian','منتج الحماية الأول داخل HAMOOD LABS.','001 Guardian Product Center','001 GUARDIAN / OFFICIAL PRODUCT CENTER','001 GUARDIAN','SECURITY + RECOVERY.','تعرف على النظام وقدراته ومتطلباته وروابط التثبيت والتوثيق من صفحة واحدة مرتبة.','Official 001 Guardian product center.','PUBLISHED'),
('suggestions','أرسل اقتراحك وتابع حالته.','Suggestion Center','HAMOOD LABS / SUGGESTION CENTER','YOUR IDEA.','TRACKED.','سجل دخولك بديسكورد، اكتب الفكرة، وبعد الإرسال تحصل على رقم متابعة وتقدر الإدارة تحدث حالتها بوضوح.','Submit ideas and track their review status.','PUBLISHED');
