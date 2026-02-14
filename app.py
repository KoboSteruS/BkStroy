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

def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "admin_token": "change_me_in_config",
        "secret_key": "change_me_secret_key"
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
        'about': {'heading': '', 'p1': '', 'p2': '', 'stats': [], 'partners_title': '', 'partners': []},
        'projects': {'heading': '', 'desc': ''},
        'process': {'heading': '', 'circle_title': '', 'circle_sub': '', 'advantages': [], 'steps': [], 'principles_title': '', 'principles_subtitle': '', 'principles': []},
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
@app.route('/')
def index():
    catalog = load_catalog()
    content = load_site_content()
    return render_template('index.html', catalog=catalog, content=content)

@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    return jsonify({'success': True, 'message': 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.'})

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
