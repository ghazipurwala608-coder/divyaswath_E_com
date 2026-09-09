import fs from 'node:fs'
for (const file of ['frontend/src/pages/CartPage.jsx', 'frontend/src/pages/CheckoutPage.jsx']) {
  let s = fs.readFileSync(file, 'utf8')
  const line = "import { useSiteContent } from '../context/SiteContentContext.jsx'\n"
  s = s.replace(line + line, line)
  fs.writeFileSync(file, s)
}
let s = fs.readFileSync('frontend/src/components/WellnessQuizHero.jsx', 'utf8')
s = s.replace("What's", 'What&apos;s').replace("What's", 'What&apos;s').replace("What's", 'What&apos;s').replace("what's", 'what&apos;s')
fs.writeFileSync('frontend/src/components/WellnessQuizHero.jsx', s)
