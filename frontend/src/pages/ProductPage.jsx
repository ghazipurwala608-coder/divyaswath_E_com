import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import VitalInfinityProduct from '../components/VitalInfinityProduct.jsx'

export default function ProductPage() {
  const { slug } = useParams()
  const { products, loading } = useProducts()
  const product = products.find((item) => item.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!product) return
    document.title = `${product.name} ${product.subtitle} | Divya Swasth`
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', product.shortDescription)
  }, [product, slug])

  if (!product && loading) {
    return <p className="p-12 text-center text-sm font-semibold text-[#183d27]">Loading product…</p>
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl font-bold text-[#183d27]">Product not found</h1>
        <Link to="/shop" className="mt-5 inline-block font-bold text-[#9e6d18] hover:underline">
          Return to all products
        </Link>
      </div>
    )
  }

  return <VitalInfinityProduct key={product.slug} product={product} />
}
