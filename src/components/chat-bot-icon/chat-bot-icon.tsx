'use client';

import clsx from 'clsx';
import React from 'react';
import { FiServer  } from 'react-icons/fi';
import styles from './chat-bot-icon.module.css';
import Span from '../clickable-span/clickable-span';
import { queryKeys } from '@/shared/constant';
import commonQueryClient from '@/shared/getQueryClient';

export type ChatbotIconProps = {
  className?: string;
};

const ChatbotIcon: React.FC<ChatbotIconProps> = ({
  className
}) => {
  const onClick = () => {
    commonQueryClient.setQueryData([queryKeys.chatBot], { open: true });
  };

  return (
    <Span className={clsx(styles.chatBotIcon, className)} onClick={onClick}>
      <FiServer />      
    </Span>
  );
};

ChatbotIcon.displayName = 'ChatbotIcon';

export default ChatbotIcon;
