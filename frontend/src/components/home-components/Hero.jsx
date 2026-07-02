import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
    {
        // badge: "🛡️ Trusted Authentication",
        title: "#VERIFY",
        highlight: "REAL.",
        subtitle:
            "Protect your customers from counterfeit products with instant QR-based authentication and real-time verification.",
    },
    {
        // badge: "⚡ Instant Verification",
        title: "#SCAN",
        highlight: "TRUST.",
        subtitle:
            "Empower buyers with confidence. Detect duplicate, fake, and tampered products within seconds.",
    },
    {
        // badge: "📦 Product Protection",
        title: "#SECURE",
        highlight: "EVERYTHING.",
        subtitle:
            "Issue unique verification codes, track product authenticity, and safeguard your brand reputation.",
    },
];

const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 900,
    fade: true,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots hero-dots",
};

const HeroSection = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 100);


        return () => clearTimeout(timer);


    }, []);

    return (
        <section className="relative min-h-[90%] overflow-hidden bg-gradient-to-b from-via-red-800  to-red-800/90">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />


            {/* Glow Effects */}
            {/* Red Glow */}
            <div className="absolute -top-52 right-0 h-[700px] w-[700px] rounded-full bg-red-700/20 blur-[180px]" />

            {/* Orange Accent */}
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-orange-700/10 blur-[160px]" />

            {/* Slider */}
            <Slider {...sliderSettings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <div className="flex min-h-[70%] items-center">
                            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8 lg:px-16">
                                <div
                                    className="max-w-7xl transition-all duration-700"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted
                                            ? "translateY(0)"
                                            : "translateY(30px)",
                                    }}
                                >
                                    {/* Badge */}
                                    {/* <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 backdrop-blur-sm">
                                    {slide.badge}
                                </span> */}

                                    {/* Heading */}
                                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
                                        {slide.title}{" "}
                                        <span
                                            className="bg-clip-text text-transparent"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(135deg,#ef4444 0%,#f97316 50%,#facc15 100%)",
                                            }}
                                        >
                                            {slide.highlight}
                                        </span>
                                    </h1>

                                    {/* Description */}
                                    <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                                        {slide.subtitle}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            to="/verify"
                                            className="group inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(220,38,38,0.45)]"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#dc2626 0%,#ea580c 100%)",
                                            }}
                                        >
                                            Verify a Product

                                            <svg
                                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </Link>

                                        <Link
                                            to="/products"
                                            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-red-500/40 hover:bg-red-500/10"
                                        >
                                            Explore Products
                                        </Link>
                                    </div>

                                    {/* Trust Indicators */}
                                    <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                                        {[
                                            {
                                                icon: "🛡️",
                                                label: "Authenticity Guaranteed",
                                            },
                                            {
                                                icon: "⚡",
                                                label: "Instant Verification",
                                            },
                                            {
                                                icon: "📈",
                                                label: "Real-Time Tracking",
                                            },
                                        ].map((item) => (
                                            <span
                                                key={item.label}
                                                className="flex items-center gap-2"
                                            >
                                                <span>{item.icon}</span>
                                                {item.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Bottom Gradient Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black to-transparent" />

            {/* Scroll Indicator */}
            <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-xs text-red-400/60">
                {/* <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg> */}

                {/* <span>Scroll</span> */}
            </div>

            {/* Slick Dots */}
            {/* <style>{`
    .hero-dots {
      bottom: 30px !important;
    }

    .hero-dots li button:before {
      color: rgba(255,255,255,0.25) !important;
      font-size: 8px !important;
    }

    .hero-dots li.slick-active button:before {
      color: #ef4444 !important;
    }
  `}</style> */}
        </section>


    );
};

export default HeroSection;
