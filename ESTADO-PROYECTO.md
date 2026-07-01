# Cerberus — Estado del proyecto

> Última actualización: 2026-07-01
> Rama activa frontend: `develop`

---

## Qué hay hecho

### Frontend (`cerberus-frontend` — rama `develop`)

- Landing page completa con animaciones scroll (GSAP + cubo 3D CSS)
- Portal de admin en `/admin` — lanzar escaneos, ver historial (con datos mock)
- Login conectado al backend (`POST /api/auth/login`)
- Guards de ruta: `/admin` requiere JWT, `/login` redirige si ya hay sesión
- Cliente HTTP unificado — una sola variable `VITE_API_URL` para todo el backend
- Build de producción sin errores TypeScript

### API Gateway (`cerberus-k8s` — rama `feat/CER-traefik-gateway`)

Traefik configurado como gateway con:

- **Rate limiting**: 100 req/min por IP
- **ForwardAuth**: valida el JWT contra `/api/auth/me` antes de dejar pasar cualquier ruta protegida
- **Security headers** y CORS para desarrollo local
- Rutas públicas: `/api/auth/*`
- Rutas protegidas: `/api/scan/*`, `/api/kpis/*`, `/api/v1/vulnerabilities/*`

> Fix incluido: la ruta anterior `/api/ai` → analytics estaba rota. Corregida a `/api/kpis` (que es donde sirve cerberus-ml).

### Auth en securitygate (`cerberus-securitygate` — rama `feat/CER-auth-login`)

- `POST /api/auth/login` — valida email + BCrypt, devuelve JWT
- `GET /api/auth/me` — valida token, devuelve perfil + headers `X-User-Id / X-User-Email / X-User-Role` (necesarios para ForwardAuth)
- Entidad `User` en base de datos con BCrypt hash
- NuGet agregados: `BCrypt.Net-Next`, `JwtBearer`, `System.IdentityModel.Tokens.Jwt`

Usuario admin en DB: `admin@cerberus.com` / `admin123`

---

## Qué falta para que el sistema funcione en producción

### 1. Mergear las ramas pendientes

| Repo | Rama | Acción |
|---|---|---|
| `cerberus-securitygate` | `feat/CER-auth-login` | Merge a `main` → redesploy de la imagen |
| `cerberus-k8s` | `feat/CER-traefik-gateway` | Merge a `main` → aplicar en cluster |

### 2. Aplicar el gateway en el cluster

Desde el servidor (SSH) o con kubectl apuntando al cluster k3s:

```bash
# Borrar el Ingress estándar anterior
kubectl delete ingress cerberus-ingress -n cerberus

# Aplicar los nuevos recursos de Traefik
kubectl apply -f k8s/infrastructure/ingress/middlewares.yaml
kubectl apply -f k8s/infrastructure/ingress/ingress.yaml

# Verificar
kubectl get middleware -n cerberus
kubectl get ingressroute -n cerberus
```

> **Importante:** verificar la versión de Traefik en el cluster.
> ```bash
> kubectl get deploy traefik -n kube-system -o jsonpath='{.spec.template.spec.containers[0].image}'
> ```
> - Traefik v2.x → `apiVersion: traefik.containo.us/v1alpha1` (lo que está ahora en los YAMLs)
> - Traefik v3.x → cambiar a `traefik.io/v1alpha1` en `middlewares.yaml` e `ingress.yaml`

### 3. Configurar el JWT secret en el cluster

El `JwtService` de securitygate lee `Jwt__Key` como variable de entorno. Crear el secret en k8s:

```bash
kubectl create secret generic securitygate-jwt \
  --from-literal=JWT_KEY="<clave-secreta-aleatoria-larga>" \
  -n cerberus
```

Luego referenciarlo en el deployment de `security-gate` como env var `Jwt__Key`.

### 4. Configurar el entorno local para desarrollo

```bash
# En ~/.zshrc del desarrollador (la IP nunca va en el repo)
export SSH_HOST=<IP pública del servidor k3s>

# El .env.local del frontend ya tiene:
# VITE_API_URL=http://${SSH_HOST}
```

### 5. Probar el flujo completo

Una vez aplicados los pasos anteriores:

```bash
# Verificar login
curl -X POST http://<IP>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cerberus.com","password":"admin123"}'
# Esperado: { "token": "eyJ...", "user": { "role": "admin" } }

# Verificar que ForwardAuth bloquea sin token
curl http://<IP>/api/scan/test/status
# Esperado: 401

# Abrir el frontend
npm run dev   # localhost:5173/login
```

---

## Qué sigue después de producción

- `ScanDetail` — página de detalle de un escaneo con todos sus findings (`/dashboard/:scanId`)
- KPIs globales en el panel de admin (tab "KPIs Globales" marcado como SOON)
- Gestión de usuarios (tab "Usuarios" marcado como SOON)
- Filtrado de historial por usuario cuando haya multi-tenant
