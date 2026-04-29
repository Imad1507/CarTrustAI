// src/api.js
const API_URL = 'http://localhost:5000/api';

export const detectCar = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch('http://localhost:5000/api/detect-car', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error detecting car:', error);
    return { is_car: false, error: true };
  }
};

// ✅ دالة جديدة لإضافة سيارة مع صور (FormData)
export const addCarWithImages = async (formData, token) => {
  const response = await fetch(`${API_URL}/admin/add-car`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // ❌ لا تضع Content-Type هنا! Browser سيضيفها تلقائياً مع الـ boundary
    },
    body: formData
  });
  return response.json();
};

// الدالة القديمة للبيانات بدون صور (إذا احتجتها)
export const addCar = async (carData, token) => {
  const response = await fetch(`${API_URL}/admin/add-car`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(carData)
  });
  return response.json();
};