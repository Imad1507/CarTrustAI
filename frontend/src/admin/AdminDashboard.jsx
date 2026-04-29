// frontend/src/admin/AddCar.jsx
import React, { useState } from 'react';
import { detectCar } from '../api';

const AddCar = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '2000',
    price: '',
    discountPrice: '',
    color: '',
    description: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: '',
    engine: '',
    horsepower: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingImages, setCheckingImages] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragOver, setDragOver] = useState(false);
  const [focusedField, setFocusedField] = useState('');
const [yearError, setYearError] = useState('');
const [brandError, setBrandError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const validateYear = (year) => {
  const yearNum = parseInt(year);
  if (year && (yearNum < 2000 || yearNum > 2026)) {
    setYearError('❌ السنة يجب أن تكون بين 2000 و 2026');
    return false;
  }
  setYearError('');
  return true;
};

const handleYearChange = (e) => {
  const newYear = e.target.value;
  setFormData({ ...formData, year: newYear });
  validateYear(newYear);
};
const validateBrand = (brand) => {
  if (brand.trim() === '') {
    setBrandError('❌ الماركة مطلوبة');
    return false;
  }
  setBrandError('');
  return true;
};

const handleBrandChange = (e) => {
  const newBrand = e.target.value;
  setFormData({ ...formData, brand: newBrand });
  validateBrand(newBrand);
};
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setMessage({ type: 'error', text: 'Maximum 5 images allowed' });
      return;
    }
    setCheckingImages(true);
    setMessage({ type: '', text: '' });
    const validImages = [], validPreviews = [], invalidImages = [];
    for (const file of files) {
      try {
        const detectionResult = await detectCar(file);
        if (detectionResult.is_car === true || detectionResult.isCar === true) {
          validImages.push(file);
          validPreviews.push(URL.createObjectURL(file));
        } else {
          invalidImages.push(file.name);
        }
      } catch (error) {
        invalidImages.push(file.name);
      }
    }
    setCheckingImages(false);
    if (invalidImages.length > 0) {
      setMessage({ type: 'error', text: `Not car images: ${invalidImages.join(', ')}` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
    if (validImages.length > 0) {
      setImages([...images, ...validImages]);
      setImagePreviews([...imagePreviews, ...validPreviews]);
      setMessage({ type: 'success', text: `${validImages.length} image(s) verified & accepted` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setMessage({ type: 'error', text: 'Please upload at least one car image' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage({ type: 'error', text: 'Authentication required' });
      setLoading(false);
      window.location.href = '/admin/login';
      return;
    }
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, key === 'discountPrice' && !value ? formData.price : value);
    });
    images.forEach(image => submitData.append('images', image));
    try {
      const response = await fetch('http://localhost:5000/api/admin/add-car', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Vehicle added to inventory successfully' });
        setTimeout(() => { resetForm(); setMessage({ type: '', text: '' }); }, 2500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add vehicle' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Ensure backend is running on port 5000' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', brand: '', model: '', year: '', price: '', discountPrice: '', color: '', description: '', fuelType: 'Petrol', transmission: 'Automatic', mileage: '', engine: '', horsepower: '' });
    setImages([]);
    setImagePreviews([]);
  };

  const discountPercent = formData.price && formData.discountPrice
    ? Math.round(((formData.price - formData.discountPrice) / formData.price) * 100) : 0;

  const inputStyle = (name) => ({
    ...styles.input,
    ...(focusedField === name ? styles.inputFocused : {})
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        .add-car-root {
          font-family: 'DM Sans', sans-serif;
          background: #00bfff;
          min-height: 100vh;
          color: #e8e8e8;
        }

        .ac-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        /* ─── Header ─── */
        .ac-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #222;
        }
        .ac-header-left {}
        .ac-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: #c8a04a;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .ac-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4rem;
          letter-spacing: 0.05em;
          color: #fff;
          line-height: 1;
          margin: 0;
        }
        .ac-title span { color: #c8a04a; }
        .ac-subtitle {
          margin-top: 0.75rem;
          color: #555;
          font-size: 0.9rem;
          font-weight: 300;
        }
        .ac-badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #c8a04a;
          border: 1px solid #c8a04a33;
          padding: 0.4rem 1rem;
          background: #c8a04a0d;
        }

        /* ─── Alerts ─── */
        .ac-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ac-alert-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ac-alert.error  { background: #1a0808; border: 1px solid #8b0000; color: #ff6b6b; }
        .ac-alert.error .ac-alert-dot { background: #ff4444; }
        .ac-alert.success { background: #081a0e; border: 1px solid #1a6b3a; color: #4caf7d; }
        .ac-alert.success .ac-alert-dot { background: #4caf50; box-shadow: 0 0 8px #4caf5088; }
        .ac-alert.checking { background: #0d0f1a; border: 1px solid #2a3580; color: #7b9cff; }
        .ac-alert.checking .ac-alert-dot { background: #5b7fff; animation: pulse 1s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* ─── Grid ─── */
        .ac-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 900px) { .ac-grid { grid-template-columns: 1fr; } }

        /* ─── Card ─── */
        .ac-card {
          background: #111;
          border: 1px solid #1e1e1e;
          padding: 1.75rem;
          transition: border-color 0.3s;
          position: relative;
          overflow: hidden;
        }
        .ac-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c8a04a, #a07830, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ac-card:hover::before { opacity: 1; }
        .ac-card:hover { border-color: #2a2a2a; }

        .ac-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #1a1a1a;
        }
        .ac-card-icon {
          width: 32px; height: 32px;
          background: #c8a04a15;
          border: 1px solid #c8a04a30;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .ac-card-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #c8a04a;
          text-transform: uppercase;
          font-weight: 400;
        }

        /* ─── Fields ─── */
        .ac-field { margin-bottom: 1rem; }
        .ac-field:last-child { margin-bottom: 0; }
        .ac-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 0.4rem;
          font-family: 'Space Mono', monospace;
        }
        .ac-input, .ac-select, .ac-textarea {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #222;
          color: #e8e8e8;
          padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
          border-radius: 0;
        }
        .ac-input::placeholder { color: #333; }
        .ac-input:focus, .ac-select:focus, .ac-textarea:focus {
          border-color: #c8a04a;
          background: #111;
        }
        .ac-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23c8a04a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        .ac-select option { background: #111; }
        .ac-textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.6;
        }

        .ac-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* ─── Discount badge ─── */
        .ac-discount {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0.6rem 1rem;
          background: #c8a04a12;
          border: 1px solid #c8a04a30;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: #c8a04a;
          animation: slideDown 0.3s ease;
        }
        .ac-discount-pct {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e8c060;
        }

        /* ─── Upload ─── */
        .ac-upload-zone {
          border: 1px dashed #2a2a2a;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        .ac-upload-zone:hover, .ac-upload-zone.dragover {
          border-color: #c8a04a55;
          background: #c8a04a08;
        }
        .ac-upload-zone input[type="file"] { display: none; }
        .ac-upload-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          display: block;
          opacity: 0.6;
        }
        .ac-upload-text {
          font-size: 0.85rem;
          color: #555;
          margin-bottom: 0.25rem;
        }
        .ac-upload-text strong { color: #888; }
        .ac-upload-hint {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: #333;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ─── Image previews ─── */
        .ac-previews {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .ac-preview-item {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid #1e1e1e;
        }
        .ac-preview-item img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s;
        }
        .ac-preview-item:hover img { transform: scale(1.05); }
        .ac-preview-remove {
          position: absolute;
          top: 4px; right: 4px;
          width: 22px; height: 22px;
          background: rgba(0,0,0,0.85);
          border: 1px solid #333;
          color: #ff6b6b;
          font-size: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ac-preview-item:hover .ac-preview-remove { opacity: 1; }
        .ac-preview-num {
          position: absolute;
          bottom: 4px; left: 4px;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          color: rgba(255,255,255,0.6);
          background: rgba(0,0,0,0.7);
          padding: 1px 4px;
        }

        /* ─── Image counter ─── */
        .ac-img-counter {
          display: flex;
          gap: 4px;
          margin-top: 0.75rem;
        }
        .ac-img-pip {
          height: 3px;
          flex: 1;
          background: #1e1e1e;
          transition: background 0.3s;
        }
        .ac-img-pip.filled { background: #c8a04a; }

        /* ─── Footer buttons ─── */
        .ac-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0 0;
          border-top: 1px solid #1a1a1a;
          margin-top: 0.5rem;
        }
        .ac-footer-left {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: #333;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .ac-footer-right {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .ac-btn-reset {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid #222;
          color: #444;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ac-btn-reset:hover { border-color: #444; color: #888; }

        .ac-btn-submit {
          padding: 0.75rem 2.5rem;
          background: #c8a04a;
          border: none;
          color: #0a0a0a;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .ac-btn-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%);
          transition: transform 0.3s;
        }
        .ac-btn-submit:hover::after { transform: translateX(0); }
        .ac-btn-submit:hover { background: #e8b84a; }
        .ac-btn-submit:disabled {
          background: #2a2520;
          color: #554030;
          cursor: not-allowed;
        }
        .ac-btn-submit:disabled::after { display: none; }

        /* ─── Loading spinner ─── */
        .ac-spinner {
          display: inline-block;
          width: 10px; height: 10px;
          border: 1.5px solid #55402055;
          border-top-color: #c8a04a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── Fuel/trans selector pills ─── */
        .ac-pills {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        .ac-pill {
          padding: 0.65rem;
          border: 1px solid #1e1e1e;
          background: #0d0d0d;
          color: #ff0000;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .ac-pill:hover { border-color: #333; color: #888; }
        .ac-pill.selected {
          border-color: #c8a04a55;
          background: #0c00f515;
          color: #c8a04a;
        }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; }
      `}</style>

      <div className="add-car-root">
        <div className="ac-container">

          {/* Header */}
          <div className="ac-header">
            <div className="ac-header-left">
              <div className="ac-eyebrow">Inventory Management</div>
              <h1 className="ac-title">ADD <span>VEHICLE</span></h1>
              <p className="ac-subtitle">Register a new car to the dealership catalog</p>
            </div>
            <div className="ac-badge">ADMIN PORTAL</div>
          </div>

          {/* Alerts */}
          {checkingImages && (
            <div className="ac-alert checking">
              <span className="ac-alert-dot"></span>
              Verifying images with AI detection...
            </div>
          )}
          {message.text && (
            <div className={`ac-alert ${message.type}`}>
              <span className="ac-alert-dot"></span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="ac-grid">

              {/* ── Left Column ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Basic Info */}
                <div className="ac-card">
                  <div className="ac-card-header">
                    <div className="ac-card-icon">🚗</div>
                    <span className="ac-card-title">Basic Information</span>
                  </div>
                  <div className="ac-field">
                    <label className="ac-label">Vehicle Name *</label>
                    <input className="ac-input" type="text" name="name" placeholder="e.g. BMW M3 Competition" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="ac-row">
                    <div className="ac-field">
                      <label className="ac-label">Brand *</label>
                      <input className="ac-input" type="text" name="brand" placeholder="BMW" value={formData.brand} onChange={handleChange} required />
                    </div>
                    <div className="ac-field">
                      <label className="ac-label">Model</label>
                      <input className=" className={`ac-input ${yearError ? 'error-input' : ''}`" type="text" name="model" placeholder="M3" value={formData.model} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="ac-row">
                    <div className="ac-field">
                      <label className="ac-label">Year *</label>
                      <input 
                      className={`ac-input ${yearError ? 'error-input' : ''}`}
                       type="number" 
    name="year" 
    placeholder="2024" 
    value={formData.year} 
    onChange={handleYearChange}
    required 
  />
  {yearError && (
    <div style={{ 
      color: '#ff4444', 
      fontSize: '0.7rem', 
      marginTop: '0.5rem',
      fontFamily: "'Space Mono', monospace",
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span>⚠️</span> {yearError}
    </div>
  )}
</div>
                    <div className="ac-field">
                      <label className="ac-label">Color</label>
                      <input className="ac-input" type="text" name="color" placeholder="Alpine White" value={formData.color} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="ac-card">
                  <div className="ac-card-header">
                    <div className="ac-card-icon">💰</div>
                    <span className="ac-card-title">Pricing</span>
                  </div>
                  <div className="ac-row">
                    <div className="ac-field">
                      <label className="ac-label">Original Price ($) *</label>
                      <input className="ac-input" type="number" name="price" placeholder="0" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="ac-field">
                      <label className="ac-label">Discounted Price ($)</label>
                      <input className="ac-input" type="number" name="discountPrice" placeholder="0" value={formData.discountPrice} onChange={handleChange} />
                    </div>
                  </div>
                  {discountPercent > 0 && (
                    <div className="ac-discount">
                      <span className="ac-discount-pct">{discountPercent}%</span>
                      OFF — Save ${(formData.price - formData.discountPrice).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="ac-card">
                  <div className="ac-card-header">
                    <div className="ac-card-icon">⚙️</div>
                    <span className="ac-card-title">Specifications</span>
                  </div>
                  <div className="ac-field">
                    <label className="ac-label">Fuel Type</label>
                    <div className="ac-pills">
                      {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                        <button key={f} type="button" className={`ac-pill ${formData.fuelType === f ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, fuelType: f })}>
                          {f === 'Petrol' ? '⛽' : f === 'Diesel' ? '🛢' : f === 'Electric' ? '⚡' : '🔋'} {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ac-field" style={{ marginTop: '1rem' }}>
                    <label className="ac-label">Transmission</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {['Manual', 'Automatic'].map(t => (
                        <button key={t} type="button" className={`ac-pill ${formData.transmission === t ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, transmission: t })}>
                          {t === 'Manual' ? '🕹' : '⚙️'} {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ac-row" style={{ marginTop: '1rem' }}>
                    <div className="ac-field">
                      <label className="ac-label">Mileage (km)</label>
                      <input className="ac-input" type="number" name="mileage" placeholder="0" value={formData.mileage} onChange={handleChange} />
                    </div>
                    <div className="ac-field">
                      <label className="ac-label">Horsepower (HP)</label>
                      <input className="ac-input" type="text" name="horsepower" placeholder="e.g. 503" value={formData.horsepower} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="ac-field">
                    <label className="ac-label">Engine</label>
                    <input className="ac-input" type="text" name="engine" placeholder="e.g. 3.0L Twin-Turbo I6" value={formData.engine} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* ── Right Column ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Images */}
                <div className="ac-card">
                  <div className="ac-card-header">
                    <div className="ac-card-icon">🖼</div>
                    <span className="ac-card-title">Vehicle Photos</span>
                  </div>

                  <label className={`ac-upload-zone ${dragOver ? 'dragover' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageUpload({ target: { files: e.dataTransfer.files, value: '' } }); }}>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    <span className="ac-upload-icon">📸</span>
                    <div className="ac-upload-text"><strong>Click to upload</strong> or drag & drop</div>
                    <div className="ac-upload-hint">JPEG · PNG · WEBP — Max 5 images · AI-verified</div>
                  </label>

                  {/* Progress pips */}
                  <div className="ac-img-counter">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className={`ac-img-pip ${i < images.length ? 'filled' : ''}`}></div>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#333', marginTop: '0.4rem', letterSpacing: '0.1em' }}>
                    {images.length}/5 IMAGES LOADED
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="ac-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="ac-preview-item">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button type="button" className="ac-preview-remove" onClick={() => removeImage(index)}>✕</button>
                          <span className="ac-preview-num">0{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="ac-card" style={{ flex: 1 }}>
                  <div className="ac-card-header">
                    <div className="ac-card-icon">📝</div>
                    <span className="ac-card-title">Description</span>
                  </div>
                  <div className="ac-field">
                    <textarea
                      className="ac-textarea"
                      name="description"
                      placeholder="Describe the vehicle condition, history, features, and notable details..."
                      value={formData.description}
                      onChange={handleChange}
                      style={{ minHeight: '180px' }}
                    />
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#333', letterSpacing: '0.1em', textAlign: 'right' }}>
                    {formData.description.length} CHARS
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="ac-footer">
              <div className="ac-footer-left">
                {images.length > 0 ? `${images.length} image${images.length > 1 ? 's' : ''} ready` : 'No images uploaded'}
              </div>
              <div className="ac-footer-right">
                <button type="button" className="ac-btn-reset" onClick={resetForm}>
                  Clear Form
                </button>
                <button type="submit" className="ac-btn-submit" disabled={loading || checkingImages || images.length === 0}>
                  {loading && <span className="ac-spinner"></span>}
                  {loading ? 'ADDING VEHICLE...' : 'ADD TO INVENTORY'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default AddCar;