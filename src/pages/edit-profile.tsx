import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from '../firebase/firebase'; // ✅ Usa instâncias já inicializadas
import { onAuthStateChanged, updateProfile, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const EditProfilePage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>('/user-placeholder.png');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || 'Usuário');
        setEmail(user.email || '');

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().profileImage) {
          setProfileImage(userDoc.data().profileImage);
        } else {
          setProfileImage('/user-placeholder.png');
        }
      } else {
        setUserName('Usuário');
        setProfileImage('/user-placeholder.png');
        setEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }

      if (newPassword && newPassword !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64Image = reader.result as string;

          await setDoc(doc(db, 'users', user.uid), {
            profileImage: base64Image
          }, { merge: true });

          await updateProfile(user, {
            displayName: userName,
            photoURL: `/users/${user.uid}/profile-image`,
          });

          if (newPassword) {
            await updatePassword(user, newPassword);
          }

          setSuccess('Perfil atualizado com sucesso!');
          setLoading(false);
        };
      } else {
        await updateProfile(user, {
          displayName: userName,
          photoURL: profileImage,
        });

        if (newPassword) {
          await updatePassword(user, newPassword);
        }

        setSuccess('Perfil atualizado com sucesso!');
        setLoading(false);
      }
    } catch (err) {
      setError('Erro ao atualizar o perfil.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-box">
        <div className="profile-image-section">
          <div className="profile-image-container">
            <img src={profileImage} alt="Foto do usuário" className="profile-image" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="image-upload" />
          </div>
        </div>
        <div className="profile-input-section">
          <h1>Editar Perfil</h1>
          <div className="profile-input-container">
            <label htmlFor="userName">Nome:</label>
            <input type="text" id="userName" value={userName || ''} onChange={handleNameChange} className="profile-input" />
          </div>
          <div className="profile-input-container">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email || ''} onChange={handleEmailChange} className="profile-input" />
          </div>
          <div className="profile-input-container">
            <label htmlFor="newPassword">Nova Senha:</label>
            <input type="password" id="newPassword" value={newPassword} onChange={handlePasswordChange} className="profile-input" />
          </div>
          <div className="profile-input-container">
            <label htmlFor="confirmPassword">Confirmar Senha:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className="profile-input" />
          </div>
          <button onClick={handleSave} disabled={loading} className="save-button">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <Link href="/home" className="home-link">Voltar para a Home</Link>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
