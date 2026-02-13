import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import SplashScreen from './pages/SplashScreen';
import Dashboard from './pages/Dashboard';
import Syllabus from './pages/Syllabus';
import SubjectContent from './pages/SubjectContent';
import Notifications from './pages/Notifications';
import VideoBookmarks from './pages/VideoBookmarks';
import NotesBookmarks from './pages/NotesBookmarks';
import OldQuestions from './pages/OldQuestions';
import Exam from './pages/Exam';
import OfflineLibrary from './pages/OfflineLibrary';
import { gkContent } from './content/gk';
import { iqContent } from './content/iq';
import { officeManagementContent, constitutionContent, mathsContent } from './content/secondPaper';
import { serviceManagementContent, accountingContent, lawContent } from './content/thirdPaper';
import AppErrorBoundary from './components/AppErrorBoundary';

function RootComponent() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const syllabusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/syllabus',
  component: Syllabus,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: Notifications,
});

const videoBookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks/videos',
  component: VideoBookmarks,
});

const notesBookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks/notes',
  component: NotesBookmarks,
});

const oldQuestionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/old-questions',
  component: OldQuestions,
});

const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam',
  component: Exam,
});

const offlineLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/offline-library',
  component: OfflineLibrary,
});

const gkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/gk',
  component: () => <SubjectContent config={gkContent} />,
});

const iqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/iq',
  component: () => <SubjectContent config={iqContent} />,
});

const officeManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/office-management',
  component: () => <SubjectContent config={officeManagementContent} />,
});

const constitutionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/constitution',
  component: () => <SubjectContent config={constitutionContent} />,
});

const mathsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/maths',
  component: () => <SubjectContent config={mathsContent} />,
});

const serviceManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/service-management',
  component: () => <SubjectContent config={serviceManagementContent} />,
});

const accountingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/accounting',
  component: () => <SubjectContent config={accountingContent} />,
});

const lawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/law',
  component: () => <SubjectContent config={lawContent} />,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  syllabusRoute,
  notificationsRoute,
  videoBookmarksRoute,
  notesBookmarksRoute,
  oldQuestionsRoute,
  examRoute,
  offlineLibraryRoute,
  gkRoute,
  iqRoute,
  officeManagementRoute,
  constitutionRoute,
  mathsRoute,
  serviceManagementRoute,
  accountingRoute,
  lawRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}
