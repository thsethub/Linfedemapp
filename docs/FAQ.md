# FAQ - Perguntas Frequentes - Linfedemapp

## 🤔 Perguntas Gerais

### O que é o Linfedemapp?
O Linfedemapp é uma ferramenta desenvolvida para profissionais de saúde otimizarem o acompanhamento de pacientes com linfedema. Ele permite registrar dados de anamnese, realizar medições de perimetria, calcular o volume do membro e acompanhar a evolução do tratamento através de um histórico detalhado.

### Quem pode usar o aplicativo?
O aplicativo é destinado exclusivamente para **profissionais de saúde** habilitados, incluindo:
- Fisioterapeutas
- Médicos (oncologistas, cirurgiões, etc.)
- Enfermeiros especializados
- Terapeutas ocupacionais
- Outros profissionais da área da saúde

### É necessário registro profissional para usar?
Sim, durante o cadastro é solicitado o número do conselho profissional (CREFITO, CRM, COREN, etc.) para validação da habilitação profissional.

### O aplicativo é gratuito?
Sim, o Linfedemapp é totalmente gratuito para profissionais de saúde. Nosso objetivo é democratizar o acesso a ferramentas de qualidade para avaliação de linfedema.

---

## 📱 Instalação e Configuração

### Em quais dispositivos funciona?
- **Android**: Versão 6.0 ou superior
- **iOS**: Versão 11.0 ou superior  
- **Web**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

### Como instalar o aplicativo?
- **Android**: Google Play Store
- **iOS**: App Store
- **Web**: Acesse [linfedemapp.com](https://linfedemapp.com)

### Preciso de internet para usar?
A maioria das funcionalidades funciona offline, mas é necessária conexão para:
- Login inicial
- Sincronização de dados
- Geração de relatórios online
- Backup de dados

### Quanto espaço ocupa no dispositivo?
Aproximadamente 50-100MB após instalação completa, dependendo do número de pacientes e dados armazenados.

---

## 🩺 Funcionalidades Clínicas

### Como a volumetria é calculada no aplicativo?
O cálculo de volume no aplicativo é realizado por meio de medidas de circunferência obtidas pela perimetria, utilizando o método da volumetria indireta. Nesse processo, o membro é dividido em segmentos sucessivos de aproximadamente 10 cm, cada qual considerado como um tronco de cone. 

O volume de cada segmento é calculado pela fórmula:
**V = (h / 12π) × (C₁² + C₁ × C₂ + C₂²)**

Onde:
- h = altura do segmento (distância entre pontos de medida)
- C₁ = circunferência proximal  
- C₂ = circunferência distal

A soma dos volumes de todos os segmentos fornece o volume total do membro.

### Qual a base científica do método?
Esse método, descrito nas diretrizes clínicas da American Physical Therapy Association, é reconhecido como uma técnica válida e confiável para a estimativa do volume de membros em pacientes com linfedema (Levenhagen et al., 2017).

**Referência:**
LEVENHAGEN, Kimberly et al. Diagnosis of upper quadrant lymphedema secondary to cancer: clinical practice guideline from the Oncology Section of the American Physical Therapy Association. Physical Therapy, v. 97, n. 7, p. 729-745, 2017.

### Como interpretar os resultados?
O aplicativo classifica automaticamente o linfedema baseado na diferença percentual de volume:

| Diferença de Volume | Classificação |
|-------------------|---------------|
| < 5% | Sem alterações volumétricas |
| 5% - 10% | Estágio 0 (subclínico) |
| 10% - 20% | Estágio I (leve) |
| 20% - 40% | Estágio II (moderado) |
| > 40% | Estágio III (avançado) |

### Posso personalizar os protocolos de medição?
Sim, nas configurações você pode ajustar:
- Intervalos entre medições (5cm, 10cm, 15cm)
- Ponto de partida (ponta do dedo, metacarpo)
- Critérios de classificação
- Campos obrigatórios

---

## 👥 Gestão de Pacientes

### Quantos pacientes posso cadastrar?
Não há limite para o número de pacientes. O armazenamento é local no dispositivo e sincronizado na nuvem.

### Como faço backup dos dados?
O backup é automático quando conectado à internet. Você também pode:
- Exportar dados manualmente (Menu > Configurações > Exportar)
- Sincronizar com múltiplos dispositivos
- Gerar relatórios PDF para arquivamento

### É possível compartilhar pacientes entre profissionais?
Atualmente não. Cada profissional tem acesso apenas aos seus próprios pacientes, seguindo princípios de privacidade e confidencialidade médica.

### Como deletar um paciente?
1. Acesse a lista de pacientes
2. Selecione o paciente
3. Toque no menu (⋮) > "Remover paciente"
4. Confirme a ação

**Atenção**: Esta ação é irreversível e remove todos os dados associados.

---

## 📊 Medições e Avaliações

### Qual a precisão necessária nas medições?
Recomendamos precisão de **1mm (0,1cm)** para garantir cálculos confiáveis. Use sempre fita métrica inextensível e mantenha tensão consistente.

### Posso corrigir medições após salvar?
Sim, você pode editar avaliações até 24 horas após criação. Após esse período, recomenda-se criar nova avaliação com observações sobre correções.

### Como garantir medições consistentes?
**Dicas importantes:**
- Mesmo horário do dia
- Paciente bem hidratado
- Posicionamento padronizado
- Fita perpendicular ao eixo do membro
- Tensão consistente (sem apertar)
- Anotar observações sobre dificuldades

### É possível comparar avaliações?
Sim. A seção 'Histórico de Exames' armazena todas as avaliações. Ao selecionar um paciente, você pode visualizar a progressão do volume do membro, a diferença percentual entre avaliações e comparar dados de perimetria ao longo do tempo, facilitando a análise da eficácia do tratamento.

---

## 📄 Relatórios

### Como funciona a exportação de relatórios?
A partir do histórico, qualquer exame pode ser exportado como um relatório em formato PDF. O documento inclui os dados do paciente, as medidas de perimetria, o volume calculado e a data da avaliação, pronto para ser anexado ao prontuário eletrônico ou compartilhado.

### Posso personalizar o relatório?
Sim, você pode:
- Escolher informações a incluir
- Adicionar logotipo da clínica/hospital
- Personalizar cabeçalho e rodapé
- Incluir ou excluir gráficos
- Adicionar observações personalizadas

### O relatório tem validade legal?
O relatório é um documento técnico que pode ser usado como parte da documentação clínica, mas deve seguir as normas e protocolos de sua instituição.

### Posso incluir múltiplas avaliações em um relatório?
Sim, você pode gerar relatórios comparativos incluindo:
- Múltiplas avaliações do mesmo paciente
- Gráficos de evolução temporal
- Análise de tendências
- Comparação entre períodos

---

## 🔒 Segurança e Privacidade

### Como os dados dos pacientes são protegidos?
A segurança é nossa prioridade. Todos os dados são transmitidos via HTTPS e armazenados com criptografia. O acesso é restrito e segue as diretrizes da Lei Geral de Proteção de Dados (LGPD), garantindo a confidencialidade das informações clínicas.

### O aplicativo é compatível com a LGPD?
Sim, totalmente. Implementamos:
- **Consentimento explícito** para coleta de dados
- **Minimização** de dados coletados
- **Pseudonimização** quando possível
- **Direito ao esquecimento**
- **Portabilidade** de dados
- **Auditoria** de acessos

### Onde os dados ficam armazenados?
- **Local**: Criptografados no dispositivo
- **Nuvem**: Servidores seguros no Brasil
- **Backup**: Múltiplas cópias seguras
- **Não compartilhamos** dados com terceiros

### Como funciona a autenticação?
- **Login seguro** com e-mail e senha
- **Tokens JWT** para sessões
- **Timeout automático** após inatividade
- **Verificação em duas etapas** (opcional)
- **Bloqueio** após tentativas incorretas

---

## 🛠️ Problemas Técnicos

### O aplicativo está lento, o que fazer?
1. **Feche outros aplicativos** em segundo plano
2. **Reinicie o dispositivo**
3. **Verifique espaço livre** (mínimo 500MB)
4. **Atualize para última versão**
5. **Limpe cache** (Configurações > Armazenamento)

### Dados não sincronizam, como resolver?
1. **Verifique conexão** com internet
2. **Faça logout e login** novamente  
3. **Verifique espaço** na nuvem
4. **Aguarde alguns minutos** e tente novamente
5. **Entre em contato** se persistir

### Como recuperar dados perdidos?
- **Sincronização automática**: Dados na nuvem
- **Backup local**: Verificar storage do dispositivo
- **Histórico**: Últimas versões mantidas
- **Suporte**: Equipe pode ajudar na recuperação

### Encontrei um bug, como reportar?
1. **Reproduza** o erro se possível
2. **Anote os passos** para reproduzir
3. **Tire screenshots** se aplicável
4. **Reporte via**:
   - App: Menu > Suporte > Reportar Bug
   - E-mail: bugs@linfedemapp.com
   - GitHub: Issues no repositório

---

## 🎓 Treinamento e Suporte

### Há treinamentos disponíveis?
Sim, oferecemos:
- **Vídeos tutoriais** no aplicativo
- **Webinars** mensais gratuitos
- **Manual completo** em PDF
- **Suporte online** via chat
- **Treinamentos presenciais** (sob demanda)

### Como obter suporte técnico?
- **Chat no app**: Disponível 8h-18h (dias úteis)
- **E-mail**: suporte@linfedemapp.com
- **WhatsApp**: +55 (11) 99999-9999
- **FAQ**: Seção completa no aplicativo

### Vocês oferecem consultoria clínica?
Sim, temos uma equipe de especialistas em linfedema disponível para:
- **Consultoria sobre protocolos**
- **Interpretação de resultados**
- **Implementação em clínicas**
- **Treinamento de equipes**

### Como posso contribuir com melhorias?
- **Sugestões**: Menu > Suporte > Sugerir Melhoria
- **Beta testing**: Programa de testadores beta
- **Feedback**: Avaliações na loja de apps
- **Comunidade**: Grupo de usuários no LinkedIn

---

## 💼 Uso Profissional

### Posso usar em clínicas/hospitais?
Sim, o aplicativo é adequado para uso institucional. Oferecemos:
- **Licenças institucionais**
- **Treinamento de equipes**
- **Personalização** para a instituição
- **Suporte técnico** dedicado

### É possível integrar com prontuários eletrônicos?
Sim, através de:
- **API REST** disponível
- **Exportação** de dados padronizada
- **Webhooks** para integração
- **Consultoria** para implementação

### Como fazer controle de qualidade?
O aplicativo oferece:
- **Relatórios de auditoria**
- **Histórico de alterações**
- **Validação automática** de dados
- **Alertas** para medições inconsistentes

### Posso usar para pesquisa?
Sim, mediante aprovação do CEP. Oferecemos:
- **Dados anonimizados**
- **Exportação para análise**
- **Suporte estatístico**
- **Compliance** com ética em pesquisa

---

## 🔄 Atualizações

### Com que frequência é atualizado?
- **Correções**: Semanalmente se necessário
- **Funcionalidades**: Mensalmente
- **Versões principais**: Trimestralmente
- **Segurança**: Imediatamente quando necessário

### Como fico sabendo de atualizações?
- **Notificações automáticas** no app
- **E-mail newsletter** mensal
- **Redes sociais** (@linfedemapp)
- **Website** (linfedemapp.com/novidades)

### É obrigatório atualizar?
Recomendamos sempre usar a versão mais recente para:
- **Correções de bugs**
- **Melhorias de segurança**
- **Novas funcionalidades**
- **Compatibilidade** mantida

### Como desabilitar atualizações automáticas?
Não recomendamos, mas você pode:
- **Android**: Play Store > Configurações > Atualização automática
- **iOS**: Configurações > App Store > Atualizações automáticas

---

## 📈 Estatísticas e Analytics

### O app coleta dados de uso?
Sim, apenas dados técnicos agregados para:
- **Melhorar performance**
- **Identificar bugs**
- **Planejar funcionalidades**
- **Estatísticas anônimas**

**Nunca coletamos**:
- Dados de pacientes
- Informações pessoais
- Dados clínicos
- Qualquer informação identificável

### Posso desabilitar analytics?
Sim, em Configurações > Privacidade > Analytics pode ser desabilitado sem impacto nas funcionalidades.

### Há estatísticas sobre meu uso?
Sim, você pode visualizar:
- **Número de pacientes** cadastrados
- **Avaliações realizadas** por período
- **Tempo médio** por avaliação
- **Distribuição** de casos por estágio

---

## 🌍 Disponibilidade e Idiomas

### Em quais países está disponível?
Atualmente disponível em:
- **Brasil** (completo)
- **Portugal** (em beta)
- **Outros países**: Planejado para 2024

### Há suporte a outros idiomas?
- **Português**: Completo
- **Inglês**: Em desenvolvimento
- **Espanhol**: Planejado

### Como solicitar tradução?
Entre em contato via traducoes@linfedemapp.com informando:
- Idioma desejado
- Região/país
- Instituição que utilizaria

---

## 💡 Recursos Avançados

### Há modo escuro disponível?
Sim, em Configurações > Aparência > Tema você pode escolher:
- **Claro** (padrão)
- **Escuro**
- **Automático** (segue sistema)

### Posso usar em tablets?
Sim, o aplicativo é otimizado para:
- **Tablets Android** (7" ou maior)
- **iPads** (todas as versões)
- **Interface adaptativa** para telas grandes

### Há atalhos de teclado?
Para versão web/desktop:
- **Ctrl+N**: Novo paciente
- **Ctrl+S**: Salvar dados
- **Ctrl+P**: Gerar relatório
- **F1**: Ajuda/FAQ

### Suporta acessibilidade?
Sim, implementamos:
- **Leitor de tela** compatível
- **Alto contraste**
- **Navegação por teclado**
- **Texto ampliado**
- **Suporte a voice-over**

---

## 🆘 Contato e Suporte

### Canais de Atendimento
- **Suporte Técnico**: suporte@linfedemapp.com
- **Suporte Clínico**: clinico@linfedemapp.com
- **Comercial**: comercial@linfedemapp.com
- **Geral**: contato@linfedemapp.com

### Horários de Atendimento
- **Chat**: Segunda a Sexta, 8h às 18h
- **E-mail**: 24h (resposta em até 24h)
- **WhatsApp**: Segunda a Sexta, 8h às 18h
- **Emergências**: 24h via e-mail

### Redes Sociais
- **LinkedIn**: /company/linfedemapp
- **Instagram**: @linfedemapp
- **YouTube**: /LinfedemappOficial
- **Twitter**: @linfedemapp

---

**Não encontrou sua pergunta? Entre em contato conosco!**

📧 E-mail: faq@linfedemapp.com  
💬 Chat: Disponível no aplicativo  
📱 WhatsApp: +55 (11) 99999-9999

---

**© 2024 Linfedemapp - FAQ v1.0**