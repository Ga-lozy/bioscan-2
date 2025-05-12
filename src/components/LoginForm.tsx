import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('home');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: username,
        });
        alert('Cadastro realizado com sucesso!');
      }
    } catch (error) {
      alert('Erro: ' + (error as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser && !result.user.photoURL) {
        await updateProfile(result.user, {
          photoURL: '/user-placeholder.png'
        });
      }
      
      router.push('home');
    } catch (error) {
      alert('Erro ao fazer login com Google: ' + (error as Error).message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      alert('Erro ao enviar e-mail de redefinição de senha: ' + (error as Error).message);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetEmailSent(false);
    setIsLogin(true);
  };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px 0'
    }}>
      <form onSubmit={isForgotPassword ? handleForgotPassword : handleAuth} style={{ width: '100%' }}>
        {!isLogin && !isForgotPassword && (
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '95%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#1E9C60',
              color: '#f0f0f0',
            }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '95%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#1E9C60',
            color: '#f0f0f0',
          }}
        />
        {!isForgotPassword && (
          <div style={{ position: 'relative', width: '95%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0 5px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#1E9C60',
                color: '#f0f0f0',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#f0f0f0',
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        )}
        {/* Alteração aqui - Só mostra "Esqueceu a senha?" no login */}
        {isLogin && !isForgotPassword && !resetEmailSent && (
          <div style={{ width: '95%', textAlign: 'right', marginBottom: '10px' }}>
            <p
              onClick={() => setIsForgotPassword(true)}
              style={{
                color: '#1E9C60',
                fontSize: '14px',
                cursor: 'pointer',
                margin: '0',
              }}
            >
              Esqueceu a senha?
            </p>
          </div>
        )}
        {resetEmailSent ? (
          <>
            <p style={{ 
              width: '95%',
              color: '#1E9C60', 
              textAlign: 'center', 
              margin: '10px auto'
            }}>
              Um e-mail de redefinição de senha foi enviado para o endereço fornecido.
            </p>
            <button
              type="button"
              onClick={handleBackToLogin}
              style={{
                width: '95%',
                padding: '10px',
                margin: '5px auto 0',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#1E9C60',
                color: '#f0f0f0',
                cursor: 'pointer',
                display: 'block'
              }}
            >
              Voltar para o login
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              style={{
                width: '95%',
                padding: '10px',
                margin: '5px auto 0',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#1E9C60',
                color: '#f0f0f0',
                cursor: 'pointer',
                display: 'block'
              }}
            >
              {isForgotPassword ? 'Enviar E-mail de Redefinição' : isLogin ? 'Login' : 'Criar Conta'}
            </button>
            <p
              onClick={isForgotPassword ? handleBackToLogin : () => setIsLogin(!isLogin)}
              style={{
                width: '95%',
                margin: '10px auto 5px',
                color: '#1E9C60',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {isForgotPassword ? 'Voltar para login' : isLogin ? 'Não tem uma conta? Crie uma conta' : 'Já tem uma conta? Faça login'}
            </p>
          </>
        )}
      </form>
      
      {isLogin && !isForgotPassword && !resetEmailSent && (
        <div style={{ width: '95%', margin: '5px auto 0' }}>
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#DB4437',
              color: '#f0f0f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <FaGoogle /> Entrar com Google
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;