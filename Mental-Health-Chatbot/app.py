import os, sqlite3, cv2, joblib
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from datetime import datetime
from transformers import pipeline
import speech_recognition as sr
import numpy as np
from fer import FER   # ← REAL Face Emotion Detection
from pydub import AudioSegment

# Set FFmpeg path (adjust if your FFmpeg is installed elsewhere)
AudioSegment.converter = r"C:\Program Files\ffmpeg\ffmpeg-8.0-essentials_build\bin\ffmpeg.exe"

app = Flask(__name__)
app.secret_key = "secret123"
os.makedirs("data", exist_ok=True)
DB_PATH = "data/app.db"

# Load trained text emotion model
model = joblib.load("models/emotion_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

# Face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# --------- CREATE DATABASE ----------
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )""")

        conn.execute("""CREATE TABLE IF NOT EXISTS logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            mood TEXT,
            message TEXT,
            timestamp TEXT
        )""")

init_db()


# --------- ROUTES ---------

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    password = request.form["password"]

    with sqlite3.connect(DB_PATH) as conn:
        try:
            conn.execute("INSERT INTO users (username,password) VALUES (?,?)",
                         (username, password))
            conn.commit()
            return jsonify({"ok": True})
        except:
            return jsonify({"ok": False, "msg": "User already exists"})


@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.execute("SELECT id FROM users WHERE username=? AND password=?",
                           (username, password))
        row = cur.fetchone()

        if row:
            session["user_id"] = row[0]
            session["username"] = username
            return jsonify({"ok": True})
        else:
            return jsonify({"ok": False, "msg": "Invalid login"})


@app.route("/chat")
def chat():
    if "user_id" not in session:
        return redirect(url_for("home"))
    return render_template("chat.html", username=session["username"])


# -------- TEXT EMOTION --------
@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.json.get("text", "")

    X_vec = vectorizer.transform([text])
    mood = model.predict(X_vec)[0]

    save_log(session["user_id"], mood, text)
    return jsonify({"mood": mood, "feedback": get_feedback(mood)})


# NOTE: The `/voice` route that accepted raw uploads and attempted to
# directly open them with `speech_recognition.AudioFile` was removed
# because uploaded audio can be in various container formats (MP3,
# OGG, AAC, etc.) which `speech_recognition` may not accept directly.
# The route below (defined later) now converts uploads to PCM WAV
# using pydub/ffmpeg before calling the recognizer.


# -------- FACE EMOTION (NEW FIXED VERSION) --------
@app.route("/camera", methods=["GET"])
def camera():
    cap = cv2.VideoCapture(0)
    emotion = "neutral"

    ret, frame = cap.read()
    if ret:
        # REAL emotion detector
        fer_detector = FER()
        detected = fer_detector.top_emotion(frame)

        if detected:
            emotion = detected[0]   # joy, sadness, anger, neutral, fear, etc.

    cap.release()
    cv2.destroyAllWindows()

    save_log(session["user_id"], emotion, "face_detection")

    return jsonify({"mood": emotion, "feedback": get_feedback(emotion)})


# -------- FEEDBACK TEXT --------
def get_feedback(mood):
    if mood == "joy":
        return "You seem happy! Keep doing what makes you feel this way."
    elif mood == "sadness":
        return "It seems you're sad. Try listening to calming music or talking to someone."
    elif mood == "anger":
        return "Take deep breaths. Try writing your feelings or going for a walk."
    elif mood == "fear":
        return "You may be feeling anxious. Try grounding or deep breathing exercises."
    else:
        return "Stay mindful and take care of your mental well-being."


# -------- SAVE LOG --------
def save_log(uid, mood, message):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("INSERT INTO logs (user_id,mood,message,timestamp) VALUES (?,?,?,?)",
                     (uid, mood, message, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()


# -------- RUN --------
if __name__ == "__main__":
    app.run(debug=True)


 

# Set FFmpeg path
from pydub import AudioSegment

AudioSegment.converter = r"C:\Program Files\ffmpeg\ffmpeg-8.0-essentials_build\bin\ffmpeg.exe"



def convert_to_pcm_wav(input_file, output_file="voice_pcm.wav"):
    """Converts any audio file to PCM WAV (mono, 16kHz)"""
    audio = AudioSegment.from_file(input_file)
    audio = audio.set_channels(1)
    audio = audio.set_frame_rate(16000)
    audio.export(output_file, format="wav")
    return output_file

@app.route("/voice", methods=["POST"])
def voice():
    try:
        uploaded_file = request.files.get("audio")
        if not uploaded_file:
            return jsonify({"error": "No audio uploaded."})

        uploaded_file.save("voice.wav")

        if os.path.getsize("voice.wav") == 0:
            return jsonify({"error": "Uploaded file is empty."})

        # Convert to PCM WAV
        pcm_file = convert_to_pcm_wav("voice.wav")

        # Recognize speech
        r = sr.Recognizer()
        with sr.AudioFile(pcm_file) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data)

        # Predict mood
        X_vec = vectorizer.transform([text])
        mood = model.predict(X_vec)[0]

        # Save log
        save_log(session["user_id"], mood, text)

        return jsonify({"mood": mood, "text": text, "feedback": get_feedback(mood)})

    except Exception as e:
        return jsonify({"error": str(e)})
