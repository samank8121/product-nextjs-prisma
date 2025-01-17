'use client';

import clsx from 'clsx';
import React from 'react';
import { FiShoppingCart  } from 'react-icons/fi';
import styles from './cart.module.css';
import Span from '../clickable-span/clickable-span';
import { queryKeys } from '@/shared/constant';
import commonQueryClient from '@/shared/get-query-client';
import { useCart } from '@/shared/hooks/cart';
export type EventStopPropagation = 'none' | 'click'|'touch'|'all';

export type CartProps = {
  className?: string;
};

const Cart: React.FC<CartProps> = ({
  className
}) => {
  const { carts } = useCart();
  const onClick = () => {
    commonQueryClient.setQueryData([queryKeys.cartModal], { open: true });
  };

  return (
    <Span className={clsx(styles.cart, className)} onClick={onClick}>
      <FiShoppingCart />
      <span className={styles.items} data-test="cart-count">
        {carts && carts.totalCount ? carts.totalCount : 0}
      </span>
    </Span>
  );
};

Cart.displayName = 'Cart';

export default Cart;
