import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { mockRecipes } from "./mockRecipes";
import { Radio, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function MealRecipe() {
    const [mealType, setMealType] = useState("");
    const [userPreferences, setUserPreferences] = useState({
        dietLabels: [],
        healthLabels: [],
        mealCalories: {
            breakfast: 0,
            lunch: 0,
            dinner: 0
        }
    });
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [consumeYield, setConsumeYield] = useState(1);
    const [savedMeals, setSavedMeals] = useState([]);
    const [selectedSavedMeal, setSelectedSavedMeal] = useState(null);
    const getWeekDayName = (index) => {
        const days = [
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado",
            "Domingo"
        ];
        return days[index] || `Dia ${index + 1}`;
    };

    const replaceMeal = async () => {
        if (!selectedRecipe || !selectedSavedMeal) {
            toast.warning("Selecione uma receita e uma refeição salva para substituir");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const recipe = selectedRecipe.recipe;

            const mealData = {
                mealType: mealType,
                uriEdamam: recipe.uri,
                imageUrl: recipe.image,
                urlRecipe: recipe.url,
                calories: recipe.calories,
                carbohydrate: getNutrientValue(recipe.totalNutrients, 'CHOCDF'),
                protein: getNutrientValue(recipe.totalNutrients, 'PROCNT'),
                fat: getNutrientValue(recipe.totalNutrients, 'FAT'),
                fiber: getNutrientValue(recipe.totalNutrients, 'FIBTG'),
                yield: recipe.yield,
                prepareInstructions: recipe.ingredientLines.join('\n')
            };

            await axios.put(
                `http://localhost:8080/api/mealrecipe/replace-meal/${selectedSavedMeal.id}`,
                mealData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Refeição substituída com sucesso!");
            setOpenModal(false);
            fetchUserMeals(mealType);
        } catch (error) {
            toast.error("Erro ao substituir refeição");
            console.error("Error replacing meal:", error);
        }
    };

    const fetchUserMeals = async (type) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/mealrecipe/meals/${type.toLowerCase()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSavedMeals(response.data);
            setSelectedSavedMeal(null);
        } catch (error) {
            console.error("Error fetching saved meals:", error);
        }
    };

    const calculateMealKcal = (total) => ({
        breakfast: Math.round(total * 0.20),
        lunch: Math.round(total * 0.38),
        dinner: Math.round(total * 0.42),
    });

    useEffect(() => {
        const fetchUserPreferences = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/meal-details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const mealCalories = calculateMealKcal(response.data.tdee);

                const dietLabels = typeof response.data.dietLabels === 'string'
                    ? [response.data.dietLabels]
                    : response.data.dietLabels || [];

                setUserPreferences({
                    dietLabels: dietLabels,
                    healthLabels: response.data.healthLabels || [],
                    mealCalories: mealCalories
                });

            } catch (err) {
                toast.error("Erro ao carregar preferências");
                console.error(err);
            }
        };

        fetchUserPreferences();
    }, []);

    const dietLabelMap = {
        "balanced": "balanced",
        "high-protein": "high-protein",
        "low-fat": "low-fat",
        "low-carb": "low-carb"
    };

    const healthLabelMap = {
        "vegan": "vegan",
        "vegetarian": "vegetarian",
        "gluten-free": "gluten-free",
        "dairy-free": "dairy-free"
    };

    const searchRecipes = async () => {
        if (!mealType) {
            toast.warning("Selecione um tipo de refeição");
            return;
        }

        setLoading(true);
        try {

            const calories = userPreferences.mealCalories[mealType.toLowerCase()];
            const formattedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase();

            const baseUrl = "https://api.edamam.com/api/recipes/v2";
            const fixedParams = "type=public&field=uri&field=image&field=url&field=yield&field=ingredientLines&field=calories&field=mealType&field=totalNutrients&app_id=1a407993&app_key=65891f3120111bb86c8f0c37bcdb74b4";

            const dietParam = userPreferences.dietLabels.length > 0
                ? `&diet=${userPreferences.dietLabels.map(diet => dietLabelMap[diet]).join(',')}`
                : '';

            const healthParams = userPreferences.healthLabels.length > 0
                ? userPreferences.healthLabels.map(health => `&health=${healthLabelMap[health]}`).join('')
                : '';

            const fullUrl = `${baseUrl}?${fixedParams}${dietParam}${healthParams}&mealType=${formattedMealType}&calories=${Math.round(calories)}`;

            const response = await axios.get(fullUrl, {
                headers: {
                    "accept": "application/json",
                    "Accept-Language": "en",
                    "Edamam-Account-User": "1a407993"
                }
            });

            // console.log(mockRecipes);

            setRecipes(response.data.hits || []);
            await fetchUserMeals(mealType);
            // setRecipes(mockRecipes);
        } catch (error) {
            toast.error("Erro ao buscar receitas");
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    const openRecipeModal = (recipe) => {
        setSelectedRecipe(recipe);
        setConsumeYield(recipe.recipe.yield || 1);
        setOpenModal(true);
    };

    const translateMealType = (mealType) => {
        const types = {
            "breakfast": "Café da Manhã",
            "lunch": "Almoço",
            "dinner": "Jantar"
        };
        return types[mealType] || mealType;
    };

    const getNutrientValue = (nutrients, nutrientKey) => {
        return nutrients[nutrientKey]?.quantity || 0;
    };

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const translateLabels = (label) => {
        const dietTranslations = {
            "balanced": "Balanceado",
            "high-protein": "Mais Proteico",
            "low-fat": "Baixo em Gordura",
            "low-carb": "Baixo em Carboidratos"
        };

        const healthTranslations = {
            "vegan": "Vegano(a)",
            "vegetarian": "Vegetariano(a)",
            "gluten-free": "Sem glúten",
            "dairy-free": "Sem lactose"
        };

        // Verifica primeiro nos rótulos de dieta
        if (dietTranslations[label.toLowerCase()]) {
            return dietTranslations[label.toLowerCase()];
        }

        // Depois verifica nos rótulos de saúde
        if (healthTranslations[label.toLowerCase()]) {
            return healthTranslations[label.toLowerCase()];
        }

        // Se não encontrar tradução, retorna o original
        return label;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 animate-fadeIn">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Buscar Receitas</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
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
                                                            onClick={() => {
                                                                setOpen(false);
                                                                navigate("/");
                                                            }}
                                                            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            Página de Refeições
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

                </div>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Refeição
                        </label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        >
                            <option value="">Selecione</option>
                            <option value="Breakfast">Café da Manhã ({userPreferences.mealCalories.breakfast} kcal)</option>
                            <option value="Lunch">Almoço ({userPreferences.mealCalories.lunch} kcal)</option>
                            <option value="Dinner">Jantar ({userPreferences.mealCalories.dinner} kcal)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferências do Usuário
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            {/* <p className="text-gray-600">
                                <span className="font-medium">Dieta:</span>{" "}
                                {userPreferences.dietLabels.length > 0
                                    ? userPreferences.dietLabels.join(", ")
                                    : "Nenhuma preferência"}
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-medium">Restrições:</span>{" "}
                                {userPreferences.healthLabels.length > 0
                                    ? userPreferences.healthLabels.join(", ")
                                    : "Nenhuma restrição"}
                            </p> */}
                            <p className="text-gray-600">
                                <span className="font-medium">Tipo de Cardápio:</span>{" "}
                                {userPreferences.dietLabels.length > 0
                                    ? userPreferences.dietLabels.map(label => translateLabels(label)).join(", ")
                                    : "Nenhuma preferência"}
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-medium">Restrições:</span>{" "}
                                {userPreferences.healthLabels.length > 0
                                    ? userPreferences.healthLabels.map(label => translateLabels(label)).join(", ")
                                    : "Nenhuma restrição"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={searchRecipes}
                        disabled={loading || !mealType}
                        className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${!loading && mealType
                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Buscando..." : "Buscar Receitas"}
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selecione um dia da semana:
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        {savedMeals.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {savedMeals.map((meal, index) => (
                                    <div key={meal.id} className="border rounded-lg p-3">
                                        <Radio
                                            name="savedMeals"
                                            color="green"
                                            label={
                                                <div className="">
                                                    <Typography color="blue-gray" className="font-medium p-0">
                                                        {getWeekDayName(index)}
                                                    </Typography>
                                                </div>
                                            }
                                            checked={selectedSavedMeal?.id === meal.id}
                                            onChange={() => {
                                                setSelectedSavedMeal(meal);
                                            }}
                                            containerProps={{
                                                className: "-mt-5",
                                            }}
                                        />

                                        {selectedSavedMeal?.id === meal.id && (
                                            <div className="mt-3">
                                                <div className="grid gap-4">
                                                    <div className="flex justify-center items-center">
                                                        <h6>{((meal.calories / meal.yield) * meal.consumeYield).toFixed()} Kcal - por refeição</h6>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <small className="text-muted">Calorias</small>
                                                        <p>{(meal.calories).toFixed(0)} kcal</p>
                                                        <p>{((meal.calories / meal.yield) * meal.consumeYield).toFixed()} Kcal</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <small className="text-muted">Calorias por porção (refeição)</small>
                                                        <p>{(meal.calories / meal.yield).toFixed(0)} kcal</p>
                                                        <p>{meal.yield.toFixed(0)} - Porções</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <small className="text-muted">Proteínas</small>
                                                        <p>{meal.protein.toFixed(1)}g</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <small className="text-muted">Carboidratos</small>
                                                        <p>{meal.carbohydrate.toFixed(1)}g</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <small className="text-muted">Gorduras</small>
                                                        <p>{meal.fat.toFixed(1)}g</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <small className="text-muted">Fibras</small>
                                                        <p>{meal.fiber.toFixed(1)}g</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Typography variant="small" color="gray" className="font-normal">
                                Nenhuma refeição salva encontrada.
                            </Typography>
                        )}
                    </div>
                </div>


                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {recipes.length > 0 ? (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Resultados ({recipes.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recipes.map((hit, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => openRecipeModal(hit)}
                                        >
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={hit.recipe.image}
                                                    alt={hit.recipe.label}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                                                    {hit.recipe.label}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {hit.recipe.calories.toFixed(0)} calorias
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {hit.recipe.mealType && hit.recipe.mealType[0] ?
                                                        translateMealType(hit.recipe.mealType[0].toLowerCase()) :
                                                        "Refeição"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                {mealType
                                    ? "Nenhuma receita encontrada. Tente ajustar seus filtros."
                                    : "Selecione um tipo de refeição para buscar receitas."}
                            </div>
                        )}
                    </div>
                )}

                {/* Recipe Modal */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)} className="relative z-50">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                            >
                                <div className="flex flex-col h-[80vh]">
                                    <div className="flex justify-between items-center p-4 border">
                                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                                            {selectedRecipe?.recipe.label}
                                        </DialogTitle>
                                        <button
                                            onClick={() => setOpenModal(false)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="sr-only">Fechar</span>
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>


                                    <div className="flex-1 overflow-y-auto p-4">
                                        {selectedRecipe && (
                                            <div className="space-y-6">
                                                <div className="flex justify-center mb-4">
                                                    <img
                                                        src={selectedRecipe.recipe.image}
                                                        alt={selectedRecipe.recipe.label}
                                                        className="h-40 rounded-md object-cover"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="grid gap-4">
                                                        <h5 className="mb-2">Informações Nutricionais</h5>
                                                        <div className="flex justify-between items-center">
                                                            <h6>Porções: {selectedRecipe.recipe.yield}</h6>
                                                            <h6>Calorias totais: {selectedRecipe.recipe.calories.toFixed(0)} kcal</h6>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <small className="text-muted">Proteínas</small>
                                                            <p>{getNutrientValue(selectedRecipe.recipe.totalNutrients, 'PROCNT').toFixed(1)}g</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <small className="text-muted">Carboidratos</small>
                                                            <p>{getNutrientValue(selectedRecipe.recipe.totalNutrients, 'CHOCDF').toFixed(1)}g</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <small className="text-muted">Gorduras</small>
                                                            <p>{getNutrientValue(selectedRecipe.recipe.totalNutrients, 'FAT').toFixed(1)}g</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <small className="text-muted">Fibras</small>
                                                            <p>{getNutrientValue(selectedRecipe.recipe.totalNutrients, 'FIBTG').toFixed(1)}g</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div>
                                                    <h4 className="font-medium mb-2">Ingredientes:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {selectedRecipe.recipe.ingredientLines.map((ingredient, i) => (
                                                            <li key={i}>{ingredient}</li>
                                                        ))}
                                                    </ul>
                                                </div> */}

                                                {selectedRecipe.recipe.url && (
                                                    <div>
                                                        <h5 className="mb-2">Receita Completa</h5>
                                                        <a
                                                            href={selectedRecipe.recipe.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            Clique aqui para ver a receita completa
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
                                            {selectedSavedMeal && (
                                                <button
                                                    type="button"
                                                    onClick={replaceMeal}
                                                    className="inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                                                >
                                                    Substituir
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}