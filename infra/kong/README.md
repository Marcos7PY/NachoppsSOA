# Kong API Gateway — NachoPps

## ¿Por qué importa?

- **Un solo punto de entrada** para el frontend (`:8000`) en lugar de recordar 9 puertos.
- **CORS** centralizado para la PWA.
- Base para **JWT**, rate limiting y métricas sin tocar cada microservicio.

## Puertos de microservicios (host)

| Servicio | PORT en `.env` | Ruta en Kong |
|----------|----------------|--------------|
| identidad | 3001 | `/identidad` |
| mesas | 3002 | `/mesas` |
| pedidos | 3004 | `/pedidos` |
| cuentas | 3005 | `/cuentas` |
| reservas | 3006 | `/reservas` |
| inventario | 3007 | `/inventario` |
| notificaciones | 3008 | `/notificaciones` |
| caja | 3009 | `/caja` |
| reportes | 3010 | `/reportes` |

Kong reenvía `http://localhost:8000/pedidos/...` → `http://host.docker.internal:3004/api/...`

## Levantar

```powershell
# Solo Kong (microservicios deben estar en nx serve con los PORT de la tabla)
docker compose -f infra/docker-compose.yml --profile dev up -d kong

# Infra completa (RabbitMQ, Postgres, Kong)
.\scripts\levantar-infra.ps1
```

- **Proxy:** http://localhost:8000  
- **Admin API:** http://localhost:8001  
- **Estado:** http://localhost:8001/status  

## Probar

```powershell
# Health vía gateway (requiere servicio-pedidos en :3004)
Invoke-RestMethod http://localhost:8000/pedidos

# Crear pedido vía gateway
$body = '{"mesa":3,"items":[{"producto":"Pizza","cantidad":1}]}'
Invoke-RestMethod -Method Post -Uri http://localhost:8000/pedidos/pedidos -Body $body -ContentType "application/json"
```

Si un microservicio no está levantado, Kong responde **502 Bad Gateway** (esperado).

## Editar rutas

Modifica `infra/kong/kong.yml` y reinicia Kong:

```powershell
docker compose -f infra/docker-compose.yml restart kong
```
