import {
    ShieldCheck,
    ScanLine,
    BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function WhyVerifyPro() {
    const features = [
        {
            icon: ShieldCheck,
            title: "Authenticity Guaranteed",
            description:
                "Every product is protected with unique QR verification technology, helping customers instantly identify genuine products and avoid counterfeits.",
        },
        {
            icon: ScanLine,
            title: "Real-Time Verification",
            description:
                "Scan and verify products within seconds. Detect duplicated, tampered, or suspicious codes before they impact customer trust.",
        },
        {
            icon: BadgeCheck,
            title: "Complete Transparency",
            description:
                "Track product authenticity throughout the supply chain while providing customers with confidence and proof of origin.",
        },
    ];

    return (<section className="bg-slate-950 pt-12"> <div className="container mx-auto px-6"> <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Left Content */} <div>
            <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
                <span className="block bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                    Why   VerifyPro
                </span>
            </h2>
            <div className="mt-10 space-y-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className="flex gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20">
                                <Icon className="text-red-400" size={28} />
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-semibold text-white">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* <Link to="/products" className="mt-10 rounded-xl border border-red-500 px-8 py-3 font-semibold text-white transition-all hover:bg-red-600">
                Verify Products
            </Link> */}
        </div>

        {/* Right Image */}
        <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600/20 to-orange-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <img
                    src="https://insane-genix.com/wp-content/uploads/2026/01/creatine-1.png"
                    alt="VerifyPro Authentication Platform"
                    className="h-full w-full rounded-2xl object-cover"
                />
            </div>
        </div>
    </div>
    </div>
    </section>
    );
}
