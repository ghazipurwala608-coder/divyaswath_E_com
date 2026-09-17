import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag, 
  PhoneCall, 
  RotateCcw, 
  HeartHandshake, 
  FlaskConical, 
  Flame, 
  Activity, 
  Dumbbell,
  Check,
  Star,
  Clock,
  UserCheck,
  FileText,
  BadgePercent
} from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { apiRequest } from '../api/client.js'
import './ProductStoryAssessment.css'

const HEALTH_GOALS = [
  {
    id: 'metabolic',
    title: 'Blood Sugar & Metabolic Balance',
    subtitle: 'Holistic glycemic support, energy balance & natural insulin sensitivity',
    icon: Activity,
    badge: 'High Demand',
    slug: 'sugar-shield-blood-sugar-support',
    herbs: ['Jamun Seed', 'Karela', 'Gudmar', 'Vijaysar'],
    herbImages: [
      { name: 'Jamun', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450576/divyaswasth/migrated/1061fc5d025c5529-jammun.png' },
      { name: 'Vijaysar', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450550/divyaswasth/migrated/0c5d6f65834142eb-bijasar.png' },
      { name: 'Methi', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450517/divyaswasth/migrated/f2f8ffaf0989f51c-METHI.png' }
    ]
  },
  {
    id: 'stamina',
    title: 'Men’s Vitality, Energy & Stamina',
    subtitle: 'Pure Himalayan Shilajit & herbs to restore physical endurance & vigor',
    icon: Flame,
    badge: 'Doctor Recommended',
    slug: 'endless-daily-wellness',
    herbs: ['Pure Shilajit', 'Ashwagandha', 'Safed Musli', 'Gokshura'],
    herbImages: [
      { name: 'Shilajit', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450533/divyaswasth/migrated/8dc7938b2011a293-Shilajit.png' },
      { name: 'Ashwagandha', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450423/divyaswasth/migrated/a84b254da2de06ba-ASWAGHANDHA.png' },
      { name: 'Safed Musli', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450265/divyaswasth/migrated/0f9056942f56f993-safed-musli.png' }
    ]
  },
  {
    id: 'weight',
    title: 'Healthy Weight & Metabolism Detox',
    subtitle: 'Natural appetite balance, lipid metabolism & digestive gut cleanse',
    icon: Dumbbell,
    badge: '100% Plant Based',
    slug: 'lean-shape-garcinia-cambogia',
    herbs: ['Garcinia Cambogia', 'Green Tea', 'Guggulu', 'Triphala'],
    herbImages: [
      { name: 'Garcinia', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450438/divyaswasth/migrated/a12c090f5b7a9fd6-carchinia.png' },
      { name: 'Harad', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450488/divyaswasth/migrated/a4099b16e68dc39b-Harar.png' },
      { name: 'Green Tea', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450480/divyaswasth/migrated/7e31a65044337211-chaa.png' }
    ]
  },
  {
    id: 'nutrition',
    title: 'Daily Immunity & Complete Nutrition',
    subtitle: 'Whole-body antioxidant support, daily vitality & cellular longevity',
    icon: Leaf,
    badge: 'Everyday Essential',
    slug: 'vital-infinity-multivitamin',
    herbs: ['Amla Extract', 'Moringa', 'Giloy', 'Shatavari'],
    herbImages: [
      { name: 'Amla', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450595/divyaswasth/migrated/6173fcaa823e1f94-awala.png' },
      { name: 'Ashwagandha', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450423/divyaswasth/migrated/a84b254da2de06ba-ASWAGHANDHA.png' },
      { name: 'Shatavari', img: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450527/divyaswasth/migrated/a68cb1672af94d23-satwari.png' }
    ]
  }
]

const DURATION_OPTIONS = [
  { id: 'preventive', label: 'Preventive Care / Just Starting', desc: 'Looking for natural daily balance and early care' },
  { id: 'recent', label: 'Less than 6 Months', desc: 'Recently noticed symptoms and seeking natural healing' },
  { id: 'moderate', label: '6 Months to 2 Years', desc: 'Managing ongoing symptoms with regular lifestyle changes' },
  { id: 'chronic', label: 'More than 2 Years', desc: 'Looking for a proven, root-cause Ayurvedic formulation' }
]

const AGE_GROUPS = ['18 - 30 Years', '31 - 45 Years', '46 - 60 Years', 'Above 60 Years']

export default function ProductStoryAssessment() {
  const [activeTab, setActiveTab] = useState('story') // 'story' | 'assessment'
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState(HEALTH_GOALS[0].id)
  const [duration, setDuration] = useState(DURATION_OPTIONS[0].label)
  const [ageGroup, setAgeGroup] = useState(AGE_GROUPS[1])
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const { products } = useProducts()
  const { addToCart } = useCart()

  const currentGoalObj = HEALTH_GOALS.find(g => g.id === selectedGoal) || HEALTH_GOALS[0]
  const matchedProduct = products.find(p => p.slug === currentGoalObj.slug) || products[0]

  const handleNextStep = () => {
    if (step === 1 && !selectedGoal) return
    if (step === 2 && (!duration || !ageGroup)) return
    if (step === 3) {
      const errs = {}
      if (!formData.name.trim()) errs.name = 'Please enter your name'
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
        errs.phone = 'Please enter a valid 10-digit WhatsApp number'
      }
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      setErrors({})
      setIsSubmitting(true)
      
      const leadPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        goal: currentGoalObj.title,
        goalId: currentGoalObj.id,
        duration,
        ageGroup,
        productSlug: matchedProduct?.slug || currentGoalObj.slug,
        productName: matchedProduct?.name || currentGoalObj.title
      }

      // Save to MongoDB via backend API
      apiRequest('/wellness/assessment-lead', {
        method: 'POST',
        body: JSON.stringify(leadPayload)
      }).catch(err => {
        console.warn('Backend lead sync failed, saved locally:', err?.message || err)
      })

      // Also persist to localStorage for client resiliency
      try {
        const localLead = { ...leadPayload, submittedAt: new Date().toISOString() }
        const existingLeads = JSON.parse(localStorage.getItem('divyaswasth_assessment_leads') || '[]')
        existingLeads.push(localLead)
        localStorage.setItem('divyaswasth_assessment_leads', JSON.stringify(existingLeads))
      } catch (e) {
        // Continue gracefully
      }

      setTimeout(() => {
        setIsSubmitting(false)
        setStep(4)
      }, 300)
      return
    }
    setStep(prev => prev + 1)
  }

  const handleAddToCart = () => {
    if (matchedProduct) {
      addToCart(matchedProduct, 1)
      setIsAddedToCart(true)
      setTimeout(() => setIsAddedToCart(false), 3000)
    }
  }

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(
      `Namaste Divya Swasth Vaidya! My name is ${formData.name || 'Friend'}. I took the health assessment for ${currentGoalObj.title} (${duration}, Age: ${ageGroup}). Please share my personalized Ayurvedic prescription and diet guidance.`
    )
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank')
  }

  const resetAssessment = () => {
    setStep(1)
    setIsAddedToCart(false)
  }

  return (
    <section className="product-story-section w-full py-6 sm:py-8">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header (Compact & Clean) */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d2b160]/45 bg-[#fffdfa] px-3.5 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#b38022]" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-[#1c4028]">
              Personalized Ayurvedic Wellness Platform
            </span>
          </div>

          <h2 className="mt-2.5 font-display text-xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#143322] leading-tight">
            Pure Roots. Potent Science.{' '}
            <span className="text-[#9c711e]">Tailored For Your Health.</span>
          </h2>

          <p className="mt-1.5 text-xs text-[#4b6052] max-w-xl mx-auto">
            Take our 1-minute Ayurvedic Assessment to unlock your custom botanical formulation & free Vaidya advice.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 inline-flex flex-wrap justify-center rounded-xl border border-[#d6cbaf] bg-[#eee8d4] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'story'
                  ? 'bg-[#0f3d26] text-[#faedd0]'
                  : 'text-[#2e4737] hover:text-[#0f3d26]'
              }`}
            >
              <Leaf className="h-3.5 w-3.5" />
              Our Sourcing & Heritage Story
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('assessment')
                if (step === 4) resetAssessment()
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                activeTab === 'assessment'
                  ? 'bg-[#0f3d26] text-[#faedd0]'
                  : 'text-[#2e4737] hover:text-[#0f3d26]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#e5be59]" />
              1-Min Health Assessment
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: INTERACTIVE ASSESSMENT FUNNEL (COMPACT & ZERO SHADOW) */}
        {/* ============================================================ */}
        {activeTab === 'assessment' && (
          <div className="mt-5 sm:mt-6 animate-fade-in w-full">
            <div className="w-full rounded-2xl border border-[#ded5be] bg-[#fffdf9]">
              
              {/* Progress Bar & Header Banner */}
              <div className="border-b border-[#ebd8b3] bg-[#fbf8ed] px-4 sm:px-6 py-3.5 rounded-t-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#0e3b24] text-xs font-black text-[#edd182]">
                      {step === 4 ? '✓' : `0${step}`}
                    </span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#9c7526]">
                        {step === 1 && 'Step 1 of 3: Primary Health Goal'}
                        {step === 2 && 'Step 2 of 3: Timeline & Lifestyle Context'}
                        {step === 3 && 'Step 3 of 3: Free Consultation Details'}
                        {step === 4 && 'Your Ayurvedic Recommendation'}
                      </p>
                      <h3 className="text-xs sm:text-sm font-bold text-[#143522]">
                        {step === 1 && 'Which health area would you like to balance naturally?'}
                        {step === 2 && 'How long have you been looking for support?'}
                        {step === 3 && 'Where should our Ayurvedic Doctors send your care plan?'}
                        {step === 4 && 'Your Personalized Ayurvedic Plan is Ready!'}
                      </h3>
                    </div>
                  </div>

                  {step < 4 && (
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e422b]">
                        {step === 1 ? '33% Done' : step === 2 ? '66% Done' : '90% Done'}
                      </span>
                      <div className="w-24 sm:w-32 h-1.5 overflow-hidden rounded-full bg-[#e1d8bc]">
                        <div
                          className="h-full bg-[#0e3b24] transition-all duration-300 rounded-full"
                          style={{ width: `${(step / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* STEP 1: HEALTH GOAL SELECTION (4-CARD BALANCED GRID) */}
              {/* -------------------------------------------------------- */}
              {step === 1 && (
                <div className="p-4 sm:p-6 lg:p-7">
                  {/* 4 Column Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {HEALTH_GOALS.map((goal) => {
                      const Icon = goal.icon
                      const isSelected = selectedGoal === goal.id
                      return (
                        <div
                          key={goal.id}
                          onClick={() => setSelectedGoal(goal.id)}
                          className={`relative cursor-pointer flex flex-col justify-between rounded-xl border p-4 transition-all ${
                            isSelected
                              ? 'border-[#0e3b24] bg-[#f2f7ef] ring-2 ring-[#0e3b24]/25'
                              : 'border-[#dfd5bc] bg-white hover:border-[#bda56f] hover:bg-[#faf8f0]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5">
                              <span
                                className={`grid h-9 w-9 place-items-center rounded-lg ${
                                  isSelected
                                    ? 'bg-[#0e3b24] text-[#ecd07e]'
                                    : 'bg-[#ede6d4] text-[#3d5345]'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </span>
                              <span className="rounded bg-[#f2e9d2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#795616]">
                                {goal.badge}
                              </span>
                            </div>

                            <h4 className="mt-3 font-display text-sm font-bold text-[#153a23] leading-snug">
                              {goal.title}
                            </h4>

                            <p className="mt-1 text-[11px] text-[#526658] leading-relaxed line-clamp-2">
                              {goal.subtitle}
                            </p>

                            {/* Herbs */}
                            <div className="mt-3 pt-2.5 border-t border-[#ebd8b3]/60 flex flex-wrap gap-1">
                              {goal.herbs.map((herb) => (
                                <span
                                  key={herb}
                                  className="rounded border border-[#e1d5b8] bg-[#fbf8ed] px-1.5 py-0.5 text-[9px] font-semibold text-[#2b4433]"
                                >
                                  {herb}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Indicator */}
                          <div className="mt-3.5 flex items-center justify-between border-t border-[#ebd8b3]/60 pt-2.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e3b24]">
                              Ayurvedic Formula
                            </span>
                            <div
                              className={`grid h-5 w-5 place-items-center rounded-full border ${
                                isSelected
                                  ? 'border-[#0e3b24] bg-[#0e3b24] text-white'
                                  : 'border-[#c5b593] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Next Step CTA Bar */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#ede4ce] pt-4">
                    <div className="flex items-center gap-2 text-xs text-[#485f50]">
                      <ShieldCheck className="h-4 w-4 text-[#2a8449]" />
                      <span>100% Confidential & Free Consultation</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0e3b24] px-7 py-3 text-xs font-black uppercase tracking-wider text-[#faecd0] transition hover:bg-[#165535]"
                    >
                      Continue to Next Step <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 2: TIMELINE & CONTEXT */}
              {/* -------------------------------------------------------- */}
              {step === 2 && (
                <div className="p-4 sm:p-6 lg:p-7">
                  <div className="grid lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Why This Matters */}
                    <div className="lg:col-span-4 rounded-xl border border-[#ded3b6] bg-[#fbf8ed] p-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0e3b24] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#edd182]">
                        <Clock className="h-3 w-3" /> Dosage Logic
                      </span>
                      <h4 className="mt-2.5 font-display text-base font-bold text-[#143722]">
                        Why Timeline Matters
                      </h4>
                      <p className="mt-1.5 text-xs text-[#4b6052] leading-relaxed">
                        Ayurveda personalizes herbal concentration based on duration of imbalance to ensure root-cause healing.
                      </p>

                      <div className="mt-4 space-y-2 border-t border-[#e2d6b7] pt-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#22442f]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#2a8449]" /> Tailored Course Duration
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#22442f]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#2a8449]" /> Custom Diet & Water Schedule
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Selectors */}
                    <div className="lg:col-span-8 space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1e3c2a] mb-2">
                          1. How long have you experienced this concern?
                        </label>
                        <div className="grid sm:grid-cols-2 gap-2.5">
                          {DURATION_OPTIONS.map((opt) => (
                            <div
                              key={opt.id}
                              onClick={() => setDuration(opt.label)}
                              className={`cursor-pointer rounded-xl border p-3 transition-all ${
                                duration === opt.label
                                  ? 'border-[#0e3b24] bg-[#f2f7ef] ring-1 ring-[#0e3b24]'
                                  : 'border-[#ded4be] bg-white hover:bg-[#faf7ee]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#143823]">
                                  {opt.label}
                                </span>
                                {duration === opt.label && <Check className="h-3.5 w-3.5 text-[#0e3b24] stroke-[3]" />}
                              </div>
                              <p className="mt-0.5 text-[10px] text-[#5c7063]">{opt.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1e3c2a] mb-2">
                          2. Select your age category:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {AGE_GROUPS.map((grp) => (
                            <button
                              key={grp}
                              type="button"
                              onClick={() => setAgeGroup(grp)}
                              className={`rounded-lg border py-2.5 px-2 text-center text-xs font-bold transition-all ${
                                ageGroup === grp
                                  ? 'border-[#0e3b24] bg-[#0e3b24] text-[#faedd0]'
                                  : 'border-[#ded4be] bg-white text-[#384e40] hover:bg-[#faf7ee]'
                              }`}
                            >
                              {grp}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#eae2ce] pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#55695c] hover:text-[#143522]"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0e3b24] px-7 py-3 text-xs font-black uppercase tracking-wider text-[#faecd0] transition hover:bg-[#165535]"
                        >
                          Next: Free Ayurvedic Report <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 3: LEAD FORM */}
              {/* -------------------------------------------------------- */}
              {step === 3 && (
                <div className="p-4 sm:p-6 lg:p-7">
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Perks */}
                    <div className="lg:col-span-5 rounded-xl border border-[#dbcfae] bg-[#123824] p-5 text-white">
                      <div className="flex items-center gap-2 text-[#e9c76b]">
                        <HeartHandshake className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Doctor Consultation Package
                        </span>
                      </div>

                      <h4 className="mt-2 font-display text-lg font-bold text-[#fefcf8]">
                        Unlock Your Free Ayurvedic Prescription
                      </h4>

                      <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
                        <div className="flex items-start gap-2.5">
                          <UserCheck className="h-4 w-4 text-[#e9c76b] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">1-on-1 WhatsApp Doctor Advice</p>
                            <p className="text-[10px] text-white/65">Free consultation on your symptoms.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <FileText className="h-4 w-4 text-[#e9c76b] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Personalized Diet Chart</p>
                            <p className="text-[10px] text-white/65">Do’s & Don’ts for food and routine.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <BadgePercent className="h-4 w-4 text-[#e9c76b] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Instant 25% Discount</p>
                            <p className="text-[10px] text-white/65">Applied automatically to your formulation.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-7">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleNextStep()
                        }}
                        className="space-y-3.5"
                      >
                        <div>
                          <label className="block text-xs font-bold text-[#1f3d2a]">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Rajesh Kumar"
                            className="mt-1 w-full rounded-xl border border-[#d6cca8] bg-white px-3.5 py-2.5 text-xs text-[#1e3d2b] placeholder-stone-400 focus:border-[#0e3b24] focus:outline-none focus:ring-1 focus:ring-[#0e3b24]"
                          />
                          {errors.name && <p className="mt-1 text-[10px] text-red-600 font-semibold">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1f3d2a]">
                            WhatsApp / Mobile Number *
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-[#556b5d]">
                              🇮🇳 +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                                })
                              }
                              placeholder="9876543210"
                              className="w-full rounded-xl border border-[#d6cca8] bg-white py-2.5 pl-16 pr-3.5 text-xs text-[#1e3d2b] placeholder-stone-400 focus:border-[#0e3b24] focus:outline-none focus:ring-1 focus:ring-[#0e3b24]"
                            />
                          </div>
                          {errors.phone && <p className="mt-1 text-[10px] text-red-600 font-semibold">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1f3d2a]">
                            City / Pincode (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="e.g. Mumbai / 400001"
                            className="mt-1 w-full rounded-xl border border-[#d6cca8] bg-white px-3.5 py-2.5 text-xs text-[#1e3d2b] placeholder-stone-400 focus:border-[#0e3b24] focus:outline-none focus:ring-1 focus:ring-[#0e3b24]"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#eee5cc]">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#55695c] hover:text-[#143522]"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0e3b24] px-7 py-3 text-xs font-black uppercase tracking-wider text-[#faecd0] transition hover:bg-[#165535] disabled:opacity-50"
                          >
                            {isSubmitting ? 'Consulting Vaidya...' : 'Generate My Remedy →'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 4: PRESCRIPTION & RESULT CARD */}
              {/* -------------------------------------------------------- */}
              {step === 4 && (
                <div className="p-4 sm:p-6 lg:p-7">
                  <div className="rounded-2xl border border-[#d5bb7c] bg-[#fffdf9] p-5 sm:p-6">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#e6dcbf] pb-4">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#123d26] px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#f5db90]">
                          <CheckCircle2 className="h-3 w-3" /> 100% Matched Formulation
                        </span>
                        <h3 className="mt-1.5 font-display text-lg sm:text-xl font-bold text-[#143722]">
                          Namaste {formData.name || 'Friend'}, Here is Your Personalized Care Plan
                        </h3>
                        <p className="text-xs text-[#526658]">
                          Target: <strong className="text-[#143722]">{currentGoalObj.title}</strong> • Duration: {duration}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={resetAssessment}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#86651e] hover:underline"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
                      </button>
                    </div>

                    {/* Product Showcase */}
                    <div className="mt-5 grid gap-5 lg:grid-cols-12 items-center">
                      <div className="relative overflow-hidden rounded-xl border border-[#ded3b6] bg-[#f5efe2] p-3 lg:col-span-4 text-center">
                        <img
                          src={matchedProduct?.cardImage || matchedProduct?.images?.[0] || currentGoalObj.image}
                          alt={matchedProduct?.name || currentGoalObj.title}
                          className="aspect-square w-full object-contain max-h-[220px] mx-auto"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded bg-[#0a3820] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#ebca72]">
                          Doctor Approved
                        </span>
                      </div>

                      <div className="lg:col-span-8 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[#b58320]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                            <span className="ml-1.5 text-xs font-bold text-[#3d5345]">
                              4.9 / 5 (1,280+ Reviews)
                            </span>
                          </div>

                          <h4 className="mt-1 font-display text-xl font-bold text-[#173b25]">
                            {matchedProduct?.name || currentGoalObj.title}
                          </h4>

                          <p className="text-xs text-[#546b5c] line-clamp-2">
                            {matchedProduct?.subtitle || currentGoalObj.subtitle}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {currentGoalObj.herbImages.map((herb) => (
                              <div
                                key={herb.name}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8ccaa] bg-white px-2.5 py-1"
                              >
                                <img src={herb.img} alt={herb.name} className="h-5 w-5 object-contain rounded-full" />
                                <span className="text-[11px] font-bold text-[#233d2c]">{herb.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Cart */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#ebd8b3]/60 pt-4">
                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#63776b]">
                              Assessment Price
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-2xl font-bold text-[#143722]">
                                ₹{matchedProduct?.price?.toLocaleString('en-IN') || '899'}
                              </span>
                              <span className="text-xs text-[#819286] line-through">
                                ₹{Math.round((matchedProduct?.price || 899) * 1.35).toLocaleString('en-IN')}
                              </span>
                              <span className="rounded bg-[#d5ecd4] px-1.5 py-0.5 text-[10px] font-bold text-[#1f6b31]">
                                25% OFF
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={handleAddToCart}
                              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider transition ${
                                isAddedToCart
                                  ? 'bg-[#1e7a3d] text-white'
                                  : 'bg-[#0f3d26] text-[#faedd0] hover:bg-[#165737]'
                              }`}
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
                            </button>

                            <button
                              type="button"
                              onClick={handleWhatsAppConsult}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-[#25d366]/50 bg-[#eaf8ee] px-4 py-3 text-xs font-bold text-[#166534] hover:bg-[#d5f3dc]"
                            >
                              <PhoneCall className="h-3.5 w-3.5 text-[#25d366]" />
                              WhatsApp Doctor Advice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: OUR SACRED HERITAGE & SOURCING STORY (BALANCED 2-COL) */}
        {/* ============================================================ */}
        {activeTab === 'story' && (
          <div className="mt-5 sm:mt-6 animate-fade-in w-full">
            {/* Main Narrative Banner (Balanced 2-Column with Visual, Zero Empty Space) */}
            <div className="rounded-2xl border border-[#dbcfae] bg-gradient-to-r from-[#123824] via-[#0d2f1f] to-[#082216] p-6 sm:p-8 lg:p-10 text-white">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Side: Content (8 cols) */}
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#d5aa50]/20 px-3.5 py-1 text-[#e9c76b] border border-[#d5aa50]/30">
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em]">
                      5000 Years of Vedic Wisdom • Standardized Bio-Actives
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-[#fdfaf3]">
                    &ldquo;Nature creates the remedy long before the ailment arrives.&rdquo;
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#cad8cf]">
                    At Divya Swasth, our philosophy is simple yet uncompromising: We do not dilute nature with synthetic fillers or hurried industrial processing. Every single capsule represents a sacred synergy between ancient Ayurvedic texts and modern clinical standardisation.
                  </p>

                  {/* 4 Metric Badges in Compact Grid */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-5">
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center sm:text-left">
                      <p className="font-display text-xl font-bold text-[#eec765]">100%</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/75 mt-0.5">Standardized Bio-Extracts</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center sm:text-left">
                      <p className="font-display text-xl font-bold text-[#eec765]">Zero</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/75 mt-0.5">Heavy Metals & Toxins</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center sm:text-left">
                      <p className="font-display text-xl font-bold text-[#eec765]">50,000+</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/75 mt-0.5">Happy Ayurvedic Users</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center sm:text-left">
                      <p className="font-display text-xl font-bold text-[#eec765]">GMP</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/75 mt-0.5">Ayush Certified Facility</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#d3ded7]">
                      <ShieldCheck className="h-4 w-4 text-[#7db552]" />
                      <span>Certified Quality Assured • 100% Plant-Based Pullulan Capsules</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('assessment')}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#cfa13c] to-[#e8c366] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#142617] transition hover:brightness-105"
                    >
                      Find Your Tailored Remedy <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Visual Herb Guarantee Showcase (4 cols) */}
                <div className="lg:col-span-4 rounded-xl border border-white/10 bg-white/[0.05] p-5 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full border-2 border-[#d5aa50]/40 bg-[#0e3b24] grid place-items-center mb-3">
                    <Leaf className="h-10 w-10 text-[#ecd07e]" />
                  </div>
                  <h4 className="font-display text-base font-bold text-[#faedd0]">
                    Purity From Root to Remedy
                  </h4>
                  <p className="mt-1 text-xs text-white/70">
                    Sourced from organic certified Ayurvedic farms in pristine Himalayan valleys.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {['Shilajit', 'Ashwagandha', 'Garcinia', 'Vijaysar', 'Amla'].map((herb) => (
                      <span key={herb} className="rounded border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-white">
                        ✓ {herb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Process Cards */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#ddcfad] bg-[#fffdf8] p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9f1e4] text-[#255734]">
                    <Leaf className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9d7826]">Stage 01</span>
                </div>
                <h4 className="mt-3 font-display text-sm font-bold text-[#1c3826]">
                  1. High-Altitude Ethical Sourcing
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#516356]">
                  Harvested at peak potency from organic certified Himalayan valleys and traditional farms.
                </p>
              </div>

              <div className="rounded-xl border border-[#ddcfad] bg-[#fffdf8] p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7eed6] text-[#a0741c]">
                    <FlaskConical className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9d7826]">Stage 02</span>
                </div>
                <h4 className="mt-3 font-display text-sm font-bold text-[#1c3826]">
                  2. Classical Kwath & Ghan Extraction
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#516356]">
                  Traditional Vedic decoction concentrated gently into potent bio-extracts without harsh solvents.
                </p>
              </div>

              <div className="rounded-xl border border-[#ddcfad] bg-[#fffdf8] p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e4ecf3] text-[#1c4d68]">
                    <Award className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9d7826]">Stage 03</span>
                </div>
                <h4 className="mt-3 font-display text-sm font-bold text-[#1c3826]">
                  3. NABL Accredited Lab Assurance
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#516356]">
                  Every batch undergoes testing for active alkaloids, microbial purity, and zero heavy metals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
