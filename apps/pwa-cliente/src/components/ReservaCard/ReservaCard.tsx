import React from 'react';
import { Calendar, Clock, Users, Check, X } from 'lucide-react';
import { ReservaDto, ReservaEstado } from '@org/contracts';
import styles from './ReservaCard.module.css';

interface Props {
  reserva: ReservaDto;
  onConfirmar: (id: string) => void;
  onCancelar: (id: string) => void;
}

export const ReservaCard: React.FC<Props> = ({ reserva, onConfirmar, onCancelar }) => {
  const getBadgeClass = (estado: string) => {
    switch (estado) {
      case ReservaEstado.Confirmada:
        return styles.badgeConfirmed;
      case ReservaEstado.Cancelada:
        return styles.badgeCancelled;
      default:
        return styles.badgePending;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.clientName}>{reserva.clienteNombre}</h3>
          <span className={styles.clientPhone}>{reserva.clienteTelefono}</span>
        </div>
        <span className={`${styles.badge} ${getBadgeClass(reserva.estado)}`}>
          {reserva.estado}
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Calendar size={16} className={styles.detailIcon} />
          {reserva.fecha}
        </div>
        <div className={styles.detailItem}>
          <Clock size={16} className={styles.detailIcon} />
          {reserva.hora}
        </div>
        <div className={styles.detailItem}>
          <Users size={16} className={styles.detailIcon} />
          {reserva.numComensales}
        </div>
      </div>

      {reserva.estado === ReservaEstado.Pendiente && (
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnConfirm}`}
            onClick={() => onConfirmar(reserva.id)}
          >
            <Check size={16} /> Confirmar
          </button>
          <button
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={() => onCancelar(reserva.id)}
          >
            <X size={16} /> Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
