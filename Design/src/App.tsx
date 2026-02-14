import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Process } from './components/Process';
import { Contacts } from './components/Contacts';
import { AdminPanel } from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  if (isAdminMode) {
    return <AdminPanel onClose={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdminClick={() => setIsAdminMode(true)} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Process />
        <Contacts />
      </main>
      <Toaster />
    </div>
  );
}
