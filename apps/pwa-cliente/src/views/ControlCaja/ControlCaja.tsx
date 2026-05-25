import { useEffect, useState } from 'react';
import { Wallet, Receipt, ArrowDownToLine, ArrowUpFromLine, RefreshCw, AlertCircle, CheckCircle2, DollarSign, LogOut } from 'lucide-react';
import { CajaApi } from '../../api/caja.service';
import { usuariosService, UsuarioDto } from '../../api/usuarios.service';
import { TurnoDto } from '@org/contracts';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const ControlCaja = () => {
  const [turnoActivo, setTurnoActivo] = useState<TurnoDto | null>(null);
  const [usuariosMap, setUsuariosMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((s) => s.usuario);
  const [fondoInicial, setFondoInicial] = useState('100');
  const [montoMovimiento, setMontoMovimiento] = useState('');
  const [conceptoMovimiento, setConceptoMovimiento] = useState('');
  const [montoArqueo, setMontoArqueo] = useState('');

  const cargarTurnoYUsuarios = async () => {
    try {
      setIsLoading(true);
      const [{ turno }, usuariosList] = await Promise.all([
        CajaApi.obtenerTurnoActivo(),
        usuariosService.listar().catch(() => [] as UsuarioDto[]),
      ]);
      const map: Record<string, string> = {};
      usuariosList.forEach((u) => (map[u.id] = u.nombre));
      setUsuariosMap(map);
      setTurnoActivo(turno);
    } catch (error) {
      console.error('Error al cargar datos de caja', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { cargarTurnoYUsuarios(); }, []);

  const handleAbrirTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fondoInicial || isNaN(Number(fondoInicial))) return;
    try {
      await CajaApi.abrirTurno({ fondoInicial: Number(fondoInicial), usuarioId: user?.id || 'admin' });
      cargarTurnoYUsuarios();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al abrir turno');
    }
  };

  const handleRegistrarMovimiento = async (tipo: 'INGRESO' | 'EGRESO') => {
    if (!montoMovimiento || isNaN(Number(montoMovimiento)) || !conceptoMovimiento) return alert('Complete monto y concepto');
    try {
      await CajaApi.registrarMovimiento({ tipo, monto: Number(montoMovimiento), concepto: conceptoMovimiento, usuarioId: user?.id || 'admin' });
      setMontoMovimiento(''); setConceptoMovimiento('');
      cargarTurnoYUsuarios();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const handleCerrarTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!montoArqueo || isNaN(Number(montoArqueo))) return alert('Debe ingresar el dinero físico contado');
    if (!window.confirm('¿Está seguro de cerrar el turno?')) return;
    try {
      const res = await CajaApi.cerrarTurno({ montoReal: Number(montoArqueo), usuarioId: user?.id || 'admin' });
      alert(`Turno cerrado. Diferencia: S/ ${res.turno.diferencia}`);
      cargarTurnoYUsuarios();
      setMontoArqueo('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cerrar turno');
    }
  };

  const ventasEfectivo = turnoActivo?.transacciones?.filter((t) => t.metodo === 'EFECTIVO').reduce((sum, t) => sum + t.monto, 0) || 0;
  const ventasTarjeta = turnoActivo?.transacciones?.filter((t) => t.metodo !== 'EFECTIVO').reduce((sum, t) => sum + t.monto, 0) || 0;
  const ingresos = turnoActivo?.movimientos?.filter((m) => m.tipo === 'INGRESO').reduce((sum, m) => sum + m.monto, 0) || 0;
  const egresos = turnoActivo?.movimientos?.filter((m) => m.tipo === 'EGRESO').reduce((sum, m) => sum + m.monto, 0) || 0;
  const totalEfectivoEsperado = (turnoActivo?.fondoInicial || 0) + ventasEfectivo + ingresos - egresos;

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><Wallet className="h-8 w-8 text-primary" /> Control y Arqueo de Caja</h1>

      {!turnoActivo ? (
        <Card className="max-w-md mx-auto text-center p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2">Caja Cerrada</CardTitle>
          <p className="text-muted-foreground mb-6">Abra el turno y declare el fondo de caja inicial.</p>
          <form onSubmit={handleAbrirTurno} className="space-y-4 text-left">
            <div>
              <span className="block text-sm font-semibold mb-1">Fondo de Caja (S/)</span>
              <Input type="number" min="0" step="0.1" value={fondoInicial} onChange={(e) => setFondoInicial(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full"><Wallet className="mr-2 h-4 w-4" /> Abrir Turno</Button>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500 inline-block" /> Turno Abierto</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Iniciado: {new Date(turnoActivo.fechaApertura).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Fondo Inicial</p>
                    <p className="text-2xl font-black font-mono">S/ {turnoActivo.fondoInicial.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg"><span className="text-xs font-bold uppercase text-muted-foreground">Ventas Efectivo</span><p className="text-xl font-bold text-green-600">+S/ {ventasEfectivo.toFixed(2)}</p></div>
                  <div className="bg-muted/50 p-4 rounded-lg"><span className="text-xs font-bold uppercase text-muted-foreground">Ingresos Extra</span><p className="text-xl font-bold text-blue-600">+S/ {ingresos.toFixed(2)}</p></div>
                  <div className="bg-muted/50 p-4 rounded-lg"><span className="text-xs font-bold uppercase text-muted-foreground">Egresos</span><p className="text-xl font-bold text-red-600">-S/ {egresos.toFixed(2)}</p></div>
                  <div className="bg-muted/50 p-4 rounded-lg border border-primary/20"><span className="text-xs font-bold uppercase text-primary">Tarjeta/Otros</span><p className="text-xl font-bold">S/ {ventasTarjeta.toFixed(2)}</p></div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 flex justify-between items-center">
                  <div><h3 className="text-lg font-bold text-primary">Efectivo Esperado</h3><p className="text-sm text-muted-foreground">Fondo + Ventas Efectivo + Ingresos - Egresos</p></div>
                  <div className="text-3xl font-black text-primary font-mono">S/ {totalEfectivoEsperado.toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Historial de Caja Chica</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {turnoActivo.movimientos?.length === 0 ? <p className="text-muted-foreground text-sm text-center py-4">Sin movimientos.</p> : turnoActivo.movimientos?.map((m) => (
                  <div key={m.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${m.tipo === 'INGRESO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {m.tipo === 'INGRESO' ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
                      </div>
                      <div><p className="font-semibold text-sm">{m.concepto}</p><p className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString()} — {usuariosMap[m.usuarioId] || '?'}</p></div>
                    </div>
                    <div className={`font-bold font-mono ${m.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}>{m.tipo === 'INGRESO' ? '+' : '-'} S/ {m.monto.toFixed(2)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Panel Derecho */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Registrar Caja Chica</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><span className="text-xs font-semibold">Monto (S/)</span><Input type="number" min="0.1" step="0.1" value={montoMovimiento} onChange={(e) => setMontoMovimiento(e.target.value)} /></div>
                <div><span className="text-xs font-semibold">Concepto</span><Input value={conceptoMovimiento} onChange={(e) => setConceptoMovimiento(e.target.value)} placeholder="Ej. Compra de hielo" /></div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRegistrarMovimiento('EGRESO')}>Registrar Egreso</Button>
                  <Button variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleRegistrarMovimiento('INGRESO')}>Registrar Ingreso</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-slate-100 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><LogOut className="h-5 w-5" /> Cierre de Caja (Arqueo)</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400 mb-4">Ingrese el dinero físico contado en la gaveta.</p>
                <form onSubmit={handleCerrarTurno} className="space-y-4">
                  <div>
                    <span className="block text-sm font-semibold text-slate-300 mb-1">Efectivo Contado (S/)</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">S/</span>
                      <Input className="pl-10 bg-slate-800 border-slate-700 text-white font-bold" type="number" min="0" step="0.1" value={montoArqueo} onChange={(e) => setMontoArqueo(e.target.value)} required />
                    </div>
                  </div>
                  {montoArqueo && !isNaN(Number(montoArqueo)) && (
                    <div className={`p-3 rounded-lg text-sm font-bold border ${Number(montoArqueo) === totalEfectivoEsperado ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {Number(montoArqueo) === totalEfectivoEsperado ? (
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Caja cuadra.</span>
                      ) : (
                        <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Diferencia: S/ {(Number(montoArqueo) - totalEfectivoEsperado).toFixed(2)}</span>
                      )}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Cerrar Turno Definitivamente</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
