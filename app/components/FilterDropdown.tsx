'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './FilterDropdown.module.css';

interface FilterDropdownProps {
  type: 'category' | 'price';
}

const options = {
  category: [
    { value: '', label: 'All Categories' },
    { value: 'Garden', label: 'Garden' },
    { value: 'Jewelery', label: 'Jewelery' },
    { value: 'Games', label: 'Games' },
    { value: 'Beauty', label: 'Beauty' },
    { value: 'Home', label: 'Home' }
  ],
  price: [
    { value: '', label: 'Sort by Price' },
    { value: 'lowest', label: 'Lowest to Highest' },
    { value: 'highest', label: 'Highest to Lowest' }
  ]
};

export default function FilterDropdown({ type }: FilterDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={searchParams.get(type) || ''}
      onChange={(e) => handleChange(e.target.value)}
      className={styles.select}
    >
      {options[type].map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
} 