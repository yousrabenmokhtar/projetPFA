# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
from classifier import PDFClassifier

app = Flask(__name__)
CORS(app)

# === Chemins et modèles ===
MODEL_PATH = "./models/pdf_classifier_final"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Le dossier modèle est manquant : {MODEL_PATH}")

# Charger le classifieur
classifier = PDFClassifier(model_path=MODEL_PATH)

# Dossiers
UPLOAD_FOLDER = 'uploads'
STATS_FILE = 'analysis_stats.json'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# === Fonctions de gestion des stats ===
def load_stats():
    """Charge les statistiques depuis le fichier JSON"""
    if not os.path.exists(STATS_FILE):
        return {
            "total_uploads": 0,
            "daily_stats": {},
            "distribution": {
                "invoice": 0,
                "purchase order": 0,
                "shippingorder": 0,
                "report": 0
            },
            "document_history": []
        }
    try:
        with open(STATS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Erreur lecture stats: {e}")
        return {
            "total_uploads": 0,
            "daily_stats": {},
            "distribution": {"invoice": 0, "purchase order": 0, "shippingorder": 0, "report": 0},
            "document_history": []
        }

def save_stats(stats):
    """Sauvegarde les statistiques dans le fichier JSON"""
    try:
        with open(STATS_FILE, 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Erreur sauvegarde stats: {e}")


# === Routes API ===

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier uploadé"}), 400

    file = request.files['file']
    if file.filename == '' or not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Veuillez uploader un fichier PDF valide"}), 400

    # Sauvegarder temporairement
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        # Prédiction
        result = classifier.predict(filepath)

        if "error" not in result:
            # 📊 Mise à jour des stats
            stats = load_stats()
            today = datetime.now().strftime("%Y-%m-%d")
            doc_type = result["predicted_class"]

            # Incrémenter les compteurs
            stats["total_uploads"] += 1
            stats["daily_stats"][today] = stats["daily_stats"].get(today, 0) + 1
            stats["distribution"][doc_type] = stats["distribution"].get(doc_type, 0) + 1

            # Ajouter à l'historique
            stats["document_history"].append({
                "filename": file.filename,
                "type": doc_type,
                "confidence": round(result["confidence"], 3),
                "timestamp": datetime.now().isoformat()
            })

            # Garder seulement les 100 derniers
            if len(stats["document_history"]) > 100:
                stats["document_history"] = stats["document_history"][-100:]

            save_stats(stats)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Erreur interne: {str(e)}"}), 500

    finally:
        # Nettoyage
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                print(f"Erreur suppression fichier: {e}")


@app.route('/stats', methods=['GET'])
def get_stats():
    """Endpoint pour le dashboard en temps réel"""
    stats = load_stats()
    
    # Calculer la confiance moyenne
    confidences = [doc["confidence"] for doc in stats["document_history"]]
    avg_confidence = round(sum(confidences) / len(confidences), 3) if confidences else 0.0

    # Ajouter la confiance moyenne dans la réponse
    stats["avg_confidence"] = avg_confidence
    return jsonify(stats)


@app.route('/health', methods=['GET'])
def health():
    """Endpoint de santé"""
    return jsonify({
        "status": "ok",
        "model_loaded": True,
        "total_uploads": load_stats()["total_uploads"]
    })

@app.route('/delete', methods=['POST'])
def delete_document():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({"error": "Nom de fichier manquant"}), 400

    stats = load_stats()
    # Filtrer l'historique
    before_count = len(stats["document_history"])
    stats["document_history"] = [d for d in stats["document_history"] if d["filename"] != filename]

    if len(stats["document_history"]) == before_count:
        return jsonify({"error": "Document non trouvé"}), 404

    # Mettre à jour les stats
    stats["total_uploads"] = len(stats["document_history"])
    
    # Recalculer daily_stats et distribution
    stats["daily_stats"] = {}
    stats["distribution"] = {"invoice": 0, "purchase order": 0, "shippingorder": 0, "report": 0}
    for doc in stats["document_history"]:
        day = doc["timestamp"].split("T")[0]
        stats["daily_stats"][day] = stats["daily_stats"].get(day, 0) + 1
        stats["distribution"][doc["type"]] = stats["distribution"].get(doc["type"], 0) + 1

    save_stats(stats)
    return jsonify({"success": True})
if __name__ == '__main__':
    print(f"✅ Modèle chargé depuis {MODEL_PATH}")
    print("🚀 Serveur démarré sur http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)