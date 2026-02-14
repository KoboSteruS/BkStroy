import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Заявка отправлена! Мы свяжемся с вами в течение часа.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <section id="contacts" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl mb-4">Свяжитесь с нами</h2>
              <p className="text-gray-600 text-base">
                Готовы обсудить ваш проект? Оставьте заявку, и мы свяжемся с вами в течение часа
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Ваше имя *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Телефон *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Сообщение *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                    placeholder="Расскажите о вашем проекте..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl transition-all text-base shadow-lg hover:shadow-xl"
                >
                  Отправить заявку
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-gray-200">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Телефон</p>
                      <a href="tel:+7XXXXXXXXXX" className="text-gray-900 hover:text-blue-600 transition-colors">
                        +7 (XXX) XXX-XX-XX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">E-mail</p>
                      <a href="mailto:info@bk-stroy.ru" className="text-gray-900 hover:text-blue-600 transition-colors">
                        info@bk-stroy.ru
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Адрес</p>
                      <p className="text-gray-900">г. Москва, ул. Примерная, д. 1</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Режим работы</p>
                      <p className="text-gray-900">Пн-Вс: 8:00 - 20:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* О компании */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">БК</span>
                </div>
                <div>
                  <div className="text-xl leading-none mb-1">БК-СТРОЙ</div>
                  <div className="text-sm text-gray-400">Строительная компания</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                Современная строительная компания, специализирующаяся на ремонте коммерческих 
                помещений и устройстве фасадов зданий. Работаем с 2016 года.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Быстрые ссылки */}
            <div>
              <h3 className="text-lg mb-4">Навигация</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    О нас
                  </a>
                </li>
                <li>
                  <a href="#projects" className="text-gray-400 hover:text-white transition-colors">
                    Объекты
                  </a>
                </li>
                <li>
                  <a href="#process" className="text-gray-400 hover:text-white transition-colors">
                    Услуги
                  </a>
                </li>
                <li>
                  <a href="#contacts" className="text-gray-400 hover:text-white transition-colors">
                    Контакты
                  </a>
                </li>
              </ul>
            </div>

            {/* Услуги */}
            <div>
              <h3 className="text-lg mb-4">Наши услуги</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>Ремонт коммерческих помещений</li>
                <li>Устройство фасадов</li>
                <li>Проектирование</li>
                <li>Экспертная оценка</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2026 БК-СТРОЙ. Все права защищены.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Политика конфиденциальности
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Условия использования
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
