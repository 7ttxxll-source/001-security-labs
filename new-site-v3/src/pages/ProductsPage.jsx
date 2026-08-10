import { PageHero, ProductCard } from "../components/PlatformShell"
import { platformCategories, productCatalog } from "../data/products"
import { BRAND, ROUTES } from "../siteConfig"

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="HAMOOD LABS / PRODUCT DIRECTORY"
        title="ALL SYSTEMS."
        accent="ONE ECOSYSTEM."
        arabicTitle="كل البوتات والأنظمة في مكان واحد."
        arabicText="هنا تشوف المنتجات الجاهزة، الأنظمة قيد التطوير، والمساحات المحجوزة للإصدارات القادمة. كل منتج جاهز يحصل على Product Center وتوثيق مستقل."
        actions={(
          <>
            <a className="primary-button" href={ROUTES.guardian}>OPEN 001 GUARDIAN <span>→</span></a>
            <a className="secondary-button" href={ROUTES.suggestions}>SUGGEST A PRODUCT <span>↗</span></a>
          </>
        )}
      >
        <div className="directory-overview-card" data-tilt>
          <span>CATALOG STATUS</span>
          <strong>03 SLOTS</strong>
          <div><i /> 001 LIVE</div>
          <div><i /> 002 IN DEVELOPMENT</div>
          <div><i className="muted-dot" /> 003 RESERVED</div>
        </div>
      </PageHero>

      <section className="products-directory-page page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">LIVE + UPCOMING + RESERVED</p>
            <h2>THE HAMOOD LABS <span>LINEUP.</span></h2>
          </div>
          <div dir="rtl">
            <strong>Guardian هو أول منتج فقط — مو كامل المنصة.</strong>
            <p>كل بطاقة هنا تمثل منتج مستقل. لما يصير أي بوت جاهز، يتحول من حالة التطوير إلى منتج له صفحة ودليل وتثبيت رسمي.</p>
          </div>
        </div>

        <div className="product-rail product-directory-grid">
          {productCatalog.map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>

        <div className="future-slot page-future-slot" data-tilt>
          <div><span>+</span><strong>004 / 005 / FUTURE PRODUCTS</strong></div>
          <p dir="rtl">معمارية الموقع جاهزة لإضافة منتجات جديدة بدون إعادة بناء الهوية أو خلط توثيق منتج مع منتج ثاني.</p>
        </div>
      </section>

      <section className="product-architecture page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">PRODUCT ARCHITECTURE</p>
            <h2>EVERY PRODUCT GETS <span>ITS OWN SPACE.</span></h2>
          </div>
          <div dir="rtl">
            <strong>ما نرمي كل شيء في الصفحة الرئيسية.</strong>
            <p>كل منتج جاهز له صفحة تعريف، خريطة قدرات، دليل استخدام، FAQ، مرجع أوامر ورابط تثبيت حسب احتياج المنتج نفسه.</p>
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
          <p className="eyebrow">WHAT SHOULD WE BUILD NEXT?</p>
          <h2>HELP SHAPE <span>THE NEXT RELEASE.</span></h2>
          <p dir="rtl">اقتراحك ممكن يكون ميزة لمنتج موجود أو فكرة لبوت جديد بالكامل. مركز الاقتراحات يرتب الفكرة عشان تقدر ترسلها مباشرة للمطور.</p>
        </div>
        <div className="suggestion-teaser-card" data-tilt>
          <span>CREATOR DISCORD</span>
          <strong>{BRAND.discordUsername}</strong>
          <small>BUILT &amp; DEVELOPED BY HAMOOD — 001</small>
          <a href={ROUTES.suggestions}>OPEN SUGGESTIONS →</a>
        </div>
      </section>
    </>
  )
}
