import { useEffect, useMemo, useState } from "react"
import { adminApi, formatDate } from "./adminApi"

const emptyProduct = {
  code: "",
  slug: "",
  name: "",
  displayName: "",
  category: "Discord Bot",
  productType: "discord_bot",
  version: "V1.0.0",
  status: "DRAFT",
  shortDescription: "",
  arabicDescription: "",
  applicationId: "",
  installEnabled: false,
  installRequiresLogin: true,
  installMode: "DISCORD_DEFAULT",
  installScopes: ["bot", "applications.commands"],
  installPermissions: "",
  requirements: [""],
  permissionNotes: [{ name: "", why: "" }],
  docsUrl: "",
  faqUrl: "",
  featured: false,
  sortOrder: 100,
}

const statusLabels = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
  COMING_SOON: "قريبًا",
  MAINTENANCE: "صيانة",
  ARCHIVED: "مؤرشف",
}

function fromApi(product) {
  return {
    code: product.code || product.id || "",
    slug: product.slug || "",
    name: product.name || "",
    displayName: product.displayName || "",
    category: product.category || "Discord Bot",
    productType: product.productType || "discord_bot",
    version: product.version || "V1.0.0",
    status: product.databaseStatus || (product.status === "ACTIVE" ? "PUBLISHED" : product.status) || "DRAFT",
    shortDescription: product.shortDescription || "",
    arabicDescription: product.arabicDescription || "",
    applicationId: product.applicationId || "",
    installEnabled: Boolean(product.installEnabled),
    installRequiresLogin: product.installRequiresLogin !== false,
    installMode: product.installMode || "DISCORD_DEFAULT",
    installScopes: Array.isArray(product.installScopes) && product.installScopes.length ? product.installScopes : ["bot", "applications.commands"],
    installPermissions: product.installPermissions || "",
    requirements: Array.isArray(product.requirements) && product.requirements.length ? product.requirements : [""],
    permissionNotes: Array.isArray(product.permissionNotes) && product.permissionNotes.length ? product.permissionNotes : [{ name: "", why: "" }],
    docsUrl: product.guideHref || "",
    faqUrl: product.faqHref || "",
    featured: Boolean(product.featured),
    sortOrder: Number(product.sortOrder || 100),
  }
}

function Toggle({ checked, onChange, label, help }) {
  return (
    <label className="admin-toggle-row">
      <button className={`admin-switch ${checked ? "is-on" : ""}`} type="button" onClick={() => onChange(!checked)} aria-pressed={checked}>
        <span />
      </button>
      <span><strong>{label}</strong>{help && <small>{help}</small>}</span>
    </label>
  )
}

function ListEditor({ title, help, items, onChange, placeholder }) {
  const update = (index, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? value : item))
  const remove = (index) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index)
    onChange(next.length ? next : [""])
  }

  return (
    <div className="admin-list-editor">
      <div className="admin-field-heading"><strong>{title}</strong><small>{help}</small></div>
      {items.map((item, index) => (
        <div className="admin-list-row" key={index}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <input value={item} onChange={(event) => update(index, event.target.value)} placeholder={placeholder} />
          <button type="button" onClick={() => remove(index)}>حذف</button>
        </div>
      ))}
      <button className="admin-add-row" type="button" onClick={() => onChange([...items, ""])}>+ إضافة متطلب</button>
    </div>
  )
}

function PermissionEditor({ items, onChange }) {
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))
  const remove = (index) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index)
    onChange(next.length ? next : [{ name: "", why: "" }])
  }

  return (
    <div className="admin-list-editor">
      <div className="admin-field-heading">
        <strong>شرح الصلاحيات للعميل</strong>
        <small>هذه ليست صلاحيات Discord نفسها؛ هذا شرح يظهر للعميل قبل التثبيت حتى يعرف لماذا يحتاج البوت كل صلاحية.</small>
      </div>
      {items.map((item, index) => (
        <div className="admin-permission-row" key={index}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <input value={item.name} onChange={(event) => update(index, "name", event.target.value)} placeholder="مثال: Manage Roles" />
          <textarea value={item.why} onChange={(event) => update(index, "why", event.target.value)} placeholder="اشرح للعميل ليش البوت يحتاج الصلاحية" rows={2} />
          <button type="button" onClick={() => remove(index)}>حذف</button>
        </div>
      ))}
      <button className="admin-add-row" type="button" onClick={() => onChange([...items, { name: "", why: "" }])}>+ إضافة صلاحية وشرحها</button>
    </div>
  )
}

export default function ProductManager({ onDataChanged }) {
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [filter, setFilter] = useState("ALL")

  const selected = products.find((item) => item.databaseId === selectedId) || null

  const load = async (keepSelection = true) => {
    setLoading(true)
    try {
      const data = await adminApi("/api/admin/products")
      setProducts(data.products || [])
      if (keepSelection && selectedId) {
        const refreshed = (data.products || []).find((item) => item.databaseId === selectedId)
        if (refreshed) setForm(fromApi(refreshed))
      }
    } catch (error) {
      setMessage(error.message === "DATABASE_NOT_CONFIGURED" ? "قاعدة البيانات غير مفعلة بعد. طبق migrations ثم أعد المحاولة." : `تعذر تحميل المنتجات: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(false) }, [])

  const visibleProducts = useMemo(() => {
    if (filter === "ALL") return products
    return products.filter((item) => (item.databaseStatus || item.status) === filter || (filter === "PUBLISHED" && item.status === "ACTIVE"))
  }, [products, filter])

  const selectProduct = (product) => {
    setSelectedId(product.databaseId)
    setForm(fromApi(product))
    setMessage("")
  }

  const newProduct = () => {
    setSelectedId(null)
    setForm({ ...emptyProduct, requirements: [""], permissionNotes: [{ name: "", why: "" }], installScopes: ["bot", "applications.commands"] })
    setMessage("")
  }

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const buildPayload = (statusOverride) => ({
    ...form,
    status: statusOverride || form.status,
    requirements: form.requirements.map((item) => item.trim()).filter(Boolean),
    permissionNotes: form.permissionNotes.map((item) => ({ name: item.name.trim(), why: item.why.trim() })).filter((item) => item.name || item.why),
  })

  const save = async (statusOverride = null) => {
    setSaving(true)
    setMessage("")
    try {
      const payload = buildPayload(statusOverride)
      const data = selectedId
        ? await adminApi(`/api/admin/products/${selectedId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await adminApi("/api/admin/products", { method: "POST", body: JSON.stringify(payload) })

      setSelectedId(data.product.databaseId)
      setForm(fromApi(data.product))
      setMessage(statusOverride === "PUBLISHED" ? "تم حفظ المنتج ونشره بنجاح." : "تم حفظ التغييرات بنجاح.")
      await load(true)
      onDataChanged?.()
    } catch (error) {
      const messages = {
        APPLICATION_ID_REQUIRED_FOR_INSTALL: "فعّلت التثبيت لكن Application ID غير موجود.",
        INVALID_APPLICATION_ID: "Application ID غير صحيح. لازم يكون أرقام فقط.",
        PRODUCT_CODE_OR_SLUG_EXISTS: "رقم المنتج أو رابط Slug مستخدم من منتج آخر.",
        DISPLAY_NAME_REQUIRED: "اسم العرض مطلوب.",
        SLUG_REQUIRED: "رابط المنتج Slug مطلوب.",
        PRODUCT_CODE_REQUIRED: "رقم المنتج مطلوب.",
      }
      setMessage(messages[error.message] || `تعذر الحفظ: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const archive = async () => {
    if (!selectedId || !window.confirm("متأكد أنك تبي تأرشف المنتج؟ راح يختفي من الموقع ويتوقف التثبيت.")) return
    setSaving(true)
    try {
      await adminApi(`/api/admin/products/${selectedId}`, { method: "DELETE" })
      setMessage("تمت أرشفة المنتج.")
      newProduct()
      await load(false)
      onDataChanged?.()
    } catch (error) {
      setMessage(`تعذر الأرشفة: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const toggleScope = (scope) => {
    const exists = form.installScopes.includes(scope)
    set("installScopes", exists ? form.installScopes.filter((item) => item !== scope) : [...form.installScopes, scope])
  }

  return (
    <div className="admin-products-manager" dir="rtl">
      <section className="admin-section-head">
        <div>
          <span>إدارة المنتجات</span>
          <h2>البوتات والأنظمة</h2>
          <p>أضف المنتج مرة واحدة، وحدد متطلباته وطريقة تثبيته. بعد النشر يظهر تلقائيًا في الموقع.</p>
        </div>
        <button className="admin-primary-action" type="button" onClick={newProduct}>+ إضافة منتج جديد</button>
      </section>

      <section className="admin-product-workspace">
        <aside className="admin-product-list">
          <div className="admin-product-list-head">
            <strong>المنتجات</strong>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="ALL">الكل</option>
              <option value="PUBLISHED">منشور</option>
              <option value="DRAFT">مسودة</option>
              <option value="COMING_SOON">قريبًا</option>
              <option value="MAINTENANCE">صيانة</option>
              <option value="ARCHIVED">مؤرشف</option>
            </select>
          </div>

          {loading ? <div className="admin-empty-state">جاري تحميل المنتجات...</div> : visibleProducts.map((product) => (
            <button className={`admin-product-item ${selectedId === product.databaseId ? "is-active" : ""}`} type="button" key={product.databaseId} onClick={() => selectProduct(product)}>
              <span>{product.code}</span>
              <div><strong>{product.displayName}</strong><small>{statusLabels[product.databaseStatus] || product.statusLabel}</small></div>
              <i>{product.installEnabled ? "INSTALL" : "—"}</i>
            </button>
          ))}

          {!loading && !visibleProducts.length && <div className="admin-empty-state">ما فيه منتجات ضمن هذا التصنيف.</div>}
        </aside>

        <form className="admin-product-form" onSubmit={(event) => { event.preventDefault(); save() }}>
          <div className="admin-form-title">
            <div><span>{selected ? `تعديل ${selected.displayName}` : "منتج جديد"}</span><h3>{selected ? "تعديل بيانات المنتج" : "إضافة بوت أو نظام جديد"}</h3></div>
            {selected && <small>آخر تحديث: {formatDate(selected.updatedAt)}</small>}
          </div>

          {message && <div className="admin-message" role="status">{message}</div>}

          <div className="admin-form-section">
            <div className="admin-form-section-title"><span>01</span><div><strong>البيانات الأساسية</strong><small>الاسم والرابط والحالة اللي يشوفها العميل.</small></div></div>
            <div className="admin-fields-grid three">
              <label><span>رقم المنتج</span><input value={form.code} onChange={(event) => set("code", event.target.value)} placeholder="مثال: 002" required /></label>
              <label><span>Slug الرابط</span><input value={form.slug} onChange={(event) => set("slug", event.target.value)} placeholder="مثال: guardian-pro" required /><small>/products/slug/</small></label>
              <label><span>الحالة</span><select value={form.status} onChange={(event) => set("status", event.target.value)}><option value="DRAFT">مسودة</option><option value="PUBLISHED">منشور</option><option value="COMING_SOON">قريبًا</option><option value="MAINTENANCE">صيانة</option><option value="ARCHIVED">مؤرشف</option></select></label>
              <label><span>اسم داخلي</span><input value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="GUARDIAN" /></label>
              <label><span>اسم العرض</span><input value={form.displayName} onChange={(event) => set("displayName", event.target.value)} placeholder="002 SYSTEM" required /></label>
              <label><span>الإصدار</span><input value={form.version} onChange={(event) => set("version", event.target.value)} placeholder="V1.0.0" /></label>
              <label><span>التصنيف</span><input value={form.category} onChange={(event) => set("category", event.target.value)} placeholder="Security & Protection" /></label>
              <label><span>نوع المنتج</span><select value={form.productType} onChange={(event) => set("productType", event.target.value)}><option value="discord_bot">بوت Discord</option><option value="discord_system">نظام Discord</option><option value="web_service">خدمة ويب</option><option value="other">منتج آخر</option></select></label>
              <label><span>ترتيب الظهور</span><input type="number" min="0" max="9999" value={form.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label>
            </div>
            <div className="admin-fields-grid two">
              <label><span>وصف عربي</span><textarea value={form.arabicDescription} onChange={(event) => set("arabicDescription", event.target.value)} rows={5} placeholder="اشرح المنتج للعميل بشكل واضح" /></label>
              <label><span>وصف إنجليزي مختصر</span><textarea value={form.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} rows={5} placeholder="Short product description" /></label>
            </div>
            <Toggle checked={form.featured} onChange={(value) => set("featured", value)} label="منتج مميز" help="يؤثر على أولوية عرضه داخل المنصة." />
          </div>

          <div className="admin-form-section">
            <div className="admin-form-section-title"><span>02</span><div><strong>تثبيت البوت في Discord</strong><small>إذا كان المنتج بوت، من هنا تفعّل زر الإضافة المباشر.</small></div></div>
            <Toggle checked={form.installEnabled} onChange={(value) => set("installEnabled", value)} label="تفعيل زر إضافة البوت" help="الزر ما يشتغل إلا إذا المنتج منشور وApplication ID صحيح." />
            <Toggle checked={form.installRequiresLogin} onChange={(value) => set("installRequiresLogin", value)} label="طلب تسجيل Discord قبل التثبيت" help="إذا كان الزائر Guest، يسجل دخول ثم يكمل التثبيت تلقائيًا." />

            <div className="admin-fields-grid two">
              <label><span>Application ID</span><input value={form.applicationId} onChange={(event) => set("applicationId", event.target.value)} inputMode="numeric" placeholder="123456789012345678" /><small>رقم التطبيق من Discord Developer Portal. لا تضع Bot Token أو Client Secret هنا.</small></label>
              <label><span>طريقة رابط التثبيت</span><select value={form.installMode} onChange={(event) => set("installMode", event.target.value)}><option value="DISCORD_DEFAULT">إعدادات Discord الافتراضية — موصى به</option><option value="CUSTOM">رابط مخصص Scopes + Permissions</option></select><small>الوضع الافتراضي يعتمد Default Install Settings داخل Discord Developer Portal.</small></label>
            </div>

            {form.installMode === "CUSTOM" && (
              <div className="admin-custom-install">
                <div className="admin-scope-options">
                  <strong>Scopes</strong>
                  <label><input type="checkbox" checked={form.installScopes.includes("bot")} onChange={() => toggleScope("bot")} /> bot</label>
                  <label><input type="checkbox" checked={form.installScopes.includes("applications.commands")} onChange={() => toggleScope("applications.commands")} /> applications.commands</label>
                </div>
                <label><span>Permissions Bitfield</span><input value={form.installPermissions} onChange={(event) => set("installPermissions", event.target.value.replace(/\D/g, ""))} placeholder="مثال: 0" /><small>اكتب الرقم فقط. استخدم أقل صلاحيات يحتاجها البوت.</small></label>
              </div>
            )}

            {form.installEnabled && !form.applicationId && <div className="admin-warning">⚠ زر التثبيت لن يعمل حتى تضيف Application ID.</div>}
            {form.installEnabled && form.status !== "PUBLISHED" && <div className="admin-warning">⚠ زر التثبيت يبقى غير متاح للزوار حتى تكون حالة المنتج «منشور».</div>}
          </div>

          <div className="admin-form-section">
            <div className="admin-form-section-title"><span>03</span><div><strong>متطلبات البوت</strong><small>تظهر للعميل بشكل واضح قبل التثبيت.</small></div></div>
            <ListEditor title="المتطلبات قبل التثبيت" help="مثال: لازم تكون عندك صلاحية إدارة السيرفر، أو رتبة البوت لازم تكون فوق رتب معينة." items={form.requirements} onChange={(value) => set("requirements", value)} placeholder="اكتب متطلبًا واضحًا" />
            <PermissionEditor items={form.permissionNotes} onChange={(value) => set("permissionNotes", value)} />
          </div>

          <div className="admin-form-section">
            <div className="admin-form-section-title"><span>04</span><div><strong>روابط التوثيق</strong><small>اختيارية وتظهر في صفحة المنتج إذا كانت موجودة.</small></div></div>
            <div className="admin-fields-grid two">
              <label><span>رابط دليل الاستخدام</span><input value={form.docsUrl} onChange={(event) => set("docsUrl", event.target.value)} placeholder="/products/example/docs/" /></label>
              <label><span>رابط الأسئلة الشائعة</span><input value={form.faqUrl} onChange={(event) => set("faqUrl", event.target.value)} placeholder="/products/example/faq/" /></label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-save" type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : selectedId ? "حفظ التغييرات" : "حفظ كمسودة"}</button>
            <button className="admin-publish" type="button" disabled={saving} onClick={() => save("PUBLISHED")}>حفظ + نشر الآن</button>
            {selectedId && <button className="admin-archive" type="button" disabled={saving} onClick={archive}>أرشفة المنتج</button>}
            {selected?.href && <a className="admin-preview-link" href={selected.href} target="_blank" rel="noreferrer">معاينة صفحة المنتج ↗</a>}
          </div>
        </form>
      </section>
    </div>
  )
}
