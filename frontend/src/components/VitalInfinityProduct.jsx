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
      ['Karela', '/images/product/WhatsApp Image 2026-09-10 at 1.36.01 PM (2).jpeg', { x: 42, y: 992, size: 94, width: 1054 }],
      ['Jamun', 'JAMUN.png'],
      ['Methi', 'METHI.png'],
      ['Neem', 'NEEM.png']
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
      ['Shilajit', 'Shilajit.png'],
      ['Kali Musli', '/images/botanicals/black-musli.png']
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
      ['Garcinia', 'carchinia.png'],
      ['Amla', 'AWALA.png'],
      ['Black Pepper', 'black-pepper-piperine.webp'],
      ['Ginger', 'ginger-extract.webp']
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
      ['Ashwagandha', 'ASWAGHANDHA.png'],
      ['Amla', 'AWALA.png'],
      ['Shatavari', 'satwari.png'],
      ['Shilajit', 'Shilajit.png']
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

const defaultViews = [
  { label: 'Full product', position: 'center', scale: 1 },
  { label: 'Bottle detail', position: 'center 40%', scale: 1.45 },
  { label: 'Label detail', position: 'center 65%', scale: 2 }
]

const deliveryBadges = [
  [Truck, 'Tracked delivery'],
  [LockKeyhole, 'Secure checkout'],
  [PackageCheck, 'Tested packaging']
]

export default function VitalInfinityProduct({ product }) {
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
      ['Ashwagandha', 'ASWAGHANDHA.png'],
      ['Amla', 'AWALA.png'],
      ['Shatavari', 'satwari.png'],
      ['Shilajit', 'Shilajit.png']
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

  const artwork = product?.cardImage || product?.images?.[0] || '/images/home/Vital.png'
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
  const curatedGallery = {
    'sugar-shield-blood-sugar-support': [
      { src: '/images/home/Suger sheid.png', label: 'Front view' },
      { src: '/images/product/sugar-shield-benefits-botanical.png', label: 'Benefits & suggested use' },
      { src: '/images/product/sugar-shield-back-botanical.png', label: 'Product information' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.01 PM (1).jpeg', label: 'Wellness poster' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.01 PM (2).jpeg', label: 'Botanical ingredients poster' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.35.59 PM (1).jpeg', label: 'All bottle views' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.35.59 PM.jpeg', label: 'Complete label' }
    ],
    'lean-shape-garcinia-cambogia': [
      { src: '/images/home/Lean.png', label: 'Front view' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.05 PM (1).jpeg', label: 'Transformation & wellness poster' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.05 PM.jpeg', label: 'Key benefits & ingredients' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.04 PM (3).jpeg', label: 'Product information' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.04 PM (1).jpeg', label: 'All bottle views' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.04 PM.jpeg', label: 'Complete label' }
    ],
    'endless-daily-wellness': [
      { src: '/images/home/Endless.png', label: 'Front view' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.03 PM (1).jpeg', label: 'Product poster' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.03 PM (2).jpeg', label: 'Lifestyle poster' },
      { src: '/images/product/endless-back-botanical.png', label: 'Product information' },
      { src: '/images/product/endless-all-views-botanical.png', label: 'All bottle views' },
      { src: '/images/product/WhatsApp Image 2026-09-10 at 1.36.01 PM (3).jpeg', label: 'Complete label' }
    ],
    'vital-infinity-multivitamin': [
      { src: '/images/home/Vital.png', label: 'Front view' },
      { src: '/images/product/vital-infinity-front-botanical.png', label: 'Front bottle view' },
      { src: '/images/product/vital-infinity-benefits-botanical.png', label: 'Benefits & ingredients' },
      { src: '/images/product/vital-infinity-back-botanical.png', label: 'Product information' },
      { src: '/images/product/WhatsApp Image 2026-09-01 at 7.06.31 PM (1).jpeg', label: 'Product poster' }
    ]
  }[product.slug]

  const galleryViews = curatedGallery
    ? curatedGallery.map(item => ({ ...item, scale: 1, position: 'center' }))
    : product.images?.length > 1
      ? product.images.map((src, index) => ({ src, label: `Product image ${index + 1}`, scale: 1, position: 'center' }))
      : defaultViews.map(item => ({ ...item, src: artwork }))

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
        <div className={`vital-gallery${curatedGallery ? ' vital-gallery-complete' : ''}${view === 0 ? ' sugar-gallery-front' : ''}`}>
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
          {curatedGallery && <div className="vital-gallery-caption">
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
              <Link to="/ingredients" key={name}>
                <span className="vital-ingredient-photo">
                  <img
                    loading="lazy"
                    src={file.startsWith('/') ? file : `/images/ingredients/${file}`}
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
          <Link className="vital-small-link" to="/ingredients">
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
