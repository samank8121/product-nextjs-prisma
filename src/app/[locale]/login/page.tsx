/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

import React, { useState } from 'react';
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
  const session = useSession();
  const router = useRouter();
  const onLogin = async () => {
    try {
      const result = await login({ username, password });
      console.log('onLogin result', result);   
      console.log(session.data);
    } catch (error) {
      setHasError(true);
      console.error(error);
    }
  };
  const onGithub = async () => {
    try {
      signIn('github',{callbackUrl:'http://localhost:3000/'});
      //console.log("onGithub", result);
    } catch (error) {
      console.error(error);
    }
  };
  const onSignout = async () => {
    try {
      const result = await signOut();
      console.log("onSignout", result);
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
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {hasError && <span className={styles.error}>{t('error')}</span>}
          <Link href='./signup'>{t('signUp')}</Link>
          <Button className={styles.loginBtn} onClick={onLogin}>
            {t('login')}
          </Button>
          <Button className={styles.loginBtn} onClick={onGithub}>
            Github
          </Button>
          <Button className={styles.loginBtn} onClick={onSignout}>
            Signout
          </Button>
        </div>
      </div>

  );
}
