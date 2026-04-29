<div align="center">

# 🚗 CarTrustAI

**AI-Powered Car Marketplace — Where Every Listing is Verified**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

</div>

---

## ✨ What is CarTrustAI?

CarTrustAI is a full-stack car marketplace where users can list their cars for sale and admins can manage all listings — with one key difference: **every uploaded image is automatically verified by an AI model** before the listing goes live.

No more fake listings. No more wrong photos. Just real cars.

---

## 🧠 How the AI Works

When a user uploads a photo, the image is sent to a Python/Flask server running a **MobileNetV2** model fine-tuned on the **Stanford Cars Dataset**. The model predicts whether the image contains a car or not. Only verified images are accepted.

```
User uploads image
       ↓
Flask AI Server (MobileNetV2)
       ↓
   Is it a car?
   ✅ Yes → Listing proceeds
   ❌ No  → Upload rejected
```

---

## 🚀 Features

- 🔐 **Admin Panel** — manage all listings, approve or reject submissions
- 📤 **User Listings** — any user can submit their car for sale
- 🤖 **AI Image Validation** — automatic detection of non-car images on upload
- 🖼️ **Image Upload System** — clean upload flow with instant AI feedback
- 📋 **Listing Management** — full CRUD for car ads

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js / Express |
| AI Server | Python / Flask |
| ML Model | TensorFlow / MobileNetV2 |
| Dataset | Stanford Cars (via Kaggle) |

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/Imad1507/CarTrustAI.git
cd CarTrustAI
```

### 2. Start the AI server
```bash
cd backend
pip install -r requirements.txt
python model_server.py
# Runs on http://localhost:5001
```

### 3. Start the Node.js backend
```bash
cd backend
npm install
npm start
```

### 4. Start the React frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 📁 Project Structure

```
CarTrustAI/
├── frontend/          # React app
├── backend/
│   ├── model_server.py    # Flask AI server
│   ├── car_detector.h5    # Trained MobileNetV2 model
│   └── ...
└── README.md
```

---

## 🧪 Model Info

- **Architecture**: MobileNetV2 (fine-tuned)
- **Task**: Binary classification — Car vs Not Car
- **Dataset**: Stanford Cars Dataset
- **Framework**: TensorFlow / Keras

---

<div align="center">

Made with ☕ and Python by [Imad1507](https://github.com/Imad1507)

</div>
