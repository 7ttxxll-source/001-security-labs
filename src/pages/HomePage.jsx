import { CreatorRights, ProductCard } from "../components/PlatformShell"
import { platformCategories, productCatalog } from "../data/products"
import { BRAND, ROUTES } from "../siteConfig"

const builtFromZeroPrinciples = [
  { code: "01", title: "ORIGINAL ARCHITECTURE", arabic: "بنية أصلية", text: "كل نظام يبدأ من بنية خاصة فيه بدل الاعتماد على قالب جاهز أو منتج معاد تغليفه." },
  { code: "02", title: "CUSTOM LOGIC", arabic: "منطق برمجي خاص", text: "آلية العمل والتدفقات الداخلية تُبنى حسب وظيفة كل بوت وتجربته المطلوبة." },
  { code: "03", title: "PRODUCT IDENTITY", arabic: "هوية مستقلة", text: "لكل منتج اسم وهوية وتجربة استخدام وصفحة خاصة داخل منصة HAMOOD LABS." },
  { code: "04", title: "BUILT IN-HOUSE", arabic: "تصميم وتطوير داخلي", text: "من الفكرة إلى الواجهة والمنطق النهائي، يتم بناء المنتجات داخل HAMOOD LABS من الصفر." },
]

function PlatformNetworkCard() {
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
          <span>Built to expand without rebuilding the brand.</span>
        </div>
      </div>
      <div className="platform-network-stats">
        <div><strong>01</strong><span>LIVE PRODUCT</span></div>
        <div><strong>01</strong><span>IN DEVELOPMENT</span></div>
        <div><strong>∞</strong><span>FUTURE SLOTS</span></div>
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
          <p>
            جميع بوتات وأنظمة HAMOOD LABS يتم تصميمها وبرمجتها من الصفر؛ من الفكرة والبنية والمنطق الداخلي إلى الواجهة والهوية وتجربة الاستخدام النهائية.
          </p>
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
  const guardian = productCatalog[0]

  return (
    <>
      <section className="hero platform-home-hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <div className="status-pill hero-enter hero-enter-one"><span className="status-dot" /> HAMOOD LABS NETWORK ONLINE <i>///</i></div>
          <p className="eyebrow hero-enter hero-enter-two">HAMOOD LABS / PRODUCT PLATFORM</p>
          <h1 className="hero-enter hero-enter-three">POWERING WHAT <span>HAPPENS NEXT.</span></h1>
          <div className="hero-arabic hero-enter hero-enter-four" dir="rtl">
            <strong>منصة رئيسية لجميع البوتات والأنظمة الحصرية.</strong>
            <p>
              HAMOOD LABS مو موقع لبوت واحد. هي منصة تجمع المنتجات الحالية والقادمة، وكل بوت له صفحة مستقلة، دليل استخدام، توثيق وهوية خاصة فيه.
            </p>
          </div>
          <div className="hero-actions hero-enter hero-enter-five">
            <a className="primary-button" data-magnetic href={ROUTES.products}>EXPLORE PRODUCTS <span>→</span></a>
            <a className="secondary-button" data-magnetic href={ROUTES.suggestions}>SEND A SUGGESTION <span>↗</span></a>
          </div>
          <div className="home-platform-metrics" data-reveal>
            <div><strong>001</strong><span>LIVE</span><small dir="rtl">منتج جاهز</small></div>
            <div><strong>002</strong><span>BUILDING</span><small dir="rtl">حصري قادم</small></div>
            <div><strong>100%</strong><span>IN-HOUSE</span><small dir="rtl">تصميم وبرمجة أصلية</small></div>
          </div>
        </div>
        <div className="hero-visual platform-hero-stack">
          <CreatorRights />
          <PlatformNetworkCard />
        </div>
      </section>

      <section className="home-platform-intro page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">ONE BRAND / MULTIPLE PRODUCTS</p>
            <h2>ONE PLATFORM. <span>MULTIPLE SYSTEMS.</span></h2>
          </div>
          <div dir="rtl">
            <strong>كل منتج يعيش داخل المنصة بهويته الخاصة.</strong>
            <p>اليوم Guardian، بكرة 002، وبعدها أي نظام جديد. ما نعيد بناء الموقع من جديد؛ نضيف المنتج إلى نفس المعمارية.</p>
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

      <section className="home-available page-section" data-reveal>
        <div className="available-home-copy">
          <p className="eyebrow">AVAILABLE NOW / PRODUCT 001</p>
          <span className="availability-pulse"><i /> READY TO DEPLOY</span>
          <h2>001 GUARDIAN</h2>
          <h3 dir="rtl">أول منتج جاهز داخل HAMOOD LABS.</h3>
          <p dir="rtl">
            نظام حماية واسترجاع لديسكورد. صفحة Guardian تحتوي شرح النظام، خريطة الوحدات، القدرات، دورة الحادث، دليل الاستخدام، الأوامر والأسئلة المهمة.
          </p>
          <div className="route-hero-actions">
            <a className="primary-button" href={ROUTES.guardian}>OPEN PRODUCT CENTER <span>→</span></a>
            <a className="secondary-button" href={ROUTES.guardianDocs}>USER GUIDE <span>↗</span></a>
          </div>
        </div>
        <ProductCard product={guardian} />
      </section>

      <BuiltFromZero />

      <section className="home-product-preview page-section" data-reveal>
        <div className="section-heading-split">
          <div>
            <p className="eyebrow">PRODUCT DIRECTORY / PREVIEW</p>
            <h2>CURRENT + <span>COMING NEXT.</span></h2>
          </div>
          <div dir="rtl">
            <strong>المنتجات الثانية لها مكانها الواضح.</strong>
            <p>الرئيسية تعطيك نظرة فقط. صفحة Products هي المكان الكامل لعرض كل بوت جاهز، قيد التطوير أو محجوز للمستقبل.</p>
          </div>
        </div>
        <div className="product-rail compact-product-rail">
          {productCatalog.slice(0, 3).map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>
        <a className="directory-wide-link" href={ROUTES.products}>OPEN FULL PRODUCT DIRECTORY <span>→</span></a>
      </section>

      <section className="suggestion-teaser page-section" data-reveal>
        <div>
          <p className="eyebrow">COMMUNITY INPUT / SUGGESTIONS</p>
          <h2>YOUR IDEA COULD BE <span>THE NEXT SYSTEM.</span></h2>
          <p dir="rtl">
            عندك فكرة بوت، ميزة، تحسين للموقع أو اقتراح لمنتج قادم؟ فيه مركز اقتراحات مستقل يرتب فكرتك ويجهزها للإرسال للمطور مباشرة.
          </p>
        </div>
        <div className="suggestion-teaser-card" data-tilt>
          <span>CREATOR DISCORD</span>
          <strong>{BRAND.discordUsername}</strong>
          <small dir="rtl">الشرطة السفلية جزء من بداية اليوزر</small>
          <a href={ROUTES.suggestions}>OPEN SUGGESTION CENTER →</a>
        </div>
      </section>
    </>
  )
}
