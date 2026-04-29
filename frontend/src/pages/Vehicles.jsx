// frontend/src/pages/Vehicles.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Vehicles = () => {
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [priceRange, setPriceRange] = useState(200000);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => { fetchCars(); }, []);
  useEffect(() => { filterCars(); }, [searchTerm, selectedBrand, selectedYear, selectedFuel, priceRange, allCars]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/public-cars');
      const data = await response.json();
      if (data.success) {
        setAllCars(data.cars || []);
        setFilteredCars(data.cars || []);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = [...allCars];
    if (searchTerm) filtered = filtered.filter(car =>
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedBrand) filtered = filtered.filter(car => car.brand === selectedBrand);
    if (selectedYear) filtered = filtered.filter(car => car.year === parseInt(selectedYear));
    if (selectedFuel) filtered = filtered.filter(car => car.fuel_type === selectedFuel);
    filtered = filtered.filter(car => (car.discount_price || car.price) <= priceRange);
    setFilteredCars(filtered);
  };

  const resetFilters = () => {
    setSearchTerm(''); setSelectedBrand(''); setSelectedYear('');
    setSelectedFuel(''); setPriceRange(200000);
  };

  const brands = [...new Set(allCars.map(car => car.brand).filter(Boolean))];
  const years = [...new Set(allCars.map(car => car.year).filter(Boolean))].sort((a, b) => b - a);
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const activeFiltersCount = [searchTerm, selectedBrand, selectedYear, selectedFuel, priceRange < 200000].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .veh-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          color: #e8e8e8;
        }

        /* ─── Hero ─── */
        .veh-hero {
          position: relative;
          height: 52vh;
          min-height: 340px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .veh-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600&q=80');
          background-size: cover;
          background-position: center 40%;
          filter: brightness(0.25) saturate(0.6);
          transform: scale(1.02);
        }
        .veh-hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .veh-hero-line {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c8a04a44, transparent);
        }
        .veh-hero-content {
          position: relative;
          z-index: 2;
          padding: 0 3rem 3rem;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
        .veh-hero-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: #c8a04a;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }
        .veh-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 8vw, 6rem);
          letter-spacing: 0.05em;
          color: #fff;
          line-height: 0.95;
          margin-bottom: 1rem;
        }
        .veh-hero-title span { color: #c8a04a; }
        .veh-hero-sub {
          font-size: 0.9rem;
          color: #444;
          font-weight: 300;
          font-style: italic;
        }

        /* ─── Layout ─── */
        .veh-layout {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .veh-layout { grid-template-columns: 1fr; }
        }

        /* ─── Sidebar ─── */
        .veh-sidebar {
          position: sticky;
          top: 2rem;
        }
        .veh-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .veh-sidebar-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: #c8a04a;
          text-transform: uppercase;
        }
        .veh-filter-badge {
          background: #c8a04a;
          color: #0a0a0a;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          font-weight: 700;
          padding: 2px 6px;
          letter-spacing: 0.05em;
        }

        .veh-filter-block {
          border: 1px solid #141414;
          padding: 1.1rem;
          margin-bottom: 0.75rem;
          background: #0d0d0d;
          position: relative;
        }
        .veh-filter-block::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 2px;
          background: #1a1a1a;
          transition: background 0.2s;
        }
        .veh-filter-block:focus-within::before { background: #c8a04a; }
        .veh-filter-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          color: #333;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
          display: block;
        }
        .veh-input, .veh-select {
          width: 100%;
          background: #080808;
          border: 1px solid #1e1e1e;
          color: #e8e8e8;
          padding: 0.65rem 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 0;
          -webkit-appearance: none;
        }
        .veh-input::placeholder { color: #2a2a2a; }
        .veh-input:focus, .veh-select:focus { border-color: #c8a04a55; }
        .veh-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23c8a04a' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.8rem center;
          padding-right: 2rem;
        }
        .veh-select option { background: #111; }

        /* Range slider */
        .veh-range-val {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.6rem;
        }
        .veh-range-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          color: #c8a04a;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .veh-range-max {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          color: #2a2a2a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .veh-range {
          width: 100%;
          -webkit-appearance: none;
          height: 2px;
          background: linear-gradient(to right, #c8a04a calc(var(--pct) * 1%), #1e1e1e calc(var(--pct) * 1%));
          outline: none;
          cursor: pointer;
        }
        .veh-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: #c8a04a;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #0a0a0a;
          box-shadow: 0 0 8px #c8a04a66;
        }

        /* Fuel pills */
        .veh-fuel-pills {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.35rem;
        }
        .veh-pill {
          padding: 0.5rem;
          border: 1px solid #1a1a1a;
          background: #080808;
          color: #333;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          text-align: center;
          transition: all 0.15s;
        }
        .veh-pill:hover { border-color: #2a2a2a; color: #555; }
        .veh-pill.on { border-color: #c8a04a44; background: #c8a04a12; color: #c8a04a; }

        .veh-reset {
          width: 100%;
          padding: 0.7rem;
          background: transparent;
          border: 1px solid #1a1a1a;
          color: #333;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.25rem;
        }
        .veh-reset:hover { border-color: #c8a04a44; color: #c8a04a; }

        /* ─── Main ─── */
        .veh-main {}
        .veh-results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #141414;
        }
        .veh-results-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #333;
          text-transform: uppercase;
        }
        .veh-results-count span {
          font-size: 1.2rem;
          color: #c8a04a;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
          vertical-align: middle;
          margin-right: 0.2rem;
        }

        /* ─── Grid ─── */
        .veh-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1px;
          background: #141414;
          border: 1px solid #141414;
        }

        /* ─── Card ─── */
        .veh-card {
          background: #0d0d0d;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: background 0.2s;
        }
        .veh-card:hover { background: #111; }
        .veh-card-topline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c8a04a, transparent);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 3;
        }
        .veh-card:hover .veh-card-topline { opacity: 1; }

        /* Image */
        .veh-card-img-wrap {
          height: 195px;
          overflow: hidden;
          background: #080808;
          position: relative;
          flex-shrink: 0;
        }
        .veh-card-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s ease;
        }
        .veh-card:hover .veh-card-img-wrap img { transform: scale(1.05); }
        .veh-card-no-img {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.4rem;
        }
        .veh-card-no-img-icon { font-size: 2.5rem; opacity: 0.1; }
        .veh-card-no-img-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #1e1e1e;
          text-transform: uppercase;
        }

        /* Discount badge */
        .veh-discount-badge {
          position: absolute;
          top: 12px; left: 0;
          background: #c8a04a;
          color: #0a0a0a;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 4px 10px 4px 8px;
          clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
          z-index: 2;
        }

        /* Body */
        .veh-card-body {
          padding: 1.2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          border-top: 1px solid #141414;
        }
        .veh-card-brand {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          color: #c8a04a;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .veh-card-name {
          font-size: 0.95rem;
          font-weight: 500;
          color: #e8e8e8;
          margin-bottom: 0.85rem;
          line-height: 1.3;
        }

        /* Specs */
        .veh-card-specs {
          display: flex;
          gap: 0;
          margin-bottom: 0.9rem;
          border: 1px solid #141414;
        }
        .veh-card-spec {
          flex: 1;
          padding: 0.45rem 0.5rem;
          border-right: 1px solid #141414;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          align-items: center;
        }
        .veh-card-spec:last-child { border-right: none; }
        .veh-spec-k {
          font-family: 'Space Mono', monospace;
          font-size: 0.42rem;
          letter-spacing: 0.1em;
          color: #252525;
          text-transform: uppercase;
        }
        .veh-spec-v {
          font-size: 0.72rem;
          color: #555;
          font-weight: 400;
          text-align: center;
        }

        /* Price */
        .veh-card-price {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1rem;
          margin-top: auto;
        }
        .veh-price-main {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.7rem;
          color: #e8e8e8;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .veh-price-main.disc { color: #c8a04a; }
        .veh-price-old {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: #2a2a2a;
          text-decoration: line-through;
        }

        /* CTA */
        .veh-card-cta {
          display: block;
          padding: 0.7rem;
          text-align: center;
          text-decoration: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: 1px solid #1e1e1e;
          color: #444;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .veh-card-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #c8a04a;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 0;
        }
        .veh-card-cta:hover { color: #0a0a0a; border-color: #c8a04a; }
        .veh-card-cta:hover::after { transform: translateX(0); }
        .veh-card-cta span { position: relative; z-index: 1; }

        /* ─── Empty ─── */
        .veh-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 5rem 2rem;
          text-align: center;
          background: #0d0d0d;
          border: 1px solid #141414;
        }
        .veh-empty-icon { font-size: 2.5rem; opacity: 0.1; }
        .veh-empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #1e1e1e;
          letter-spacing: 0.1em;
        }
        .veh-empty-sub { font-size: 0.8rem; color: #2a2a2a; }
        .veh-empty-reset {
          padding: 0.65rem 1.5rem;
          background: transparent;
          border: 1px solid #c8a04a44;
          color: #c8a04a;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 0.5rem;
        }
        .veh-empty-reset:hover { background: #c8a04a15; }

        /* ─── Loading ─── */
        .veh-loading {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: #0a0a0a;
        }
        .veh-loading-spinner {
          width: 48px; height: 48px;
          border: 1px solid #1e1e1e;
          border-top-color: #c8a04a;
          border-radius: 50%;
          animation: vspin 0.9s linear infinite;
        }
        @keyframes vspin { to { transform: rotate(360deg); } }
        .veh-loading-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: #2a2a2a;
          text-transform: uppercase;
        }
      `}</style>

      {loading ? (
        <div className="veh-loading">
          <div className="veh-loading-spinner"></div>
          <div className="veh-loading-text">Loading inventory...</div>
        </div>
      ) : (
        <div className="veh-root">

          {/* Hero */}
          <div className="veh-hero">
            <div className="veh-hero-bg"></div>
            <div className="veh-hero-grain"></div>
            <div className="veh-hero-line"></div>
            <div className="veh-hero-content">
              <div className="veh-hero-eyebrow">Premium Dealership</div>
              <h1 className="veh-hero-title">OUR <span>VEHICLES</span></h1>
              <p className="veh-hero-sub">Curated selection of exceptional automobiles</p>
            </div>
          </div>

          {/* Layout */}
          <div className="veh-layout">

            {/* Sidebar */}
            <aside className="veh-sidebar">
              <div className="veh-sidebar-header">
                <span className="veh-sidebar-title">Refine</span>
                {activeFiltersCount > 0 && (
                  <span className="veh-filter-badge">{activeFiltersCount} active</span>
                )}
              </div>

              {/* Search */}
              <div className="veh-filter-block">
                <label className="veh-filter-label">Search</label>
                <input
                  className="veh-input"
                  type="text"
                  placeholder="Name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Brand */}
              <div className="veh-filter-block">
                <label className="veh-filter-label">Brand</label>
                <select className="veh-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Year */}
              <div className="veh-filter-block">
                <label className="veh-filter-label">Year</label>
                <select className="veh-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value="">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Fuel */}
              <div className="veh-filter-block">
                <label className="veh-filter-label">Fuel Type</label>
                <div className="veh-fuel-pills">
                  {fuelTypes.map(f => (
                    <button
                      key={f}
                      className={`veh-pill ${selectedFuel === f ? 'on' : ''}`}
                      onClick={() => setSelectedFuel(selectedFuel === f ? '' : f)}
                    >{f}</button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="veh-filter-block">
                <label className="veh-filter-label">Max Price</label>
                <div className="veh-range-val">
                  <span className="veh-range-num">${priceRange.toLocaleString()}</span>
                  <span className="veh-range-max">of $200k</span>
                </div>
                <input
                  className="veh-range"
                  type="range" min="0" max="200000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  style={{ '--pct': (priceRange / 200000) * 100 }}
                />
              </div>

              <button className="veh-reset" onClick={resetFilters}>↺ Reset All Filters</button>
            </aside>

            {/* Main */}
            <main className="veh-main">
              <div className="veh-results-bar">
                <div className="veh-results-count">
                  <span>{filteredCars.length}</span> vehicles found
                </div>
              </div>

              {filteredCars.length === 0 ? (
                <div className="veh-grid">
                  <div className="veh-empty">
                    <div className="veh-empty-icon">🔍</div>
                    <div className="veh-empty-title">No Results</div>
                    <div className="veh-empty-sub">No vehicles match your current filters</div>
                    <button className="veh-empty-reset" onClick={resetFilters}>Clear All Filters</button>
                  </div>
                </div>
              ) : (
                <div className="veh-grid">
                  {filteredCars.map((car) => {
                    const hasDiscount = car.discount_price && parseInt(car.discount_price) < parseInt(car.price);
                    const discPct = hasDiscount
                      ? Math.round(((car.price - car.discount_price) / car.price) * 100) : 0;

                    return (
                      <div
                        key={car.id}
                        className="veh-card"
                        onMouseEnter={() => setHoveredCard(car.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="veh-card-topline"></div>

                        {/* Image */}
                        <div className="veh-card-img-wrap">
                          {car.images && car.images.length > 0 ? (
                            <img
                              src={`http://localhost:5000${car.images[0]}`}
                              alt={car.name}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=60'; }}
                            />
                          ) : (
                            <div className="veh-card-no-img">
                              <div className="veh-card-no-img-icon">🚗</div>
                              <div className="veh-card-no-img-text">No Photo</div>
                            </div>
                          )}
                          {hasDiscount && (
                            <div className="veh-discount-badge">−{discPct}%</div>
                          )}
                        </div>

                        {/* Body */}
                        <div className="veh-card-body">
                          <div className="veh-card-brand">
                            {car.brand}{car.model ? ` · ${car.model}` : ''}
                          </div>
                          <div className="veh-card-name">{car.name}</div>

                          <div className="veh-card-specs">
                            <div className="veh-card-spec">
                              <span className="veh-spec-k">Year</span>
                              <span className="veh-spec-v">{car.year || '—'}</span>
                            </div>
                            <div className="veh-card-spec">
                              <span className="veh-spec-k">Trans.</span>
                              <span className="veh-spec-v">{car.transmission || '—'}</span>
                            </div>
                            <div className="veh-card-spec">
                              <span className="veh-spec-k">Fuel</span>
                              <span className="veh-spec-v">{car.fuel_type || '—'}</span>
                            </div>
                          </div>

                          <div className="veh-card-price">
                            <div className={`veh-price-main ${hasDiscount ? 'disc' : ''}`}>
                              ${parseInt(hasDiscount ? car.discount_price : car.price).toLocaleString()}
                            </div>
                            {hasDiscount && (
                              <div className="veh-price-old">
                                ${parseInt(car.price).toLocaleString()}
                              </div>
                            )}
                          </div>

                          <Link to={`/vehicles/${car.id}`} className="veh-card-cta">
                            <span>View Details →</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Vehicles;