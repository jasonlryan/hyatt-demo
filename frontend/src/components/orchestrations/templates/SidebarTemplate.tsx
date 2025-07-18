import React from 'react';

export interface SidebarTemplateProps {
  mainContent: React.ReactNode;
  sidebarContent: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
}

export const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  mainContent,
  sidebarContent,
  sidebarPosition = 'right',
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {sidebarPosition === 'left' && <div className="col-span-4">{sidebarContent}</div>}
      <div className="col-span-8">{mainContent}</div>
      {sidebarPosition === 'right' && <div className="col-span-4">{sidebarContent}</div>}
    </div>
  );
};

