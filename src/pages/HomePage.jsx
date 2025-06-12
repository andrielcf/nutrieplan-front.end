import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import NutriPlanLogo from "../assets/nutrieplan-title-v2.svg";
import NutriPlanLogoNoTitle from "../assets/nutrieplan-notitle-v2.svg";


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
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [consumedMeals, setConsumedMeals] = useState([]);
  const [tdee, setTdee] = useState(2000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrate: '',
    fat: '',
    fiber: ''
  });

  const [open, setOpen] = useState(false);


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

  useEffect(() => {
    const fetchTdee = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/user/tdee", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTdee(response.data); // Supondo que a API retorne { tdee: valor }
        setCaloriesGoal(response.data);
      } catch (error) {
        console.error('Erro ao buscar TDEE:', error);
        toast.error('Erro ao carregar meta de calorias', {
          position: "top-center",
          autoClose: 1000,
        });
      }
    };

    fetchTdee();
  }, []);

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

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year}`; // Para exibição (pt-BR)
        const apiFormattedDate = `${year}-${month}-${day}`; // Para a API (ISO)

        setSelectedDay(daysOfWeek[dayIndex].pt);
        setSelectedDate(formattedDate);
        setCurrentDayData(dayData || null);

        // Busca as refeições consumidas do dia atual
        console.log("SELECIONANDO DIA useEffect: " + apiFormattedDate);
        fetchConsumedMeals(apiFormattedDate);


      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem("token");
          toast.error('Sessão expirada. Por favor, faça login novamente.', {
            position: "top-center",
            autoClose: 2000,
          });
          navigate("/auth/login");
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

  // Função para remover refeições consumidas
  const handleRemoveMeal = async (mealId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/foodlog/meal-remove?id=${mealId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Refeição removida com sucesso!', {
        position: "top-center",
        autoClose: 1000,
      });

      // Recarrega as refeições consumidas
      const [day, month, year] = selectedDate.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      fetchConsumedMeals(formattedDate);

    } catch (error) {
      toast.error('Erro ao remover refeição', {
        position: "top-center",
        autoClose: 1000,
      });
      console.error(error);
    }
  };

  // Função para lidar com a adição de refeição manual
  const handleAddMeal = async () => {
    try {
      const token = localStorage.getItem('token');

      // Formata a data para o padrão ISO (yyyy-MM-dd)
      const [day, month, year] = selectedDate.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const mealData = {
        localDate: formattedDate,
        dayOfWeek: daysOfWeek.find(day => day.pt === selectedDay).en,
        name: newMeal.name,
        calories: parseFloat(newMeal.calories),
        protein: parseFloat(newMeal.protein),
        carbohydrate: parseFloat(newMeal.carbohydrate),
        fat: parseFloat(newMeal.fat),
        fiber: parseFloat(newMeal.fiber),
        consumeYield: 1 // Assume 1 porção para refeições manuais
      };

      await axios.post(`http://localhost:8080/api/foodlog/consume`, mealData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Refeição adicionada com sucesso!', {
        position: "top-center",
        autoClose: 1000,
      });

      // Recarrega as refeições consumidas
      fetchConsumedMeals(formattedDate);
      setShowAddMealModal(false);
      setNewMeal({
        name: '',
        calories: '',
        protein: '',
        carbohydrate: '',
        fat: '',
        fiber: ''
      });

    } catch (error) {
      toast.error('Erro ao adicionar refeição', {
        position: "top-center",
        autoClose: 1000,
      });
      console.error(error);
    }
  };

  const fetchConsumedMeals = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/foodlog/selected-date?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("SELECIONANDO DIA: " + date)
      console.log(response.data)
      setConsumedMeals(response.data);

      // Calcular total de calorias consumidas
      const totalCalories = response.data.reduce((sum, meal) => {
        const calories = Number(meal.calories) || 0;
        return sum + calories;
      }, 0);
      setCaloriesConsumed(totalCalories);
    } catch (error) {
      console.error('Erro ao buscar refeições consumidas:', error);
      toast.error('Erro ao carregar histórico de refeições', {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const handleDaySelect = (dayPt) => {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const selectedDayIndex = daysOfWeek.findIndex((day) => day.pt === dayPt);
    const dayEn = daysOfWeek.find(day => day.pt === dayPt).en;

    // Calcula a data do dia selecionado
    let diff = selectedDayIndex - currentDayIndex;
    const selectedDateObj = new Date(today);
    selectedDateObj.setDate(today.getDate() + diff);

    // Formata a data para exibição
    const formattedDate = selectedDateObj.toLocaleDateString('pt-BR');
    // console.log("Data formatada: " + formattedDate)
    // Formata a data para a API (manualmente para evitar problemas de fuso horário)
    const year = selectedDateObj.getFullYear();
    const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDateObj.getDate()).padStart(2, '0');
    const apiFormattedDate = `${year}-${month}-${day}`;

    // console.log(apiFormattedDate);

    setSelectedDay(dayPt);
    setSelectedDate(formattedDate);

    // Encontra os dados do dia selecionado
    const dayData = weeklyData.find(day => day.dayOfWeek === dayEn);
    setCurrentDayData(dayData);

    // Busca as refeições consumidas
    fetchConsumedMeals(apiFormattedDate);
  };

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
  const markAsCompleted = async (meal) => {
    try {
      const token = localStorage.getItem('token');

      // Formata a data para o padrão ISO (yyyy-MM-dd)
      const [day, month, year] = selectedDate.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      // Prepara os dados para enviar
      const foodlogData = {
        localDate: formattedDate,
        dayOfWeek: daysOfWeek.find(day => day.pt === selectedDay).en,
        name: translateMealType(meal.mealType),
        calories: (meal.calories / meal.yield) * meal.consumeYield,
        carbohydrate: (meal.carbohydrate / meal.yield) * meal.consumeYield,
        protein: (meal.protein / meal.yield) * meal.consumeYield,
        fat: (meal.fat / meal.yield) * meal.consumeYield,
        fiber: (meal.fiber / meal.yield) * meal.consumeYield,
        consumeYield: meal.consumeYield
      };

      await axios.post(`http://localhost:8080/api/foodlog/consume`, foodlogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Refeição marcada como concluída!', {
        position: "top-center",
        autoClose: 1000,
      });

      fetchConsumedMeals(formattedDate);
      setOpenModal(false);

    } catch (error) {
      toast.error('Erro ao marcar refeição como concluída', {
        position: "top-center",
        autoClose: 1000,
      });
      console.error(error);
    }
  };

  // Calcula a porcentagem de progresso (sempre 0 agora)
  const progressPercentage = caloriesGoal > 0
    ? Math.min((caloriesConsumed / caloriesGoal) * 100, 100)
    : 0;
  const isOverLimit = caloriesConsumed > caloriesGoal;

  // Função para traduzir o tipo de refeição
  const translateMealType = (type) => {
    return type === "Breakfast" ? "Café da manhã" :
      type.includes("Lunch") ? "Almoço" : "Jantar";
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 animate-fadeIn">
      {/* Menu de opções */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-2xl font-bold text-green-500">Menu de Opções</DialogTitle>
                  </div>
                  <div className="relative mt-6 flex-col px-4 sm:px-6 justify-between h-full">
                    <div className="flex flex-col h-full justify-between">
                      <div>

                        <button
                          onClick={() => {
                            setOpen(false);
                            navigate("/buscar-refeicoes");
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Buscar Refeições
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            navigate("/modificar-refeicoes");
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Modificar Refeições
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            navigate("/meal-planner");
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Criar Plano Alimentar
                        </button>

                        <button
                          onClick={() => {
                            setOpen(false);
                            navigate("/configuracoes");
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Configurações
                        </button>
                      </div>
                      <div>

                        <button
                          onClick={() => {
                            setOpen(false);
                            localStorage.removeItem("token");
                            navigate("/auth/login");
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-red-500 transition-colors"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        {/* <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800"></h1>
          <Link
            to="/auth/logout"
            className="text-sm text-green-600 hover:text-green-800 transition-colors"
          >
            Sair
          </Link>
        </header> */}

        {/* Cabeçalho */}
        <header className="flex justify-between items-center mb-8">

          <div className="flex items-center ">
            <Link to={"/"} className="transition-all duration-300 hover:scale-110">
              <img src={NutriPlanLogoNoTitle} alt="Nutri&Plan Logo" className="h-15 w-auto" />
            </Link>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
                stroke={isOverLimit ? "#ef4444" : "#10b981"}
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
              {isOverLimit && (
                <span className="text-xs text-red-500 mt-1">Limite excedido!</span>
              )}
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
                  className={`transition-all duration-300 hover:scale-110 py-2 px-1 rounded-lg text-sm font-medium transition-colors ${selectedDay === day.pt
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Refeições Consumidas
              </h3>
              <button
                onClick={() => setShowAddMealModal(true)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors transition-all duration-300 hover:scale-110"
              >
                + Adicionar Refeição
              </button>
            </div>
            {consumedMeals.length > 0 ? (
              <div className="space-y-2 mb-6">
                {consumedMeals.map((meal, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{meal.name}</span>
                      <span className="text-green-600">{meal.calories.toFixed(0)} kcal</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                      <div>
                        <small className="text-gray-500">Proteínas</small>
                        <p>{meal.protein.toFixed(0)} (g)</p>
                      </div>
                      <div>
                        <small className="text-gray-500">Carboidratos</small>
                        <p>{meal.carbohydrate.toFixed(0)} (g)</p>
                      </div>
                      <div>
                        <small className="text-gray-500">Gorduras</small>
                        <p>{meal.fat.toFixed(0)} (g)</p>
                      </div>
                      <div className="flex justify-end items-center">
                        <button
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="top-2 right-2 hover:text-red-500 transition-all duration-300 hover:scale-110"
                          title="Remover refeição"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                          </svg>
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (

              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center text-gray-500">

                <span>
                  Você ainda não consumiu nenhuma refeição hoje.
                </span>
              </div>
            )}


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
                              {translateMealType(meal.mealType)} - {((meal.calories / meal.yield) * meal.consumeYield).toFixed()} kcal
                            </span>
                          </div>
                          {meal.prepareInstructions && (
                            <p className="text-pretty text-gray-600 mt-1 line-clamp-2">
                              {/* name: translateMealType(meal.mealType),
                              calories: (meal.calories / meal.yield) * meal.consumeYield,
                              carbohydrate: (meal.carbohydrate / meal.yield) * meal.consumeYield,
                              protein: (meal.protein / meal.yield) * meal.consumeYield,
                              fat: (meal.fat / meal.yield) * meal.consumeYield,
                              fiber: (meal.fiber / meal.yield) * meal.consumeYield,
                              consumeYield: meal.consumeYield */}
                              {/* Proteinas: {((meal.protein / meal.yield) * meal.consumeYield).toFixed()} (g)
                              Gorduras: {((meal.fat / meal.yield) * meal.consumeYield).toFixed()} (g)  */}
                              Ver instruções de preparo
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="flex flex-col h-[80vh]">
                <div className="flex justify-between items-center p-4 border">
                  <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                    {selectedMeal ? translateMealType(selectedMeal.mealType) : ''}
                  </DialogTitle>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Fechar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {selectedMeal && (
                    <div className="space-y-6">
                      {selectedMeal.imageUrl && (
                        <div className="flex justify-center mb-4">
                          <img
                            src={selectedMeal.imageUrl}
                            alt={selectedMeal.mealType}
                            className="h-30 rounded-md object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <div className="grid gap-4">
                          <h5 className="mb-2">Informações Nutricionais</h5>
                          <div className="flex justify-between items-center">
                            <h6>Consumir: ({selectedMeal.consumeYield.toFixed(1)}) Porções</h6>
                            <h6>Você vai consumir {((selectedMeal.calories / selectedMeal.yield) * selectedMeal.consumeYield).toFixed()} Kcal - por refeição</h6>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <small className="text-muted">Calorias</small>
                            <p>{(selectedMeal.calories).toFixed(0)} kcal</p>
                            <p>{((selectedMeal.calories / selectedMeal.yield) * selectedMeal.consumeYield).toFixed()} Kcal</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <small className="text-muted">Calorias por porção (refeição)</small>
                            <p>{(selectedMeal.calories / selectedMeal.yield).toFixed(0)} kcal</p>
                            <p>{selectedMeal.yield.toFixed(0)} - Porções</p>
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
                </div>

                <div className="border p-4 bg-gray-50">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenModal(false)}
                      className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      onClick={() => selectedMeal && markAsCompleted(selectedMeal)}
                      className="inline-flex justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600"
                    >
                      Marcar como concluído
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>



      {/* MODAL ADICIONAR REFEIÇÃO */}
      <Dialog open={showAddMealModal} onClose={() => setShowAddMealModal(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="flex flex-col h-[80vh]">
                <div className="flex justify-between items-center p-4 border">
                  <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                    Adicionar Refeição Manual
                  </DialogTitle>
                  <button
                    onClick={() => setShowAddMealModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Fechar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Refeição</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={newMeal.name}
                        onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                        placeholder="Ex: Café da manhã saudável"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calorias (kcal)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={newMeal.calories}
                          onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                          placeholder="Ex: 350"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas (g)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={newMeal.protein}
                          onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                          placeholder="Ex: 20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Carboidratos (g)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={newMeal.carbohydrate}
                          onChange={(e) => setNewMeal({ ...newMeal, carbohydrate: e.target.value })}
                          placeholder="Ex: 45"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gorduras (g)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={newMeal.fat}
                          onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                          placeholder="Ex: 10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fibras (g)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={newMeal.fiber}
                          onChange={(e) => setNewMeal({ ...newMeal, fiber: e.target.value })}
                          placeholder="Ex: 5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border p-4 bg-gray-50">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddMealModal(false)}
                      className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddMeal}
                      disabled={!newMeal.name || !newMeal.calories}
                      className="inline-flex justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Adicionar Refeição
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}