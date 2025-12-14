import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Zap, Target, Users, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              About <span className="text-gradient">Tech-Wize</span>
            </h1>
            <p className="text-xl text-gray-300">
              AI-powered digital production and automation company built to help creators, entrepreneurs, and small businesses succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Tech-Wize exists to remove friction between creativity and execution. Many individuals and businesses know what they want to say, sell, or build, but are blocked by time, technical complexity, or cost. We bridge that gap by combining artificial intelligence, automation, and human creativity into lean, repeatable systems that deliver real results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: 'Speed',
                  description: 'Deliver professional videos in 24-48 hours, not weeks',
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: 'Precision',
                  description: 'AI-optimized content designed for conversion',
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: 'People-First',
                  description: 'Human creativity enhanced by AI, not replaced',
                },
                {
                  icon: <Rocket className="w-8 h-8" />,
                  title: 'Growth',
                  description: 'Built to scale with your business',
                },
              ].map((value, index) => (
                <div key={index} className="glass p-6 rounded-xl">
                  <div className="text-primary mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  We operate at the intersection of AI capability and human insight. Every video we create leverages cutting-edge AI tools for speed and consistency, while maintaining the creative direction and quality control that only humans can provide.
                </p>
                <p>
                  Our platform is designed mobile-first, WhatsApp-friendly, and Africa-forward, while maintaining global technical standards. We understand the unique challenges of emerging markets and build solutions that work in real-world conditions.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">About the Founder</h2>
              <div className="glass p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Erick - Founder & CEO</h3>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Tech-Wize was founded by Erick, a digital systems thinker, AI practitioner, and creative technologist with a deep passion for building practical, human-centered technology.
                  </p>
                  <p>
                    With a background spanning digital production, AI-assisted workflows, automation design, and creator-economy tooling, Erick approaches AI not as hype, but as leverage—to simplify complexity, increase output, and enable individuals and small teams to compete at a much higher level.
                  </p>
                  <p>
                    Tech-Wize was born from lived experience: navigating limited resources, high ambition, and the need for systems that actually work in real-world conditions. This perspective shaped the company's focus on speed, affordability, clarity, and scalability, especially for underserved and fast-moving markets.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                The long-term vision is to evolve Tech-Wize into a full AI ecosystem encompassing digital production, automation services, creator tools, and scalable SaaS platforms that empower the next generation of digital entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
