from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import torch
import torch.nn as nn
from torchvision import models, transforms
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# ============================================================
# Model 1 — Car Detector (TensorFlow)
# ============================================================
car_detector = tf.keras.models.load_model('car_detector.h5')
print("✅ Car detector loaded")

# ============================================================
# Model 2 — Damage Classifier (PyTorch ResNet18)
# ============================================================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

damage_model = models.resnet18(weights=None)
damage_model.fc = nn.Linear(damage_model.fc.in_features, 2)
damage_model.load_state_dict(torch.load("car_damage_model.pth", map_location=DEVICE))
damage_model.to(DEVICE)
damage_model.eval()
print("✅ Damage classifier loaded")

damage_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ============================================================
# Endpoints
# ============================================================

@app.route('/predict', methods=['POST'])
def predict():
    """Model 1 — هل الصورة سيارة؟"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image'}), 400

    file = request.files['image']
    img  = Image.open(io.BytesIO(file.read())).convert('RGB')
    img  = img.resize((224, 224))
    arr  = np.array(img) / 255.0
    arr  = np.expand_dims(arr, axis=0)

    pred      = car_detector.predict(arr)[0][0]
    is_car    = bool(pred < 0.5)
    confidence = float((1 - pred) * 100 if is_car else pred * 100)

    return jsonify({
        'isCar':      is_car,
        'confidence': round(confidence, 1),
        'label':      'سيارة' if is_car else 'ليست سيارة'
    })


@app.route('/predict-damage', methods=['POST'])
def predict_damage():
    """Model 2 — هل السيارة مضرورة؟"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image'}), 400

    file = request.files['image']
    img  = Image.open(io.BytesIO(file.read())).convert('RGB')

    tensor = damage_transforms(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = damage_model(tensor)
        probs  = torch.softmax(output, dim=1)[0]
        pred   = probs.argmax().item()

    is_damaged = pred == 0
    confidence = round(probs[pred].item() * 100, 1)

    return jsonify({
        'isDamaged':  is_damaged,
        'confidence': confidence,
        'label':      'مضرورة' if is_damaged else 'سليمة'
    })


@app.route('/predict-full', methods=['POST'])
def predict_full():
    """
    Pipeline كامل:
    1. تحقق إذا صورة سيارة
    2. إذا سيارة — قيّم الضرر
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image'}), 400

    file      = request.files['image']
    img_bytes = file.read()

    # --- Step 1: Car detection ---
    img_tf = Image.open(io.BytesIO(img_bytes)).convert('RGB').resize((224, 224))
    arr    = np.expand_dims(np.array(img_tf) / 255.0, axis=0)
    pred   = car_detector.predict(arr)[0][0]
    is_car = bool(pred < 0.5)

    if not is_car:
        return jsonify({
            'isCar':     False,
            'label':     'ليست سيارة',
            'isDamaged': None,
            'damage':    None
        })

    # --- Step 2: Damage classification ---
    img_pt = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    tensor = damage_transforms(img_pt).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = damage_model(tensor)
        probs  = torch.softmax(output, dim=1)[0]
        pred   = probs.argmax().item()

    is_damaged = pred == 0
    confidence = round(probs[pred].item() * 100, 1)

    return jsonify({
        'isCar':      True,
        'isDamaged':  is_damaged,
        'confidence': confidence,
        'label':      'سيارة مضرورة' if is_damaged else 'سيارة سليمة'
    })


if __name__ == '__main__':
    app.run(port=5001)