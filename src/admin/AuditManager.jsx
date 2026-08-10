import { useEffect, useState } from "react"
import { adminApi, formatDate } from "./adminApi"

export default function AuditManager() {
  const [logs, setLogs] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    adminApi("/api/admin/audit")
      .then((data) => setLogs(data.logs || []))
      .catch((error) => setMessage(`تعذر تحميل السجل: ${error.message}`))
  }, [])

  return (
    <div dir="rtl">
      <section className="admin-section-head">
        <div><span>سجل العمليات</span><h2>كل تعديل إداري مهم</h2><p>إنشاء المنتجات وتعديلها وأرشفتها وتغيير حالات الاقتراحات يتم تسجيله مع حساب المالك ووقت العملية.</p></div>
      </section>
      {message && <div className="admin-message">{message}</div>}
      <div className="admin-audit-list">
        {logs.map((log) => (
          <article key={log.id}>
            <span>{formatDate(log.created_at)}</span>
            <div><strong>{log.summary}</strong><small>{log.action} • {log.entity_type}{log.entity_id ? ` #${log.entity_id}` : ""}</small></div>
            <i>{log.actor_name}</i>
          </article>
        ))}
        {!logs.length && <div className="admin-empty-state">ما فيه عمليات مسجلة حتى الآن.</div>}
      </div>
    </div>
  )
}
