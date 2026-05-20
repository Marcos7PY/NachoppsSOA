import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../components/Modal/Modal';
import { CategoriaDto, CrearCategoriaCommand, CrearProductoCommand } from '@org/contracts';
import styles from './Inventario.module.css';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearCategoriaCommand) => Promise<void>;
}

export const CategoryFormModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ nombre, descripcion });
      setNombre('');
      setDescripcion('');
      onClose();
    } catch (error) {
      alert('Error al crear categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Categoría">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre de la Categoría</label>
          <input
            type="text"
            className={styles.input}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej. Bebidas, Entradas..."
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Descripción (Opcional)</label>
          <input
            type="text"
            className={styles.input}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Breve descripción..."
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.btnSecondary} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearProductoCommand) => Promise<void>;
  categoriaId: string;
}

export const ProductFormModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, categoriaId }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stockActual: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, categoriaId });
      setFormData({ nombre: '', descripcion: '', precio: 0, stockActual: 0 });
      onClose();
    } catch (error) {
      alert('Error al crear producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stockActual' ? parseFloat(value) : value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Producto">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre del Producto</label>
          <input
            type="text"
            name="nombre"
            className={styles.input}
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej. Ceviche de Pescado"
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Descripción</label>
          <input
            type="text"
            name="descripcion"
            className={styles.input}
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ingredientes o detalles..."
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Precio (S/)</label>
            <input
              type="number"
              name="precio"
              step="0.10"
              min="0"
              className={styles.input}
              value={formData.precio}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Stock Inicial</label>
            <input
              type="number"
              name="stockActual"
              min="0"
              className={styles.input}
              value={formData.stockActual}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.btnSecondary} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'Crear Producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
