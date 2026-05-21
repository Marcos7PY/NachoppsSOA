import React, { useEffect, useState, useMemo } from 'react';
import { ChefHat, CheckCircle2, ArrowRight, Clock, Loader2, RefreshCw, Filter } from 'lucide-react';
import { PedidosApi } from '../../api/pedidos.service';
import { PedidoDto, PedidoEstado } from '@org/contracts';
import { useAuthStore } from '../../store/auth.store';
import { io } from 'socket.io-client';

interface FlatItem {
  pedidoId: string;
  mesaId: string;
  numeroMesa?: number;
  pedidoCreatedAt: string;
  itemId: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  notas?: string;
  estado: PedidoEstado;
  area?: string;
}

type EstacionType = 'TODAS' | 'COCINA' | 'BAR';

export const Cocina = () => {
  const [flatItems, setFlatItems] = useState<FlatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [estacionActiva, setEstacionActiva] = useState<EstacionType>('TODAS');

  const cargarPedidos = async () => {
    try {
      setIsLoading(true);
      const pedidos = await PedidosApi.obtenerPedidos();
      
      const items: FlatItem[] = [];
      pedidos.forEach(p => {
        if (p.estado !== PedidoEstado.Entregado && p.estado !== 'PAGADO') {
          p.items.forEach(i => {
            const estadoItem = i.estado || PedidoEstado.Pendiente;
            if (estadoItem !== PedidoEstado.Entregado) {
              items.push({
                pedidoId: p.id,
                mesaId: p.mesaId,
                numeroMesa: p.numeroMesa,
                pedidoCreatedAt: p.createdAt || new Date().toISOString(),
                itemId: i.id!,
                productoId: i.productoId,
                nombre: i.nombre,
                cantidad: i.cantidad,
                notas: i.notas,
                estado: estadoItem,
                area: i.area || 'COCINA'
              });
            }
          });
        }
      });

      items.sort((a, b) => new Date(a.pedidoCreatedAt).getTime() - new Date(b.pedidoCreatedAt).getTime());
      
      setFlatItems(items);
    } catch (error) {
      console.error('Error cargando KDS', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
    
    const token = useAuthStore.getState().token;
    const socket = io('http://localhost:8000', {
      path: '/notificaciones/socket.io',
      query: { jwt: token },
      extraHeaders: { Authorization: `Bearer ${token}` }
    });

    socket.on('connect', () => {
      console.log('KDS conectado a WebSockets en tiempo real');
    });

    socket.on('pedidoUpdate', (data) => {
      console.log('Notificación recibida en KDS:', data);
      cargarPedidos();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const advanceStatus = async (item: FlatItem) => {
    let nextStatus: PedidoEstado;
    if (item.estado === PedidoEstado.Pendiente) {
      nextStatus = PedidoEstado.EnPreparacion;
    } else if (item.estado === PedidoEstado.EnPreparacion) {
      nextStatus = PedidoEstado.Listo;
    } else {
      nextStatus = PedidoEstado.Entregado;
    }

    setFlatItems(prev => prev.map(i => i.itemId === item.itemId ? { ...i, estado: nextStatus } : i));

    try {
      await PedidosApi.actualizarEstadoItem(item.itemId, { estado: nextStatus });
    } catch (error) {
      cargarPedidos();
      alert('Error al actualizar estado');
    }
  };

  const getBorderColor = (status: PedidoEstado) => {
    switch (status) {
      case PedidoEstado.Pendiente: return 'border-l-4 border-slate-500';
      case PedidoEstado.EnPreparacion: return 'border-l-4 border-orange-500 bg-orange-50';
      case PedidoEstado.Listo: return 'border-l-4 border-primary bg-primary/10';
      default: return 'border-border';
    }
  };

  const getStatusText = (status: PedidoEstado) => {
    switch (status) {
      case PedidoEstado.Pendiente: return 'En Cola';
      case PedidoEstado.EnPreparacion: return 'Preparando...';
      case PedidoEstado.Listo: return '¡LISTO!';
      default: return status;
    }
  };

  const activeItems = useMemo(() => {
    let items = flatItems.filter(i => i.estado !== PedidoEstado.Entregado);
    if (estacionActiva !== 'TODAS') {
      items = items.filter(i => i.area === estacionActiva);
    }
    return items;
  }, [flatItems, estacionActiva]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
            Monitor de Preparación (KDS)
          </h1>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setEstacionActiva('TODAS')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${estacionActiva === 'TODAS' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              Todas las Estaciones
            </button>
            <button 
              onClick={() => setEstacionActiva('COCINA')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${estacionActiva === 'COCINA' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              🔥 Cocina
            </button>
            <button 
              onClick={() => setEstacionActiva('BAR')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${estacionActiva === 'BAR' ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              🍸 Barra
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={cargarPedidos} className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted transition-colors">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-1.5 rounded-full font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Sincronizado
          </div>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <CheckCircle2 className="w-24 h-24 mb-4 opacity-20" />
          <p className="text-xl font-medium">Todo limpio. No hay pedidos pendientes en {estacionActiva === 'TODAS' ? 'ninguna estación' : `la estación de ${estacionActiva}`}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeItems.map(item => (
            <div 
              key={item.itemId}
              className={`bg-card rounded-xl shadow-sm hover:shadow-md p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 border border-border ${getBorderColor(item.estado)}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-black text-xl text-foreground">
                    Mesa {item.numeroMesa}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" />
                      {new Date(item.pedidoCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.area === 'BAR' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.area === 'BAR' ? 'BARRA' : 'COCINA'}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xl font-bold flex items-start gap-2 leading-tight">
                    <span className="text-muted-foreground text-base mt-0.5 font-black">x{item.cantidad}</span>
                    {item.nombre}
                  </div>
                  {item.notas && (
                    <div className="mt-3 bg-amber-50 text-amber-800 p-2.5 rounded-lg text-sm italic border border-amber-200/50 shadow-sm">
                      <span className="font-semibold not-italic mr-1">📝 Nota:</span>
                      {item.notas}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-dashed border-border">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado</span>
                  <span className={`font-black uppercase text-sm ${item.estado === PedidoEstado.EnPreparacion ? 'text-orange-600' : item.estado === PedidoEstado.Listo ? 'text-primary' : 'text-slate-600'}`}>
                    {getStatusText(item.estado)}
                  </span>
                </div>

                <button 
                  onClick={() => advanceStatus(item)}
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    item.estado === PedidoEstado.Pendiente ? 'bg-slate-700 hover:bg-slate-800' :
                    item.estado === PedidoEstado.EnPreparacion ? 'bg-orange-500 hover:bg-orange-600' :
                    'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {item.estado === PedidoEstado.Pendiente && <span>Empezar Preparación</span>}
                  {item.estado === PedidoEstado.EnPreparacion && <span>Marcar como Listo</span>}
                  {item.estado === PedidoEstado.Listo && <span>Despachar (Entregar)</span>}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
