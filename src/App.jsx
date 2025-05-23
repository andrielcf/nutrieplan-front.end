import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import AuthenticatedRoute from "./components/AuthenticatedRoute"
import NotAuthenticatedRoute from "./components/NotAuthenticatedRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
        {/* <Route path="/create-plan" element={
          <AuthenticatedRoute>
            <CreatePlan/>
          </AuthenticatedRoute>
        }></Route> */}
        <Route path="/landing" element={
          <AuthenticatedRoute>
            <LandingPage/>
          </AuthenticatedRoute>
        }></Route>
        <Route
          path="/"
          element={
            <NotAuthenticatedRoute>
              <HomePage />
            </NotAuthenticatedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
