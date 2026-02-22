import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick
}) => {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        rounded-2xl p-6
        ${hover ? 'cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300' : 'shadow-md'}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};