import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '../components/AdminGuard';
import SyllabusManagementForm from '../components/admin/SyllabusManagementForm';
import GKManagementForm from '../components/admin/GKManagementForm';
import IQManagementForm from '../components/admin/IQManagementForm';
import SecondPaperManagementForm from '../components/admin/SecondPaperManagementForm';
import ThirdPaperManagementForm from '../components/admin/ThirdPaperManagementForm';
import ExamManagementForm from '../components/admin/ExamManagementForm';
import StandaloneVideoManagementForm from '../components/admin/StandaloneVideoManagementForm';
import StandaloneNoteManagementForm from '../components/admin/StandaloneNoteManagementForm';
import OldQuestionsManagementForm from '../components/admin/OldQuestionsManagementForm';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('syllabus');

  return (
    <AdminGuard>
      <div className="min-h-screen app-page-bg">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage all content for the Tayari exam preparation app
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-8">
              <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
              <TabsTrigger value="gk">GK</TabsTrigger>
              <TabsTrigger value="iq">IQ</TabsTrigger>
              <TabsTrigger value="second">Second Paper</TabsTrigger>
              <TabsTrigger value="third">Third Paper</TabsTrigger>
              <TabsTrigger value="old-questions">Old Questions</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="syllabus" className="space-y-4">
              <SyllabusManagementForm />
            </TabsContent>

            <TabsContent value="gk" className="space-y-4">
              <GKManagementForm />
            </TabsContent>

            <TabsContent value="iq" className="space-y-4">
              <IQManagementForm />
            </TabsContent>

            <TabsContent value="second" className="space-y-4">
              <SecondPaperManagementForm />
            </TabsContent>

            <TabsContent value="third" className="space-y-4">
              <ThirdPaperManagementForm />
            </TabsContent>

            <TabsContent value="old-questions" className="space-y-4">
              <OldQuestionsManagementForm />
            </TabsContent>

            <TabsContent value="exams" className="space-y-4">
              <ExamManagementForm />
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <StandaloneVideoManagementForm />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <StandaloneNoteManagementForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}
