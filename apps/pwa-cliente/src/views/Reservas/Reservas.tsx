import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus, ArrowLeft, Loader2, CalendarX2 } from 'lucide-react';
import { ReservaDto, CrearReservaCommand } from '@org/contracts';
import { ReservasApi } from '../../api/reservas.service';
import { ReservaCard } from '../../components/ReservaCard/ReservaCard';
import { ReservaFormModal } from '../../components/ReservaFormModal/ReservaFormModal';
import styles from './Reservas.module.css';

export const Reservas = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<ReservaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarReservas = async () => {
    try {
      setIsLoading(true);
      const data = await ReservasApi.obtenerReservas();
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCrearReserva = async (data: CrearReservaCommand) => {
    await ReservasApi.crearReserva(data);
    await cargarReservas(); // Recargar lista
  };

  const handleConfirmar = async (id: string) => {
    try {
      await ReservasApi.confirmarReserva(id);
      await cargarReservas();
    } catch (error) {
      console.error('Error al confirmar', error);
      alert('Error al confirmar la reserva');
    }
  };

  const handleCancelar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;
    try {
      await ReservasApi.cancelarReserva(id, 'Cancelado por el usuario');
      await cargarReservas();
    } catch (error) {
      console.error('Error al cancelar', error);
      alert('Error al cancelar la reserva');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <CalendarDays size={28} className={styles.titleIcon} />
          <h1 className={styles.title}>Gestión de Reservas</h1>
        </div>
        <button className={styles.newButton} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nueva Reserva
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>
          <Loader2 size={40} className="spinner" />
        </div>
      ) : (
        <div className={styles.grid}>
          {reservas.length === 0 ? (
            <div className={styles.emptyState}>
              <CalendarX2 size={48} className={styles.emptyIcon} />
              <h3>No hay reservas registradas</h3>
              <p>Haz clic en "Nueva Reserva" para empezar.</p>
            </div>
          ) : (
            reservas.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                onConfirmar={handleConfirmar}
                onCancelar={handleCancelar}
              />
            ))
          )}
        </div>
      )}

      <ReservaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCrearReserva}
      />
    </div>
  );
};
