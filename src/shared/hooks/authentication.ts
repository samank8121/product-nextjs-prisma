import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from '../constant';
import { AuthInfo } from '@/types/auth-info';

export type Header = {
  Authorization: string;
};

export const useAuthentication = () => {
  const router = useRouter();
  const { data: auth } = useQuery<AuthInfo>({
    queryKey: [queryKeys.authInfo],
  });
  const isAuthenticated = () => {
    if (auth && auth.token) {
      return true;
    } else {
      router.push('/login');
    }
  };
  const getHeader = (token?: string): Header => {
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {
      Authorization: `Bearer ${auth?.token}`,
    };
  };

  return { isAuthenticated, getHeader };
};
