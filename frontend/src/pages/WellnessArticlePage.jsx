import { useSiteContent } from '../context/SiteContentContext.jsx'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Leaf,
  Lightbulb,
  ListChecks,
  ShieldAlert,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function WellnessArticlePage() {
  const siteContent = useSiteContent('wellness-article', siteIcons)

  const { slug } = useParams()
  const { articles: wellnessArticles } = useSiteContent('articles')
  const article = wellnessArticles.find(item => item.slug === slug)

  useEffect(() => {
    const previousTitle = document.title
    document.title = article ? `${article.title} | Divya Swasth` : 'Article not found | Divya Swasth'
    return () => { document.title = previousTitle }
  }, [article])

  if (!article) {
    return (
      <section className="grid min-h-[620px] place-items-center bg-[#f6f5ee] px-4 py-24 text-center">
        <div className="max-w-lg">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9efe4] text-[#52715a]"><BookOpen className="h-7 w-7" /></span>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-[#a1721c]">{siteContent.text.wellness_centre}</p>
          <h1 className="mt-3 font-display text-5xl text-[#183724]">{siteContent.text.this_article_is_not_available}</h1>
          <p className="mt-4 text-sm leading-7 text-[#6d7a71]">{siteContent.text.the_link_may_have_changed_browse_the_complete}</p>
          <Link to={siteContent.media.to_1} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#123b2a] px-6 py-3 text-[9px] font-black uppercase tracking-wider text-white">
            <ArrowLeft className="h-4 w-4" />{siteContent.text.back_to_wellness}</Link>
        </div>
      </section>
    )
  }

  const relatedArticles = wellnessArticles
    .filter((item) => item.slug !== article.slug)
    .sort((first, second) => Number(second.category === article.category) - Number(first.category === article.category))
    .slice(0, 3)

  return (
    <div className="bg-[#f6f5ee]">
      <header className="relative overflow-hidden bg-[#08271b] px-4 pb-16 pt-10 text-white sm:px-6 sm:pb-20 lg:px-8">
        <img src={siteContent.media.src_2} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.1]" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,#062118_5%,rgba(7,41,28,.97)_52%,rgba(7,41,28,.82)_100%)]" />
        <Leaf className="absolute -bottom-16 -right-14 h-72 w-72 -rotate-45 text-white/[.025]" strokeWidth={0.7} />

        <div className="relative mx-auto max-w-7xl">
          <nav className="flex flex-wrap items-center gap-1.5 text-[8px] font-black uppercase tracking-[.13em] text-white/45" aria-label="Breadcrumb">
            <Link to={siteContent.media.to_3} className="transition hover:text-[#e2bc62]">{siteContent.text.wellness_centre_2}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#dfb75e]">{article.category}</span>
          </nav>

          <div className="mt-8 grid items-center gap-9 lg:grid-cols-[1fr_480px] lg:gap-14">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#e1b85d]">{siteContent.text.evidence_aware_wellness_guide}</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] text-[#fff6df] sm:text-5xl lg:text-6xl">{article.title}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">{article.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-[9px] font-bold uppercase tracking-wider text-white/65">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.06] px-4 py-2.5"><Clock3 className="h-3.5 w-3.5 text-[#e2bb61]" /> {article.read}</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.06] px-4 py-2.5"><CalendarDays className="h-3.5 w-3.5 text-[#e2bb61]" />{siteContent.text.checked}{article.updated}</span>
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.06] p-2 shadow-[0_28px_70px_rgba(0,0,0,.28)]">
              <img src={article.image} alt={article.imageAlt} className="aspect-[3/2] w-full rounded-[1.55rem] object-cover" />
              <figcaption className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-[#0a291d]/80 px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#f1ce76] backdrop-blur-md">{article.category}</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl items-start gap-7 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:px-8 lg:py-16">
        <article className="min-w-0 rounded-[2rem] border border-[#dfe4dc] bg-white px-5 py-7 shadow-[0_18px_50px_rgba(26,53,35,.06)] sm:px-9 sm:py-10 lg:px-12">
          <p className="font-display text-2xl leading-10 text-[#294333] sm:text-3xl sm:leading-[1.45]">{article.intro}</p>

          <section className="mt-9 rounded-[1.5rem] border border-[#d7e2d3] bg-[#eef5eb] p-5 sm:p-6" aria-labelledby="at-a-glance">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#123b2a] text-[#e6c36b]"><Lightbulb className="h-4.5 w-4.5" /></span>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[.16em] text-[#8d671f]">{siteContent.text.key_ideas}</p>
                <h2 id="at-a-glance" className="mt-0.5 font-display text-2xl text-[#193725]">{siteContent.text.at_a_glance}</h2>
              </div>
            </div>
            <ul className="mt-5 grid gap-3">
              {article.takeaways.map((takeaway) => (
                <li key={takeaway} className="flex gap-3 text-sm leading-6 text-[#526459]">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d9e9d4] text-[#315f3a]"><Check className="h-3 w-3" /></span>
                  {takeaway}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-11 space-y-12">
            {article.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#dec88f] bg-[#fff9e9] text-[10px] font-black text-[#96691a]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[.16em] text-[#a1721c]">{siteContent.text.article_section}</p>
                    <h2 className="mt-1 font-display text-3xl leading-tight text-[#193725] sm:text-4xl">{section.title}</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-4 border-l border-[#dfe5dc] pl-5 sm:ml-[17px] sm:pl-8">
                  {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-[#5f6f65]">{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 overflow-hidden rounded-[1.6rem] bg-[#0e3022] p-6 text-white sm:p-8" aria-labelledby="action-plan">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[.08] text-[#e2bd63]"><ListChecks className="h-5 w-5" /></span>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[.16em] text-[#dfb75e]">{siteContent.text.put_it_into_practice}</p>
                <h2 id="action-plan" className="mt-1 font-display text-3xl text-[#fff3d6]">{article.actionTitle}</h2>
              </div>
            </div>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {article.actions.map((action, index) => (
                <li key={action} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.05] p-4 text-xs leading-6 text-white/65">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#d9ae53] text-[9px] font-black text-[#0b271b]">{index + 1}</span>
                  {action}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-7 rounded-[1.5rem] border border-[#ead2aa] bg-[#fff8e8] p-5 sm:p-6" aria-labelledby="safety-note">
            <div className="flex gap-4">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-[#9d6915]" />
              <div>
                <h2 id="safety-note" className="font-display text-2xl text-[#473719]">{siteContent.text.when_individual_advice_matters}</h2>
                <p className="mt-2 text-xs leading-6 text-[#745f37]">{article.safety}</p>
              </div>
            </div>
          </section>

          <section id="sources" className="mt-11 scroll-mt-28 border-t border-[#e3e7e0] pt-8" aria-labelledby="sources-title">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#a1721c]" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-[.16em] text-[#a1721c]">{siteContent.text.further_reading}</p>
                <h2 id="sources-title" className="mt-1 font-display text-3xl text-[#193725]">{siteContent.text.sources_and_guidance}</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {article.sources.map((source, index) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="group/source flex items-center justify-between gap-4 rounded-xl border border-[#e1e5dd] bg-[#fafbf8] px-4 py-3.5 transition hover:border-[#cfbd8c] hover:bg-[#fffaf0]">
                  <span className="flex min-w-0 items-center gap-3 text-xs font-bold text-[#4f6156]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#edf1e9] text-[9px] font-black text-[#90651b]">{index + 1}</span>{source.name}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-[#9d711f] transition group-hover/source:-translate-y-0.5 group-hover/source:translate-x-0.5" />
                </a>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <nav className="rounded-[1.5rem] border border-[#dde3da] bg-white p-5" aria-label="Article contents">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#a1721c]" /><h2 className="text-[9px] font-black uppercase tracking-[.15em] text-[#344b3b]">{siteContent.text.on_this_page}</h2></div>
            <div className="mt-4 grid gap-1.5">
              <a href="#at-a-glance" className="rounded-lg px-3 py-2 text-[11px] font-semibold text-[#65746b] transition hover:bg-[#f1f5ee] hover:text-[#1e4a30]">{siteContent.text.at_a_glance_2}</a>
              {article.sections.map((section, index) => <a key={section.id} href={`#${section.id}`} className="flex gap-2 rounded-lg px-3 py-2 text-[11px] leading-5 text-[#65746b] transition hover:bg-[#f1f5ee] hover:text-[#1e4a30]"><span className="text-[#a1721c]">{index + 1}.</span>{section.title}</a>)}
              <a href="#sources" className="rounded-lg px-3 py-2 text-[11px] font-semibold text-[#65746b] transition hover:bg-[#f1f5ee] hover:text-[#1e4a30]">{siteContent.text.sources_and_guidance_2}</a>
            </div>
          </nav>

          <div className="rounded-[1.5rem] border border-[#d8e0d5] bg-[#edf4ea] p-5">
            <p className="text-[8px] font-black uppercase tracking-[.15em] text-[#8f681f]">{siteContent.text.editorial_note}</p>
            <p className="mt-3 text-xs leading-6 text-[#586a5e]">{siteContent.text.this_article_was_checked_against_the_authorit}{article.updated}{siteContent.text._it_provides_general_education_not_personal_m}</p>
          </div>

          <Link to={siteContent.media.to_4} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123b2a] px-5 py-3.5 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#0b2c1e]">
            <ArrowLeft className="h-4 w-4" />{siteContent.text.all_wellness_articles}</Link>
        </aside>
      </main>

      <section className="border-t border-[#dfe4dc] bg-[#eef1e9] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#a1721c]">{siteContent.text.continue_learning}</p><h2 className="mt-2 font-display text-4xl text-[#193725]">{siteContent.text.related_wellness_guides}</h2></div>
            <Link to={siteContent.media.to_5} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-[#90651b]">{siteContent.text.view_all_articles}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link key={related.slug} to={`/wellness/${related.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-[#d8dfd5] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(30,59,39,.1)]">
                <div className="h-40 overflow-hidden"><img src={related.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <div className="p-5"><p className="text-[8px] font-black uppercase tracking-[.13em] text-[#9b6c1a]">{related.category} · {related.read}</p><h3 className="mt-2 font-display text-2xl leading-tight text-[#193725]">{related.title}</h3><span className="mt-4 inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-wider text-[#8e6319]">{siteContent.text.read_guide}<ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const siteIcons = {  }
