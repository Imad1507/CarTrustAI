// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Home');

  const navItems = ['Home', 'Sale', 'Vehicles', 'Contact', 'About us'];

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          {/* Brand */}
          <div style={styles.brand}>
            <a href="/" style={styles.brandLink}>
              <span style={styles.icon}>⚡</span>
              <span style={styles.brandName}>Drive<span style={styles.accent}>Max</span></span>
            </a>
          </div>

          {/* Desktop Links */}
          <div style={styles.links}>
            {navItems.map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                style={{
                  ...styles.link,
                  ...(selected === item ? styles.linkActive : {})
                }}
                onClick={() => setSelected(item)}
              >
                {item === 'Sale' && <span style={styles.saleBadge}>🔥</span>}
                {item}
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div style={styles.actions}>
            <button style={styles.iconBtn}>👤</button>
            <button style={styles.iconBtn}>❤️</button>
            <button style={styles.menuToggle} onClick={() => setOpen(!open)}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div style={{
        ...styles.drawer,
        transform: open ? 'translateX(0)' : 'translateX(100%)'
      }}>
        <div style={styles.drawerHeader}>
          <span style={styles.drawerLogo}>DriveMax</span>
          <button style={styles.drawerClose} onClick={() => setOpen(false)}>✕</button>
        </div>
        {navItems.map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase().replace(' ', '-')}`}
            style={styles.drawerLink}
            onClick={() => {
              setSelected(item);
              setOpen(false);
            }}
          >
            {item === 'Sale' && <span style={styles.saleBadge}>🔥</span>}
            {item}
          </a>
        ))}
        <div style={styles.drawerButtons}>
          <button style={styles.drawerBtn}>Login</button>
          <button style={styles.drawerBtnPrimary}>Sign Up</button>
        </div>
      </div>

      {/* Overlay */}
      {open && <div style={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  );
};

const styles = {
  nav: {
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(12px)',
    padding: '0.8rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  container: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    flex: 1
  },
  brandLink: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.6rem',
    fontWeight: 'bold'
  },
  icon: {
    fontSize: '1.8rem'
  },
  brandName: {
    color: '#fff'
  },
  accent: {
    color: '#ff6b6b'
  },
  links: {
    display: 'flex',
    gap: '2rem',
    flex: 2,
    justifyContent: 'center'
  },
  link: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '8px 4px',
    transition: 'color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  linkActive: {
    color: '#ff6b6b'
  },
  saleBadge: {
    fontSize: '0.9rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#fff',
    padding: '8px',
    borderRadius: '50%',
    width: '38px',
    height: '38px',
    transition: 'background 0.3s'
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.6rem',
    color: '#fff',
    cursor: 'pointer'
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '280px',
    height: '100%',
    background: '#0a0a0a',
    zIndex: 1002,
    padding: '1.5rem',
    transition: 'transform 0.3s ease',
    boxShadow: '-5px 0 20px rgba(0,0,0,0.5)'
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333'
  },
  drawerLogo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff6b6b'
  },
  drawerClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#fff',
    cursor: 'pointer'
  },
  drawerLink: {
    display: 'block',
    color: '#fff',
    textDecoration: 'none',
    padding: '12px 0',
    fontSize: '1.1rem',
    borderBottom: '1px solid #222'
  },
  drawerButtons: {
    marginTop: '2rem',
    display: 'flex',
    gap: '1rem'
  },
  drawerBtn: {
    flex: 1,
    background: 'transparent',
    border: '1px solid #ff6b6b',
    color: '#ff6b6b',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  drawerBtnPrimary: {
    flex: 1,
    background: '#ff6b6b',
    border: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1001
  }
};

// Responsive
if (typeof window !== 'undefined') {
  const checkScreen = () => {
    const isMobile = window.innerWidth <= 768;
    const linksDiv = document.querySelector('.links');
    const menuBtn = document.querySelector('.menu-toggle');
    if (linksDiv && menuBtn) {
      linksDiv.style.display = isMobile ? 'none' : 'flex';
      menuBtn.style.display = isMobile ? 'block' : 'none';
    }
  };
  window.addEventListener('resize', checkScreen);
  setTimeout(checkScreen, 100);
}

export default Navbar;