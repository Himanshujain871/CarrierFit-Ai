import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Wand2, MessageSquare, History } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyzer', label: 'New Analysis', icon: FileText },
    { to: '/improver', label: 'STAR Bullet Rewriter', icon: Wand2 },
    { to: '/interview/demo', label: 'Interview Flashcards', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 glass-card border-r border-slate-800 p-4 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Core Workspace
          </h3>
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
          <Wand2 className="w-3.5 h-3.5 text-violet-400" />
          Pro AI Tip
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Tailor bullets with STAR metrics to boost ATS pass rates by up to 45%.
        </p>
      </div>
    </aside>
  );
}
