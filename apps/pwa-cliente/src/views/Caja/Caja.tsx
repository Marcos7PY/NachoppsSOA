import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, ArrowLeft, Loader2, CreditCard, Smartphone, Receipt, CheckCircle, Clock } from 'lucide-react';
import { 
  PedidoDto, 
  TransaccionDto, 
  MetodoPago,
  PagarPedidoCommand
} from '@org/contracts';
import { CajaApi } from '../../api/caja.service';
import { PedidosApi } from '../../api/pedidos.service';
import { Modal } from '../../components/Modal/Modal';
import styles from './Caja.module.css';

export const Caja = () => {
  const navigate = useNavigate();
  const [pedidosPendientes, setPedidosPendientes] = useState<PedidoDto[]>([]);
  const [transacciones, setTransacciones] = useState<TransaccionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedPedido, setSelectedPedido] = useState<PedidoDto | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>(MetodoPago.Efectivo);
  const [referencia, setReferencia] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [peds, trans] = await Promise.all([
        PedidosApi.obtenerPedidos(), // Deberíamos filtrar por no pagados en el futuro
        CajaApi.obtenerTransacciones()
      ]);
      // Filtramos pedidos que NO hayan sido pagados completamente
      setPedidosPendientes(peds.filter(p => p.estado !== 'PAGADO')); 
      setTransacciones(trans);
    } catch (error) {
      console.error('Error al cargar datos de caja', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handlePagar = async () => {
    if (!selectedPedido) return;
    setIsSubmitting(true);
    try {
      const command: PagarPedidoCommand = {
        pedidoId: selectedPedido.id,
        monto: selectedPedido.total,
        metodo: metodoPago,
        referencia: referencia
      };
      await CajaApi.registrarPago(command);
      
      // Opcional: Actualizar estado del pedido a ENTREGADO si se paga?
      // Por ahora solo registramos el pago
      
      setSelectedPedido(null);
      setReferencia('');
      await cargarDatos();
    } catch (error) {
      alert('Error al registrar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodIcon = (method: MetodoPago) => {
    switch (method) {
      case MetodoPago.Efectivo: return <Banknote size={24} />;
      case MetodoPago.Tarjeta: return <CreditCard size={24} />;
      case MetodoPago.Yape: 
      case MetodoPago.Plin: return <Smartphone size={24} />;
      default: return <Receipt size={24} />;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}><Banknote size={32} /> Caja y Facturación</h1>
      </header>

      {isLoading ? (
        <div className={styles.loading}><Loader2 size={40} className="spinner" /></div>
      ) : (
        <div className={styles.grid}>
          {/* Columna Izquierda: Pedidos por Cobrar */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><Clock size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Pedidos por Cobrar</h2>
            <div className={styles.orderList}>
              {pedidosPendientes.map(pedido => (
                <div key={pedido.id} className={styles.orderItem} onClick={() => setSelectedPedido(pedido)}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Mesa {pedido.numeroMesa}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{pedido.items.length} items</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>S/ {pedido.total.toFixed(2)}</div>
                    <div style={{ fontSize: '0.7rem' }}>{pedido.estado}</div>
                  </div>
                </div>
              ))}
              {pedidosPendientes.length === 0 && <p>No hay pedidos pendientes de cobro.</p>}
            </div>
          </div>

          {/* Columna Derecha: Historial Reciente */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><Receipt size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Transacciones Recientes</h2>
            <div className={styles.transaccionList}>
              {transacciones.map(t => (
                <div key={t.id} className={styles.transaccionItem}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.metodo}</div>
                    <div style={{ fontSize: '0.7rem', color: '#999' }}>{new Date(t.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#059669' }}>+ S/ {t.monto.toFixed(2)}</div>
                </div>
              ))}
              {transacciones.length === 0 && <p>No hay transacciones registradas hoy.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago */}
      <Modal 
        isOpen={!!selectedPedido} 
        onClose={() => setSelectedPedido(null)} 
        title={`Cobrar Mesa ${selectedPedido?.numeroMesa}`}
      >
        {selectedPedido && (
          <div className={styles.modalForm}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', color: '#666' }}>Total a Pagar</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                S/ {selectedPedido.total.toFixed(2)}
              </div>
            </div>

            <label className={styles.label}>Método de Pago</label>
            <div className={styles.paymentMethods}>
              {Object.values(MetodoPago).map(m => (
                <button 
                  key={m}
                  className={`${styles.methodBtn} ${metodoPago === m ? styles.active : ''}`}
                  onClick={() => setMetodoPago(m)}
                >
                  {getMethodIcon(m)}
                  {m}
                </button>
              ))}
            </div>

            {metodoPago !== MetodoPago.Efectivo && (
              <div style={{ marginTop: '1rem' }}>
                <label className={styles.label}>Referencia / Nro Operación</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej. 123456"
                />
              </div>
            )}

            <div className={styles.modalFooter} style={{ marginTop: '2rem' }}>
              <button className={styles.btnSecondary} onClick={() => setSelectedPedido(null)}>Cancelar</button>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`} 
                onClick={handlePagar}
                disabled={isSubmitting}
                style={{ flex: 1, marginLeft: '1rem' }}
              >
                {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'Registrar Cobro'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
