import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Plus, ArrowLeft, Loader2, ShoppingCart, Trash2, CheckCircle, Split } from 'lucide-react';
import { 
  PedidoDto, 
  ProductoDto, 
  MesaDto, 
  CrearPedidoCommand, 
  PedidoEstado,
  ModificadorItem
} from '@org/contracts';
import { PedidosApi } from '../../api/pedidos.service';
import { InventarioApi } from '../../api/inventario.service';
import { MesasApi } from '../../api/mesas.service';
import { Modal } from '../../components/Modal/Modal';
import styles from './Pedidos.module.css';

export const Pedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoDto[]>([]);
  const [productos, setProductos] = useState<ProductoDto[]>([]);
  const [mesas, setMesas] = useState<MesaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  
  // Modales
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoDto | null>(null);

  // Formulario de nuevo pedido
  const [mesaId, setMesaId] = useState('');
  const [cart, setCart] = useState<{ 
    productoId: string; 
    nombre: string; 
    cantidad: number; 
    precio: number;
    modificadores: ModificadorItem[];
    notas: string;
  }[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [peds, prods, mss] = await Promise.all([
        PedidosApi.obtenerPedidos(),
        InventarioApi.obtenerProductos(),
        MesasApi.obtenerMesas()
      ]);
      setPedidos(peds);
      setProductos(prods);
      setMesas(mss.filter(m => m.estado === 'LIBRE'));
      
      // Inicializar la categoría seleccionada con la primera disponible si existe
      const uniqueCats = Array.from(new Set(prods.map(p => p.categoria?.nombre || 'Otros')));
      if (uniqueCats.length > 0) {
        setSelectedCategory(uniqueCats[0]);
      }
    } catch (error) {
      console.error('Error al cargar datos de pedidos', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const addToCart = (prod: ProductoDto) => {
    const existing = cart.find(item => item.productoId === prod.id);
    
    // VALIDACIÓN DE STOCK EN EL FRONTEND
    if (prod.stockActual !== null) {
      const currentQty = existing ? existing.cantidad : 0;
      if (currentQty >= prod.stockActual) {
        alert(`Stock insuficiente para ${prod.nombre}. Stock disponible: ${prod.stockActual}`);
        return;
      }
    }

    if (existing) {
      setCart(cart.map(item => 
        item.productoId === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        productoId: prod.id, 
        nombre: prod.nombre, 
        cantidad: 1, 
        precio: prod.precio,
        modificadores: [],
        notas: ''
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.productoId !== id));
  };

  const addModifier = (productoId: string, nombre: string) => {
    setCart(cart.map(item => 
      item.productoId === productoId 
        ? { ...item, modificadores: [...item.modificadores, { nombre }] } 
        : item
    ));
  };

  const handleCrearPedido = async () => {
    if (!mesaId) {
      alert('Por favor, selecciona una mesa para la comanda.');
      return;
    }
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega al menos un producto a la comanda.');
      return;
    }
    setIsSubmitting(true);
    try {
      const command: CrearPedidoCommand = {
        mesaId,
        items: cart.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          notas: item.notas,
          modificadores: item.modificadores
        }))
      };
      await PedidosApi.crearPedido(command);
      setIsNewOrderModalOpen(false);
      setCart([]);
      setMesaId('');
      await cargarDatos();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'Error al crear pedido';
      alert(`Error al crear pedido: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: PedidoEstado) => {
    try {
      await PedidosApi.actualizarEstado(id, { estado: nuevoEstado });
      await cargarDatos();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}><Utensils size={32} /> Comandas y Pedidos</h1>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setIsNewOrderModalOpen(true)}>
          <Plus size={18} /> Nueva Comanda
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}><Loader2 size={40} className="spinner" /></div>
      ) : (
        <div className={styles.grid}>
          {pedidos.map(pedido => (
            <div key={pedido.id} className={styles.pedidoCard}>
              <div className={styles.pedidoHeader}>
                <span className={styles.mesaInfo}>Mesa {pedido.numeroMesa || '?'}</span>
                <span className={`${styles.estadoBadge} ${styles[pedido.estado]}`}>
                  {pedido.estado}
                </span>
              </div>
              <div className={styles.itemList}>
                {pedido.items.map((item, idx) => (
                  <div key={idx}>
                    <div className={styles.item}>
                      <span>{item.cantidad}x {item.nombre}</span>
                      <span>S/ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                    </div>
                    {item.modificadores?.map((m, midx) => (
                      <div key={midx} className={styles.itemModifiers}>+ {m.nombre}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div className={styles.total}>Total: S/ {pedido.total.toFixed(2)}</div>
              
              <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {pedido.estado === 'PENDIENTE' && (
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary}`} 
                    onClick={() => handleCambiarEstado(pedido.id, 'EN_PREPARACION' as PedidoEstado)}
                    style={{ flex: 1 }}
                  >
                    Atender
                  </button>
                )}
                {pedido.estado === 'EN_PREPARACION' && (
                  <button 
                    className={`${styles.btn}`} 
                    onClick={() => handleCambiarEstado(pedido.id, 'LISTO' as PedidoEstado)}
                    style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white' }}
                  >
                    Terminar
                  </button>
                )}
                {pedido.estado === 'LISTO' && (
                  <button 
                    className={`${styles.btn}`} 
                    onClick={() => handleCambiarEstado(pedido.id, 'ENTREGADO' as PedidoEstado)}
                    style={{ flex: 1, backgroundColor: '#10b981', color: 'white' }}
                  >
                    Entregar
                  </button>
                )}
                <button 
                  className={styles.btn} 
                  onClick={() => { setSelectedPedido(pedido); setIsSplitModalOpen(true); }}
                  style={{ background: '#eee' }}
                >
                  <Split size={18} />
                </button>
              </div>
            </div>
          ))}
          {pedidos.length === 0 && <p>No hay pedidos activos.</p>}
        </div>
      )}

      {/* Modal Nuevo Pedido */}
      <Modal isOpen={isNewOrderModalOpen} onClose={() => setIsNewOrderModalOpen(false)} title="Nueva Comanda">
        <div className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Seleccionar Mesa</label>
            <select 
              className={styles.input} 
              value={mesaId} 
              onChange={(e) => setMesaId(e.target.value)}
            >
              <option value="">-- Elegir Mesa --</option>
              {mesas.map(m => (
                <option key={m.id} value={m.id}>Mesa {m.numero} ({m.capacidad} pers.)</option>
              ))}
            </select>
            {mesas.length === 0 && (
              <p style={{ color: '#d97706', fontSize: '0.85rem', marginTop: '0.35rem', fontWeight: 600 }}>
                ⚠️ No hay mesas libres disponibles. Por favor, libera una mesa desde el Mapa de Mesas.
              </p>
            )}
          </div>

          {/* Pestañas de Categorías */}
          <div className={styles.categoryTabs}>
            <button 
              type="button"
              className={`${styles.tabButton} ${selectedCategory === 'TODOS' ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory('TODOS')}
            >
              Todos
            </button>
            {Array.from(new Set(productos.map(p => p.categoria?.nombre || 'Otros'))).map(cat => (
              <button
                type="button"
                key={cat}
                className={`${styles.tabButton} ${selectedCategory === cat ? styles.activeTab : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.productSelector}>
            {Object.entries(
              productos.reduce((acc, prod) => {
                const catName = prod.categoria?.nombre || 'Otros';
                if (!acc[catName]) acc[catName] = [];
                acc[catName].push(prod);
                return acc;
              }, {} as Record<string, ProductoDto[]>)
            )
              .filter(([categoria]) => selectedCategory === 'TODOS' || categoria === selectedCategory)
              .map(([categoria, items]) => (
                <div key={categoria} className={styles.categoryGroup}>
                  <h3 className={styles.categoryTitle}>{categoria}</h3>
                  <div className={styles.categoryGrid}>
                    {items.map(prod => {
                      const sinStock = prod.stockActual !== null && prod.stockActual <= 0;
                      return (
                        <div 
                          key={prod.id} 
                          className={`${styles.productItem} ${sinStock ? styles.noStock : ''}`} 
                          onClick={() => !sinStock && addToCart(prod)}
                          title={sinStock ? 'Sin stock disponible' : ''}
                        >
                          <div style={{ fontWeight: 700 }}>{prod.nombre}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>S/ {prod.precio.toFixed(2)}</span>
                            {prod.stockActual !== null && (
                              <span className={styles.stockLabel}>Stock: {prod.stockActual}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.selectedItems}>
            <h3>Items en Comanda</h3>
            {cart.map(item => (
              <div key={item.productoId} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                  <span>{item.cantidad}x <strong>{item.nombre}</strong></span>
                  <button onClick={() => removeFromCart(item.productoId)} style={{ color: 'red', background: 'none', border: 'none' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.modifierInput}>
                  <input 
                    type="text" 
                    placeholder="Agregar modificador (ej. Sin cebolla)" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addModifier(item.productoId, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className={styles.input}
                    style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                  />
                </div>
                {item.modificadores.map((m, i) => (
                  <div key={i} className={styles.itemModifiers}>- {m.nombre}</div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <div style={{ marginRight: 'auto', fontWeight: 800, fontSize: '1.2rem' }}>
              Subtotal: S/ {cart.reduce((s, i) => s + (i.precio * i.cantidad), 0).toFixed(2)}
            </div>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCrearPedido} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal División de Cuenta */}
      <Modal isOpen={isSplitModalOpen} onClose={() => setIsSplitModalOpen(false)} title="Dividir Cuenta">
        {selectedPedido && (
          <div className={styles.modalForm}>
            <p>Mesa {selectedPedido.numeroMesa} - Total: S/ {selectedPedido.total.toFixed(2)}</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                className={styles.btn} 
                style={{ background: 'var(--color-primary)', color: 'white' }}
                onClick={async () => {
                  const res = await PedidosApi.dividirCuenta(selectedPedido.id, { metodo: 'IGUALES', numPartes: 2 });
                  alert(`Sugerencia: 2 partes de S/ ${res.partes[0].monto.toFixed(2)} c/u`);
                  setIsSplitModalOpen(false);
                }}
              >
                Dividir en 2 Partes Iguales
              </button>
              <button 
                className={styles.btn} 
                style={{ background: '#eee' }}
                onClick={async () => {
                  const res = await PedidosApi.dividirCuenta(selectedPedido.id, { metodo: 'POR_ITEMS' });
                  alert('División por comensales calculada. Ver consola.');
                  console.log(res);
                  setIsSplitModalOpen(false);
                }}
              >
                Dividir por Items / Comensales
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
