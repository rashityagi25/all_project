import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Load dataset
data = pd.read_csv("dataset/emotions.csv")
X = data["text"]
y = data["emotion"]

# Vectorize text
vectorizer = TfidfVectorizer(max_features=5000)
X_vec = vectorizer.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# Save model and vectorizer
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/emotion_model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print(" Model trained and saved successfully!")
