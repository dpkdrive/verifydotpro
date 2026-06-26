import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
} from "lucide-react";

export default function ContactSection() {
    return (<section className="relative overflow-hidden bg-black py-24">
        {/* Background Effects */} <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" /> <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container mx-auto px-6">
            {/* Heading */}
            <div className="mx-auto mb-16 max-w-3xl text-center">


                <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">

                    <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">

                        Contact Us
                    </span>
                </h2>

                <p className="mt-6 text-lg text-slate-400">
                    Have questions about authentication, verification, or brand
                    protection? Our team is here to help.
                </p>
            </div>

            <div className="">
                {/* Left Side */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm">
                    <h3 className="mb-8 text-2xl font-bold text-white">
                        Get In Touch
                    </h3>

                    <div className="space-y-8  lg:space-y-0 lg:grid lg:grid-cols-2 gap-4">
                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
                                <Mail className="text-red-400" size={24} />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">Email</h4>
                                <p className="text-slate-400">
                                    support@myodrol.com
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
                                <Phone className="text-red-400" size={24} />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">Phone</h4>
                                <p className="text-slate-400">
                                    +91 98765 43210
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
                                <MapPin className="text-red-400" size={24} />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">Office</h4>
                                <p className="text-slate-400">
                                    Mumbai, Maharashtra, India
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
                                <Clock className="text-red-400" size={24} />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">
                                    Working Hours
                                </h4>
                                <p className="text-slate-400">
                                    Monday - Saturday
                                </p>
                                <p className="text-slate-400">
                                    9:00 AM - 6:00 PM
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="mt-10 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/50 to-orange-950/50 p-6">
                        <h4 className="text-lg font-bold text-white">
                            Need Immediate Assistance?
                        </h4>

                        <p className="mt-2 text-slate-400">
                            Our verification experts are available to help you secure your
                            products and protect your brand.
                        </p>
                    </div>
                </div>

                {/* Right Side Form */}
                {/* <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm">
                    <h3 className="mb-8 text-2xl font-bold text-white">
                        Send Us A Message
                    </h3>

                    <form className="space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <div>
                            <textarea
                                rows={6}
                                placeholder="Tell us how we can help..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white transition hover:scale-105"
                        >
                            Send Message
                            <Send size={18} />
                        </button>
                    </form>
                </div> */}
            </div>
        </div>
    </section>
    );
}
