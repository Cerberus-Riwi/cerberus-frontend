import type { ScanVerdict } from '../types/cerberus'

// ─────────────────────────────────────────────────────────────
// Fixtures derivados de cerberus-contracts/examples/*.example.json
// Capa aislada: reemplazar por el cliente de API real en un solo punto
// (ver src/lib/scans.ts). No mutar; tratar como datos de solo lectura.
// ─────────────────────────────────────────────────────────────

export const MOCK_VERDICTS: ScanVerdict[] = [
  // FAIL — caso canónico del contrato (scan-verdict.example.json)
  {
    scanId: 'a3f2e1d0-1234-4abc-8def-000000000001',
    verdict: 'fail',
    summary: { critical: 0, high: 1, medium: 1, low: 0, info: 0 },
    rollbackTriggered: true,
    issuedAt: '2026-06-18T14:32:15Z',
    results: [
      {
        scanId: 'a3f2e1d0-1234-4abc-8def-000000000001',
        serviceId: 'vulnerability-service',
        status: 'success',
        completedAt: '2026-06-18T14:31:45Z',
        findings: [
          {
            id: 'b1c2d3e4-0001-4aaa-bbbb-111111111111',
            severity: 'high',
            title: 'SQL Injection en parámetro de búsqueda',
            description:
              "El parámetro 'query' se concatena directamente en la consulta SQL sin sanitizar, permitiendo inyección de código SQL arbitrario.",
            ruleId: 'semgrep.CWE-089',
            filePath: 'src/Controllers/SearchController.cs',
            lineStart: 47,
            lineEnd: 47,
            recommendation:
              'Usar consultas parametrizadas con Entity Framework o Dapper en lugar de concatenación de strings.',
          },
          {
            id: 'c2d3e4f5-0002-4bbb-cccc-222222222222',
            severity: 'medium',
            title: 'Credencial AWS hardcodeada en el código fuente',
            description: 'Se detectó una clave de acceso de AWS embebida en el código fuente.',
            ruleId: 'gitleaks.aws-access-key',
            filePath: 'src/Services/StorageService.cs',
            lineStart: 12,
            lineEnd: 12,
            recommendation:
              'Mover la credencial a un Kubernetes Secret y leerla desde variables de entorno en runtime.',
          },
        ],
      },
      {
        scanId: 'a3f2e1d0-1234-4abc-8def-000000000001',
        serviceId: 'codequality-service',
        status: 'success',
        completedAt: '2026-06-18T14:32:10Z',
        findings: [],
      },
    ],
  },

  // FAIL — crítico, con un servicio en timeout (análisis incompleto)
  {
    scanId: 'b7c8d9e0-2345-4bcd-9ef0-000000000002',
    verdict: 'fail',
    summary: { critical: 1, high: 0, medium: 0, low: 1, info: 0 },
    rollbackTriggered: true,
    issuedAt: '2026-06-22T09:14:02Z',
    results: [
      {
        scanId: 'b7c8d9e0-2345-4bcd-9ef0-000000000002',
        serviceId: 'vulnerability-service',
        status: 'success',
        completedAt: '2026-06-22T09:13:50Z',
        findings: [
          {
            id: 'd3e4f5a6-0003-4ccc-dddd-333333333333',
            severity: 'critical',
            title: 'Deserialización insegura de datos no confiables',
            description:
              'Un payload controlado por el usuario se deserializa sin validación de tipo, habilitando ejecución remota de código.',
            ruleId: 'semgrep.CWE-502',
            filePath: 'src/Messaging/EventConsumer.cs',
            lineStart: 88,
            lineEnd: 96,
            recommendation:
              'Validar el tipo esperado antes de deserializar y usar un binder restringido a tipos conocidos.',
          },
          {
            id: 'e4f5a6b7-0004-4ddd-eeee-444444444444',
            severity: 'low',
            title: 'Cabecera de seguridad X-Content-Type-Options ausente',
            ruleId: 'zap.10021',
            filePath: 'src/Middleware/SecurityHeaders.cs',
            lineStart: 23,
            recommendation: "Añadir el header 'X-Content-Type-Options: nosniff' en el middleware.",
          },
        ],
      },
      {
        scanId: 'b7c8d9e0-2345-4bcd-9ef0-000000000002',
        serviceId: 'codequality-service',
        status: 'timeout',
        completedAt: '2026-06-22T09:17:00Z',
        findings: [],
        errorMessage:
          'El análisis superó el límite de 180 segundos. El repositorio puede ser demasiado grande o Semgrep no respondió.',
      },
    ],
  },

  // WARNING — sin critical/high, pero con medium y low
  {
    scanId: 'c1d2e3f4-3456-4cde-a012-000000000003',
    verdict: 'warning',
    summary: { critical: 0, high: 0, medium: 2, low: 1, info: 1 },
    rollbackTriggered: false,
    issuedAt: '2026-06-25T17:48:31Z',
    results: [
      {
        scanId: 'c1d2e3f4-3456-4cde-a012-000000000003',
        serviceId: 'vulnerability-service',
        status: 'success',
        completedAt: '2026-06-25T17:48:12Z',
        findings: [
          {
            id: 'f5a6b7c8-0005-4eee-ffff-555555555555',
            severity: 'medium',
            title: 'Dependencia con vulnerabilidad conocida (Newtonsoft.Json)',
            description: 'La versión declarada está afectada por un CVE de denegación de servicio.',
            ruleId: 'trivy.CVE-2024-21907',
            filePath: 'src/Cerberus.Api.csproj',
            lineStart: 14,
            recommendation: 'Actualizar Newtonsoft.Json a 13.0.3 o superior.',
          },
          {
            id: 'a6b7c8d9-0006-4fff-0000-666666666666',
            severity: 'low',
            title: 'Cookie de sesión sin atributo Secure',
            ruleId: 'zap.10010',
            filePath: 'src/Auth/SessionCookie.cs',
            lineStart: 31,
            recommendation: 'Marcar la cookie como Secure y SameSite=Strict.',
          },
        ],
      },
      {
        scanId: 'c1d2e3f4-3456-4cde-a012-000000000003',
        serviceId: 'codequality-service',
        status: 'success',
        completedAt: '2026-06-25T17:48:28Z',
        findings: [
          {
            id: 'b7c8d9e0-0007-4000-1111-777777777777',
            severity: 'medium',
            title: 'Complejidad ciclomática elevada en método de orquestación',
            description: 'El método concentra demasiadas ramas; dificulta el mantenimiento y las pruebas.',
            ruleId: 'sonar.S3776',
            filePath: 'src/Gate/VerdictOrchestrator.cs',
            lineStart: 120,
            lineEnd: 198,
            recommendation: 'Extraer las reglas de veredicto a métodos privados con responsabilidad única.',
          },
          {
            id: 'c8d9e0f1-0008-4111-2222-888888888888',
            severity: 'info',
            title: 'Bloque de código comentado sin uso',
            ruleId: 'sonar.S125',
            filePath: 'src/Gate/VerdictOrchestrator.cs',
            lineStart: 64,
            recommendation: 'Eliminar el código muerto; el historial de git ya lo preserva.',
          },
        ],
      },
    ],
  },

  // PASS — sin hallazgos que afecten el veredicto (solo info)
  {
    scanId: 'd4e5f6a7-4567-4def-b123-000000000004',
    verdict: 'pass',
    summary: { critical: 0, high: 0, medium: 0, low: 0, info: 1 },
    rollbackTriggered: false,
    issuedAt: '2026-06-28T11:02:09Z',
    results: [
      {
        scanId: 'd4e5f6a7-4567-4def-b123-000000000004',
        serviceId: 'vulnerability-service',
        status: 'success',
        completedAt: '2026-06-28T11:01:55Z',
        findings: [],
      },
      {
        scanId: 'd4e5f6a7-4567-4def-b123-000000000004',
        serviceId: 'codequality-service',
        status: 'success',
        completedAt: '2026-06-28T11:02:04Z',
        findings: [
          {
            id: 'd9e0f1a2-0009-4222-3333-999999999999',
            severity: 'info',
            title: 'Cobertura de pruebas por debajo del objetivo del equipo',
            description: 'La cobertura es del 76 %; el objetivo interno es 80 %. No bloquea el despliegue.',
            ruleId: 'sonar.coverage',
            filePath: 'src/Gate',
            recommendation: 'Añadir pruebas sobre las ramas del orquestador de veredicto.',
          },
        ],
      },
    ],
  },

  // PASS — limpio total, un solo servicio reportó
  {
    scanId: 'e7f8a9b0-5678-4ef0-c234-000000000005',
    verdict: 'pass',
    summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    rollbackTriggered: false,
    issuedAt: '2026-06-29T20:35:50Z',
    results: [
      {
        scanId: 'e7f8a9b0-5678-4ef0-c234-000000000005',
        serviceId: 'vulnerability-service',
        status: 'success',
        completedAt: '2026-06-29T20:35:41Z',
        findings: [],
      },
    ],
  },
]
