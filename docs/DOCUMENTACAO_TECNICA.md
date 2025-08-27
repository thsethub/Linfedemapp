# Documentação Técnica - Linfedemapp

## 🏗️ Arquitetura do Sistema

### Visão Geral
O Linfedemapp é uma aplicação móvel desenvolvida com React Native e Expo, seguindo uma arquitetura moderna e escalável para aplicações healthcare.

### Stack Tecnológica

#### Frontend
- **React Native**: Framework principal para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento e deployment
- **TypeScript**: Linguagem para tipagem estática
- **TailwindCSS**: Framework de CSS utilitário
- **React Navigation**: Navegação entre telas
- **Expo Router**: Sistema de roteamento file-based

#### Backend/API
- **Node.js**: Runtime JavaScript para backend
- **Express.js**: Framework web (inferido)
- **SQLite**: Banco de dados local
- **Axios**: Cliente HTTP para requisições

#### Ferramentas de Desenvolvimento
- **Expo CLI**: Interface de linha de comando
- **Metro**: Bundler para React Native
- **Jest**: Framework de testes
- **ESLint**: Linter para qualidade de código

---

## 📁 Estrutura do Projeto

```
Linfedemapp/
├── src/
│   ├── app/                     # Telas da aplicação (Expo Router)
│   │   ├── _layout.tsx         # Layout raiz
│   │   ├── index.tsx           # Tela inicial
│   │   ├── sing-in.tsx         # Login
│   │   ├── sing-up.tsx         # Cadastro
│   │   ├── home.tsx            # Tela principal
│   │   ├── fichaExame.tsx      # Ficha de exame (parte 1)
│   │   ├── fichaExame2.tsx     # Ficha de exame (parte 2)
│   │   ├── bracoDireito.tsx    # Medições braço direito
│   │   ├── bracoEsquerdo.tsx   # Medições braço esquerdo
│   │   ├── calculadora.tsx     # Cálculos de volumetria
│   │   ├── resultado.tsx       # Resultados da avaliação
│   │   ├── historicoExames.tsx # Histórico de exames
│   │   ├── historicoDetalhes/  # Detalhes do histórico
│   │   ├── faq.tsx             # FAQ/Suporte
│   │   └── recuperar_senha.tsx # Recuperação de senha
│   ├── components/             # Componentes reutilizáveis
│   │   ├── FaqAccordion.tsx    # Accordion para FAQ
│   │   ├── datepicker.tsx      # Seletor de data
│   │   ├── dropdown.tsx        # Dropdown personalizado
│   │   ├── dropdown2.tsx       # Variação do dropdown
│   │   ├── headerCalculadora.tsx # Header da calculadora
│   │   ├── headerExames1.tsx   # Header para exames
│   │   ├── headerFicha1.tsx    # Header para ficha 1
│   │   ├── headerFicha2.tsx    # Header para ficha 2
│   │   ├── headerId.tsx        # Header de identificação
│   │   ├── headerResultado.tsx # Header de resultados
│   │   ├── procedimentosEcapsulados.tsx # Procedimentos
│   │   ├── selectorReference.tsx # Seletor de referência
│   │   └── singlepicker.tsx    # Picker único
│   ├── context/                # Contextos React
│   │   └── context.tsx         # Context principal da aplicação
│   ├── utils/                  # Utilitários e helpers
│   │   ├── database.ts         # Operações de banco de dados
│   │   ├── storage.ts          # Armazenamento local
│   │   ├── generatePatientReport.ts # Geração de relatórios
│   │   └── generateReport.ts   # Funções auxiliares de relatório
│   ├── assets/                 # Recursos estáticos
│   │   └── image 8.png         # Imagens da aplicação
│   └── style/                  # Estilos globais
├── docs/                       # Documentação
├── babel.config.js             # Configuração Babel
├── metro.config.js             # Configuração Metro bundler
├── tailwind.config.js          # Configuração TailwindCSS
├── tsconfig.json               # Configuração TypeScript
├── app.json                    # Configuração Expo
├── package.json                # Dependências npm
└── README.md                   # Documentação principal
```

---

## 🎨 Arquitetura de Componentes

### Context API
A aplicação utiliza Context API para gerenciamento de estado global:

```typescript
interface PatientData {
  fullName: string;
  birthDate: string;
  address: string;
  phone: string;
  weight: string;
  height: string;
  activityLevel: string;
  maritalStatus: string;
  occupation: string;
  cancerDiagnosisDate: string;
  procedures: string[];
  skinChanges: string[];
  musculoskeletalComplaints: string;
  lymphedemaSymptoms: string;
  cacifoSign: string;
  orangePeelSign: string;
  stemmerSign: string;
  radiotherapy: { type: string; duration: string };
  hormoneTherapy: { type: string; duration: string };
  chemotherapy: { type: string; duration: string };
  surgery: { type: string; duration: string };
  axillaryDissection: { type: string; duration: string };
  musculoskeletalChanges: string;
  lymphedemaSymptomsDetails: string;
  volumesReferencia?: number[];
  volumesAfetado?: number[];
}
```

### Navegação (Expo Router)
- **File-based routing**: Estrutura baseada em arquivos
- **Stack navigation**: Navegação em pilha
- **Typed routes**: Rotas tipadas com TypeScript

### Componentes Reutilizáveis
- **Headers personalizados** para cada seção
- **Dropdowns e pickers** para seleção de dados
- **Date pickers** para datas
- **Accordion** para FAQ

---

## 🔢 Algoritmos e Cálculos

### Volumetria Indireta

#### Fórmula do Tronco de Cone
```typescript
V = (h / 12π) × (C₁² + C₁ × C₂ + C₂²)
```

Onde:
- `V` = Volume do segmento
- `h` = Altura do segmento (10cm padrão)
- `C₁` = Circunferência proximal
- `C₂` = Circunferência distal
- `π` = Pi (3.14159...)

#### Implementação
```typescript
function calculateSegmentVolume(
  height: number,
  proximalCircumference: number,
  distalCircumference: number
): number {
  const h = height;
  const c1 = proximalCircumference;
  const c2 = distalCircumference;
  
  return (h / (12 * Math.PI)) * (c1 * c1 + c1 * c2 + c2 * c2);
}
```

### Classificação do Linfedema
```typescript
function classifyLymphedema(percentage: number): string {
  if (percentage < 5) {
    return "Sem alterações volumétricas";
  } else if (percentage >= 5 && percentage < 10) {
    return "Estágio 0 (subclínico)";
  } else if (percentage >= 10 && percentage < 20) {
    return "Estágio I (leve)";
  } else if (percentage >= 20 && percentage < 40) {
    return "Estágio II (moderado)";
  } else {
    return "Estágio III (avançado)";
  }
}
```

---

## 🗄️ Banco de Dados

### Schema SQLite

#### Tabela de Pacientes
```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  birth_date TEXT,
  address TEXT,
  phone TEXT,
  weight REAL,
  height REAL,
  activity_level TEXT,
  marital_status TEXT,
  occupation TEXT,
  cancer_diagnosis_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela de Avaliações
```sql
CREATE TABLE evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  evaluation_date TEXT,
  affected_arm TEXT,
  reference_arm TEXT,
  measurements TEXT, -- JSON string
  volumes TEXT, -- JSON string
  volume_difference_percentage REAL,
  lymphedema_classification TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);
```

#### Tabela de Medições
```sql
CREATE TABLE measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evaluation_id INTEGER,
  arm_side TEXT, -- 'left' or 'right'
  measurement_point INTEGER, -- 0, 10, 20, 30, etc.
  circumference REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id)
);
```

### Operações de Banco

#### Inserção de Paciente
```typescript
async function insertPatient(patientData: PatientData): Promise<number> {
  const db = await openDatabase();
  const result = await db.runAsync(
    `INSERT INTO patients (full_name, birth_date, address, phone, weight, height, 
     activity_level, marital_status, occupation, cancer_diagnosis_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      patientData.fullName,
      patientData.birthDate,
      patientData.address,
      patientData.phone,
      parseFloat(patientData.weight),
      parseFloat(patientData.height),
      patientData.activityLevel,
      patientData.maritalStatus,
      patientData.occupation,
      patientData.cancerDiagnosisDate
    ]
  );
  return result.lastInsertRowId;
}
```

---

## 🌐 API e Comunicação

### Configuração Axios
```typescript
const API_URL = "https://ac8b5f7d0939.ngrok-free.app";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para autenticação
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Endpoints Principais
- **POST** `/auth/login` - Autenticação
- **POST** `/auth/register` - Cadastro
- **GET** `/auth/me` - Dados do usuário
- **POST** `/auth/reset-password` - Reset de senha
- **GET** `/patients` - Lista de pacientes
- **POST** `/patients` - Criar paciente
- **PUT** `/patients/:id` - Atualizar paciente
- **DELETE** `/patients/:id` - Deletar paciente
- **GET** `/evaluations/:patientId` - Avaliações do paciente
- **POST** `/evaluations` - Criar avaliação

---

## 📱 Gerenciamento de Estado

### Context Provider
```typescript
interface AppContextType {
  patientData: PatientData;
  setPatientData: (data: PatientData) => void;
  leftArmInputs: number[];
  setLeftArmInputs: (inputs: number[]) => void;
  rightArmInputs: number[];
  setRightArmInputs: (inputs: number[]) => void;
  referenceArm: "right" | "left";
  setReferenceArm: (arm: "right" | "left") => void;
  affectedArm: "right" | "left";
  setAffectedArm: (arm: "right" | "left") => void;
  clearAllData: () => void;
}
```

### Hooks Personalizados
```typescript
// Hook para persistência de dados
function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };
    loadStoredData();
  }, [key]);
  
  const setPersistedState = useCallback((value: T) => {
    setState(value);
    AsyncStorage.setItem(key, JSON.stringify(value));
  }, [key]);
  
  return [state, setPersistedState] as const;
}
```

---

## 📄 Geração de Relatórios PDF

### Estrutura HTML do Relatório
```typescript
export async function generatePatientReport(
  patient: any,
  lastMeasurement: any
) {
  const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            background: #f7f7f7;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #b41976;
            font-size: 26px;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background: linear-gradient(to right, #ffe0f0, #f9c2dc);
            color: #333;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <!-- Conteúdo do relatório -->
      </body>
    </html>
  `;
  
  const { uri } = await Print.printToFileAsync({
    html: htmlContent,
    base64: false,
  });
  
  await Sharing.shareAsync(uri);
}
```

---

## 🔐 Segurança

### Autenticação e Autorização
```typescript
// Armazenamento seguro de tokens
await SecureStore.setItemAsync("access_token", token);
const token = await SecureStore.getItemAsync("access_token");

// Verificação de token válido
const verifyToken = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
```

### Criptografia de Dados Sensíveis
```typescript
import CryptoJS from 'crypto-js';

const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

const decryptData = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

### Validação de Entrada
```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
```

---

## 🧪 Testes

### Configuração Jest
```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### Testes de Componentes
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FaqAccordion from '../components/FaqAccordion';

describe('FaqAccordion', () => {
  const mockItems = [
    { title: 'Test Question', content: 'Test Answer' }
  ];

  it('renders accordion items', () => {
    const { getByText } = render(<FaqAccordion items={mockItems} />);
    expect(getByText('Test Question')).toBeTruthy();
  });

  it('expands when pressed', () => {
    const { getByText } = render(<FaqAccordion items={mockItems} />);
    fireEvent.press(getByText('Test Question'));
    expect(getByText('Test Answer')).toBeTruthy();
  });
});
```

### Testes de Utilidades
```typescript
import { calculateSegmentVolume, classifyLymphedema } from '../utils/calculations';

describe('Volume Calculations', () => {
  it('calculates segment volume correctly', () => {
    const volume = calculateSegmentVolume(10, 25, 23);
    expect(volume).toBeCloseTo(487.23, 2);
  });

  it('classifies lymphedema correctly', () => {
    expect(classifyLymphedema(3)).toBe('Sem alterações volumétricas');
    expect(classifyLymphedema(7)).toBe('Estágio 0 (subclínico)');
    expect(classifyLymphedema(15)).toBe('Estágio I (leve)');
    expect(classifyLymphedema(25)).toBe('Estágio II (moderado)');
    expect(classifyLymphedema(45)).toBe('Estágio III (avançado)');
  });
});
```

---

## 🚀 Build e Deploy

### Scripts de Build
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios"
  }
}
```

### Configuração EAS Build
```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📊 Performance

### Otimizações Implementadas
- **Lazy loading** de componentes
- **Memoização** com React.memo
- **Virtual lists** para grandes datasets
- **Compressão de imagens**
- **Caching** de requisições API

### Monitoramento
```typescript
import * as Sentry from '@sentry/react-native';

// Configuração Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});

// Tracking de performance
const trackPerformance = (operation: string) => {
  const transaction = Sentry.startTransaction({
    name: operation,
    op: 'navigation'
  });
  
  return () => transaction.finish();
};
```

---

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```bash
# .env
API_URL=https://api.linfedemapp.com
SENTRY_DSN=your_sentry_dsn
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Debug no React Native
```typescript
// React Native Debugger
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

// Flipper integration
import { logger } from 'react-native-logs';

const defaultConfig = {
  severity: __DEV__ ? 'debug' : 'error',
  transport: __DEV__ ? logger.consoleTransport : logger.fileAsyncTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright'
    }
  }
};

const log = logger.createLogger(defaultConfig);
```

---

## 📈 Monitoramento e Analytics

### Crash Reporting
```typescript
import crashlytics from '@react-native-firebase/crashlytics';

// Log de erros personalizados
crashlytics().log('User performed action');
crashlytics().recordError(new Error('Custom error'));

// Identificação de usuário
crashlytics().setUserId(user.id);
crashlytics().setAttributes({
  role: 'healthcare_professional',
  specialty: 'physiotherapy'
});
```

### Analytics de Uso
```typescript
import analytics from '@react-native-firebase/analytics';

// Tracking de eventos
const trackEvent = async (eventName: string, parameters: object) => {
  await analytics().logEvent(eventName, parameters);
};

// Exemplos de uso
trackEvent('patient_created', { patient_id: patientId });
trackEvent('evaluation_completed', { 
  evaluation_id: evaluationId,
  lymphedema_stage: stage
});
```

---

## 🔮 Roadmap Técnico

### Próximas Implementações
- [ ] **Modo offline** completo
- [ ] **Sincronização automática** de dados
- [ ] **Machine Learning** para predição de evolução
- [ ] **Integração com wearables**
- [ ] **API GraphQL** para queries otimizadas
- [ ] **Progressive Web App** (PWA)
- [ ] **Multi-idioma** completo
- [ ] **Telemedicina** integrada

### Melhorias de Performance
- [ ] **Code splitting** avançado
- [ ] **Image optimization** automática
- [ ] **Bundle size** redução
- [ ] **Memory leaks** prevenção
- [ ] **Battery optimization**

---

**© 2024 Linfedemapp - Documentação Técnica v1.0**