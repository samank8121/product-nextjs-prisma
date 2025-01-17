/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Input from '@/components/input/input';
import Button from '@/components/button/button';
import { useRouter } from 'next/navigation';
import { queryKeys } from '@/shared/constant';
import { fetchUtil } from '@/shared/utils/fetch-util';
import commonQueryClient from '@/shared/get-query-client';
import { useQuery } from '@tanstack/react-query';
import { AuthInfo } from '@/types/auth-info';
import { useLocale } from 'next-intl';
import { getFieldErrorsAsString } from '@/shared/utils/get-field-errors';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: auth } = useQuery<AuthInfo>({
    queryKey: [queryKeys.authInfo],
  });
  const locale = useLocale();
  if (auth && auth.token) {
    router.push('/');
  }

  const onLogin = async () => {
    const data = { username, password };
    try {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}auth/login`,
        { method: 'POST', data, locale }
      );
      const responseJson = await response.json();
      if (response.ok) {
        commonQueryClient.setQueryData([queryKeys.authInfo], responseJson);
        router.push('/');
      } else {
        if (responseJson.error && responseJson.error.fieldErrors) {
          setError(getFieldErrorsAsString(responseJson.error));
        } else {
          setError(responseJson.error);
        }
      }
    } catch (error) {
      setError('error');
    }
  };
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Input
          label='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label='password'
          value={password}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className={styles.error} dangerouslySetInnerHTML={{ __html: error }}/>}
        <a href='./signup'>signUp</a>
        <Button className={styles.loginBtn} onClick={onLogin}>
          login
        </Button>
      </div>
    </div>
  );
}
