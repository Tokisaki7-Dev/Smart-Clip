import type { ToolDefinition, ToolSlug } from "@/types";

export const toolDefinitions: ToolDefinition[] = [
  {
    slug: "cortar-video",
    title: "Cortar video online",
    kicker: "Edicao rapida",
    shortDescription: "Recorte trechos, limpe sobras e publique mais rapido.",
    longDescription:
      "Ideal para remover introducoes longas, ajustar takes e reaproveitar conteudo bruto em formato mais enxuto para redes sociais.",
    seoTitle: "Cortar video online com presets para redes sociais",
    seoDescription:
      "Corte videos no navegador, repita a ultima exportacao e use formatos prontos para Reels, Shorts, TikTok, Stories e WhatsApp.",
    supportedOutputs: ["MP4", "MOV", "1080p", "720p"],
    useCases: ["Remover silencios", "Recortar introducoes", "Gerar trechos rapidos"],
    retentionPrompt: "Salve o recorte como projeto e reaplique depois em poucos cliques."
  },
  {
    slug: "extrair-audio",
    title: "Extrair audio de video",
    kicker: "Audio limpo",
    shortDescription: "Converta seu video em audio para podcast, transcricao ou distribuicao.",
    longDescription:
      "Extraia trilhas em MP3 com um fluxo simples para reaproveitar entrevistas, aulas, podcasts e chamadas de vendas.",
    seoTitle: "Extrair audio de MP4 ou MOV para MP3",
    seoDescription:
      "Extraia audio com rapidez, preserve o arquivo original e reutilize o resultado em outros fluxos do SmartClip.",
    supportedOutputs: ["MP3", "WAV", "AAC"],
    useCases: ["Podcast", "Transcricao", "Reaproveitamento de conteudo"],
    retentionPrompt: "Seu ultimo preset fica salvo para repetir a extracao em novos uploads."
  },
  {
    slug: "comprimir-video",
    title: "Comprimir video sem perder usabilidade",
    kicker: "Upload mais leve",
    shortDescription: "Reduza tamanho, mantenha clareza e envie mais rapido.",
    longDescription:
      "Bom para reduzir gargalos de upload, acelerar compartilhamento no WhatsApp e publicar sem comprometer a experiencia final.",
    seoTitle: "Comprimir video online para compartilhar mais rapido",
    seoDescription:
      "Reduza peso de video, otimize taxa de bits e exporte com presets sociais prontos para envio rapido.",
    supportedOutputs: ["MP4", "H.264", "720p", "1080p"],
    useCases: ["WhatsApp", "Email", "Upload rapido"],
    retentionPrompt: "Guarde um preset de compressao para repetir em series inteiras."
  },
  {
    slug: "converter-video",
    title: "Converter formato de video",
    kicker: "Compatibilidade",
    shortDescription: "Troque container e codec para o formato certo do seu canal.",
    longDescription:
      "Converta arquivos em poucos cliques para distribuir melhor em redes, ferramentas internas e dispositivos diferentes.",
    seoTitle: "Converter video online para formatos principais",
    seoDescription:
      "Converta arquivos entre formatos populares, reaplique a configuracao e exporte com fila orientada ao seu plano.",
    supportedOutputs: ["MP4", "MOV", "WEBM", "MP3"],
    useCases: ["Compatibilidade", "Entrega para cliente", "Upload em plataformas"],
    retentionPrompt: "Reaplique a ultima conversao com um clique no dashboard."
  },
  {
    slug: "video-para-reels",
    title: "Video para Reels",
    kicker: "Preset vertical",
    shortDescription: "Ajuste video para 1080x1920 com rapidez.",
    longDescription:
      "Transforme material horizontal em um formato pronto para Instagram Reels com corte, reposicionamento e exportacao simples.",
    seoTitle: "Converter video para Reels com preset 1080x1920",
    seoDescription:
      "Gere videos prontos para Reels com crop, compressao, legenda automatica e CTA para upgrade em 1080p.",
    supportedOutputs: ["1080x1920", "MP4", "Stories-safe"],
    useCases: ["Instagram Reels", "Performance organica", "Criativos pagos"],
    retentionPrompt: "Seu ultimo preset Reels fica salvo para o proximo lote."
  },
  {
    slug: "video-para-shorts",
    title: "Video para Shorts",
    kicker: "Preset YouTube",
    shortDescription: "Prepare videos verticais para Shorts sem perder ritmo.",
    longDescription:
      "Recorte, compacte e gere saidas ideais para manter consistencia no YouTube Shorts com exportacao rapida.",
    seoTitle: "Video para Shorts com exportacao pronta",
    seoDescription:
      "Otimize videos para Shorts, repita configuracoes e escale cortes com automacao premium quando precisar.",
    supportedOutputs: ["1080x1920", "MP4", "Shorts"],
    useCases: ["YouTube Shorts", "Clipes de podcast", "Recortes de lives"],
    retentionPrompt: "Reaplique a configuracao Shorts e reduza o tempo do proximo lote."
  },
  {
    slug: "video-para-tiktok",
    title: "Video para TikTok",
    kicker: "Ritmo e formato",
    shortDescription: "Transforme uploads em versoes prontas para TikTok.",
    longDescription:
      "Ajuste proporcao, mantenha a area segura e exporte em um fluxo orientado a volume e rapidez.",
    seoTitle: "Converter video para TikTok online",
    seoDescription:
      "Use preset pronto para TikTok, legenda automatica e historico de arquivos para repetir a rotina com menos atrito.",
    supportedOutputs: ["1080x1920", "MP4", "TikTok-safe"],
    useCases: ["TikTok organico", "UGC", "Teste de criativo"],
    retentionPrompt: "Salve esse preset para repetir a configuracao em novos criativos."
  },
  {
    slug: "video-para-stories",
    title: "Video para Stories",
    kicker: "Publicacao instantanea",
    shortDescription: "Ajuste resolucao e duracao para Stories mais rapidos.",
    longDescription:
      "Converta clips para o formato vertical ideal de Stories e reaproveite materiais curtos sem re-editar tudo do zero.",
    seoTitle: "Video para Stories com preset rapido",
    seoDescription:
      "Gere saidas para Stories, controle tamanho final do arquivo e mantenha arquivos recentes visiveis para retorno.",
    supportedOutputs: ["1080x1920", "MP4", "Stories"],
    useCases: ["Stories de vendas", "Bastidores", "Anuncios rapidos"],
    retentionPrompt: "Seu historico mostra quais Stories geraram mais retorno para repetir o formato."
  },
  {
    slug: "video-para-whatsapp",
    title: "Video para WhatsApp",
    kicker: "Compartilhamento leve",
    shortDescription: "Otimize tamanho e compatibilidade para envio rapido.",
    longDescription:
      "Compacte, converta e reduza friccao no compartilhamento via WhatsApp com foco em carregamento leve.",
    seoTitle: "Preparar video para WhatsApp",
    seoDescription:
      "Deixe o video leve para WhatsApp com compressao pratica, formatos compativeis e presets para repeticao.",
    supportedOutputs: ["MP4", "Compactado", "WhatsApp-safe"],
    useCases: ["Atendimento", "Comercial", "Suporte"],
    retentionPrompt: "Crie um preset de envio leve e reaplique sempre que precisar."
  },
  {
    slug: "mov-para-mp4",
    title: "MOV para MP4",
    kicker: "Conversao direta",
    shortDescription: "Troque MOV por MP4 para maior compatibilidade.",
    longDescription:
      "Perfeito para arquivos gravados em iPhone que precisam rodar melhor em plataformas, anuncios e dashboards.",
    seoTitle: "Converter MOV para MP4 online",
    seoDescription:
      "Converta MOV para MP4 com rapidez, aproveite o historico do SmartClip e use presets prontos para redes.",
    supportedOutputs: ["MP4", "H.264", "AAC"],
    useCases: ["iPhone para web", "Compatibilidade", "Upload em campanhas"],
    retentionPrompt: "Reaplique a conversao MOV para MP4 com um clique no dashboard."
  },
  {
    slug: "mp4-para-mp3",
    title: "MP4 para MP3",
    kicker: "Audio reutilizavel",
    shortDescription: "Extraia MP3 a partir do seu MP4 sem fluxo complicado.",
    longDescription:
      "Transforme videos em audio para distribuicao, resumo, transcricao e reaproveitamento de conteudo em outras plataformas.",
    seoTitle: "Converter MP4 para MP3 online",
    seoDescription:
      "Transforme MP4 em MP3 rapidamente e combine com legendas, clipes ou historico de exportacao para repetir rotinas.",
    supportedOutputs: ["MP3", "AAC", "WAV"],
    useCases: ["Podcast", "Transcricao", "Conteudo derivado"],
    retentionPrompt: "Mantenha o preset MP4 para MP3 salvo e acelere a rotina dos proximos arquivos."
  }
];

export function getToolBySlug(slug: string) {
  return toolDefinitions.find((tool) => tool.slug === slug);
}

export function getRelatedTools(currentSlug: ToolSlug) {
  return toolDefinitions.filter((tool) => tool.slug !== currentSlug).slice(0, 3);
}
