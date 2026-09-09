import fs from 'node:fs'
for (const dir of ['frontend/src/pages', 'frontend/src/components']) for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.jsx'))) {
  const full = `${dir}/${file}`
  let s = fs.readFileSync(full, 'utf8').replaceAll('\uFEFF', '')
  s = s.replace(/siteContent\.text\.([0-9][a-z0-9_]*)/g, 'siteContent.text["$1"]')
  fs.writeFileSync(full, s)
}
let s = fs.readFileSync('frontend/src/pages/HomePage.jsx', 'utf8')
s = s.replace('BadgeCheck,Heart,ArrowRight, Check,', 'BadgeCheck,ArrowRight,').replace('Sprout,Minus,', 'Sprout,').replace('PackageCheck, Plus,', 'PackageCheck,').replace('Link, useNavigate', 'Link').replace('  const navigate = useNavigate()\n', '').replace('const [quantity, setQuantity]', 'const [quantity]').replace(/  const otherProducts = .*\n/, '')
s = s.replace(/function SectionTitle\([\s\S]*?\n}\n/, '').replace(/function QuantityPicker\([\s\S]*?\n}\n/, '')
fs.writeFileSync('frontend/src/pages/HomePage.jsx', s)
s = fs.readFileSync('frontend/src/pages/LoginReference.jsx', 'utf8').replace('await login(form)', 'const signedIn = await login(form)').replace("location.state?.from || '/account'", "location.state?.from || (signedIn.isAdmin ? '/admin' : '/account')")
fs.writeFileSync('frontend/src/pages/LoginReference.jsx', s)
