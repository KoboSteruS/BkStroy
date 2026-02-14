export function About() {
  const stats = [
    { value: '10+', label: 'Лет на рынке' },
    { value: '1000+', label: 'Довольных клиентов' },
    { value: '4000+', label: 'Проектов реализовано' },
    { value: '95%', label: 'Соблюдение сроков' },
  ];

  const partners = [
    { name: 'ПромСтрой' },
    { name: 'МегаГрупп' },
    { name: 'СтройАльянс' },
    { name: 'БизнесЦентр' },
    { name: 'ГородРемонт' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Текст о компании */}
          <div>
            <h2 className="text-4xl lg:text-5xl mb-6">О нас</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
              <p>
                Мы — современная строительная компания, специализирующаяся на ремонте коммерческих 
                помещений и устройстве фасадов зданий. Наша миссия — создавать функциональные, стильные 
                и долговечные пространства для бизнеса, сочетая передовые технологии с внимательным 
                отношением к потребностям клиента.
              </p>
              <p>
                За время работы мы успешно реализовали множество проектов в разных сегментах: 
                от офисов и магазинов до кафе и складских помещений. Для нас каждый заказ — это не просто стройка, 
                а возможность помочь бизнесу выглядеть достойно и работать эффективно.
              </p>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="text-5xl lg:text-6xl mb-2 bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Партнеры */}
        <div className="mt-20">
          <p className="text-sm text-gray-500 mb-8 text-center lg:text-left">
            Нам доверяют ведущие компании
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <span className="text-gray-700">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
