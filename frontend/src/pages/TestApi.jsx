import React, { useEffect, useState } from 'react';

const TestApi = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                'https://verifydotpro-production.up.railway.app/api/products'
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            console.log('Products:', data);
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Products</h2>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <pre>{JSON.stringify(products, null, 2)}</pre>
            )}
        </div>
    );
};

export default TestApi;