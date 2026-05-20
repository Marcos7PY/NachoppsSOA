import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Plus, ArrowLeft, Loader2, Users } from 'lucide-react';
import { MesaDto, CrearMesaCommand, MesaEstado } from '@org/contracts';
import { MesasApi } from '../../api/mesas.service';
import { Modal } from '../../components/Modal/Modal';
import styles from './Mesas.module.css';

export const Mesas = () => {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState<MesaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newMesa, setNewMesa] = useState<CrearMesaCommand>({
    numero: 1,
    capacidad: 4,
    ubicacion: 'Salon Principal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarMesas = async () => {
    try {
      setIsLoading(true);
      const data = await MesasApi.obtenerMesas();
      setMesas(data);
    } catch (error) {
      console.error('Error al cargar mesas', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarMesas();
  }, []);

  const handleCreateMesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await MesasApi.crearMesa(newMesa);
      setIsModalOpen(false);
      setNewMesa({ numero: mesas.length + 2, capacidad: 4, ubicacion: 'Salon Principal' });
      await cargarMesas();
    } catch (error) {
      alert('Error al crear mesa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstadoClass = (estado: MesaEstado) => {
    switch (estado) {
      case MesaEstado.Libre: return styles.estadoLibre;
      case MesaEstado.Ocupada: return styles.estadoOcupada;
      case MesaEstado.Reservada: return styles.estadoReservada;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <LayoutGrid size={28} className={styles.titleIcon} />
          <h1 className={styles.title}>Mapa de Mesas</h1>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nueva Mesa
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>
          <Loader2 size={40} className="spinner" />
        </div>
      ) : (
        <div className={styles.grid}>
          {mesas.map((mesa) => (
            <div key={mesa.id} className={styles.mesaCard}>
              <span className={styles.mesaNumero}>{mesa.numero}</span>
              <div className={styles.mesaCapacidad}>
                <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {mesa.capacidad}
              </div>
              <span className={`${styles.estadoBadge} ${getEstadoClass(mesa.estado)}`}>
                {mesa.estado}
              </span>
              {mesa.ubicacion && (
                <span style={{ fontSize: '0.7rem', color: '#999' }}>{mesa.ubicacion}</span>
              )}
            </div>
          ))}
          {mesas.length === 0 && (
            <p>No hay mesas registradas aún.</p>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar Nueva Mesa">
        <form onSubmit={handleCreateMesa} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Número de Mesa</label>
              <input
                type="number"
                className={styles.input}
                value={newMesa.numero}
                onChange={(e) => setNewMesa({ ...newMesa, numero: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Capacidad (pax)</label>
              <input
                type="number"
                className={styles.input}
                value={newMesa.capacidad}
                onChange={(e) => setNewMesa({ ...newMesa, capacidad: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ubicación / Zona</label>
            <input
              type="text"
              className={styles.input}
              value={newMesa.ubicacion}
              onChange={(e) => setNewMesa({ ...newMesa, ubicacion: e.target.value })}
              placeholder="Ej. Terraza, Segundo Piso..."
            />
          </div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.btnSecondary} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'Registrar Mesa'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
