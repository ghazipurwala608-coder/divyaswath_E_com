export const wellnessGoals = [
  { id: 'nutrition', title: 'Daily Nutrition & Wellness', text: 'Explore everyday nutritional support', slug: 'vital-infinity-multivitamin', image: '/images/home/daily vitalti.png', icon: 'ShieldCheck' },
  { id: 'stamina', title: 'Men’s Stamina & Vitality', text: 'Explore men’s daily wellness support', slug: 'endless-daily-wellness', image: '/images/home/man welness.png', icon: 'Zap' },
  { id: 'weight', title: 'Weight Management', text: 'Complement mindful nutrition and movement', slug: 'lean-shape-garcinia-cambogia', image: '/images/home/healthy weight.png', icon: 'Dumbbell' },
  { id: 'metabolic', title: 'Metabolic Wellness', text: 'Explore your metabolic wellness routine', slug: 'sugar-shield-blood-sugar-support', image: '/images/home/balance living.png', icon: 'Leaf' },
]

// Match explicit preferences only; never substitute an unrelated product.
export function recommendWellnessProducts(products, { primary, secondary, preference }) {
  const selected = preference === 'compare' ? [primary, secondary] : [primary]
  return [...new Set(selected)].filter(Boolean).flatMap((id) => {
    const goal = wellnessGoals.find(item => item.id === id)
    const product = products.find(item => item.slug === goal?.slug && item.isActive !== false)
    return product ? [{ product, goal, primary: id === primary }] : []
  })
}
