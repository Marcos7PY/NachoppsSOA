# Invariante: no confusion de algoritmo JWT

Los tokens de usuario se verifican con RS256 y la clave publica. Los tokens S2S
se verifican con HS256 y `SERVICE_JWT_SECRET`.

El secreto HS256 jamas puede derivarse de, ni ser igual a, la clave publica RS256.
Si un token declara `alg: HS256`, el provider debe devolver `SERVICE_JWT_SECRET`;
por eso un HS256 firmado usando la clave publica como secreto falla la
verificacion.

Casos cubiertos por spec:

- HS256 firmado con la clave publica: rechazado.
- `alg: none`: rechazado.
- `alg: RS512`: rechazado.
