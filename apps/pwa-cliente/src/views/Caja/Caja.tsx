import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, ArrowLeft, Loader2, CreditCard, Smartphone, Receipt, CheckCircle2, Coins, AlertCircle, Check, X } from 'lucide-react';
import { 
  PedidoDto, 
  TransaccionDto, 
  MetodoPago,
  PagarPedidoCommand,
  PagoMixtoItem
} from '@org/contracts';
import { CajaApi } from '../../api/caja.service';
import { PedidosApi } from '../../api/pedidos.service';

const paymentMethods = [
  { id: MetodoPago.Efectivo, name: 'Efectivo', icon: Banknote },
  { id: MetodoPago.Tarjeta, name: 'Tarjeta', icon: CreditCard },
  { id: MetodoPago.Yape, name: 'Yape / Plin', icon: Smartphone },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};

export const Caja = () => {
  const navigate = useNavigate();
  const [pedidosPendientes, setPedidosPendientes] = useState<PedidoDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedPedido, setSelectedPedido] = useState<PedidoDto | null>(null);
  
  // Mixed Payments State
  const [pagosParciales, setPagosParciales] = useState<PagoMixtoItem[]>([]);
  const [currentMethod, setCurrentMethod] = useState<MetodoPago>(MetodoPago.Efectivo);
  const [currentAmount, setCurrentAmount] = useState<string>('');
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const peds = await PedidosApi.obtenerPedidos();
      setPedidosPendientes(peds.filter(p => p.estado !== 'PAGADO'));
    } catch (error) {
      console.error('Error al cargar datos de caja', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const totalOrder = selectedPedido?.total || 0;
  const totalPagado = useMemo(() => pagosParciales.reduce((acc, p) => acc + p.monto, 0), [pagosParciales]);
  const currentInputAmount = parseFloat(currentAmount) || 0;
  const totalTendered = totalPagado + currentInputAmount;
  const change = totalTendered > totalOrder ? totalTendered - totalOrder : 0;
  const remainingDebt = totalOrder - totalPagado;

  const handleAddPayment = () => {
    if (currentInputAmount <= 0) return;
    setPagosParciales([...pagosParciales, { monto: currentInputAmount, metodo: currentMethod }]);
    setCurrentAmount('');
  };

  const handleRemovePayment = (index: number) => {
    setPagosParciales(pagosParciales.filter((_, i) => i !== index));
  };

  const setExactAmount = () => {
    if (remainingDebt > 0) {
      setCurrentAmount(remainingDebt.toFixed(2));
    }
  };

  const processPayment = async () => {
    if (!selectedPedido) return;
    
    // Add the current input if it's greater than 0 and not added yet
    const finalPagos = [...pagosParciales];
    if (currentInputAmount > 0) {
      finalPagos.push({ monto: currentInputAmount, metodo: currentMethod });
    }

    if (finalPagos.reduce((a, b) => a + b.monto, 0) < totalOrder) {
      alert("El monto total es insuficiente para cubrir la cuenta.");
      return;
    }

    setIsSubmitting(true);
    try {
      const command: PagarPedidoCommand = {
        pedidoId: selectedPedido.id,
        pagos: finalPagos,
      };
      await CajaApi.registrarPago(command);
      
      setIsConfirmOpen(false);
      setSelectedPedido(null);
      setPagosParciales([]);
      setCurrentAmount('');
      await cargarDatos();
    } catch (error) {
      alert('Error al registrar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  // VISTA LISTADO DE PEDIDOS PENDIENTES
  if (!selectedPedido) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Caja Central</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pedidosPendientes.map(pedido => (
                <div 
                  key={pedido.id} 
                  onClick={() => setSelectedPedido(pedido)}
                  className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Mesa {pedido.numeroMesa}</span>
                      <h3 className="text-xl font-black text-foreground">Ticket #{pedido.id.substring(0,6)}</h3>
                    </div>
                    <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <Receipt className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {pedido.items.length} productos comandados
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">{pedido.estado}</span>
                    <span className="text-2xl font-black text-primary">{formatCurrency(pedido.total)}</span>
                  </div>
                </div>
              ))}
              {pedidosPendientes.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No hay tickets pendientes de cobro.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // VISTA DE COBRO DETALLADO (Split Screen Laravel Style)
  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      
      {/* Lado Izquierdo: Resumen del Ticket */}
      <div className="w-full lg:w-5/12 xl:w-1/3 bg-muted/30 border-b lg:border-b-0 lg:border-r border-border p-6 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-sm">
          <button onClick={() => { setSelectedPedido(null); setPagosParciales([]); }} className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver a las mesas
          </button>

          <div className="bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden">
            <div className="p-6 text-center border-b border-dashed border-border">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Receipt className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide">NachoPps SOA</h2>
              <p className="text-muted-foreground text-sm mt-1">Ticket #{selectedPedido.id.split('-')[0]}</p>
              <div className="mt-3">
                <span className="inline-block border border-dashed border-muted-foreground/30 px-4 py-1 rounded-full text-sm font-semibold">
                  Mesa {selectedPedido.numeroMesa}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {selectedPedido.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold w-6 text-right">{item.cantidad}x</span>
                      <span className="text-foreground leading-tight">{item.nombre}</span>
                    </div>
                    <div className="font-mono font-medium">
                      {formatCurrency(item.precioUnitario * item.cantidad)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 p-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-muted-foreground">TOTAL</span>
                <span className="text-3xl font-black text-primary tracking-tight">
                  {formatCurrency(totalOrder)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Procesador de Pago */}
      <div className="w-full lg:w-7/12 xl:w-2/3 p-6 lg:p-12 flex flex-col justify-center bg-background overflow-y-auto">
        <div className="max-w-xl mx-auto w-full space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Procesar Pago</h1>
            <p className="text-muted-foreground">Seleccione el método e ingrese el monto. Puede combinar múltiples pagos.</p>
          </div>

          <div className="space-y-8">
            
            {/* Payment Methods */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Método de Pago</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  const isSelected = currentMethod === method.id;
                  return (
                    <div 
                      key={method.id}
                      onClick={() => setCurrentMethod(method.id)}
                      className={`relative cursor-pointer group border rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:border-primary/50 hover:bg-muted ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5 shadow-sm' : 'border-border bg-card'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary animate-in zoom-in-50 duration-200">
                          <CheckCircle2 className="w-5 h-5" fill="currentColor" />
                        </div>
                      )}
                      <Icon className={`w-8 h-8 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                      <span className={`font-bold text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{method.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold">Monto Recibido</label>
                <button onClick={setExactAmount} className="text-primary font-semibold text-sm hover:underline">
                  Usar restante exacto ({formatCurrency(remainingDebt)})
                </button>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-2xl font-black text-muted-foreground pb-1">S/</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.10"
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                    className="w-full pl-16 h-20 text-4xl font-black tabular-nums bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground/30 transition-all"
                    placeholder="0.00" 
                  />
                </div>
                <button 
                  onClick={handleAddPayment}
                  disabled={currentInputAmount <= 0}
                  className="h-20 px-6 rounded-xl bg-secondary text-secondary-foreground font-bold border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Pagos Agregados (Pago Mixto) */}
            {pagosParciales.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Pagos Registrados</label>
                <div className="space-y-2">
                  {pagosParciales.map((pago, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-card border border-border rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-bold">{pago.metodo}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-lg">{formatCurrency(pago.monto)}</span>
                        <button onClick={() => handleRemovePayment(index)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals & Change */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col justify-center">
                <span className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Pagado</span>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalPagado + currentInputAmount)}</div>
              </div>

              <div className={`p-4 rounded-xl border transition-colors duration-300 flex flex-col justify-center ${change > 0 ? 'bg-primary/10 border-primary/30' : change < 0 && totalTendered > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/30 border-border'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase ${change < 0 ? 'text-destructive' : 'text-primary'}`}>
                    {change < 0 ? 'Falta' : 'Vuelto'}
                  </span>
                  {change > 0 && <Coins className="w-3 h-3 text-primary" />}
                </div>
                <div className={`text-2xl font-black font-mono ${change < 0 ? 'text-destructive' : 'text-primary'}`}>
                  {formatCurrency(change > 0 ? change : remainingDebt - currentInputAmount > 0 ? remainingDebt - currentInputAmount : 0)}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsConfirmOpen(true)}
              disabled={isSubmitting || totalTendered < totalOrder}
              className="w-full h-16 rounded-xl bg-primary text-primary-foreground text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Receipt className="w-6 h-6" /> Confirmar Pago Completo</>}
            </button>

          </div>
        </div>
      </div>

      {/* Modal Confirmación */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Cerrar Ticket</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-muted-foreground text-sm">Verifique que el monto sea correcto y se haya entregado el vuelto antes de continuar.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg flex flex-col justify-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase mb-1">Monto de la Orden</span>
                  <span className="text-xl font-bold">{formatCurrency(totalOrder)}</span>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg flex flex-col justify-center col-span-2">
                  <span className="text-xs font-bold text-primary uppercase mb-1">Vuelto a Entregar al Cliente</span>
                  <span className="text-3xl font-black text-primary">{formatCurrency(change)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 flex gap-3 justify-end">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="px-6 py-2 rounded-lg font-semibold border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={processPayment}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Efectuar Pago</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
