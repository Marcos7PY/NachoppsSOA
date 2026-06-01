// login.jsx — NachoPps login. Fast, operational, with credential/server/expired states.
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Spinner } = window;

  function Login({ onLogin, expired }) {
    const [email, setEmail] = useState('camila@nachopps.pe');
    const [pass, setPass] = useState('••••••••');
    const [show, setShow] = useState(false);
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(expired ? 'expired' : null);
    const [scenario, setScenario] = useState('ok'); // ok | bad | server

    const submit = (e) => {
      e && e.preventDefault();
      setError(null); setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (scenario === 'bad') setError('bad');
        else if (scenario === 'server') setError('server');
        else onLogin();
      }, 900);
    };

    const ERR = {
      expired: { kind: 'warn', text: 'Tu sesión expiró por inactividad. Vuelve a ingresar.' },
      bad: { kind: 'err', text: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
      server: { kind: 'err', text: 'Servidor no disponible. Reintenta en unos segundos.' },
    };

    return (
      <div className="login-wrap" data-screen-label="Login">
        <div className="login-art">
          <div className="row" style={{ gap: 12 }}>
            <div className="brand-logo" style={{ width: 42, height: 42, fontSize: 21 }}>N</div>
            <div><b style={{ fontSize: 19, fontWeight: 800 }}>NachoPps</b><div style={{ opacity: .6, fontSize: 12, fontWeight: 600 }}>Sistema operativo de restobar</div></div>
          </div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.12, maxWidth: 380 }}>La consola de operación de tu salón, cocina y caja.</div>
            <p style={{ opacity: .55, fontSize: 15, fontWeight: 500, maxWidth: 360, marginTop: 16 }}>Mesas, pedidos, KDS, cuentas y cobros en una sola herramienta rápida y táctil.</p>
          </div>
          <div className="row" style={{ gap: 18, opacity: .5, fontSize: 12, fontWeight: 600 }}>
            <span className="row" style={{ gap: 6 }}><Icon name="wifi" size={15} /> Funciona offline</span>
            <span className="row" style={{ gap: 6 }}><Icon name="lock" size={15} /> Seguro por rol</span>
          </div>
        </div>

        <div className="login-form-side">
          <form className="login-card" onSubmit={submit}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-.02em' }}>Iniciar sesión</h1>
            <p className="muted" style={{ margin: '0 0 22px', fontWeight: 600 }}>Ingresa para entrar a Operación.</p>

            {error && (
              <div className={`banner ${ERR[error].kind}`} style={{ marginBottom: 16 }}>
                <Icon name={error === 'server' ? 'wifiOff' : error === 'expired' ? 'clock' : 'alertTri'} size={17} />
                <span>{ERR[error].text}</span>
              </div>
            )}

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Correo</label>
              <div className={`input ${error === 'bad' ? 'invalid' : ''}`}>
                <Icon name="mail" size={16} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@nachopps.pe" />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Contraseña</label>
              <div className={`input ${error === 'bad' ? 'invalid' : ''}`}>
                <Icon name="lock" size={16} />
                <input type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} />
                <button type="button" className="icon-btn" style={{ width: 26, height: 26, border: 0, background: 'none' }} onClick={() => setShow(!show)}><Icon name={show ? 'eyeOff' : 'eye'} size={16} /></button>
              </div>
            </div>

            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
              <label className="row" style={{ gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                Recordar sesión
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>¿Olvidaste tu clave?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? <><Spinner size={16} /> Ingresando…</> : <>Ingresar <Icon name="arrowR" size={17} /></>}
            </button>

            <div style={{ marginTop: 26, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
              <div className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Demo · simular respuesta</div>
              <div className="seg" style={{ width: '100%' }}>
                {[['ok', 'Éxito'], ['bad', 'Credenciales'], ['server', 'Servidor caído']].map(([k, l]) => (
                  <button type="button" key={k} className={scenario === k ? 'on' : ''} style={{ flex: 1 }} onClick={() => setScenario(k)}>{l}</button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  window.Login = Login;
})();
