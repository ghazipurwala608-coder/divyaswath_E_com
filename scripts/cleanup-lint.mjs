import fs from 'node:fs'
let s = fs.readFileSync('frontend/src/components/WellnessQuizHero.jsx', 'utf8').replace("import React from 'react';\n", '').replace('Heart, Smile,', 'Heart,').replace("What's Your", 'What&apos;s Your').replace("you'd like", 'you&apos;d like')
fs.writeFileSync('frontend/src/components/WellnessQuizHero.jsx', s)
