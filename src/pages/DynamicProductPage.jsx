import { useEffect, useMemo, useState } from "react"
import { PageHero } from "../components/PlatformShell"
import { ROUTES } from "../siteConfig"

function ProductLoading() {
  return (
    <section className="dynamic-product-state page-section" dir="rtl">
      <span>HAMOOD LABS</span>
      <h1>جاري تحميل المنتج...</h1>
      <p>يتم جلب بيانات المنتج المنشورة من المنصة.</p>
    </section>
  )
}

function ProductNotFound() {
  return (
    <section className="dynamic-product-state page-section" dir="rtl">
      <span>PRODUCT NOT FOUND</span>
      <h1>المنتج غير متاح.</h1>
      <p>المنتج غير منشور أو الرابط غير صحيح.</p>
      <a className="primary-button" href={ROUTES.products}>العودة للمنتجات <span>←</span></a>
    </section>
  )
}

export default function DynamicProductPage() {
  const slug = useMemo(() => {
    const match = window.location.pathname.match(/^\/products\/([a-z0-9-]+)\/?$/i)
    return match?.[1]?.toLowerCase() || ""
  }, [])
  const [state, setState] = useState({ loading: true, product: null, error: null })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        })
        const data = await response.json()
        if (!response.ok || !data?.product) throw new Error(data?.error || "PRODUCT_NOT_FOUND")
        if (!cancelled) setState({ loading: false, product: data.product, error: null })
      } catch (error) {
        if (!cancelled) setState({ loading: false, product: null, error: error.message })
      }
    }
    if (slug) load()
    else setState({ loading: false, product: null, error: "PRODUCT_NOT_FOUND" })
    return () => { cancelled = true }
  }, [slug])

  if (state.loading) return <ProductLoading />
  if (!state.product) return <ProductNotFound />

  const product = state.product
  const requirements = Array.isArray(product.requirements) ? product.requirements : []
  const permissionNotes = Array.isArray(product.permissionNotes) ? product.permissionNotes : []

  return (
    <>
      <PageHero
        eyebrow={`${product.id} / HAMOOD LABS PRODUCT`}
        title={product.displayName}
        accent={product.productType === "discord_bot" ? "DISCORD BOT." : "SYSTEM."}
        arabicTitle={product.arabicDescription || "منتج داخل HAMOOD LABS."}
        arabicText={product.shortDescription}
        actions={(
          <>
            {product.installHref ? (
              <a className="primary-button" data-discord-install href={product.installHref}>إضافة البوت إلى Discord <span>↗</span></a>
            ) : (
              <span className="primary-button is-disabled">غير متاح للتثبيت حاليًا</span>
            )}
            <a className="secondary-button" href={ROUTES.products}>كل المنتجات <span>←</span></a>
          </>
        )}
      >
        <div className="dynamic-product-status" data-tilt>
          <span><i /> {product.statusLabel}</span>
          <strong>{product.version}</strong>
          <small>{product.category}</small>
        </div>
      </PageHero>

      <section className="dynamic-product-overview page-section" data-reveal>
        <div dir="rtl">
          <p className="eyebrow">PRODUCT OVERVIEW</p>
          <h2>كل شيء واضح قبل التثبيت.</h2>
          <p>{product.arabicDescription}</p>
        </div>
        <div className="dynamic-product-facts">
          <div><span>الحالة</span><strong>{product.statusLabel}</strong></div>
          <div><span>الإصدار</span><strong>{product.version}</strong></div>
          <div><span>النوع</span><strong>{product.productType === "discord_bot" ? "بوت Discord" : product.productType}</strong></div>
          <div><span>التثبيت</span><strong>{product.installHref ? "متاح" : "غير متاح"}</strong></div>
        </div>
      </section>

      <section className="dynamic-product-requirements page-section" data-reveal dir="rtl">
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">INSTALL REQUIREMENTS</p>
            <h2>متطلبات قبل <span>إضافة البوت.</span></h2>
          </div>
          <div>
            <strong>اقرأ المتطلبات قبل الضغط على التثبيت.</strong>
            <p>هذه المتطلبات يحددها المطور من لوحة الإدارة لكل بوت بشكل مستقل.</p>
          </div>
        </div>

        {requirements.length ? (
          <div className="requirement-list">
            {requirements.map((item, index) => (
              <article key={`${index}-${item}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>
            ))}
          </div>
        ) : (
          <div className="product-empty-note">لا توجد متطلبات إضافية منشورة لهذا المنتج.</div>
        )}
      </section>

      <section className="dynamic-product-permissions page-section" data-reveal dir="rtl">
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">DISCORD PERMISSIONS</p>
            <h2>الصلاحيات <span>ولماذا يحتاجها.</span></h2>
          </div>
          <div>
            <strong>الشفافية قبل الموافقة.</strong>
            <p>اعتمد دائمًا شاشة Discord النهائية كمرجع للصلاحيات التي سيطلبها التطبيق وقت التثبيت.</p>
          </div>
        </div>

        {permissionNotes.length ? (
          <div className="permission-note-grid">
            {permissionNotes.map((item, index) => (
              <article key={`${index}-${item.name}`}>
                <span>{item.name || `صلاحية ${index + 1}`}</span>
                <p>{item.why || "تمت إضافتها ضمن إعدادات المنتج."}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="product-empty-note">تفاصيل الصلاحيات غير منشورة حاليًا.</div>
        )}
      </section>

      <section className="dynamic-product-install page-section" data-reveal dir="rtl">
        <div>
          <p className="eyebrow">READY TO INSTALL</p>
          <h2>{product.installHref ? "جاهز تضيفه لسيرفرك؟" : "التثبيت غير متاح حاليًا."}</h2>
          <p>{product.installRequiresLogin ? "يلزم تسجيل الدخول بحساب Discord قبل بدء التثبيت." : "تقدر تبدأ التثبيت مباشرة من Discord."}</p>
        </div>
        <div className="route-hero-actions">
          {product.installHref && <a className="primary-button" data-discord-install href={product.installHref}>إضافة البوت إلى Discord <span>↗</span></a>}
          {product.guideHref && <a className="secondary-button" href={product.guideHref}>دليل الاستخدام <span>→</span></a>}
          {product.faqHref && <a className="secondary-button" href={product.faqHref}>الأسئلة الشائعة <span>→</span></a>}
        </div>
      </section>
    </>
  )
}
