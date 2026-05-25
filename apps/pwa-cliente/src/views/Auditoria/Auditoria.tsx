import { useEffect, useState, useMemo } from 'react';
import { Shield, RefreshCw, Loader2, Search } from 'lucide-react';
import { auditoriaService, AuditoriaLogDto } from '../../api/auditoria.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

const getAccionBadge = (accion: string) => {
  if (accion.includes('LOGIN')) return <Badge className="bg-green-100 text-green-700 border-green-200">{accion}</Badge>;
  if (accion.includes('CREATE_USER') || accion.includes('CREAR')) return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{accion}</Badge>;
  if (accion.includes('PEDIDO') || accion.includes('pedido')) return <Badge className="bg-orange-100 text-orange-700 border-orange-200">{accion}</Badge>;
  if (accion.includes('PAGO') || accion.includes('CUENTA') || accion.includes('pago') || accion.includes('cuenta')) return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{accion}</Badge>;
  if (accion.includes('ERROR') || accion.includes('error')) return <Badge className="bg-red-100 text-red-700 border-red-200">{accion}</Badge>;
  return <Badge variant="outline">{accion}</Badge>;
};

export const Auditoria = () => {
  const [logs, setLogs] = useState<AuditoriaLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServicio, setFilterServicio] = useState('TODOS');

  const cargarLogs = async () => {
    try { setIsLoading(true); setLogs(await auditoriaService.listar()); } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { cargarLogs(); }, []);

  const serviciosUnicos = useMemo(() => ['TODOS', ...new Set(logs.map((l) => l.servicio))], [logs]);

  const logsFiltrados = useMemo(() => logs.filter((l) => {
    const matchSearch = !searchTerm || l.accion.toLowerCase().includes(searchTerm.toLowerCase()) || (l.usuarioNombre || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchServicio = filterServicio === 'TODOS' || l.servicio === filterServicio;
    return matchSearch && matchServicio;
  }), [logs, searchTerm, filterServicio]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Auditoría</h2>
        </div>
        <Button variant="outline" onClick={cargarLogs}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Buscar por usuario o acción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterServicio} onValueChange={setFilterServicio}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Servicio" />
          </SelectTrigger>
          <SelectContent>
            {serviciosUnicos.map((s) => <SelectItem key={s} value={s}>{s === 'TODOS' ? 'Todos los servicios' : s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Fecha / Hora</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Microservicio</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logsFiltrados.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{(log.usuarioNombre || '?')[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{log.usuarioNombre || 'Desconocido'}</span>
                  </div>
                </TableCell>
                <TableCell>{getAccionBadge(log.accion)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.servicio}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.ip || '-'}</TableCell>
              </TableRow>
            ))}
            {logsFiltrados.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No se encontraron registros.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
