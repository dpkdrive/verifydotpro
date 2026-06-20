import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const EMPTY_FORM = { name: '', description: '', price: '', demoCode: '' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName');

  // --- Tab state ---
  const [activeTab, setActiveTab] = useState('products');

  // --- Product state ---
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // --- Modal state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Delete confirm state ---
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Code generation state ---
  const [genForm, setGenForm] = useState({ productName: '', batchName: '', quantity: 1 });
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [codesCopied, setCodesCopied] = useState(false);

  // --- Code & logs state ---
  const [codes, setCodes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // --- Global error ---
  const [error, setError] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  // ── Data loaders ────────────────────────────────────────────────
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      else setError('Failed to load products.');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCodesAndLogs = async () => {
    setDataLoading(true);
    try {
      const [codesRes, logsRes] = await Promise.all([
        api.get('/products/codes'),
        api.get('/products/logs'),
      ]);
      setCodes(codesRes.data.codes);
      setLogs(logsRes.data.logs);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      else setError('Failed to load dashboard data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCodesAndLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auth ────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  // ── Image helpers ────────────────────────────────────────────────
  const resolveImage = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE}${url}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be smaller than 5 MB.');
      return;
    }
    setFormError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Modal helpers ────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      demoCode: product.demo_code || '',
    });
    setImageFile(null);
    setImagePreview(resolveImage(product.image_url));
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError('');
  };

  // ── Submit (create / update) ─────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) return setFormError('Product name is required.');
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return setFormError('A valid price is required.');
    if (!editingProduct && !imageFile)
      return setFormError('Please select a product image.');

    const data = new FormData();
    data.append('name', form.name.trim());
    data.append('description', form.description.trim());
    data.append('price', form.price);
    data.append('demoCode', form.demoCode.trim().toUpperCase());
    if (imageFile) data.append('image', imageFile);

    setFormLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      closeModal();
      await loadProducts();
      await loadCodesAndLogs();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/products/${deleteId}`);
      setDeleteId(null);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Code generation ──────────────────────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setGenLoading(true);
    try {
      const res = await api.post('/products/codes', genForm);
      setGeneratedCodes(res.data.codes);
      await loadCodesAndLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate codes.');
    } finally {
      setGenLoading(false);
    }
  };

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(generatedCodes.join('\n'));
    setCodesCopied(true);
    setTimeout(() => setCodesCopied(false), 2000);
  };

  // ── Status badge ─────────────────────────────────────────────────
  const StatusBadge = ({ status }) => (
    <span className={`status-badge status-${status}`}>{status}</span>
  );

  // ── Result badge ─────────────────────────────────────────────────
  const resultLabel = {
    genuine_first_check: '✓ Genuine',
    genuine_already_verified: '⚠ Re-verified',
    fake: '✗ Fake',
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="page admin-page">
      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage products, codes, and verification logs</p>
        </div>
        <div className="admin-header-right">
          <span className="admin-name-badge">👤 {adminName}</span>
          <button className="btn-danger-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && (
        <div className="error-banner" onClick={() => setError('')}>
          {error} <span style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="dashboard-tabs">
        {['products', 'codes', 'logs'].map((tab) => (
          <button
            key={tab}
            className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'products' && '📦 Products'}
            {tab === 'codes' && '🔑 Generate Codes'}
            {tab === 'logs' && '📋 Verification Logs'}
          </button>
        ))}
      </div>

      {/* ══════════════════════ PRODUCTS TAB ══════════════════════ */}
      {activeTab === 'products' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2>Product Catalog</h2>
            <button className="btn-primary btn-add" onClick={openCreateModal}>
              + Add Product
            </button>
          </div>

          {productsLoading ? (
            <div className="center-spinner"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products yet. Click <strong>+ Add Product</strong> to get started.</p>
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map((p) => (
                <div key={p.id} className="admin-product-card">
                  <div className="admin-product-img-wrap">
                    {p.image_url ? (
                      <img src={resolveImage(p.image_url)} alt={p.name} className="admin-product-img" />
                    ) : (
                      <div className="admin-product-img-placeholder">📷</div>
                    )}
                  </div>
                  <div className="admin-product-body">
                    <h3 className="admin-product-name">{p.name}</h3>
                    <p className="admin-product-desc">{p.description || <em>No description</em>}</p>
                    <div className="admin-product-meta">
                      <span className="admin-product-price">${Number(p.price).toFixed(2)}</span>
                      {p.demo_code && (
                        <span className="admin-product-code">{p.demo_code}</span>
                      )}
                    </div>
                    <div className="admin-product-actions">
                      <button className="btn-edit" onClick={() => openEditModal(p)}>✏ Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteId(p.id)}>🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════ CODES TAB ════════════════════ */}
      {activeTab === 'codes' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2>Generate Product Codes</h2>
          </div>
          <form className="gen-form" onSubmit={handleGenerate}>
            <div className="gen-form-row">
              <div className="form-field">
                <label>Product Name *</label>
                <input
                  name="productName"
                  value={genForm.productName}
                  onChange={(e) => setGenForm({ ...genForm, productName: e.target.value })}
                  placeholder="e.g. AeroPulse"
                  required
                />
              </div>
              <div className="form-field">
                <label>Batch Name (optional)</label>
                <input
                  name="batchName"
                  value={genForm.batchName}
                  onChange={(e) => setGenForm({ ...genForm, batchName: e.target.value })}
                  placeholder="e.g. Batch-2026-A"
                />
              </div>
              <div className="form-field form-field-sm">
                <label>Quantity (max 500)</label>
                <input
                  type="number" min="1" max="500"
                  name="quantity"
                  value={genForm.quantity}
                  onChange={(e) => setGenForm({ ...genForm, quantity: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={genLoading} style={{ marginTop: 16, width: 'auto', padding: '10px 28px' }}>
              {genLoading ? 'Generating…' : '🔑 Generate Codes'}
            </button>
          </form>

          {generatedCodes.length > 0 && (
            <div className="generated-codes-box">
              <div className="generated-codes-header">
                <span>{generatedCodes.length} code(s) generated</span>
                <button className={`btn-copy-all ${codesCopied ? 'copied' : ''}`} onClick={handleCopyAllCodes}>
                  {codesCopied ? '✓ Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="codes-list">
                {generatedCodes.map((c) => <div key={c} className="code-item">{c}</div>)}
              </div>
            </div>
          )}

          <h3 style={{ marginTop: 32 }}>Recent Codes</h3>
          {dataLoading ? (
            <div className="center-spinner"><div className="spinner" /></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Code</th><th>Product</th><th>Batch</th><th>Status</th><th>Created</th></tr>
                </thead>
                <tbody>
                  {codes.slice(0, 50).map((c) => (
                    <tr key={c.id}>
                      <td><code>{c.code}</code></td>
                      <td>{c.product_name}</td>
                      <td>{c.batch_name || '—'}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="muted">{new Date(c.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════ LOGS TAB ════════════════════ */}
      {activeTab === 'logs' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2>Verification Logs</h2>
          </div>
          {dataLoading ? (
            <div className="center-spinner"><div className="spinner" /></div>
          ) : logs.length === 0 ? (
            <div className="empty-state"><p>No verification attempts yet.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Code</th><th>Result</th><th>When</th></tr>
                </thead>
                <tbody>
                  {logs.slice(0, 100).map((l) => (
                    <tr key={l.id}>
                      <td>{l.full_name}</td>
                      <td>{l.email}</td>
                      <td>{l.phone}</td>
                      <td><code>{l.product_code}</code></td>
                      <td>
                        <span className={`result-badge result-${l.result}`}>
                          {resultLabel[l.result] || l.result}
                        </span>
                      </td>
                      <td className="muted">{new Date(l.checked_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════ ADD / EDIT MODAL ════════════════════ */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? '✏ Edit Product' : '+ Add New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {/* Image upload area */}
              <div
                className={`image-upload-zone ${imagePreview ? 'has-preview' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="image-upload-preview" />
                ) : (
                  <div className="image-upload-placeholder">
                    <span className="upload-icon">🖼</span>
                    <span>Click to upload image</span>
                    <span className="upload-hint">PNG, JPG, WebP — max 5 MB</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <button
                  type="button"
                  className="btn-change-image"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </button>
              )}

              <div className="modal-form-row">
                <div className="form-field">
                  <label>Product Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. AeroPulse Pro"
                    required
                  />
                </div>
                <div className="form-field form-field-sm">
                  <label>Price (USD) *</label>
                  <input
                    type="number" min="0.01" step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="29.99"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  className="modal-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short product description…"
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label>Demo / Verification Code (optional)</label>
                <input
                  value={form.demoCode}
                  onChange={(e) => setForm({ ...form, demoCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. AP-ANC-9901"
                  style={{ fontFamily: 'monospace' }}
                />
                <span className="field-hint">This code will also be registered in the product codes list for verification.</span>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={formLoading} style={{ width: 'auto', marginTop: 0, padding: '11px 32px' }}>
                  {formLoading
                    ? (editingProduct ? 'Saving…' : 'Creating…')
                    : (editingProduct ? '💾 Save Changes' : '✓ Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════ DELETE CONFIRM ════════════════════ */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h2>🗑 Confirm Delete</h2>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
              Are you sure you want to delete this product? This action cannot be undone and the image will be permanently removed.
            </p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting…' : '🗑 Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
