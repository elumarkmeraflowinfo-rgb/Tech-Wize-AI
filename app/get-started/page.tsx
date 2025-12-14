import { Suspense } from 'react'
import Header from '@/components/Header'
import GetStartedPageClient from './page-client'

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      }>
        <GetStartedPageClient />
      </Suspense>
    </div>
  )
}
