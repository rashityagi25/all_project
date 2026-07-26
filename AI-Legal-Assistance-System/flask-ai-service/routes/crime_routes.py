from flask import Blueprint, request, jsonify
import joblib
import os

crime_bp = Blueprint('crime', __name__)

# Load model once
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "crime_classifier.pkl")
model = joblib.load(MODEL_PATH)

@crime_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    title = data.get('title', '').strip()

    if not title:
        return jsonify({"error": "Field 'title' is required"}), 400

    pred = int(model.predict([title])[0])
    prob = float(model.predict_proba([title])[0][1])

    return jsonify({
        "title": title,
        "is_crime": bool(pred),
        "confidence": round(prob, 4),
        "label": "CRIME" if pred == 1 else "NOT_CRIME"
    })

@crime_bp.route('/predict/batch', methods=['POST'])
def predict_batch():
    data = request.get_json(force=True)
    titles = data.get('titles', [])

    if not titles or not isinstance(titles, list):
        return jsonify({"error": "'titles' must be a non-empty list"}), 400

    preds = model.predict(titles)
    probs = model.predict_proba(titles)[:, 1]

    results = [
        {
            "title": t,
            "is_crime": bool(p),
            "confidence": round(float(prob), 4),
            "label": "CRIME" if p == 1 else "NOT_CRIME"
        }
        for t, p, prob in zip(titles, preds, probs)
    ]

    return jsonify({"results": results, "count": len(results)})