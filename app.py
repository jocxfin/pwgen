from flask import Flask, jsonify, render_template, request, send_file
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

# Lisää reititys manifest.json tiedostolle
@app.route('/manifest.json')
def serve_manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')

# Lisää reititys Service Worker -tiedostolle
@app.route('/service-worker.js')
def serve_sw():
    return send_file('service-worker.js', mimetype='application/javascript')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5069)
