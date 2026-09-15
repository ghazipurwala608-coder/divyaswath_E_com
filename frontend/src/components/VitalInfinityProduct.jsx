import { useSiteContent } from '../context/SiteContentContext.jsx'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bone,
  Check,
  ChevronRight,
  Dumbbell,
  GlassWater,
  HeartPulse,
  Leaf,
  LockKeyhole,
  Minus,
  PackageCheck,
  Pill,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Sun,
  Truck,
  Zap
} from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'
import './VitalInfinityProduct.css'

const productConfigs = {
  'sugar-shield-blood-sugar-support': {
    eyebrow: 'Metabolic Wellness',
    EyebrowIcon: ShieldCheck,
    intro1: 'Blood sugar support. A healthier routine.',
    intro2: 'Make responsible metabolic wellness a little simpler.',
    facts: [
      [Pill, 'Capsule format'],
      [Leaf, 'Botanical blend'],
      [ShieldCheck, 'Sugar balance']
    ],
    benefits: [
      [ShieldCheck, 'Sugar Balance', 'Targeted Ayurvedic botanicals to support healthy glucose levels.'],
      [Zap, 'Steady Energy', 'Helps avoid mid-day energy dips and promotes even vitality.'],
      [HeartPulse, 'Metabolic Care', 'A thoughtful addition to your daily metabolic wellness routine.'],
      [Dumbbell, 'Active Lifestyle', 'Botanical nutrition to complement a mindful, healthy routine.'],
      [Leaf, 'Herbal Nourishment', 'Crafted with Jamun, Neem, Methi, and natural plant antioxidants.']
    ],
    ingredients: [
      ['Jamun', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450576/divyaswasth/migrated/1061fc5d025c5529-jammun.png'],
      ['Vijaysar', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450550/divyaswasth/migrated/0c5d6f65834142eb-bijasar.png'],
      ['Bimbi', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450556/divyaswasth/migrated/fb47d9b213f36551-bimbi.png'],
      ['Mamraaj', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450584/divyaswasth/migrated/1c5f8cf021732766-mamraaj.png'],
      ['Methi', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450517/divyaswasth/migrated/f2f8ffaf0989f51c-METHI.png'],
      ['Neem', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450522/divyaswasth/migrated/4cffd1b049f9d2c6-NEEM.png'],
      ['Vang Bhasma', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450546/divyaswasth/migrated/6f10bedca13a8ccf-bang_basma.png'],
      ['Ashwagandha', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450539/divyaswasth/migrated/8b02594c139f3494-awasghanga.png']
    ],
    formula: [
      'A convenient capsule format',
      'Created for metabolic wellness support',
      'Synergistic Ayurvedic botanicals',
      'Complements a balanced diabetic diet',
      'Store in a cool, dry place',
      'Follow the product label'
    ],
    steps: [
      [Pill, '01', 'Follow the label', 'Take 1-2 capsules daily as directed on the label.'],
      [GlassWater, '02', 'Take before meals', 'Consume with lukewarm water 30 mins before food.'],
      [Sun, '03', 'Stay consistent', 'Maintain your daily routine for optimal balance.']
    ],
    values: [
      [Leaf, 'Botanical inspiration'],
      [Pill, 'Easy daily format'],
      [Sprout, 'Metabolic balance'],
      [ShieldCheck, 'Thoughtful self-care'],
      [Zap, 'Natural vitality'],
      [Sun, 'Everyday wellness']
    ]
  },
  'endless-daily-wellness': {
    eyebrow: 'Daily Wellness Support',
    EyebrowIcon: Zap,
    intro1: 'Daily stamina & vitality. A healthier routine.',
    intro2: 'Make everyday vigor and strength a little simpler.',
    facts: [
      [Pill, 'Capsule format'],
      [Zap, 'Daily stamina'],
      [Sun, 'Active energy']
    ],
    benefits: [
      [Zap, 'Stamina & Vigor', 'Fuel your daily energy, physical endurance and vitality naturally.'],
      [Dumbbell, 'Strength & Power', 'Botanical support to help maintain peak daily performance.'],
      [HeartPulse, 'Overall Well-being', 'Comprehensive rejuvenation for everyday confidence and drive.'],
      [Sun, 'Mental Clarity', 'Helps reduce daily stress, calm fatigue and maintain focus.'],
      [ShieldCheck, 'Immune Health', 'Potent adaptogens like Ashwagandha and Shilajit for natural defense.']
    ],
    ingredients: [
      ['Shilajit', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450533/divyaswasth/migrated/8dc7938b2011a293-Shilajit.png'],
      ['Ashwagandha', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450423/divyaswasth/migrated/a84b254da2de06ba-ASWAGHANDHA.png'],
      ['Shatavari', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450527/divyaswasth/migrated/a68cb1672af94d23-satwari.png'],
      ['Kaunch Beej', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450621/divyaswasth/migrated/bc3454ae8e077d32-beej.png'],
      ['Safed Musli', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450265/divyaswasth/migrated/0f9056942f56f993-safed-musli.png'],
      ['Gokshura', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450261/divyaswasth/migrated/d32bba2e66f5b986-gokshura.png'],
      ['Kali Musli', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450260/divyaswasth/migrated/8d5d5daa4ab6bae8-black-musli.png'],
      ['Amla', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450428/divyaswasth/migrated/b820178af18d4af3-AWALA.png']
    ],
    formula: [
      'High-potency botanical extracts',
      'Formulated for daily stamina and vigor',
      'Fits seamlessly into your morning routine',
      'Complements an active lifestyle & fitness',
      'Store in a cool, dry place',
      'Follow the product label'
    ],
    steps: [
      [Pill, '01', 'Follow the label', 'Use recommended serving of 1 capsule twice daily.'],
      [GlassWater, '02', 'Take with milk/water', 'Take after meals with warm water or milk.'],
      [Sun, '03', 'Stay consistent', 'Make vitality a daily ritual for sustained endurance.']
    ],
    values: [
      [Leaf, 'Botanical inspiration'],
      [Pill, 'Easy daily format'],
      [Zap, 'Stamina & power'],
      [ShieldCheck, 'Thoughtful self-care'],
      [Dumbbell, 'Peak performance'],
      [Sun, 'Everyday wellness']
    ]
  },
  'lean-shape-garcinia-cambogia': {
    eyebrow: 'Weight Management',
    EyebrowIcon: Leaf,
    intro1: 'Mindful weight support. An active routine.',
    intro2: 'Make healthy fitness and body goals a little simpler.',
    facts: [
      [Pill, 'Capsule format'],
      [Leaf, 'Garcinia extract'],
      [Dumbbell, 'Active metabolism']
    ],
    benefits: [
      [Leaf, 'Weight Support', 'Designed to complement mindful nutrition and active fitness goals.'],
      [Zap, 'Metabolism Boost', 'Garcinia Cambogia and Green Coffee support natural calorie burn.'],
      [HeartPulse, 'Appetite Balance', 'Helps promote satiety and manage daily cravings naturally.'],
      [Dumbbell, 'Active Energy', 'Stay energized throughout workouts without mid-day crashes.'],
      [Sprout, 'Digestive Wellness', 'Botanical ginger and piperine for enhanced absorption and comfort.']
    ],
    ingredients: [
      ['Garcinia', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450438/divyaswasth/migrated/a12c090f5b7a9fd6-carchinia.png'],
      ['Harad', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450488/divyaswasth/migrated/a4099b16e68dc39b-Harar.png'],
      ['Kali Mirch', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450493/divyaswasth/migrated/804bd9059c82a17c-Kalinmich.png'],
      ['Baheda', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450475/divyaswasth/migrated/5a5a691e15ba2644-baheda.png'],
      ['Green Tea', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450480/divyaswasth/migrated/7e31a65044337211-chaa.png'],
      ['Chitrak', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450484/divyaswasth/migrated/350e29c1971d2662-chitrak.png'],
      ['Pippali', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450502/divyaswasth/migrated/43519a482d717d1b-pipal.png'],
      ['Ginger', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450512/divyaswasth/migrated/9a8304a4ff27bb00-saunth.png']
    ],
    formula: [
      'Standardized Garcinia Cambogia extract',
      'Formulated for healthy weight management',
      'Complements a balanced diet & active exercise',
      'Enhanced with green tea & green coffee',
      'Store in a cool, dry place',
      'Follow the product label'
    ],
    steps: [
      [Pill, '01', 'Follow the label', 'Take 1 capsule twice daily as recommended.'],
      [GlassWater, '02', 'Take before meals', 'Take 30–45 minutes before meals with water.'],
      [Sun, '03', 'Stay consistent', 'Pair with hydration, daily movement, and clean eating.']
    ],
    values: [
      [Leaf, 'Botanical inspiration'],
      [Pill, 'Easy daily format'],
      [Sprout, 'Metabolic support'],
      [ShieldCheck, 'Thoughtful self-care'],
      [Dumbbell, 'Active fitness'],
      [Sun, 'Everyday wellness']
    ]
  },
  'vital-infinity-multivitamin': {
    eyebrow: 'Daily Nutrition',
    EyebrowIcon: Sprout,
    intro1: 'Daily nutrition. A healthier routine.',
    intro2: 'Make everyday wellness a little simpler.',
    facts: [
      [Pill, 'Capsule format'],
      [Leaf, 'Greens blend'],
      [Sun, 'Daily wellness']
    ],
    benefits: [
      [ShieldCheck, 'Immune support', 'Everyday nutrition for your wellness routine.'],
      [Zap, 'Energy & vitality', 'Make room for a more balanced, active day.'],
      [HeartPulse, 'Overall wellness', 'A simple addition to your daily self-care.'],
      [Dumbbell, 'An active lifestyle', 'Nutrition to complement healthy habits.'],
      [Bone, 'Daily nutrition', 'Your everyday multivitamin ritual.']
    ],
    ingredients: [
      ['Ashwagandha', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450423/divyaswasth/migrated/a84b254da2de06ba-ASWAGHANDHA.png'],
      ['Amla', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450595/divyaswasth/migrated/6173fcaa823e1f94-awala.png'],
      ['Shatavari', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450527/divyaswasth/migrated/a68cb1672af94d23-satwari.png'],
      ['Shilajit', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450627/divyaswasth/migrated/355c562275d3f380-Shilajit.png'],
      ['Baheda', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450603/divyaswasth/migrated/47ae3f168c3dee0b-baheda.png'],
      ['Kaunch Beej', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450621/divyaswasth/migrated/bc3454ae8e077d32-beej.png']
    ],
    formula: [
      'A convenient capsule format',
      'Created for everyday wellness',
      'Fits into your daily routine',
      'Complements a balanced diet',
      'Store in a cool, dry place',
      'Follow the product label'
    ],
    steps: [
      [Pill, '01', 'Follow the label', 'Use the recommended serving of 1 capsule daily.'],
      [GlassWater, '02', 'Take with water', 'Follow the label’s directions after breakfast.'],
      [Sun, '03', 'Stay consistent', 'Make wellness a daily habit.']
    ],
    values: [
      [Leaf, 'Botanical inspiration'],
      [Pill, 'Easy daily format'],
      [Sprout, 'Balanced nutrition'],
      [ShieldCheck, 'Thoughtful self-care'],
      [Zap, 'Daily vitality'],
      [Sun, 'Everyday wellness']
    ]
  }
}

const deliveryBadges = [[Truck, 'Tracked delivery'], [LockKeyhole, 'Secure checkout'], [PackageCheck, 'Tested packaging']]

export default function VitalInfinityProduct({ product }) {
  const ingredientImages = useSiteContent('product-ingredient-images')
  const [quantity, setQuantity] = useState(1)
  const [view, setView] = useState(0)
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const { products } = useProducts()
  const relatedProducts = products.filter(item => item.slug !== product.slug).slice(0, 3)

  const config = productConfigs[product?.slug] || {
    eyebrow: product?.category || 'Wellness Support',
    EyebrowIcon: Sprout,
    intro1: `${product?.name || 'Ayurvedic Wellness'}. A healthier routine.`,
    intro2: 'Make everyday wellness a little simpler.',
    facts: [
      [Pill, 'Capsule format'],
      [Leaf, 'Natural botanicals'],
      [Sun, 'Daily wellness']
    ],
    benefits: [
      [ShieldCheck, 'Natural Support', 'Everyday botanical support for your wellness routine.'],
      [Zap, 'Energy & Vitality', 'Make room for a more balanced, active day.'],
      [HeartPulse, 'Overall Wellness', 'A simple addition to your daily self-care.'],
      [Dumbbell, 'Active Lifestyle', 'Nutrition to complement healthy habits.'],
      [Bone, 'Holistic Care', 'Your everyday wellness ritual.']
    ],
    ingredients: [
      ['Ashwagandha', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450423/divyaswasth/migrated/a84b254da2de06ba-ASWAGHANDHA.png'],
      ['Amla', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450428/divyaswasth/migrated/b820178af18d4af3-AWALA.png'],
      ['Shatavari', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450527/divyaswasth/migrated/a68cb1672af94d23-satwari.png'],
      ['Shilajit', 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450533/divyaswasth/migrated/8dc7938b2011a293-Shilajit.png']
    ],
    formula: [
      'A convenient capsule format',
      'Created for everyday wellness',
      'Fits into your daily routine',
      'Complements a balanced diet',
      'Store in a cool, dry place',
      'Follow the product label'
    ],
    steps: [
      [Pill, '01', 'Follow the label', 'Use the recommended serving.'],
      [GlassWater, '02', 'Take with water', 'Follow the label’s directions.'],
      [Sun, '03', 'Stay consistent', 'Make wellness a daily habit.']
    ],
    values: [
      [Leaf, 'Botanical inspiration'],
      [Pill, 'Easy daily format'],
      [Sprout, 'Balanced nutrition'],
      [ShieldCheck, 'Thoughtful self-care'],
      [Zap, 'Daily vitality'],
      [Sun, 'Everyday wellness']
    ]
  }

  const artwork = product?.cardImage || product?.images?.[0] || 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450413/divyaswasth/migrated/cd90920cf0c446e8-Vital.png'
  const available = product?.availableForPurchase !== false && (product?.countInStock || 0) > 0 && (product?.price || 0) > 0
  const maxStock = Math.min(product?.countInStock || 0, 10)

  const purchase = (checkout = false) => {
    if (!available) return
    addToCart(
      { ...product, images: product.images?.length ? product.images : [artwork] },
      Math.min(quantity, maxStock)
    )
    if (checkout) navigate('/checkout')
  }

  const { EyebrowIcon } = config


  const galleryViews = product.images?.length
    ? product.images.map((src, index) => ({ src, label: `Product image ${index + 1}`, scale: 1, position: 'center' }))
    : [{ src: artwork, label: 'Product image', scale: 1, position: 'center' }]

  const currentView = galleryViews[view] || galleryViews[0]

  return (
    <div className="vital-page">
      {/* ── BREADCRUMB ── */}
      <nav className="vital-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight />
        <Link to="/shop">Our products</Link>
        <ChevronRight />
        <span>{product.name}</span>
      </nav>

      {/* ── HERO ── */}
      <section className="vital-hero" aria-labelledby="vital-title">
        <div className={`vital-gallery vital-gallery-complete${view === 0 ? ' sugar-gallery-front' : ''}`}>
          <div className="vital-thumbnails">
            {galleryViews.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                title={item.label}
                aria-pressed={view === index}
                onClick={() => setView(index)}
              >
                <img
                  src={item.src}
                  alt=""
                  style={{
                    transform: `scale(${item.scale})`,
                    transformOrigin: item.position
                  }}
                />
              </button>
            ))}
            <span>
              <Leaf />
              Inspired by nature
            </span>
          </div>
          <div className="vital-main-image">
            <img
              src={currentView.src}
              fetchPriority="high"
              alt={`${product.name} ${product.subtitle} — ${currentView.label.toLowerCase()}`}
              style={{
                transform: `scale(${currentView.scale})`,
                transformOrigin: currentView.position
              }}
            />
          </div>
          {galleryViews.length > 0 && <div className="vital-gallery-caption">
            <span aria-live="polite">{currentView.label} · {view + 1} / {galleryViews.length}</span>
            <a href={currentView.src} target="_blank" rel="noreferrer">View full size ↗</a>
          </div>}
        </div>

        <div className="vital-summary">
          <p className="vital-stock"><span />{available ? 'Available to order' : 'Currently unavailable'}</p>
          <span className="vital-eyebrow">
            <EyebrowIcon size={13} />
            {config.eyebrow}
          </span>
          <h1 id="vital-title">{product.name}</h1>
          <h2>{product.subtitle}</h2>
          <p className="vital-intro">
            {config.intro1}
            <br />
            {config.intro2}
          </p>

          <div className="vital-facts">
            {product.size && <div><span className="vital-size-value">{product.size.split(' ')[0]}</span><span>{product.size.split(' ').slice(1).join(' ')}</span></div>}
            {config.facts.map(([Icon, label]) => (
              <div key={label}>
                <Icon />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="vital-price">
            {product.price ? `₹${product.price.toLocaleString('en-IN')}/-` : 'Coming soon'}
          </div>
          <p className="vital-tax">MRP inclusive of all taxes</p>

          <div className="vital-quantity">
            <span>Quantity</span>
            <div>
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || !available}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={13} />
              </button>
              <output aria-live="polite">{quantity}</output>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={!available || quantity >= maxStock}
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="vital-actions">
            <button type="button" disabled={!available} onClick={() => purchase(false)}>
              <ShoppingBag size={16} />
              {available ? 'Add to cart' : 'Coming soon'}
            </button>
            <button type="button" disabled={!available} onClick={() => purchase(true)}>
              Buy now
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="vital-delivery">
            {deliveryBadges.map(([Icon, label]) => (
              <span key={label}>
                <Icon />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY YOU'LL LOVE IT ── */}
      <section className="vital-benefits" aria-labelledby="vital-benefits-title">
        <h2 id="vital-benefits-title">Why you’ll love it</h2>
        <div>
          {config.benefits.map(([Icon, title, text]) => (
            <article key={title}>
              <span className="vital-icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 3-COLUMN DETAILS ── */}
      <div className="vital-details">
        {/* WHAT'S INSIDE? */}
        <section className="vital-inside">
          <h2>What’s inside?</h2>
          <p>Discover our botanical ingredients</p>
          <div className="vital-ingredients" style={{ '--ingredient-columns': Math.min(config.ingredients.length, 4) }}>
            {config.ingredients.map(([name, file, crop]) => (
              <Link to={`/ingredients?product=${product.slug}&search=${encodeURIComponent(name)}`} key={name}>
                <span className="vital-ingredient-photo">
                  <img
                    loading="lazy"
                    src={ingredientImages[product.slug]?.[name] || (file.startsWith('/') || file.startsWith('https://') ? file : `/images/ingredients/${file}`)}
                    alt={name}
                    style={crop ? {
                      position: 'absolute',
                      width: `${crop.width / crop.size * 100}%`,
                      maxWidth: 'none',
                      left: `${-crop.x / crop.size * 100}%`,
                      top: `${-crop.y / crop.size * 100}%`,
                      aspectRatio: 'auto',
                      borderRadius: 0
                    } : undefined}
                  />
                </span>
                <strong>{name}</strong>
              </Link>
            ))}
          </div>
          <p className="vital-small">
            Explore the botanical range. Refer to the product label for the complete formula.
          </p>
          <Link className="vital-small-link" to={`/ingredients?product=${product.slug}`}>
            Explore all ingredients
            <ArrowRight size={12} />
          </Link>
        </section>

        {/* THE FORMULA */}
        <section className="vital-formula">
          <h2>The formula</h2>
          <p>A little care. Every single day.</p>
          <ul>
            {config.formula.map((text) => (
              <li key={text}>
                <Check size={13} />
                {text}
              </li>
            ))}
          </ul>
          <a className="vital-small-link" href="#vital-product-details">
            View product details
            <ArrowRight size={12} />
          </a>
        </section>

        {/* HOW TO USE */}
        <section className="vital-how">
          <h2>How to use</h2>
          <p>Simple steps for your daily routine</p>
          <div className="vital-steps">
            {config.steps.map(([Icon, step, title, text]) => (
              <article key={step}>
                <span className="vital-icon">
                  <Icon />
                  <b>{step}</b>
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="vital-use-note">{product.usage}</p>
        </section>
      </div>

      {/* ── A MINDFUL WELLNESS ROUTINE ── */}
      <section className="vital-bottom">
        <div>
          <h2>A mindful wellness routine</h2>
          <div className="vital-values">
            {config.values.map(([Icon, text]) => (
              <div key={text}>
                <span className="vital-icon">
                  <Icon />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <Link to="/about" className="vital-story">
          <img loading="lazy" src={artwork} alt={product.name} />
          <div>
            <h3>
              Nature-inspired.
              <br />
              Made for your everyday.
            </h3>
            <p>Discover the Divya Swasth story.</p>
            <span>
              Explore our story
              <ArrowRight size={12} />
            </span>
          </div>
        </Link>
      </section>

      <section className="vital-discover" aria-label="Explore more wellness products">
        <div className="vital-support-card"><span className="vital-icon"><Leaf /></span><h2>Wellness, with a little guidance.</h2><p>Questions about ingredients or your order? Our team is here to help.</p><Link to="/contact">Talk to our team <ArrowRight size={14} /></Link></div>
        <div className="vital-related">
          <h2>Complete your wellness routine</h2>
          <div>
            {relatedProducts.map(item => (
              <Link
                key={item.slug}
                to={`/products/${item.slug}`}
                onClick={() => window.scrollTo(0, 0)}
                className="vital-related-product"
              >
                <img loading="lazy" src={item.cardImage || item.images?.[0]} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.subtitle}</p>
                <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)} <ArrowRight size={12} /></span>
              </Link>
            ))}
          </div>
        </div>
        <div className="vital-explore-card"><p>YOUR DAILY DOSE OF CARE</p><h2>Find your wellness ritual.</h2><span>Explore thoughtfully selected Ayurvedic blends for your everyday.</span><Link to="/shop">Explore all products <ArrowRight size={14} /></Link></div>
      </section>

      {/* ── ACCORDION DETAILS ── */}
      <details id="vital-product-details" className="vital-product-details">
        <summary>Product information & care</summary>
        <div>
          <p>{product.description}</p>
          <p>
            <strong>Storage:</strong> {product.storage}
          </p>
          <p>{product.disclaimer}</p>
        </div>
      </details>
    </div>
  )
}
