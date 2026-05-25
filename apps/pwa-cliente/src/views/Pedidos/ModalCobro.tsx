import { useState } from 'react';
import { Banknote, CreditCard, Smartphone, CheckCircle2, X, Loader2, Plus, Receipt } from 'lucide-react';
import { PedidoDto, MetodoPago, PagoMixtoItem, PedidoEstado } from '@org/contracts';
import { CajaApi } from '../../api/caja.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../../components/ui/dialog';

const paymentMethods = [
  { id: MetodoPago.Efectivo, name: 'Efectivo', icon: Banknote },
  { id: MetodoPago.Tarjeta, name: 'Tarjeta', icon: CreditCard },
  { id: MetodoPago.Yape, name: 'Yape / Plin', icon: Smartphone },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);

export const ModalCobro = ({
  pedidos,
  mesaName,
  onClose,
  onSuccess,
}: {
  pedidos: PedidoDto[];
  mesaName: string;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const pedidosPendientes = pedidos.filter((p) => p.estado !== PedidoEstado.Pagado);
  const totalDeuda = pedidosPendientes.reduce((acc, p) => acc + (p.total - p.montoPagado), 0);

  const [pagosParciales, setPagosParciales] = useState<PagoMixtoItem[]>([]);
  const [currentMethod, setCurrentMethod] = useState<MetodoPago>(MetodoPago.Efectivo);
  const [currentAmount, setCurrentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentInputAmount = parseFloat(currentAmount) || 0;
  const totalPagado = pagosParciales.reduce((acc, p) => acc + p.monto, 0);
  const remainingDebt = Math.max(0, totalDeuda - totalPagado);
  const vuelto = Math.max(0, totalPagado + currentInputAmount - totalDeuda);

  const handleAddPayment = () => {
    if (currentInputAmount <= 0) return;
    setPagosParciales([...pagosParciales, { metodo: currentMethod, monto: currentInputAmount }]);
    setCurrentAmount('');
  };

  const confirmPayment = async () => {
    let finalPagos = [...pagosParciales];
    if (currentInputAmount > 0) finalPagos.push({ metodo: currentMethod, monto: currentInputAmount });
    if (finalPagos.length === 0) return;

    setIsSubmitting(true);
    try {
      let pagosDisponibles = finalPagos.map((p) => ({ ...p }));
      for (const pedido of pedidosPendientes) {
        let deudaPedido = pedido.total - pedido.montoPagado;
        if (deudaPedido <= 0) continue;
        const pagosParaEstePedido: PagoMixtoItem[] = [];
        for (let i = 0; i < pagosDisponibles.length; i++) {
          if (deudaPedido <= 0) break;
          const pago = pagosDisponibles[i];
          if (pago.monto <= 0) continue;
          const montoAUsar = Math.min(deudaPedido, pago.monto);
          pagosParaEstePedido.push({ metodo: pago.metodo, monto: montoAUsar });
          deudaPedido -= montoAUsar;
          pago.monto -= montoAUsar;
        }
        if (pagosParaEstePedido.length > 0) {
          await CajaApi.registrarPago({ pedidoId: pedido.id, pagos: pagosParaEstePedido });
        }
      }
      onSuccess();
    } catch (error: any) {
      alert(`Error al registrar el pago: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Cobrar {mesaName}</DialogTitle>
          <DialogDescription>
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg mt-2">
              <span className="text-base">Total a Pagar:</span>
              <span className="text-2xl font-black text-foreground font-mono">{formatCurrency(totalDeuda)}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          {/* Pagos ya agregados */}
          {pagosParciales.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Pagos Agregados</div>
              <div className="bg-muted/30 rounded-lg border divide-y">
                {pagosParciales.map((pago, index) => (
                  <div key={index} className="flex justify-between items-center p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize bg-card">{pago.metodo}</Badge>
                      <span className="font-mono font-bold">{formatCurrency(pago.monto)}</span>
                    </div>
                    <button
                      onClick={() => setPagosParciales(pagosParciales.filter((_, i) => i !== index))}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulario nuevo pago */}
          {remainingDebt > 0 && (
            <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-sm">Falta por cubrir: {formatCurrency(remainingDebt)}</span>
                <button
                  onClick={() => setCurrentAmount(remainingDebt.toFixed(2))}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Usar restante
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = currentMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setCurrentMethod(method.id)}
                      className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-bold">{method.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">S/.</span>
                  <Input
                    type="number"
                    step="0.10"
                    className="pl-10 h-10 font-bold text-lg"
                    placeholder="0.00"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPayment()}
                  />
                </div>
                <Button onClick={handleAddPayment} disabled={currentInputAmount <= 0}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
              </div>
            </div>
          )}

          {/* Estado cubierto */}
          {remainingDebt === 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-bold text-lg">Cuenta Cubierta</span>
              </div>
              {vuelto > 0 && (
                <div className="text-right">
                  <span className="text-xs text-green-600 font-bold uppercase block">Vuelto</span>
                  <span className="text-3xl font-black text-green-700 font-mono">{formatCurrency(vuelto)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-lg h-12 shadow-lg"
            disabled={remainingDebt > 0 || isSubmitting}
            onClick={confirmPayment}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Receipt className="h-5 w-5 mr-2" />
            )}
            Confirmar Cobro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
