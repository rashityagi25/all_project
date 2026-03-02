import pandas as pd

# Convert train.txt to emotions.csv inside dataset folder
df = pd.read_csv("dataset/train.txt", names=["text", "emotion"], sep=";")
df.to_csv("dataset/emotions.csv", index=False)
print("✅ emotions.csv file created successfully!")
