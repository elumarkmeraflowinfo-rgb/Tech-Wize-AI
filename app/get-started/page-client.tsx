'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import type { ServicePackage } from '@/lib/types'

export default function GetStartedPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPackage = searchParams.get('package')

  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string | null>(preselectedPackage)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetPlatform: 'multiple' as const,
    videoDuration: '30s' as const,
    scriptProvided: false,
    customScript: '',
    ctaText: '',
    ctaUrl: '',
    clientNotes: '',
  })

  useEffect(() => {
    async function loadPackages() {
      const supabase = createClient()
      const { data } = await supabase
        .from('service_packages')
        .select('*, category:service_categories(*)')
        .eq('is_active', true)
        .order('display_order')

      if (data) {
        setPackages(data)
      }
    }

    loadPackages()
  }, [])

  const handleCreateProject = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login?redirect=/get-started')
      return
    }

    const selectedPkg = packages.find((p) => p.id === selectedPackage)
    if (!selectedPkg) return

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        client_id: user.id,
        package_id: selectedPackage,
        title: formData.title,
        description: formData.description,
        target_platform: formData.targetPlatform,
        video_duration: formData.videoDuration,
        script_provided: formData.scriptProvided,
        custom_script: formData.customScript,
        cta_text: formData.ctaText,
        cta_url: formData.ctaUrl,
        client_notes: formData.clientNotes,
        total_amount: selectedPkg.price_kes,
        max_revisions: selectedPkg.revision_count,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (error) {
      alert('Error creating project: ' + error.message)
      return
    }

    if (project) {
      router.push(`/dashboard/projects/${project.id}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            Create Your <span className="text-gradient">Video Project</span>
          </h1>
          <p className="text-gray-400">
            {step === 1
              ? 'Choose your service package'
              : 'Tell us about your project'}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-primary text-white' : 'glass text-gray-400'
              }`}
            >
              1
            </div>
            <div className={`w-24 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-primary text-white' : 'glass text-gray-400'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`glass p-6 rounded-xl cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'ring-2 ring-primary bg-white/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-gray-400 mb-4">{pkg.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-3 py-1 glass rounded-full text-xs"
                        >
                          <CheckCircle2 size={12} className="text-accent" />
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-400">
                      Delivery: {pkg.delivery_days} days • {pkg.revision_count}{' '}
                      {pkg.revision_count === 1 ? 'revision' : 'revisions'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">
                      {pkg.price_kes.toLocaleString()} KES
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setStep(2)}
              disabled={!selectedPackage}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="glass p-8 rounded-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreateProject()
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 3-Bedroom House in Kilimani"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe what you want in the video..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Platform
                  </label>
                  <select
                    value={formData.targetPlatform}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetPlatform: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="multiple">Multiple Platforms</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp Status</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video Duration
                  </label>
                  <select
                    value={formData.videoDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videoDuration: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="15s">15 seconds</option>
                    <option value="30s">30 seconds</option>
                    <option value="60s">60 seconds</option>
                    <option value="90s">90 seconds</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaText: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Call Now, Visit Website, Shop Now"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.clientNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, clientNotes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special requirements or preferences..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 glass hover:bg-white/10 rounded-full font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
