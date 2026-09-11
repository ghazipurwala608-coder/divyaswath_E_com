import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Dumbbell, Leaf, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react'
import { useProducts } from '../hooks/useProducts.js'
import { recommendWellnessProducts, wellnessGoals } from '../data/wellnessQuiz.js'
import './WellnessQuiz.css'

const goalIcons = { ShieldCheck, Zap, Dumbbell, Leaf, Target }

export default function WellnessQuiz({ primary, onReset }) {
  const { products, loading } = useProducts()
  const [step, setStep] = useState(2)
  const [secondary, setSecondary] = useState('')
  const [preference, setPreference] = useState('')
  const heading = useRef(null)
  const goal = wellnessGoals.find(item => item.id === primary)
  const results = recommendWellnessProducts(products, { primary, secondary, preference })
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [step])
  return <section className="wellness-quiz">
    <div className="wellness-quiz-shell">
      <aside className="wellness-quiz-intro">
        <span className="wellness-quiz-brand"><Leaf size={19} /> YOUR WELLNESS, YOUR WAY</span>
        <h2>A little about you.<br /><em>A match for you.</em></h2>
        <p>A few simple choices to find a product that fits your wellness goals.</p>
        <ol className="wellness-quiz-steps">
          {['Your main goal', 'Your next priority', 'Your personal matches'].map((label, index) => <li key={label} className={step > index + 1 ? 'is-complete' : step === index + 1 ? 'is-current' : ''} aria-current={step === index + 1 ? 'step' : undefined}><span>{step > index + 1 ? <Check size={15} /> : `0${index + 1}`}</span>{label}</li>)}
        </ol>
        <div className="wellness-quiz-goal"><span><Check size={14} /> YOUR CHOSEN GOAL</span><strong>{goal.title}</strong></div>
        <Leaf className="wellness-quiz-decoration" aria-hidden="true" />
      </aside>
    <div className="wellness-quiz-content">
      <div className="wellness-quiz-step-label"><Sparkles size={17} />
      <p className="text-xs font-bold uppercase tracking-widest text-[#8c691e]">{step < 4 ? `Step ${step} of 3` : 'Your quiz results'}</p>
      <span>{step < 4 ? 'Made for your routine' : 'Chosen with you'}</span></div>
      <div className="my-4 h-1.5 overflow-hidden rounded-full bg-[#e8e6db]" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={3} aria-valuenow={Math.min(step - 1, 3)}><div className="h-full bg-[#b88d37]" style={{ width: `${Math.min(step - 1, 3) / 3 * 100}%` }} /></div>
      <h2 ref={heading} tabIndex={-1} className="font-display text-2xl font-bold outline-none">{step === 2 ? 'Is there another goal you want to explore?' : step === 3 ? 'How would you like to see your matches?' : 'Products matched to your choices'}</h2>
      <p className="wellness-quiz-description">{step === 2 ? 'Choose one more area to focus on, or keep things simple with your main goal.' : step === 3 ? 'Keep it focused or explore an option for each goal. The choice is yours.' : 'Explore your matches and find out why they were selected for you.'}</p>
      {step === 2 && <fieldset className="mt-6 grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Choose an optional second goal</legend>
        {[{ id: 'none', title: 'Just my main goal', text: 'One goal. A focused start.', icon: 'Target' }, ...wellnessGoals.filter(item => item.id !== primary)].map(item => {
          const Icon = goalIcons[item.icon]
          return <label key={item.id} className={`wellness-quiz-option ${secondary === item.id ? 'is-selected' : ''}`}><input type="radio" name="secondary-goal" value={item.id} checked={secondary === item.id} onChange={() => setSecondary(item.id)} /><span className="wellness-quiz-option-icon"><Icon size={22} strokeWidth={1.6} /></span><span className="wellness-quiz-option-copy"><strong>{item.title}</strong><small>{item.text}</small></span><span className="wellness-quiz-radio" aria-hidden="true">{secondary === item.id && <Check size={12} />}</span></label>
        })}
      </fieldset>}
      {step === 3 && <fieldset className="mt-6 grid gap-3">
        <legend className="sr-only">Recommendation preference</legend>
        {[['single', 'One product for my main goal', 'A focused match for your first priority.'], ...(secondary !== 'none' ? [['compare', 'Explore both of my goals', 'A separate product option for each goal.']] : [])].map(([id, label, description]) => <label key={id} className={`wellness-quiz-option ${preference === id ? 'is-selected' : ''}`}><input type="radio" name="match-preference" checked={preference === id} onChange={() => setPreference(id)} /><span className="wellness-quiz-option-icon">{id === 'single' ? <Target size={22} /> : <Sparkles size={22} />}</span><span className="wellness-quiz-option-copy"><strong>{label}</strong><small>{description}</small></span><span className="wellness-quiz-radio" aria-hidden="true">{preference === id && <Check size={12} />}</span></label>)}
      </fieldset>}
      {step < 4 ? <div className="wellness-quiz-actions"><button type="button" onClick={() => step === 2 ? onReset() : setStep(2)} className="wellness-quiz-back"><ArrowLeft size={16} /> Back</button><span>Select an option to continue</span><button type="button" disabled={step === 2 ? !secondary : !preference} onClick={() => { if (step === 2) setPreference(''); setStep(step + 1) }} className="wellness-quiz-next">{step === 2 ? 'Continue' : 'See my matches'}<ArrowRight size={16} /></button></div> : <div aria-live="polite">
        {loading ? <p className="mt-6">Loading your matches…</p> : <>
          {results.map(({ product, goal: matchGoal, primary: isPrimary }) => <article key={product.slug} className="mt-6 rounded-xl border border-[#e1dece] bg-white p-5">
            <p className="text-xs font-bold uppercase text-[#957121]">{isPrimary ? 'Main goal match' : 'Second goal option'}</p>
            <div className="mt-3 flex flex-col gap-5 sm:flex-row">
              <img src={product.cardImage || product.images?.[0]} alt={product.name} className="h-36 w-36 rounded-lg object-contain" />
              <div><h3 className="text-lg font-bold">{product.name}</h3><p className="mt-1 text-sm">{product.subtitle}</p><p className="mt-3 text-sm text-[#647168]">Suggested because you selected {matchGoal.title.toLowerCase()}.</p><p className="mt-3 font-bold">₹{Number(product.price).toLocaleString('en-IN')}</p>{(product.countInStock <= 0 || product.availableForPurchase === false) && <p className="mt-1 text-xs">Currently unavailable</p>}<Link to={`/products/${product.slug}`} className="mt-4 inline-block rounded-lg bg-[#163e29] px-5 py-2.5 text-sm font-bold text-white">View product →</Link></div>
            </div>
          </article>)}
          {!results.some(item => item.primary) && <p className="mt-6">A product for your main goal is not currently listed. <Link to="/shop" className="underline">Browse the collection</Link>.</p>}
          {preference === 'compare' && !results.some(item => !item.primary) && <p className="mt-4 text-sm">A product for your second goal is not currently listed.</p>}
        </>}
        <p className="mt-6 text-xs leading-relaxed text-[#647168]">These matches reflect your shopping preferences, not a medical assessment. Review the product label before use. If you take medication or have a health condition, ask a qualified healthcare professional about suitability. Two matches are options to explore, not advice to take them together.</p>
        <div className="mt-6 flex gap-5 text-sm"><button type="button" onClick={() => setStep(3)} className="underline">Edit answers</button><button type="button" onClick={onReset} className="underline">Retake quiz</button></div>
      </div>}
    </div>
    </div>
  </section>
}
