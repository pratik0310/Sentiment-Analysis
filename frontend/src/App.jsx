import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout Components
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";

// Pages
import Home from "./pages/Home";
import Upload from "./components/Upload";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        color: "#e0e0e0"
      }}>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PageTransition>
                  <Home />
                </PageTransition>
              } />
              
              <Route path="/about" element={
                <PageTransition>
                  <About />
                </PageTransition>
              } />
              
              <Route path="/pricing" element={
                <PageTransition>
                  <Pricing />
                </PageTransition>
              } />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/analyze" element={
                <PageTransition>
                  <SignedIn>
                    <Upload />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/pricing" replace />
                  </SignedOut>
                </PageTransition>
              } />
              
              <Route path="/dashboard" element={
                <PageTransition>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/pricing" replace />
                  </SignedOut>
                </PageTransition>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={
                <PageTransition>
                  <div style={{
                    textAlign: "center",
                    padding: "100px 20px",
                    backgroundColor: "#2d2d2d",
                    borderRadius: "12px",
                    border: "1px solid #444"
                  }}>
                    <h1 style={{ fontSize: "72px", color: "#4a90e2", margin: "0" }}>404</h1>
                    <h2 style={{ color: "#fff", margin: "20px 0" }}>Page Not Found</h2>
                    <p style={{ color: "#aaa", marginBottom: "30px" }}>
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <a 
                      href="/"
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "#4a90e2",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "25px",
                        display: "inline-block",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#357abd";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#4a90e2";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      Go Home
                    </a>
                  </div>
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </Layout>
      </div>
    </Router>
  );
}