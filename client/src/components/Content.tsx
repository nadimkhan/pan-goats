import React from 'react';

interface ContentProps {
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({children}) => {
  return <main className="bg-white h-screen">{children}</main>;
};

export default Content;
