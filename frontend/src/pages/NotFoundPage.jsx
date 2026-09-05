import { ArrowLeft, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <section className="px-4 py-28 text-center"><Leaf className="mx-auto h-20 w-20 -rotate-45 text-[#85a179]" strokeWidth={1} /><p className="mt-6 font-serif text-8xl text-[#c79a3b]">404</p><h1 className="mt-3 font-serif text-4xl">This path has wandered away.</h1><p className="mt-4 text-sm text-[#738078]">Let’s return you to a more balanced place.</p><Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#173d27] px-7 py-4 text-xs font-black uppercase tracking-wider text-white"><ArrowLeft className="h-4 w-4" /> Back to home</Link></section>
}

