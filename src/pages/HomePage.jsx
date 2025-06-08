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
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [consumedMeals, setConsumedMeals] = useState([]);
  const [tdee, setTdee] = useState(2000);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrate: '',
    fat: '',
    fiber: ''
  });
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
        name: translateMealType(newMeal.name),
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
                <div className="d-flex justify-content-center mb-4">
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
                  <div className="flex justify-between">
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
                    {/* <p>{(selectedMeal.calories / selectedMeal.yield).toFixed(0)} kcal</p> */}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOpenModal(false)}
            className="mr-2 color: bg-red-500"
          >
            Fechar
          </Button>
          <Button className="color: bg-green-400"
            variant="success"
            onClick={() => selectedMeal && markAsCompleted(selectedMeal)}
          >
            Marcar como concluído
          </Button>
        </Modal.Footer>
      </Modal>



      {/* MODAL ADICIONAR REFEIÇÃO */}
      <Modal show={showAddMealModal} onHide={() => setShowAddMealModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Refeição Manual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant=""
            onClick={() => setShowAddMealModal(false)}
            className="mr-2 bg-red-500"
          >
            Cancelar
          </Button>
          <Button
            variant=""
            onClick={handleAddMeal}
            disabled={!newMeal.name || !newMeal.calories}
            className="mr-2 bg-green-500"
          >
            Adicionar Refeição
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}