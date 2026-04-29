from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('car_detector.h5')
print("✅ Model loaded")

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image'}), 400
    
    file = request.files['image']
    img = Image.open(io.BytesIO(file.read())).convert('RGB')
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    
    pred = model.predict(arr)[0][0]
    is_car = bool(pred < 0.5)
    confidence = float((1 - pred) * 100 if is_car else pred * 100)
    
    return jsonify({
        'isCar': is_car,
        'confidence': round(confidence, 1),
        'label': 'سيارة' if is_car else 'ليست سيارة'
    })

if __name__ == '__main__':
    app.run(port=5001)