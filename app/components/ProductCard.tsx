import React from 'react';
import styles from './ProductCard.module.css';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.category}>Category: {product.category}</span>
        <span className={styles.price}>${product.price}</span>
      </div>
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{product.name}</h2>
      </div>
    </div>
  );
} 