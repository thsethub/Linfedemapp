# Guia de Contribuição - Linfedemapp

## 🤝 Como Contribuir

Obrigado pelo interesse em contribuir com o Linfedemapp! Este guia ajudará você a entender como participar do desenvolvimento desta importante ferramenta para profissionais de saúde.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Começar](#como-começar)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Documentação](#documentação)
- [Revisão de Código](#revisão-de-código)
- [Licença](#licença)

## 📜 Código de Conduta

### Nosso Compromisso
Como contribuidores e mantenedores deste projeto, comprometemo-nos a fazer da participação uma experiência livre de assédio para todos, independentemente de idade, tamanho corporal, deficiência, etnia, identidade e expressão de gênero, nível de experiência, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

### Comportamentos Esperados
- **Seja respeitoso** com diferentes pontos de vista
- **Aceite críticas construtivas** graciosamente
- **Foque no que é melhor** para a comunidade
- **Mostre empatia** com outros membros
- **Use linguagem inclusiva** e acolhedora

### Comportamentos Inaceitáveis
- **Linguagem ou imagens sexualizadas**
- **Comentários trolling, insultuosos ou depreciativos**
- **Assédio público ou privado**
- **Publicação de informações privadas** de terceiros
- **Qualquer conduta** considerada inadequada em ambiente profissional

## 🚀 Como Começar

### 1. Explore o Projeto
- Leia o [README.md](../README.md) para entender o propósito
- Navegue pela [documentação técnica](./DOCUMENTACAO_TECNICA.md)
- Teste o aplicativo para entender a funcionalidade

### 2. Encontre Formas de Contribuir
- **Issues marcadas** com `good first issue`
- **Bugs reportados** pela comunidade
- **Melhorias na documentação**
- **Novas funcionalidades** solicitadas

### 3. Entre em Contato
- **GitHub Issues**: Para bugs e funcionalidades
- **Discussions**: Para perguntas e ideias
- **E-mail**: contribuicoes@linfedemapp.com

## 💡 Tipos de Contribuição

### 🐛 Correção de Bugs
- Reproduza o bug relatado
- Identifique a causa raiz
- Implemente a correção mínima
- Adicione testes para prevenir regressões

### ✨ Novas Funcionalidades
- Discuta a proposta em uma issue primeiro
- Considere o impacto na experiência do usuário
- Mantenha consistência com o design existente
- Documente a nova funcionalidade

### 📚 Documentação
- Corrija erros de digitação
- Melhore explicações existentes
- Adicione exemplos práticos
- Traduza conteúdo

### 🧪 Testes
- Adicione testes para código não coberto
- Melhore testes existentes
- Crie cenários de teste edge case
- Documente estratégias de teste

### 🎨 Design e UX
- Melhore usabilidade
- Otimize performance visual
- Garanta acessibilidade
- Mantenha consistência visual

## ⚙️ Configuração do Ambiente

### Pré-requisitos
```bash
# Node.js 18+
node --version

# npm ou yarn
npm --version

# Git
git --version

# Expo CLI
npm install -g @expo/cli
```

### Configuração Inicial
```bash
# 1. Fork o repositório no GitHub

# 2. Clone seu fork
git clone https://github.com/SEU_USERNAME/Linfedemapp.git
cd Linfedemapp

# 3. Adicione o remote upstream
git remote add upstream https://github.com/thsethub/Linfedemapp.git

# 4. Instale dependências
npm install

# 5. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# 6. Inicie o servidor de desenvolvimento
npm start
```

### Verificação da Configuração
```bash
# Execute os testes
npm test

# Verifique linting
npm run lint

# Teste build
npm run build
```

## 🔄 Fluxo de Desenvolvimento

### 1. Sincronizar com Upstream
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Criar Branch de Feature
```bash
# Use convenção: tipo/descricao-curta
git checkout -b feature/melhorar-calculo-volumetria
git checkout -b bugfix/corrigir-sincronizacao
git checkout -b docs/atualizar-manual-usuario
```

### 3. Desenvolvimento
```bash
# Faça commits pequenos e frequentes
git add .
git commit -m "feat: adicionar validação de entrada para medições"

# Mantenha branch atualizada
git fetch upstream
git rebase upstream/main
```

### 4. Preparar Pull Request
```bash
# Execute testes
npm test

# Verifique linting
npm run lint:fix

# Atualize documentação se necessário
npm run docs:generate

# Push da branch
git push origin feature/melhorar-calculo-volumetria
```

### 5. Criar Pull Request
- Use template de PR fornecido
- Descreva mudanças claramente
- Referencie issues relacionadas
- Adicione screenshots se aplicável

## 📝 Padrões de Código

### Convenções de Nomenclatura
```typescript
// Componentes: PascalCase
export default function PatientForm() {}

// Variáveis e funções: camelCase
const patientData = {};
function calculateVolume() {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.linfedemapp.com";

// Arquivos: kebab-case
patient-form.tsx
volume-calculator.ts
```

### Estrutura de Componentes
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Props interface
interface PatientFormProps {
  patient?: Patient;
  onSave: (data: PatientData) => void;
  loading?: boolean;
}

// Component
export default function PatientForm({ 
  patient, 
  onSave, 
  loading = false 
}: PatientFormProps) {
  // State
  const [formData, setFormData] = useState<PatientData>({});
  
  // Effects
  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  // Handlers
  const handleSubmit = () => {
    onSave(formData);
  };

  // Render
  return (
    <View>
      {/* Component JSX */}
    </View>
  );
}
```

### Padrões TypeScript
```typescript
// Use interfaces para props e dados
interface Patient {
  id: number;
  fullName: string;
  birthDate: string;
  measurements?: Measurement[];
}

// Use types para unions e computados
type LymphedemaStage = 'stage_0' | 'stage_1' | 'stage_2' | 'stage_3';
type PatientWithMeasurements = Patient & { measurements: Measurement[] };

// Use enums para constantes relacionadas
enum MeasurementPoint {
  FINGERTIP = 0,
  METACARPAL = 10,
  WRIST = 20,
  FOREARM_DISTAL = 30,
}
```

### Estilização com TailwindCSS
```typescript
// Preferir classes utilitárias
<View className="flex-1 bg-white-500 px-4 py-6">
  <Text className="text-lg font-semibold text-gray-800 mb-4">
    Patient Information
  </Text>
</View>

// Para estilos complexos, usar style object
<View 
  className="bg-primary-500 rounded-lg"
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }}
>
```

### Tratamento de Erros
```typescript
// Use try-catch para operações assíncronas
const savePatient = async (data: PatientData) => {
  try {
    const result = await api.patients.create(data);
    showSuccess('Paciente salvo com sucesso');
    return result;
  } catch (error) {
    console.error('Error saving patient:', error);
    showError('Erro ao salvar paciente');
    throw error;
  }
};

// Use Error Boundary para erros de componente
class PatientFormErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError('PatientForm error:', error, errorInfo);
  }
}
```

## 🧪 Testes

### Estrutura de Testes
```
__tests__/
├── components/
│   ├── PatientForm.test.tsx
│   └── VolumeCalculator.test.tsx
├── utils/
│   ├── calculations.test.ts
│   └── validation.test.ts
├── screens/
│   └── HomeScreen.test.tsx
└── api/
    └── patients.test.ts
```

### Padrões de Teste
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PatientForm from '../components/PatientForm';

describe('PatientForm', () => {
  const mockOnSave = jest.fn();
  
  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders form fields correctly', () => {
    const { getByPlaceholderText } = render(
      <PatientForm onSave={mockOnSave} />
    );
    
    expect(getByPlaceholderText('Nome completo')).toBeTruthy();
    expect(getByPlaceholderText('Data de nascimento')).toBeTruthy();
  });

  it('calls onSave with form data when submitted', async () => {
    const { getByPlaceholderText, getByText } = render(
      <PatientForm onSave={mockOnSave} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Nome completo'), 'João Silva');
    fireEvent.press(getByText('Salvar'));
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        fullName: 'João Silva'
      });
    });
  });
});
```

### Comandos de Teste
```bash
# Executar todos os testes
npm test

# Executar com watch mode
npm test -- --watch

# Executar com coverage
npm test -- --coverage

# Executar testes específicos
npm test PatientForm

# Executar testes em modo CI
npm test -- --ci --watchAll=false
```

### Cobertura Mínima
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 📖 Documentação

### Comentários de Código
```typescript
/**
 * Calcula o volume de um segmento usando a fórmula do tronco de cone
 * 
 * @param height - Altura do segmento em cm
 * @param proximalCircumference - Circunferência proximal em cm
 * @param distalCircumference - Circunferência distal em cm
 * @returns Volume do segmento em mL
 * 
 * @example
 * ```typescript
 * const volume = calculateSegmentVolume(10, 25, 23);
 * console.log(volume); // 487.23
 * ```
 */
function calculateSegmentVolume(
  height: number,
  proximalCircumference: number,
  distalCircumference: number
): number {
  // Implementação...
}
```

### README Components
```typescript
// Para componentes complexos, inclua README.md
// components/PatientForm/README.md

# PatientForm Component

## Usage
```tsx
<PatientForm
  patient={patient}
  onSave={handleSave}
  loading={isLoading}
/>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| patient | Patient | No | Existing patient data |
| onSave | Function | Yes | Callback when form is saved |
| loading | boolean | No | Show loading state |
```

### Changelog
Mantenha [CHANGELOG.md](../CHANGELOG.md) atualizado:
```markdown
## [1.2.0] - 2024-01-20

### Added
- Nova funcionalidade de exportação em Excel
- Suporte a múltiplos idiomas

### Changed
- Melhorada performance do cálculo de volumetria
- Interface de usuário mais responsiva

### Fixed
- Corrigido bug na sincronização de dados
- Resolvido problema de memory leak
```

## 🔍 Revisão de Código

### Checklist do Autor
Antes de criar PR, verifique:

- [ ] **Funcionalidade**
  - [ ] Feature funciona conforme especificado
  - [ ] Não quebra funcionalidades existentes
  - [ ] Tratamento adequado de erros

- [ ] **Código**
  - [ ] Segue padrões de estilo do projeto
  - [ ] Variáveis e funções bem nomeadas
  - [ ] Código bem documentado
  - [ ] Sem código comentado desnecessário

- [ ] **Testes**
  - [ ] Testes unitários adicionados/atualizados
  - [ ] Cobertura de teste adequada
  - [ ] Todos os testes passando

- [ ] **Performance**
  - [ ] Não impacta performance negativamente
  - [ ] Uso eficiente de memória
  - [ ] Renderização otimizada

- [ ] **Segurança**
  - [ ] Validação adequada de entrada
  - [ ] Sem exposição de dados sensíveis
  - [ ] Autenticação/autorização apropriada

### Checklist do Revisor
Durante a revisão, considere:

- [ ] **Arquitetura**
  - [ ] Solução adequada para o problema
  - [ ] Mantém consistência arquitetural
  - [ ] Não adiciona complexidade desnecessária

- [ ] **Usabilidade**
  - [ ] Interface intuitiva
  - [ ] Feedback adequado ao usuário
  - [ ] Acessibilidade considerada

- [ ] **Manutenibilidade**
  - [ ] Código fácil de entender
  - [ ] Bem estruturado e modular
  - [ ] Documentação adequada

## 🚀 Deploy e Release

### Processo de Release
1. **Preparação**
   - Atualizar CHANGELOG.md
   - Incrementar versão em package.json
   - Executar testes completos

2. **Build**
   - Gerar build de produção
   - Executar testes e2e
   - Validar performance

3. **Deploy**
   - Deploy para ambiente staging
   - Testes de aceitação
   - Deploy para produção

### Versionamento Semântico
- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (x.Y.0): Funcionalidades compatíveis
- **PATCH** (x.y.Z): Correções de bugs

## 📊 Métricas de Contribuição

### O que Medimos
- **Qualidade**: Coverage de testes, bugs reportados
- **Atividade**: PRs submetidos, issues resolvidas
- **Comunidade**: Contribuidores ativos, tempo de resposta

### Reconhecimento
- **Contributors**: Lista no README.md
- **Hall of Fame**: Contribuidores destacados
- **Badges**: Reconhecimento por categorias

## 🎯 Roadmap de Contribuições

### Prioridades Atuais
1. **Melhorar cobertura de testes** (80% → 90%)
2. **Implementar modo offline** completo
3. **Adicionar suporte a tablets**
4. **Otimizar performance** em dispositivos antigos

### Áreas que Precisam de Ajuda
- **Documentação médica** (revisão por especialistas)
- **Tradução** para outros idiomas
- **Testes de acessibilidade**
- **Performance em dispositivos Android** antigos

### Como se Envolver
1. **Issues de primeira contribuição**: `good-first-issue`
2. **Mentoria**: Programa de mentoria para novos contribuidores
3. **Discussões**: Participe das discussões de design
4. **Review**: Ajude na revisão de PRs

## 📞 Contato e Suporte

### Canais de Comunicação
- **GitHub Issues**: Bugs e features
- **GitHub Discussions**: Perguntas e ideias gerais
- **Discord**: Chat da comunidade
- **E-mail**: contribuicoes@linfedemapp.com

### Responsáveis
- **Maintainer Principal**: [@thsethub](https://github.com/thsethub)
- **Revisores de Código**: Equipe core
- **Consultores Médicos**: Especialistas em linfedema

## 📄 Licença

Ao contribuir com o Linfedemapp, você concorda que suas contribuições serão licenciadas sob a [MIT License](../LICENSE).

Suas contribuições são de sua autoria ou você tem o direito legal de submetê-las sob a licença open source do projeto.

---

## 🙏 Agradecimentos

Agradecemos a todos os contribuidores que ajudam a tornar o Linfedemapp uma ferramenta cada vez melhor para profissionais de saúde!

Sua contribuição, seja ela um simples relatório de bug ou uma funcionalidade complexa, faz a diferença na vida de profissionais de saúde e seus pacientes.

**Juntos, estamos construindo o futuro da avaliação de linfedema! 🚀**

---

**© 2024 Linfedemapp - Guia de Contribuição v1.0**