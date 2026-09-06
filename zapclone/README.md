# ZapClone

Recriação da interface de um aplicativo de mensagens, escrita do zero em HTML, CSS e
JavaScript puro — sem framework, sem build, sem dependências e sem nenhuma chamada de rede.

Abra `zapclone/index.html` no navegador (ou acesse `/zapclone/` no GitHub Pages).

## O que tem

**Mensagens de voz**
- Áudio que **toca de verdade**: a transcrição do roteiro é falada pelo sintetizador
  do próprio navegador, com timbre distinto por personagem (`voice` no roteiro)
- Onda com progresso real, marcador arrastável para buscar posição, velocidade 1× / 1,5× / 2×,
  transcrição com a palavra corrente destacada e ponto azul de "ainda não ouvido"
- Sem voz instalada no aparelho, a reprodução visual continua idêntica pelo cronômetro
- Botão do microfone abre uma barra de gravação com cronômetro, descartar e enviar

**Conversa**
- Balões de entrada e saída com rabinho, agrupamento por remetente e separadores de data
  (Hoje / Ontem / dia da semana / data completa)
- Carimbo de hora e confirmações de leitura em três estados: enviada, entregue, lida —
  com a progressão acontecendo em tempo real depois do envio
- Tipos de mensagem: texto, foto, mensagem de voz, documento e aviso de sistema
- Resposta com citação (clique na citação para pular até a mensagem original)
- Reações com emoji, indicador de "digitando…" e botão de "descer para a última mensagem"
- Grupos com nome e cor por participante

**Lista de conversas**
- Prévia da última mensagem, horário, contador de não lidas, fixadas, silenciadas e arquivadas
- Filtros: Tudo / Não lidas / Grupos / Arquivadas
- Busca global que varre nomes *e* o conteúdo das mensagens

**Interação**
- Busca dentro da conversa, com destaque, contagem e navegação entre ocorrências
- Menu de contexto (clique com o botão direito, ou no chevron do balão): responder, reagir,
  copiar, apagar
- Menu da conversa: dados do contato/grupo, fixar, silenciar, arquivar, marcar como não lida,
  limpar, apagar e **exportar a conversa em `.txt`**
- Anexos simulados, seletor de emoji, reprodução simulada de áudio com waveform animada
- Tema claro e escuro, com detecção da preferência do sistema
- Layout responsivo: duas colunas no desktop, navegação de painel único no celular

**Celular**
- Altura em `dvh` e áreas seguras (`env(safe-area-inset-*)`) para notch e barra de gestos
- Toque longo abre o menu de contexto; arrastar a mensagem para a direita responde a ela
- Botão voltar do aparelho fecha a conversa em vez de sair da página
- Campo de texto em 16px para o iOS não dar zoom ao focar; ajuste ao abrir o teclado virtual
- Alvos de toque ampliados, sem rolagem horizontal e sem rolagem do documento

**Roteiro**
- Motor de resposta automática por conversa: regras com expressão regular, atrasos de digitação
  configuráveis e respostas de fallback (em grupo, cada resposta pode vir de um participante
  diferente)
- **Editor de roteiro** embutido (ícone `<>`): o app inteiro é gerado a partir de um objeto JSON
  que você pode editar na tela e aplicar na hora
- Criação de contatos e grupos novos pela interface

## Arquivo único

`node build.mjs` gera `zapclone-standalone.html`: um único HTML com CSS, JS e roteiro
embutidos, que roda offline ao abrir direto do disco.

## Atalhos

| Tecla | Ação |
|---|---|
| `/` | Focar a busca de conversas |
| `Ctrl/⌘ + F` | Buscar dentro da conversa aberta |
| `Enter` | Enviar |
| `Shift + Enter` | Quebrar linha |
| `Esc` | Fechar modal, menu, busca ou voltar (no celular) |

## Formato do roteiro

```jsonc
{
  "profile": { "name": "Você", "color": "#00a884" },
  "chats": [{
    "id": "marina",
    "name": "Marina Estrela",
    "color": "#e57373",
    "type": "dm",                    // ou "group"
    "pinned": true,
    "members": [],                   // { id, name, color } — só para grupos
    "messages": [
      { "from": "marina", "t": -46, "type": "text", "text": "oi!" },
      { "from": "me",     "t": -12, "type": "text", "text": "oi", "status": "read" }
    ],
    "bot": {
      "typingMs": [900, 2200],
      "rules": [{ "match": "obrigad|valeu", "replies": ["imagina 💚"] }],
      "fallback": ["boa", "👍"]
    }
  }]
}
```

- `t` é **minutos atrás** (negativo = passado), então o roteiro sempre parece recente.
- `from` aceita `"me"`, o `id` da conversa, o `id` de um participante do grupo ou `"system"`.
- `type`: `text`, `image` (com `media` e `text` opcional), `audio` (com `dur` em segundos),
  `doc` (com `filename`, `pages`, `size`) ou `system`.
- `status` (só para `from: "me"`): `sent`, `delivered` ou `read`.
- Áudio: `transcript` faz o navegador falar a mensagem; `voice` escolhe o timbre
  (`f1`, `f2`, `f3`, `m1`, `m2`, `me`); sem `transcript`, use `dur` em segundos.
- Em grupos, cada item de `fallback` e cada `rule` pode trazer `from` para escolher quem responde.

## Dados e privacidade

O estado fica apenas no `localStorage` do navegador. Nada é enviado para lugar nenhum — não há
requisição de rede em momento algum. As fotos são SVGs gerados em tempo de execução, e os avatares
são SVGs com as iniciais do nome. Limpar os dados do site apaga tudo e restaura o roteiro de exemplo.

## Escopo

Isto é uma peça de interface. Os contatos e conversas que vêm de exemplo são **inventados**, e o app
sinaliza isso em três lugares que aparecem em qualquer captura de tela: a faixa abaixo do cabeçalho
da conversa, o aviso no topo de cada histórico e o rodapé do painel lateral.

Não use para montar conversas atribuídas a pessoas reais. Uma tela que imita um app de mensagens é
indistinguível de um print autêntico quando circula fora de contexto, e mensagens inventadas
atribuídas a alguém identificável são invenção — não deixam de ser porque saíram daqui.

## Arquivos

```
zapclone/
├── index.html   estrutura e sprite de ícones
├── styles.css   temas, layout, balões e player de voz
├── app.js       estado, renderização, busca, menus, áudio, gestos e respostas
├── data.js      roteiro de exemplo (fictício)
└── build.mjs    empacota tudo em um HTML único
```
