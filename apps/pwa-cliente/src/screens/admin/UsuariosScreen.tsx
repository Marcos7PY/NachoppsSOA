import { useEffect, useState, type FormEvent } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useUsuariosStore } from '../../store/usuarios.store';
import type { CrearUsuarioPayload, RolUsuario } from '../../types/usuario.types';

const ROLES: { value: RolUsuario; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'GERENCIA', label: 'Gerencia' },
  { value: 'CAJERO', label: 'Cajero' },
  { value: 'MESERO', label: 'Mesero' },
  { value: 'COCINA', label: 'Cocina' },
  { value: 'RECEPCION', label: 'Recepción' },
];

const INITIAL_FORM: CrearUsuarioPayload = {
  nombre: '',
  email: '',
  password: '',
  rol: 'MESERO',
};

export function UsuariosScreen() {
  const online = useOnlineStatus();
  const {
    usuarios,
    nextCursor,
    loading,
    loadingMore,
    saving,
    error,
    success,
    fetch,
    fetchMore,
    crear,
    cambiarRol,
    clearFeedback,
  } = useUsuariosStore();

  const [form, setForm] = useState<CrearUsuarioPayload>(INITIAL_FORM);
  const [search, setSearch] = useState('');
  const [rolFiltro, setRolFiltro] = useState<string>('');

  useEffect(() => {
    fetch({
      rol: rolFiltro ? (rolFiltro as RolUsuario) : undefined,
      search: search.trim() || undefined,
    });
  }, [rolFiltro, search, fetch]);

  const handleCrear = async (event: FormEvent) => {
    event.preventDefault();
    if (!online) return;

    await crear({
      ...form,
      nombre: form.nombre.trim(),
      email: form.email.trim(),
    });
  };

  const updateForm = (key: keyof CrearUsuarioPayload, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Usuarios</h1>
          <div className="sub">Gestión de accesos y roles del equipo</div>
        </div>
        <span className="spacer" />
        <div className="row g-2">
          <div className="input search-input" style={{ width: '200px' }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="input role-filter" style={{ width: '160px' }}>
            <select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
              <option value="">Todos los roles</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() =>
            fetch({
              rol: rolFiltro ? (rolFiltro as RolUsuario) : undefined,
              search: search.trim() || undefined,
            })
          }
          title="Refrescar"
        >
          <RefreshIcon />
        </button>
      </div>

      {!online && (
        <div className="banner warn module-feedback">
          <AlertIcon />
          <span>Sin conexión. Las mutaciones están deshabilitadas.</span>
        </div>
      )}

      {(error || success) && (
        <div className={`banner ${error ? 'err' : 'ok'} module-feedback`}>
          {error ? <AlertIcon /> : <CheckIcon />}
          <span>{error ?? success}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={clearFeedback}>Cerrar</button>
        </div>
      )}

      <div className="module-grid">
        <section className="panel">
          <div className="panel-h">
            <h3>Equipo</h3>
            <span className="spacer" />
            <span className="badge badge-info">{usuarios.length} usuarios</span>
          </div>

          {loading ? (
            <LoadingRows />
          ) : usuarios.length === 0 ? (
            <div className="empty">
              <div className="e-ic"><UsersIcon /></div>
              <h3>Sin usuarios</h3>
              <p>Los usuarios reales aparecerán aquí cuando el backend los devuelva o coincidan con el filtro.</p>
            </div>
          ) : (
            <>
              <div className="table-wrap table-wrap-flat">
                <table className="dt">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Creado</th>
                      <th>Cambiar rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>
                          <strong>{usuario.nombre}</strong>
                          <div className="muted">{usuario.email}</div>
                        </td>
                        <td><span className="badge badge-accent">{usuario.rolLabel}</span></td>
                        <td><span className={`badge dot ${usuario.estadoClass}`}>{usuario.estadoLabel}</span></td>
                        <td>{usuario.createdAtLabel}</td>
                        <td>
                          <div className="input role-select">
                            <select
                              value={usuario.rol}
                              disabled={saving || !online}
                              onChange={(event) => cambiarRol(usuario.id, event.target.value as RolUsuario)}
                            >
                              {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {nextCursor && (
                <div className="row center" style={{ padding: '12px' }}>
                  <button className="btn btn-ghost btn-sm" disabled={loadingMore} onClick={fetchMore}>
                    {loadingMore ? <span className="spinner" /> : null}
                    Cargar más
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="module-side">
          <section className="panel">
            <div className="panel-h"><h3>Nuevo usuario</h3></div>
            <form className="form-stack" onSubmit={handleCrear}>
              <div className="field">
                <label>Nombre</label>
                <div className="input">
                  <input required value={form.nombre} onChange={(event) => updateForm('nombre', event.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="input">
                  <input required type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Contraseña</label>
                <div className="input">
                  <input required minLength={8} type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Rol</label>
                <div className="input">
                  <select value={form.rol} onChange={(event) => updateForm('rol', event.target.value)}>
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-block" disabled={saving || !online} type="submit">
                {saving ? <span className="spinner" /> : <UsersIcon />}
                Crear usuario
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="table-wrap table-wrap-flat">
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="skeleton-row">
          <div className="skel" />
        </div>
      ))}
    </div>
  );
}

function AlertIcon() {
  return <svg className="ic" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
}

function CheckIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>;
}

function RefreshIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>;
}

function UsersIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
