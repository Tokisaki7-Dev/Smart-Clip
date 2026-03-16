import type { ToolDefinition, ToolSlug } from "@/types";

export const toolDefinitions: ToolDefinition[] = [
  {
    slug: "video-para-clipe-com-legenda-automatica",
    title: "Transformar video em clipe com legenda automatica",
    kicker: "Produto estrela",
    category: "Clipes virais",
    attentionLabel: "1080p com legenda",
    shortDescription:
      "Transforme qualquer video em um clipe curto 1080p com legenda automatica, framing vertical e saida pronta para TikTok, Shorts, Reels e Stories.",
    longDescription:
      "Essa e a rota mais forte do SmartClip para quem quer publicar rapido com cara de conteudo pronto. O fluxo encurta o video, converte para vertical, tenta gerar legenda automatica no proprio navegador e exporta em 1080p para redes sociais com menos trabalho manual.",
    seoTitle: "Transformar video em clipe com legenda automatica em 1080p",
    seoDescription:
      "Transforme videos em clipes prontos com legenda automatica, formato 1080x1920 e exportacao em 1080p para TikTok, Shorts, Reels, Stories e redes sociais.",
    supportedOutputs: [
      "1080x1920",
      "Legenda automatica",
      "TikTok-safe",
      "Reels-safe"
    ],
    useCases: [
      "Cortes com legenda para podcast",
      "Conteudo social para vendas",
      "Clipes prontos para discovery",
      "Repurpose de video longo"
    ],
    retentionPrompt:
      "Salve esse preset com legenda e repita a mesma estrutura sempre que quiser publicar um novo corte 1080p.",
    audience:
      "Criadores, social media, infoprodutores, times de marketing e qualquer pessoa que precise postar mais sem editar legenda na mao.",
    promise:
      "Entrega o tipo de resultado que chama clique e aumenta valor percebido logo no primeiro uso.",
    platforms: ["TikTok", "Shorts", "Reels", "Stories"],
    featured: true
  },
  {
    slug: "gerar-varios-clipes-automaticos",
    title: "Gerar varios clipes automaticos do mesmo video",
    kicker: "Automacao inteligente",
    category: "Automacao premium",
    attentionLabel: "Ate 3 clipes",
    shortDescription:
      "Suba um video longo e gere ate 3 clipes curtos com selecao automatica de trechos para redes sociais.",
    longDescription:
      "Essa ferramenta foi desenhada para quem quer transformar um video longo em varios clipes prontos sem escolher cada trecho na mao. O fluxo organiza janelas melhores com heuristicas de fala e entrega varias saidas curtas para testar em TikTok, Shorts, Reels e Stories.",
    seoTitle: "Gerar varios clipes automaticos online do mesmo video",
    seoDescription:
      "Transforme um video longo em varios clipes curtos automaticamente com cortes mais promissores e formatos prontos para redes sociais.",
    supportedOutputs: ["3 clipes", "1080x1920", "Reels-safe", "Shorts-safe"],
    useCases: [
      "Podcast em varios cortes",
      "Aula longa em clips curtos",
      "Lives em varios formatos",
      "Teste rapido de ganchos"
    ],
    retentionPrompt:
      "Quando um video rende varios clipes bons, o retorno ao produto fica muito mais natural nas proximas gravacoes.",
    audience:
      "Criadores, podcasters e times que querem volume de conteudo sem lapidar trecho por trecho na mao.",
    promise:
      "Aumenta muito o valor percebido porque um unico upload pode virar varios criativos publicaveis.",
    platforms: ["TikTok", "Shorts", "Reels", "Stories"],
    featured: true
  },
  {
    slug: "podcast-para-clipes",
    title: "Transformar podcast em clipes curtos",
    kicker: "Repurpose pesado",
    category: "Automacao premium",
    attentionLabel: "Podcast para social",
    shortDescription:
      "Pegue um episodio, corte trechos mais fortes, verticalize e gere clips curtos com cara de podcast social.",
    longDescription:
      "Perfeito para quem grava podcast ou entrevista e quer republicar em volume. O fluxo ajuda a validar um corte rapido e gerar varias saidas curtas para discovery, com framing vertical e audio mais forte.",
    seoTitle: "Transformar podcast em clipes curtos para redes sociais",
    seoDescription:
      "Transforme podcast em clipes curtos para TikTok, Shorts, Reels e Stories com formatos verticais e fluxo inteligente.",
    supportedOutputs: ["Podcast 30s", "Podcast 45s", "Podcast 59s", "1080x1920"],
    useCases: [
      "Podcast de negocio",
      "Entrevista em cortes",
      "Mesa redonda em clips",
      "Conteudo educativo"
    ],
    retentionPrompt:
      "Esse e o tipo de ferramenta que vira rotina quando o podcast entra em calendario fixo.",
    audience:
      "Podcasters, educadores, marcas e equipes que gravam conversas longas e precisam de distribuicao social.",
    promise:
      "Transforma um ativo longo em varias pecas curtas de descoberta com muito menos retrabalho.",
    platforms: ["TikTok", "Shorts", "Reels", "YouTube"],
    featured: true
  },
  {
    slug: "video-para-anuncio-curto",
    title: "Transformar video em anuncio curto",
    kicker: "Criativo rapido",
    category: "Clipes virais",
    attentionLabel: "Ads e UGC",
    shortDescription:
      "Corte, compacte e deixe o video mais curto para criativos de anuncio, UGC e teste de gancho.",
    longDescription:
      "Essa rota foi pensada para marketing de resposta direta, ecommerce e testes de criativo. O fluxo reduz a duracao, melhora o ritmo, gera formato social e ajuda a colocar no ar uma versao muito mais utilizavel para campanhas curtas.",
    seoTitle: "Transformar video em anuncio curto para redes sociais",
    seoDescription:
      "Crie anuncios curtos para TikTok, Reels e Shorts com duracao menor, ritmo mais direto e saida pronta para campanhas.",
    supportedOutputs: ["Anuncio 15s", "Anuncio 20s", "Anuncio 30s", "1080x1920"],
    useCases: [
      "Teste de UGC",
      "Criativo de ecommerce",
      "Anuncio para Reels",
      "Variacao curta de venda"
    ],
    retentionPrompt:
      "Salve um preset de criativo e reduza muito o tempo para testar novas variacoes.",
    audience:
      "Gestores de trafego, social media, afiliados e marcas que precisam de criativo curto com rapidez.",
    promise:
      "Aproxima muito o produto de quem quer usar agora e voltar varias vezes por semana.",
    platforms: ["TikTok", "Reels", "Shorts", "Ads"],
    featured: true
  },
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
    slug: "gerar-ganchos-de-video",
    title: "Gerar ganchos de video para testar abertura",
    kicker: "Teste de hooks",
    category: "Automacao premium",
    attentionLabel: "4 ganchos por upload",
    shortDescription:
      "Transforme um video em varias aberturas curtas para testar qual hook chama mais clique, retencao e resposta.",
    longDescription:
      "Essa ferramenta foi feita para creators, social media e marketers que pensam em volume e teste. Ela recorta o mesmo material em varios ganchos curtos, deixa o formato mais pronto para discovery e reduz muito o tempo entre gravar algo e validar varias aberturas no TikTok, Shorts, Reels ou em anuncios.",
    seoTitle: "Gerar ganchos de video online para TikTok, Reels e Shorts",
    seoDescription:
      "Gere varios ganchos curtos do mesmo video para testar abertura, retencao e descoberta em TikTok, Shorts, Reels e anuncios.",
    supportedOutputs: ["4 hooks", "1080x1920", "TikTok-safe", "Reels-safe"],
    useCases: [
      "Teste de criativo",
      "Variações de hook",
      "Campanhas de descoberta",
      "Conteudo organico em lote"
    ],
    retentionPrompt:
      "Guarde a abertura que mais performa e volte ao SmartClip para rodar novas variacoes do mesmo formato.",
    audience:
      "Gestores de trafego, UGC creators, social media e qualquer time que testa varios criativos por semana.",
    promise:
      "Uma das rotas mais fortes para aumentar frequencia de uso porque cada video vira varias chances de acertar.",
    platforms: ["TikTok", "Reels", "Shorts", "Ads"],
    featured: true
  },
  {
    slug: "aula-para-clipes",
    title: "Transformar aula em clipes curtos",
    kicker: "Educacional",
    category: "Automacao premium",
    attentionLabel: "Aula para discovery",
    shortDescription:
      "Pegue uma aula longa, workshop ou live e gere clipes curtos com mais valor para redes sociais.",
    longDescription:
      "Criadores de conteudo educacional e infoprodutores costumam ter material longo e valioso, mas dificil de reaproveitar rapido. Essa ferramenta transforma aula em clipes curtos com framing vertical e ritmo melhor para descoberta, sem obrigar o usuario a editar cada trecho na mao.",
    seoTitle: "Transformar aula em clipes curtos para redes sociais",
    seoDescription:
      "Converta aulas, workshops e lives em clipes curtos para TikTok, Shorts, Reels e Stories com formato vertical pronto.",
    supportedOutputs: ["3 clipes", "Aula 30s", "Aula 45s", "Aula 60s"],
    useCases: [
      "Cortes de aula",
      "Trechos de workshop",
      "Lives educativas",
      "Repurpose de curso"
    ],
    retentionPrompt:
      "Quando o conteudo educativo entra em rotina, essa ferramenta vira parte natural do calendario de publicacao.",
    audience:
      "Educadores, infoprodutores, criadores e marcas que precisam distribuir conhecimento em formatos curtos.",
    promise:
      "Converte um ativo longo em varios cortes de valor, o que aumenta o retorno e reduz a friccao para continuar usando o produto.",
    platforms: ["Shorts", "Reels", "TikTok", "YouTube"],
    featured: true
  },
  {
    slug: "depoimento-para-anuncio",
    title: "Transformar depoimento em anuncio curto",
    kicker: "Prova social",
    category: "Clipes virais",
    attentionLabel: "Venda e UGC",
    shortDescription:
      "Converta depoimentos e reviews em criativos curtos de venda prontos para social e anuncios.",
    longDescription:
      "Depoimentos bons normalmente ficam longos demais para performar bem sem edicao. Essa ferramenta encurta o material, melhora o ritmo, adapta o formato para telas verticais e deixa a prova social mais pronta para usar em campanhas, landing pages e discovery.",
    seoTitle: "Transformar depoimento em anuncio curto online",
    seoDescription:
      "Crie anuncios curtos com depoimentos, reviews e prova social para Reels, TikTok, Shorts e criativos pagos.",
    supportedOutputs: ["15s", "20s", "30s", "1080x1920"],
    useCases: [
      "Depoimento de cliente",
      "Review de produto",
      "UGC de prova social",
      "Criativo para venda"
    ],
    retentionPrompt:
      "Salve seus depoimentos melhores e repita o mesmo estilo de criativo sempre que chegar uma nova prova social.",
    audience:
      "Ecommerce, infoprodutores, afiliados, gestores de trafego e times comerciais que dependem de prova social.",
    promise:
      "Ferramenta com apelo muito comercial e facil de vender porque resolve um formato que impacta diretamente o lucro.",
    platforms: ["Reels", "TikTok", "Ads", "Shorts"],
    featured: true
  },
  {
    slug: "video-para-status-de-whatsapp",
    title: "Video para Status do WhatsApp",
    kicker: "Uso de massa",
    category: "Formatos sociais",
    attentionLabel: "Leve e rapido",
    shortDescription:
      "Transforme qualquer video em um arquivo mais curto e leve para publicar no Status do WhatsApp.",
    longDescription:
      "Status do WhatsApp continua sendo uma rota enorme de distribuicao para vendas, atendimento e relacionamento. Essa pagina foi criada para atrair busca ampla e resolver rapido a dor de deixar um video curto, leve e com formato melhor para celular.",
    seoTitle: "Transformar video para Status do WhatsApp",
    seoDescription:
      "Prepare videos para Status do WhatsApp com duracao curta, arquivo leve e exportacao pronta para celular.",
    supportedOutputs: ["Status 15s", "Status 30s", "Status leve", "MP4"],
    useCases: [
      "Status de vendas",
      "Atendimento",
      "Divulgacao local",
      "Relacionamento com clientes"
    ],
    retentionPrompt:
      "Se voce usa WhatsApp para vender ou responder clientes, essa vira uma das ferramentas mais recorrentes do seu fluxo.",
    audience:
      "Negocios locais, consultores, equipes comerciais, suporte e qualquer usuario que distribui video por WhatsApp.",
    promise:
      "Atrai um publico enorme por praticidade e ainda abre caminho para cross-sell com Reels, TikTok e clipes curtos.",
    platforms: ["WhatsApp", "Status", "Mobile"],
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
  "Automacao premium",
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
