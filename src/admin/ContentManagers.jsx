import { useEffect, useMemo, useState } from "react"
import { adminApi, formatDate } from "./adminApi"

function StatusMessage({ value }) {
  if (!value) return null
  return <div className="admin-message" role="status">{value}</div>
}

function ManagerHead({ kicker, title, text, action }) {
  return (
    <section className="admin-section-head">
      <div><span>{kicker}</span><h2>{title}</h2><p>{text}</p></div>
      {action}
    </section>
  )
}

function SaveBar({ saving, onSave, onPublish, onArchive, previewHref }) {
  return (
    <div className="admin-form-actions">
      <button className="admin-save" type="button" disabled={saving} onClick={onSave}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</button>
      {onPublish && <button className="admin-publish" type="button" disabled={saving} onClick={onPublish}>حفظ + نشر الآن</button>}
      {onArchive && <button className="admin-archive" type="button" disabled={saving} onClick={onArchive}>أرشفة</button>}
      {previewHref && <a className="admin-preview-link" href={previewHref} target="_blank" rel="noreferrer">معاينة ↗</a>}
    </div>
  )
}

const contentStatuses = [
  ["DRAFT", "مسودة"],
  ["PUBLISHED", "منشور"],
  ["ARCHIVED", "مؤرشف"],
]

export function PagesManager() {
  const [pages, setPages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState({ pageKey: "home", titleAr: "", titleEn: "", eyebrow: "", headline: "", accent: "", bodyAr: "", bodyEn: "", status: "PUBLISHED" })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const load = async () => {
    try {
      const data = await adminApi("/api/admin/pages")
      setPages(data.pages || [])
      const selected = (data.pages || []).find((item) => item.id === selectedId) || (data.pages || [])[0]
      if (selected) {
        setSelectedId(selected.id)
        setForm({ pageKey: selected.page_key, titleAr: selected.title_ar || "", titleEn: selected.title_en || "", eyebrow: selected.eyebrow || "", headline: selected.headline || "", accent: selected.accent || "", bodyAr: selected.body_ar || "", bodyEn: selected.body_en || "", status: selected.status || "DRAFT" })
      }
    } catch (error) { setMessage(`تعذر تحميل الصفحات: ${error.message}`) }
  }

  useEffect(() => { load() }, [])
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const select = (page) => {
    setSelectedId(page.id)
    setForm({ pageKey: page.page_key, titleAr: page.title_ar || "", titleEn: page.title_en || "", eyebrow: page.eyebrow || "", headline: page.headline || "", accent: page.accent || "", bodyAr: page.body_ar || "", bodyEn: page.body_en || "", status: page.status || "DRAFT" })
  }

  const create = () => {
    setSelectedId(null)
    setForm({ pageKey: "", titleAr: "", titleEn: "", eyebrow: "", headline: "", accent: "", bodyAr: "", bodyEn: "", status: "DRAFT" })
    setMessage("")
  }

  const save = async (statusOverride = null) => {
    setSaving(true); setMessage("")
    try {
      const payload = { ...form, status: statusOverride || form.status }
      const data = selectedId
        ? await adminApi(`/api/admin/pages/${selectedId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await adminApi("/api/admin/pages", { method: "POST", body: JSON.stringify(payload) })
      setSelectedId(data.page.id); setMessage("تم حفظ الصفحة بنجاح."); await load()
    } catch (error) { setMessage(`تعذر الحفظ: ${error.message}`) } finally { setSaving(false) }
  }

  return (
    <div className="admin-content-manager" dir="rtl">
      <ManagerHead kicker="محتوى المنصة" title="الصفحات" text="عدّل النصوص الأساسية للصفحات بدون فتح ملفات الكود. الصفحة الرئيسية مربوطة بالموقع مباشرة." action={<button className="admin-primary-action" type="button" onClick={create}>+ صفحة جديدة</button>} />
      <div className="admin-simple-workspace">
        <aside className="admin-simple-list">
          {pages.map((page) => <button type="button" className={selectedId === page.id ? "is-active" : ""} key={page.id} onClick={() => select(page)}><strong>{page.page_key}</strong><small>{page.title_ar || "بدون عنوان"}</small><i>{page.status}</i></button>)}
        </aside>
        <section className="admin-simple-form">
          <StatusMessage value={message} />
          <div className="admin-fields-grid three">
            <label><span>مفتاح الصفحة</span><input value={form.pageKey} disabled={Boolean(selectedId)} onChange={(e) => set("pageKey", e.target.value)} placeholder="home" /></label>
            <label><span>الحالة</span><select value={form.status} onChange={(e) => set("status", e.target.value)}>{contentStatuses.map(([v,l]) => <option value={v} key={v}>{l}</option>)}</select></label>
            <label><span>السطر الصغير</span><input value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="HAMOOD LABS / PRODUCT PLATFORM" /></label>
          </div>
          <div className="admin-fields-grid two">
            <label><span>العنوان الرئيسي</span><input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="POWERING WHAT" /></label>
            <label><span>الكلمة المميزة</span><input value={form.accent} onChange={(e) => set("accent", e.target.value)} placeholder="HAPPENS NEXT." /></label>
            <label><span>العنوان العربي</span><input value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} /></label>
            <label><span>عنوان إنجليزي داخلي</span><input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} /></label>
            <label><span>النص العربي</span><textarea rows={7} value={form.bodyAr} onChange={(e) => set("bodyAr", e.target.value)} /></label>
            <label><span>النص الإنجليزي</span><textarea rows={7} value={form.bodyEn} onChange={(e) => set("bodyEn", e.target.value)} /></label>
          </div>
          <SaveBar saving={saving} onSave={() => save()} onPublish={() => save("PUBLISHED")} previewHref={form.pageKey === "home" ? "/" : null} />
        </section>
      </div>
    </div>
  )
}

function ProductPicker({ value, onChange, allowGlobal = false }) {
  const [products, setProducts] = useState([])
  useEffect(() => { adminApi("/api/admin/products").then((data) => setProducts(data.products || [])).catch(() => {}) }, [])
  return <select value={value || ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}>{allowGlobal && <option value="">عام للمنصة</option>}{!allowGlobal && <option value="">اختر المنتج</option>}{products.map((product) => <option key={product.databaseId} value={product.databaseId}>{product.code} — {product.displayName}</option>)}</select>
}

export function DocsManager() {
  const empty = { productId: "", slug: "", titleAr: "", titleEn: "", summaryAr: "", contentAr: "", contentEn: "", status: "DRAFT", sortOrder: 100 }
  const [items, setItems] = useState([]); const [selectedId, setSelectedId] = useState(null); const [form, setForm] = useState(empty); const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false)
  const load=async()=>{try{const data=await adminApi("/api/admin/docs");setItems(data.docs||[])}catch(e){setMessage(`تعذر التحميل: ${e.message}`)}}
  useEffect(()=>{load()},[]); const set=(k,v)=>setForm(c=>({...c,[k]:v}))
  const select=(item)=>{setSelectedId(item.id);setForm({productId:item.product_id,slug:item.slug,titleAr:item.title_ar||"",titleEn:item.title_en||"",summaryAr:item.summary_ar||"",contentAr:item.content_ar||"",contentEn:item.content_en||"",status:item.status||"DRAFT",sortOrder:Number(item.sort_order||100)})}
  const save=async(statusOverride=null)=>{setSaving(true);setMessage("");try{const payload={...form,status:statusOverride||form.status};const data=selectedId?await adminApi(`/api/admin/docs/${selectedId}`,{method:"PATCH",body:JSON.stringify(payload)}):await adminApi("/api/admin/docs",{method:"POST",body:JSON.stringify(payload)});setSelectedId(data.doc.id);setMessage("تم حفظ قسم التوثيق.");await load()}catch(e){setMessage(`تعذر الحفظ: ${e.message}`)}finally{setSaving(false)}}
  const archive=async()=>{if(!selectedId||!confirm("أرشفة قسم التوثيق؟"))return;await adminApi(`/api/admin/docs/${selectedId}`,{method:"DELETE"});setSelectedId(null);setForm(empty);await load()}
  return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="مركز المعرفة" title="التوثيق والدليل" text="أنشئ أقسام توثيق لكل منتج وانشرها للزوار. المسودة ما تظهر للعامة." action={<button className="admin-primary-action" type="button" onClick={()=>{setSelectedId(null);setForm(empty)}}>+ قسم توثيق</button>}/><div className="admin-simple-workspace"><aside className="admin-simple-list">{items.map(i=><button type="button" className={selectedId===i.id?"is-active":""} key={i.id} onClick={()=>select(i)}><strong>{i.product_name}</strong><small>{i.title_ar}</small><i>{i.status}</i></button>)}</aside><section className="admin-simple-form"><StatusMessage value={message}/><div className="admin-fields-grid three"><label><span>المنتج</span><ProductPicker value={form.productId} onChange={(v)=>set("productId",v)}/></label><label><span>Slug القسم</span><input value={form.slug} onChange={e=>set("slug",e.target.value)} placeholder="getting-started"/></label><label><span>الحالة</span><select value={form.status} onChange={e=>set("status",e.target.value)}>{contentStatuses.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label><label><span>العنوان العربي</span><input value={form.titleAr} onChange={e=>set("titleAr",e.target.value)}/></label><label><span>العنوان الإنجليزي</span><input value={form.titleEn} onChange={e=>set("titleEn",e.target.value)}/></label><label><span>ترتيب الظهور</span><input type="number" value={form.sortOrder} onChange={e=>set("sortOrder",Number(e.target.value))}/></label></div><label className="admin-block-label"><span>ملخص</span><textarea rows={3} value={form.summaryAr} onChange={e=>set("summaryAr",e.target.value)}/></label><div className="admin-fields-grid two"><label><span>المحتوى العربي</span><textarea rows={12} value={form.contentAr} onChange={e=>set("contentAr",e.target.value)} placeholder="اكتب الدليل بشكل واضح..."/></label><label><span>المحتوى الإنجليزي</span><textarea rows={12} value={form.contentEn} onChange={e=>set("contentEn",e.target.value)} /></label></div><SaveBar saving={saving} onSave={()=>save()} onPublish={()=>save("PUBLISHED")} onArchive={selectedId?archive:null} previewHref={form.productId?"/products/guardian/docs/":null}/></section></div></div>
}

export function FaqManager() {
  const empty={productId:"",questionAr:"",answerAr:"",questionEn:"",answerEn:"",status:"DRAFT",sortOrder:100}; const [items,setItems]=useState([]),[selectedId,setSelectedId]=useState(null),[form,setForm]=useState(empty),[message,setMessage]=useState(""),[saving,setSaving]=useState(false)
  const load=async()=>{try{const d=await adminApi("/api/admin/faq");setItems(d.faq||[])}catch(e){setMessage(`تعذر التحميل: ${e.message}`)}};useEffect(()=>{load()},[]);const set=(k,v)=>setForm(c=>({...c,[k]:v}));const select=i=>{setSelectedId(i.id);setForm({productId:i.product_id||"",questionAr:i.question_ar||"",answerAr:i.answer_ar||"",questionEn:i.question_en||"",answerEn:i.answer_en||"",status:i.status||"DRAFT",sortOrder:Number(i.sort_order||100)})};const save=async(statusOverride=null)=>{setSaving(true);try{const payload={...form,status:statusOverride||form.status};const d=selectedId?await adminApi(`/api/admin/faq/${selectedId}`,{method:"PATCH",body:JSON.stringify(payload)}):await adminApi("/api/admin/faq",{method:"POST",body:JSON.stringify(payload)});setSelectedId(d.item.id);setMessage("تم حفظ السؤال.");await load()}catch(e){setMessage(`تعذر الحفظ: ${e.message}`)}finally{setSaving(false)}};const archive=async()=>{if(!selectedId||!confirm("أرشفة السؤال؟"))return;await adminApi(`/api/admin/faq/${selectedId}`,{method:"DELETE"});setSelectedId(null);setForm(empty);await load()}
  return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="الأسئلة الشائعة" title="FAQ" text="أضف أسئلة وأجوبة واضحة لكل منتج أو للمنصة." action={<button className="admin-primary-action" type="button" onClick={()=>{setSelectedId(null);setForm(empty)}}>+ سؤال جديد</button>}/><div className="admin-simple-workspace"><aside className="admin-simple-list">{items.map(i=><button type="button" className={selectedId===i.id?"is-active":""} key={i.id} onClick={()=>select(i)}><strong>{i.product_name||"عام"}</strong><small>{i.question_ar}</small><i>{i.status}</i></button>)}</aside><section className="admin-simple-form"><StatusMessage value={message}/><div className="admin-fields-grid three"><label><span>المنتج</span><ProductPicker allowGlobal value={form.productId} onChange={v=>set("productId",v)}/></label><label><span>الحالة</span><select value={form.status} onChange={e=>set("status",e.target.value)}>{contentStatuses.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label><label><span>ترتيب الظهور</span><input type="number" value={form.sortOrder} onChange={e=>set("sortOrder",Number(e.target.value))}/></label></div><div className="admin-fields-grid two"><label><span>السؤال بالعربي</span><textarea rows={3} value={form.questionAr} onChange={e=>set("questionAr",e.target.value)}/></label><label><span>الجواب بالعربي</span><textarea rows={7} value={form.answerAr} onChange={e=>set("answerAr",e.target.value)}/></label><label><span>السؤال بالإنجليزي</span><textarea rows={3} value={form.questionEn} onChange={e=>set("questionEn",e.target.value)}/></label><label><span>الجواب بالإنجليزي</span><textarea rows={7} value={form.answerEn} onChange={e=>set("answerEn",e.target.value)}/></label></div><SaveBar saving={saving} onSave={()=>save()} onPublish={()=>save("PUBLISHED")} onArchive={selectedId?archive:null}/></section></div></div>
}

export function AnnouncementsManager() {
  const empty={titleAr:"",bodyAr:"",tone:"INFO",status:"DRAFT",startsAt:"",endsAt:""}; const [items,setItems]=useState([]),[selectedId,setSelectedId]=useState(null),[form,setForm]=useState(empty),[message,setMessage]=useState(""),[saving,setSaving]=useState(false);const set=(k,v)=>setForm(c=>({...c,[k]:v}));const load=async()=>{try{const d=await adminApi("/api/admin/announcements");setItems(d.announcements||[])}catch(e){setMessage(`تعذر التحميل: ${e.message}`)}};useEffect(()=>{load()},[]);const select=i=>{setSelectedId(i.id);setForm({titleAr:i.title_ar||"",bodyAr:i.body_ar||"",tone:i.tone||"INFO",status:i.status||"DRAFT",startsAt:i.starts_at||"",endsAt:i.ends_at||""})};const save=async(statusOverride=null)=>{setSaving(true);try{const p={...form,status:statusOverride||form.status};const d=selectedId?await adminApi(`/api/admin/announcements/${selectedId}`,{method:"PATCH",body:JSON.stringify(p)}):await adminApi("/api/admin/announcements",{method:"POST",body:JSON.stringify(p)});setSelectedId(d.announcement.id);setMessage("تم حفظ الإعلان.");await load()}catch(e){setMessage(`تعذر الحفظ: ${e.message}`)}finally{setSaving(false)}};const archive=async()=>{if(!selectedId||!confirm("أرشفة الإعلان؟"))return;await adminApi(`/api/admin/announcements/${selectedId}`,{method:"DELETE"});setSelectedId(null);setForm(empty);await load()}
  return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="رسائل المنصة" title="الإعلانات" text="أنشئ شريط إعلان يظهر للزوار، وحدد نوعه ووقت ظهوره." action={<button className="admin-primary-action" type="button" onClick={()=>{setSelectedId(null);setForm(empty)}}>+ إعلان جديد</button>}/><div className="admin-simple-workspace"><aside className="admin-simple-list">{items.map(i=><button type="button" className={selectedId===i.id?"is-active":""} key={i.id} onClick={()=>select(i)}><strong>{i.title_ar}</strong><small>{i.tone}</small><i>{i.status}</i></button>)}</aside><section className="admin-simple-form"><StatusMessage value={message}/><div className="admin-fields-grid three"><label><span>نوع الإعلان</span><select value={form.tone} onChange={e=>set("tone",e.target.value)}><option>INFO</option><option>SUCCESS</option><option>WARNING</option><option>CRITICAL</option></select></label><label><span>الحالة</span><select value={form.status} onChange={e=>set("status",e.target.value)}>{contentStatuses.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label><label><span>العنوان</span><input value={form.titleAr} onChange={e=>set("titleAr",e.target.value)}/></label><label><span>يبدأ في — اختياري</span><input value={form.startsAt} onChange={e=>set("startsAt",e.target.value)} placeholder="2026-08-10T20:00:00Z"/></label><label><span>ينتهي في — اختياري</span><input value={form.endsAt} onChange={e=>set("endsAt",e.target.value)} placeholder="2026-08-11T20:00:00Z"/></label></div><label className="admin-block-label"><span>نص الإعلان</span><textarea rows={7} value={form.bodyAr} onChange={e=>set("bodyAr",e.target.value)}/></label><SaveBar saving={saving} onSave={()=>save()} onPublish={()=>save("PUBLISHED")} onArchive={selectedId?archive:null} previewHref="/"/></section></div></div>
}

function SettingsManager({ settingKey, title, description, children, defaultValue, permissionHint }) {
  const [form,setForm]=useState(defaultValue),[message,setMessage]=useState(""),[saving,setSaving]=useState(false)
  useEffect(()=>{adminApi(`/api/admin/settings/${settingKey}`).then(d=>setForm({...defaultValue,...(d.value||{})})).catch(e=>setMessage(`تعذر التحميل: ${e.message}`))},[settingKey])
  const set=(k,v)=>setForm(c=>({...c,[k]:v})); const save=async()=>{setSaving(true);setMessage("");try{await adminApi(`/api/admin/settings/${settingKey}`,{method:"PATCH",body:JSON.stringify({value:form})});setMessage("تم حفظ الإعدادات.")}catch(e){setMessage(`تعذر الحفظ: ${e.message}${permissionHint?` — ${permissionHint}`:""}`)}finally{setSaving(false)}}
  return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="إعدادات المنصة" title={title} text={description}/><section className="admin-simple-form standalone"><StatusMessage value={message}/>{children({form,set})}<SaveBar saving={saving} onSave={save} previewHref="/"/></section></div>
}

export function SeoManager(){return <SettingsManager settingKey="seo" title="محركات البحث" description="العنوان والوصف والكلمات المفتاحية التي تستخدمها المنصة لمحركات البحث ومشاركة الروابط." defaultValue={{title:"HAMOOD LABS",description:"",keywords:""}}>{({form,set})=><><div className="admin-fields-grid two"><label><span>عنوان الموقع</span><input value={form.title||""} onChange={e=>set("title",e.target.value)}/></label><label><span>الكلمات المفتاحية</span><input value={form.keywords||""} onChange={e=>set("keywords",e.target.value)}/></label></div><label className="admin-block-label"><span>وصف الموقع</span><textarea rows={6} value={form.description||""} onChange={e=>set("description",e.target.value)}/></label></>}</SettingsManager>}

export function AppearanceManager(){return <SettingsManager settingKey="appearance" title="المظهر" description="غيّر اللون الرئيسي وبعض خيارات الواجهة الآمنة بدون CSS يدوي." defaultValue={{accent:"blue",compact:false,showNetworkStatus:true}}>{({form,set})=><div className="admin-fields-grid three"><label><span>اللون الرئيسي</span><select value={form.accent||"blue"} onChange={e=>set("accent",e.target.value)}><option value="blue">أزرق</option><option value="cyan">سماوي</option><option value="green">أخضر</option><option value="purple">بنفسجي</option></select></label><label className="admin-check-label"><input type="checkbox" checked={Boolean(form.compact)} onChange={e=>set("compact",e.target.checked)}/><span>واجهة أكثر اختصارًا</span></label><label className="admin-check-label"><input type="checkbox" checked={form.showNetworkStatus!==false} onChange={e=>set("showNetworkStatus",e.target.checked)}/><span>إظهار حالة الشبكة</span></label></div>}</SettingsManager>}

export function MaintenanceManager(){return <SettingsManager settingKey="maintenance" title="الصيانة" description="فعّل وضع الصيانة للزوار. حساب OWNER يقدر يتجاوزها حتى تراجع الموقع." defaultValue={{enabled:false,message:"المنصة تحت الصيانة حاليًا. نرجع قريب.",ownerBypass:true}} permissionHint="هذا الخيار للإدارة العليا">{({form,set})=><><div className="admin-fields-grid two"><label className="admin-check-label"><input type="checkbox" checked={Boolean(form.enabled)} onChange={e=>set("enabled",e.target.checked)}/><span>تفعيل وضع الصيانة</span></label><label className="admin-check-label"><input type="checkbox" checked={form.ownerBypass!==false} onChange={e=>set("ownerBypass",e.target.checked)}/><span>السماح للمالك بتجاوز الصيانة</span></label></div><label className="admin-block-label"><span>رسالة الصيانة</span><textarea rows={6} value={form.message||""} onChange={e=>set("message",e.target.value)}/></label><div className="admin-warning">إذا فعلت الصيانة، الزوار يشوفون صفحة صيانة مباشرة. لوحة الإدارة تبقى متاحة لك.</div></>}</SettingsManager>}

export function MediaManager(){const empty={assetKey:"",label:"",kind:"IMAGE",url:"",altAr:"",status:"PUBLISHED"};const[items,setItems]=useState([]),[selectedId,setSelectedId]=useState(null),[form,setForm]=useState(empty),[message,setMessage]=useState(""),[saving,setSaving]=useState(false);const set=(k,v)=>setForm(c=>({...c,[k]:v}));const load=async()=>{try{const d=await adminApi("/api/admin/media");setItems(d.media||[])}catch(e){setMessage(`تعذر التحميل: ${e.message}`)}};useEffect(()=>{load()},[]);const select=i=>{setSelectedId(i.id);setForm({assetKey:i.asset_key,label:i.label,kind:i.kind,url:i.url,altAr:i.alt_ar||"",status:i.status})};const save=async()=>{setSaving(true);try{const d=selectedId?await adminApi(`/api/admin/media/${selectedId}`,{method:"PATCH",body:JSON.stringify(form)}):await adminApi("/api/admin/media",{method:"POST",body:JSON.stringify(form)});setSelectedId(d.item.id);setMessage("تم حفظ الوسيط.");await load()}catch(e){setMessage(`تعذر الحفظ: ${e.message}`)}finally{setSaving(false)}};return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="مكتبة الروابط" title="الوسائط" text="سجل روابط الشعارات والبنرات والصور من مكان واحد. رفع الملفات المباشر يجي مع تخزين R2 لاحقًا." action={<button className="admin-primary-action" onClick={()=>{setSelectedId(null);setForm(empty)}} type="button">+ وسيط</button>}/><div className="admin-simple-workspace"><aside className="admin-simple-list">{items.map(i=><button type="button" className={selectedId===i.id?"is-active":""} key={i.id} onClick={()=>select(i)}><strong>{i.label}</strong><small>{i.asset_key}</small><i>{i.status}</i></button>)}</aside><section className="admin-simple-form"><StatusMessage value={message}/><div className="admin-fields-grid three"><label><span>المفتاح</span><input disabled={Boolean(selectedId)} value={form.assetKey} onChange={e=>set("assetKey",e.target.value)}/></label><label><span>الاسم</span><input value={form.label} onChange={e=>set("label",e.target.value)}/></label><label><span>النوع</span><select value={form.kind} onChange={e=>set("kind",e.target.value)}><option>IMAGE</option><option>VIDEO</option><option>ICON</option></select></label></div><label className="admin-block-label"><span>الرابط</span><input value={form.url} onChange={e=>set("url",e.target.value)} placeholder="https://..."/></label><label className="admin-block-label"><span>وصف الصورة</span><input value={form.altAr} onChange={e=>set("altAr",e.target.value)}/></label><SaveBar saving={saving} onSave={save}/></section></div></div>}

const roleLabels={USER:"مستخدم",VIEWER:"مشاهدة فقط",SUPPORT:"دعم",PRODUCT_MANAGER:"مدير منتجات",CONTENT_MANAGER:"مدير محتوى",ADMIN:"مدير المنصة",OWNER:"المالك"}
export function PermissionsManager(){const[users,setUsers]=useState([]),[roles,setRoles]=useState([]),[message,setMessage]=useState("");const load=async()=>{try{const d=await adminApi("/api/admin/roles");setUsers(d.users||[]);setRoles(d.roles||[])}catch(e){setMessage(`تعذر تحميل الصلاحيات: ${e.message}`)}};useEffect(()=>{load()},[]);const change=async(user,role)=>{try{await adminApi("/api/admin/roles",{method:"PATCH",body:JSON.stringify({discordId:user.discord_id,role})});setMessage(`تم تحديث صلاحية @${user.username} إلى ${roleLabels[role]||role}.`);await load()}catch(e){setMessage(`تعذر تغيير الصلاحية: ${e.message}`)}};return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="فريق الإدارة" title="الصلاحيات" text="المالك فقط يقدر يعيّن أدوار لوحة الإدارة. كل دور يأخذ الأدوات المناسبة له."/><StatusMessage value={message}/><div className="admin-role-grid">{users.map(u=><article key={u.discord_id}><div><strong>{u.global_name||u.username}</strong><small>@{u.username}</small><code>{u.discord_id}</code></div>{u.platform_role==="OWNER"?<span className="admin-owner-badge">OWNER</span>:<select value={u.platform_role||"USER"} onChange={e=>change(u,e.target.value)}><option value="USER">مستخدم</option>{roles.map(r=><option key={r} value={r}>{roleLabels[r]||r}</option>)}</select>}</article>)}</div></div>}

export function VersionsManager(){const[versions,setVersions]=useState([]),[message,setMessage]=useState("");const load=()=>adminApi("/api/admin/versions").then(d=>setVersions(d.versions||[])).catch(e=>setMessage(`تعذر التحميل: ${e.message}`));useEffect(()=>{load()},[]);const rollback=async(v)=>{if(!confirm(`استرجاع النسخة #${v.id}؟ راح ترجع بيانات هذا العنصر للحالة المحفوظة.`))return;try{await adminApi(`/api/admin/versions/${v.id}/rollback`,{method:"POST",body:JSON.stringify({})});setMessage(`تم استرجاع النسخة #${v.id} بنجاح.`);await load()}catch(e){setMessage(`تعذر الاسترجاع: ${e.message}`)}};return <div className="admin-content-manager" dir="rtl"><ManagerHead kicker="تاريخ المحتوى" title="المسودات والإصدارات" text="كل حفظ للمحتوى يسجل نسخة مرجعية. حساب OWNER يقدر يرجع لأي نسخة مدعومة بضغطة واحدة."/><StatusMessage value={message}/><div className="admin-version-list">{versions.length?versions.map(v=><article key={v.id}><span>{v.entity_type}</span><strong>{v.action}</strong><small>#{v.entity_id} • {formatDate(v.created_at)}</small><button type="button" onClick={()=>rollback(v)}>استرجاع النسخة</button></article>):<div className="admin-empty-state">ما فيه إصدارات مسجلة للحين.</div>}</div></div>}
