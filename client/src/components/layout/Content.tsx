// Content.tsx
import React from 'react';

interface ContentProps {
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <main className="flex-grow p-4 px-4">
      {children}
    </main>
  );
};

export default Content;
