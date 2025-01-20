'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { useLocale, useTranslations } from 'next-intl';
import Input from '@/components/input/input';
import Button from '@/components/button/button';
import { useRouter } from 'next/navigation';
import { fetchUtil } from '@/shared/utils/fetch-util';
import { getFieldErrorsAsString } from '@/shared/utils/get-field-errors';
import commonQueryClient from '@/shared/get-query-client';
import { queryKeys } from '@/shared/constant';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
   const [error, setError] = useState('');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Login');

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { username, email, password, confirmation };
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}auth/signup`,
        { method: 'POST', data, locale }
      );
      const responseJson = await response.json();
      if (response.ok) {
        setError('');
        if (responseJson.token) {
          commonQueryClient.setQueryData([queryKeys.authInfo], responseJson);
          router.push('/');          
        }
      } else {
        if (responseJson.error && responseJson.error.fieldErrors) {
          setError(getFieldErrorsAsString(responseJson.error));
        } else {
          setError(responseJson.error);
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <div className={styles.signup}>
      <form className={styles.container} onSubmit={onSignup}>
        <Input
          label={t('username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label={t('password')}
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label={t('rePassword')}
          type='password'
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
         {error && (
          <div
            className={styles.error}
            dangerouslySetInnerHTML={{ __html: error }}
          />
        )}
        <Button type='submit' className={styles.loginBtn}>
          {t('signUp')}
        </Button>
      </form>
    </div>
  );
}