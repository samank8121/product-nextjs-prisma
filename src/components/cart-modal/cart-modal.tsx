'use client';

import React from 'react';
import Modal from '../modal/modal';
import { useQuery } from '@tanstack/react-query';
import { euro, queryKeys } from '@/shared/constant';
import styles from './cart-modal.module.css';
import commonQueryClient from '@/shared/get-query-client';
import { ModalCartType } from '@/types/modal-types';
import { useLocale, useTranslations } from 'next-intl';
import IncreaseDecrease from '../increase-decrease/increase-decrease';
import { useCart } from '@/shared/hooks/cart';
import { GetProductsType } from '@/types/product-type';

const CartModal = () => {
  const t = useTranslations('Cart');
  const { carts, changeProduct } = useCart();
  const locale = useLocale();
  const { data: cartModal } = useQuery<ModalCartType>({
    queryKey: [queryKeys.cartModal],
  });
  const { data: products } = useQuery<GetProductsType>({
    queryKey: [queryKeys.products],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}/products`,
        {
          headers: {
            'Accept-Language': locale,
          },
        }
      );
      const products = await response.json();
      return products;
    },
  });
  const setClose = () => {
    commonQueryClient.setQueryData([queryKeys.cartModal], { open: false });
  };
  if (!(cartModal && cartModal.open)) {
    return null;
  }
  const onChangeProduct = (productid: string, value: number) => {
    changeProduct(productid, value);
  };
  return (
    <Modal
      className={styles.cartModal}
      isOpen={cartModal.open}
      showClose={true}
      onClose={() => setClose()}
    >
      <div className={styles.grid}>
        <span>{t('caption')}</span>
        <span>{t('count')}</span>
        <span>{t('totalPrice')}</span>
      </div>
      {!(carts && carts.products) ||
        (carts && carts.totalCount === 0 && (
          <span className={styles.empty}>There is nothing here!</span>
        ))}
      {carts &&
        carts.products && products &&
        Object.entries(carts.products).map((p) => {
          const currProductId = p[0];
          const productInfo = products?.products.filter(
            (product) => product.id === currProductId
          );
          const { caption, price } = productInfo[0];
          return (
            <div className={styles.grid} key={currProductId}>
              <span>{caption}</span>
              <span>
                <IncreaseDecrease
                  className={styles.add}
                  value={p[1]}
                  onChange={(value) => {
                    onChangeProduct(currProductId, value);
                  }}
                />
              </span>
              <span>
                {(p[1] * price).toFixed(2)} {euro}
              </span>
            </div>
          );
        })}
    </Modal>
  );
};

export default CartModal;
