import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Zap,
  Clock,
  DollarSign,
  Video,
  Palette,
  TrendingUp,
  Building,
  ShoppingBag,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 glass rounded-full text-sm font-medium mb-8 animate-fade-in">
              <span className="text-accent">AI-Powered</span> Video Production
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
              Professional Videos
              <br />
              <span className="text-gradient">Created by AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready-to-post marketing videos in 24-48 hours. Optimized for TikTok, Instagram, YouTube. Starting from 500 KES.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-lg font-semibold hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
              >
                Start Your Project
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 glass rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Examples
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">24-48h</div>
                <div className="text-sm text-gray-400">Delivery Time</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-3xl font-bold text-gradient mb-1">500+</div>
                <div className="text-sm text-gray-400">Projects Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">98%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Why <span className="text-gradient">Tech-Wize</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We combine AI power with human creativity to deliver professional results fast
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Get your videos in 24-48 hours, not weeks',
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'Affordable Pricing',
                description: 'Professional quality starting from 500 KES',
              },
              {
                icon: <Video className="w-8 h-8" />,
                title: 'Platform Optimized',
                description: 'Perfect for TikTok, Instagram, YouTube, WhatsApp',
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Custom Branding',
                description: 'Your colors, your style, your message',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'High Converting',
                description: 'Designed to grab attention and drive action',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Revisions Included',
                description: 'Get it perfect with included revisions',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the perfect video package for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Building className="w-12 h-12" />,
                title: 'Property Marketing',
                description: 'Showcase properties with stunning video tours',
                price: 'From 1,500 KES',
                features: [
                  'Professional photo/video compilation',
                  'Background music',
                  'Property highlights',
                  'Multiple formats',
                ],
                href: '/services/property-marketing',
              },
              {
                icon: <ShoppingBag className="w-12 h-12" />,
                title: 'Product Promo',
                description: 'High-converting product videos',
                price: 'From 1,200 KES',
                features: [
                  'Product showcase',
                  'Attention-grabbing hooks',
                  'Strong call-to-action',
                  'Multiple platforms',
                ],
                href: '/services/product-promo',
                popular: true,
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Creator Branding',
                description: 'Build your personal brand',
                price: 'From 1,000 KES',
                features: [
                  'Personal intro videos',
                  'Bio and value proposition',
                  'Social media optimized',
                  'Brand consistency',
                ],
                href: '/services/creator-branding',
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`relative glass p-8 rounded-2xl hover:scale-105 transition-transform ${
                  service.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-primary mb-6">{service.icon}</div>

                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>

                <div className="text-2xl font-bold text-gradient mb-6">
                  {service.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="block text-center px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full font-semibold transition-colors"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
            >
              View All Packages
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Ready to Create Amazing Videos?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of creators and businesses using Tech-Wize to grow their digital presence
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              Start Your First Project
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
