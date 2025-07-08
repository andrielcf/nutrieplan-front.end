import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import AuthenticatedRoute from "./components/AuthenticatedRoute"
import NotAuthenticatedRoute from "./components/NotAuthenticatedRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MealPlanner from "./pages/MealPlanner"
import MealRecipe from "./pages/MealRecipe"
import UserConfiguration from "./pages/UserConfiguration"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"

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
        <Route path="/auth/forgot-password" element={
          <AuthenticatedRoute>
            <ForgotPassword />
          </AuthenticatedRoute>
        } />
        <Route path="/reset-password/:token" element={
          <AuthenticatedRoute>
            <ResetPassword />
          </AuthenticatedRoute>
        } />

        <Route path="/landing" element={
          <AuthenticatedRoute>
            <LandingPage />
          </AuthenticatedRoute>
        } />
        <Route
          path="/"
          element={
            <NotAuthenticatedRoute>
              <HomePage />
            </NotAuthenticatedRoute>
          }
        />
        <Route
          path="/meal-planner"
          element={
            <NotAuthenticatedRoute>
              <MealPlanner />
            </NotAuthenticatedRoute>
          }
        />
        <Route
          path="/user-configuration"
          element={
            <NotAuthenticatedRoute>
              <UserConfiguration />
            </NotAuthenticatedRoute>
          }
        />
        <Route
          path="/meal-recipe"
          element={
            <NotAuthenticatedRoute>
              <MealRecipe />
            </NotAuthenticatedRoute>
          }
        />

        {/* <Route path="/*" element={<Navigate to="/landing" replace />} /> */}
      </Routes>

    </BrowserRouter>
  )
}

export default App
