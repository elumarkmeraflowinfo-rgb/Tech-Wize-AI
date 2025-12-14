import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { FolderOpen, Clock, CheckCircle, DollarSign, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects, count: totalProjects } = await supabase
    .from('projects')
    .select('*, package:service_packages(*)', { count: 'exact' })
    .eq('client_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: activeProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', user!.id)
    .in('status', ['queued', 'in_production', 'in_review', 'awaiting_approval', 'in_revision'])

  const { count: completedProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', user!.id)
    .eq('status', 'completed')

  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('client_id', user!.id)
    .eq('status', 'completed')

  const totalSpent = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

  const stats = [
    {
      icon: <FolderOpen className="w-6 h-6" />,
      label: 'Total Projects',
      value: totalProjects || 0,
      color: 'text-primary',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Active',
      value: activeProjects || 0,
      color: 'text-yellow-500',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: 'Completed',
      value: completedProjects || 0,
      color: 'text-accent',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Total Spent',
      value: `${totalSpent.toLocaleString()} KES`,
      color: 'text-secondary',
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_payment: 'text-yellow-500 bg-yellow-500/10',
      queued: 'text-blue-500 bg-blue-500/10',
      in_production: 'text-purple-500 bg-purple-500/10',
      in_review: 'text-orange-500 bg-orange-500/10',
      awaiting_approval: 'text-cyan-500 bg-cyan-500/10',
      in_revision: 'text-amber-500 bg-amber-500/10',
      completed: 'text-green-500 bg-green-500/10',
      cancelled: 'text-red-500 bg-red-500/10',
    }
    return colors[status] || 'text-gray-500 bg-gray-500/10'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your overview.</p>
        </div>
        <Link
          href="/get-started"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="glass p-6 rounded-xl">
            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block p-4 glass hover:bg-white/10 transition-colors rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{project.package?.name}</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No projects yet</p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
