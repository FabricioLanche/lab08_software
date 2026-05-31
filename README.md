# Reward System — Programa de Recompensas para Restaurantes

Sistema de envío de notificaciones para recompensas en un servicio de restaurante, desarrollado como parte del Laboratorio 08 del curso de Buen Diseño — Cohesión y Acoplamiento.

## Arquitectura

| Capa | Enfoque |
|---|---|
| **Global** | Event-Driven Architecture (EDA) |
| **División** | Microservicios |
| **Interna** | Clean Architecture (por servicio) |

### Patrón de mensajería

Se utiliza **RabbitMQ** como broker de eventos con exchange tipo `topic` y colas duraderas. La conexión se realiza contra un servidor RabbitMQ compartido (no local).

## Microservicios

### 1. restaurant-service
- **Endpoint:** `POST /api/dinners`
- **Rol:** Recibe el registro de una cena y publica un evento `DinnerRegistered` en RabbitMQ.
- **Payload:**
  ```json
  { "cardNumber": "1234567890", "restaurantCode": "REST001", "amount": 250.50, "consumedAt": "2026-05-16T20:30:00Z" }
  ```
- **Respuesta:** `{ "dinnerId": "DINNER-XXX", "status": "RECEIVED" }`

### 2. rewards-service
- **Endpoint:** `GET /api/rewards/:cardNumber`
- **Rol:** Consume eventos `DinnerRegistered`, calcula recompensas (puntos = 10% del consumo) y publica un evento `RewardProcessed`. Expone el saldo acumulado por tarjeta.
- **Respuesta:** `{ "cardNumber": "...", "rewardType": "POINTS", "balance": 25 }`

### 3. notification-service
- **Rol:** Consume eventos `RewardProcessed` y envía una notificación (actualmente por consola, extensible a email/SMS/app).

## Flujo de eventos

```
Cliente → POST /api/dinners → restaurant-service
  → publica DinnerRegistered (routing: dinner.registered)
    → rewards-service consume
      → calcula puntos y publica RewardProcessed (routing: reward.processed)
        → notification-service consume
          → envía notificación
```

## Estructura del proyecto

```
reward-system/
├── shared/                          # Tipos y contratos compartidos
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
│   │           ├── api/routes/
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
│               └── notifications/        # ConsoleNotificationSender
└── sonar-project.properties
```

## Requisitos

- Node.js 20+

## Conexión a RabbitMQ

Por defecto los servicios se conectan al servidor RabbitMQ compartido con las credenciales预:

```
Host: 213.199.42.57
Puerto: 5672
Usuario: students
Contraseña: Ut3c2026
Virtual host: /
```

Para usar un servidor diferente, establecer la variable de entorno `AMQP_URL`:

```bash
export AMQP_URL="amqp://usuario:password@host:5672"
```

## Ejecución

Cada microservicio se ejecuta de forma independiente:

```bash
# Terminal 1 — restaurant-service
PORT=3001 npm start -w services/restaurant-service

# Terminal 2 — rewards-service
PORT=3002 npm start -w services/rewards-service

# Terminal 3 — notification-service
npm start -w services/notification-service
```

### Desarrollo

```bash
npm install
npm run build
npm test
```

## Pruebas

```bash
npm test
```

### Cobertura

| Servicio | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| restaurant-service | 86.27% | 100% | 90.9% | 86% |
| rewards-service | 95.74% | 100% | 100% | 95.74% |
| notification-service | 100% | 100% | 100% | 100% |

## Calidad de código

El proyecto se analiza con **SonarCloud**. Las métricas objetivo son:

- Reliability (Confiabilidad)
- Security (Seguridad)
- Maintainability (Mantenibilidad)
- Duplications < 3%
- Test Coverage ≥ 85%

## Entregables

- [ ] Enlace público del análisis en SonarCloud
- [ ] Enlace del repositorio en GitHub
- [ ] Evidencia de ejecución de pruebas automatizadas
- [ ] Documento breve describiendo la arquitectura implementada
