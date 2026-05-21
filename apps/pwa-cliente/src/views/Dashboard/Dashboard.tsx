import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, LayoutDashboard, CalendarDays, Package, LayoutGrid, Banknote, ShieldCheck, ChefHat } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

export const Dashboard = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const navigate = useNavigate();

  const cards = [
    { 
      title: 'Caja y Pagos', 
      desc: 'Registra pagos, arqueos y ventas del día.', 
      icon: Banknote, 
      path: '/caja',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      title: 'Monitor de Cocina', 
      desc: 'Gestiona la preparación (KDS).', 
      icon: ChefHat, 
      path: '/cocina',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    { 
      title: 'Comandas', 
      desc: 'Toma pedidos y añade modificadores.', 
      icon: Utensils, 
      path: '/pedidos',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      title: 'Mesas y Salón', 
      desc: 'Mapa de mesas y su estado en tiempo real.', 
      icon: LayoutGrid, 
      path: '/mesas',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      title: 'Reservas', 
      desc: 'Agenda y confirma asistencias.', 
      icon: CalendarDays, 
      path: '/reservas',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      title: 'Inventario', 
      desc: 'Menú, precios y control de stock.', 
      icon: Package, 
      path: '/inventario',
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Panel de Control
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido de nuevo, <span className="font-semibold text-foreground">{usuario?.nombre}</span>.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
          <ShieldCheck className="w-5 h-5" />
          Sesión Activa ({usuario?.rol})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer bg-card border border-border hover:border-primary/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
