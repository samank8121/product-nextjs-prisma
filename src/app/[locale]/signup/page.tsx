'use client';

import React, { useState, useTransition } from 'react';
import styles from './page.module.css';
import { useTranslations } from 'next-intl';
import Input from '@/components/input/input';
import Button from '@/components/button/button';
import { register } from '@/app/actions/register';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const t = useTranslations('Login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      startTransition(() =>
        register({ username, email, password, confirmation }).then((data) => {
          if (data.userId) {
            router.push('/');
          }
        })
      );
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
        <Button loading={isPending} type='submit' className={styles.loginBtn}>
          {t('signUp')}
        </Button>
      </form>
    </div>
  );
}
