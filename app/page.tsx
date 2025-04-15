'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './components/ProductCard';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import Pagination from './components/Pagination';
import styles from './page.module.css';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ProductResponse {
  products: Product[];
  count: number;
  currentPage: number;
  totalPages: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(searchParams.toString());
      
      if (!params.has('page')) {
        params.set('page', '1');
      }

      const url = `http://localhost:8000/products?${params.toString()}`;
      console.log('Fetching products from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductResponse = await response.json();
      console.log('Received data:', {
        productCount: data.products.length,
        totalCount: data.count,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        firstProduct: data.products[0]
      });
      
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams.toString()]);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.filters}>
          <SearchBar />
          <div className={styles.filterButtons}>
            <FilterDropdown type="category" />
            <FilterDropdown type="price" />
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : products.length > 0 ? (
          <>
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
            />
          </>
        ) : (
          <div>No products found for your search criteria</div>
        )}
      </div>
    </main>
  );
} 