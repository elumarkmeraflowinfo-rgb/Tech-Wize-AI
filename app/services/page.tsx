import { createServerSupabaseClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceCard from '@/components/ServiceCard'

export default async function ServicesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const { data: packages } = await supabase
    .from('service_packages')
    .select('*, category:service_categories(*)')
    .eq('is_active', true)
    .order('display_order')

  const groupedPackages = categories?.map((category) => ({
    category,
    packages: packages?.filter((pkg) => pkg.category_id === category.id) || [],
  }))

  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl text-gray-300">
              Professional AI-powered video production for every need. Choose your package and get started in minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {groupedPackages?.map((group) => (
            <div key={group.category.id} className="mb-20 last:mb-0">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {group.category.name}
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  {group.category.description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {group.packages.map((pkg) => (
                  <ServiceCard key={pkg.id} package={pkg} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
