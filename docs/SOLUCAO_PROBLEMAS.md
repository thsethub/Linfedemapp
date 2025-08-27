# Guia de Solução de Problemas - Linfedemapp

## 🚨 Problemas Comuns e Soluções

### 📱 Problemas de Instalação e Inicialização

#### App não instala
**Sintomas:**
- Erro durante download
- Instalação falha
- "App não compatível"

**Soluções:**
1. **Verificar compatibilidade:**
   - Android: Versão 6.0+ necessária
   - iOS: Versão 11.0+ necessária
   - Espaço livre: Mínimo 100MB

2. **Limpar cache da loja:**
   - **Android:** Configurações > Apps > Google Play Store > Armazenamento > Limpar Cache
   - **iOS:** Configurações > Geral > Armazenamento do iPhone > App Store > Descarregar App

3. **Verificar conexão:**
   - Teste com WiFi estável
   - Desative VPN temporariamente
   - Verifique se não há restrições de rede

#### App não abre/Tela preta
**Sintomas:**
- App fecha imediatamente após abrir
- Tela preta por mais de 30 segundos
- Loading infinito

**Soluções:**
1. **Força o fechamento e reabre:**
   - **Android:** Botão de apps recentes > Deslizar app para cima
   - **iOS:** Duplo clique no botão home > Deslizar app para cima

2. **Reiniciar dispositivo:**
   - Desligue completamente o dispositivo
   - Aguarde 10 segundos
   - Ligue novamente

3. **Verificar atualizações:**
   - Acesse a loja de aplicativos
   - Procure por atualizações pendentes
   - Instale a versão mais recente

4. **Reinstalar o aplicativo:**
   - Desinstale completamente
   - Reinicie o dispositivo
   - Reinstale da loja oficial

#### Erro de "Rede não disponível"
**Sintomas:**
- Mensagem "Sem conexão"
- Timeout de requisições
- Dados não sincronizam

**Soluções:**
1. **Verificar conectividade:**
   ```bash
   # Teste de conectividade
   ping 8.8.8.8
   ```
   - Teste com outros apps
   - Verifique velocidade da internet

2. **Configurações de rede:**
   - Desconecte e reconecte WiFi
   - Teste com dados móveis
   - Esqueça e reconecte rede WiFi

3. **Configurações do app:**
   - Permissões de rede concedidas
   - App não bloqueado no firewall
   - Antivírus não está interferindo

---

### 🔐 Problemas de Login e Autenticação

#### Não consigo fazer login
**Sintomas:**
- "Credenciais inválidas"
- "Usuário não encontrado"
- "Erro interno do servidor"

**Soluções:**
1. **Verificar credenciais:**
   - Confirme e-mail correto
   - Verifique se Caps Lock está ativo
   - Teste senha em outro dispositivo

2. **Reset de senha:**
   - Clique em "Esqueceu a senha?"
   - Verifique caixa de spam
   - Aguarde até 15 minutos pelo e-mail

3. **Limpar dados de login:**
   - Configurações do app > Limpar dados de login
   - Logout completo
   - Novo login

#### Token expirado
**Sintomas:**
- "Sessão expirada"
- Redirecionamento para login
- Erro 401 Unauthorized

**Soluções:**
1. **Login novamente:**
   - Faça logout completo
   - Aguarde 30 segundos
   - Faça novo login

2. **Verificar horário do dispositivo:**
   - Sincronize com horário automático
   - Verifique fuso horário correto

#### Código de verificação não chega
**Sintomas:**
- E-mail de verificação não recebido
- Código SMS não chega
- Processo de recuperação trava

**Soluções:**
1. **Verificar caixa de spam/lixo eletrônico**
2. **Aguardar até 15 minutos**
3. **Solicitar novo código**
4. **Verificar número/e-mail cadastrado**
5. **Contatar suporte** se persistir

---

### 💾 Problemas com Dados e Sincronização

#### Dados não salvam
**Sintomas:**
- Informações perdidas ao sair
- "Erro ao salvar dados"
- Formulários resetam

**Soluções:**
1. **Verificar espaço de armazenamento:**
   - **Android:** Configurações > Armazenamento
   - **iOS:** Configurações > Geral > Armazenamento do iPhone
   - Libere pelo menos 500MB

2. **Campos obrigatórios:**
   - Preencha todos os campos marcados com *
   - Verifique formato de datas (DD/MM/AAAA)
   - Confirme valores numéricos válidos

3. **Permissões do app:**
   - Configurações > Apps > Linfedemapp > Permissões
   - Habilite "Armazenamento"

#### Sincronização falha
**Sintomas:**
- "Erro de sincronização"
- Dados antigos aparecem
- Múltiplas versões dos mesmos dados

**Soluções:**
1. **Força sincronização:**
   - Menu > Configurações > Sincronizar agora
   - Aguarde conclusão completa

2. **Logout/Login:**
   - Faça backup dos dados não sincronizados
   - Logout completo
   - Login novamente
   - Verifique sincronização

3. **Verificar conflitos:**
   - Acesse Configurações > Resolver conflitos
   - Escolha versão mais recente
   - Confirme alterações

#### Dados duplicados
**Sintomas:**
- Pacientes aparecem em duplicata
- Múltiplas avaliações idênticas
- Inconsistências no histórico

**Soluções:**
1. **Ferramenta de limpeza:**
   - Menu > Configurações > Limpar duplicatas
   - Revise sugestões antes de confirmar
   - Faça backup antes da limpeza

2. **Merge manual:**
   - Identifique registros duplicados
   - Transfira dados únicos para um registro
   - Delete duplicatas vazias

---

### 📊 Problemas com Cálculos e Relatórios

#### Cálculos incorretos
**Sintomas:**
- Volumetria com valores estranhos
- Percentuais negativos
- Classificação inadequada

**Soluções:**
1. **Verificar medições:**
   - Confirme todas as medidas preenchidas
   - Verifique unidade (cm, não mm)
   - Revise valores extremos

2. **Recalcular manualmente:**
   - Menu > Calculadora > Recalcular
   - Compare com cálculo manual
   - Verifique fórmula utilizada

3. **Validar protocolo:**
   - Confirme protocolo de medição usado
   - Verifique ordem das medidas
   - Validar membro de referência

#### PDF não gera
**Sintomas:**
- "Erro ao gerar relatório"
- PDF em branco
- Processo trava

**Soluções:**
1. **Verificar dados completos:**
   - Todas as medições preenchidas
   - Dados do paciente completos
   - Pelo menos uma avaliação

2. **Espaço de armazenamento:**
   - Libere espaço no dispositivo
   - Verifique permissões de escrita

3. **Tentar novamente:**
   - Aguarde 1 minuto
   - Tente em horário de menor uso
   - Reinicie o app se necessário

#### Relatório com dados errados
**Sintomas:**
- Informações de outro paciente
- Datas incorretas
- Medições trocadas

**Soluções:**
1. **Verificar seleção:**
   - Confirme paciente selecionado
   - Verifique data da avaliação
   - Validar filtros aplicados

2. **Atualizar cache:**
   - Configurações > Limpar cache
   - Reiniciar aplicativo
   - Gerar relatório novamente

---

### 🖥️ Problemas de Interface

#### Tela não responde ao toque
**Sintomas:**
- Botões não funcionam
- Scroll não funciona
- Gestos ignorados

**Soluções:**
1. **Verificar protetor de tela:**
   - Remova película/protetor defeituoso
   - Limpe tela com pano macio

2. **Calibração de toque:**
   - **Android:** Configurações > Display > Calibração de toque
   - **iOS:** Reiniciar dispositivo

3. **Modo desenvolvedor (Android):**
   - Configurações > Desenvolvedor > Mostrar toques
   - Verifique se toques são detectados

#### App lento/Travando
**Sintomas:**
- Resposta lenta aos comandos
- Transições lentas entre telas
- App congela temporariamente

**Soluções:**
1. **Fechar apps em segundo plano:**
   - Feche aplicativos desnecessários
   - Libere memória RAM

2. **Reiniciar dispositivo:**
   - Desligue completamente
   - Aguarde 30 segundos
   - Ligue novamente

3. **Verificar recursos:**
   - CPU: < 80% de uso
   - RAM: Pelo menos 1GB livre
   - Temperatura: Não superaquecido

#### Textos cortados/Sobrepostos
**Sintomas:**
- Textos não aparecem completos
- Botões sobrepostos
- Layout quebrado

**Soluções:**
1. **Configurações de display:**
   - Ajuste tamanho da fonte no sistema
   - Verifique zoom/ampliação
   - Teste orientação portrait/landscape

2. **Resolução da tela:**
   - Confirme se dispositivo é suportado
   - Verifique DPI customizado

---

### 📸 Problemas com Mídia

#### Imagens não carregam
**Sintomas:**
- Placeholders no lugar de imagens
- "Erro ao carregar imagem"
- Ícones não aparecem

**Soluções:**
1. **Verificar conectividade:**
   - Teste download de outras imagens
   - Verifique cache de imagens

2. **Limpar cache:**
   - Configurações > Armazenamento > Limpar cache
   - Reiniciar aplicativo

3. **Permissões:**
   - Habilite acesso à galeria
   - Confirme permissões de mídia

---

### 🔧 Problemas Específicos por Plataforma

#### Android

**App não aparece na lista de apps:**
```bash
# Verificar instalação via ADB
adb shell pm list packages | grep linfedemapp
```

**Problema com armazenamento scoped:**
- Configurações > Apps > Linfedemapp > Permissões
- Habilite "Arquivos e mídia"

**Otimização de bateria:**
- Configurações > Bateria > Otimização de bateria
- Adicione Linfedemapp à lista de exceções

#### iOS

**App não instala (TestFlight):**
- Verifique se convite não expirou
- Confirme Apple ID correto
- Atualize TestFlight app

**Problema com certificados:**
- Configurações > Geral > Gerenciamento de Dispositivo
- Confie no desenvolvedor

**Backup iCloud:**
- Configurações > Apple ID > iCloud > Apps
- Habilite backup para Linfedemapp

---

### 🌐 Problemas de Conectividade

#### API não responde
**Sintomas:**
- Timeout de requisições
- "Servidor indisponível"
- Erro 500/502/503

**Soluções:**
1. **Status do servidor:**
   - Verifique status em [status.linfedemapp.com]
   - Aguarde resolução automática

2. **DNS alternativo:**
   - Configure DNS público (8.8.8.8)
   - Teste com DNS da operadora

3. **Proxy/VPN:**
   - Desabilite temporariamente
   - Teste conexão direta

#### Sincronização lenta
**Sintomas:**
- Demora excessiva para sincronizar
- Processo nunca termina
- Progresso trava

**Soluções:**
1. **Otimizar conexão:**
   - Use WiFi em vez de dados móveis
   - Verifique qualidade do sinal
   - Teste velocidade da internet

2. **Sincronização em lotes:**
   - Configure sincronização automática
   - Faça sync por partes
   - Use horários de menor uso

---

### 📋 Checklist de Diagnóstico

#### Antes de reportar problema:

**Informações básicas:**
- [ ] Versão do app
- [ ] Sistema operacional e versão
- [ ] Modelo do dispositivo
- [ ] Versão do iOS/Android

**Reproduce o problema:**
- [ ] Consegue reproduzir consistentemente?
- [ ] Acontece em situações específicas?
- [ ] Começou após alguma ação específica?

**Tentativas de solução:**
- [ ] Reiniciou o app
- [ ] Reiniciou o dispositivo
- [ ] Verificou conexão de internet
- [ ] Tentou logout/login
- [ ] Verificou espaço de armazenamento

**Coleta de logs:**
- [ ] Screenshots do erro
- [ ] Logs de erro (se disponível)
- [ ] Passos para reproduzir

---

### 📞 Canais de Suporte

#### Suporte Técnico
- **E-mail:** suporte@linfedemapp.com
- **WhatsApp:** +55 (11) 99999-9999
- **Chat:** Disponível no app (ícone ?)

#### Horários de Atendimento
- **Segunda a Sexta:** 8h às 18h
- **Sábado:** 8h às 12h
- **Emergências:** 24h via e-mail

#### Informações para Suporte
Sempre inclua:
1. **Versão do app** (Menu > Sobre)
2. **Modelo do dispositivo**
3. **Sistema operacional e versão**
4. **Descrição detalhada do problema**
5. **Passos para reproduzir**
6. **Screenshots** (se aplicável)

#### Tempo de Resposta
- **Chat:** Imediato durante horário comercial
- **WhatsApp:** Até 2 horas
- **E-mail:** Até 24 horas
- **Problemas críticos:** Até 4 horas

---

### 🛠️ Ferramentas de Diagnóstico

#### Teste de Conectividade
```bash
# Teste ping para servidor
ping api.linfedemapp.com

# Teste de resolução DNS
nslookup api.linfedemapp.com

# Teste de porta
telnet api.linfedemapp.com 443
```

#### Logs do Sistema
**Android:**
```bash
adb logcat | grep -i linfedemapp
```

**iOS:** Use Console app no macOS

#### Reset Completo
**Último recurso - Reset total:**
1. Backup de dados importantes
2. Desinstalar completamente o app
3. Limpar cache do sistema
4. Reiniciar dispositivo
5. Reinstalar app
6. Restaurar backup

---

### 📚 FAQ Técnico

#### Q: O app consome muita bateria?
**A:** O consumo normal é < 5% da bateria por dia de uso normal. Se maior:
- Desabilite localização em segundo plano
- Reduza frequência de sincronização
- Feche o app quando não usar

#### Q: Posso usar offline?
**A:** Sim, funcionalidades básicas funcionam offline:
- Criar/editar pacientes
- Fazer medições
- Gerar relatórios
- Sincronização automática quando conectar

#### Q: Dados são seguros?
**A:** Sim, implementamos:
- Criptografia AES-256
- HTTPS para transmissão
- Conformidade com LGPD
- Backups seguros

#### Q: Posso usar em múltiplos dispositivos?
**A:** Sim, faça login com mesma conta:
- Dados sincronizam automaticamente
- Configurações são mantidas
- Histórico completo disponível

---

**© 2024 Linfedemapp - Guia de Solução de Problemas v1.0**