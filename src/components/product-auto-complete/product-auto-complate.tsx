'use client';

import React, { useState } from 'react';
import Autocomplete from '@/components/auto-complete/auto-complete';
import { GetProductsType, ProductType } from '@/types/product-type';
import commonQueryClient from '@/shared/get-query-client';
import { queryKeys } from '@/shared/constant';

export default function ProductAutoComplete({
  products,
}: {
  products: GetProductsType;
}) {
  const [filterValue, setFilterValue] = useState<string | undefined>();
  const handleProductSelected = (p?: ProductType) => {
    if (p) {
      commonQueryClient.setQueryData([queryKeys.products], { products: [p] });
    } else if (!(filterValue && filterValue.length > 0)) {
      commonQueryClient.setQueryData([queryKeys.products], products );
    }
  };

  const renderProductSuggestion = (p?: ProductType) => {
    return p ? p.caption : '';
  };

  const filterProducts = (p: ProductType, inputValue: string) => {
    setFilterValue(inputValue);
    return inputValue && inputValue.length > 0
      ? p.caption.toLowerCase().includes(inputValue.toLowerCase())
      : false;
  };

  return (
    <Autocomplete<ProductType>
      suggestions={products.products}
      onSuggestionSelected={handleProductSelected}
      renderSuggestion={renderProductSuggestion}
      filterSuggestions={filterProducts}
    />
  );
}
