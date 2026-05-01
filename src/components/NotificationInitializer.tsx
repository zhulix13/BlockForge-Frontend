import React from 'react';
import { useNotificationStream } from '../hooks/useNotificationStream';

/**
 * NotificationInitializer handles the real-time notification connection.
 * It is placed inside AuthInitializer to ensure the user is authenticated.
 */
const NotificationInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useNotificationStream();
  return <>{children}</>;
};

export default NotificationInitializer;
