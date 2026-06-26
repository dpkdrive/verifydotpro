const FooterBottom = () => {
    return (<footer className="border-t border-slate-800 bg-black"> <div className="container mx-auto px-6 py-6"> <p className="text-center text-sm text-slate-500">
        © {new Date().getFullYear()}{" "} <span className="font-medium text-white">MYODROL</span>. All Rights
        Reserved. </p> </div> </footer>
    );
};

export default FooterBottom;
