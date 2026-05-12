# 🚗 CarTrustAI

**AI-Powered Car Marketplace — Where Every Listing is Verified**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

---

## ✨ What is CarTrustAI?

CarTrustAI is a full-stack car marketplace where users can list their cars for sale and admins can manage all listings — with one key difference: **every uploaded image goes through a two-stage AI pipeline** before the listing goes live.

No fake listings. No wrong photos. No hidden damage.

---

## 🧠 AI Pipeline

Every image uploaded by a user passes through **two AI models** automatically:

```
User uploads image
       ↓
 Stage 1: Car Detection
 Model: MobileNetV2 (TensorFlow)
 Task: Is this a car?
       ↓
   ✅ Yes → Stage 2
   ❌ No  → Rejected immediately
       ↓
 Stage 2: Damage Assessment
 Model: ResNet18 (PyTorch)
 Task: Is the car damaged?
       ↓
   ⚠️ Damaged → Badge shown on image
   ✅ Intact  → Badge shown on image
```

Each image gets a visual badge (`⚠ DMG` or `✓ OK`) so the admin instantly knows the car's condition without opening every photo.

---

## 🚀 Features

- 🔐 **Admin Panel** — manage all listings, approve or reject submissions
- 📤 **User Listings** — any user can submit their car for sale
- 🤖 **Stage 1 — Car Verification** — MobileNetV2 rejects non-car images instantly
- 🔍 **Stage 2 — Damage Detection** — ResNet18 (91% accuracy) flags damaged cars
- 🏷️ **Visual Damage Badges** — each photo shows `⚠ DMG` or `✓ OK` on upload
- 🖼️ **Image Upload System** — drag & drop with real-time AI feedback
- 📋 **Listing Management** — full CRUD for car ads

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js / Express |
| AI Server | Python / Flask |
| Model 1 | TensorFlow / MobileNetV2 — Car Detection |
| Model 2 | PyTorch / ResNet18 — Damage Classification |
| Dataset 1 | Stanford Cars Dataset |
| Dataset 2 | Car Damage Detection Dataset (Kaggle) |

---

## 📊 Model Performance

| Model | Task | Accuracy |
|-------|------|----------|
| MobileNetV2 | Car vs Not Car | ~95% |
| ResNet18 | Damaged vs Intact | **91%** |

ResNet18 trained with Transfer Learning on 1,840 images (920 damaged / 920 intact), validated on 460 images.

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/Imad1507/CarTrustAI.git
cd CarTrustAI
```

### 2. Download AI models

> ⚠️ Model files are not included in the repo (too large for GitHub).
> Place them in the `backend/` folder:

| File | Description | How to get |
|------|-------------|------------|
| `car_detector.h5` | MobileNetV2 — Car Detection | Train on Stanford Cars Dataset |
| `car_damage_model.pth` | ResNet18 — Damage Detection | Train on [Car Damage Detection Dataset](https://www.kaggle.com/datasets/anujms/car-damage-detection) |

### 3. Start the AI server (Flask — port 5001)

```bash
cd backend
pip install -r requirements.txt
python model_server.py
```

**Available endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Stage 1 — Is this a car? |
| `/predict-damage` | POST | Stage 2 — Is the car damaged? |
| `/predict-full` | POST | Full pipeline — car check + damage assessment |

### 4. Start the Node.js backend (port 5000)

```bash
cd backend
npm install
npm start
```

### 5. Start the React frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
CarTrustAI/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Sale.jsx        # Upload form with AI verification
│   │   └── api.js              # detectCar() + detectDamage()
│   └── ...
├── backend/
│   ├── model_server.py         # Flask AI server (2 models, 3 endpoints)
│   ├── car_detector.h5         # ⚠️ Not in repo — download separately
│   ├── car_damage_model.pth    # ⚠️ Not in repo — download separately
│   └── ...
└── README.md
```

---

## 🧪 Model Training

The damage detection model was trained on Kaggle using GPU (T4):

- **Architecture**: ResNet18 pretrained on ImageNet
- **Fine-tuning**: Last layer only (1,026 trainable parameters)
- **Epochs**: 10
- **Best Val Accuracy**: 90.7%
- **Final Test Accuracy**: 91%
- **Classes**: `00-damage` (damaged) / `01-whole` (intact)

---

Made with ☕ and Python by [Imad1507](https://github.com/Imad1507)
