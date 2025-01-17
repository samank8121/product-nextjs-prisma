import { CartType } from '@/types/cart-type';
import commonQueryClient from '../get-query-client';
import { queryKeys } from '../constant';
import { useQuery } from '@tanstack/react-query';
import { fetchUtil } from '../utils/fetch-util';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { AuthInfo } from '@/types/auth-info';
import { useEffect } from 'react';

export const useCart = () => {
  const router = useRouter();
  const locale = useLocale();
  const { data: auth } = useQuery<AuthInfo>({
    queryKey: [queryKeys.authInfo],
  });
  const { data: carts, refetch } = useQuery<CartType>({
    queryKey: [queryKeys.cart],
    queryFn: async () => {
      if (auth && auth.token) {
        const response = await fetchUtil(
          `${process.env.NEXT_PUBLIC_API_ADDRESS}cart`,
          {
            authToken: auth.token,
          }
        );
        const data = await response.json();
        return { products: data.products, totalCount: data.totalCount };
      } else {
        return { products: {}, totalCount: 0 };
      }
    },
  });
  useEffect(() => {
    if (auth && auth.token) {
      refetch();
    }
  }, [auth, refetch]);

  const changeProduct = async (productid: number, value: number) => {
    if (!(auth && auth.token)) {
      router.push(`/${locale}/login`);
    }
    const currentKey = productid.toString();
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}cart`,
      {
        method: 'POST',
        data: { productId: productid, count: value },
        authToken: auth?.token,
      }
    );
    if (response.ok) {
      commonQueryClient.setQueryData<CartType>(
        [queryKeys.cart],
        (oldData?: CartType) => {
          if (oldData) {
            const products = { ...oldData.products, [currentKey]: value };

            const sum = Object.entries(products).reduce(
              (accumulator, currentValue) => accumulator + currentValue[1],
              0
            );

            return {
              products: Object.fromEntries(
                Object.entries(products).filter(([, value]) => value !== 0)
              ),
              totalCount: sum,
            };
          }
          return {
            products: { [currentKey]: value },
            totalCount: 1,
          };
        }
      );
      return true;
    }
    return false;
  };
  const getProductCount = (productid: number): number => {
    if (carts && carts.products) {
      const result = Object.entries(carts.products).filter(
        (key) => key[0].toString() === productid.toString()
      );
      return result && result.length > 0 ? (result[0][1] as number) : 0;
    } else return 0;
  };

  return { carts, changeProduct, getProductCount, refetch };
};
