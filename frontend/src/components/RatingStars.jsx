import { Star } from 'lucide-react'

export default function RatingStars({ rating = 5, reviews, light = false }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? 'fill-[#d6a53a] text-[#d6a53a]' : 'text-[#c8c8c8]'}`} />)}
      </div>
      <span className={`text-xs font-semibold ${light ? 'text-white/65' : 'text-[#657168]'}`}>{rating}{reviews ? ` (${reviews})` : ''}</span>
    </div>
  )
}

