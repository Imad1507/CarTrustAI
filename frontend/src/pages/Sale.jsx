// frontend/src/pages/Sale.jsx
import React, { useState } from 'react';
import { detectCar } from '../api';

const Sale = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    year: '1990',
    mileage: '',
    price: '',
    color: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    condition: 'Good',
    description: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [checkingImages, setCheckingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (files) => {
    const fileArr = Array.from(files);
    if (fileArr.length + images.length > 6) {
      setMessage({ type: 'error', text: 'Maximum 6 images allowed' });
      return;
    }
    setCheckingImages(true);
    setMessage({ type: '', text: '' });
    const validImages = [], validPreviews = [], invalidImages = [];

    for (const file of fileArr) {
      try {
        const result = await detectCar(file);
        if (result.is_car === true || result.isCar === true) {
          validImages.push(file);
          validPreviews.push(URL.createObjectURL(file));
        } else {
          invalidImages.push(file.name);
        }
      } catch {
        invalidImages.push(file.name);
      }
    }

    setCheckingImages(false);
    if (invalidImages.length > 0) {
      setMessage({ type: 'error', text: `Not car images: ${invalidImages.join(', ')}` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
    if (validImages.length > 0) {
      setImages(prev => [...prev, ...validImages]);
      setImagePreviews(prev => [...prev, ...validPreviews]);
      setMessage({ type: 'success', text: `${validImages.length} car image(s) verified` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleFileInput = (e) => {
    handleImageUpload(e.target.files);
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

    const submitData = new FormData();
    Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));
    images.forEach(img => submitData.append('images', img));

    try {
      const response = await fetch('http://localhost:5000/api/sell-request', {
        method: 'POST',
        body: submitData
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setMessage({ type: 'error', text: data.message || 'Submission failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="sl-root">
          <div className="sl-success">
            <div className="sl-success-icon">✓</div>
            <div className="sl-success-eyebrow">Request Received</div>
            <h2 className="sl-success-title">WE'LL BE IN<br /><span>TOUCH</span></h2>
            <p className="sl-success-sub">
              Your vehicle listing has been submitted. Our team will review it and contact you within 24 hours.
            </p>
            <button className="sl-success-back" onClick={() => { setSubmitted(false); setFormData({ fullName:'',phone:'',email:'',brand:'',model:'',year:'',mileage:'',price:'',color:'',fuelType:'Petrol',transmission:'Manual',condition:'Good',description:'' }); setImages([]); setImagePreviews([]); }}>
              Submit Another
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="sl-root">

        {/* Hero */}
        <div className="sl-hero">
          <div className="sl-hero-bg"></div>
          <div className="sl-hero-grain"></div>
          <div className="sl-hero-line"></div>
          <div className="sl-hero-content">
            <div className="sl-eyebrow">Sell With Us</div>
            <h1 className="sl-hero-title">SELL YOUR<br /><span>VEHICLE</span></h1>
            <p className="sl-hero-sub">Get the best value for your car — fast, transparent, hassle-free</p>
          </div>
        </div>

        {/* Steps bar */}
        <div className="sl-steps">
          {['Submit Details', 'We Review', 'Get Contacted', 'Seal the Deal'].map((s, i) => (
            <div key={i} className="sl-step">
              <div className="sl-step-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="sl-step-label">{s}</div>
              {i < 3 && <div className="sl-step-line"></div>}
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="sl-alerts-wrap">
          {checkingImages && (
            <div className="sl-alert checking">
              <span className="sl-dot"></span>
              Verifying images with AI detection...
            </div>
          )}
          {message.text && (
            <div className={`sl-alert ${message.type}`}>
              <span className="sl-dot"></span>
              {message.text}
            </div>
          )}
        </div>

        {/* Form */}
        <form className="sl-form" onSubmit={handleSubmit}>
          <div className="sl-grid">

            {/* ── Left ── */}
            <div className="sl-col">

              {/* Contact */}
              <div className="sl-card">
                <div className="sl-card-head">
                  <div className="sl-card-icon">◈</div>
                  <span className="sl-card-title">Your Contact Info</span>
                </div>
                <div className="sl-field">
                  <label className="sl-label">Full Name *</label>
                  <input className="sl-input" type="text" name="fullName" placeholder="John Smith" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="sl-row">
                  <div className="sl-field">
                    <label className="sl-label">Phone *</label>
                    <input className="sl-input" type="tel" name="phone" placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Email</label>
                    <input className="sl-input" type="email" name="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="sl-card">
                <div className="sl-card-head">
                  <div className="sl-card-icon">🚗</div>
                  <span className="sl-card-title">Vehicle Details</span>
                </div>
                <div className="sl-row">
                  <div className="sl-field">
                    <label className="sl-label">Brand *</label>
                    <input className="sl-input" type="text" name="brand" placeholder="BMW" value={formData.brand} onChange={handleChange} required />
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Model *</label>
                    <input className="sl-input" type="text" name="model" placeholder="X5" value={formData.model} onChange={handleChange} required />
                  </div>
                </div>
                <div className="sl-row">
                  <div className="sl-field">
                    <label className="sl-label">Year *</label>
                    <input className="sl-input" type="number" name="year" placeholder="2020" value={formData.year} onChange={handleChange} required />
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Color</label>
                    <input className="sl-input" type="text" name="color" placeholder="Black" value={formData.color} onChange={handleChange} />
                  </div>
                </div>
                <div className="sl-row">
                  <div className="sl-field">
                    <label className="sl-label">Mileage (km) *</label>
                    <input className="sl-input" type="number" name="mileage" placeholder="45000" value={formData.mileage} onChange={handleChange} required />
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Asking Price ($) *</label>
                    <input className="sl-input" type="number" name="price" placeholder="25000" value={formData.price} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="sl-card">
                <div className="sl-card-head">
                  <div className="sl-card-icon">⚙</div>
                  <span className="sl-card-title">Specifications</span>
                </div>

                <div className="sl-field">
                  <label className="sl-label">Fuel Type</label>
                  <div className="sl-pills">
                    {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                      <button key={f} type="button"
                        className={`sl-pill ${formData.fuelType === f ? 'on' : ''}`}
                        onClick={() => setFormData({ ...formData, fuelType: f })}>
                        {f === 'Petrol' ? '⛽' : f === 'Diesel' ? '🛢' : f === 'Electric' ? '⚡' : '🔋'} {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sl-field" style={{ marginTop: '1rem' }}>
                  <label className="sl-label">Transmission</label>
                  <div className="sl-pills" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {['Manual', 'Automatic'].map(t => (
                      <button key={t} type="button"
                        className={`sl-pill ${formData.transmission === t ? 'on' : ''}`}
                        onClick={() => setFormData({ ...formData, transmission: t })}>
                        {t === 'Manual' ? '🕹' : '⚙️'} {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sl-field" style={{ marginTop: '1rem' }}>
                  <label className="sl-label">Vehicle Condition</label>
                  <div className="sl-pills" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {['Excellent', 'Good', 'Fair'].map(c => (
                      <button key={c} type="button"
                        className={`sl-pill ${formData.condition === c ? 'on' : ''}`}
                        onClick={() => setFormData({ ...formData, condition: c })}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right ── */}
            <div className="sl-col">

              {/* Images */}
              <div className="sl-card">
                <div className="sl-card-head">
                  <div className="sl-card-icon">🖼</div>
                  <span className="sl-card-title">Car Photos</span>
                </div>

                <label
                  className={`sl-upload ${dragOver ? 'drag' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files); }}
                >
                  <input type="file" accept="image/*" multiple onChange={handleFileInput} style={{ display: 'none' }} />
                  <span className="sl-upload-icon">📸</span>
                  <div className="sl-upload-text"><strong>Click to upload</strong> or drag & drop</div>
                  <div className="sl-upload-hint">JPEG · PNG · WEBP — Max 6 images · AI car verification</div>
                </label>

                {/* Pips */}
                <div className="sl-pips">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`sl-pip ${i < images.length ? 'filled' : ''}`}></div>
                  ))}
                </div>
                <div className="sl-pips-label">{images.length}/6 IMAGES</div>

                {imagePreviews.length > 0 && (
                  <div className="sl-previews">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="sl-preview">
                        <img src={src} alt={`preview ${i}`} />
                        <button type="button" className="sl-preview-rm" onClick={() => removeImage(i)}>✕</button>
                        <span className="sl-preview-num">0{i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="sl-card" style={{ flex: 1 }}>
                <div className="sl-card-head">
                  <div className="sl-card-icon">📝</div>
                  <span className="sl-card-title">Additional Notes</span>
                </div>
                <div className="sl-field">
                  <textarea
                    className="sl-textarea"
                    name="description"
                    placeholder="Describe the vehicle's condition, service history, modifications, accident history, reason for selling..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="sl-char-count">{formData.description.length} chars</div>
              </div>

              {/* Privacy note */}
              <div className="sl-privacy">
                <span className="sl-privacy-icon">🔒</span>
                <span>Your information is confidential and only used to process your vehicle listing.</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sl-footer">
            <div className="sl-footer-note">
              {images.length > 0
                ? `${images.length} verified image${images.length > 1 ? 's' : ''} · ready to submit`
                : 'Upload at least 1 car photo to submit'}
            </div>
            <button
              type="submit"
              className="sl-submit"
              disabled={loading || checkingImages || images.length === 0}
            >
              {loading && <span className="sl-spinner"></span>}
              {loading ? 'SUBMITTING...' : 'SUBMIT LISTING →'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sl-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0a;
    min-height: 100vh;
    color: #e8e8e8;
  }

  /* ── Hero ── */
  .sl-hero {
    position: relative;
    height: 52vh;
    min-height: 320px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }
  .sl-hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80');
    background-size: cover;
    background-position: center 55%;
    filter: brightness(0.2) saturate(0.5);
  }
  .sl-hero-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  .sl-hero-line {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c8a04a44, transparent);
  }
  .sl-hero-content {
    position: relative; z-index: 2;
    padding: 0 3rem 3rem;
    max-width: 1300px; width: 100%; margin: 0 auto;
  }
  .sl-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.3em;
    color: #c8a04a; text-transform: uppercase; margin-bottom: 0.6rem;
  }
  .sl-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 5.5rem);
    letter-spacing: 0.05em; color: #fff; line-height: 0.95; margin-bottom: 1rem;
  }
  .sl-hero-title span { color: #c8a04a; }
  .sl-hero-sub { font-size: 0.9rem; color: #444; font-weight: 300; font-style: italic; }

  /* ── Steps ── */
  .sl-steps {
    display: flex; align-items: center;
    max-width: 1300px; margin: 0 auto;
    padding: 1.5rem 3rem;
    border-bottom: 1px solid #141414;
    gap: 0;
  }
  .sl-step {
    display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0;
  }
  .sl-step-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; color: #c8a04a; letter-spacing: 0.05em; line-height: 1;
  }
  .sl-step-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.1em;
    color: #2e2e2e; text-transform: uppercase; white-space: nowrap;
  }
  .sl-step-line {
    flex: 1; min-width: 2rem;
    height: 1px; background: #1a1a1a; margin: 0 1rem;
  }

  /* ── Alerts ── */
  .sl-alerts-wrap { max-width: 1300px; margin: 0 auto; padding: 1.5rem 2rem 0; }
  .sl-alert {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.85rem 1.25rem; font-size: 0.85rem; font-weight: 500;
    margin-bottom: 0.5rem;
    animation: sl-down 0.3s ease;
  }
  @keyframes sl-down { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .sl-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .sl-alert.error { background:#1a0808; border:1px solid #8b0000; color:#ff6b6b; }
  .sl-alert.error .sl-dot { background:#ff4444; }
  .sl-alert.success { background:#081a0e; border:1px solid #1a6b3a; color:#4caf7d; }
  .sl-alert.success .sl-dot { background:#4caf50; box-shadow:0 0 8px #4caf5088; }
  .sl-alert.checking { background:#0d0f1a; border:1px solid #2a3580; color:#7b9cff; }
  .sl-alert.checking .sl-dot { background:#5b7fff; animation:sl-pulse 1s infinite; }
  @keyframes sl-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── Form layout ── */
  .sl-form { max-width: 1300px; margin: 0 auto; padding: 2.5rem 2rem; }
  .sl-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;
  }
  @media(max-width:900px) { .sl-grid{grid-template-columns:1fr} }
  .sl-col { display: flex; flex-direction: column; gap: 1.25rem; }

  /* ── Card ── */
  .sl-card {
    background: #0d0d0d; border: 1px solid #1a1a1a;
    padding: 1.5rem; position: relative; overflow: hidden;
    transition: border-color 0.3s;
  }
  .sl-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, #c8a04a, transparent);
    opacity:0; transition: opacity 0.3s;
  }
  .sl-card:focus-within::before { opacity: 1; }
  .sl-card:focus-within { border-color: #222; }

  .sl-card-head {
    display: flex; align-items: center; gap: 0.65rem;
    margin-bottom: 1.25rem; padding-bottom: 0.85rem;
    border-bottom: 1px solid #141414;
  }
  .sl-card-icon {
    width: 28px; height: 28px;
    background: #c8a04a12; border: 1px solid #c8a04a25;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; flex-shrink: 0;
  }
  .sl-card-title {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em;
    color: #c8a04a; text-transform: uppercase;
  }

  /* ── Fields ── */
  .sl-field { margin-bottom: 0.9rem; }
  .sl-field:last-child { margin-bottom: 0; }
  .sl-label {
    display: block; font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em;
    color: #333; text-transform: uppercase; margin-bottom: 0.35rem;
  }
  .sl-input, .sl-textarea {
    width: 100%; background: #080808; border: 1px solid #1e1e1e;
    color: #e8e8e8; padding: 0.75rem 0.9rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    outline: none; transition: border-color 0.2s; border-radius: 0;
  }
  .sl-input::placeholder { color: #252525; }
  .sl-input:focus, .sl-textarea:focus { border-color: #c8a04a55; background: #0d0d0d; }
  .sl-textarea { resize: vertical; min-height: 150px; line-height: 1.6; }
  .sl-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  /* ── Pills ── */
  .sl-pills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; }
  .sl-pill {
    padding: 0.55rem 0.3rem; border: 1px solid #1a1a1a; background: #080808;
    color: #333; font-family: 'Space Mono', monospace;
    font-size: 0.48rem; letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; text-align: center; transition: all 0.15s;
  }
  .sl-pill:hover { border-color: #2a2a2a; color: #555; }
  .sl-pill.on { border-color: #c8a04a44; background: #c8a04a12; color: #c8a04a; }

  /* ── Upload ── */
  .sl-upload {
    display: block; border: 1px dashed #222; padding: 2rem;
    text-align: center; cursor: pointer;
    transition: all 0.3s;
  }
  .sl-upload.drag { border-color: #c8a04a55; background: #c8a04a08; }
  .sl-upload:hover { border-color: #2a2a2a; }
  .sl-upload-icon { font-size: 1.8rem; opacity: 0.5; display: block; margin-bottom: 0.6rem; }
  .sl-upload-text { font-size: 0.85rem; color: #444; margin-bottom: 0.25rem; }
  .sl-upload-text strong { color: #666; }
  .sl-upload-hint {
    font-family: 'Space Mono', monospace; font-size: 0.55rem;
    color: #222; letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* Pips */
  .sl-pips { display: flex; gap: 4px; margin-top: 0.85rem; }
  .sl-pip { height: 3px; flex: 1; background: #1a1a1a; transition: background 0.3s; }
  .sl-pip.filled { background: #c8a04a; }
  .sl-pips-label {
    font-family: 'Space Mono', monospace; font-size: 0.5rem;
    color: #222; letter-spacing: 0.12em; margin-top: 0.35rem;
  }

  /* Previews */
  .sl-previews {
    display: grid; grid-template-columns: repeat(6, 1fr);
    gap: 0.4rem; margin-top: 0.85rem;
  }
  .sl-preview { position: relative; aspect-ratio: 1; overflow: hidden; border: 1px solid #1a1a1a; }
  .sl-preview img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.3s; }
  .sl-preview:hover img { transform: scale(1.05); }
  .sl-preview-rm {
    position: absolute; top: 3px; right: 3px;
    width: 18px; height: 18px; background: rgba(0,0,0,0.9);
    border: 1px solid #333; color: #ff6b6b; font-size: 9px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s;
  }
  .sl-preview:hover .sl-preview-rm { opacity: 1; }
  .sl-preview-num {
    position: absolute; bottom: 2px; left: 3px;
    font-family: 'Space Mono', monospace; font-size: 0.45rem;
    color: rgba(255,255,255,0.5); background: rgba(0,0,0,0.7); padding: 1px 3px;
  }

  /* Char count */
  .sl-char-count {
    font-family: 'Space Mono', monospace; font-size: 0.5rem;
    color: #222; letter-spacing: 0.1em; text-align: right; margin-top: 0.4rem;
  }

  /* Privacy */
  .sl-privacy {
    display: flex; align-items: flex-start; gap: 0.6rem;
    padding: 0.85rem 1rem;
    border: 1px solid #141414; background: #0d0d0d;
    font-size: 0.75rem; color: #2e2e2e; line-height: 1.5;
  }
  .sl-privacy-icon { flex-shrink: 0; opacity: 0.4; }

  /* ── Footer ── */
  .sl-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 0 0; border-top: 1px solid #141414;
  }
  .sl-footer-note {
    font-family: 'Space Mono', monospace; font-size: 0.55rem;
    color: #2a2a2a; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .sl-submit {
    padding: 0.85rem 2.75rem;
    background: #c8a04a; border: none; color: #0a0a0a;
    font-family: 'Space Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700;
    cursor: pointer; transition: background 0.2s; position: relative; overflow: hidden;
  }
  .sl-submit:hover { background: #e8b84a; }
  .sl-submit:disabled { background: #1e1a12; color: #3a3020; cursor: not-allowed; }
  .sl-spinner {
    display: inline-block; width: 10px; height: 10px;
    border: 1.5px solid #3a301055; border-top-color: #c8a04a;
    border-radius: 50%; animation: sl-spin 0.7s linear infinite;
    margin-right: 0.5rem; vertical-align: middle;
  }
  @keyframes sl-spin { to{transform:rotate(360deg)} }

  /* ── Success ── */
  .sl-success {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 100vh;
    padding: 3rem; text-align: center; gap: 1.25rem;
  }
  .sl-success-icon {
    width: 64px; height: 64px; border: 1px solid #c8a04a44;
    background: #c8a04a12; display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; color: #c8a04a;
    animation: sl-down 0.4s ease;
  }
  .sl-success-eyebrow {
    font-family: 'Space Mono', monospace; font-size: 0.6rem;
    letter-spacing: 0.3em; color: #c8a04a; text-transform: uppercase;
  }
  .sl-success-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    letter-spacing: 0.05em; color: #fff; line-height: 1;
  }
  .sl-success-title span { color: #c8a04a; }
  .sl-success-sub { font-size: 0.9rem; color: #444; max-width: 380px; line-height: 1.7; font-weight: 300; }
  .sl-success-back {
    margin-top: 1rem; padding: 0.75rem 2rem;
    background: transparent; border: 1px solid #1e1e1e;
    color: #333; font-family: 'Space Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
  }
  .sl-success-back:hover { border-color: #c8a04a44; color: #c8a04a; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #1e1e1e; }
`;

export default Sale;