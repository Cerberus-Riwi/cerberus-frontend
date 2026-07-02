# Cerberus — Estado del proyecto

> Última actualización: 2026-07-02
> Workflow: push directo a `main` → CI/CD → producción automática

---

## Estado actual — todo en `main` y desplegado

### Frontend (`cerberus-frontend`)

- Landing page con animaciones scroll, fuego CSS, colores cálidos (zona de luz)
- Portal de admin `/admin` — lanzar escaneos, historial, chatbot de seguridad
- Login conectado al backend (`POST /api/auth/login`)
- Guards de ruta: `/admin` requiere JWT, `/login` redirige si ya hay sesión
- Cliente HTTP unificado — un solo `VITE_API_URL` para todo (Traefik rutea por path)
- Polling con timeout de 2 min (40 intentos × 3s) — ya no se cuelga si el backend se congela
- **ChatWidget** — asistente flotante en el admin, conectado a Azure OpenAI via `/api/ai/chat`
- **CI/CD**: push a `main` → build Docker con `VITE_API_URL` horneada → push a `ghcr.io`

> Secret requerido en GitHub Actions del repo frontend:
> `VITE_API_URL = https://api.cerberus.jaramc.dev`

### Proxy Vite (desarrollo local sin cluster)

`vite.config.ts` ruteando por puerto según path:

| Path | Puerto local |
|---|---|
| `/api/ai`, `/api/kpis` | `:8000` (cerberus-ml) |
| `/api/auth`, `/api/scan` | `:5275` (securitygate) |
| `/api/v1` | `:5114` (vulnerability) |

Para dev local: no setear `VITE_API_URL` → usa proxy automáticamente.

### API Gateway (`cerberus-k8s`)

Traefik configurado con:

- **Rate limiting**: 100 req/min por IP
- **ForwardAuth**: valida JWT contra `/api/auth/me` antes de rutas protegidas
- **Security headers** y CORS

| Ruta | Servicio | Auth |
|---|---|---|
| `/api/auth/*` | security-gate:5275 | pública |
| `/api/scan/*` | security-gate:5275 | JWT |
| `/api/v1/vulnerabilities/*` | vulnerability-service:5114 | JWT |
| `/api/codequality/*` | code-quality-service:5003 | JWT |
| `/api/quality-gate/*` | qualitygate-service:5004 | JWT |
| `/api/kpis/*` | analytics:8000 | JWT |
| `/api/ai/*` | analytics:8000 | JWT |
| `/n8n` | n8n:5678 | pública |
| `/` | frontend:80 | pública |

### cerberus-ml (analytics)

- KPIs históricos en `/api/kpis/*`
- **Chatbot Azure OpenAI** en `POST /api/ai/chat`
  - Recibe `{ message, findings? }` → arma contexto → llama a Azure → devuelve `{ reply }`
  - Credenciales en k8s secret `ai-secret` (ya montado)
  - CORS habilitado para `localhost:5173` y `localhost:4173`
  - `openai>=1.0.0` en `pyproject.toml` y `uv.lock`

### cerberus-securitygate

- `POST /api/auth/login` — valida email + BCrypt, devuelve JWT
- `GET /api/auth/me` — valida token + emite headers `X-User-Id / X-User-Email / X-User-Role`
- Usuario admin: `admin@cerberus.com` / `admin123`

---

## Pendiente

### Chatbot — activar en prod

1. Obtener el `DEPLOYMENT_NAME` de Azure OpenAI Studio → Deployments
2. Verificar que el k8s secret `ai-secret` tenga las 3 vars:
   ```
   AZURE_OPENAI_ENDPOINT    = https://cerberus.openai.azure.com/
   AZURE_OPENAI_API_KEY     = <key>
   AZURE_OPENAI_DEPLOYMENT  = <deployment-name>
   ```
3. `kubectl rollout restart deployment/analytics -n cerberus`

### Rollout general (después de cada push a main)

```bash
kubectl rollout restart deployment/<servicio> -n cerberus
```

### Próximas features

- `ScanDetail` — página `/dashboard/:scanId` con findings completos del escaneo
- KPIs globales — tab en admin (marcado SOON), consumir `kpi.dashboard()`
- Pasar findings del último scan al ChatWidget para contexto en tiempo real
- Gestión de usuarios (tab SOON)

---

## Para probar localmente (sin cluster)

```bash
# Terminal 1 — cerberus-ml
cd contextreposproject/cerberus-ml
uvicorn api.main:app --reload --port 8000

# Terminal 2 — cerberus-securitygate
cd contextreposproject/cerberus-securitygate
dotnet run

# Terminal 3 — frontend (sin VITE_API_URL → usa proxy)
npm run dev
```

Test chatbot:
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué es un SQL injection y qué tan grave es?"}'
```
