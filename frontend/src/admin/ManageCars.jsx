// frontend/src/admin/ManageCars.jsx
import React, { useState, useEffect } from 'react';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found. Please login again.');
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:5000/api/admin/cars', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setCars(data.cars || []);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch cars');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

        .mc-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          color: #e8e8e8;
          padding: 3rem 2rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ─── Header ─── */
        .mc-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #1a1a1a;
        }
        .mc-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: #c8a04a;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .mc-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4rem;
          letter-spacing: 0.05em;
          color: #fff;
          line-height: 1;
          margin: 0;
        }
        .mc-title span { color: #c8a04a; }
        .mc-subtitle {
          margin-top: 0.75rem;
          color: #555;
          font-size: 0.9rem;
          font-weight: 300;
        }
        .mc-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mc-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #333;
          text-transform: uppercase;
          border: 1px solid #1e1e1e;
          padding: 0.5rem 1rem;
        }
        .mc-count span {
          color: #c8a04a;
          font-size: 1rem;
          display: block;
          margin-bottom: 0.1rem;
        }
        .mc-refresh {
          padding: 0.5rem 1.25rem;
          background: transparent;
          border: 1px solid #222;
          color: #444;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mc-refresh:hover { border-color: #c8a04a55; color: #c8a04a; }

        /* ─── States ─── */
        .mc-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1.5rem;
          text-align: center;
        }
        .mc-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .mc-spinner {
          width: 40px; height: 40px;
          border: 1px solid #1e1e1e;
          border-top-color: #c8a04a;
          border-radius: 50%;
          animation: mc-spin 0.9s linear infinite;
        }
        @keyframes mc-spin { to { transform: rotate(360deg); } }
        .mc-spinner-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: #333;
          text-transform: uppercase;
        }

        .mc-error-box {
          border: 1px solid #8b000044;
          background: #1a080812;
          padding: 2rem 3rem;
          max-width: 480px;
        }
        .mc-error-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: #8b0000;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .mc-error-msg { color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6; }
        .mc-btn-retry {
          padding: 0.65rem 1.5rem;
          background: transparent;
          border: 1px solid #8b000055;
          color: #ff6b6b;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mc-btn-retry:hover { background: #8b000022; }

        .mc-empty-icon {
          font-size: 3rem;
          opacity: 0.15;
          line-height: 1;
        }
        .mc-empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.1em;
          color: #222;
        }
        .mc-empty-sub { font-size: 0.85rem; color: #333; }
        .mc-btn-add {
          padding: 0.75rem 2rem;
          background: #c8a04a;
          border: none;
          color: #0a0a0a;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
        }
        .mc-btn-add:hover { background: #e8b84a; }

        /* ─── Grid ─── */
        .mc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1px;
          background: #141414;
          border: 1px solid #141414;
        }

        /* ─── Card ─── */
        .mc-card {
          background: #0d0d0d;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .mc-card:hover { background: #111; }
        .mc-card.hovered .mc-card-gold-line { opacity: 1; }
        .mc-card-gold-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c8a04a, transparent);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 2;
        }

        /* Image */
        .mc-card-img {
          height: 190px;
          overflow: hidden;
          background: #080808;
          position: relative;
          flex-shrink: 0;
        }
        .mc-card-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .mc-card:hover .mc-card-img img { transform: scale(1.04); }
        .mc-card-no-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mc-card-no-img-icon { font-size: 2rem; opacity: 0.15; }
        .mc-card-no-img-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #222;
          text-transform: uppercase;
        }

        /* Image count badge */
        .mc-img-badge {
          position: absolute;
          bottom: 8px; right: 8px;
          background: rgba(0,0,0,0.85);
          border: 1px solid #222;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          color: #555;
          padding: 2px 6px;
          text-transform: uppercase;
        }

        /* Body */
        .mc-card-body {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid #141414;
        }
        .mc-card-brand {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: #c8a04a;
          text-transform: uppercase;
          margin-bottom: 0.3rem;
        }
        .mc-card-name {
          font-size: 1rem;
          font-weight: 500;
          color: #e8e8e8;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        /* Price */
        .mc-card-price {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .mc-price-main {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 0.05em;
          color: #e8e8e8;
          line-height: 1;
        }
        .mc-price-main.discounted { color: #c8a04a; }
        .mc-price-old {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #333;
          text-decoration: line-through;
        }
        .mc-price-save {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          color: #4caf7d;
          text-transform: uppercase;
          border: 1px solid #4caf7d33;
          padding: 1px 5px;
          background: #4caf7d0d;
        }

        /* Specs row */
        .mc-card-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;
          padding-top: 0.85rem;
          border-top: 1px solid #141414;
          margin-top: auto;
        }
        .mc-spec {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .mc-spec-key {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #2e2e2e;
          text-transform: uppercase;
        }
        .mc-spec-val {
          font-size: 0.78rem;
          color: #666;
          font-weight: 400;
        }
      `}</style>

      <div className="mc-root">

        {/* Header */}
        <div className="mc-header">
          <div>
            <div className="mc-eyebrow">Inventory Management</div>
            <h1 className="mc-title">ALL <span>VEHICLES</span></h1>
            <p className="mc-subtitle">Browse and manage your dealership inventory</p>
          </div>
          <div className="mc-header-right">
            {!loading && !error && cars.length > 0 && (
              <div className="mc-count">
                <span>{cars.length}</span>
                Units Listed
              </div>
            )}
            <button className="mc-refresh" onClick={fetchCars}>↻ Refresh</button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mc-state">
            <div className="mc-spinner-wrap">
              <div className="mc-spinner"></div>
              <div className="mc-spinner-text">Loading inventory...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mc-state">
            <div className="mc-error-box">
              <div className="mc-error-label">⚠ System Error</div>
              <div className="mc-error-msg">{error}</div>
              <button className="mc-btn-retry" onClick={fetchCars}>Retry Connection</button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && cars.length === 0 && (
          <div className="mc-state">
            <div className="mc-empty-icon">🚗</div>
            <div className="mc-empty-title">No Vehicles Found</div>
            <div className="mc-empty-sub">Your inventory is empty. Add your first vehicle to get started.</div>
            <a href="/admin/add-car" className="mc-btn-add">+ Add First Vehicle</a>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && cars.length > 0 && (
          <div className="mc-grid">
            {cars.map((car) => {
              const hasDiscount = car.discount_price && parseInt(car.discount_price) < parseInt(car.price);
              const saveAmount = hasDiscount ? parseInt(car.price) - parseInt(car.discount_price) : 0;

              return (
                <div
                  key={car.id}
                  className={`mc-card ${hoveredCard === car.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredCard(car.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="mc-card-gold-line"></div>

                  {/* Image */}
                  <div className="mc-card-img">
                    {car.images && car.images.length > 0 ? (
                      <>
                        <img
                          src={`http://localhost:5000${car.images[0]}`}
                          alt={car.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/320x190/0d0d0d/222?text=NO+IMAGE'; }}
                        />
                        {car.images.length > 1 && (
                          <div className="mc-img-badge">{car.images.length} photos</div>
                        )}
                      </>
                    ) : (
                      <div className="mc-card-no-img">
                        <div className="mc-card-no-img-icon">🚗</div>
                        <div className="mc-card-no-img-text">No Photo</div>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="mc-card-body">
                    <div className="mc-card-brand">{car.brand}{car.model ? ` · ${car.model}` : ''}</div>
                    <div className="mc-card-name">{car.name}</div>

                    <div className="mc-card-price">
                      <div className={`mc-price-main ${hasDiscount ? 'discounted' : ''}`}>
                        ${parseInt(hasDiscount ? car.discount_price : car.price).toLocaleString()}
                      </div>
                      {hasDiscount && (
                        <>
                          <div className="mc-price-old">${parseInt(car.price).toLocaleString()}</div>
                          <div className="mc-price-save">−${saveAmount.toLocaleString()}</div>
                        </>
                      )}
                    </div>

                    <div className="mc-card-specs">
                      <div className="mc-spec">
                        <div className="mc-spec-key">Year</div>
                        <div className="mc-spec-val">{car.year || '—'}</div>
                      </div>
                      <div className="mc-spec">
                        <div className="mc-spec-key">Color</div>
                        <div className="mc-spec-val">{car.color || '—'}</div>
                      </div>
                      <div className="mc-spec">
                        <div className="mc-spec-key">Transmission</div>
                        <div className="mc-spec-val">{car.transmission || '—'}</div>
                      </div>
                      <div className="mc-spec">
                        <div className="mc-spec-key">Fuel</div>
                        <div className="mc-spec-val">{car.fuel_type || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
};

export default ManageCars;