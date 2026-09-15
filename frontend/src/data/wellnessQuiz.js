export const wellnessGoals = [
  { id: 'nutrition', title: 'Daily Nutrition & Wellness', text: 'Explore everyday nutritional support', slug: 'vital-infinity-multivitamin', image: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450345/divyaswasth/migrated/401bc10be74565a9-daily_vitalti.png', icon: 'ShieldCheck' },
  { id: 'stamina', title: 'Men’s Stamina & Vitality', text: 'Explore men’s daily wellness support', slug: 'endless-daily-wellness', image: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450402/divyaswasth/migrated/dddeb9ae31b35d5a-man_welness.png', icon: 'Zap' },
  { id: 'weight', title: 'Weight Management', text: 'Complement mindful nutrition and movement', slug: 'lean-shape-garcinia-cambogia', image: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450378/divyaswasth/migrated/0267e3e175fc4492-healthy_weight.png', icon: 'Dumbbell' },
  { id: 'metabolic', title: 'Metabolic Wellness', text: 'Explore your metabolic wellness routine', slug: 'sugar-shield-blood-sugar-support', image: 'https://res.cloudinary.com/djfluwhwu/image/upload/v1789450321/divyaswasth/migrated/bad47e712a608190-balance_living.png', icon: 'Leaf' },
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
