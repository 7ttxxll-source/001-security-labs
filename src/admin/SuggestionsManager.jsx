import { useEffect, useMemo, useState } from "react"
import { adminApi, formatDate } from "./adminApi"

const statusLabels = {
  SUBMITTED: "تم الاستلام",
  REVIEWING: "قيد المراجعة",
  PLANNED: "مخطط لها",
  ACCEPTED: "مقبول",
  DECLINED: "مرفوض",
  RELEASED: "تم التنفيذ",
}

export default function SuggestionsManager({ onDataChanged }) {
  const [suggestions, setSuggestions] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [draft, setDraft] = useState({ status: "SUBMITTED", adminNote: "" })

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi("/api/admin/suggestions")
      setSuggestions(data.suggestions || [])
    } catch (error) {
      setMessage(`تعذر تحميل الاقتراحات: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const selected = suggestions.find((item) => item.id === selectedId) || null
  const visible = useMemo(() => filter === "ALL" ? suggestions : suggestions.filter((item) => item.status === filter), [suggestions, filter])

  const choose = (item) => {
    setSelectedId(item.id)
    setDraft({ status: item.status, adminNote: item.admin_note || "" })
    setMessage("")
  }

  const save = async () => {
    if (!selectedId) return
    setSaving(true)
    try {
      const data = await adminApi(`/api/admin/suggestions/${selectedId}`, {
        method: "PATCH",
        body: JSON.stringify(draft),
      })
      setSuggestions((items) => items.map((item) => item.id === selectedId ? data.suggestion : item))
      setMessage("تم تحديث حالة الاقتراح.")
      onDataChanged?.()
    } catch (error) {
      setMessage(`تعذر التحديث: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-suggestions-manager" dir="rtl">
      <section className="admin-section-head">
        <div>
          <span>مركز الاقتراحات</span>
          <h2>المراجعة والمتابعة</h2>
          <p>كل اقتراح يجي برقم متابعة وحساب Discord وحالة واضحة. غيّر الحالة وأضف ملاحظة تظهر لصاحب الاقتراح.</p>
        </div>
        <select className="admin-head-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="ALL">كل الحالات</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </section>

      {message && <div className="admin-message">{message}</div>}

      <section className="admin-suggestions-workspace">
        <div className="admin-suggestion-list">
          {loading ? <div className="admin-empty-state">جاري تحميل الاقتراحات...</div> : visible.map((item) => (
            <button type="button" key={item.id} className={`admin-suggestion-item ${selectedId === item.id ? "is-active" : ""}`} onClick={() => choose(item)}>
              <div><span>{item.ticket_code || `#${item.id}`}</span><i className={`suggestion-status-${item.status.toLowerCase()}`}>{statusLabels[item.status] || item.status}</i></div>
              <strong>{item.title}</strong>
              <small>{item.global_name || item.username} • {formatDate(item.created_at)}</small>
            </button>
          ))}
          {!loading && !visible.length && <div className="admin-empty-state">ما فيه اقتراحات ضمن هذه الحالة.</div>}
        </div>

        <article className="admin-suggestion-detail">
          {selected ? (
            <>
              <div className="admin-form-title"><div><span>{selected.ticket_code}</span><h3>{selected.title}</h3></div><small>{formatDate(selected.created_at)}</small></div>
              <div className="admin-suggestion-meta"><span>النوع: <strong>{selected.category}</strong></span><span>المرسل: <strong>@{selected.username}</strong></span><span>Discord ID: <strong>{selected.user_id}</strong></span></div>
              <div className="admin-suggestion-copy"><strong>تفاصيل الاقتراح</strong><p>{selected.details}</p></div>
              {selected.use_case && <div className="admin-suggestion-copy"><strong>ليش الفكرة مهمة؟</strong><p>{selected.use_case}</p></div>}

              <div className="admin-fields-grid two">
                <label><span>الحالة</span><select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                <label><span>ملاحظة للإرسال</span><textarea value={draft.adminNote} onChange={(event) => setDraft((current) => ({ ...current, adminNote: event.target.value }))} placeholder="مثال: الفكرة ممتازة وتم نقلها للخطة القادمة" rows={4} /></label>
              </div>

              <button className="admin-save" type="button" onClick={save} disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ حالة الاقتراح"}</button>
            </>
          ) : (
            <div className="admin-empty-state large">اختر اقتراحًا من القائمة حتى تظهر تفاصيله هنا.</div>
          )}
        </article>
      </section>
    </div>
  )
}
