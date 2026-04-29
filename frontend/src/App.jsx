// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages (User)
import Home from './pages/Home';
import Sale from './pages/Sale';
import Vehicles from './pages/Vehicles';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AddCar from './admin/AddCar';
import ManageCars from './admin/ManageCars';  // ✅ تأكد من هذا الـ import
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة دخول الأدمن (بدون Navbar) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* لوحة تحكم الأدمن (بدون Navbar) */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }>
          <Route index element={<div style={styles.adminWelcome}>Welcome to Admin Dashboard 🚗</div>} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />  {/* ✅ غير هذا السطر */}
          <Route path="add-offer" element={<div style={styles.adminPage}>➕ Add Offer Page - Coming Soon</div>} />
          <Route path="appointments" element={<div style={styles.adminPage}>📅 Appointments Page - Coming Soon</div>} />
        </Route>
        
        {/* الصفحات العادية (مع Navbar) */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-us" element={<AboutUs />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  );
}

const styles = {
  adminWelcome: {
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#333'
  },
  adminPage: {
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#666'
  }
};

export default App;