import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import RequestBlood from "./pages/RequestBlood";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Donate from './pages/Donate';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/request-blood" element={<RequestBlood />} />
              <Route path="/donate/:requestId" element={<Donate />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
