from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    """Обработка формы обратной связи"""
    data = request.get_json()
    # Здесь можно добавить логику отправки email или сохранения в БД
    return jsonify({'success': True, 'message': 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.'})

if __name__ == '__main__':
    app.run(debug=True)
