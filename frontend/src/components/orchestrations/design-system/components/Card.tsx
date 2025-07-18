import React from 'react';
import { orchestrationTokens } from '../tokens';
import { Action } from '../../core/types';

export interface CardProps {
  title?: string;
  status?: 'active' | 'inactive' | 'pending';
  actions?: Action[];
  className?: string;
  children: React.ReactNode;
}

const statusColors: Record<string, string> = {
  active: 'border-green-500',
  inactive: 'border-gray-300',
  pending: 'border-yellow-500',
};

export const Card: React.FC<CardProps> = ({
  title,
  status,
  actions,
  className = '',
  children,
}) => {
  return (
    <div
      className={`border p-4 ${status ? statusColors[status] : 'border-gray-200'} ${
        orchestrationTokens.borders.radius.md
      } ${className}`}
    >
      {title && (
        <h3 className={`${orchestrationTokens.typography.heading2} mb-2`}>{title}</h3>
      )}
      {children}
      {actions && (
        <div className="mt-2 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

