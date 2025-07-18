import React from "react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface SharedBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const SharedBreadcrumbs: React.FC<SharedBreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>›</span>}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default SharedBreadcrumbs;
