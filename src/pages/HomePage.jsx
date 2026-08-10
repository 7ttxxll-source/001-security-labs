import { CreatorRights, ProductCard } from "../components/PlatformShell"
import { platformCategories } from "../data/products"
import { useProducts } from "../hooks/useProducts"
import { usePlatformContent } from "../hooks/usePlatformContent"
import { BRAND, ROUTES } from "../siteConfig"

const builtFromZeroPrinciples = [
  { code: "01", title: "ORIGINAL ARCHITECTURE", arabic: "بنية أصلية", text: "كل نظام يبدأ من بنية خاصة فيه بدل الاعتماد على قالب جاهز أو منتج معاد تغليفه." },
  { code: "02", title: "CUSTOM LOGIC", arabic: "منطق برمجي خاص", text: "آلية العمل والتدفقات الداخلية تُبنى حسب وظيفة كل بوت وتجربته المطلوبة." },
  { code: "03", title: "PRODUCT IDENTITY", arabic: "هوية مستقلة", text: "لكل منتج اسم وهوية وتجربة استخدام وصفحة خاصة داخل منصة HAMOOD LABS." },
  { code: "04", title: "BUILT IN-HOUSE", arabic: "تصميم وتطوير داخلي", text: "من الفكرة إلى الواجهة والمنطق النهائي، يتم بناء المنتجات داخل HAMOOD LABS من الصفر." },
]

function PlatformNetworkCard({ stats }) {
  return (
    <div className="platform-network-card" data-tilt data-reveal>
      <div className="platform-network-top">
        <span><i /> HAMOOD LABS PLATFORM</span>
        <strong>ONLINE</strong>
      </div>
      <div className="platform-network-core">
        <div className="platform-core-mark">H<small>001</small></div>
        <div>
          <p>PRODUCT ECOSYSTEM</p>
          <h3>MULTI-SYSTEM PLATFORM</h3>
          <span>Managed from HAMOOD ADMIN.</span>
        </div>
      </div>
      <div className="platform-network-stats">
        <div><strong>{String(stats.live).padStart(2, "0")}</strong><span>LIVE PRODUCTS</span></div>
        <div><strong>{String(stats.building).padStart(2, "0")}</strong><span>IN DEVELOPMENT</span></div>
        <div><strong>∞</strong><span>FUTURE PRODUCTS</span></div>
      </div>
    </div>
  )
}

function BuiltFromZero() {
  return (
    <section className="built-zero page-section" data-reveal>
      <div className="built-zero-head">
        <div>
          <p className="eyebrow">HAMOOD LABS / ORIGINAL SYSTEMS</p>
          <h2>BUILT FROM <span>ZERO.</span></h2>
        </div>
        <div dir="rtl">
          <strong>أنظمة أصلية تُبنى من البداية — مو قوالب جاهزة.</strong>
          <p>جميع منتجات HAMOOD LABS يتم تصميمها وبرمجتها من الصفر؛ من الفكرة والبنية والمنطق الداخلي إلى الواجهة والهوية وتجربة الاستخدام النهائية.</p>
        </div>
      </div>
      <div className="built-zero-grid">
        {builtFromZeroPrinciples.map((item) => (
          <article key={item.code} data-tilt>
            <span>{item.code}</span>
            <small>{item.title}</small>
            <h3 dir="rtl">{item.arabic}</h3>
            <p dir="rtl">{item.text}</p>
          </article>
        ))}
      </div>
      <div className="built-zero-signature" data-tilt>
        <div className="built-zero-mark">H<small>001</small></div>
        <div>
          <span>ORIGINAL SYSTEMS / IN-HOUSE</span>
          <strong>BUILT &amp; DEVELOPED BY HAMOOD — 001</strong>
          <p dir="rtl">تصميم • برمجة • هوية • تجربة — من الصفر</p>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { products, stats } = useProducts()
  const { home, appearance } = usePlatformContent()
  const guardian = products.find((product) => product.slug === "guardian") || products[0]

  return (
    <>
      <section className="hero platform-home-hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          {appearance?.showNetworkStatus !== false && <div className="status-pill hero-enter hero-enter-one"><span className="status-dot" /> HAMOOD LABS NETWORK ONLINE <i>///</i></div>}
          <p className="eyebrow hero-enter hero-enter-two">{home?.eyebrow || "HAMOOD LABS / PRODUCT PLATFORM"}</p>
          <h1 className="hero-enter hero-enter-three">{home?.headline || "POWERING WHAT"} <span>{home?.accent || "HAPPENS NEXT."}</span></h1>
          <div className="hero-arabic hero-enter hero-enter-four" dir="rtl">
            <strong>{home?.title_ar || "منصة رئيسية للبوتات والأنظمة الحصرية."}</strong>
            <p>{home?.body_ar || "تجمع HAMOOD LABS المنتجات الحالية والقادمة في مكان واحد. كل منتج له صفحة مستقلة ومتطلبات واضحة وتوثيق وتثبيت رسمي عندما يكون جاهزًا."}</p>
          </div>
          <div className="hero-actions hero-enter hero-enter-five">
            <a className="primary-button" data-magnetic href={ROUTES.products}>استعرض المنتجات <span>→</span></a>
            <a className="secondary-button" data-magnetic href={ROUTES.suggestions}>أرسل اقتراحًا <span>↗</span></a>
          </div>
          <div className="home-platform-metrics" data-reveal>
            <div><strong>{String(stats.live).padStart(2, "0")}</strong><span>LIVE</span><small dir="rtl">منتج متاح</small></div>
            <div><strong>{String(stats.building).padStart(2, "0")}</strong><span>BUILDING</span><small dir="rtl">قيد التطوير</small></div>
            <div><strong>100%</strong><span>IN-HOUSE</span><small dir="rtl">تصميم وبرمجة أصلية</small></div>
          </div>
        </div>
        <div className="hero-visual platform-hero-stack">
          <CreatorRights />
          <PlatformNetworkCard stats={stats} />
        </div>
      </section>

      <section className="home-platform-intro page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">ONE BRAND / MULTIPLE PRODUCTS</p>
            <h2>ONE PLATFORM. <span>MULTIPLE SYSTEMS.</span></h2>
          </div>
          <div dir="rtl">
            <strong>إدارة مركزية، وصفحات مستقلة لكل منتج.</strong>
            <p>إضافة بوت جديد ما تحتاج إعادة بناء الموقع. المنتج يُضاف من لوحة الإدارة ويظهر تلقائيًا للزوار بعد النشر.</p>
          </div>
        </div>
        <div className="platform-grid">
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

      {guardian && (
        <section className="home-available page-section" data-reveal>
          <div className="available-home-copy">
            <p className="eyebrow">FEATURED PRODUCT</p>
            <span className="availability-pulse"><i /> {guardian.statusLabel}</span>
            <h2>{guardian.displayName}</h2>
            <h3 dir="rtl">منتج مميز داخل HAMOOD LABS.</h3>
            <p dir="rtl">{guardian.arabicDescription}</p>
            <div className="route-hero-actions">
              <a className="primary-button" href={guardian.href}>فتح صفحة المنتج <span>→</span></a>
              {guardian.installHref && <a className="secondary-button" data-discord-install href={guardian.installHref}>إضافة إلى Discord <span>↗</span></a>}
            </div>
          </div>
          <ProductCard product={guardian} />
        </section>
      )}

      <BuiltFromZero />

      <section className="home-product-preview page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">PRODUCT DIRECTORY / PREVIEW</p>
            <h2>CURRENT + <span>COMING NEXT.</span></h2>
          </div>
          <div dir="rtl">
            <strong>الكتالوج يتحدث من لوحة الإدارة.</strong>
            <p>أي منتج تنشره يظهر تلقائيًا هنا وفي صفحة المنتجات بدون تعديل يدوي لملفات الموقع.</p>
          </div>
        </div>
        <div className="product-rail compact-product-rail">
          {products.slice(0, 3).map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>
        <a className="directory-wide-link" href={ROUTES.products}>فتح جميع المنتجات <span>→</span></a>
      </section>

      <section className="suggestion-teaser page-section" data-reveal>
        <div>
          <p className="eyebrow">COMMUNITY INPUT / SUGGESTIONS</p>
          <h2>YOUR IDEA COULD BE <span>THE NEXT SYSTEM.</span></h2>
          <p dir="rtl">أرسل فكرتك من مركز الاقتراحات. بعد الإرسال تحصل على رقم متابعة، وتقدر الإدارة تغير حالتها من داخل HAMOOD ADMIN.</p>
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
