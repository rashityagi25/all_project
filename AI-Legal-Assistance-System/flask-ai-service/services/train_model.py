import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline

print("=" * 50)
print("  PHASE 8 — TRAINING CRIME CLASSIFIER")
print("=" * 50)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "dataset", "CrimeVsNoCrimeArticles.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "crime_classifier.pkl")

# 1. Load Dataset
print("\n[1] Loading dataset...")
df = pd.read_csv(DATA_PATH)
print(f"    Total rows : {len(df)}")
print(f"    Crime      : {len(df[df.is_crime_report == 1])}")
print(f"    Not Crime  : {len(df[df.is_crime_report == 0])}")

# 2. Preprocess
print("\n[2] Preprocessing...")
df.dropna(inplace=True)
X = df['title'].astype(str)
y = df['is_crime_report'].astype(int)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"    Train: {len(X_train)} | Test: {len(X_test)}")

# 3. Build Pipeline
print("\n[3] Building TF-IDF + Logistic Regression pipeline...")
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=10000,
        sublinear_tf=True,
        stop_words='english',
        min_df=2
    )),
    ('clf', LogisticRegression(
        C=1.0,
        max_iter=1000,
        random_state=42
    ))
])

# 4. Train
print("\n[4] Training model...")
pipeline.fit(X_train, y_train)

# 5. Evaluate
print("\n[5] Evaluating...")
y_pred = pipeline.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n    ✅ Accuracy : {acc*100:.2f}%")
print(f"\n{classification_report(y_test, y_pred, target_names=['Not Crime','Crime'])}")

# 6. Save Model
joblib.dump(pipeline, MODEL_PATH)
print(f"\n[6] Model saved → {MODEL_PATH}")

# 7. Test Predictions
print("\n[7] Sample predictions:")
tests = [
    "Man arrested for armed robbery",
    "Tips for healthy morning routine",
    "FIR filed in murder case",
    "Best travel destinations 2024",
]
for t in tests:
    pred = pipeline.predict([t])[0]
    prob = pipeline.predict_proba([t])[0][1]
    label = "🔴 CRIME" if pred == 1 else "🟢 NOT CRIME"
    print(f"    {label} ({prob:.2f}) | {t}")

print("\n" + "=" * 50)
print("  PHASE 8 COMPLETE ✅")
print("=" * 50)