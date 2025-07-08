import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { mockRecipes } from "./mockRecipes";
import { Radio, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";


const activityLevels = [
    { id: 1, name: "Sedentário (pouco ou nenhum exercício)", factor: 1.2 },
    { id: 2, name: "Levemente ativo (exercício leve 1-3 dias/semana)", factor: 1.375 },
    { id: 3, name: "Moderadamente ativo (exercício 3-5 vezes/semana)", factor: 1.55 },
    { id: 4, name: "Muito ativo (exercício 6-7 dias/semana)", factor: 1.725 },
    { id: 5, name: "Extremamente ativo (exercício intenso diário ou trabalho físico)", factor: 1.9 }
];

const dietLabels = [
    { id: 1, consultDietLabel: "balanced", name: "Balanceado" },
    { id: 2, consultDietLabel: "high-protein", name: "Mais Proteico" },
    { id: 3, consultDietLabel: "high-protein", name: "Baixo em Gordura" },
    { id: 4, consultDietLabel: "low-carb", name: "Baixo em Carboidrato" }
];

const healthLabels = [
    { id: 1, consultHealthLabel: "vegan", name: "Vegana" },
    { id: 2, consultHealthLabel: "vegetarian", name: "Vegetariana" },
    { id: 3, consultHealthLabel: "gluten-free", name: "Sem glúten" },
    { id: 4, consultHealthLabel: "dairy-free", name: "Sem lactose" }
];

export default function UserConfiguration() {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        weight: "",
        height: "",
        age: "",
        gender: "",
        activityLevelId: "",
        dietLabelId: "",
        healthLabelsIds: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            await axios.delete('http://localhost:8080/api/user/delete-user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('Conta excluída com sucesso!');
            localStorage.removeItem("token");
            navigate("/");
        } catch (err) {
            toast.error('Erro ao excluir conta');
            console.error('Erro:', err);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token não encontrado');
                }

                const response = await axios.get('http://localhost:8080/api/user/consult-userprofile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUserData(response.data);
                setFormData({
                    name: response.data.name,
                    weight: response.data.weight,
                    height: response.data.height,
                    age: response.data.age,
                    gender: response.data.gender,
                    activityLevelId: response.data.activityLevel?.id,
                    dietLabelId: response.data.dietLabel?.id,
                    healthLabelsIds: response.data.healthLabels?.map(label => label.id) || []
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error('Erro ao carregar perfil do usuário');
                console.error('Erro:', err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (id) => {
        setFormData(prev => {
            const currentIds = prev.healthLabelsIds || [];
            const newIds = currentIds.includes(id)
                ? currentIds.filter(item => item !== id)
                : [...currentIds, id];

            return {
                ...prev,
                healthLabelsIds: newIds
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            await axios.put('http://localhost:8080/api/user/update-profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Perfil atualizado com sucesso!');
            setIsEditing(false);
            // Recarrega os dados atualizados
            const response = await axios.get('http://localhost:8080/api/user/consult-userprofile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data);
        } catch (err) {
            toast.error('Erro ao atualizar perfil');
            console.error('Erro:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                    <p className="text-gray-700">Carregando seus dados...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar perfil</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <div className="text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Nenhum dado de usuário encontrado</h2>
                    <p className="text-gray-600">Parece que não conseguimos carregar seu perfil.</p>
                </div>
            </div>
        );
    }

    const genders = [
        { value: "MALE", label: "Masculino" },
        { value: "FEMALE", label: "Feminino" }
    ];



    return (

        // <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4 animate-fadeIn">
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4 animate-fadeIn flex items-center">
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} className="relative z-50">
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
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                            Excluir conta permanentemente
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Tem certeza que deseja excluir sua conta? Todos os seus dados serão removidos permanentemente.
                                                Esta ação não pode ser desfeita.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                {/* <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                    Excluir
                                </button> */}
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 hover:bg-red-500 text-sm font-semibold text-white shadow-xs ring-1 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Deletar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
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
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="mb-8 flex-col">
                        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
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
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div> */}
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold text-gray-800">Configurações do Perfil</h1>
                            <button
                                onClick={() => setOpen(true)}
                                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-600 text-center">Atualize suas informações pessoais</p>
                    </div>

                    {!isEditing ? (
                        <div className="bg-gray-50 p-6 rounded-lg mb-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Informações básicas</h3>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Nome:</span> {userData.name}</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Idade:</span> {userData.age} anos</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Sexo:</span> {userData.gender === "MALE" ? "Masculino" : "Feminino"}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Medidas</h3>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Peso:</span> {userData.weight} kg</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Altura:</span> {userData.height} cm</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-gray-800 mb-2">Preferências alimentares</h3>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Nível de atividade:</span> {userData.activityLevel?.name || "Não informado"}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Tipo de dieta:</span> {userData.dietLabel?.name || "Não informado"}
                                </p>
                                {userData.healthLabels?.length > 0 && (
                                    <>
                                        <p className="font-medium text-gray-800 mt-2 mb-1">Restrições:</p>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {userData.healthLabels.map(label => (
                                                <li key={label.id}>{label.name}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full"
                                >
                                    Editar Perfil
                                </button>
                            </div>
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => { localStorage.removeItem("token"); navigate("/") }}
                                    className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-red-400 transition-colors w-full"
                                >
                                    Sair
                                </button>
                            </div>
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full"
                                >
                                    Excluir conta
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="Seu nome completo"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                        Idade
                                    </label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="Anos"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                                        Peso
                                    </label>
                                    <input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        min="1"
                                        max="500"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={handleInputChange}
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
                                        name="height"
                                        type="number"
                                        min="1"
                                        max="300"
                                        step="0.1"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="cm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sexo
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={(e) => handleSelectChange("gender", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="" disabled>Selecione</option>
                                        {genders.map(gender => (
                                            <option key={gender.value} value={gender.value}>{gender.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nível de Atividade
                                    </label>
                                    <select
                                        id="activityLevel"
                                        name="activityLevelId"
                                        value={formData.activityLevelId}
                                        onChange={(e) => handleSelectChange("activityLevelId", parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="" disabled>Selecione seu nível</option>
                                        {activityLevels.map(level => (
                                            <option key={level.id} value={level.id}>{level.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="dietLabel" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Dieta
                                    </label>
                                    <select
                                        id="dietLabel"
                                        name="dietLabelId"
                                        value={formData.dietLabelId}
                                        onChange={(e) => handleSelectChange("dietLabelId", parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="" disabled>Selecione sua dieta</option>
                                        {dietLabels.map(diet => (
                                            <option key={diet.id} value={diet.id}>{diet.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Restrições de Saúde
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {healthLabels.map(label => (
                                        <div key={label.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`health-${label.id}`}
                                                checked={formData.healthLabelsIds.includes(label.id)}
                                                onChange={() => handleCheckboxChange(label.id)}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`health-${label.id}`} className="ml-2 block text-sm text-gray-700">
                                                {label.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}