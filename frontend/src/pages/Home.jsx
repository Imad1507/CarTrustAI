// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/cars');
      const data = await response.json();
      if (data.success) {
        setCars(data.cars.slice(0, 6)); // عرض أول 6 سيارات فقط
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Drive Your <span style={styles.goldText}>Dream</span> Car Today
            </h1>
            <p style={styles.heroSubtitle}>
              Experience luxury, performance, and style with our premium collection of vehicles
            </p>
            <div style={styles.heroButtons}>
              <Link to="/vehicles" style={styles.btnPrimary}>Browse Cars 🚗</Link>
              <Link to="/sale" style={styles.btnSecondary}>View Offers 🔥</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.containerInner}>
          <h2 style={styles.sectionTitle}>Why <span style={styles.goldText}>Choose Us</span></h2>
          <p style={styles.sectionSubtitle}>We provide the best car buying experience</p>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏆</div>
              <h3 style={styles.featureTitle}>Quality Cars</h3>
              <p style={styles.featureDesc}>All vehicles are thoroughly inspected and certified</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💰</div>
              <h3 style={styles.featureTitle}>Best Prices</h3>
              <p style={styles.featureDesc}>Competitive prices with flexible financing options</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔧</div>
              <h3 style={styles.featureTitle}>24/7 Support</h3>
              <p style={styles.featureDesc}>Dedicated customer service and maintenance support</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📋</div>
              <h3 style={styles.featureTitle}>Easy Process</h3>
              <p style={styles.featureDesc}>Simple and transparent buying process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section style={styles.featuredCars}>
        <div style={styles.containerInner}>
          <h2 style={styles.sectionTitle}>Featured <span style={styles.goldText}>Vehicles</span></h2>
          <p style={styles.sectionSubtitle}>Check out our most popular cars</p>
          
          {loading ? (
            <div style={styles.loading}>Loading amazing cars...</div>
          ) : (
            <div style={styles.carsGrid}>
              {cars.map((car) => (
                <div key={car.id} style={styles.carCard}>
                  <div style={styles.carImageContainer}>
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={`http://localhost:5000${car.images[0]}`} 
                        alt={car.name}
                        style={styles.carImage}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400';
                        }}
                      />
                    ) : (
                      <div style={styles.carImagePlaceholder}>🚗</div>
                    )}
                    {car.discount_price && car.discount_price < car.price && (
                      <div style={styles.discountBadge}>
                        -{Math.round(((car.price - car.discount_price) / car.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div style={styles.carInfo}>
                    <h3 style={styles.carName}>{car.name}</h3>
                    <p style={styles.carBrand}>{car.brand} {car.model}</p>
                    <div style={styles.carSpecs}>
                      <span>📅 {car.year}</span>
                      <span>⚙️ {car.transmission}</span>
                      <span>⛽ {car.fuel_type}</span>
                    </div>
                    <div style={styles.carPrice}>
                      {car.discount_price && car.discount_price < car.price ? (
                        <>
                          <span style={styles.oldPrice}>${parseInt(car.price).toLocaleString()}</span>
                          <span style={styles.newPrice}>${parseInt(car.discount_price).toLocaleString()}</span>
                        </>
                      ) : (
                        <span style={styles.price}>${parseInt(car.price).toLocaleString()}</span>
                      )}
                    </div>
                    <Link to={`/vehicles/${car.id}`} style={styles.viewBtn}>
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={styles.viewAllContainer}>
            <Link to="/vehicles" style={styles.viewAllBtn}>View All Vehicles →</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.containerInner}>
          <h2 style={styles.ctaTitle}>Ready to <span style={styles.goldText}>Drive Home</span> Your Dream Car?</h2>
          <p style={styles.ctaSubtitle}>Visit us today for a test drive or contact us for more information</p>
          <div style={styles.ctaButtons}>
            <Link to="/contact" style={styles.ctaBtnPrimary}>Schedule Test Drive 📅</Link>
            <Link to="/vehicles" style={styles.ctaBtnSecondary}>Explore All Cars 🔍</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    overflowX: 'hidden'
  },
  // Hero Section
  hero: {
    height: '100vh',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%), url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroContent: {
    textAlign: 'center',
    color: '#fff',
    padding: '0 2rem',
    maxWidth: '800px'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    animation: 'fadeInUp 1s ease'
  },
  goldText: {
    color: '#FFD700',
    position: 'relative'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  btnPrimary: {
    background: '#FFD700',
    color: '#000',
    padding: '12px 32px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'inline-block'
  },
  btnSecondary: {
    background: 'transparent',
    color: '#FFD700',
    padding: '12px 32px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: '2px solid #FFD700',
    transition: 'all 0.3s',
    display: 'inline-block'
  },
  // Features Section
  features: {
    padding: '5rem 0',
    background: '#fff'
  },
  containerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#1a1a1a'
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '3rem',
    fontSize: '1.1rem'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    transition: 'transform 0.3s',
    borderRadius: '12px',
    background: '#fafafa'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#1a1a1a'
  },
  featureDesc: {
    color: '#666',
    lineHeight: '1.6'
  },
  // Featured Cars Section
  featuredCars: {
    padding: '5rem 0',
    background: '#f8f9fa'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  carsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  },
  carCard: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  carImageContainer: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
    background: '#f0f0f0'
  },
  carImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s'
  },
  carImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    color: '#ccc'
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#FFD700',
    color: '#000',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  carInfo: {
    padding: '1.5rem'
  },
  carName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    color: '#1a1a1a'
  },
  carBrand: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.75rem'
  },
  carSpecs: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.75rem',
    color: '#888',
    marginBottom: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #eee'
  },
  carPrice: {
    marginBottom: '1rem'
  },
  oldPrice: {
    fontSize: '0.85rem',
    color: '#999',
    textDecoration: 'line-through',
    marginRight: '0.5rem'
  },
  newPrice: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#FFD700'
  },
  price: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  viewBtn: {
    display: 'inline-block',
    color: '#FFD700',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s'
  },
  viewAllContainer: {
    textAlign: 'center',
    marginTop: '3rem'
  },
  viewAllBtn: {
    display: 'inline-block',
    background: '#FFD700',
    color: '#000',
    padding: '12px 32px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'transform 0.3s'
  },
  // CTA Section
  cta: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    color: '#fff',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  ctaSubtitle: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    opacity: 0.9
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaBtnPrimary: {
    background: '#FFD700',
    color: '#000',
    padding: '12px 32px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'transform 0.3s',
    display: 'inline-block'
  },
  ctaBtnSecondary: {
    background: 'transparent',
    color: '#FFD700',
    padding: '12px 32px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: '2px solid #FFD700',
    transition: 'all 0.3s',
    display: 'inline-block'
  }
};

// إضافة تأثيرات CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .car-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .car-card:hover img {
    transform: scale(1.05);
  }
  
  .btn-primary:hover, .btn-secondary:hover, .view-all-btn:hover,
  .cta-btn-primary:hover, .cta-btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255,215,0,0.3);
  }
  
  .cta-btn-secondary:hover {
    background: #FFD700;
    color: #000;
  }
`;
document.head.appendChild(styleSheet);

export default Home;