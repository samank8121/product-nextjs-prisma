import React from 'react';
import styles from './page.module.css';

import ProductList from '@/components/product-list/product-list';
import ProductAutoComplete from '@/components/product-auto-complete/product-auto-complate';
import { Metadata, ResolvingMetadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import {
  generateMetadataHelper,
  GenerateMetadataProps,
} from '@/shared/utils/generate-metadata';

export async function generateMetadata(
  _: GenerateMetadataProps,
  parentMetadata: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations('Home');
  return generateMetadataHelper(t('title'), t('description'), parentMetadata);
}
export default async function Home() {
  const locale = await getLocale();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ADDRESS}/products`,
    {
      headers: {
        'Accept-Language': locale,
      },
    }
  );
  const products = await response.json();
  return (
    <main className={styles.main}>
      <ProductAutoComplete products={products} />
      <ProductList products={products} />
    </main>
  );
}
