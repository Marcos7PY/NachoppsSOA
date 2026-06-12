# Jaeger en produccion

`infra/docker-compose.prod.yml` no publica el puerto `16686` de Jaeger al host.
La UI no trae autenticacion propia, asi que debe consultarse por red interna o
tunel SSH.

Ejemplo de tunel:

```sh
ssh -L 16686:localhost:16686 usuario@host
```

Si se decide publicar el puerto en un entorno concreto, debe quedar detras de
firewall/VPN y documentarse en el runbook de despliegue de ese entorno.
