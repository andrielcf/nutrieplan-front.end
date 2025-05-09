import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import AuthenticatedRoute from "./components/AuthenticatedRoute"
import NotAuthenticatedRoute from "./components/NotAuthenticatedRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Flip, Slide } from "react-toastify/unstyled"

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
      />
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthenticatedRoute>
              <Navigate to="/auth/login" />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <AuthenticatedRoute>
              <AuthPage key="login" authType="login" />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <AuthenticatedRoute>
              <AuthPage key="register" authType="register" />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/"
          element={
            <NotAuthenticatedRoute>
              <HomePage />
            </NotAuthenticatedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
