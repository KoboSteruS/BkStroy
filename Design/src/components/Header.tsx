import { Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onAdminClick: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      {/* Верхняя полоса с контактами */}
      <div className="bg-gray-900 text-white py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-end gap-8 text-sm">
            <a href="tel:+7XXXXXXXXXX" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Phone className="w-4 h-4" />
              +7 (XXX) XXX-XX-XX
            </a>
            <a href="mailto:info@bk-stroy.ru" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Mail className="w-4 h-4" />
              info@bk-stroy.ru
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => scrollToSection('hero')}
            onClickCapture={(e) => {
              if (e.detail === 3) {
                onAdminClick();
                e.stopPropagation();
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">БК</span>
              </div>
              <div>
                <div className="text-lg leading-none mb-0.5">БК-СТРОЙ</div>
                <div className="text-xs text-gray-500">Строительная компания</div>
              </div>
            </div>
          </div>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              О нас
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Объекты
            </button>
            <button 
              onClick={() => scrollToSection('process')} 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Услуги
            </button>
            <button 
              onClick={() => scrollToSection('contacts')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors text-sm"
            >
              Связаться
            </button>
          </nav>

          {/* Мобильное меню */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Мобильное выпадающее меню */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">О нас</button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">Объекты</button>
            <button onClick={() => scrollToSection('process')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">Услуги</button>
            <button onClick={() => scrollToSection('contacts')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors text-sm text-center">Связаться</button>
          </nav>
        )}
      </div>
    </header>
  );
}
