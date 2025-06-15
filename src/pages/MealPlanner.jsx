import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

// Tradução para os pratos selecionados
const DISH_TRANSLATIONS = {
    // Breakfast
    "drinks": "Bebidas",
    "egg": "Ovos",
    "pancake": "Panquecas",
    "pastry": "Bolos e Tortas",
    "pies and tarts": "Tortas Doces",
    "sandwiches": "Sanduíches",
    "cereals": "Cereais",
    "ice cream and custard": "Sorvetes e Cremes",
    "pizza": "Pizza",

    // Lunch/Dinner
    "main course": "Prato Principal",
    "pasta": "Massas",
    "salad": "Saladas",
    "seafood": "Frutos do Mar",
    "side dish": "Acompanhamentos",
    "soup": "Sopas",
    "starter": "Entradas",
    "biscuits and cookies": "Biscoitos e Cookies",
    "bread": "Pães",
    "desserts": "Sobremesas"
};

// Arrays de pratos para cada refeição
const BREAKFAST_DISHES = [
    "drinks", "egg", "pancake", "pastry", "pies and tarts",
    "sandwiches", "cereals", "ice cream and custard", "pizza"
];

const LUNCH_DISHES = [
    "main course", "egg", "pasta", "pizza", "salad",
    "sandwiches", "seafood", "side dish", "soup",
    "starter", "biscuits and cookies", "bread",
    "cereals", "drinks", "pancake"
];

const DINNER_DISHES = [
    "main course", "egg", "pasta", "pizza", "salad",
    "sandwiches", "seafood", "soup", "drinks",
    "cereals", "desserts", "bread"
];



export default function MealPlanner() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    // Estado para pratos selecionados
    const [selectedDishes, setSelectedDishes] = useState({
        breakfast: [],
        lunch: [],
        dinner: []
    });

    const [userData, setUserData] = useState({
        dietLabels: "",
        healthLabels: []
    });

    // Função para calcular as calorias por refeição baseada no total
    const calculateMealKcal = (total) => ({
        breakfast: Math.round(total * 0.20), // 20%
        lunch: Math.round(total * 0.38),    // 38%
        dinner: Math.round(total * 0.42),   // 42%
        total: total                        // Mantém o total original
    });

    // Estado para limites de calorias
    const [maxKcal, setMaxKcal] = useState({
        breakfast: 600,
        lunch: 900,
        dinner: 900,
        total: 2000
    });

    // Estado para o modal
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/meal-details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData({
                    dietLabels: response.data.dietLabels,
                    healthLabels: response.data.healthLabels
                });
                // Atualiza TODOS os valores (total + refeições) com base no TDEE
                const newTotal = response.data.tdee;
                setMaxKcal(calculateMealKcal(newTotal));
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                toast.error("Erro ao carregar preferências do usuário");
                localStorage.removeIteme("token");
                useNavigate("/")

            }
        };

        fetchUserData();
    }, []);

    // Alternar seleção de prato
    const toggleDish = (meal, dish) => {
        setSelectedDishes(prev => {
            const newSelection = [...prev[meal]];
            const index = newSelection.indexOf(dish);

            if (index === -1) {
                newSelection.push(dish);
            } else {
                newSelection.splice(index, 1);
            }

            return {
                ...prev,
                [meal]: newSelection
            };
        });
    };

    const generateMealPlan = async () => {
        const requestData = {
            size: 7,
            plan: {
                accept: {
                    all: [
                        {
                            health: userData.healthLabels
                        },
                        {
                            diet: [userData.dietLabels]
                        }
                    ]
                },
                fit: {
                    ENERC_KCAL: {
                        min: 1000,
                        max: maxKcal.total
                    }
                },
                sections: {
                    Breakfast: {
                        accept: {
                            all: [
                                { dish: selectedDishes.breakfast },
                                { meal: ["breakfast"] }
                            ]
                        },
                        fit: {
                            ENERC_KCAL: {
                                min: 100,
                                max: maxKcal.breakfast
                            }
                        }
                    },
                    Lunch: {
                        accept: {
                            all: [
                                { dish: selectedDishes.lunch },
                                { meal: ["lunch/dinner"] }
                            ]
                        },
                        fit: {
                            ENERC_KCAL: {
                                min: 300,
                                max: maxKcal.lunch
                            }
                        }
                    },
                    Dinner: {
                        accept: {
                            all: [
                                { dish: selectedDishes.dinner },
                                { meal: ["lunch/dinner"] }
                            ]
                        },
                        fit: {
                            ENERC_KCAL: {
                                min: 200,
                                max: maxKcal.dinner
                            }
                        }
                    }
                }
            }
        };

        try {
            const response = await axios.post(
                'https://api.edamam.com/api/meal-planner/v1/1a407993/select?type=public',
                requestData,
                {
                    headers: {
                        'accept': 'application/json',
                        'Edamam-Account-User': '1a407993',
                        'Authorization': 'Basic MWE0MDc5OTM6NjU4OTFmMzEyMDExMWJiODZjOGYwYzM3YmNkYjc0YjQ=',
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success("Plano alimentar criado com sucesso!");
            console.log(response.data);
            return response.data;
        } catch (error) {
            toast.error("Erro ao criar plano alimentar");
            console.error(error);
        }
    };

    function extractAllRecipeUris(apiResponse) {
        // Verifica se a resposta é válida
        if (!apiResponse?.selection || !Array.isArray(apiResponse.selection)) {
            console.error("Formato de resposta inválido");
            return [];
        }

        // Extrai todos os links assigned em uma lista única
        const allRecipes = apiResponse.selection.flatMap(day =>
            Object.values(day.sections || {})
                .map(section => section?.assigned)
                .filter(link => link) // Remove valores undefined/null
        ).slice(0, -1);

        return allRecipes;
    }

    const fetchRecipesByUris = async (uris) => {
        try {
            // Configurações da API
            const app_id = '1a407993';
            const app_key = '65891f3120111bb86c8f0c37bcdb74b4';
            const fields = ['uri', 'image', 'url', 'yield', 'ingredientLines', 'calories', 'mealType', 'totalNutrients'];

            // Preparar os parâmetros da URL
            const params = new URLSearchParams();
            uris.forEach(uri => params.append('uri', uri));
            fields.forEach(field => params.append('field', field));
            params.append('app_id', app_id);
            params.append('app_key', app_key);

            // Configurar os headers
            const headers = {
                'accept': 'application/json',
                'Accept-Language': 'en',
                'Edamam-Account-User': app_id
            };

            // Fazer a requisição
            const response = await axios.get('https://api.edamam.com/api/recipes/v2/by-uri', {
                params,
                headers
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }

    };

    const buildMealPlanToBackend = async (recipesFromEdamam) => {
        // Dias da semana para associar cada receita (exemplo simples com dias fixos)
        const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

        // Inicializa estrutura de planos com os dias da semana
        const mealPlan = daysOfWeek.map((day) => ({
            dayOfWeek: day,
            meals: []
        }));

        // Percorre cada receita recebida
        const meals = recipesFromEdamam.hits.map(hit => {
            const recipe = hit.recipe;
            const mealType = recipe.mealType?.[0] || "Breakfast";
            return {
                mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
                uriEdamam: recipe.uri,
                imageUrl: recipe.image,
                urlRecipe: recipe.url,
                calories: recipe.calories || 0,
                carbohydrate: recipe.totalNutrients?.CHOCDF?.quantity || 0,
                protein: recipe.totalNutrients?.PROCNT?.quantity || 0,
                fat: recipe.totalNutrients?.FAT?.quantity || 0,
                fiber: recipe.totalNutrients?.FIBTG?.quantity || 0,
                yield: recipe.yield || 1,
                prepareInstructions: recipe.ingredientLines?.join(', ') || "Sem instruções"
            };
        });

        if (meals.length === 20) {
            meals.push({ ...meals[0] });
        }

        meals.forEach((meal, index) => {
            const dayIndex = Math.floor(index / 3); // 3 refeições por dia
            if (mealPlan[dayIndex]) {
                mealPlan[dayIndex].meals.push(meal);
            }
        });

        // Monta objeto final
        const finalPayload = { plans: mealPlan };
        return finalPayload;
    };

    const mealPlanRebuild = async () => {

        const responseMealPlan = await generateMealPlan();

        const recipeAssigned = extractAllRecipeUris(responseMealPlan);

        console.log(recipeAssigned);

        // const recipeAssigned = [
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_80200296eb3af55c3a08fd09c8710cd0",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_6bf44027942545541b7fb8f565f130f5",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_d373695b2d1a40c65fabe7930755b0d8",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_9d09ffea7480bce5b0e4d0c305a4f5e6",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_78d57924ef48134f4ac88877e79053d2",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_b2649024a34b27ce3e77845fa2af3424",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_6a92cc63077ec190526c632a413b77fa",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_c1f34241eb7f5a259113826b8c381fec",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_ec45bac5ebcecf36b5c8e266da8106e4",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_9f1d790b1cc4f2e1eebb950aa6eff2d9",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_56cf0e8dedaf0fc62e1cd536079e55f2",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_3c87f828f5e8a136aba78f9bc9be0f45",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_9da4bf3d8b18b7c6922fb57efa88194c",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_a8a6e73a90c38b91acaf20d1dfc4ccbd",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_2394691ec4c57d8cc702434b21f2c53e",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_1b09ae2e75a044da0b7190e9f656ab67",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_9864f832fd3b22da4d762d74bd1d1b89",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_d5f70e771ec94687a6d2a39044d13c5f",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_086349dac01db4595cd8c766ed3996ab",
        //   "http://www.edamam.com/ontologies/edamam.owl#recipe_8aedcec23c88395ce731940bb51b8ed2"
        // ]

        const responseURIs = await fetchRecipesByUris(recipeAssigned);

        const formatMeal = await buildMealPlanToBackend(responseURIs);

        console.log(formatMeal);
        return formatMeal;
    }

    const handleSubmit = async (formatMeal) => {
        setLoading(true)
        setError("")

        try {

            // Chamada para a API de registro
            const response = await axios.post("http://localhost:8080/api/daily/rebuild", formatMeal);

            // Se o registro for bem-sucedido
            // console.log("Registro bem-sucedido:", response.data)
        } catch (err) {
            // console.error("Erro no registro:", err)
            console.log(err)
            setError(err.response?.data?.message || "Erro ao criar conta. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }


    // Componente para renderizar os pratos de uma refeição
    const renderMealSection = (meal, dishes) => (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 capitalize text-gray-800">{meal === 'breakfast' ? 'Café da Manhã' : meal === 'lunch' ? 'Almoço' : 'Jantar'}</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Calorias máximas:</label>
                <input
                    type="number"
                    value={maxKcal[meal]}
                    onChange={(e) => setMaxKcal(prev => ({
                        ...prev,
                        [meal]: parseInt(e.target.value) || 0
                    }))}
                    className="border border-gray-300 p-2 rounded-lg w-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                {dishes.map(dish => (
                    <button
                        key={dish}
                        onClick={() => toggleDish(meal, dish)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${selectedDishes[meal].includes(dish)
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        title={dish} // Mostra o nome original como tooltip
                    >
                        {DISH_TRANSLATIONS[dish] || dish} {/* Mostra a tradução ou o original se não houver tradução */}
                    </button>
                ))}
            </div>

            {selectedDishes[meal].length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700 mb-2">Pratos selecionados:</p>
                    <p className="text-gray-600">
                        {selectedDishes[meal].map(dish => DISH_TRANSLATIONS[dish] || dish).join(", ")}
                    </p>
                </div>
            )}
        </div>
    );


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 animate-fadeIn">
            {/* Modal de Menu */}
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
                                                    onClick={() => setOpen(false)}
                                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Voltar para Home
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
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Criar Plano Alimentar</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Controle de calorias totais */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Configurações Gerais</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Calorias totais máximas por dia:</label>
                        <span className="border border-gray-300 p-2 rounded-lg w-32 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            {maxKcal.total}
                        </span>
                    </div>
                </div>

                {/* Seções de refeições */}
                {renderMealSection('breakfast', BREAKFAST_DISHES)}
                {renderMealSection('lunch', LUNCH_DISHES)}
                {renderMealSection('dinner', DINNER_DISHES)}

                {/* Botão de enviar */}
                <button
                    onClick={mealPlanRebuild}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg font-bold"
                >
                    Criar Plano Alimentar
                </button>
            </div>
        </div>
    );
}
