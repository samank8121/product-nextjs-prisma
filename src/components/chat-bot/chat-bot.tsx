'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import React, { useEffect, useRef } from 'react';
import { FiTrash2, FiUser, FiX } from 'react-icons/fi';
import clsx from 'clsx';
import Button from '../button/button';
import { queryKeys } from '@/shared/constant';
import { useQuery } from '@tanstack/react-query';
import commonQueryClient from '@/shared/get-query-client';
import styles from './chat-bot.module.css';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import Robot from '@/assets/user-robot.svg'

const ChatBot = () => {
  const t = useTranslations('Chat');
  const te = useTranslations('Error');
  const { data } = useQuery<{ open: boolean }>({
    queryKey: [queryKeys.chatBot],
  });
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (data && data.open) {
      inputRef.current?.focus();
    }
  }, [data]);
  const onClose = () => {
    commonQueryClient.setQueryData([queryKeys.chatBot], { open: false });
  };
  const lastMessageIsUser = messages[messages.length - 1]?.role === 'user';

  return (
    <div
      className={clsx(
        styles.chaBot,
        data && data.open ? styles.fixed : styles.hidden
      )}
    >
      <button onClick={onClose} className={styles.close}>
        <FiX />
      </button>
      <div className={styles.content}>
        <div className={styles.scroll} ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: t('thinking'),
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: te('somethingWrong'),
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className={styles.empty}>
              <Robot/>
              {t('empty')}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Button
            title={t('clear')}
            type='button'
            onClick={() => setMessages([])}
          >
            <FiTrash2 />
          </Button>
          <input
            className={styles.input}
            value={input}
            onChange={handleInputChange}
            placeholder={t('search')}
            ref={inputRef}
          />
          <Button type='submit'>{t('send')}</Button>
        </form>
      </div>
    </div>
  );
};

const ChatMessage = ({
  message: { role, content },
}: {
  message: Pick<Message, 'role' | 'content'>;
}) => {
  const isAiMessage = role === 'assistant';  

  return (
    <div
      className={clsx(
        styles.messageContainer,
        isAiMessage ? styles.start : styles.end
      )}
    >
      {isAiMessage && <Robot className={styles.robot} />}
      
      <div className={styles.message}>
        <ReactMarkdown
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            a: ({ node, ...props }) => (
              <a {...props} target='_blank' rel='noopener noreferrer' />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {!isAiMessage && <FiUser />}
    </div>
  );
};

export default ChatBot;
