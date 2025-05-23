import { ArrowRight, Leaf, Brain, BarChart3, Instagram, Twitter, Facebook } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 text-gray-600">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center">
                    <p>Nutri & Plan LOGO</p>{/* <Image src="./src/assets/Nutri_Plan-Logo.svg" alt="Nutri&Plan Logo" width={150} height={50} className="h-10 w-auto" /> */}
                </div>
                <div className="hidden md:flex space-x-8">
                    <button onClick={() => navigate("/features")} className="hover:text-green-500 transition-all duration-300">
                        Features
                    </button>
                    <button onClick={() => navigate("/features")} className="hover:text-green-500 transition-all duration-300">
                        Trabalho
                    </button>
                    <button onClick={() => navigate("/features")} className="hover:text-green-500 transition-all duration-300">
                        Contato
                    </button>
                </div>
                <div>
                    <button className="bg-white text-green-500 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                        Login
                    </button>
                    <button className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg ml-4 transition-all duration-300">
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Healthy Living <br />
                        <span className="text-green-500">Simplified</span>
                    </h1>
                    <p className="text-xl mb-8 max-w-lg">
                        Plan your meals, track your calories, and achieve your health goals with AI-powered nutrition planning.
                    </p>
                    <button className="bg-green-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center transition-all duration-300 transform hover:translate-y-[-2px]">
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-20"></div>
                        {/* <Image
                            src="/placeholder.svg?height=500&width=500"
                            alt="Healthy Meal Planning"
                            width={500}
                            height={500}
                            className="relative z-10 rounded-2xl shadow-xl"
                        /> */}
                        <p>Nutri & Plan SVG</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                    <p className="text-xl max-w-2xl mx-auto">Everything you need to maintain a healthy lifestyle in one place</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card 1 */}
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Leaf className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Personalized Meal Plans</h3>
                        <p className="text-gray-500">
                            Get customized meal plans based on your dietary preferences, restrictions, and nutritional goals.
                        </p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Brain className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI-Powered Recommendations</h3>
                        <p className="text-gray-500">
                            Our AI analyzes your habits and preferences to suggest meals that align with your health goals.
                        </p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <BarChart3 className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Calorie Tracking</h3>
                        <p className="text-gray-500">
                            Effortlessly track your daily calorie intake and nutritional balance with our intuitive dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white bg-opacity-50 rounded-3xl my-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-xl max-w-2xl mx-auto">Three simple steps to transform your nutrition habits</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center max-w-xs">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            1
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Create Your Profile</h3>
                        <p className="text-center text-gray-500">
                            Tell us about your dietary preferences, restrictions, and health goals.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center max-w-xs">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            2
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Get Personalized Plans</h3>
                        <p className="text-center text-gray-500">
                            Receive AI-generated meal plans tailored specifically to your needs.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center max-w-xs">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            3
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Track & Improve</h3>
                        <p className="text-center text-gray-500">
                            Monitor your progress and receive ongoing recommendations to improve your nutrition.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 my-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-2/3 mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your nutrition?</h2>
                        <p className="text-xl text-gray-500">
                            Join thousands of users who have improved their health with Nutri&Plan.
                        </p>
                    </div>
                    <div>
                        <button className="bg-green-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl flex items-center transition-all duration-300 transform hover:translate-y-[-2px] text-lg">
                            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-white bg-opacity-70 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            {/* <Image src="/logo.svg" alt="Nutri&Plan Logo" width={150} height={50} className="h-10 w-auto mb-4" /> */}
                            <p className="text-gray-500 mb-4">AI-powered nutrition planning for a healthier lifestyle.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                                    <Instagram className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                                    <Twitter className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-green-500 transition-all duration-300">
                                    <Facebook className="h-6 w-6" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        Press
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        Nutrition Guide
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        Recipe Database
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-500 transition-all duration-300">
                                        API Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2">
                                <li>hello@nutriandplan.com</li>
                                <li>+1 (555) 123-4567</li>
                                <li>123 Health Street, Wellness City</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 mb-4 md:mb-0">
                            © {new Date().getFullYear()} Nutri&Plan. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="hover:text-green-500 transition-all duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-green-500 transition-all duration-300">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-green-500 transition-all duration-300">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
