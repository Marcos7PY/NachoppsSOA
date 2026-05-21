import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Plus, ArrowLeft, Loader2, Users, AlertTriangle } from 'lucide-react';
import { MesaDto, CrearMesaCommand, MesaEstado } from '@org/contracts';
import { MesasApi } from '../../api/mesas.service';

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
      setMesas(data.sort((a,b) => a.numero - b.numero));
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

  const getBorderColor = (estado: MesaEstado) => {
    switch (estado) {
      case MesaEstado.Libre: return 'border-t-4 border-t-primary';
      case MesaEstado.Ocupada: return 'border-t-4 border-t-orange-500 bg-orange-50/30';
      case MesaEstado.Reservada: return 'border-t-4 border-t-blue-500';
      default: return 'border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <LayoutGrid className="w-8 h-8 text-primary" />
              Mapa de Mesas
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" /> Nueva Mesa
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mesas.map((mesa) => (
              <div 
                key={mesa.id} 
                className={`bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center text-center transition-all hover:shadow-md ${getBorderColor(mesa.estado)}`}
              >
                <div className="w-16 h-16 rounded-full bg-muted/50 border-4 border-background shadow-inner flex items-center justify-center mb-4">
                  <span className="text-2xl font-black text-foreground">{mesa.numero}</span>
                </div>
                
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
                  mesa.estado === MesaEstado.Libre ? 'bg-primary/10 text-primary' : 
                  mesa.estado === MesaEstado.Ocupada ? 'bg-orange-100 text-orange-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {mesa.estado}
                </span>

                <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium mb-1">
                  <Users className="w-4 h-4" /> {mesa.capacidad} pax
                </div>
                {mesa.ubicacion && (
                  <div className="text-xs text-muted-foreground/70">{mesa.ubicacion}</div>
                )}

                {mesa.estado === MesaEstado.Ocupada && (
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if(confirm('¿Forzar liberación de esta mesa?')) {
                        try {
                          await MesasApi.actualizarEstado(mesa.id, { estado: MesaEstado.Libre });
                          await cargarMesas();
                        } catch (err: any) {
                          alert('Error al liberar mesa');
                        }
                      }
                    }}
                    className="mt-4 text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors w-full flex items-center justify-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" /> Liberar
                  </button>
                )}
              </div>
            ))}
            
            {mesas.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No hay mesas registradas en el local.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold">Agregar Nueva Mesa</h3>
            </div>
            
            <form onSubmit={handleCreateMesa} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Número de Mesa</label>
                  <input
                    type="number"
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={newMesa.numero}
                    onChange={(e) => setNewMesa({ ...newMesa, numero: parseInt(e.target.value) })}
                    required min="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Capacidad</label>
                  <input
                    type="number"
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={newMesa.capacidad}
                    onChange={(e) => setNewMesa({ ...newMesa, capacidad: parseInt(e.target.value) })}
                    required min="1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ubicación / Zona</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={newMesa.ubicacion}
                  onChange={(e) => setNewMesa({ ...newMesa, ubicacion: e.target.value })}
                  placeholder="Ej. Terraza..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
