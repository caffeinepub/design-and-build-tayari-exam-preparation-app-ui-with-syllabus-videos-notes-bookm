import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Notifications</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">New Updates</h2>
          <div className="space-y-3">
            {notifications
              .filter((n) => n.category === 'update')
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer ${!notification.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">{notification.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{notification.date}</p>
                    </div>
                    {!notification.read && <Badge variant="default">New</Badge>}
                  </div>
                </Card>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Exam Dates</h2>
          <div className="space-y-3">
            {notifications
              .filter((n) => n.category === 'exam')
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer ${!notification.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">{notification.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{notification.date}</p>
                    </div>
                    {!notification.read && <Badge variant="default">New</Badge>}
                  </div>
                </Card>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
