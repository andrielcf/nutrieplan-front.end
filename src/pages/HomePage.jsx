// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function Home() {
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [caloriesConsumed, setCaloriesConsumed] = useState(0);
//   const [caloriesGoal, setCaloriesGoal] = useState(2000);
//   const [loading, setLoading] = useState(false);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [currentDayData, setCurrentDayData] = useState(null);
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
//           // Token inválido ou expirado
//           toast.error('Sessão expirada. Por favor, faça login novamente.', {
//             position: "top-center",
//             autoClose: 2000,
//           });
//           // localStorage.removeItem("token")
//           // Redirecionar para login
//           // navigate('/auth/login');
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
//   }, []);



//   // Manipula a seleção do dia
//   const handleDaySelect = (dayPt) => {
//     const today = new Date();
//     const currentDayIndex = today.getDay();
//     const selectedDayIndex = daysOfWeek.findIndex((day) => day.pt === dayPt);
//     const dayEn = daysOfWeek.find(day => day.pt === dayPt).en;

//     // Calcula a data do dia selecionado
//     let diff = selectedDayIndex - currentDayIndex;
//     const selectedDateObj = new Date(today);
//     selectedDateObj.setDate(today.getDate() + diff);

//     // Formata a data
//     const formattedDate = selectedDateObj.toLocaleDateString('pt-BR');

//     setSelectedDay(dayPt);
//     setSelectedDate(formattedDate);

//     // Encontra os dados do dia selecionado
//     const dayData = weeklyData.find(day => day.dayOfWeek === dayEn);
//     setCurrentDayData(dayData);

//     console.log("DIA DIA SELECIONADO: " + dayPt + " " + selectedDate)

//     // Calcula o total de calorias para o dia
//     if (dayData) {
//       const totalCalories = dayData.mealRecipes.reduce((sum, meal) => sum + meal.calories, 0);
//       setCaloriesConsumed(totalCalories);
//     } else {
//       setCaloriesConsumed(0);
//     }
//   };

//   // Calcula a porcentagem de progresso
//   const progressPercentage = Math.min(Math.round((caloriesConsumed / caloriesGoal) * 100), 100);
//   const isOverLimit = caloriesConsumed > caloriesGoal;

//   // Agrupa refeições por tipo
//   const groupMealsByType = () => {
//     if (!currentDayData) return {};

//     return currentDayData.mealRecipes.reduce((groups, meal) => {
//       const type = meal.mealType === "Breakfast" ? "Café da manhã" :
//         meal.mealType.includes("Lunch") ? "Almoço" : "Jantar";

//       if (!groups[type]) {
//         groups[type] = [];
//       }

//       groups[type].push(meal);
//       return groups;
//     }, {});
//   };

//   const mealsByType = groupMealsByType();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
//       <div className="max-w-3xl mx-auto">
//         {/* Cabeçalho */}
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800"></h1>
//           <Link
//             to="/auth/logout"
//             className="text-sm text-green-600 hover:text-green-800 transition-colors"
//           >
//             Sair
//           </Link>
//         </header>

//         {/* Contador de calorias circular */}
//         <div className="flex justify-center mb-8">
//           <div className="relative w-48 h-48">
//             <svg className="w-full h-full" viewBox="0 0 100 100">
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="45"
//                 fill="none"
//                 stroke="#e5e7eb"
//                 strokeWidth="8"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="45"
//                 fill="none"
//                 stroke={isOverLimit ? "#ef4444" : "#10b981"}
//                 strokeWidth="8"
//                 strokeLinecap="round"
//                 strokeDasharray={`${progressPercentage} 100`}
//                 transform="rotate(-90 50 50)"
//               />
//             </svg>
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <span className="text-3xl font-bold text-gray-800">
//                 {caloriesConsumed.toFixed(0)}
//               </span>
//               <span className="text-sm text-gray-500">
//                 / {caloriesGoal} kcal
//               </span>
//               {isOverLimit && (
//                 <span className="text-xs text-red-500 mt-1">Limite excedido!</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Dias da semana */}
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               {selectedDate || "Selecione um dia"}
//             </h2>
//             <div className="grid grid-cols-7 gap-2">
//               {daysOfWeek.map((day) => (
//                 <button
//                   key={day.pt}
//                   onClick={() => handleDaySelect(day.pt)}
//                   className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${selectedDay === day.pt
//                     ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                 >
//                   {day.pt.substring(0, 3)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Conteúdo do dia selecionado */}
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="p-6">
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <svg
//                   className="animate-spin h-8 w-8 text-green-500"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               </div>
//             ) : currentDayData ? (
//               <>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                   Refeições - {selectedDay}
//                 </h3>
//                 <div className="space-y-4">
//                   {Object.entries(mealsByType).map(([type, meals]) => (
//                     <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
//                       <div className="bg-gray-50 px-4 py-2">
//                         <h4 className="font-medium text-gray-800">{type}</h4>
//                       </div>
//                       <div className="divide-y divide-gray-200">
//                         {meals.map((meal) => (
//                           <div key={meal.id} className="p-4">
//                             <div className="flex items-start">
//                               {meal.imageUrl && (
//                                 <img
//                                   src={meal.imageUrl}
//                                   alt={meal.mealType}
//                                   className="w-16 h-16 rounded-md object-cover mr-4"
//                                 />
//                               )}
//                               <div className="flex-1">
//                                 <div className="flex justify-between">
//                                   <span className="font-medium text-gray-800">
//                                     {meal.calories.toFixed(0)} kcal
//                                   </span>
//                                 </div>
//                                 {meal.prepareInstructions && (
//                                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                                     {meal.prepareInstructions}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 Nenhum dado disponível para este dia
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function Home() {
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [caloriesConsumed, setCaloriesConsumed] = useState(0);
//   const [caloriesGoal, setCaloriesGoal] = useState(2000);
//   const [loading, setLoading] = useState(false);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [currentDayData, setCurrentDayData] = useState(null);
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
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
//           toast.error('Sessão expirada. Por favor, faça login novamente.', {
//             position: "top-center",
//             autoClose: 2000,
//           });
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
//   }, []);

//   // Manipula a seleção do dia
//   const handleDaySelect = (dayPt) => {
//     const today = new Date();
//     const currentDayIndex = today.getDay();
//     const selectedDayIndex = daysOfWeek.findIndex((day) => day.pt === dayPt);
//     const dayEn = daysOfWeek.find(day => day.pt === dayPt).en;

//     // Calcula a data do dia selecionado
//     let diff = selectedDayIndex - currentDayIndex;
//     const selectedDateObj = new Date(today);
//     selectedDateObj.setDate(today.getDate() + diff);

//     // Formata a data
//     const formattedDate = selectedDateObj.toLocaleDateString('pt-BR');

//     setSelectedDay(dayPt);
//     setSelectedDate(formattedDate);

//     // Encontra os dados do dia selecionado
//     const dayData = weeklyData.find(day => day.dayOfWeek === dayEn);
//     setCurrentDayData(dayData);

//     // Zerar contador de calorias
//     setCaloriesConsumed(0);
//   };

//   // Abrir modal com detalhes da refeição
//   const openMealModal = (meal) => {
//     setSelectedMeal(meal);
//     setIsModalOpen(true);
//   };

//   // Marcar refeição como concluída
//   const markAsCompleted = async (mealId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`http://localhost:8080/api/refeicao/concluir/${mealId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       toast.success('Refeição marcada como concluída!', {
//         position: "top-center",
//         autoClose: 1000,
//       });

//       // Fechar modal após conclusão
//       setIsModalOpen(false);

//       // Atualizar dados (opcional)
//       // const updatedData = ... lógica para atualizar o estado
//       // setCurrentDayData(updatedData);

//     } catch (error) {
//       toast.error('Erro ao marcar refeição como concluída', {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };

//   // Calcula a porcentagem de progresso (sempre 0 agora)
//   const progressPercentage = 0;
//   const isOverLimit = false;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
//       <div className="max-w-3xl mx-auto">
//         {/* Cabeçalho */}
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800"></h1>
//           <Link
//             to="/auth/logout"
//             className="text-sm text-green-600 hover:text-green-800 transition-colors"
//           >
//             Sair
//           </Link>
//         </header>

//         {/* Contador de calorias circular */}
//         <div className="flex justify-center mb-8">
//           <div className="relative w-48 h-48">
//             <svg className="w-full h-full" viewBox="0 0 100 100">
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="45"
//                 fill="none"
//                 stroke="#e5e7eb"
//                 strokeWidth="8"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="45"
//                 fill="none"
//                 stroke="#10b981"
//                 strokeWidth="8"
//                 strokeLinecap="round"
//                 strokeDasharray={`${progressPercentage} 100`}
//                 transform="rotate(-90 50 50)"
//               />
//             </svg>
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <span className="text-3xl font-bold text-gray-800">
//                 {caloriesConsumed.toFixed(0)}
//               </span>
//               <span className="text-sm text-gray-500">
//                 / {caloriesGoal} kcal
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Dias da semana */}
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               {selectedDate || "Selecione um dia"}
//             </h2>
//             <div className="grid grid-cols-7 gap-2">
//               {daysOfWeek.map((day) => (
//                 <button
//                   key={day.pt}
//                   onClick={() => handleDaySelect(day.pt)}
//                   className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${selectedDay === day.pt
//                     ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                 >
//                   {day.pt.substring(0, 3)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Conteúdo do dia selecionado */}
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="p-6">
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <svg
//                   className="animate-spin h-8 w-8 text-green-500"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               </div>
//             ) : currentDayData ? (
//               <>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                   Refeições - {selectedDay}
//                 </h3>
//                 <div className="space-y-4">
//                   {currentDayData.mealRecipes.map((meal) => (
//                     <button
//                       key={meal.id}
//                       onClick={() => openMealModal(meal)}
//                       className="w-full text-left border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="p-4 flex items-start">
//                         {meal.imageUrl && (
//                           <img
//                             src={meal.imageUrl}
//                             alt={meal.mealType}
//                             className="w-16 h-16 rounded-md object-cover mr-4"
//                           />
//                         )}
//                         <div className="flex-1">
//                           <div className="flex justify-between">
//                             <span className="font-medium text-gray-800">
//                               {meal.mealType === "Breakfast" ? "Café da manhã" :
//                                 meal.mealType.includes("Lunch") ? "Almoço" : "Jantar"} - {meal.calories.toFixed(0)} kcal
//                             </span>
//                           </div>
//                           {meal.prepareInstructions && (
//                             <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                               {meal.prepareInstructions}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 Nenhum dado disponível para este dia
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal de detalhes da refeição */}
//       {isModalOpen && selectedMeal && (
//         // <div className="fixed inset-0 bg-black bg-opacity-500 flex items-center justify-center p-4 z-50">
//         //   <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         //     <div className="p-6">
//         //       <div className="flex justify-between items-start mb-4">
//         //         <h3 className="text-xl font-bold text-gray-800">
//         //           {selectedMeal.mealType === "Breakfast" ? "Café da manhã" : 
//         //            selectedMeal.mealType.includes("Lunch") ? "Almoço" : "Jantar"}
//         //         </h3>
//         //         <button 
//         //           onClick={() => setIsModalOpen(false)}
//         //           className="text-gray-500 hover:text-gray-700"
//         //         >
//         //           ✕
//         //         </button>
//         //       </div>

//         //       {selectedMeal.imageUrl && (
//         //         <img
//         //           src={selectedMeal.imageUrl}
//         //           alt={selectedMeal.mealType}
//         //           className="w-full h-48 rounded-md object-cover mb-4"
//         //         />
//         //       )}

//         //       <div className="space-y-4">
//         //         <div>
//         //           <h4 className="font-semibold text-gray-800">Informações Nutricionais</h4>
//         //           <div className="grid grid-cols-2 gap-2 mt-2">
//         //             <div className="bg-gray-50 p-2 rounded">
//         //               <p className="text-sm text-gray-500">Calorias totais</p>
//         //               <p className="font-medium">{selectedMeal.calories.toFixed(0)} kcal</p>
//         //             </div>
//         //             <div className="bg-gray-50 p-2 rounded">
//         //               <p className="text-sm text-gray-500">Calorias por porção</p>
//         //               <p className="font-medium">{(selectedMeal.calories / selectedMeal.yield).toFixed(0)} kcal</p>
//         //             </div>
//         //             <div className="bg-gray-50 p-2 rounded">
//         //               <p className="text-sm text-gray-500">Proteínas</p>
//         //               <p className="font-medium">{selectedMeal.protein.toFixed(1)}g</p>
//         //             </div>
//         //             <div className="bg-gray-50 p-2 rounded">
//         //               <p className="text-sm text-gray-500">Carboidratos</p>
//         //               <p className="font-medium">{selectedMeal.carbohydrate.toFixed(1)}g</p>
//         //             </div>
//         //             <div className="bg-gray-50 p-2 rounded">
//         //               <p className="text-sm text-gray-500">Gorduras</p>
//         //               <p className="font-medium">{selectedMeal.fat.toFixed(1)}g</p>
//         //             </div>
//         //             <div className="bg-gray-50 p-2 rounded">
//         //               <p className="text-sm text-gray-500">Fibras</p>
//         //               <p className="font-medium">{selectedMeal.fiber.toFixed(1)}g</p>
//         //             </div>
//         //           </div>
//         //         </div>

//         //         {selectedMeal.prepareInstructions && (
//         //           <div>
//         //             <h4 className="font-semibold text-gray-800">Modo de Preparo</h4>
//         //             <p className="mt-2 text-gray-600 whitespace-pre-line">
//         //               {selectedMeal.prepareInstructions}
//         //             </p>
//         //           </div>
//         //         )}

//         //         {selectedMeal.urlRecipe && (
//         //           <div>
//         //             <h4 className="font-semibold text-gray-800">Receita Completa</h4>
//         //             <a 
//         //               href={selectedMeal.urlRecipe} 
//         //               target="_blank" 
//         //               rel="noopener noreferrer"
//         //               className="mt-2 inline-block text-green-600 hover:text-green-800"
//         //             >
//         //               Ver receita completa
//         //             </a>
//         //           </div>
//         //         )}

//         //         <button
//         //           onClick={() => markAsCompleted(selectedMeal.id)}
//         //           className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
//         //         >
//         //           Marcar como concluído
//         //         </button>
//         //       </div>
//         //     </div>
//         //   </div>
//         // </div>
//         <Dialog open={open} handler={handleOpen}>
//           <DialogHeader>Long Modal</DialogHeader>
//           <DialogBody className="h-[42rem] overflow-scroll">
//             <Typography className="font-normal">
//               I&apos;ve always had unwavering confidence in my abilities, and I
//               believe our thoughts and self-perception are the primary forces that
//               shape us. Many people limit themselves by their own self-doubt,
//               slowing their progress. Fortunately, I was raised with the belief
//               that I could achieve anything.
//               <br />
//               <br />
//               As we journey through life, we often encounter challenges that
//               harden our hearts. Pain, insults, broken trust, and betrayal can
//               make us hesitant to help others. Love can lead to heartbreak, and
//               time can distance us from family. These experiences can gradually
//               erode our optimism.
//               <br /> <br />
//               Life doesn&apos;t always place us where we want to be. We grow, make
//               mistakes, and strive to express ourselves and fulfill our dreams. If
//               we&apos;re fortunate enough to participate in life&apos;s journey,
//               we should cherish every moment. Regrettably, some only recognize the
//               value of a moment after it&apos;s passed.
//               <br /> <br />
//               One thing I&apos;ve learned is that I can excel at anything I set my
//               mind to. My skill is my ability to learn. I&apos;m here to learn, to
//               grow, and to inspire others to do the same. Don&apos;t fear making
//               mistakes; they teach us far more than compliments ever will.
//               Ultimately, what truly matters is how our actions inspire and
//               motivate others. Some will be ignited by our endeavors, while others
//               may be offended—it&apos;s all part of the process. I'm here to
//               pursue my dreams and encourage others to do the same.
//               <br /> <br />
//               Now is the time to embrace greatness without fear of judgment. Some
//               may resent those who shine brightly or stand out, but it&apos;s time
//               to be the best version of ourselves. Do you have faith in your
//               beliefs, even if you&apos;re the only one who does?
//             </Typography>
//           </DialogBody>
//           <DialogFooter className="space-x-2">
//             <Button variant="text" color="blue-gray" onClick={handleOpen}>
//               cancel
//             </Button>
//             <Button variant="gradient" color="green" onClick={handleOpen}>
//               confirm
//             </Button>
//           </DialogFooter>
//         </Dialog>
//       )}
//     </div>
//   );
// }

///////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

export default function Home() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get("http://localhost:8080/api/dia/full", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setWeeklyData(response.data);

        const today = new Date();
        const dayIndex = today.getDay();
        handleDaySelect(daysOfWeek[dayIndex].pt);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error('Sessão expirada. Por favor, faça login novamente.', {
            position: "top-center",
            autoClose: 2000,
          });
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
  }, []);

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

  // Abrir modal com detalhes da refeição
  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);
    setOpenModal(true);
  };

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
      <Dialog open={openModal} handler={() => setOpenModal(false)}>
        <DialogHeader>Long Modal</DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <Typography className="font-normal">
            I&apos;ve always had unwavering confidence in my abilities, and I
            believe our thoughts and self-perception are the primary forces that
            shape us. Many people limit themselves by their own self-doubt,
            slowing their progress. Fortunately, I was raised with the belief
            that I could achieve anything.
            <br />
            <br />
            As we journey through life, we often encounter challenges that
            harden our hearts. Pain, insults, broken trust, and betrayal can
            make us hesitant to help others. Love can lead to heartbreak, and
            time can distance us from family. These experiences can gradually
            erode our optimism.
            <br /> <br />
            Life doesn&apos;t always place us where we want to be. We grow, make
            mistakes, and strive to express ourselves and fulfill our dreams. If
            we&apos;re fortunate enough to participate in life&apos;s journey,
            we should cherish every moment. Regrettably, some only recognize the
            value of a moment after it&apos;s passed.
            <br /> <br />
            One thing I&apos;ve learned is that I can excel at anything I set my
            mind to. My skill is my ability to learn. I&apos;m here to learn, to
            grow, and to inspire others to do the same. Don&apos;t fear making
            mistakes; they teach us far more than compliments ever will.
            Ultimately, what truly matters is how our actions inspire and
            motivate others. Some will be ignited by our endeavors, while others
            may be offended—it&apos;s all part of the process. I'm here to
            pursue my dreams and encourage others to do the same.
            <br /> <br />
            Now is the time to embrace greatness without fear of judgment. Some
            may resent those who shine brightly or stand out, but it&apos;s time
            to be the best version of ourselves. Do you have faith in your
            beliefs, even if you&apos;re the only one who does?
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            confirm
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal de detalhes da refeição usando Material Tailwind */}
      {/* <Dialog open={openModal} handler={() => setOpenModal(false)} size="lg">
        <DialogHeader>{selectedMeal ? translateMealType(selectedMeal.mealType) : ''}</DialogHeader>
        <DialogBody className="h-[40rem] overflow-scroll">
          {selectedMeal && (
            <div className="space-y-6">
              {selectedMeal.imageUrl && (
                <img
                  src={selectedMeal.imageUrl}
                  alt={selectedMeal.mealType}
                  className="w-full h-48 rounded-md object-cover mb-4"
                />
              )}

              <div>
                <Typography variant="h5" className="mb-2">Informações Nutricionais</Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Typography variant="small" color="gray">Calorias totais</Typography>
                    <Typography variant="paragraph">{selectedMeal.calories.toFixed(0)} kcal</Typography>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Typography variant="small" color="gray">Calorias por porção</Typography>
                    <Typography variant="paragraph">{(selectedMeal.calories / selectedMeal.yield).toFixed(0)} kcal</Typography>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Typography variant="small" color="gray">Proteínas</Typography>
                    <Typography variant="paragraph">{selectedMeal.protein.toFixed(1)}g</Typography>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Typography variant="small" color="gray">Carboidratos</Typography>
                    <Typography variant="paragraph">{selectedMeal.carbohydrate.toFixed(1)}g</Typography>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Typography variant="small" color="gray">Gorduras</Typography>
                    <Typography variant="paragraph">{selectedMeal.fat.toFixed(1)}g</Typography>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Typography variant="small" color="gray">Fibras</Typography>
                    <Typography variant="paragraph">{selectedMeal.fiber.toFixed(1)}g</Typography>
                  </div>
                </div>
              </div>

              {selectedMeal.prepareInstructions && (
                <div>
                  <Typography variant="h5" className="mb-2">Modo de Preparo</Typography>
                  <Typography className="whitespace-pre-line">
                    {selectedMeal.prepareInstructions}
                  </Typography>
                </div>
              )}

              {selectedMeal.urlRecipe && (
                <div>
                  <Typography variant="h5" className="mb-2">Receita Completa</Typography>
                  <a
                    href={selectedMeal.urlRecipe}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Typography>Clique aqui para ver a receita completa</Typography>
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenModal(false)}
            className="mr-2"
          >
            <span>Fechar</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => selectedMeal && markAsCompleted(selectedMeal.id)}
          >
            <span>Marcar como concluído</span>
          </Button>
        </DialogFooter>
      </Dialog> */}
    </div>
  );
}