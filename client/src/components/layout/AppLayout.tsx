import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from '../Content';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <div className="fixed z-10 h-full">
        <Sidebar />
      </div>
      <div className="ml-64 flex flex-col w-full">
        <Header />
        <Content>{children}</Content>
        <Footer />
      </div>
    </div>
  );
};


export default AppLayout;
