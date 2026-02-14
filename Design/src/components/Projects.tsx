import { useState } from 'react';
import { ChevronLeft, ChevronRight, Building2, Warehouse, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: any;
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Офисные помещения',
    description: '800+ объектов',
    image: 'https://images.unsplash.com/photo-1762758731234-2569e31afa02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWxsJTIwY29tbWVyY2lhbCUyMGJ1aWxkaW5nJTIwbG9va2luZyUyMHVwfGVufDF8fHx8MTc3MDM4Mzc2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Складские помещения',
    description: '500+ объектов',
    image: 'https://images.unsplash.com/photo-1621384843923-f1a2d8b7eb3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBpbmR1c3RyaWFsJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcwMzU3NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Warehouse,
  },
  {
    id: 3,
    title: 'Земельные участки',
    description: '300+ объектов',
    image: 'https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kJTIwcGxvdCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzcwMzgzNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: MapPin,
  },
];

export function Projects() {
  const [projects] = useState<Project[]>(initialProjects);
  const [startIndex, setStartIndex] = useState(0);
  
  const visibleCount = 3;
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex < projects.length - visibleCount;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setStartIndex(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setStartIndex(prev => Math.min(projects.length - visibleCount, prev + 1));
    }
  };

  const visibleProjects = projects.slice(startIndex, startIndex + visibleCount);

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Заголовок */}
          <div className="lg:w-1/3 flex-shrink-0 lg:sticky lg:top-32">
            <h2 className="text-4xl lg:text-5xl mb-6">
              Каталог объектов
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Современные помещения и участки для развития вашего бизнеса. 
              Все объекты проверены и готовы к использованию.
            </p>
            
            {/* Навигация - перемещена сюда для десктопа */}
            <div className="hidden lg:flex gap-3">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  canScrollLeft 
                    ? 'border-gray-300 hover:border-blue-600 hover:bg-blue-50' 
                    : 'border-gray-200 opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollRight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Карточки объектов */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="group cursor-pointer"
                  style={{ 
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` 
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-4 bg-white shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Оверлей */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Иконка в углу */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <project.icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl mb-1 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              ))}
            </div>

            {/* Навигация для мобильных */}
            <div className="flex lg:hidden justify-center gap-3 mt-8">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  canScrollLeft 
                    ? 'border-gray-300 hover:border-blue-600 hover:bg-blue-50' 
                    : 'border-gray-200 opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollRight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
