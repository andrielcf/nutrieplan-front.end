import { ArrowRight, Leaf, Brain, BarChart3 } from "lucide-react"
import { Link } from "react-router-dom"
import NutriPlanLogo from "../assets/nutrieplan-title-v2.svg"
import NutriPlanLogoNoTitle from "../assets/nutrieplan-notitle-v2.svg"

export default function LandingPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 text-gray-600 animate-fadeIn">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center ">
                    <Link to={"/landing"} className="transition-all duration-300 hover:scale-110">
                        <img src={NutriPlanLogoNoTitle} alt="Nutri&Plan Logo" className="h-24 w-auto" />
                    </Link>
                </div>

                <div>
                    <Link to={"/auth/login"}>
                        <button className="transition-all duration-300 hover:scale-110 bg-white text-green-500 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                            Entrar
                        </button>
                    </Link>

                    <Link to={"/auth/register"}>
                        <button className="transition-all duration-300 hover:scale-110 bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg ml-4 transition-all duration-300">
                            Cadastrar-se
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Cardápios Saudável
                        <br />
                        <span className="text-green-500">Simplificado</span>
                    </h1>
                    <p className="text-xl mb-8 max-w-lg">
                        Planeje seus cardápios, monitore suas calorias, com a ajuda da Inteligencia Artificial.
                    </p>
                    <Link to={"/"} className="no-underline">
                        <button className="transition-all duration-300 hover:scale-110 animate-bounce bg-green-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center transition-all duration-300 transform hover:translate-y-[-2px]">
                            Começar <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </Link>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-20"></div>
                        <img
                            src={NutriPlanLogoNoTitle}
                            alt="Nutri&Plan Logo"
                            className="relative z-10 rounded-2xl shadow-xl w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Recursos</h2>
                    <p className="text-xl max-w-2xl mx-auto">Tudo o que você precisa para manter um estilo de vida saudável em um só lugar</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card 1 */}
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transition-all duration-300 hover:scale-110">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Leaf className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Cardápios Personalizados</h3>
                        <p className="text-gray-500">
                            Obtenha cardápios personalizados com base no nosso banco de dados.
                        </p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transition-all duration-300 hover:scale-110">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Brain className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Recomendações com tecnologia de IA</h3>
                        <p className="text-gray-500">
                            Nossa IA analisa seus dados, com isso fornecendo cardápios personalizados.
                        </p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transition-all duration-300 hover:scale-110">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <BarChart3 className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Contador de Calorias</h3>
                        <p className="text-gray-500">
                            Acompanhe facilmente sua ingestão calórica diária e equilíbrio nutricional com nosso painel intuitivo.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white bg-opacity-50 rounded-3xl my-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Começar</h2>
                    <p className="text-xl max-w-2xl mx-auto">Três passos simples para obter seus cardápios personalizados</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0 ">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center max-w-xs transition-all duration-300 hover:scale-110">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            1
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Crie seu perfil agora</h3>
                        <p className="text-center text-gray-500">
                            Conte-nos sobre suas preferências alimentares, restrições e objetivos de saúde.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center max-w-xs transition-all duration-300 hover:scale-110">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            2
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Obtenha cardápios personalizados</h3>
                        <p className="text-center text-gray-500">
                            Receba cardápios personalizados de refeições gerados por IA.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center max-w-xs transition-all duration-300 hover:scale-110">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            3
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Rasteamento de Calorias</h3>
                        <p className="text-center text-gray-500">
                            Monitore suas calorias com as refeições diarias.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 my-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-2/3 mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para montar seu cardápio personalizado?</h2>
                        <p className="text-xl text-gray-500">
                            Junte-se a milhares de usuários que melhoraram sua saúde com o Nutri&Plan
                        </p>
                    </div>
                    <div>
                        <Link to={"/"} className="no-underline">
                            <button className="transition-all duration-300 hover:scale-110 animate-bounce bg-green-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl flex items-center transition-all duration-300 transform hover:translate-y-[-2px] text-lg">
                                Iniciar Teste <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-white bg-opacity-70 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between">
                        <div>
                            {/* <Image src="/logo.svg" alt="Nutri&Plan Logo" width={150} height={50} className="h-10 w-auto mb-4" /> */}
                            <p className="text-gray-500 mb-4">Planejamento de cardápios com tecnologia de IA para um estilo de vida mais saudável.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Contato</h3>
                            <ul className="space-y-2">
                                <li>contato@nutrieplan.com</li>
                                <li>+55 (48) 9913760-XXX</li>
                                <li>Faculdade Senac Palhoça - R. João Pereira dos Santos, 303 - Pte. do Imaruim, Palhoça - SC, 88130-475</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 mb-4 md:mb-0">
                            © {new Date().getFullYear()} Nutri&Plan. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
