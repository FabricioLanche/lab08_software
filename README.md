# Reward System — Programa de Recompensas para Restaurantes

Sistema de envío de notificaciones para recompensas en un servicio de restaurante, desarrollado como parte del **Laboratorio 08** del curso de *Buen Diseño — Cohesión y Acoplamiento*.

---

## Descripción del Problema

Ir a un restaurante suele representar un gasto mayor que cocinar en casa; sin embargo, los programas de recompensas y fidelización permiten que los clientes obtengan beneficios por sus consumos. Estos programas ofrecen acumulación de puntos, reembolsos o beneficios especiales cada vez que un cliente consume en restaurantes afiliados.

Por ejemplo, Jesús desea ahorrar dinero para la educación de sus hijos. Cada vez que realiza una cena en un restaurante participante, una parte del consumo es transformada en puntos o recompensas que son abonadas a su cuenta personal.

Actualmente, debido a la necesidad de procesar grandes volúmenes de transacciones en tiempo real, las empresas utilizan arquitecturas orientadas a eventos y plataformas de mensajería como RabbitMQ, permitiendo desacoplar los sistemas y mejorar la escalabilidad, disponibilidad y resiliencia de las aplicaciones.

La siguiente figura describe el flujo del proceso a implementar:

![Flujo del Programa de Recompensas](images/flujo_programa.png)

---

## Arquitectura

El sistema combina tres enfoques arquitectónicos para maximizar la calidad del software:

| Enfoque | Rol |
|---|---|
| **Event-Driven Architecture (EDA)** | Coordinación global: los servicios se comunican mediante eventos asíncronos publicados en RabbitMQ, sin acoplamiento directo. |
| **Microservicios** | División en 3 servicios independientes (restaurant, rewards, notification), cada uno con su propio ciclo de vida, puerto y responsabilidad única. |
| **Clean Architecture** | Estructura interna por servicio: capas de dominio, aplicación e infraestructura con dependencias hacia adentro. |

### Justificación

- **EDA** permite escalar componentes de forma independiente y añadir nuevos consumidores sin modificar productores.
- **Microservicios** aíslan fallos, facilitan el despliegue independiente y permiten equipos paralelos.
- **Clean Architecture** garantiza que la lógica de negocio no dependa de frameworks, bases de datos ni brokers, facilitando pruebas y mantenimiento.

### Conceptos de Buen Diseño en la Implementación

| Concepto | Cómo se aplica |
|---|---|
| **Alta cohesión** | Cada servicio agrupa funcionalidades relacionadas (restaurant: registro de cenas; rewards: cálculo de puntos; notification: envío de avisos). Cada clase tiene una responsabilidad única (ej. `RegisterDinnerUseCase` solo registra cenas). |
| **Bajo acoplamiento** | Servicios se comunican exclusivamente por eventos RabbitMQ. El `restaurant-service` no conoce a `rewards-service`. Las dependencias apuntan hacia adentro (Clean Architecture). |
| **Modularidad** | El proyecto está organizado en workspaces de npm: `shared/`, `services/*/`. Cada servicio es reemplazable o actualizable sin afectar a los demás. |
| **Escalabilidad** | Se pueden ejecutar múltiples instancias de `rewards-service` o `notification-service` en paralelo; RabbitMQ distribuye los eventos entre ellas. |
| **Arquitectura orientada a eventos** | Todo el flujo (registro de cena → cálculo de puntos → notificación) se orquesta mediante eventos asíncronos (`DinnerRegisteredEvent`, `RewardProcessedEvent`). |

### Microservicios

| Servicio | Puerto | Endpoint | Rol |
|---|---|---|---|
| **restaurant-service** | 3001 | `POST /api/dinners` | Registra la cena y publica `DinnerRegistered` en RabbitMQ |
| **rewards-service** | 3002 | `GET /api/rewards/:cardNumber` | Calcula puntos y publica `RewardProcessed`; expone saldo |
| **notification-service** | — | (solo consumidor) | Consume eventos y envía notificaciones por consola / email |

**Payload de registro de cena:**
```json
{ "cardNumber": "1234567890", "email": "test@example.com", "restaurantCode": "REST001", "amount": 250.50, "consumedAt": "2026-05-31T12:00:00Z" }
```

**Respuestas:** `{ "dinnerId": "DINNER-XXX", "status": "RECEIVED" }` · `{ "cardNumber": "...", "rewardType": "POINTS", "balance": 25 }`

### Flujo de Eventos

```
Cliente → POST /api/dinners → restaurant-service
  → publica DinnerRegistered (routing: dinner.registered)
    → rewards-service consume
      → calcula puntos y publica RewardProcessed (routing: reward.processed)
        → notification-service consume
          → notificación en consola + email (Ethereal)
```

### Estructura del Proyecto

```
reward-system/
├── shared/                          # Tipos, eventos y contratos compartidos
│   ├── events/                      # DinnerRegisteredEvent, RewardProcessedEvent
│   └── contracts/                   # API contracts, constantes de mensajería
├── services/
│   ├── restaurant-service/
│   │   └── src/
│   │       ├── domain/entities/          # Dinner
│   │       ├── domain/repositories/      # Puerto DinnerRepository
│   │       ├── application/use-cases/    # RegisterDinnerUseCase
│   │       ├── application/ports/        # Puerto MessageBroker
│   │       └── infrastructure/
│   │           ├── api/controllers/      # DinnerController
│   │           ├── api/routes/           # Definición de rutas
│   │           ├── messaging/            # RabbitMQProducer
│   │           └── persistence/          # InMemoryDinnerRepository
│   ├── rewards-service/
│   │   └── src/
│   │       ├── domain/entities/          # Reward
│   │       ├── domain/strategies/        # PointsStrategy, CashbackStrategy
│   │       ├── domain/repositories/      # Puerto RewardRepository
│   │       ├── application/use-cases/    # ProcessRewardUseCase, GetRewardsUseCase
│   │       ├── application/ports/        # Puerto MessageBroker
│   │       └── infrastructure/
│   │           ├── api/controllers/      # RewardController
│   │           ├── messaging/            # RabbitMQProducer, RabbitMQConsumer
│   │           └── persistence/          # InMemoryRewardRepository
│   └── notification-service/
│       └── src/
│           ├── domain/entities/          # Notification
│           ├── application/use-cases/    # SendNotificationUseCase
│           ├── application/ports/        # Puerto NotificationSender
│           └── infrastructure/
│               ├── messaging/            # RabbitMQConsumer
│               ├── notifications/        # ConsoleNotificationSender, EtherealNotificationSender
│               └── templates/            # Email HTML template
├── scripts/
│   └── normalize-lcov.js                # Normalizador de rutas para SonarQube
├── images/                              # Evidencias del proyecto
├── sonar-project.properties             # Configuración de SonarQube
└── package.json                         # Workspaces y scripts globales
```

---

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](images/diagrama_uml.png)

### Flujo Principal 1: Registro de Cena y Procesamiento de Puntos

Este flujo se activa cuando un cliente consume en un local y se registran sus datos para otorgarle beneficios.

1. **Inicio del flujo (Actor Restaurante):** El actor *Restaurante* inicia la acción interactuando directamente con el caso de uso *Registrar cena*.
2. **Inclusión obligatoria (Lanzamiento de Evento):** Al registrar la cena, este caso de uso tiene una relación `<<include>>` hacia *Lanzar evento de registro*. Esto significa que siempre que se registra una cena, el sistema genera de forma automática y obligatoria un evento técnico que notifica este hecho.
3. **Interacción con el Broker:** El caso de uso *Lanzar evento de registro* envía esta información fuera del límite del sistema hacia el actor secundario *Broker de Mensajería (RabbitMQ)*.
4. **Recepción y procesamiento asíncrono:** El *Broker de Mensajería* reacciona devolviendo el flujo al sistema al activar el caso de uso *Calcular puntos*. Esto simula un patrón Publish-Subscribe donde un componente escucha el evento y calcula cuántos puntos corresponden por la cena registrada.
5. **Actualización del saldo:** Una vez calculados los puntos, el flujo pasa directamente a *Actualizar cuenta de recompensas*.
6. **Bifurcación condicional (Creación de cuenta):** Desde la actualización de la cuenta, sale una relación `<<extend>>` hacia *Crear cuenta de recompensas*. Esto significa que solo si el cliente no tiene una cuenta activa aún, el sistema ejecutará este caso de uso de forma excepcional para registrarlo por primera vez.
7. **Inclusión de la Notificación:** De manera obligatoria (`<<include>>`), al actualizarse la cuenta de recompensas se dispara el caso de uso *Encolar evento de notificación*.
8. **Gestión de la cola de salida:** *Encolar evento de notificación* se comunica externamente con el *Broker de Mensajería (RabbitMQ)* para dejar el mensaje de notificación en espera de ser procesado.

### Flujo Principal 2: Envío de Notificaciones al Cliente

Este flujo se encarga de materializar de forma asíncrona los avisos hacia el usuario final.

1. **Desencadenamiento por el Broker:** El *Broker de Mensajería* toma el mensaje encolado y activa el caso de uso *Enviar correo de notificación*.
2. **Inclusión obligatoria (Envío físico):** Este caso de uso (*Enviar correo de notificación*) incluye obligatoriamente (`<<include>>`) la lógica para que el actor secundario *Servicio de Correos (Ethereal/Nodemailer)* despache el correo electrónico real.
3. **Recepción por el cliente:** El caso de uso *Enviar correo de notificación* conecta directamente con el caso de uso *Recibir notificación*, completando el ciclo de alerta.

### Flujo Alternativo/Consulta: Interacción del Cliente

Este flujo representa la actividad pasiva o de consulta por parte del usuario final.

1. **Inicio del flujo (Actor Cliente):** El actor *Cliente* interactúa directamente con el caso de uso *Consultar cuenta de recompensas* para verificar su saldo de puntos o estado.
2. **Extensión por recepción:** El caso de uso *Consultar cuenta de recompensas* tiene una línea de `<<extend>>` que apunta hacia *Recibir notificación*. Esto modela que, de manera opcional o como consecuencia de estar interactuando con sus consultas, el cliente puede terminar visualizando o recibiendo las alertas pendientes en su interfaz.

---

## Ejecución Local

### Requisitos

- Node.js 20+
- npm 9+

El proyecto es **cross-platform** (Windows, Linux, macOS).

### Compilar e Iniciar

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Iniciar los 3 servicios en paralelo
npm run dev
```

![Ejecución de servicios](images/run_services.png)

### Probar con Curl (cmd.exe)

Registrar una cena (restaurant-service en puerto 3001):

```cmd
curl.exe -X POST http://localhost:3001/api/dinners -H "Content-Type: application/json" -d "{\"cardNumber\":\"1234567890\",\"email\":\"test@example.com\",\"restaurantCode\":\"REST01\",\"amount\":150,\"consumedAt\":\"2026-05-31T12:00:00Z\"}"
```

Consultar recompensas (rewards-service en puerto 3002):

```cmd
curl.exe http://localhost:3002/api/rewards/1234567890
```

![Ejecución de requests](images/execute_request.png)

### Conexión a RabbitMQ

Por defecto los servicios se conectan al servidor compartido del curso:

```
Host: 213.199.42.57   Puerto: 5672   Usuario: students   Contraseña: Ut3c2026
```

Para usar un servidor diferente, establecer la variable de entorno `AMQP_URL`:

```bash
export AMQP_URL="amqp://usuario:password@host:5672"
```

```powershell
$env:AMQP_URL="amqp://usuario:password@host:5672"
```

### Visualización de Notificaciones

La notificación por consola se muestra con un formato recuadrado en español:

![Notificación en consola](images/notif_visualization_1.png)

Además, si el envío por email (Ethereal) es exitoso, se muestra una URL de vista previa:

![Vista previa Ethereal](images/notif_visualization_2.png)

---

## Pruebas y Calidad de Código

### Ejecutar Pruebas

```bash
npm test
```

Este comando ejecuta los tests de todos los servicios (Jest con `--coverage` y `--silent`) y normaliza los reportes de cobertura para SonarQube.

![Test run 1](images/test_run_1.png)
![Test run 2](images/test_run_2.png)

### Análisis SonarQube

```bash
npm run sonar
```

Este comando ejecuta `npm test` seguido del escáner de SonarQube (usa `sonarqube-scanner` como paquete npm, sin necesidad de Java 17).

![Ejecución de SonarQube](images/execute_sonar.png)

### Métricas Alcanzadas

| Métrica | Objetivo | Resultado |
|---|---|---|
| **Reliability (Confiabilidad)** | Sin errores | ✅ 0 bugs |
| **Security (Seguridad)** | Sin vulnerabilidades | ✅ 0 vulnerabilities, 0 hotspots |
| **Maintainability (Mantenibilidad)** | Deuda técnica mínima | ✅ A |
| **Duplications (Duplicación)** | < 3% | ✅ 0.0% |
| **Coverage (Cobertura)** | ≥ 85% | ✅ 100.0% |

![Métricas de SonarQube](images/sonar_metrics.png)


