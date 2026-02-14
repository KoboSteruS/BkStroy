import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2 } from 'lucide-react';

export function Process() {
  const steps = [
    {
      number: '01',
      title: 'Консультация и анализ',
      description: 'На этом этапе мы изучаем ваши цели, бюджет и требования к объекту. Проводим детальный осмотр помещения.',
    },
    {
      number: '02',
      title: 'Проектирование',
      description: 'Разработка технического решения, дизайн-концепции. Согласование сметы и сроков выполнения работ.',
    },
    {
      number: '03',
      title: 'Подготовка',
      description: 'Закупка материалов, организация площадки. Получение всех необходимых разрешений и согласований.',
    },
    {
      number: '04',
      title: 'Ремонт и обновление',
      description: 'Выполнение работ с соблюдением нормативов и контролем качества. Минимизация неудобств для бизнеса.',
    },
    {
      number: '05',
      title: 'Сдача объекта',
      description: 'Финальная проверка, подписание актов. Передача всей документации и гарантийных обязательств.',
    },
  ];

  const advantages = [
    'Работаем 7 дней в неделю',
    'Собственный штат специалистов',
    'Гарантия на все виды работ',
    'Работы без предоплаты',
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl lg:text-5xl mb-16">Как мы работаем</h2>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
          {/* Левая часть - изображение */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552835376-89b8cdfacb4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGJ1aWxkaW5nJTIwZmFjYWRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzAzODM3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Процесс работы"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Синий круг с текстом */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-52 h-52 bg-blue-500 rounded-full flex flex-col items-center justify-center text-white shadow-2xl">
                  <p className="text-center px-8 text-lg mb-2">
                    Бесплатная консультация
                  </p>
                  <p className="text-sm opacity-90">и расчет стоимости</p>
                </div>
              </div>
            </div>

            {/* Преимущества под фото */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{advantage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть - этапы */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div 
                key={step.number} 
                className="flex gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Наши принципы */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-3xl mb-8">Наши принципы</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl mb-3">Оперативность</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Понимаем ценность времени для бизнеса — работаем 7 дней в неделю и планируем работы так, 
                чтобы сократить простой помещения.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-xl mb-3">Ответственность</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Несём полную ответственность за результат и соблюдаем все взятые обязательства. 
                Официальная гарантия на работы.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-xl mb-3">Инновации</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Применяем передовые технологии и материалы, чтобы повысить эффективность 
                и долговечность работ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
