import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Video, FileText, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { id: 'home', label: 'होम', icon: Home, path: '/' },
    { id: 'video', label: 'भिडियो', icon: Video, path: '/bookmarks/videos' },
    { id: 'notes', label: 'नोट', icon: FileText, path: '/bookmarks/notes' },
    { id: 'exam', label: 'परीक्षा', icon: ClipboardCheck, path: '/exam' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate({ to: item.path })}
                className={cn(
                  'flex flex-col items-center justify-center py-3 space-y-1 transition-colors',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <item.icon className={cn('w-6 h-6', isActive && 'scale-110')} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
