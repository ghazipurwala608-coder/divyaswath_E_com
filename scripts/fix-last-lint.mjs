import fs from 'node:fs'
let s = fs.readFileSync('frontend/src/components/WellnessQuizHero.jsx', 'utf8').replace("LET'S", 'LET&apos;S')
fs.writeFileSync('frontend/src/components/WellnessQuizHero.jsx', s)
