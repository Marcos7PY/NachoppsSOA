import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CrearReservaCommand } from '@org/contracts';
import styles from './ReservaFormModal.module.css';
import { useAuthStore } from '../../store/auth.store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearReservaCommand) => Promise<void>;
}

export const ReservaFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const usuario = useAuthStore((state) => state.usuario);
  
  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteTelefono: '',
    fecha: '',
    hora: '',
    numComensales: 2,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        clienteId: usuario?.id || 'anonimo', // En un sistema real el cliente podría tener un ID, aquí usamos el del empleado que registra si es presencial, o un placeholder.
      });
      onClose(); // Cerrar al tener éxito
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Hubo un error al crear la reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numComensales' ? parseInt(value) : value,
    }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nueva Reserva</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del Cliente</label>
              <input
                type="text"
                name="clienteNombre"
                className={styles.input}
                value={formData.clienteNombre}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input
                type="tel"
                name="clienteTelefono"
                className={styles.input}
                value={formData.clienteTelefono}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Ej. +51 999 888 777"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  className={styles.input}
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Hora</label>
                <input
                  type="time"
                  name="hora"
                  className={styles.input}
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Comensales</label>
              <input
                type="number"
                name="numComensales"
                min="1"
                max="20"
                className={styles.input}
                value={formData.numComensales}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnSubmit}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={20} className="spinner" /> : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
