from flask import Flask, jsonify, render_template, request
import secrets
import werkzeug

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-password', methods=['POST'])
def generate_password():
    length = request.form.get('length', type=int, default=12)
    password = secrets.token_urlsafe(length)
    return jsonify(password=password)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5069)

