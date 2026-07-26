from flask import Flask
from routes.crime_routes import crime_bp
from routes.legal_routes import legal_bp
from routes.fir_routes import fir_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(crime_bp, url_prefix='/ai')
app.register_blueprint(legal_bp, url_prefix='/ai')
app.register_blueprint(fir_bp, url_prefix='/ai')

@app.route('/health', methods=['GET'])
def health():
    return {
        "status": "ok",
        "service": "legal-ai",
        "version": "1.0",
        "endpoints": [
            "POST /ai/predict",
            "POST /ai/predict/batch",
            "POST /ai/legal-advice",
            "GET  /ai/legal-advice/all",
            "POST /ai/generate-fir"
        ]
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)