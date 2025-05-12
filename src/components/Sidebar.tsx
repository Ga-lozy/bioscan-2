import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface AnimalFormData {
  id?: string;
  name: string;
  species: string;
  minTemp: number;
  maxTemp: number;
  enclosure: string;
}

interface SidebarProps {
  onAddAnimal: () => void;
  animals: AnimalFormData[];
  selectedAnimal: AnimalFormData | null;
  onSelectAnimal: (animal: AnimalFormData) => void;
  onEditAnimal: (animal: AnimalFormData) => void;
  onDeleteAnimal: (id?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddAnimal,
  animals,
  selectedAnimal,
  onSelectAnimal,
  onEditAnimal,
  onDeleteAnimal,
}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>('/user-placeholder.png');

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyCL-Fc-7vGyK18p9sKScFOMinPPBemD4YY",
      authDomain: "bioscan-3a35d.firebaseapp.com",
      projectId: "bioscan-3a35d",
      storageBucket: "bioscan-3a35d.firebasestorage.app",
      messagingSenderId: "313864447217",
      appId: "1:313864447217:web:c19179104b57a62fa03550",
      measurementId: "G-QLSDL8MPXD"
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || 'Usuário');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().profileImage) {
          setProfileImage(userDoc.data().profileImage);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="sidebar">
      <div className="user-profile">
        <Link href="/edit-profile">
          <img src={profileImage} alt="Foto do usuário" className="user-photo clickable-image" />
        </Link>
        <p className="user-name">{userName}</p>
      </div>

      {/* Lista de animais com ações */}
      <div className="animal-buttons">
        {animals.map((animal) => (
          <div key={animal.id} className="animal-item">
            <button
              className={`animal-button ${selectedAnimal?.id === animal.id ? 'selected' : ''}`}
              onClick={() => onSelectAnimal(animal)}
            >
              {animal.name}
            </button>
            <div className="action-icons">
              <button className="edit-button" onClick={() => onEditAnimal(animal)} title="Editar">
                ✏️
              </button>
              <button className="delete-button" onClick={() => onDeleteAnimal(animal.id)} title="Excluir">
                ❌
              </button>
            </div>
          </div>
        ))}

        <div className="add-button-container">
          <button className="add-button" onClick={onAddAnimal}>
            <div className="icon-container">
              <Image src="/pata-de-felino.png" alt="Pata de felino" width={50} height={50} />
            </div>
            <span className="button-text">Adicionar animal</span>
          </button>
        </div>
      </div>

      <div className="about-link">
        <Link href="/about">
          Sobre o projeto Bioscan
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
