'use client';

import React from 'react';
import ProductCard from '@/components/private/product-card/product-card';
import styles from './product-list.module.css';
import { useCart } from '@/shared/hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constant';
import { GetProductsType } from '@/types/ProductType';

const ProductList = ({
  products,
}: {
  products: GetProductsType;
}) => {
  const { changeProduct, getProductCount } = useCart();
  const { data, isLoading } = useQuery<GetProductsType>({
    queryKey: [queryKeys.products],
    queryFn: () => {           
      return products;
    },
  });
  console.log(data);
  const onChangeProduct = (productid: number, value: number) => {
    changeProduct(productid, value);
  };
  if(isLoading || !data)
  {
    return null;
  }
  
  return (
    <div className={styles.productList}>
      {data.products.map((p, index) => (
        <ProductCard
          key={index}
          product={p}
          value={getProductCount(p.id)}
          onChange={(value) => {
            onChangeProduct(p.id, value);
          }}
        />
      ))}
    </div>
  );
};

export default ProductList;
