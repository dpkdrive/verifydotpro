import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const resolveImage = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url}`;
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
        console.log("ERROR OBJECT:", err);
        console.log("MESSAGE:", err.message);
        console.log("RESPONSE:", err.response);
        console.log("DATA:", err.response?.data);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerify = (code) => {
    navigate('/', { state: { code } });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="text-center">

          {/* Spinner */}
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-red-500"></div>

          <h2 className="text-2xl font-semibold text-white">
            Loading Products
          </h2>

          <p className="mt-2 text-slate-400">
            Please wait while we fetch our premium collection...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="mx-auto max-w-7xl">

        {/* ================= Header ================= */}

        <div className="mb-12 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 shadow-lg">

            <Package className="text-white" size={34} />

          </div>

          <h1 className="text-4xl font-bold text-white">
            Our Premium Products
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Explore our curated collection of authentic, high-quality products.
            Every product comes with a secure verification code for complete
            authenticity.
          </p>

        </div>

        {/* ================= Error ================= */}

        {error && (

          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-center text-red-400">

            {error}

          </div>

        )}

        {/* ================= Empty State ================= */}

        {!error && products.length === 0 && (

          <div className="mx-auto max-w-lg rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">

            <Package
              className="mx-auto mb-5 text-slate-500"
              size={56}
            />

            <h3 className="text-2xl font-semibold text-white">

              No Products Found

            </h3>

            <p className="mt-3 text-slate-400">

              There are no products available right now.
              Please check back later.

            </p>

          </div>

        )}

        {/* ================= Products ================= */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((p) => (

            <div
              key={p.id}
              className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/30 hover:shadow-red-500/10"
            >

              {/* Product Image */}

              <div className="relative h-64 overflow-hidden bg-slate-950">

                {p.image_url ? (

                  <img
                    src={resolveImage(p.image_url)}
                    alt={p.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center">

                    <Package
                      size={70}
                      className="text-slate-600"
                    />

                  </div>

                )}

                {/* Price */}

                <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">

                  ${Number(p.price).toFixed(2)}

                </div>

              </div>

              {/* Product Info */}

              <div className="p-6">

                <h3 className="text-xl font-bold text-white">

                  {p.name}

                </h3>

                {p.description && (

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">

                    {p.description}

                  </p>

                )}

                {/* Demo Code */}

                {p.demo_code && (

                  <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">

                    <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">

                      Verification Code

                    </p>

                    <div className="flex items-center justify-between">

                      <code className="font-mono text-red-400">

                        {p.demo_code}

                      </code>

                      <button
                        onClick={() =>
                          handleCopyCode(p.demo_code, p.id)
                        }
                        className="text-slate-400 transition hover:text-white"
                      >

                        {copiedId === p.id ? (

                          <Check size={18} />

                        ) : (

                          <Copy size={18} />

                        )}

                      </button>

                    </div>

                  </div>

                )}

                {/* Buttons */}

                <div className="mt-6 flex gap-3">

                  {p.demo_code && (

                    <button
                      onClick={() =>
                        handleCopyCode(p.demo_code, p.id)
                      }
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${copiedId === p.id
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-slate-700 bg-slate-950 text-slate-300 hover:border-red-500/30 hover:text-white"
                        }`}
                    >

                      {copiedId === p.id
                        ? "Copied"
                        : "Copy Code"}

                    </button>

                  )}

                  <button
                    onClick={() =>
                      handleVerify(p.demo_code || "")
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-red-500/20"
                  >

                    <ShieldCheck size={18} />

                    Verify

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}
