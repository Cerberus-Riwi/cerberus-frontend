# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto del proyecto

Cerberus es una plataforma DevSecOps de análisis de seguridad y calidad de código para repositorios GitHub. Este repo es el frontend — el panel que consume los resultados de los escaneos.

**Rol del frontend en el equipo:** Faiber Camacho (FaiberCamachoDev) es el responsable de este repo.

## Stack

- **Vite 6 + React 19 + TypeScript** — base del proyecto
- **three.js + @react-three/fiber + @react-three/drei** — elementos 3D en la UI
- **Node 24** requerido

> Cualquier dependencia adicional debe ser aprobada por el usuario antes de instalarla.

## Comandos

```bash
npm run dev       # servidor de desarrollo en localhost:5173
npm run build     # build de producción en dist/
npm run preview   # previsualizar el build
npm run lint      # ESLint
```

## Convención de ramas y commits

**Nunca tocar `main` directamente.** Todo trabajo va en ramas:

- `feat/CER-XX-descripcion` — nuevas funcionalidades
- `fix/CER-XX-descripcion` — correcciones

Commits en formato conventional commits (español):
```
feat(auth): agregar formulario de login con escena 3D
fix(register): corregir validación de email
```

## Arquitectura del ecosistema Cerberus

El frontend consume APIs de los siguientes microservicios:

| Servicio | Rol |
|---|---|
| `cerberus-securitygate` | Orquestador — recibe solicitudes de escaneo, emite veredictos finales |
| `cerberus-vulnerability` | Analiza con Trivy, OWASP ZAP, Gitleaks — publica en RabbitMQ |
| `cerberus-codequality` | Análisis de calidad de código |
| `cerberus-ml` | Análisis ML sobre findings históricos (PostgreSQL schema `cerberus`) |

### Flujo principal

```
CI trigger ──▶ SecurityGate POST /api/scan/request
                    │
                    ├──▶ VulnerabilityService (scan_result)
                    └──▶ CodeQualityService   (scan_result)
                                │
                         SecurityGate agrega ──▶ scan_verdict (pass/warning/fail)
```

### Endpoint conocido

```
POST /api/scan/request  (cerberus-securitygate)
Body: { repositoryUrl, branch, commitHash, requestedAt, prNumber?, triggeredBy? }
```

### Contratos v1 (FROZEN — no modificar sin aprobación del líder técnico)

Los contratos están en `contextreposproject/cerberus-contracts` rama `feat/v1-schemas`.

**scan_verdict** (lo que el frontend principalmente muestra):
```json
{
  "scanId": "uuid",
  "verdict": "pass | warning | fail",
  "summary": { "critical": 0, "high": 1, "medium": 1, "low": 0, "info": 0 },
  "results": [{ "serviceId": "vulnerability-service|codequality-service", "findings": [...] }],
  "rollbackTriggered": false,
  "issuedAt": "ISO8601"
}
```

**finding** (dentro de cada result):
```json
{
  "id": "uuid",
  "severity": "critical | high | medium | low | info",
  "title": "...",
  "ruleId": "semgrep.CWE-089",
  "filePath": "src/...",
  "lineStart": 47,
  "recommendation": "..."
}
```

## Infraestructura

- Kubernetes (k3s): namespace `cerberus`, cluster `cerberus-k3s`
- CI/CD: GitHub Actions
- Repos hermanos disponibles para referencia en `contextreposproject/`

## docsStudio

Carpeta de documentación técnica local **no subida a GitHub** (está en `.gitignore`).
Misma dinámica que el proyecto Firmeza (Module6-w1).
