import React from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <img src="/logoD.png" alt="Logo" className="logo" />
            <h1 className="login-title">BioScan</h1>
          </div>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;