import { PageHero, ProductCard } from "../components/PlatformShell"
import { platformCategories } from "../data/products"
import { useProducts } from "../hooks/useProducts"
import { usePlatformContent } from "../hooks/usePlatformContent"
import { BRAND, ROUTES } from "../siteConfig"

export default function ProductsPage() {
  const { products, stats } = useProducts()
  const { pages } = usePlatformContent()
  const page = pages?.products

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow || "HAMOOD LABS / PRODUCT DIRECTORY"}
        title={page?.headline || "ALL SYSTEMS."}
        accent={page?.accent || "ONE ECOSYSTEM."}
        arabicTitle={page?.title_ar || "كل البوتات والأنظمة في مكان واحد."}
        arabicText={page?.body_ar || "استعرض المنتجات المتاحة والقادمة. أي بوت جديد يتم نشره من لوحة الإدارة يظهر هنا تلقائيًا مع صفحته ومتطلباته وزر التثبيت إذا كان جاهزًا."}
        actions={(
          <>
            <a className="primary-button" href="#product-directory">استعرض المنتجات <span>↓</span></a>
            <a className="secondary-button" href={ROUTES.suggestions}>أرسل اقتراحًا <span>↗</span></a>
          </>
        )}
      >
        <div className="directory-overview-card" data-tilt>
          <span>حالة الكتالوج</span>
          <strong>{String(stats.total).padStart(2, "0")} منتج</strong>
          <div><i /> {String(stats.live).padStart(2, "0")} متاح الآن</div>
          <div><i /> {String(stats.building).padStart(2, "0")} قيد التطوير</div>
          <div><i className="muted-dot" /> يتحدث تلقائيًا من لوحة الإدارة</div>
        </div>
      </PageHero>

      <section className="products-directory-page page-section" id="product-directory" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">LIVE + UPCOMING</p>
            <h2>HAMOOD LABS <span>PRODUCTS.</span></h2>
          </div>
          <div dir="rtl">
            <strong>كل منتج له مكان واضح ومستقل.</strong>
            <p>المنتج المنشور يظهر للزوار مباشرة. وإذا كان بوتًا وجاهزًا للتثبيت، يظهر زر الإضافة مع المتطلبات والصلاحيات المطلوبة قبل التثبيت.</p>
          </div>
        </div>

        <div className="product-rail product-directory-grid">
          {products.map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>

        {!products.length && (
          <div className="future-slot page-future-slot">
            <div><span>+</span><strong>لا توجد منتجات منشورة حاليًا</strong></div>
            <p dir="rtl">أضف منتجًا من HAMOOD ADMIN ثم انشره ليظهر هنا.</p>
          </div>
        )}
      </section>

      <section className="product-architecture page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">PRODUCT ARCHITECTURE</p>
            <h2>EVERY PRODUCT GETS <span>ITS OWN SPACE.</span></h2>
          </div>
          <div dir="rtl">
            <strong>الصفحات تبقى مرتبة حتى مع زيادة عدد المنتجات.</strong>
            <p>كل بوت منشور يحصل على صفحة مستقلة تعرض الوصف والمتطلبات والصلاحيات وروابط التوثيق والتثبيت بدل حشر كل التفاصيل في الصفحة الرئيسية.</p>
          </div>
        </div>

        <div className="platform-grid product-architecture-grid">
          {platformCategories.map((category) => (
            <article key={category.code} data-tilt>
              <span className="platform-code">{category.code}</span>
              <h3>{category.title}</h3>
              <strong dir="rtl">{category.arabic}</strong>
              <p>{category.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="suggestion-teaser page-section" data-reveal>
        <div>
          <p className="eyebrow">SUGGESTIONS</p>
          <h2>HELP SHAPE <span>THE NEXT RELEASE.</span></h2>
          <p dir="rtl">عندك فكرة لبوت جديد أو ميزة؟ أرسلها من مركز الاقتراحات، وتحصل على رقم متابعة وحالة واضحة للاقتراح.</p>
        </div>
        <div className="suggestion-teaser-card" data-tilt>
          <span>CREATOR DISCORD</span>
          <strong>{BRAND.discordUsername}</strong>
          <small>BUILT &amp; DEVELOPED BY HAMOOD — 001</small>
          <a href={ROUTES.suggestions}>فتح مركز الاقتراحات →</a>
        </div>
      </section>
    </>
  )
}
