import React, { useState } from 'react';
import SignInForm from '../forms/SignInForm';
import SignUpForm from '../forms/SignUpForm';
import logo from '../../assets/images/logo.png';


const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 space-y-8">
        <div className="flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-32 h-32"/>
        </div>
        <div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <span
                className={`cursor-pointer px-4 py-2 ${activeTab === 'signin' ? 'underline font-semibold' : ''}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </span>
              <span
                className={`cursor-pointer px-4 py-2 ${activeTab === 'signup' ? 'underline font-semibold' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </span>
            </div>
            {activeTab === 'signin' && <SignInForm />}
            {activeTab === 'signup' && <SignUpForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
