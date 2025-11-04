# API Reference - Linfedemapp

## 🌐 Visão Geral da API

A API do Linfedemapp é uma REST API que permite integração com o sistema de gerenciamento de pacientes com linfedema. Todas as comunicações utilizam JSON e autenticação via JWT tokens.

### Base URL
```
https://api.linfedemapp.com/v1
```

### Autenticação
Todas as requisições (exceto login e registro) requerem autenticação via Bearer Token:
```http
Authorization: Bearer <jwt_token>
```

### Content-Type
```http
Content-Type: application/json
```

---

## 🔐 Autenticação

### POST /auth/login
Autentica um usuário e retorna um JWT token.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "profissional@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Dr. João Silva",
      "email": "profissional@email.com",
      "role": "physiotherapist",
      "council_number": "CREFITO-123456",
      "specialty": "lymphedema",
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "E-mail ou senha incorretos"
  }
}
```

### POST /auth/register
Registra um novo profissional de saúde.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Dr. João Silva",
  "email": "profissional@email.com",
  "password": "senha123",
  "password_confirmation": "senha123",
  "council_number": "CREFITO-123456",
  "specialty": "physiotherapy",
  "institution": "Hospital XYZ"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Dr. João Silva",
      "email": "profissional@email.com",
      "council_number": "CREFITO-123456",
      "specialty": "physiotherapy"
    }
  },
  "message": "Usuário criado com sucesso. Verifique seu e-mail para ativação."
}
```

### GET /auth/me
Retorna informações do usuário autenticado.

**Request:**
```http
GET /auth/me
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dr. João Silva",
    "email": "profissional@email.com",
    "role": "physiotherapist",
    "council_number": "CREFITO-123456",
    "specialty": "lymphedema",
    "institution": "Hospital XYZ",
    "verified_at": "2024-01-15T11:00:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### POST /auth/reset-password
Inicia processo de recuperação de senha.

**Request:**
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "profissional@email.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Instruções enviadas para seu e-mail"
}
```

### POST /auth/logout
Invalida o token atual.

**Request:**
```http
POST /auth/logout
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 👤 Gerenciamento de Pacientes

### GET /patients
Lista todos os pacientes do profissional autenticado.

**Request:**
```http
GET /patients?page=1&limit=20&search=João
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 20, max: 100)
- `search` (optional): Busca por nome
- `order_by` (optional): Campo para ordenação (name, created_at, updated_at)
- `order_direction` (optional): Direção da ordenação (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "full_name": "Maria Silva Santos",
        "birth_date": "1985-03-15",
        "phone": "+5511999999999",
        "email": "maria@email.com",
        "gender": "female",
        "cancer_diagnosis_date": "2023-05-10",
        "last_evaluation": "2024-01-20T14:30:00Z",
        "lymphedema_stage": "I",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 45,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### GET /patients/{id}
Retorna detalhes completos de um paciente específico.

**Request:**
```http
GET /patients/1
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Maria Silva Santos",
    "birth_date": "1985-03-15",
    "address": "Rua das Flores, 123, São Paulo, SP",
    "phone": "+5511999999999",
    "email": "maria@email.com",
    "weight": 68.5,
    "height": 165,
    "activity_level": "moderate",
    "marital_status": "married",
    "occupation": "teacher",
    "cancer_diagnosis_date": "2023-05-10",
    "procedures": ["mastectomy", "lymph_node_biopsy"],
    "skin_changes": ["erythema", "dryness"],
    "musculoskeletal_complaints": "shoulder_pain",
    "lymphedema_symptoms": "swelling",
    "cacifo_sign": "present",
    "orange_peel_sign": "absent",
    "stemmer_sign": "positive",
    "treatments": {
      "radiotherapy": {
        "type": "external",
        "duration": "6_weeks",
        "completion_date": "2023-08-15"
      },
      "chemotherapy": {
        "type": "adjuvant",
        "duration": "4_months",
        "completion_date": "2023-12-10"
      },
      "hormone_therapy": {
        "type": "tamoxifen",
        "duration": "5_years",
        "start_date": "2024-01-01"
      }
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```

### POST /patients
Cria um novo paciente.

**Request:**
```http
POST /patients
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "full_name": "Maria Silva Santos",
  "birth_date": "1985-03-15",
  "address": "Rua das Flores, 123, São Paulo, SP",
  "phone": "+5511999999999",
  "email": "maria@email.com",
  "weight": 68.5,
  "height": 165,
  "activity_level": "moderate",
  "marital_status": "married",
  "occupation": "teacher",
  "cancer_diagnosis_date": "2023-05-10",
  "procedures": ["mastectomy", "lymph_node_biopsy"],
  "treatments": {
    "radiotherapy": {
      "type": "external",
      "duration": "6_weeks"
    }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Maria Silva Santos",
    "birth_date": "1985-03-15",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Paciente criado com sucesso"
}
```

### PUT /patients/{id}
Atualiza dados de um paciente existente.

**Request:**
```http
PUT /patients/1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "weight": 70.0,
  "phone": "+5511888888888",
  "lymphedema_symptoms": "improved_swelling"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "updated_fields": ["weight", "phone", "lymphedema_symptoms"],
    "updated_at": "2024-01-21T09:15:00Z"
  },
  "message": "Paciente atualizado com sucesso"
}
```

### DELETE /patients/{id}
Remove um paciente (soft delete).

**Request:**
```http
DELETE /patients/1
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Paciente removido com sucesso"
}
```

---

## 📊 Avaliações e Medições

### GET /patients/{patient_id}/evaluations
Lista todas as avaliações de um paciente.

**Request:**
```http
GET /patients/1/evaluations?page=1&limit=10
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "evaluations": [
      {
        "id": 1,
        "patient_id": 1,
        "evaluation_date": "2024-01-20T14:30:00Z",
        "affected_arm": "right",
        "reference_arm": "left",
        "volume_difference_percentage": 15.5,
        "lymphedema_classification": "stage_1",
        "professional_notes": "Paciente apresenta melhora desde última avaliação",
        "created_at": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### GET /evaluations/{id}
Retorna detalhes completos de uma avaliação específica.

**Request:**
```http
GET /evaluations/1
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "evaluation_date": "2024-01-20T14:30:00Z",
    "affected_arm": "right",
    "reference_arm": "left",
    "measurements": {
      "left_arm": [
        {"point": 0, "circumference": 18.5},
        {"point": 10, "circumference": 21.0},
        {"point": 20, "circumference": 23.5},
        {"point": 30, "circumference": 25.0},
        {"point": 40, "circumference": 26.5},
        {"point": 50, "circumference": 28.0},
        {"point": 60, "circumference": 29.5},
        {"point": 70, "circumference": 31.0},
        {"point": 80, "circumference": 32.5},
        {"point": 90, "circumference": 34.0}
      ],
      "right_arm": [
        {"point": 0, "circumference": 19.5},
        {"point": 10, "circumference": 22.5},
        {"point": 20, "circumference": 25.0},
        {"point": 30, "circumference": 27.0},
        {"point": 40, "circumference": 28.5},
        {"point": 50, "circumference": 30.5},
        {"point": 60, "circumference": 32.0},
        {"point": 70, "circumference": 34.0},
        {"point": 80, "circumference": 35.5},
        {"point": 90, "circumference": 37.0}
      ]
    },
    "volumes": {
      "left_arm_total": 1250.5,
      "right_arm_total": 1444.3,
      "difference_ml": 193.8,
      "difference_percentage": 15.5,
      "segments": [
        {
          "from": 0,
          "to": 10,
          "left_volume": 125.3,
          "right_volume": 145.8
        }
      ]
    },
    "lymphedema_classification": "stage_1",
    "clinical_signs": {
      "cacifo_sign": "grade_2",
      "orange_peel_sign": "absent",
      "stemmer_sign": "positive"
    },
    "professional_notes": "Paciente apresenta melhora desde última avaliação",
    "created_at": "2024-01-20T14:30:00Z"
  }
}
```

### POST /evaluations
Cria uma nova avaliação.

**Request:**
```http
POST /evaluations
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "patient_id": 1,
  "evaluation_date": "2024-01-20T14:30:00Z",
  "affected_arm": "right",
  "reference_arm": "left",
  "measurements": {
    "left_arm": [
      {"point": 0, "circumference": 18.5},
      {"point": 10, "circumference": 21.0}
    ],
    "right_arm": [
      {"point": 0, "circumference": 19.5},
      {"point": 10, "circumference": 22.5}
    ]
  },
  "clinical_signs": {
    "cacifo_sign": "grade_2",
    "orange_peel_sign": "absent",
    "stemmer_sign": "positive"
  },
  "professional_notes": "Primeira avaliação do paciente"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "evaluation_date": "2024-01-20T14:30:00Z",
    "volume_difference_percentage": 15.5,
    "lymphedema_classification": "stage_1",
    "created_at": "2024-01-20T14:30:00Z"
  },
  "message": "Avaliação criada com sucesso"
}
```

### PUT /evaluations/{id}
Atualiza uma avaliação existente.

**Request:**
```http
PUT /evaluations/1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "professional_notes": "Paciente apresenta melhora significativa",
  "clinical_signs": {
    "cacifo_sign": "grade_1"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "updated_fields": ["professional_notes", "clinical_signs"],
    "updated_at": "2024-01-21T10:00:00Z"
  },
  "message": "Avaliação atualizada com sucesso"
}
```

---

## 📄 Relatórios

### GET /reports/patient/{patient_id}/pdf
Gera relatório PDF de um paciente.

**Request:**
```http
GET /reports/patient/1/pdf?evaluation_id=1&include_history=true
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `evaluation_id` (optional): ID da avaliação específica
- `include_history` (optional): Incluir histórico completo (true/false)
- `template` (optional): Template do relatório (standard, detailed, summary)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pdf_url": "https://api.linfedemapp.com/storage/reports/patient_1_20240120.pdf",
    "file_size": 245678,
    "generated_at": "2024-01-20T15:00:00Z",
    "expires_at": "2024-01-27T15:00:00Z"
  }
}
```

### GET /reports/evaluation/{evaluation_id}/pdf
Gera relatório PDF de uma avaliação específica.

**Request:**
```http
GET /reports/evaluation/1/pdf
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pdf_url": "https://api.linfedemapp.com/storage/reports/evaluation_1_20240120.pdf",
    "file_size": 156789,
    "generated_at": "2024-01-20T15:00:00Z",
    "expires_at": "2024-01-27T15:00:00Z"
  }
}
```

### GET /reports/statistics
Retorna estatísticas do profissional.

**Request:**
```http
GET /reports/statistics?period=last_30_days
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period`: last_7_days, last_30_days, last_90_days, last_year, custom
- `start_date`: Data início (para period=custom)
- `end_date`: Data fim (para period=custom)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "last_30_days",
    "total_patients": 45,
    "new_patients": 8,
    "total_evaluations": 123,
    "lymphedema_stages": {
      "stage_0": 12,
      "stage_1": 18,
      "stage_2": 13,
      "stage_3": 2
    },
    "avg_volume_difference": 18.5,
    "improvement_rate": 67.3,
    "generated_at": "2024-01-20T15:00:00Z"
  }
}
```

---

## 🔍 Busca e Filtros

### GET /search/patients
Busca avançada de pacientes.

**Request:**
```http
GET /search/patients?q=Maria&age_min=25&age_max=65&lymphedema_stage=1,2
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `q`: Termo de busca (nome, email, telefone)
- `age_min`: Idade mínima
- `age_max`: Idade máxima
- `lymphedema_stage`: Estágios do linfedema (0,1,2,3)
- `cancer_type`: Tipo de câncer
- `has_evaluations`: Possui avaliações (true/false)
- `last_evaluation_from`: Data da última avaliação (desde)
- `last_evaluation_to`: Data da última avaliação (até)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "full_name": "Maria Silva Santos",
        "age": 39,
        "lymphedema_stage": "stage_1",
        "last_evaluation": "2024-01-20T14:30:00Z",
        "match_score": 0.95
      }
    ],
    "total_results": 15,
    "search_time_ms": 45
  }
}
```

---

## 📊 Analytics e Métricas

### GET /analytics/dashboard
Retorna dados para dashboard do profissional.

**Request:**
```http
GET /analytics/dashboard
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_patients": 45,
      "active_patients": 32,
      "evaluations_this_month": 28,
      "avg_improvement_rate": 68.5
    },
    "recent_evaluations": [
      {
        "id": 1,
        "patient_name": "Maria Silva",
        "evaluation_date": "2024-01-20T14:30:00Z",
        "lymphedema_stage": "stage_1",
        "improvement": 12.3
      }
    ],
    "lymphedema_distribution": {
      "stage_0": 8,
      "stage_1": 15,
      "stage_2": 18,
      "stage_3": 4
    },
    "monthly_trends": [
      {
        "month": "2024-01",
        "new_patients": 5,
        "evaluations": 28,
        "avg_improvement": 15.2
      }
    ]
  }
}
```

---

## 🔧 Configurações

### GET /settings/user
Retorna configurações do usuário.

**Request:**
```http
GET /settings/user
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "measurement_protocol": {
      "interval": 10,
      "unit": "cm",
      "starting_point": "fingertip"
    },
    "lymphedema_thresholds": {
      "stage_0": 5.0,
      "stage_1": 10.0,
      "stage_2": 20.0,
      "stage_3": 40.0
    },
    "notifications": {
      "email_reports": true,
      "evaluation_reminders": true,
      "weekly_summary": false
    },
    "report_templates": {
      "default": "detailed",
      "include_charts": true,
      "include_history": true
    }
  }
}
```

### PUT /settings/user
Atualiza configurações do usuário.

**Request:**
```http
PUT /settings/user
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "measurement_protocol": {
    "interval": 5
  },
  "notifications": {
    "email_reports": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "updated_fields": ["measurement_protocol", "notifications"],
    "updated_at": "2024-01-21T11:00:00Z"
  },
  "message": "Configurações atualizadas com sucesso"
}
```

---

## 📡 Webhooks

### POST /webhooks/subscribe
Registra um webhook para receber notificações.

**Request:**
```http
POST /webhooks/subscribe
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "url": "https://meuapp.com/webhook/linfedemapp",
  "events": ["patient.created", "evaluation.completed"],
  "secret": "webhook_secret_key"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "webhook_12345",
    "url": "https://meuapp.com/webhook/linfedemapp",
    "events": ["patient.created", "evaluation.completed"],
    "created_at": "2024-01-20T16:00:00Z"
  }
}
```

### Eventos Disponíveis
- `patient.created`: Novo paciente criado
- `patient.updated`: Paciente atualizado
- `patient.deleted`: Paciente removido
- `evaluation.created`: Nova avaliação criada
- `evaluation.updated`: Avaliação atualizada
- `evaluation.completed`: Avaliação finalizada
- `report.generated`: Relatório gerado

---

## ❌ Códigos de Erro

### Códigos HTTP
- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Proibido
- `404`: Não encontrado
- `422`: Entidade não processável
- `429`: Muitas requisições
- `500`: Erro interno do servidor

### Códigos de Erro Personalizados

#### Autenticação (4xx)
- `INVALID_CREDENTIALS`: Credenciais inválidas
- `TOKEN_EXPIRED`: Token expirado
- `TOKEN_INVALID`: Token inválido
- `ACCOUNT_DISABLED`: Conta desabilitada
- `EMAIL_NOT_VERIFIED`: E-mail não verificado

#### Validação (422)
- `VALIDATION_ERROR`: Erro de validação
- `REQUIRED_FIELD`: Campo obrigatório
- `INVALID_FORMAT`: Formato inválido
- `DUPLICATE_ENTRY`: Entrada duplicada

#### Recursos (404)
- `PATIENT_NOT_FOUND`: Paciente não encontrado
- `EVALUATION_NOT_FOUND`: Avaliação não encontrada
- `REPORT_NOT_FOUND`: Relatório não encontrado

#### Negócio (400)
- `INCOMPLETE_MEASUREMENTS`: Medições incompletas
- `INVALID_ARM_SELECTION`: Seleção de braço inválida
- `CALCULATION_ERROR`: Erro no cálculo

### Estrutura de Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Os dados fornecidos são inválidos",
    "details": {
      "field": "email",
      "error": "Formato de e-mail inválido"
    },
    "timestamp": "2024-01-20T16:30:00Z",
    "request_id": "req_12345"
  }
}
```

---

## 📚 Rate Limiting

### Limites por Endpoint
- **Autenticação**: 5 tentativas por minuto
- **API Geral**: 1000 requisições por hora
- **Upload/Download**: 50 por hora
- **Relatórios**: 100 por hora

### Headers de Rate Limit
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642689600
X-RateLimit-Retry-After: 60
```

---

## 🧪 Ambiente de Teste

### Base URL Sandbox
```
https://sandbox-api.linfedemapp.com/v1
```

### Credenciais de Teste
```json
{
  "email": "test@linfedemapp.com",
  "password": "test123"
}
```

### Dados de Teste
A API sandbox inclui dados de teste pré-populados:
- 10 pacientes fictícios
- 50 avaliações de exemplo
- Relatórios de demonstração

---

## 📖 SDKs e Bibliotecas

### JavaScript/Node.js
```bash
npm install @linfedemapp/sdk
```

```javascript
import LinfedemApp from '@linfedemapp/sdk';

const client = new LinfedemApp({
  apiKey: 'your_api_key',
  environment: 'production'
});

const patients = await client.patients.list();
```

### Python
```bash
pip install linfedemapp-python
```

```python
from linfedemapp import Client

client = Client(api_key='your_api_key')
patients = client.patients.list()
```

### PHP
```bash
composer require linfedemapp/php-sdk
```

```php
use LinfedemApp\Client;

$client = new Client('your_api_key');
$patients = $client->patients()->list();
```

---

## 📝 Changelog

### v1.2.0 (2024-01-20)
- Adicionado endpoint de estatísticas
- Melhorada busca de pacientes
- Suporte a webhooks

### v1.1.0 (2024-01-15)
- Adicionados filtros avançados
- Endpoint de configurações
- Otimizações de performance

### v1.0.0 (2024-01-01)
- Lançamento inicial da API
- Autenticação JWT
- CRUD completo de pacientes e avaliações
- Geração de relatórios PDF

---

**© 2024 Linfedemapp - API Reference v1.2.0**