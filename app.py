import os
import json
import uuid
from functools import wraps
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, abort

app = Flask(__name__)

# Загрузка конфига админки (токен для ссылки /{token}/admin)
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config', 'admin_config.json')
CATALOG_PATH = os.path.join(os.path.dirname(__file__), 'data', 'catalog.json')
SITE_CONTENT_PATH = os.path.join(os.path.dirname(__file__), 'data', 'site_content.json')

# Загрузка изображений (каталог объектов)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads', 'catalog')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "admin_token": "change_me_in_config",
        "secret_key": "change_me_secret_key",
        "site_url": ""
    }

CONFIG = load_config()
app.secret_key = CONFIG.get('secret_key', 'dev-secret-key')

def get_admin_token():
    return CONFIG.get('admin_token', '')

# --- Каталог (чтение/запись) ---
def load_catalog():
    if os.path.exists(CATALOG_PATH):
        with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_catalog(catalog):
    os.makedirs(os.path.dirname(CATALOG_PATH), exist_ok=True)
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

def next_id(catalog):
    if not catalog:
        return 0
    return max(item.get('id', 0) for item in catalog) + 1

# --- Тексты сайта (редактируемые в админке) ---
def load_site_content():
    if os.path.exists(SITE_CONTENT_PATH):
        with open(SITE_CONTENT_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return get_default_site_content()

def get_default_site_content():
    return {
        'hero': {'title': '', 'desc': '', 'btn_primary': '', 'btn_secondary': ''},
        'about': {
            'heading': '', 'p1': '', 'p2': '', 'advantages': [],
            'partners_title': '', 'partners': [
                {'type': 'image', 'src': 'images/Company/company1.png', 'alt': 'Партнёр'},
                {'type': 'image', 'src': 'images/Company/company2.png', 'alt': 'Партнёр'},
                {'type': 'text', 'name': 'АО Карелагросервис'}
            ]
        },
        'projects': {'heading': '', 'desc': ''},
        'process': {
            'heading': '', 'circle_title': '', 'circle_sub': '', 'advantages': [], 'steps': [], 
            'principles_title': '', 'principles_subtitle': '', 'principles': [],
            'slider_images': ['images/process.jpg']
        },
        'contacts': {'heading': '', 'subtitle': '', 'phone': '', 'email': '', 'schedule': ''},
        'footer': {'logo_title': '', 'logo_subtitle': '', 'about': '', 'nav_title': '', 'services_title': '', 'services': [], 'copy': ''}
    }

def save_site_content(content):
    os.makedirs(os.path.dirname(SITE_CONTENT_PATH), exist_ok=True)
    with open(SITE_CONTENT_PATH, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

# --- Проверка доступа в админку ---
def admin_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if not session.get('admin_authenticated'):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return wrapped

# --- Маршруты сайта ---
def get_seo_base_url():
    """
    Базовый URL сайта для og:image, canonical и т.д.
    Важно: за прокси request.url_root часто даёт localhost — тогда превью в Telegram не работает.
    Задайте в config/admin_config.json ключ "site_url" (например https://xn---10-9cd5be3apik.xn--p1ai).
    """
    cfg = load_config()
    if cfg.get('site_url'):
        return cfg['site_url'].rstrip('/')
    if not request:
        return 'https://bk-stroy.ru'
    proto = request.headers.get('X-Forwarded-Proto') or request.scheme
    host = request.headers.get('X-Forwarded-Host') or request.host
    if host:
        return f"{proto}://{host}".rstrip('/')
    return request.url_root.rstrip('/')


def get_seo_context():
    """Абсолютные URL и тексты для превью при расшаривании и для поисковиков."""
    base = get_seo_base_url()
    content = load_site_content()
    hero = content.get('hero') or {}
    contacts = content.get('contacts') or {}
    title = (hero.get('title') or 'БК-СТРОЙ | Ремонт коммерческих помещений и устройство фасадов в Москве').strip()
    desc = (hero.get('desc') or 'Профессиональный ремонт коммерческих помещений, устройство фасадов зданий в Москве и области. Работаем с 2016 года. Гарантия качества. Без предоплаты.').strip()
    if len(desc) > 160:
        desc = desc[:157] + '...'
    og_image_name = 'og-image.jpg' if os.path.exists(os.path.join(os.path.dirname(__file__), 'static', 'images', 'og-image.jpg')) else 'process.jpg'
    og_image_url = base + url_for('static', filename='images/' + og_image_name, _external=False)
    phone = (contacts.get('phone') or '+7 (495) 123-45-67')
    phone_clean = phone.replace(' ', '').replace('(', '').replace(')', '').replace('-', '')
    return {
        'seo_base_url': base,
        'seo_canonical': base + (request.path if request and request.path else '/'),
        'seo_title': title,
        'seo_description': desc,
        'seo_og_image': og_image_url,
        'seo_phone': phone_clean,
    }


@app.route('/')
def index():
    catalog = load_catalog()
    content = load_site_content()
    seo = get_seo_context()
    return render_template('index.html', catalog=catalog, content=content, seo=seo)

@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    return jsonify({'success': True, 'message': 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.'})


@app.route('/sitemap.xml')
def sitemap():
    """Отдаём sitemap.xml для поисковых систем."""
    return app.send_static_file('sitemap.xml')


@app.route('/robots.txt')
def robots():
    """Отдаём robots.txt для поисковых систем."""
    return app.send_static_file('robots.txt')


@app.route('/privacy')
def privacy():
    """Страница «Политика конфиденциальности»."""
    content = load_site_content()
    return render_template('privacy.html', content=content)


@app.route('/terms')
def terms():
    """Страница «Условия использования»."""
    content = load_site_content()
    return render_template('terms.html', content=content)


# --- Вход в админку по ссылке /{token}/admin ---
@app.route('/<token>/admin')
def admin_login(token):
    if token != get_admin_token():
        abort(404)
    session['admin_authenticated'] = True
    return redirect(url_for('admin_panel'))

@app.route('/admin')
def admin_panel():
    if not session.get('admin_authenticated'):
        abort(404)
    return render_template('admin.html', admin_base=url_for('admin_panel'))

@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_authenticated', None)
    return jsonify({'ok': True})

# --- API каталога (только для авторизованного админа) ---
@app.route('/api/admin/catalog', methods=['GET'])
@admin_required
def api_catalog_list():
    return jsonify(load_catalog())

@app.route('/api/admin/catalog', methods=['POST'])
@admin_required
def api_catalog_add():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'title required'}), 400
    catalog = load_catalog()
    new_id = next_id(catalog)
    item = {
        'id': new_id,
        'title': data.get('title', ''),
        'count': data.get('count', ''),
        'description': data.get('description', ''),
        'images': data.get('images', []),
        'icon': data.get('icon', '📋')
    }
    catalog.append(item)
    save_catalog(catalog)
    return jsonify(item)

@app.route('/api/admin/catalog/<int:item_id>', methods=['PUT'])
@admin_required
def api_catalog_update(item_id):
    data = request.get_json()
    catalog = load_catalog()
    for i, item in enumerate(catalog):
        if item.get('id') == item_id:
            catalog[i] = {
                'id': item_id,
                'title': data.get('title', item.get('title', '')),
                'count': data.get('count', item.get('count', '')),
                'description': data.get('description', item.get('description', '')),
                'images': data.get('images', item.get('images', [])),
                'icon': data.get('icon', item.get('icon', '📋'))
            }
            save_catalog(catalog)
            return jsonify(catalog[i])
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/admin/catalog/<int:item_id>', methods=['DELETE'])
@admin_required
def api_catalog_delete(item_id):
    catalog = load_catalog()
    new_catalog = [x for x in catalog if x.get('id') != item_id]
    if len(new_catalog) == len(catalog):
        return jsonify({'error': 'Not found'}), 404
    save_catalog(new_catalog)
    return jsonify({'ok': True})

# --- Загрузка изображений (только для админа) ---
@app.route('/api/admin/upload', methods=['POST'])
@admin_required
def api_upload():
    try:
        if 'files' not in request.files and 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        files = request.files.getlist('files') if 'files' in request.files else [request.files['file']]
        
        # Определяем тип загрузки (каталог или слайдер)
        upload_type = request.form.get('type', 'catalog')
        
        if upload_type == 'slider':
            upload_folder = os.path.join(os.path.dirname(__file__), 'static', 'images')
        else:
            upload_folder = UPLOAD_FOLDER
        
        urls = []
        os.makedirs(upload_folder, exist_ok=True)
        
        for f in files:
            if not f or not f.filename:
                continue
            if not allowed_file(f.filename):
                continue
            ext = f.filename.rsplit('.', 1)[1].lower()
            
            if upload_type == 'slider':
                # Для слайдера используем понятные имена
                name = 'process_' + str(uuid.uuid4())[:8] + '.' + ext
                path = os.path.join(upload_folder, name)
                f.save(path)
                urls.append(url_for('static', filename='images/' + name, _external=True))
            else:
                # Для каталога используем полные UUID
                name = str(uuid.uuid4()) + '.' + ext
                path = os.path.join(upload_folder, name)
                f.save(path)
                urls.append(url_for('static', filename='uploads/catalog/' + name, _external=True))
        
        if not urls:
            return jsonify({'error': 'No valid files (allowed: png, jpg, jpeg, gif, webp)'}), 400
        return jsonify({'urls': urls})
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# --- API текстов сайта (только для админа) ---
@app.route('/api/admin/site-content', methods=['GET'])
@admin_required
def api_site_content_get():
    return jsonify(load_site_content())

@app.route('/api/admin/site-content', methods=['PUT'])
@admin_required
def api_site_content_put():
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({'error': 'Invalid body'}), 400
    save_site_content(data)
    return jsonify(load_site_content())

if __name__ == '__main__':
    app.run(debug=True)
