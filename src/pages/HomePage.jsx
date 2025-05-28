// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Typography,
// } from "@material-tailwind/react";
// import Modal from 'react-bootstrap/Modal';

// export default function Home() {
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [caloriesConsumed, setCaloriesConsumed] = useState(0);
//   const [caloriesGoal, setCaloriesGoal] = useState(2000);
//   const [loading, setLoading] = useState(false);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [currentDayData, setCurrentDayData] = useState(null);
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const navigate = useNavigate();

//   // Mapeamento de dias da semana
//   const daysOfWeek = [
//     { pt: "Domingo", en: "SUNDAY" },
//     { pt: "Segunda", en: "MONDAY" },
//     { pt: "Terça", en: "TUESDAY" },
//     { pt: "Quarta", en: "WEDNESDAY" },
//     { pt: "Quinta", en: "THURSDAY" },
//     { pt: "Sexta", en: "FRIDAY" },
//     { pt: "Sábado", en: "SATURDAY" },
//   ];

//   // Carrega os dados da semana ao montar o componente
//   useEffect(() => {
//     const fetchWeeklyData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');

//         const response = await axios.get("http://localhost:8080/api/dia/full", {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         setWeeklyData(response.data);

//         const today = new Date();
//         const dayIndex = today.getDay();
//         handleDaySelect(daysOfWeek[dayIndex].pt);
//       } catch (error) {
//         if (error.response && error.response.status === 403) {
//           localStorage.removeItem("token");
//           toast.error('Sessão expirada. Por favor, faça login novamente.', {
//             position: "top-center",
//             autoClose: 2000,
//           });
//           navigate("/auth")
//         } else {
//           toast.error('Erro ao carregar dados da semana', {
//             position: "top-center",
//             autoClose: 1000,
//           });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeeklyData();
//     console.log("CONSULTANDO ALIMENTOS")
//   }, []);
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import Modal from 'react-bootstrap/Modal';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [loading, setLoading] = useState(true); // Alterado para true inicialmente
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentDayData, setCurrentDayData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // Mapeamento de dias da semana
  const daysOfWeek = [
    { pt: "Domingo", en: "SUNDAY" },
    { pt: "Segunda", en: "MONDAY" },
    { pt: "Terça", en: "TUESDAY" },
    { pt: "Quarta", en: "WEDNESDAY" },
    { pt: "Quinta", en: "THURSDAY" },
    { pt: "Sexta", en: "FRIDAY" },
    { pt: "Sábado", en: "SATURDAY" },
  ];

  // Carrega os dados da semana ao montar o componente
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/dia/full", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setWeeklyData(response.data);

        // Configura o dia atual após carregar os dados
        const today = new Date();
        const dayIndex = today.getDay();
        const dayEn = daysOfWeek[dayIndex].en;
        const dayData = response.data.find(day => day.dayOfWeek === dayEn);

        // Formata a data
        const formattedDate = today.toLocaleDateString('pt-BR');

        setSelectedDay(daysOfWeek[dayIndex].pt);
        setSelectedDate(formattedDate);
        setCurrentDayData(dayData || null);

      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem("token");
          toast.error('Sessão expirada. Por favor, faça login novamente.', {
            position: "top-center",
            autoClose: 2000,
          });
          navigate("/auth");
        } else {
          toast.error('Erro ao carregar dados da semana', {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [navigate]);


  // Manipula a seleção do dia
  const handleDaySelect = (dayPt) => {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const selectedDayIndex = daysOfWeek.findIndex((day) => day.pt === dayPt);
    const dayEn = daysOfWeek.find(day => day.pt === dayPt).en;

    // Calcula a data do dia selecionado
    let diff = selectedDayIndex - currentDayIndex;
    const selectedDateObj = new Date(today);
    selectedDateObj.setDate(today.getDate() + diff);

    // Formata a data
    const formattedDate = selectedDateObj.toLocaleDateString('pt-BR');

    setSelectedDay(dayPt);
    setSelectedDate(formattedDate);

    // Encontra os dados do dia selecionado
    const dayData = weeklyData.find(day => day.dayOfWeek === dayEn);
    setCurrentDayData(dayData);

    // Zerar contador de calorias
    setCaloriesConsumed(0);
  };

  console.log(selectedDay)
  console.log(selectedDate)

  // Abrir modal com detalhes da refeição
  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);
    setOpenModal(true);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const handleShow = (meal) => {

    setShow(true);
  }


  // Marcar refeição como concluída
  const markAsCompleted = async (mealId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/refeicao/concluir/${mealId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Refeição marcada como concluída!', {
        position: "top-center",
        autoClose: 1000,
      });

      setOpenModal(false);

    } catch (error) {
      toast.error('Erro ao marcar refeição como concluída', {
        position: "top-center",
        autoClose: 1000,
      });
      console.log(mealId, selectedDate, selectedDay)
    }
  };

  // Calcula a porcentagem de progresso (sempre 0 agora)
  const progressPercentage = 0;
  const isOverLimit = false;

  // Função para traduzir o tipo de refeição
  const translateMealType = (type) => {
    return type === "Breakfast" ? "Café da manhã" :
      type.includes("Lunch") ? "Almoço" : "Jantar";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800"></h1>
          <Link
            to="/auth/logout"
            className="text-sm text-green-600 hover:text-green-800 transition-colors"
          >
            Sair
          </Link>
        </header>

        {/* Contador de calorias circular */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progressPercentage} 100`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                {caloriesConsumed.toFixed(0)}
              </span>
              <span className="text-sm text-gray-500">
                / {caloriesGoal} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Dias da semana */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedDate || "Selecione um dia"}
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.pt}
                  onClick={() => handleDaySelect(day.pt)}
                  className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${selectedDay === day.pt
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {day.pt.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo do dia selecionado */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : currentDayData ? (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Refeições - {selectedDay}
                </h3>
                <div className="space-y-4">
                  {currentDayData.mealRecipes.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => handleOpenModal(meal)}
                      className="w-full text-left border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-4 flex items-start">
                        {meal.imageUrl && (
                          <img
                            src={meal.imageUrl}
                            alt={meal.mealType}
                            className="w-16 h-16 rounded-md object-cover mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              {translateMealType(meal.mealType)} - {meal.calories.toFixed(0)} kcal
                            </span>
                          </div>
                          {meal.prepareInstructions && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {meal.prepareInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum dado disponível para este dia
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal show={openModal} onHide={() => setOpenModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedMeal ? translateMealType(selectedMeal.mealType) : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '40rem', overflowY: 'auto' }}>
          {selectedMeal && (
            <div className="space-y-6">
              {selectedMeal.imageUrl && (
                // <img
                //   src={selectedMeal.imageUrl}
                //   alt={selectedMeal.mealType}
                //   className="h-30 rounded-md object-cover mb-4"
                // />
                <div className="d-flex justify-content-center mb-4">
                  <img
                    src={selectedMeal.imageUrl}
                    alt={selectedMeal.mealType}
                    className="h-30 rounded-md object-cover"
                  />
                </div>
              )}

              <div>
                <h5 className="mb-2">Informações Nutricionais</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <small className="text-muted">Calorias totais</small>
                    <p>{selectedMeal.calories.toFixed(0)} kcal</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <small className="text-muted">Calorias por porção</small>
                    <p>{(selectedMeal.calories / selectedMeal.yield).toFixed(0)} kcal</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <small className="text-muted">Proteínas</small>
                    <p>{selectedMeal.protein.toFixed(1)}g</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <small className="text-muted">Carboidratos</small>
                    <p>{selectedMeal.carbohydrate.toFixed(1)}g</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <small className="text-muted">Gorduras</small>
                    <p>{selectedMeal.fat.toFixed(1)}g</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <small className="text-muted">Fibras</small>
                    <p>{selectedMeal.fiber.toFixed(1)}g</p>
                  </div>
                </div>
              </div>

              {selectedMeal.prepareInstructions && (
                <div>
                  <h5 className="mb-2">Modo de Preparo</h5>
                  <p className="whitespace-pre-line">
                    {selectedMeal.prepareInstructions}
                  </p>
                </div>
              )}

              {selectedMeal.urlRecipe && (
                <div>
                  <h5 className="mb-2">Receita Completa</h5>
                  <a
                    href={selectedMeal.urlRecipe}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    <p>Clique aqui para ver a receita completa</p>
                  </a>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOpenModal(false)}
            className="mr-2"
          >
            Fechar
          </Button>
          <Button className="color: bg-green-400"
            variant="success"
            onClick={() => selectedMeal && markAsCompleted(selectedMeal.id)}
          >
            Marcar como concluído
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}