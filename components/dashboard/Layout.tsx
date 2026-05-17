'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  LayoutDashboard, ArrowRightLeft, Vote, Users, FileText,
  LogOut, Settings, Menu, X, ChevronDown, Globe,
  MonitorCheck
} from 'lucide-react';
import { RiLeafLine, RiMoneyDollarCircleLine, RiSunLine } from 'react-icons/ri';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar, ToastContainer } from '@/components/ui';
import { ROLE_LABELS } from '@/lib/utils';
import { Role } from '@/types';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['PRESIDENT','TREASURER','MEMBER','AUDITOR','MINISTRY','ADMIN'] as Role[] },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowRightLeft, roles: ['PRESIDENT','TREASURER','AUDITOR','MINISTRY','ADMIN'] as Role[] },
  { href: '/dashboard/votes', label: 'Votes', icon: Vote, roles: ['PRESIDENT','TREASURER','MEMBER','AUDITOR','MINISTRY','ADMIN'] as Role[] },
  { href: '/dashboard/members', label: 'Membres', icon: Users, roles: ['PRESIDENT','ADMIN'] as Role[] },
  { href: '/dashboard/reports', label: 'Rapports', icon: FileText, roles: ['PRESIDENT','TREASURER','AUDITOR','MINISTRY','ADMIN'] as Role[] },
  { href: '/dashboard/cotisations', label: 'Cotisations', icon: RiMoneyDollarCircleLine,roles:['PRESIDENT','TREASURER','MEMBER'] },
  { href: '/ministry', label : 'Coordination', icon: MonitorCheck, roles:['MINISTRY','ADMIN'] as Role[]},
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(item =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const router = useRouter(); // ajouter import { useRouter } from 'next/navigation'

  useEffect(() => {
    if (user && (user.role === 'MINISTRY' || user.role === 'ADMIN') && pathname === '/dashboard') {
      router.replace('/ministry');
    }
  }, [user, pathname]);

  const isDry = theme === 'dry';

  return (
    <div className="flex min-h-screen bg-texture" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: 240, minHeight: '100vh',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RiLeafLine size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>CoopLedger</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>POLYGON · TOGO</div>
          </div>
        </div>

        {/* Cooperative info */}
        {user?.cooperative_name && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Coopérative</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{user.cooperative_name}</div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {visibleItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${active ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}

          {/* Public dashboard link */}
          <Link href="/" className="sidebar-link mt-4" target="_blank" onClick={() => setSidebarOpen(false)}>
            <Globe size={17} />
            Vue publique
          </Link>
        </nav>

        {/* Bottom: theme toggle + user */}
        <div className="px-3 pb-4 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="sidebar-link"
            style={{ justifyContent: 'space-between' }}
          >
            <div className="flex items-center gap-2">
              {isDry ? <RiSunLine size={17} /> : <RiLeafLine size={17} />}
              <span>{isDry ? 'Saison sèche' : 'Saison des pluies'}</span>
            </div>
            <div style={{
              width: 32, height: 18, borderRadius: 9,
              background: isDry ? 'var(--accent)' : 'var(--success)',
              position: 'relative', flexShrink: 0,
              transition: 'background 0.3s',
            }}>
              <div style={{
                position: 'absolute', top: 2,
                left: isDry ? 16 : 2,
                width: 14, height: 14, borderRadius: '50%',
                background: 'white', transition: 'left 0.3s',
              }} />
            </div>
          </button>

          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button
              className="sidebar-link w-full"
              onClick={() => setUserMenuOpen(o => !o)}
              style={{ justifyContent: 'space-between' }}
            >
              <div className="flex items-center gap-2">
                <Avatar name={user?.full_name || 'U'} size={26} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.full_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role ? ROLE_LABELS[user.role] : ''}</div>
                </div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute', bottom: '100%', left: 0, right: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)', padding: '4px 0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 50,
              }}>
                <Link href="/dashboard/settings" className="sidebar-link" style={{ borderRadius: 0, padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <Settings size={15} /> Paramètres
                </Link>
                <button
                  className="sidebar-link w-full"
                  style={{ borderRadius: 0, padding: '8px 14px', color: 'var(--danger)' }}
                  onClick={logout}
                >
                  <LogOut size={15} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm">
            <Menu size={20} />
          </button>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>CoopLedger</div>
          <div style={{ width: 40 }} />
        </header>

        <main className="flex-1 p-6 lg:p-8 animate-fadeIn">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
