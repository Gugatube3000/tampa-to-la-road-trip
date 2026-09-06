/* ------------------------------------------------------------------
   ZapClone — dados de exemplo
   Todos os contatos, grupos e mensagens abaixo são FICTÍCIOS.
   Qualquer semelhança com pessoas reais é coincidência.

   Formato de tempo: `t` é "minutos atrás" (número negativo = passado).
   O app converte para data absoluta ao carregar, então o roteiro
   sempre parece recente, não importa quando você abrir.
------------------------------------------------------------------ */

const DEFAULT_DATA = {
  version: 1,
  profile: {
    name: 'Você',
    about: 'Disponível',
    phone: '+55 11 9 8888-0000',
    color: '#00a884'
  },

  chats: [
    /* ---------------------------------------------------------- */
    {
      id: 'marina',
      name: 'Marina Estrela',
      color: '#e57373',
      about: 'no modo avião mentalmente',
      phone: '+55 11 9 7412-3388',
      presence: 'online',
      pinned: true,
      messages: [
        { from: 'marina', t: -2890, type: 'text', text: 'oi! você ainda tá de pé pra sexta?' },
        { from: 'me', t: -2884, type: 'text', text: 'tô sim, só não sei a que horas consigo sair daqui', status: 'read' },
        { from: 'marina', t: -2881, type: 'text', text: 'relaxa, a gente não vai antes das 20h de qualquer jeito' },
        { from: 'marina', t: -2880, type: 'text', text: 'o Téo vai atrasar. o Téo SEMPRE atrasa.' },
        { from: 'me', t: -2875, type: 'text', text: '😂 verdade' , status: 'read' },
        { from: 'marina', t: -190, type: 'image', media: 'sunset', text: 'olha o céu daqui de casa agora' },
        { from: 'me', t: -184, type: 'text', text: 'que absurdo isso', status: 'read' },
        { from: 'me', t: -183, type: 'text', text: 'tira uma foto pra mim quando escurecer', status: 'read' },
        { from: 'marina', t: -46, type: 'audio', voice: 'f1',
          transcript: 'Oi! Então, eu fui ver o lugar novo hoje de tarde. É pequeno, mas tem uma varanda nos fundos que é linda. Já reservei a mesa pras oito e meia, tá? Não atrasa.' },
        { from: 'marina', t: -44, type: 'text', text: 'resumindo: o lugar novo tem mesa na varanda. reservei pras 20h30.' },
        { from: 'me', t: -12, type: 'text', text: 'perfeito, vou direto do trabalho então', status: 'delivered' }
      ],
      bot: {
        typingMs: [900, 2200],
        rules: [
          { match: 'obrigad|valeu|vlw', replies: ['imagina 💚'] },
          { match: 'atrasad|atrasar|tarde', replies: ['sem problema, a mesa tá reservada', 'só me avisa quando sair'] },
          { match: 'foto|imagem', replies: ['manda!'] },
          { match: '\\?$', replies: ['acho que sim', 'deixa eu confirmar e te falo'] }
        ],
        fallback: ['boa', 'ata kkkk', 'combinado então', 'tô indo pro chuveiro, já volto', '👍']
      }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'churrasco',
      name: 'Churrasco do Sábado 🔥',
      type: 'group',
      color: '#f0a44a',
      about: 'grupo criado pra decidir quem leva o carvão',
      members: [
        { id: 'teo', name: 'Téo Rabelo', color: '#6a8cff' },
        { id: 'bia', name: 'Bia Nakamura', color: '#c77dff' },
        { id: 'caio', name: 'Caio Prado', color: '#4db6ac' },
        { id: 'marina', name: 'Marina Estrela', color: '#e57373' }
      ],
      unread: 3,
      messages: [
        { from: 'system', t: -4320, type: 'system', text: 'Bia Nakamura criou o grupo "Churrasco do Sábado 🔥"' },
        { from: 'system', t: -4319, type: 'system', text: 'Bia Nakamura adicionou você' },
        { from: 'bia', t: -4315, type: 'text', text: 'gente, sábado 13h na minha casa. quem topa?' },
        { from: 'caio', t: -4310, type: 'text', text: 'eu' },
        { from: 'teo', t: -4308, type: 'text', text: 'eu tbm mas chego 14h' },
        { from: 'bia', t: -4307, type: 'text', text: 'previsível 🙄' },
        { from: 'marina', t: -4300, type: 'text', text: 'vou levar sobremesa' },
        { from: 'me', t: -4290, type: 'text', text: 'tô dentro. levo bebida', status: 'read' },
        { from: 'bia', t: -1500, type: 'doc', filename: 'lista-do-churrasco.pdf', pages: 2, size: '184 kB' },
        { from: 'bia', t: -1499, type: 'text', text: 'organizei tudo aqui pra ninguém repetir item' },
        { from: 'caio', t: -1440, type: 'text', text: 'quem tem churrasqueira mesmo?' },
        { from: 'teo', t: -300, type: 'text', text: 'eu tenho, levo desmontada' },
        { from: 'teo', t: -299, type: 'image', media: 'grill', text: 'essa aqui' },
        { from: 'caio', t: -120, type: 'text', text: 'isso aí é uma churrasqueira ou um foguete', reactions: { '😂': 3 } },
        { from: 'bia', t: -118, type: 'text', text: 'kkkkkkkkkk' },
        { from: 'marina', t: -30, type: 'text', text: 'alguém lembrou do carvão?' },
        { from: 'teo', t: -28, type: 'text', text: '...' },
        { from: 'caio', t: -27, type: 'text', text: 'ngm lembrou do carvão' },
        { from: 'bia', t: -25, type: 'audio', voice: 'f3',
          transcript: 'Gente, eu não acredito nisso. Três semanas de grupo, uma lista em PDF, e ninguém comprou carvão. Eu passo no mercado amanhã de manhã. Mas alguém me deve uma cerveja.' }
      ],
      bot: {
        typingMs: [700, 1800],
        rules: [
          { match: 'carv', from: 'bia', replies: ['ANOTADO na lista', 'agora sim'] },
          { match: 'eu levo|eu compro', from: 'caio', replies: ['salvou o churrasco 🙏'] },
          { match: 'hora|que horas', from: 'bia', replies: ['13h. treze. 1-3.'] }
        ],
        fallback: [
          { from: 'teo', text: 'concordo' },
          { from: 'caio', text: 'kkkkk' },
          { from: 'bia', text: 'vou anotar isso na lista' },
          { from: 'marina', text: '👀' }
        ]
      }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'mae',
      name: 'Mãe ❤️',
      color: '#ec9bb6',
      about: 'A família é tudo 🙏🌷',
      phone: '+55 31 9 9110-4477',
      presence: 'visto por último hoje às 09:12',
      pinned: true,
      messages: [
        { from: 'mae', t: -1445, type: 'text', text: 'Bom dia meu filho' },
        { from: 'mae', t: -1445, type: 'text', text: 'Bom dia 🌷🌷🌷' },
        { from: 'mae', t: -1444, type: 'image', media: 'flowers' },
        { from: 'me', t: -1380, type: 'text', text: 'bom dia mãe ❤️', status: 'read' },
        { from: 'mae', t: -1375, type: 'text', text: 'Você almoçou?' },
        { from: 'me', t: -1370, type: 'text', text: 'almocei sim', status: 'read' },
        { from: 'mae', t: -1368, type: 'text', text: 'Almoçou o quê' },
        { from: 'me', t: -1360, type: 'text', text: 'arroz feijão e frango', status: 'read' },
        { from: 'mae', t: -1358, type: 'text', text: 'Salada?' },
        { from: 'me', t: -1350, type: 'text', text: '...', status: 'read' },
        { from: 'mae', t: -1349, type: 'text', text: 'Eu sabia' },
        { from: 'mae', t: -95, type: 'audio', voice: 'f2',
          transcript: 'Meu filho, é sobre o aniversário da sua tia. Vai ser no sábado que vem, na casa dela, uma hora da tarde. Ela pediu pra você levar aquela sobremesa que você fez no Natal. E leva um casaco que lá é frio. Beijo, minha bênção.' },
        { from: 'mae', t: -94, type: 'text', text: 'Ouve o áudio quando puder, é sobre o aniversário da sua tia' }
      ],
      bot: {
        typingMs: [1500, 3500],
        rules: [
          { match: 'almoç|comi|jantar', replies: ['Comeu salada?', 'Você precisa se alimentar direito'] },
          { match: 'amo|❤️', replies: ['Também te amo meu filho ❤️❤️❤️'] },
          { match: 'trabalh', replies: ['Não trabalha demais não', 'Descansa um pouco'] }
        ],
        fallback: ['Que bom meu filho 🙏', 'Deus abençoe 🌷', 'Me liga quando puder', 'Tá bom então ❤️']
      }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'andorinha',
      name: 'Projeto Andorinha',
      type: 'group',
      color: '#5b8def',
      about: 'squad do release · sem áudio depois das 19h',
      members: [
        { id: 'lu', name: 'Luana Prado', color: '#4db6ac' },
        { id: 'rafa', name: 'Rafael Q.', color: '#ffb74d' },
        { id: 'sam', name: 'Samir Aoun', color: '#a1887f' }
      ],
      unread: 1,
      muted: true,
      messages: [
        { from: 'lu', t: -560, type: 'text', text: 'bom dia. o deploy de ontem subiu limpo ✅' },
        { from: 'rafa', t: -558, type: 'text', text: 'boa. e o bug do filtro de data?' },
        { from: 'lu', t: -555, type: 'text', text: 'corrigido na 2.4.1, tá em homologação' },
        { from: 'sam', t: -540, type: 'doc', filename: 'release-notes-2.4.1.md', pages: 1, size: '9 kB' },
        { from: 'me', t: -520, type: 'text', text: 'vou revisar hoje à tarde', status: 'read' },
        { from: 'rafa', t: -300, type: 'text', text: 'alguém consegue olhar o PR #218? tá parado desde ontem', replyToIdx: 4 },
        { from: 'lu', t: -60, type: 'text', text: 'reunião de alinhamento amanhã 10h, sala 3' },
        { from: 'sam', t: -40, type: 'audio', voice: 'm2',
          transcript: 'Rápido: eu revisei o PR duzentos e dezoito. Tá bom no geral, só deixei dois comentários sobre o tratamento de erro. Fora isso pode subir.' }
      ],
      bot: {
        typingMs: [800, 2000],
        rules: [
          { match: 'pr|review|revis', from: 'rafa', replies: ['valeu 🙏'] },
          { match: 'deploy|subir', from: 'lu', replies: ['só depois do QA passar, por favor'] }
        ],
        fallback: [
          { from: 'lu', text: 'ok, anotado' },
          { from: 'sam', text: '👍' },
          { from: 'rafa', text: 'faz sentido' }
        ]
      }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'teo',
      name: 'Téo Rabelo',
      color: '#6a8cff',
      about: 'chegando em 5 min (mentira)',
      phone: '+55 11 9 6620-1199',
      presence: 'digitando…',
      messages: [
        { from: 'teo', t: -800, type: 'text', text: 'cara, esqueci de te devolver aquele dinheiro' },
        { from: 'me', t: -795, type: 'text', text: 'kkkk relaxa', status: 'read' },
        { from: 'teo', t: -790, type: 'text', text: 'não, sério, me manda a chave pix' },
        { from: 'me', t: -780, type: 'text', text: 'depois eu mando', status: 'read' },
        { from: 'teo', t: -240, type: 'text', text: 'e aí, mandou a chave?' },
        { from: 'me', t: -238, type: 'text', text: 'esqueci 😅', status: 'read' },
        { from: 'teo', t: -236, type: 'text', text: 'somos dois então' },
        { from: 'teo', t: -60, type: 'audio', voice: 'm1',
          transcript: 'Cara, desculpa o áudio, tô dirigindo. Só confirmando: sábado, uma da tarde, casa da Bia. Eu levo a churrasqueira e chego umas duas. Ou duas e meia.' },
        { from: 'teo', t: -8, type: 'text', text: 'sábado ainda tá de pé né?' }
      ],
      bot: {
        typingMs: [600, 1600],
        rules: [
          { match: 'pix|chave', replies: ['recebi! te mando agora', 'feito ✅'] },
          { match: 'sábado|sabado|churrasco', replies: ['show. eu chego 14h', 'ou 14h30'] }
        ],
        fallback: ['bora', 'kkkkk', 'boa', 'te falo mais tarde']
      }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'clinica',
      name: 'Clínica Bem-Estar',
      color: '#26a69a',
      business: true,
      about: 'Conta comercial · Responde em minutos',
      phone: '+55 11 3000-1122',
      messages: [
        { from: 'clinica', t: -2000, type: 'text', text: 'Olá! Aqui é da Clínica Bem-Estar. Sua consulta de limpeza está agendada.' },
        { from: 'clinica', t: -1999, type: 'text', text: '🗓 Quinta-feira, 14h30\n📍 Rua das Laranjeiras, 210 — sala 4' },
        { from: 'me', t: -1990, type: 'text', text: 'Confirmado, obrigado', status: 'read' },
        { from: 'clinica', t: -1988, type: 'text', text: 'Perfeito! Enviaremos um lembrete 24h antes. 😁' },
        { from: 'clinica', t: -1435, type: 'text', text: 'Lembrete: sua consulta é amanhã às 14h30. Responda 1 para confirmar ou 2 para remarcar.' },
        { from: 'me', t: -1400, type: 'text', text: '1', status: 'read' }
      ],
      bot: {
        typingMs: [500, 1200],
        rules: [
          { match: '^1$|confirm', replies: ['Consulta confirmada! Até quinta. ✅'] },
          { match: '^2$|remarcar|cancelar', replies: ['Sem problema. Qual dia da próxima semana funciona melhor pra você?'] },
          { match: 'endereço|onde', replies: ['Rua das Laranjeiras, 210 — sala 4. Há estacionamento no local.'] }
        ],
        fallback: ['Recebemos sua mensagem! Um atendente responderá em instantes.', 'Posso ajudar com mais alguma coisa? 😊']
      }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'entregas',
      name: 'Entrega Rápida',
      color: '#8d6e63',
      business: true,
      about: 'Conta comercial',
      messages: [
        { from: 'entregas', t: -430, type: 'text', text: 'Pedido #40219 saiu para entrega 🛵' },
        { from: 'entregas', t: -180, type: 'text', text: 'Seu entregador é o Wilson. Chega em ~15 min.' },
        { from: 'entregas', t: -160, type: 'text', text: 'Pedido entregue ✅ Obrigado por comprar com a gente!' }
      ],
      bot: { typingMs: [400, 900], rules: [], fallback: ['Este número não recebe respostas. Para suporte, use o app. 🙂'] }
    },

    /* ---------------------------------------------------------- */
    {
      id: 'bia',
      name: 'Bia Nakamura',
      color: '#c77dff',
      about: 'ocupada, mas nunca ocupada demais',
      archived: true,
      messages: [
        { from: 'bia', t: -10080, type: 'text', text: 'te mandei o link da vaga, deu uma olhada?' },
        { from: 'me', t: -10070, type: 'text', text: 'dei! achei boa, vou aplicar', status: 'read' },
        { from: 'bia', t: -10060, type: 'text', text: 'faz isso. e me avisa 🤞' }
      ],
      bot: { typingMs: [800, 2000], rules: [], fallback: ['boa!', 'me conta depois'] }
    }
  ]
};

if (typeof window !== 'undefined') window.DEFAULT_DATA = DEFAULT_DATA;
