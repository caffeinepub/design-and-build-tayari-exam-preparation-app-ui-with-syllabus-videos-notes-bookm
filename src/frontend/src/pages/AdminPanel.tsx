import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '@/components/AdminGuard';
import BottomNav from '@/components/BottomNav';
import SyllabusManagementForm from '@/components/admin/SyllabusManagementForm';
import GKManagementForm from '@/components/admin/GKManagementForm';
import IQManagementForm from '@/components/admin/IQManagementForm';
import SecondPaperManagementForm from '@/components/admin/SecondPaperManagementForm';
import ThirdPaperManagementForm from '@/components/admin/ThirdPaperManagementForm';
import ExamManagementForm from '@/components/admin/ExamManagementForm';
import StandaloneVideoManagementForm from '@/components/admin/StandaloneVideoManagementForm';
import StandaloneNoteManagementForm from '@/components/admin/StandaloneNoteManagementForm';

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <AdminGuard>
      <div className="min-h-screen app-page-bg pb-20">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Panel</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="syllabus" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
              <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
              <TabsTrigger value="gk">GK</TabsTrigger>
              <TabsTrigger value="iq">IQ</TabsTrigger>
              <TabsTrigger value="second">2nd Paper</TabsTrigger>
              <TabsTrigger value="third">3rd Paper</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="syllabus">
              <SyllabusManagementForm />
            </TabsContent>

            <TabsContent value="gk">
              <GKManagementForm />
            </TabsContent>

            <TabsContent value="iq">
              <IQManagementForm />
            </TabsContent>

            <TabsContent value="second">
              <SecondPaperManagementForm />
            </TabsContent>

            <TabsContent value="third">
              <ThirdPaperManagementForm />
            </TabsContent>

            <TabsContent value="exams">
              <ExamManagementForm />
            </TabsContent>

            <TabsContent value="videos">
              <StandaloneVideoManagementForm />
            </TabsContent>

            <TabsContent value="notes">
              <StandaloneNoteManagementForm />
            </TabsContent>
          </Tabs>
        </main>

        <BottomNav />
      </div>
    </AdminGuard>
  );
}
