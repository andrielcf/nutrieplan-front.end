// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//     const navigate = useNavigate();

//     return (
//         <div>
//             <h1>Cadatro</h1>
//         </div>
//     );
// }
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

// Step components
const StepDots = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center space-x-2 my-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            index === currentStep ? "bg-green-500 w-6" : index < currentStep ? "bg-green-300" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

// Step 1: Basic Info
const BasicInfoStep = ({ formData, setFormData, onNext }) => {
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    setIsValid(
      formData.email.includes("@") && formData.password.length >= 6 && formData.password === formData.confirmPassword,
    )
  }, [formData])

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-center text-gray-800">Crie sua conta</h3>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          placeholder="••••••••"
          required
        />
        {formData.password && formData.password.length < 6 && (
          <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirme sua senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          placeholder="••••••••"
          required
        />
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${
          isValid
            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Prosseguir
      </button>
    </div>
  )
}

// Step 2: Dietary Restrictions
const DietaryRestrictionsStep = ({ formData, setFormData, onNext, onBack }) => {
  const restrictions = [
    { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
    { id: "vegan", label: "Vegan", icon: "🌱" },
    { id: "lactoseFree", label: "Lactose-Free", icon: "🥛" },
    { id: "glutenFree", label: "Gluten-Free", icon: "🌾" },
  ]

  const toggleRestriction = (id) => {
    setFormData({
      ...formData,
      dietaryRestrictions: {
        ...formData.dietaryRestrictions,
        [id]: !formData.dietaryRestrictions[id],
      },
    })
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-center text-gray-800">Dietary Restrictions</h3>
      <p className="text-gray-600 text-center">Select any that apply to you</p>

      <div className="grid grid-cols-2 gap-3 my-4">
        {restrictions.map((restriction) => (
          <button
            key={restriction.id}
            type="button"
            onClick={() => toggleRestriction(restriction.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
              formData.dietaryRestrictions[restriction.id]
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl mb-2">{restriction.icon}</span>
            <span className="font-medium text-gray-800">{restriction.label}</span>
          </button>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 3: Physical Information
const PhysicalInfoStep = ({ formData, setFormData, onSubmit, onBack }) => {
  const [isValid, setIsValid] = useState(false)

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Light (exercise 1-3 times/week)" },
    { value: "moderate", label: "Moderate (exercise 3-5 times/week)" },
    { value: "active", label: "Active (exercise 6-7 times/week)" },
    { value: "veryActive", label: "Very Active (hard exercise daily)" },
  ]

  useEffect(() => {
    setIsValid(formData.age > 0 && formData.weight > 0 && formData.height > 0 && formData.activityLevel)
  }, [formData])

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-center text-gray-800">Physical Information</h3>
      <p className="text-gray-600 text-center">Help us personalize your meal plan</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            id="age"
            type="number"
            min="1"
            max="120"
            value={formData.age || ""}
            onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) || "" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="Years"
            required
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight
          </label>
          <input
            id="weight"
            type="number"
            min="1"
            max="500"
            value={formData.weight || ""}
            onChange={(e) => setFormData({ ...formData, weight: Number.parseInt(e.target.value) || "" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="kg"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
          Height
        </label>
        <input
          id="height"
          type="number"
          min="1"
          max="300"
          value={formData.height || ""}
          onChange={(e) => setFormData({ ...formData, height: Number.parseInt(e.target.value) || "" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          placeholder="cm"
          required
        />
      </div>

      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Activity Level
        </label>
        <select
          id="activityLevel"
          value={formData.activityLevel || ""}
          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          required
        >
          <option value="" disabled>
            Select your activity level
          </option>
          {activityLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
            isValid
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create Account
        </button>
      </div>
    </div>
  )
}

// Main Register Component
export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      lactoseFree: false,
      glutenFree: false,
    },
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
  })

  const totalSteps = 3

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      // In a real app, you would handle the registration here
      sessionStorage.setItem("token", "demo-token")
      window.location.href = "/"
      setLoading(false)
    }, 1500)
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
      case 1:
        return (
          <DietaryRestrictionsStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 2:
        return (
          <PhysicalInfoStep formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onBack={handleBack} />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        <div className="p-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Nutri & Plan</h2>
          </div>

          <StepDots currentStep={currentStep} totalSteps={totalSteps} />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Creating your account...</p>
            </div>
          ) : (
            renderStep()
          )}

          {currentStep === 0 && !loading && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/auth/login" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                  Entrar
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
