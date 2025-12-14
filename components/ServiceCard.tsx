import Link from 'next/link'
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import type { ServicePackage } from '@/lib/types'

export default function ServiceCard({ package: pkg }: { package: ServicePackage }) {
  return (
    <div className={`relative glass p-8 rounded-2xl hover:scale-105 transition-transform ${
      pkg.is_popular ? 'ring-2 ring-primary' : ''
    }`}>
      {pkg.is_popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold mb-3">{pkg.name}</h3>
      <p className="text-gray-400 mb-6">{pkg.description}</p>

      <div className="text-3xl font-bold text-gradient mb-6">
        {pkg.price_kes.toLocaleString()} KES
      </div>

      <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {pkg.delivery_days} days
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw size={16} />
          {pkg.revision_count} {pkg.revision_count === 1 ? 'revision' : 'revisions'}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/get-started?package=${pkg.id}`}
        className="block text-center px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:opacity-90 transition-opacity"
      >
        Get Started
      </Link>
    </div>
  )
}
