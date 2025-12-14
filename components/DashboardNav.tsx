'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bot, LayoutDashboard, FolderOpen, Settings, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import type { Profile } from '@/lib/types'

export default function DashboardNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { href: '/dashboard/projects', icon: <FolderOpen size={20} />, label: 'Projects' },
    { href: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <span className="text-xl font-display font-bold text-gradient">
              Tech-Wize
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-primary' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{profile.full_name}</div>
              <div className="text-xs text-gray-400 capitalize">{profile.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 glass hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <div className="text-sm font-medium mb-2">{profile.full_name}</div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
