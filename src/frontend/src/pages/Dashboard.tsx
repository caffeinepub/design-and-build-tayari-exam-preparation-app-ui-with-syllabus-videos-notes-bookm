import { useNavigate } from '@tanstack/react-router';
import { Bell, Search, BookOpen, GraduationCap, Brain, Building2, Scale, Calculator, Users, FileText, Gavel, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import AppLogo from '@/components/AppLogo';
import CourseImageCarousel from '@/components/CourseImageCarousel';
import { useNotifications } from '@/hooks/useNotifications';

export default function Dashboard() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const firstPaperSubjects = [
    { id: 'syllabus', name: 'पाठ्यक्रम', icon: BookOpen, path: '/syllabus', color: 'from-violet-500 to-purple-500' },
    { id: 'gk', name: 'सामान्य ज्ञान', icon: GraduationCap, path: '/subject/gk', color: 'from-blue-500 to-cyan-500' },
    { id: 'iq', name: 'बौद्धिक क्षमता', icon: Brain, path: '/subject/iq', color: 'from-pink-500 to-rose-500' },
  ];

  const secondPaperSubjects = [
    { id: 'office', name: 'कार्यालय व्यावस्थापन', icon: Building2, path: '/subject/office-management', color: 'from-amber-500 to-orange-500' },
    { id: 'constitution', name: 'संविधान', icon: Scale, path: '/subject/constitution', color: 'from-emerald-500 to-teal-500' },
    { id: 'maths', name: 'गणित', icon: Calculator, path: '/subject/maths', color: 'from-indigo-500 to-blue-500' },
  ];

  const thirdPaperSubjects = [
    { id: 'service', name: 'सेवा व्यावस्थापन', icon: Users, path: '/subject/service-management', color: 'from-green-500 to-emerald-500' },
    { id: 'accounting', name: 'लेखा तथा लेखा प्रणाली', icon: FileText, path: '/subject/accounting', color: 'from-red-500 to-pink-500' },
    { id: 'law', name: 'कानुन', icon: Gavel, path: '/subject/law', color: 'from-purple-500 to-violet-500' },
  ];

  const courseImages = [
    '/assets/generated/kharidar-course-1.dim_600x400.png',
    '/assets/generated/kharidar-course-2.dim_600x400.png',
    '/assets/generated/kharidar-course-3.dim_600x400.png',
    '/assets/generated/kharidar-course-4.dim_600x400.png',
  ];

  return (
    <div className="min-h-screen app-page-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AppLogo />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tayari
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/notifications' })}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Courses Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Kharidar Courses</h2>
          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 overflow-hidden">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">खरिदार तयारी कोर्स</h3>
                  <p className="text-emerald-50">सबै पेपरहरूको लागि पूर्ण तयारी सामग्री</p>
                </div>
                <GraduationCap className="w-16 h-16 opacity-80" />
              </div>
              {/* Course Image Carousel */}
              <div className="mt-4">
                <CourseImageCarousel images={courseImages} />
              </div>
            </div>
          </Card>
        </section>

        {/* First Paper */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">First paper</h2>
          <div className="grid grid-cols-3 gap-4">
            {firstPaperSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200 border-0 overflow-hidden"
                onClick={() => navigate({ to: subject.path })}
              >
                <div className={`h-full p-6 bg-gradient-to-br ${subject.color} text-white flex flex-col items-center justify-center space-y-3`}>
                  <subject.icon className="w-12 h-12" />
                  <span className="font-semibold text-center text-sm">{subject.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Second Paper */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Second paper</h2>
          <div className="grid grid-cols-3 gap-4">
            {secondPaperSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200 border-0 overflow-hidden"
                onClick={() => navigate({ to: subject.path })}
              >
                <div className={`h-full p-6 bg-gradient-to-br ${subject.color} text-white flex flex-col items-center justify-center space-y-3`}>
                  <subject.icon className="w-12 h-12" />
                  <span className="font-semibold text-center text-sm">{subject.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Third Paper */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Third paper</h2>
          <div className="grid grid-cols-3 gap-4">
            {thirdPaperSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200 border-0 overflow-hidden"
                onClick={() => navigate({ to: subject.path })}
              >
                <div className={`h-full p-6 bg-gradient-to-br ${subject.color} text-white flex flex-col items-center justify-center space-y-3`}>
                  <subject.icon className="w-12 h-12" />
                  <span className="font-semibold text-center text-sm">{subject.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Old Questions */}
        <section>
          <Card
            className="cursor-pointer hover:scale-[1.02] transition-transform duration-200 bg-gradient-to-r from-slate-700 to-slate-800 text-white border-0"
            onClick={() => navigate({ to: '/old-questions' })}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileQuestion className="w-10 h-10" />
                <div>
                  <h3 className="text-lg font-bold">पुराना प्रश्नहरू</h3>
                  <p className="text-slate-300 text-sm">विगतका वर्षका प्रश्न पत्रहरू</p>
                </div>
              </div>
              <Badge variant="secondary">सबै हेर्नुहोस्</Badge>
            </div>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
