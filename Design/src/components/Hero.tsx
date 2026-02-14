import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const scrollToContacts = () => {
    const element = document.getElementById('contacts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-32 lg:pt-28 bg-gradient-to-br from-blue-50/50 to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 rounded-3xl overflow-hidden border border-blue-100/50">
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-16">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-white rounded-full text-sm text-blue-600 shadow-sm">
                ✨ Комплексные решения для бизнеса
              </div>
              <h1 className="text-5xl lg:text-6xl tracking-tight leading-tight">
                Строительство и ремонт для вашего бизнеса
              </h1>
              <p className="text-gray-600 text-base lg:text-lg max-w-md leading-relaxed">
                Профессиональный ремонт коммерческих помещений и устройство фасадов зданий. 
                Работаем быстро, качественно и в срок.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToContacts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 group"
                >
                  Начать сотрудничество
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('projects');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Наши проекты
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1768225953944-de033dad3b6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcwMzczNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Современное здание"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
              
              {/* Плавающая карточка */}
              <div className="absolute bottom-6 right-6 bg-white rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">4000+</div>
                    <div className="text-sm text-gray-600">Завершенных проектов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
