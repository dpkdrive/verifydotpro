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
        console.log(err)
        setError('Failed to fetch products. Make sure the backend is running.');
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
      <div className="page center">
        <div className="spinner"></div>
        <p className="muted">Loading products…</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ alignItems: 'center' }}>
      <div className="products-header">
        <h1>Our Premium Products</h1>
        <p className="muted">Explore our curated collection of authentic, high-quality products.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!error && products.length === 0 && (
        <div className="empty-state" style={{ maxWidth: 480 }}>
          <p>No products available yet. Check back soon!</p>
        </div>
      )}

      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-image-container">
              {p.image_url ? (
                <img
                  src={resolveImage(p.image_url)}
                  alt={p.name}
                  className="product-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="product-img-fallback">📷</div>
              )}
              <div className="product-price">${Number(p.price).toFixed(2)}</div>
            </div>

            <div className="product-info">
              <h3>{p.name}</h3>
              {p.description && (
                <p className="product-description">{p.description}</p>
              )}

              {/* {p.demo_code && (
                <div className="product-demo-section">
                  <span className="demo-label">Demo Code</span>
                  <span className="demo-code">{p.demo_code}</span>
                </div>
              )} */}

              <div className="product-actions">
                {p.demo_code && (
                  <button
                    onClick={() => handleCopyCode(p.demo_code, p.id)}
                    className={`btn-secondary ${copiedId === p.id ? 'copied' : ''}`}
                  >
                    {copiedId === p.id ? '✓ Copied' : 'Copy Code'}
                  </button>
                )}
                <button
                  onClick={() => handleVerify(p.demo_code || '')}
                  className="btn-primary"
                >
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
