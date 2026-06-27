import {
    Dumbbell,
    ShieldCheck,
    Zap,
    Trophy,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutSection() {
    const features = [
        {
            icon: Dumbbell,
            title: "Performance Driven",
            description:
                "Advanced formulations designed to maximize strength, endurance, and athletic performance.",
        },
        {
            icon: ShieldCheck,
            title: "Premium Quality",
            description:
                "Every product is crafted using carefully selected ingredients and strict quality standards.",
        },
        {
            icon: Zap,
            title: "Faster Recovery",
            description:
                "Support muscle repair and reduce downtime between intense training sessions.",
        },
        {
            icon: Trophy,
            title: "Proven Results",
            description:
                "Trusted by fitness enthusiasts and athletes who demand the best from their nutrition.",
        },
    ];

    return (<section className="relative overflow-hidden bg-slate-950 pt-12">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container mx-auto px-6">
            <div className="grid items-center gap-16 lg:grid-cols-2">
                {/* Left Content */}
                <div>
                    {/* <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                      
                    </span> */}

                    <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
                        <span className="block bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                            About Our Brand
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-relaxed text-slate-400">
                        We create premium sports nutrition products engineered to help
                        athletes, bodybuilders, and fitness enthusiasts unlock their full
                        potential. Every formula is backed by quality ingredients,
                        performance-focused research, and a commitment to real results.
                    </p>

                    <p className="mt-4 text-slate-500">
                        Whether you're building strength, improving endurance, or
                        accelerating recovery, our mission is to fuel your journey with
                        products you can trust.
                    </p>

                    <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white transition hover:scale-105">
                        Explore Products
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Right Feature Cards */}
                <div className="grid gap-6 sm:grid-cols-2">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 hover:bg-slate-900"
                            >
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20">
                                    <Icon className="text-red-400" size={28} />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-white">
                                    {feature.title}
                                </h3>

                                <p className="text-sm leading-relaxed text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="mt-20 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 md:grid-cols-3">
                <div className="text-center">
                    <h3 className="text-4xl font-bold text-white">50K+</h3>
                    <p className="mt-2 text-slate-400">Happy Customers</p>
                </div>

                <div className="text-center">
                    <h3 className="text-4xl font-bold text-white">100+</h3>
                    <p className="mt-2 text-slate-400">Premium Products</p>
                </div>

                <div className="text-center">
                    <h3 className="text-4xl font-bold text-white">10+</h3>
                    <p className="mt-2 text-slate-400">Years Of Excellence</p>
                </div>
            </div>
        </div>
    </section>
    )
}
