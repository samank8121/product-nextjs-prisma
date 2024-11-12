'use client';

import clsx from 'clsx';
import React from 'react';
import styles from './chat-bot-icon.module.css';
import Span from '../clickable-span/clickable-span';
import { queryKeys } from '@/shared/constant';
import commonQueryClient from '@/shared/getQueryClient';
import Robot from '@/assets/user-robot.svg'

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
      <Robot />      
    </Span>
  );
};

ChatbotIcon.displayName = 'ChatbotIcon';

export default ChatbotIcon;
