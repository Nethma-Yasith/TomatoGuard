# 🍅 TomatoGuard - AI Powered Smart Farm Manager

![TomatoGuard Banner](https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=1200&h=400&fit=crop)

> **Empowering Tomato Farmers with AI-Driven Disease Detection & Smart Crop Management.**

[![React Native](https://img.shields.io/badge/React_Native-v0.76-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Go-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-orange.svg)](https://firebase.google.com/)
[![TensorFlow](https://img.shields.io/badge/AI-TensorFlow%20Lite-orange.svg)](https://www.tensorflow.org/lite)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blue.svg)](https://ai.google.dev/)

---

## 📱 Project Overview
**TomatoGuard** is a comprehensive mobile application designed to help farmers monitor their tomato cultivation efficiently. It combines **Computer Vision (AI)** for disease detection with a **Smart Management Dashboard** to provide actionable insights.

### 🌟 Key Features
* **📸 AI Disease Scan:** Detects *Early Blight*, *Bacterial Spot*, and *Healthy* leaves instantly using a custom-trained **TensorFlow Lite (MobileNetV2)** model.
* **📊 Smart Dashboard:** Tracks crop timeline (Vegetative, Flowering, Harvest stages), simulates weather alerts, and displays real-time market prices.
* **🤖 AI Consultant:** An integrated chatbot powered by **Google Gemini AI** to answer farming queries based on scan results.
* **📂 Digital History:** Saves all diagnosis reports with severity levels and timestamps using **Firebase Cloud Firestore**.
* **✅ Task Manager:** Daily "To-Do" list for farmers based on the crop growth stage.

---

## 🎨 App Screenshots

| Dashboard (Smart Insights) | AI Disease Scan | Diagnosis Results |
|:---:|:---:|:---:|

<img width="1920" height="1440" alt="429shots_so" src="https://github.com/user-attachments/assets/efa5e7cf-6a6a-4274-80f4-e16ec9516c34" />
<img width="1920" height="1440" alt="807shots_so" src="https://github.com/user-attachments/assets/9cb35479-3cc0-49fc-991a-f818aa72fcf6" />
<img width="1920" height="1440" alt="44shots_so" src="https://github.com/user-attachments/assets/95549064-bf4b-4250-bc1e-735faa3e8b8b" />

## 🛠️ Tech Stack

* **Frontend:** React Native (Expo SDK 52)
* **Backend:** Google Firebase (Authentication & Firestore)
* **AI/ML:**
    * **Image Classification:** TensorFlow Lite (MobileNetV2 Transfer Learning)
    * **Generative AI:** Google Gemini Pro API
* **Styling:** NativeWind (TailwindCSS)
* **Simulation:** Custom Logic for Crop Cycle & Market Data

---

## 🧠 AI Model Training

The disease detection model was trained using the **PlantVillage Dataset** on Google Colab. We used **Transfer Learning** with `MobileNetV2` for high accuracy on mobile devices.

### 📊 Training Performance
| Accuracy Graph | Loss Graph |

<img width="1143" height="726" alt="Screenshot 2026-01-08 at 19 32 48" src="https://github.com/user-attachments/assets/4be13280-e915-4ec9-84f7-83b40c86eaee" />
<img width="1083" height="722" alt="Screenshot 2026-01-08 at 19 32 33" src="https://github.com/user-attachments/assets/db5333a1-26b5-42aa-a4f5-d5c9f607a0c4" />


### 🐍 Training Script (Python/TensorFlow)
Here is the core script used to train and convert the model to `.tflite`:

```python
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
import zipfile
import os

# --- 1. CONFIGURATION ---
DATASET_ZIP = "dataset.zip"  # ඔයා Upload කරන Zip එකේ නම
DATASET_DIR = "dataset"      # Extract වුනාම හැදෙන ෆෝල්ඩර් එක
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20                  # වට 20ක් Train කරනවා

# --- 2. EXTRACT DATASET ---
if os.path.exists(DATASET_ZIP):
    print(f"📦 Unzipping {DATASET_ZIP}...")
    with zipfile.ZipFile(DATASET_ZIP, 'r') as zip_ref:
        zip_ref.extractall(".")
    print("✅ Dataset Extracted!")
else:
    print(f"⚠️ Warning: {DATASET_ZIP} not found. Assuming folders are already there.")

# --- 3. DATA AUGMENTATION (Pre-processing) ---
# ෆොටෝ එහා මෙහා කරලා (Rotate, Zoom) Data වැඩි කරගන්නවා
train_datagen = ImageDataGenerator(
    rescale=1./255,         # Pixel value 0-1 අතරට
    rotation_range=25,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2    # 20% Test කරන්න
)

print("\n📥 Loading Data...")
train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True
)

validation_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# Classes ටික Save කරගන්නවා
labels = (train_generator.class_indices)
print(f"✅ Classes Found: {list(labels.keys())}")

# --- 4. MODEL BUILDING (MobileNetV2) ---
print("\n🏗️ Building Model...")
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False # පරණ දැනුම වෙනස් වෙන්න දෙන්නේ නෑ

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x)  # Overfitting අඩු කරන්න
predictions = Dense(train_generator.num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# --- 5. TRAINING ---
print("\n🚀 Training Started...")
history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS
)

# --- 6. SAVE GRAPHS (For README) ---
print("\n📊 Saving Graphs for README...")

# Accuracy Graph
plt.figure(figsize=(10, 6))
plt.plot(history.history['accuracy'], label='Train Accuracy', color='green')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy', color='orange')
plt.title('Model Accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend()
plt.grid(True)
plt.savefig('accuracy_graph.png') # <--- Image එක Save වෙනවා
plt.show()

# Loss Graph
plt.figure(figsize=(10, 6))
plt.plot(history.history['loss'], label='Train Loss', color='red')
plt.plot(history.history['val_loss'], label='Validation Loss', color='blue')
plt.title('Model Loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend()
plt.grid(True)
plt.savefig('loss_graph.png') # <--- Image එක Save වෙනවා
plt.show()

# --- 7. EXPORT TO TFLITE ---
print("\n⚙️ Converting to TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Model එක Save කිරීම
with open('tomato_model.tflite', 'wb') as f:
    f.write(tflite_model)

# Labels ටික Save කිරීම
with open("labels.txt", "w") as f:
    for class_name in list(labels.keys()):
        f.write(f"{class_name}\n")

print("\n🎉 All Done!")
print("👉 Download these files from the left panel:")
print("   1. tomato_model.tflite")
print("   2. labels.txt")
print("   3. accuracy_graph.png (For README)")
print("   4. loss_graph.png (For README)")
