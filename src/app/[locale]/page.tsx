import React from 'react';
import styles from './page.module.css';

import ProductList from '@/components/private/product-list/product-list';
import ProductAutoComplete from '@/components/private/product-auto-complate';
import { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadataHelper, GenerateMetadataProps } from '@/shared/utils/generateMetadata';

export async function generateMetadata(
  _: GenerateMetadataProps,
  parentMetadata: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations('Home');
  return generateMetadataHelper(t('title'), t('description'), parentMetadata);
}
export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ADDRESS}/products`);
  const products = await response.json();
  return (
    <main className={styles.main}>
      <ProductAutoComplete products={products} />
      <ProductList products={products}/>
    </main>
  );
}
