import React, { useState, useEffect } from 'react';
import { FaPaw, FaThermometerHalf, FaSave, FaTimes } from 'react-icons/fa';

interface AnimalData {
  id?: string;
  name: string;
  species: string;
  minTemp: number;
  maxTemp: number;
  enclosure: string;
}

interface AnimalFormProps {
  initialData?: AnimalData;
  onSubmit: (data: AnimalData) => void;
  onCancel: () => void;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AnimalData>({
    id: undefined,
    name: '',
    species: 'onca-pintada',
    minTemp: 22,
    maxTemp: 28,
    enclosure: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Temp') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="animal-form-overlay">
      <div className="animal-form-wrapper">
        <div className="animal-form-header">
          <h2><FaPaw /> {initialData ? 'Editar Animal' : 'Registrar Animal'}</h2>
          <button onClick={onCancel} className="close-button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="animal-form-horizontal">
          <div className="form-left">
            <div className="form-group">
              <label>Nome do Animal:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Espécie:</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                disabled
              >
                <option value="onca-pintada">Onça-Pintada (Panthera onca)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Recinto:</label>
              <input
                type="text"
                name="enclosure"
                value={formData.enclosure}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label><FaThermometerHalf /> Temp. Mínima (°C):</label>
                <input
                  type="number"
                  name="minTemp"
                  value={formData.minTemp}
                  onChange={handleChange}
                  min="10"
                  max="40"
                  required
                />
              </div>
              <div className="form-group">
                <label><FaThermometerHalf /> Temp. Máxima (°C):</label>
                <input
                  type="number"
                  name="maxTemp"
                  value={formData.maxTemp}
                  onChange={handleChange}
                  min="10"
                  max="40"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-right">
            <button type="submit" className="submit-button">
              <FaSave /> {initialData ? 'Salvar Alterações' : 'Salvar Dados'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalForm;
