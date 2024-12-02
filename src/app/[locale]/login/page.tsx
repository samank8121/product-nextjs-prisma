'use client';

import React, { startTransition, useState } from 'react';
import styles from './page.module.css';
import { useTranslations } from 'next-intl';
import Input from '@/components/input/input';
import Button from '@/components/button/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/app/actions/login';

export default function Login() {
  const t = useTranslations('Login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const router = useRouter();
  const onLogin = async () => {
    try {
      startTransition(() =>
        login({ username, password }).then((data) => {
          console.log('onLogin', data);
          if (data.user?.id) {
            router.push('/');
          }
        })
      );      
    } catch (error) {
      setHasError(true);
      console.error(error);
    }
  };
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Input
          label={t('username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label={t('password')}
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {hasError&&<span className={styles.error}>{t('error')}</span>}
        <Link href="./signup">{t('signUp')}</Link>
        <Button className={styles.loginBtn} onClick={onLogin}>
          {t('login')}
        </Button>
      </div>
    </div>
  );
}
