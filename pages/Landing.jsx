import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, Users, Shield, Zap, Globe, MessageSquare, Briefcase, Shovel } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#FDFCF7] text-[#1A2E1A] font-sans selection:bg-[#C5E1A5] selection:text-[#1A2E1A]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E8E8]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                            <Sprout className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#1A2E1A]">Farmer<span className="text-[#2E7D32]">Bridge</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4A4A4A]">
                        <a href="#features" className="hover:text-[#2E7D32] transition-colors">Features</a>
                        <a href="#community" className="hover:text-[#2E7D32] transition-colors">Community</a>
                        <a href="#about" className="hover:text-[#2E7D32] transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-6 py-2.5 rounded-full text-sm font-bold text-[#4A4A4A] hover:bg-gray-50 transition-all">
                            Log In
                        </Link>
                        <Link to="/login" className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition-all shadow-lg shadow-green-100 hover:shadow-green-200 active:scale-95">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                            <Shield className="w-4 h-4" /> Empowering Modern Agriculture
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-[#1A2E1A] leading-[1.1] mb-8">
                            Connecting <span className="text-[#2E7D32] italic">The Soil</span> With Success.
                        </h1>
                        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-10 max-w-xl">
                            The premier digital ecosystem for farmers, laborers, and equipment providers. Streamline your workflow, find local talent, and access cutting-edge machinery in one unified platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/login" className="px-8 py-4 rounded-2xl bg-[#2E7D32] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1B5E20] transition-all shadow-xl shadow-green-200 hover:-translate-y-1">
                                Start Your Journey <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-100 text-[#4A4A4A] font-bold text-lg hover:border-[#2E7D32] hover:text-[#2E7D32] transition-all">
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-[#4A4A4A]">
                                <span className="font-bold text-[#2E7D32]">5,000+</span> Farmers already joined
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#C5E1A5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#2E7D32] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                        <div className="relative bg-white rounded-[2rem] p-4 shadow-2xl border border-gray-100 overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
                                alt="Modern Farm"
                                className="rounded-[1.5rem] w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-widest">Available Now</p>
                                            <p className="text-sm font-bold text-[#1A2E1A]">Skilled Harvesters</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-[#4A4A4A]">Proximity</p>
                                        <p className="text-sm font-bold text-[#2E7D32]">2.4 km away</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#2E7D32] h-full w-[85%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white border-y border-[#F0F0F0]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Active Users", val: "12K+" },
                            { label: "Bookings Made", val: "45K+" },
                            { label: "Districts Covered", val: "24" },
                            { label: "Success Rate", val: "99.2%" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-4xl font-extrabold text-[#1A2E1A] mb-2">{stat.val}</p>
                                <p className="text-sm font-semibold text-[#4A4A4A] uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <h2 className="text-sm font-bold text-[#2E7D32] uppercase tracking-[0.3em] mb-4">Core Ecosystem</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#1A2E1A]">Everything Your Farm Needs.</h3>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Users,
                            title: "Verified Laborers",
                            desc: "Instant access to skilled workforce for harvest, sowing, and maintenance. Verified ratings and transparent pricing.",
                            color: "bg-blue-50 text-blue-600"
                        },
                        {
                            icon: Shovel,
                            title: "Equipment Rental",
                            desc: "Rent high-end tractors, drones, and harvesters from local providers. Pay-per-use, fully insured transactions.",
                            color: "bg-orange-50 text-orange-600"
                        },
                        {
                            icon: MessageSquare,
                            title: "Community Feed",
                            desc: "Connect with fellow farmers. Share knowledge, check market rates, and stay updated with agricultural news.",
                            color: "bg-green-50 text-green-600"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#2E7D32]/20 transition-all group">
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-[#1A2E1A] mb-4">{feature.title}</h4>
                            <p className="text-[#4A4A4A] leading-relaxed mb-6">
                                {feature.desc}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-bold text-[#2E7D32]">
                                Learn more <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto bg-[#1A2E1A] rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32] rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to transform your <span className="text-[#C5E1A5]">Harvest</span>?</h2>
                        <p className="text-[#E8F5E9] text-xl mb-12 max-w-2xl mx-auto">
                            Join the thousands of successful farmers who have optimized their operations with FarmerBridge.
                        </p>
                        <Link to="/login" className="px-10 py-5 rounded-2xl bg-white text-[#1A2E1A] font-extrabold text-xl hover:bg-[#C5E1A5] transition-all shadow-2xl">
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                            <Sprout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#1A2E1A]">FarmerBridge</span>
                    </div>
                    <p className="text-[#4A4A4A] text-sm font-medium">&copy; 2024 FarmerBridge Ecosystem. All rights reserved.</p>
                    <div className="flex gap-8 text-sm font-bold text-[#4A4A4A]">
                        <a href="#" className="hover:text-[#2E7D32]">Privacy</a>
                        <a href="#" className="hover:text-[#2E7D32]">Terms</a>
                        <a href="#" className="hover:text-[#2E7D32]">Contact</a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
        </div>
    );
}
