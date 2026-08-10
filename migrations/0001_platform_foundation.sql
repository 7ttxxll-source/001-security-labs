PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Discord Bot',
  product_type TEXT NOT NULL DEFAULT 'discord_bot',
  version TEXT NOT NULL DEFAULT 'V1.0.0',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  short_description TEXT NOT NULL DEFAULT '',
  arabic_description TEXT NOT NULL DEFAULT '',
  application_id TEXT,
  install_enabled INTEGER NOT NULL DEFAULT 0,
  install_requires_login INTEGER NOT NULL DEFAULT 1,
  install_mode TEXT NOT NULL DEFAULT 'DISCORD_DEFAULT',
  install_scopes_json TEXT NOT NULL DEFAULT '["bot","applications.commands"]',
  install_permissions TEXT NOT NULL DEFAULT '',
  requirements_json TEXT NOT NULL DEFAULT '[]',
  permission_notes_json TEXT NOT NULL DEFAULT '[]',
  docs_url TEXT,
  faq_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_by TEXT,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  published_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_status_sort ON products(status, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured, status);

CREATE TABLE IF NOT EXISTS suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_code TEXT UNIQUE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  global_name TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  use_case TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  admin_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_suggestions_status_created ON suggestions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON suggestions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS users (
  discord_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  global_name TEXT,
  avatar_url TEXT,
  platform_role TEXT NOT NULL DEFAULT 'USER',
  first_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

INSERT INTO products (
  code, slug, name, display_name, category, product_type, version, status,
  short_description, arabic_description, application_id,
  install_enabled, install_requires_login, install_mode,
  install_scopes_json, install_permissions,
  requirements_json, permission_notes_json,
  docs_url, faq_url, featured, sort_order, published_at
)
SELECT
  '001',
  'guardian',
  'GUARDIAN',
  '001 GUARDIAN',
  'Security & Protection',
  'discord_bot',
  'V1.0.0',
  'PUBLISHED',
  'Advanced Discord security with live monitoring, forensic evidence, incident intelligence, threat correlation and supported recovery.',
  'نظام حماية متقدم لديسكورد يراقب الأحداث الحساسة، ينظم الحوادث، يحفظ الأدلة المدعومة ويجهز الاسترجاع الآمن.',
  '1535228662641725520',
  1,
  1,
  'DISCORD_DEFAULT',
  '["bot","applications.commands"]',
  '',
  '["لازم تكون عندك صلاحية إدارة السيرفر لإضافة التطبيق.","ضع رتبة 001 GUARDIAN فوق الرتب التي يحتاج النظام إدارتها.","راجع صلاحيات التثبيت في Discord قبل الموافقة وتأكد أنها مناسبة لسيرفرك.","بعد الإضافة اتبع دليل الإعداد الرسمي لإكمال الحماية بشكل صحيح."]',
  '[{"name":"View Audit Log","why":"يستخدم في إسناد بعض التغييرات الحساسة للمنفذ الصحيح عند توفر سجل التدقيق."},{"name":"Manage Roles / Channels / Webhooks","why":"تحتاجها وحدات الحماية والاسترجاع عند تفعيل الميزات المرتبطة بهذه الموارد. الصلاحيات الفعلية تعتمد على إعداد تثبيت التطبيق في Discord."}]',
  '/products/guardian/docs/',
  '/products/guardian/faq/',
  1,
  1,
  (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'guardian');


INSERT INTO products (
  code, slug, name, display_name, category, product_type, version, status,
  short_description, arabic_description,
  install_enabled, install_requires_login, install_mode,
  install_scopes_json, install_permissions,
  requirements_json, permission_notes_json,
  featured, sort_order
)
SELECT
  '002', 'classified-002', 'CLASSIFIED', '002 CLASSIFIED', 'Exclusive Bot', 'discord_bot',
  'CLASSIFIED', 'COMING_SOON',
  'The next exclusive HAMOOD LABS system is currently under development.',
  'بوت حصري جديد قيد التطوير. الاسم والهوية والتفاصيل الرسمية تنكشف وقت ما يكون المنتج جاهزًا.',
  0, 1, 'DISCORD_DEFAULT', '["bot","applications.commands"]', '', '[]', '[]', 0, 20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'classified-002');

INSERT INTO products (
  code, slug, name, display_name, category, product_type, version, status,
  short_description, arabic_description,
  install_enabled, install_requires_login, install_mode,
  install_scopes_json, install_permissions,
  requirements_json, permission_notes_json,
  featured, sort_order
)
SELECT
  '003', 'future-slot-003', 'FUTURE SLOT', '003 RESERVED', 'Future System', 'other',
  'RESERVED', 'COMING_SOON',
  'Reserved architecture for the next product added to the HAMOOD LABS ecosystem.',
  'مساحة منتج مجهزة داخل المنصة لإصدار قادم بدون إعادة بناء الموقع أو تغيير هوية HAMOOD LABS.',
  0, 1, 'DISCORD_DEFAULT', '[]', '', '[]', '[]', 0, 30
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'future-slot-003');

INSERT OR IGNORE INTO platform_settings (key, value_json)
VALUES ('platform', '{"name":"HAMOOD LABS","language":"ar","installationPolicy":"LOGIN_REQUIRED_BY_DEFAULT"}');
