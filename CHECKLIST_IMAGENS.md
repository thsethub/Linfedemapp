# Checklist — tamanho de imagens (versão web)

Método: Playwright em 390×844 (celular), 360×640, 768×1024 e 1440×900 (desktop), conta de homologação.
Para cada imagem: tamanho natural × renderizado, distorção (proporção) e estouro horizontal.
Capturas em `.playwright-mcp/` (fluxo/, sweep2/, sweep3/).

## Causas encontradas (transversais)

- [x] **C1** `className="w-6 h-6"` em `<Image>` não é aplicado na web → ícones saíam no tamanho natural (até 512 px). 8 ocorrências → `style={{ width, height }}` (fichaExame, fichaExame2 ×2, resultado, headerCalculadora, headerFicha1/2, headerResultado).
- [x] **C2** Telas dimensionadas por `Dimensions`/`useWindowDimensions` cresciam com a janela → `utils/layout.ts` (`useAppWindow`, `MAX_APP_WIDTH = 480`) em index, bracoEsquerdo, bracoDireito, historicoDetalhes (gráfico).
- [x] **C3** Sem moldura de celular na web → `WebFrame` em `app/_layout.tsx` (largura máx. 480 px, centralizada, fundo cinza).
- [x] **C4** Imagens com proporção diferente da caixa → `resizeMode: "contain"` em `home.tsx` (image 8.png) e `faq.tsx` (faq.png).
- [x] **C5** Cartões com `flex-1` colapsavam na web e o conteúdo vazava sobre o cartão seguinte → removido `flex-1` dos cartões (braços, calculadora, fichas).
- [x] **C6** `Dropdown` com `flex:1` + `justifyContent:"center"` empurrava o título 20 px sobre a legenda das imagens → `flex-start`.
- [x] **C7** Campos de texto em linha (`flex-1`) não encolhiam na web (o `<input>` tem largura mínima) e vazavam do cartão: peso/altura da `fichaExame` pareciam uma barra só e a unidade (`cm`) ficava fora do cartão → `style={{ minWidth: 0 }}`.
- [x] **C8** Cartões com `width: 360` fixo eram cortados em telas de 360 px na web (a barra de rolagem reduz a área útil) → `width: "100%"` + `maxWidth: 360` (15 cartões em fichas, braços, calculadora e resultado).
- [x] **C9** Entrada com composição dependente do tamanho da tela → colagem numa caixa de proporção fixa (390×328, a do projeto), escalada de forma uniforme e centralizada; mesmas coordenadas em 360, 390, 768 e 1440 px.
- [x] **C10** Conteúdo cortado sem rolagem em telas baixas (home: "Histórico de Exames"; login: "Registrar agora"; entrada) → `ScrollView` nas três telas. Auditoria automática: nenhum texto fica abaixo da área visível sem um contêiner que role até ele.
- [x] **C11** Dropdowns (`Dropdown`/`Dropdown2`): a lista flutuante (posição absoluta) cobria o campo seguinte e era cortada → lista **dentro do fluxo** da tela, com rolagem interna (máx. 210 px), marca o item escolhido e fecha ao escolher ou ao tocar no campo.
- [x] **C12** Seletor de data (`WheelColumn`): na web a seleção não mudava ao rolar (eventos de fim de rolagem não disparam com roda/barra) e a coluna do dia ficava desalinhada → detecção de fim de rolagem por inatividade, com encaixe no item.
- [x] **C13** Histórico: gráfico novo (`EvolutionChart`) com curva suave (interpolação monotônica), eixo X proporcional às datas, filtros de período (Tudo/3/6/12 meses), séries ligáveis/desligáveis, ponto clicável com detalhes (data, volumes em cm³, diferença), ícones no lugar de emojis; toque por áreas nativas (onPress em SVG não funciona na web).
- [x] **C14** Detalhes: valores gravados já traduzidos no idioma da época (`Left`, `Ulnar Styloid Process`...) agora são reconhecidos em pt/en/es e exibidos no idioma atual (`utils/storedValueLabels.ts`, também no PDF); "•:" nas alterações cutâneas; "Vol. Diferença" fixo em português; unidade mL → cm³; emojis 📅📝 trocados por ícones.

## Telas (ordem do fluxo)

- [x] 1. Entrada (`/`) — colagem de fotos proporcional ao contêiner, curva do fundo restaurada, foto direita sangrando na borda, sem rolagem horizontal
- [x] 2. Seleção de idioma (`/select-language`) — ok
- [x] 3. Login (`/sing-in`) — ok
- [x] 4. Cadastro (`/sing-up`) — ok
- [x] 5. Recuperar senha (`/recuperar_senha`) — ok
- [x] 6. Home (`/home`) — imagem da enfermeira sem distorção
- [x] 7. Perfil (`/profile`) — ok
- [x] 8. Configurações (`/settings`) — ok
- [x] 9. FAQ (`/faq`) — imagem do médico sem distorção
- [x] 10. Notícias (`/news`) — ok
- [x] 11. Sobre (`/sobre`) — ok
- [x] 12. Ficha do paciente 1 (`/fichaExame`) — ícone 24 px; peso/altura separados, com kg/cm dentro do cartão
- [x] 13. Ficha do paciente 2 (`/fichaExame2`) — ícones 24 px
- [x] 14. Calculadora (`/calculadora`) — ícone do header 24 px; sobreposição das legendas corrigida
- [x] 15. Braço esquerdo (`/bracoEsquerdo`) — cartão "Processo de medição" completo
- [x] 16. Braço direito (`/bracoDireito`) — idem
- [x] 17. Resultado (`/resultado`) — ícones 24 px
- [x] 18. Histórico de exames (`/historicoExames`) — ok
- [x] 19. Detalhes do histórico (`/historicoDetalhes/[id]`) — gráfico limitado à moldura
- [x] 20. Reteste em 4 tamanhos + `expo export --platform web` (21 rotas) — ver resultado abaixo

## Fora do escopo (observado, não alterado)

- Tela de idioma: "Español" mostra um globo no lugar da bandeira (BR/US aparecem como texto; emojis de bandeira não existem no Windows).
- O botão flutuante de FAQ (?) sobrepõe o fim de algumas telas.
- Com o token expirado, `/historicoDetalhes/[id]` mostra "Nenhum dado encontrado" em vez de voltar ao login.
