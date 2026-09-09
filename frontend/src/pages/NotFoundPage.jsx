import { useSiteContent } from '../context/SiteContentContext.jsx'
import { ArrowLeft, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  const siteContent = useSiteContent('not-found', siteIcons)

  return <section className="px-4 py-28 text-center"><Leaf className="mx-auto h-20 w-20 -rotate-45 text-[#85a179]" strokeWidth={1} /><p className="mt-6 font-serif text-8xl text-[#c79a3b]">{siteContent.text.label_404}</p><h1 className="mt-3 font-serif text-4xl">{siteContent.text.this_path_has_wandered_away}</h1><p className="mt-4 text-sm text-[#738078]">{siteContent.text.let_s_return_you_to_a_more_balanced_place}</p><Link to={siteContent.media.to_1} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#173d27] px-7 py-4 text-xs font-black uppercase tracking-wider text-white"><ArrowLeft className="h-4 w-4" />{siteContent.text.back_to_home}</Link></section>
}


const siteIcons = {  }
