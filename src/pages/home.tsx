// src/pages/home.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AnimalForm from '../components/AnimalForm';
import CameraView from '../components/CameraView';
import Image from 'next/image';

// Firestore
import { db } from '../firebase/firebase'; // seu init do Firebase
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

export interface AnimalFormData {
  id?: string;
  name: string;
  species: string;
  minTemp: number;
  maxTemp: number;
  enclosure: string;
}

const HomePage: React.FC = () => {
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [animals, setAnimals] = useState<AnimalFormData[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalFormData | null>(null);

  // 1) Fetch inicial
  useEffect(() => {
    const fetchAnimals = async () => {
      const snap = await getDocs(collection(db, 'animals'));
      const list = snap.docs.map(d => ({
  id: d.id,
  ...(d.data() as Omit<AnimalFormData, 'id'>)
}));

      setAnimals(list);
    };
    fetchAnimals();
  }, []);

  // 2) Abrir form (novo ou editar)
  const handleAddAnimal = () => {
    setSelectedAnimal(null);
    setShowAnimalForm(true);
  };
  const handleEditAnimal = (animal: AnimalFormData) => {
    setSelectedAnimal(animal);
    setShowAnimalForm(true);
  };

  // 3) Submissão (Create ou Update)
  const handleAnimalSubmit = async (data: AnimalFormData) => {
    if (data.id) {
      // update
      const ref = doc(db, 'animals', data.id);
      await updateDoc(ref, {
        name: data.name,
        species: data.species,
        minTemp: data.minTemp,
        maxTemp: data.maxTemp,
        enclosure: data.enclosure,
      });
      setAnimals((prev) =>
        prev.map((a) => (a.id === data.id ? data : a))
      );
    } else {
      // create
      const docRef = await addDoc(collection(db, 'animals'), {
        name: data.name,
        species: data.species,
        minTemp: data.minTemp,
        maxTemp: data.maxTemp,
        enclosure: data.enclosure,
      });
      data.id = docRef.id;
      setAnimals((prev) => [...prev, data]);
    }

    setSelectedAnimal(data);
    setShowAnimalForm(false);
  };

  // 4) Delete
  const handleDeleteAnimal = async (id?: string) => {
    if (!id) return;
    await deleteDoc(doc(db, 'animals', id));
    setAnimals((prev) => prev.filter((a) => a.id !== id));
    setSelectedAnimal(null);
  };

  const handleCancelForm = () => {
    setShowAnimalForm(false);
  };

  return (
    <div className="home-container">
      <Sidebar
        onAddAnimal={handleAddAnimal}
        animals={animals}
        selectedAnimal={selectedAnimal}
        onSelectAnimal={(a) => {
          setSelectedAnimal(a);
          setShowAnimalForm(false);
        }}
        onEditAnimal={handleEditAnimal}
        onDeleteAnimal={handleDeleteAnimal}
      />

      <div className="main-content">
        {/* Imagem inicial */}
        {!showAnimalForm && !selectedAnimal && (
          <Image
            src="/background(1).png"
            className="onca-verde"
            alt="Onça verde"
            layout="fill"
            objectFit="cover"
            priority
          />
        )}

        {/* Formulário */}
        {showAnimalForm && (
          <AnimalForm
            initialData={selectedAnimal || undefined}
            onSubmit={handleAnimalSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {/* Card + câmera */}
        {selectedAnimal && !showAnimalForm && (
          <div className="animal-info">
            <CameraView />
            <div className="animal-card">
              <h2>{selectedAnimal.name}</h2>
              <p><strong>Espécie:</strong> {selectedAnimal.species}</p>
              <p><strong>Recinto:</strong> {selectedAnimal.enclosure}</p>
              <p>
                <strong>Temperatura:</strong> {selectedAnimal.minTemp}°C a {selectedAnimal.maxTemp}°C
              </p>
              <button onClick={() => handleEditAnimal(selectedAnimal)}>Editar</button>
              <button onClick={() => handleDeleteAnimal(selectedAnimal.id)}>Excluir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
