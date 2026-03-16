import type { ToolDefinition, ToolSlug } from "@/types";

export const toolDefinitions: ToolDefinition[] = [
  {
    slug: "video-para-clipe-viral",
    title: "Transformar video em clipe viral",
    kicker: "Motor de descoberta",
    category: "Clipes virais",
    attentionLabel: "Alta intencao",
    shortDescription:
      "Transforme qualquer video em um clipe curto com framing vertical, ritmo mais forte e exportacao pronta para TikTok, Shorts e Reels.",
    longDescription:
      "Essa rota foi desenhada para quem quer sair de um video bruto ou longo e gerar uma versao muito mais curta, vertical e com cara de conteudo pronto para distribuicao rapida. O fluxo aplica heuristicas de corte, destaca o quadro principal, melhora presenca visual e normaliza o audio para a versao final parecer mais forte logo de primeira.",
    seoTitle: "Transformar video em clipe viral para TikTok, Shorts e Reels",
    seoDescription:
      "Converta qualquer video em um clipe curto viral com framing vertical, ritmo mais forte, audio ajustado e exportacao pronta para TikTok, Shorts, Reels e Stories.",
    supportedOutputs: ["TikTok-safe", "Shorts-safe", "Reels-safe", "1080x1920"],
    useCases: [
      "Trechos de podcast",
      "Cortes de aula",
      "UGC e review",
      "Conteudo para descoberta"
    ],
    retentionPrompt:
      "Guarde o preset viral e repita o fluxo quando precisar publicar mais um corte forte.",
    audience:
      "Criadores, social media, infoprodutores e equipes que precisam gerar volume sem editar tudo do zero.",
    promise: "Mais chance de retenção inicial com menos trabalho manual.",
    platforms: ["TikTok", "Shorts", "Reels", "Stories"],
    featured: true
  },
  {
    slug: "cortar-video-automaticamente",
    title: "Cortar video automaticamente",
    kicker: "Fluxo inteligente",
    category: "Clipes virais",
    attentionLabel: "Economia de tempo",
    shortDescription:
      "Reduza introducoes lentas e trechos mortos com um corte automatico pensado para clipes mais diretos.",
    longDescription:
      "Perfeito para quem tem volume de videos e quer chegar mais rapido em uma versao curta. A ferramenta usa janelas automaticas para encurtar o material, reduzir a gordura inicial e entregar um arquivo mais pronto para redes sociais, anuncios e validacao de ganchos.",
    seoTitle: "Cortar video automaticamente online para clipes curtos",
    seoDescription:
      "Faça corte automatico de video online, reduza trechos longos e gere uma versao mais curta para validacao rapida em redes sociais.",
    supportedOutputs: ["MP4", "30s", "45s", "60s"],
    useCases: [
      "Resumo rapido",
      "Cortes para testes",
      "Criativos para anuncio",
      "Publicacao recorrente"
    ],
    retentionPrompt:
      "Salve o modo de corte automatico para repetir a rotina em lotes inteiros.",
    audience:
      "Quem publica muito e quer um primeiro corte pronto antes de lapidar detalhes.",
    promise: "Menos tempo para sair do bruto e chegar em algo publicavel.",
    platforms: ["TikTok", "Shorts", "Reels", "WhatsApp"],
    featured: true
  },
  {
    slug: "video-horizontal-para-vertical",
    title: "Video horizontal para vertical",
    kicker: "Verticalizacao premium",
    category: "Formatos sociais",
    attentionLabel: "Visual moderno",
    shortDescription:
      "Converta paisagem em 9:16 com fundo blur e area segura para redes sociais.",
    longDescription:
      "Ideal para reaproveitar videos de YouTube, lives, aulas e entrevistas em formatos verticais. O resultado sai com fundo tratado, quadro principal centralizado e exportacao pronta para as plataformas onde a descoberta acontece mais rapido.",
    seoTitle: "Converter video horizontal para vertical online",
    seoDescription:
      "Transforme video horizontal em vertical com fundo blur, crop inteligente e exportacao pronta para TikTok, Shorts, Reels e Stories.",
    supportedOutputs: ["1080x1920", "Blur background", "Stories-safe", "Reels-safe"],
    useCases: [
      "Trechos de live",
      "Aulas em formato curto",
      "Cortes de entrevista",
      "Reciclagem de conteudo"
    ],
    retentionPrompt:
      "O preset vertical fica pronto para reaplicar sempre que um video horizontal entrar no fluxo.",
    audience:
      "Quem grava longo em horizontal e precisa republicar em formato de descoberta.",
    promise: "Reaproveitamento forte sem regravar tudo em pé.",
    platforms: ["TikTok", "Shorts", "Reels", "Stories"],
    featured: true
  },
  {
    slug: "criar-trailer-curto",
    title: "Criar trailer curto",
    kicker: "Teaser rapido",
    category: "Clipes virais",
    attentionLabel: "Chamar atencao",
    shortDescription:
      "Gere um teaser curto para lancamentos, episodios, produtos ou criativos de venda.",
    longDescription:
      "Transforme um video maior em um teaser de 15, 30 ou 45 segundos com visual mais contrastado, ritmo mais curto e exportacao mais pensada para chamar clique, curiosidade e compartilhamento.",
    seoTitle: "Criar trailer curto online para teaser de video",
    seoDescription:
      "Crie trailer curto online com duracao controlada, contraste mais forte e saida pronta para divulgacao em redes sociais e campanhas.",
    supportedOutputs: ["Teaser 15s", "Trailer 30s", "45s", "MP4"],
    useCases: [
      "Lancamento de curso",
      "Trailer de episodio",
      "Criativo de venda",
      "Aquecimento de campanha"
    ],
    retentionPrompt:
      "Guarde um preset de teaser e acelere cada novo lancamento sem recomecar o fluxo.",
    audience:
      "Marcas, creators e times de marketing que precisam abrir interesse rapido.",
    promise: "Mais curiosidade e clique sem editar manualmente do zero.",
    platforms: ["Reels", "Stories", "TikTok", "Ads"],
    featured: true
  },
  {
    slug: "cortar-video",
    title: "Cortar video online",
    kicker: "Edicao rapida",
    category: "Edicao essencial",
    attentionLabel: "Evergreen SEO",
    shortDescription: "Recorte trechos, limpe sobras e publique mais rapido.",
    longDescription:
      "Ideal para remover introducoes longas, ajustar takes e reaproveitar conteudo bruto em formato mais enxuto para redes sociais, atendimento ou bibliotecas internas.",
    seoTitle: "Cortar video online com presets para redes sociais",
    seoDescription:
      "Corte videos no navegador, repita a ultima exportacao e use formatos prontos para Reels, Shorts, TikTok, Stories e WhatsApp.",
    supportedOutputs: ["MP4", "MOV", "1080p", "720p"],
    useCases: ["Remover silencios", "Recortar introducoes", "Gerar trechos rapidos"],
    retentionPrompt:
      "Salve o recorte como projeto e reaplique depois em poucos cliques.",
    audience: "Qualquer pessoa que precise editar rapido sem abrir um editor pesado.",
    promise: "Dor simples, volume alto e excelente potencial de retorno.",
    platforms: ["Web", "Reels", "Shorts", "WhatsApp"]
  },
  {
    slug: "extrair-audio",
    title: "Extrair audio de video",
    kicker: "Audio limpo",
    category: "Audio e formatos",
    attentionLabel: "Utilidade imediata",
    shortDescription:
      "Converta seu video em audio para podcast, transcricao ou distribuicao.",
    longDescription:
      "Extraia trilhas em MP3 ou WAV com um fluxo simples para reaproveitar entrevistas, aulas, podcasts e chamadas de vendas sem depender de software instalado.",
    seoTitle: "Extrair audio de MP4 ou MOV para MP3",
    seoDescription:
      "Extraia audio com rapidez, preserve o arquivo original e reutilize o resultado em outros fluxos do SmartClip.",
    supportedOutputs: ["MP3", "WAV", "AAC"],
    useCases: ["Podcast", "Transcricao", "Reaproveitamento de conteudo"],
    retentionPrompt:
      "Seu ultimo preset fica salvo para repetir a extracao em novos uploads.",
    audience: "Times de conteudo, educacao, podcast e suporte.",
    promise: "Muito trafego organico com um fluxo objetivo e facil de usar.",
    platforms: ["Podcast", "Newsletter", "WhatsApp"]
  },
  {
    slug: "comprimir-video",
    title: "Comprimir video sem perder usabilidade",
    kicker: "Upload mais leve",
    category: "Edicao essencial",
    attentionLabel: "Uso recorrente",
    shortDescription: "Reduza tamanho, mantenha clareza e envie mais rapido.",
    longDescription:
      "Bom para reduzir gargalos de upload, acelerar compartilhamento no WhatsApp e publicar sem comprometer a experiencia final. Ideal para arquivos grandes, times comerciais e criadores que precisam enviar o resultado rapido.",
    seoTitle: "Comprimir video online para compartilhar mais rapido",
    seoDescription:
      "Reduza peso de video, otimize taxa de bits e exporte com presets sociais prontos para envio rapido.",
    supportedOutputs: ["MP4", "H.264", "720p", "1080p"],
    useCases: ["WhatsApp", "Email", "Upload rapido", "Aprovacao de cliente"],
    retentionPrompt:
      "Guarde um preset de compressao para repetir em series inteiras.",
    audience: "Qualquer usuario que bate em limite de tamanho com frequencia.",
    promise: "Resolve uma dor pratica, recorrente e com muita busca orgânica.",
    platforms: ["WhatsApp", "Email", "Drive", "Web"]
  },
  {
    slug: "converter-video",
    title: "Converter formato de video",
    kicker: "Compatibilidade",
    category: "Audio e formatos",
    attentionLabel: "Compatibilidade",
    shortDescription: "Troque container e codec para o formato certo do seu canal.",
    longDescription:
      "Converta arquivos em poucos cliques para distribuir melhor em redes, ferramentas internas, produtos e dispositivos diferentes sem perder tempo com setups longos.",
    seoTitle: "Converter video online para formatos principais",
    seoDescription:
      "Converta arquivos entre formatos populares, reaplique a configuracao e exporte com fila orientada ao seu plano.",
    supportedOutputs: ["MP4", "MOV", "WEBM", "MP3"],
    useCases: ["Compatibilidade", "Entrega para cliente", "Upload em plataformas"],
    retentionPrompt: "Reaplique a ultima conversao com um clique no dashboard.",
    audience: "Quem lida com diferentes plataformas, devices e exigencias de upload.",
    promise: "Fluxo simples para uma dor que aparece o tempo todo.",
    platforms: ["Web", "Mobile", "Ads", "Social"]
  },
  {
    slug: "video-para-reels",
    title: "Video para Reels",
    kicker: "Preset Instagram",
    category: "Formatos sociais",
    attentionLabel: "Muito procurado",
    shortDescription: "Ajuste video para 1080x1920 com rapidez.",
    longDescription:
      "Transforme material horizontal em um formato pronto para Instagram Reels com crop, reposicionamento, frame vertical e exportacao simples em poucos cliques.",
    seoTitle: "Converter video para Reels com preset 1080x1920",
    seoDescription:
      "Gere videos prontos para Reels com crop, compressao, legenda automatica e CTA para upgrade em 1080p.",
    supportedOutputs: ["1080x1920", "MP4", "Stories-safe"],
    useCases: ["Instagram Reels", "Performance organica", "Criativos pagos"],
    retentionPrompt: "Seu ultimo preset Reels fica salvo para o proximo lote.",
    audience: "Criadores e marcas que dependem do Instagram para descoberta ou venda.",
    promise: "Pagina de alta intencao com valor muito claro para conversao.",
    platforms: ["Reels", "Stories"]
  },
  {
    slug: "video-para-shorts",
    title: "Video para Shorts",
    kicker: "Preset YouTube",
    category: "Formatos sociais",
    attentionLabel: "Volume de busca",
    shortDescription: "Prepare videos verticais para Shorts sem perder ritmo.",
    longDescription:
      "Recorte, compacte e gere saidas ideais para manter consistencia no YouTube Shorts com exportacao rapida e layout pronto para consumo mobile.",
    seoTitle: "Video para Shorts com exportacao pronta",
    seoDescription:
      "Otimize videos para Shorts, repita configuracoes e escale cortes com automacao premium quando precisar.",
    supportedOutputs: ["1080x1920", "MP4", "Shorts"],
    useCases: ["YouTube Shorts", "Clipes de podcast", "Recortes de lives"],
    retentionPrompt:
      "Reaplique a configuracao Shorts e reduza o tempo do proximo lote.",
    audience:
      "Quem precisa reaproveitar videos longos e manter ritmo de post no YouTube.",
    promise: "Aproxima o usuario de volume, frequencia e assinatura paga.",
    platforms: ["Shorts", "YouTube"]
  },
  {
    slug: "video-para-tiktok",
    title: "Video para TikTok",
    kicker: "Ritmo e formato",
    category: "Formatos sociais",
    attentionLabel: "Descoberta",
    shortDescription: "Transforme uploads em versoes prontas para TikTok.",
    longDescription:
      "Ajuste proporcao, mantenha a area segura e exporte em um fluxo orientado a volume, rapidez e criativos que possam ser testados em sequencia.",
    seoTitle: "Converter video para TikTok online",
    seoDescription:
      "Use preset pronto para TikTok, legenda automatica e historico de arquivos para repetir a rotina com menos atrito.",
    supportedOutputs: ["1080x1920", "MP4", "TikTok-safe"],
    useCases: ["TikTok organico", "UGC", "Teste de criativo"],
    retentionPrompt:
      "Salve esse preset para repetir a configuracao em novos criativos.",
    audience: "Social media, creators e marcas com foco em descoberta rapida.",
    promise: "Alta procura, dor clara e ponte direta para automacoes premium.",
    platforms: ["TikTok", "Ads"]
  },
  {
    slug: "video-para-stories",
    title: "Video para Stories",
    kicker: "Publicacao instantanea",
    category: "Formatos sociais",
    attentionLabel: "Rapidez",
    shortDescription: "Ajuste resolucao e duracao para Stories mais rapidos.",
    longDescription:
      "Converta clips para o formato vertical ideal de Stories e reaproveite materiais curtos sem re-editar tudo do zero. Bom para vendas, bastidores e testes de criativo.",
    seoTitle: "Video para Stories com preset rapido",
    seoDescription:
      "Gere saidas para Stories, controle tamanho final do arquivo e mantenha arquivos recentes visiveis para retorno.",
    supportedOutputs: ["1080x1920", "MP4", "Stories"],
    useCases: ["Stories de vendas", "Bastidores", "Anuncios rapidos"],
    retentionPrompt:
      "Seu historico mostra quais Stories geraram mais retorno para repetir o formato.",
    audience: "Quem precisa publicar rapido em rotinas comerciais e de relacionamento.",
    promise: "Ferramenta simples, muito pratica e facil de usar em celular ou desktop.",
    platforms: ["Stories", "Instagram", "WhatsApp"]
  },
  {
    slug: "video-para-whatsapp",
    title: "Video para WhatsApp",
    kicker: "Compartilhamento leve",
    category: "Formatos sociais",
    attentionLabel: "Dor pratica",
    shortDescription: "Otimize tamanho e compatibilidade para envio rapido.",
    longDescription:
      "Compacte, converta e reduza friccao no compartilhamento via WhatsApp com foco em carregamento leve, envio rapido e menos falha de reproducao.",
    seoTitle: "Preparar video para WhatsApp",
    seoDescription:
      "Deixe o video leve para WhatsApp com compressao pratica, formatos compativeis e presets para repeticao.",
    supportedOutputs: ["MP4", "Compactado", "WhatsApp-safe"],
    useCases: ["Atendimento", "Comercial", "Suporte"],
    retentionPrompt:
      "Crie um preset de envio leve e reaplique sempre que precisar.",
    audience: "Equipes comerciais, suporte, creators e infoprodutores.",
    promise: "Volume de uso alto e retorno recorrente pela praticidade.",
    platforms: ["WhatsApp", "Status"]
  },
  {
    slug: "mov-para-mp4",
    title: "MOV para MP4",
    kicker: "Conversao direta",
    category: "Audio e formatos",
    attentionLabel: "SEO classico",
    shortDescription: "Troque MOV por MP4 para maior compatibilidade.",
    longDescription:
      "Perfeito para arquivos gravados em iPhone que precisam rodar melhor em plataformas, anuncios, landing pages e dashboards internos.",
    seoTitle: "Converter MOV para MP4 online",
    seoDescription:
      "Converta MOV para MP4 com rapidez, aproveite o historico do SmartClip e use presets prontos para redes.",
    supportedOutputs: ["MP4", "H.264", "AAC"],
    useCases: ["iPhone para web", "Compatibilidade", "Upload em campanhas"],
    retentionPrompt:
      "Reaplique a conversao MOV para MP4 com um clique no dashboard.",
    audience: "Quem grava no iPhone e publica na web o tempo todo.",
    promise: "Boa rota de aquisição para topo e meio de funil.",
    platforms: ["iPhone", "Web", "Ads"]
  },
  {
    slug: "mp4-para-mp3",
    title: "MP4 para MP3",
    kicker: "Audio reutilizavel",
    category: "Audio e formatos",
    attentionLabel: "Sempre util",
    shortDescription: "Extraia MP3 a partir do seu MP4 sem fluxo complicado.",
    longDescription:
      "Transforme videos em audio para distribuicao, resumo, transcricao e reaproveitamento de conteudo em outras plataformas com um fluxo direto.",
    seoTitle: "Converter MP4 para MP3 online",
    seoDescription:
      "Transforme MP4 em MP3 rapidamente e combine com legendas, clipes ou historico de exportacao para repetir rotinas.",
    supportedOutputs: ["MP3", "AAC", "WAV"],
    useCases: ["Podcast", "Transcricao", "Conteudo derivado"],
    retentionPrompt:
      "Mantenha o preset MP4 para MP3 salvo e acelere a rotina dos proximos arquivos.",
    audience: "Usuarios que querem reaproveitar um mesmo arquivo em varios formatos.",
    promise: "Atrai busca ampla e cria oportunidade de cross-sell para outras ferramentas.",
    platforms: ["Podcast", "Audio", "Transcricao"]
  }
];

export const toolCategories = [
  "Clipes virais",
  "Formatos sociais",
  "Edicao essencial",
  "Audio e formatos"
];

export function getToolBySlug(slug: string) {
  return toolDefinitions.find((tool) => tool.slug === slug);
}

export function getFeaturedTools() {
  return toolDefinitions.filter((tool) => tool.featured);
}

export function getToolsByCategory() {
  return toolCategories.map((category) => ({
    category,
    tools: toolDefinitions.filter((tool) => tool.category === category)
  })).filter((group) => group.tools.length > 0);
}

export function getRelatedTools(currentSlug: ToolSlug) {
  const currentTool = getToolBySlug(currentSlug);

  return toolDefinitions
    .filter((tool) => tool.slug !== currentSlug)
    .sort((left, right) => {
      const leftScore = Number(left.category === currentTool?.category) + Number(left.featured);
      const rightScore =
        Number(right.category === currentTool?.category) + Number(right.featured);

      return rightScore - leftScore;
    })
    .slice(0, 3);
}
