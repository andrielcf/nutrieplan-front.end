import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import AuthenticatedRoute from "./components/AuthenticatedRoute"
import NotAuthenticatedRoute from "./components/NotAuthenticatedRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import { Flip, Slide } from "react-toastify/unstyled"

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
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
          path="/auth/request-reset"
          element={<RequestResetPassword />}
        />
        <Route
          path="/auth/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/"
          element={
            <NotAuthenticatedRoute>
              <HomePage />
            </NotAuthenticatedRoute>
          }
        />
      </Routes>
    </BrowserRouter>

  )
}

export default App
