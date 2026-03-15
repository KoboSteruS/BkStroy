# Быстрый SEO чеклист БК-СТРОЙ

## ✅ Что уже сделано

### Технические улучшения:
- [x] META-теги (title, description, keywords, robots)
- [x] Open Graph теги для соцсетей
- [x] Twitter Cards
- [x] Schema.org микроразметка (LocalBusiness, Service)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Canonical URL
- [x] Семантический HTML (header, main, footer, section, article)
- [x] ARIA-атрибуты для доступности
- [x] Alt-теги на всех изображениях
- [x] PWA Manifest

### Производительность:
- [x] GZIP сжатие (.htaccess)
- [x] Кэширование браузера
- [x] Preconnect для шрифтов
- [x] HTTPS редиректы
- [x] WWW редиректы
- [x] Защита от hotlinking

### Безопасность:
- [x] Заголовки безопасности (X-Frame-Options, CSP и др.)
- [x] Защита админки от индексации
- [x] Защита конфигурационных файлов
- [x] noopener/noreferrer на внешних ссылках

## ⚠️ Что нужно сделать ОБЯЗАТЕЛЬНО

### 1. Создать изображения (КРИТИЧНО!):
```
📁 static/images/
  └─ og-image.jpg          (1200x630px) - для соцсетей
  └─ favicon-32x32.png     (32x32px)
  └─ favicon-16x16.png     (16x16px)
  └─ apple-touch-icon.png  (180x180px)
  └─ icon-192x192.png      (192x192px) - для Android
  └─ icon-512x512.png      (512x512px) - для Android
```

**Инструмент**: https://realfavicongenerator.net/

### 2. Заменить в коде:
- [ ] `bk-stroy.ru` → ваш реальный домен
- [ ] `+7 (495) 123-45-67` → реальный телефон
- [ ] `info@bk-stroy.ru` → реальный email
- [ ] Координаты `55.7558, 37.6173` → ваш адрес
- [ ] `https://t.me/burenkow` → ваш канал

**Файлы для редактирования**:
- `templates/index.html` (строки с meta-тегами)
- `static/sitemap.xml` (домен)
- `static/robots.txt` (домен)
- `.htaccess` (домен)
- `static/manifest.json` (если нужно)

### 3. Подключить аналитику:

#### Google Analytics:
```html
<!-- Вставить перед </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Яндекс.Метрика:
```html
<!-- Вставить перед </head> -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
   ym(XXXXXXXX, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
```

### 4. Зарегистрироваться и добавить сайт:
- [ ] **Google Search Console**: https://search.google.com/search-console
- [ ] **Яндекс.Вебмастер**: https://webmaster.yandex.ru/
- [ ] **Google My Business**: https://business.google.com/
- [ ] **Yandex Business**: https://business.yandex.ru/

### 5. Загрузить Sitemap:
После регистрации в Search Console и Вебмастере:
- [ ] Указать URL: `https://ваш-домен.ru/sitemap.xml`
- [ ] Дождаться индексации (1-3 дня)

## 📊 Проверка результата

### Сразу после запуска:
1. Проверить доступность:
   - https://ваш-домен.ru/sitemap.xml
   - https://ваш-домен.ru/robots.txt

2. Проверить редиректы:
   - http://домен → https://домен ✅
   - https://www.домен → https://домен ✅

3. Валидация:
   - https://search.google.com/test/rich-results
   - https://validator.schema.org/

### Через 2-3 дня:
4. Google PageSpeed Insights:
   - https://pagespeed.web.dev/
   - Цель: 90+ баллов на мобильной версии

5. Mobile-Friendly Test:
   - https://search.google.com/test/mobile-friendly

6. Проверить индексацию в Google:
   - Запрос: `site:ваш-домен.ru`

## 🎯 Ожидаемые результаты

### Через 1 неделю:
- Сайт проиндексирован в Google и Яндекс
- Корректное отображение сниппетов в поиске
- Работающие Open Graph превью в соцсетях

### Через 1 месяц:
- Рост позиций по брендовым запросам
- Появление в локальной выдаче (Google Maps)
- Улучшение показателей в Search Console

### Через 3 месяца:
- Рост органического трафика
- Позиции по целевым запросам
- Снижение показателя отказов

## 🆘 Что делать если что-то не работает

### Sitemap не загружается:
```bash
# Проверить файл
ls -la static/sitemap.xml

# Проверить права
chmod 644 static/sitemap.xml

# Проверить роут в app.py (должен быть)
```

### Robots.txt недоступен:
Аналогично sitemap - проверить файл и маршрут

### Structured Data не валидируется:
- Проверить кавычки в JSON-LD
- Убедиться что нет лишних запятых
- Использовать https://validator.schema.org/

### Медленная загрузка:
- Проверить что .htaccess работает
- Оптимизировать изображения (TinyPNG, ImageOptim)
- Проверить что GZIP включен

## 📞 Поддержка

Если нужна помощь с:
- Настройкой аналитики
- Созданием иконок
- Регистрацией в Search Console
- Оптимизацией производительности

Напишите мне!
