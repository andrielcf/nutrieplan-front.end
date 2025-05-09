import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { Flip } from "react-toastify/unstyled"
// Step components
const StepDots = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center space-x-2 my-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentStep ? "bg-green-500 w-6" : index < currentStep ? "bg-green-300" : "bg-gray-300"
            }`}
        />
      ))}
    </div>
  )
}

// Step 1: Basic Info
const BasicInfoStep = ({ formData, setFormData, onNext, setError }) => {
  const [isValid, setIsValid] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  useEffect(() => {
    setIsValid(
      formData.email.includes("@") &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    )
  }, [formData])

  const checkEmailExists = async () => {
    if (!formData.email.includes("@")) return

    setCheckingEmail(true)
    try {
      const response = await axios.get("http://localhost:8080/api/auth/check-email", {
        params: { email: formData.email }
      })
      if (response.data) {
        // setError("Você já possui uma conta!")
        toast.error('Você já possui uma conta!', {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });
      } else {
        setError("")
        onNext()
      }
    } catch (err) {
      setError("Erro ao verificar email. Tente novamente.")
    } finally {
      setCheckingEmail(false)
    }
  }

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
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value })
            setError("")
          }}
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
          <p className="text-red-500 text-xs mt-1">A senha deve conter 6 caracteres</p>
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
          <p className="text-red-500 text-xs mt-1">As senhas não são iguais</p>
        )}
      </div>

      <button
        onClick={checkEmailExists}
        disabled={!isValid || checkingEmail}
        className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${isValid && !checkingEmail
            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
      >
        {checkingEmail ? "Verificando..." : "Prosseguir"}
      </button>
    </div>
  )
}

// Step 2: Profile Info
const ProfileInfoStep = ({ formData, setFormData, onNext, onBack }) => {
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    setIsValid(
      formData.profile.name &&
      formData.profile.weight > 0 &&
      formData.profile.height > 0 &&
      formData.profile.age > 0 &&
      formData.profile.gender &&
      formData.profile.activityLevelId &&
      formData.profile.dietLabelId
    )
  }, [formData.profile])

  const genders = [
    { value: "MALE", label: "Masculino" },
    { value: "FEMALE", label: "Feminino" }
  ]

  const activityLevels = [
    { id: 1, label: "Sedentário (pouco ou nenhum exercício)" },
    { id: 2, label: "Levemente ativo (exercício 1-3 vezes/semana)" },
    { id: 3, label: "Moderadamente ativo (exercício 3-5 vezes/semana)" },
    { id: 4, label: "Muito ativo (exercício 6-7 vezes/semana)" },
    { id: 5, label: "Extremamente ativo (exercício intenso diário)" }
  ]

  const dietLabels = [
    { id: 1, label: "Balanceada" },
    { id: 2, label: "High-Protein" },
    { id: 3, label: "Low-Fat" },
    { id: 4, label: "Low-Carb" }
  ]

  const healthLabels = [
    { id: 1, label: "Vegana", name: "vegan" },
    { id: 2, label: "Vegetariana", name: "vegetarian" },
    { id: 3, label: "Sem glúten", name: "gluten-free" },
    { id: 4, label: "Sem lactose", name: "lactose-free" }
  ]

  const toggleHealthLabel = (id) => {
    const newHealthLabels = [...formData.profile.healthLabelsIds]
    const index = newHealthLabels.indexOf(id)

    if (index === -1) {
      newHealthLabels.push(id)
    } else {
      newHealthLabels.splice(index, 1)
    }

    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        healthLabelsIds: newHealthLabels
      }
    })
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-center text-gray-800">Informações Pessoais</h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={formData.profile.name}
          onChange={(e) => setFormData({
            ...formData,
            profile: {
              ...formData.profile,
              name: e.target.value
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          placeholder="Seu nome completo"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Idade
          </label>
          <input
            id="age"
            type="number"
            min="1"
            max="120"
            value={formData.profile.age || ""}
            onChange={(e) => setFormData({
              ...formData,
              profile: {
                ...formData.profile,
                age: Number.parseInt(e.target.value) || ""
              }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="Anos"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gênero
          </label>
          <select
            id="gender"
            value={formData.profile.gender || ""}
            onChange={(e) => setFormData({
              ...formData,
              profile: {
                ...formData.profile,
                gender: e.target.value
              }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            required
          >
            <option value="" disabled>Selecione</option>
            {genders.map(gender => (
              <option key={gender.value} value={gender.value}>{gender.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Peso
          </label>
          <input
            id="weight"
            type="number"
            min="1"
            max="500"
            step="0.1"
            value={formData.profile.weight || ""}
            onChange={(e) => setFormData({
              ...formData,
              profile: {
                ...formData.profile,
                weight: Number.parseFloat(e.target.value) || ""
              }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="kg"
            required
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Altura
          </label>
          <input
            id="height"
            type="number"
            min="1"
            max="300"
            step="0.1"
            value={formData.profile.height || ""}
            onChange={(e) => setFormData({
              ...formData,
              profile: {
                ...formData.profile,
                height: Number.parseFloat(e.target.value) || ""
              }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="cm"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Nível de Atividade
        </label>
        <select
          id="activityLevel"
          value={formData.profile.activityLevelId || ""}
          onChange={(e) => setFormData({
            ...formData,
            profile: {
              ...formData.profile,
              activityLevelId: Number.parseInt(e.target.value)
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          required
        >
          <option value="" disabled>Selecione seu nível</option>
          {activityLevels.map(level => (
            <option key={level.id} value={level.id}>{level.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dietLabel" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Dieta
        </label>
        <select
          id="dietLabel"
          value={formData.profile.dietLabelId || ""}
          onChange={(e) => setFormData({
            ...formData,
            profile: {
              ...formData.profile,
              dietLabelId: Number.parseInt(e.target.value)
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          required
        >
          <option value="" disabled>Selecione sua dieta</option>
          {dietLabels.map(diet => (
            <option key={diet.id} value={diet.id}>{diet.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Restrições de Saúde
        </label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {healthLabels.map(label => (
            <div key={label.id} className="flex items-center">
              <input
                type="checkbox"
                id={`health-${label.id}`}
                checked={formData.profile.healthLabelsIds.includes(label.id)}
                onChange={() => toggleHealthLabel(label.id)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor={`health-${label.id}`} className="ml-2 block text-sm text-gray-700">
                {label.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${isValid
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

// Step 3: Review and Submit
const ReviewStep = ({ formData, onBack, onSubmit, loading }) => {
  const activityLevelLabels = {
    1: "Sedentário",
    2: "Levemente ativo",
    3: "Moderadamente ativo",
    4: "Muito ativo",
    5: "Extremamente ativo"
  }

  const dietLabelLabels = {
    1: "Balanceada",
    2: "Low-Carb",
    3: "Low-Fat",
    4: "High-Protein",
    5: "Keto"
  }

  const healthLabelLabels = {
    1: "Vegetariana",
    2: "Vegana",
    3: "Sem lactose",
    4: "Sem glúten",
    5: "Sem açúcar",
    6: "Baixo sódio"
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-center text-gray-800">Revise seus dados</h3>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Informações básicas</h4>
        <p><span className="text-gray-600">Email:</span> {formData.email}</p>

        <h4 className="font-medium text-gray-800 mt-4 mb-2">Perfil</h4>
        <p><span className="text-gray-600">Nome:</span> {formData.profile.name}</p>
        <p><span className="text-gray-600">Idade:</span> {formData.profile.age} anos</p>
        <p><span className="text-gray-600">Sexo:</span> {formData.profile.gender === "MALE" ? "Masculino" : formData.profile.gender === "FEMALE" ? "Feminino" : "Outro"}</p>
        <p><span className="text-gray-600">Peso:</span> {formData.profile.weight} kg</p>
        <p><span className="text-gray-600">Altura:</span> {formData.profile.height} cm</p>
        <p><span className="text-gray-600">Nível de atividade:</span> {activityLevelLabels[formData.profile.activityLevelId]}</p>
        <p><span className="text-gray-600">Tipo de dieta:</span> {dietLabelLabels[formData.profile.dietLabelId]}</p>

        {formData.profile.healthLabelsIds.length > 0 && (
          <>
            <p className="text-gray-600 mt-2">Restrições:</p>
            <ul className="list-disc list-inside">
              {formData.profile.healthLabelsIds.map(id => (
                <li key={id}>{healthLabelLabels[id]}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${!loading
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          {loading ? "Enviando..." : "Criar Conta"}
        </button>
      </div>
    </div>
  )
}

// Main Register Component
export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    profile: {
      name: "",
      weight: "",
      height: "",
      age: "",
      gender: "",
      activityLevelId: "",
      dietLabelId: "",
      healthLabelsIds: []
    }
  })
  const finalFormData = {
    ...formData,
  };
  delete finalFormData.confirmPassword;

  const totalSteps = 3

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
    setError("")
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setError("")
  }
  

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      // Chamada para a API de registro
      const response = await axios.post("http://localhost:8080/api/auth/register", finalFormData)

      // Se o registro for bem-sucedido
      console.log("Registro bem-sucedido:", response.data)
      navigate("/")
    } catch (err) {
      // console.error("Erro no registro:", err)
      console.log(err)
      setError(err.response?.data?.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} setError={setError} />
      case 1:
        return <ProfileInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
      case 2:
        return <ReviewStep formData={formData} onBack={handleBack} onSubmit={handleSubmit} loading={loading} />
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <StepDots currentStep={currentStep} totalSteps={totalSteps} />

          {renderStep()}

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