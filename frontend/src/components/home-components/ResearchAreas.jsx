import {
    Brain,
    HeartPulse,
    Dumbbell,
    ShieldCheck,
    Microscope,
    Leaf,
} from "lucide-react";

export default function ResearchAreas() {
    const researchAreas = [
        {
            icon: Dumbbell,
            title: "Muscle Growth",
            description:
                "Research focused on maximizing muscle protein synthesis, lean mass development, and post-workout recovery.",
        },
        {
            icon: HeartPulse,
            title: "Endurance & Performance",
            description:
                "Advanced studies on stamina, oxygen utilization, and sustained athletic performance.",
        },
        {
            icon: Brain,
            title: "Focus & Cognitive Support",
            description:
                "Exploring ingredients that enhance concentration, mental clarity, and workout motivation.",
        },
        {
            icon: ShieldCheck,
            title: "Recovery Science",
            description:
                "Developing solutions that reduce fatigue, improve recovery speed, and support long-term performance.",
        },
        {
            icon: Microscope,
            title: "Ingredient Innovation",
            description:
                "Continuous evaluation of clinically studied ingredients to ensure efficacy, safety, and purity.",
        },
        {
            icon: Leaf,
            title: "Clean Nutrition",
            description:
                "Researching sustainable, transparent, and high-quality ingredients for modern athletes.",
        },
    ];

    return (<section className="relative overflow-hidden bg-black py-24">
        {/* Background Effects */} <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" /> <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container mx-auto px-6">
            {/* Heading */}
            <div className="mx-auto max-w-3xl text-center">
                {/* <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
               
                </span> */}

                <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">

                    <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                        Research & Innovation
                    </span>
                </h2>

                <p className="mt-6 text-lg text-slate-400">
                    Our research team continuously explores cutting-edge nutritional
                    science to develop products that deliver measurable results and
                    support peak human performance.
                </p>
            </div>

            {/* Research Cards */}
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {researchAreas.map((area, index) => {
                    const Icon = area.icon;

                    return (
                        <div
                            key={index}
                            className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-slate-900"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-500/20">
                                <Icon size={32} className="text-red-400" />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold text-white">
                                {area.title}
                            </h3>

                            <p className="leading-relaxed text-slate-400">
                                {area.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Statement */}
            <div className="mt-20 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-10 text-center">
                <h3 className="text-2xl font-bold text-white">
                    Science-Led. Performance-Focused.
                </h3>

                <p className="mx-auto mt-4 max-w-3xl text-slate-400">
                    Every formulation begins with research. We combine scientific
                    evidence, ingredient innovation, and athlete feedback to create
                    products that help you train harder, recover faster, and perform at
                    your best.
                </p>
            </div>
        </div>
    </section>

    );
}
