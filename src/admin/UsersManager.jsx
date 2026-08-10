import { useEffect, useState } from "react"
import { adminApi, formatDate } from "./adminApi"

export default function UsersManager() {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    adminApi("/api/admin/users")
      .then((data) => setUsers(data.users || []))
      .catch((error) => setMessage(`تعذر تحميل المستخدمين: ${error.message}`))
  }, [])

  return (
    <div dir="rtl">
      <section className="admin-section-head">
        <div><span>المستخدمون</span><h2>حسابات Discord المسجلة</h2><p>الحسابات التي سجلت دخولها في HAMOOD LABS. ما نخزن OAuth access token داخل قاعدة البيانات.</p></div>
      </section>
      {message && <div className="admin-message">{message}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>المستخدم</th><th>Discord ID</th><th>الدور</th><th>آخر ظهور</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.discord_id}><td><strong>{user.global_name || user.username}</strong><small>@{user.username}</small></td><td>{user.discord_id}</td><td><span className={`admin-role admin-role-${String(user.platform_role).toLowerCase()}`}>{user.platform_role}</span></td><td>{formatDate(user.last_seen_at)}</td></tr>)}</tbody>
        </table>
        {!users.length && <div className="admin-empty-state">ما فيه مستخدمين مسجلين في قاعدة البيانات حتى الآن.</div>}
      </div>
    </div>
  )
}
