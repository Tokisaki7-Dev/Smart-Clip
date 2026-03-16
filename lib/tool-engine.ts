import type { ToolSlug } from "@/types";

export type ToolCapability =
  | "autoTrim"
  | "multiClip"
  | "autoCaption"
  | "premiumWorker"
  | "verticalize"
  | "audioNormalize"
  | "highCompression"
  | "formatConvert"
  | "viralPacing";

export interface ToolPresetBlueprint {
  label: string;
  durationSeconds: number | null;
  multiClipCount: number;
  targetAspect: "9:16" | "16:9" | "audio";
  strategy: string;
  headline: string;
}

export interface ToolEngineProfile {
  capabilities: ToolCapability[];
  workerEnabled: boolean;
  autoCaption: boolean;
  primaryGoal: string;
  highlights: string[];
  steps: string[];
  premiumStory: string;
  presetBlueprints: ToolPresetBlueprint[];
}

export interface SmartClipWindow {
  label: string;
  trimStart: number;
  trimEnd: number;
  headline: string;
}

export interface MediaAnalysis {
  orientation: "vertical" | "horizontal" | "square" | "audio";
  durationLabel: string;
  score: number;
  scoreLabel: string;
  strategy: string;
  summary: string;
  recommendations: string[];
  windows: SmartClipWindow[];
}

const defaultVideoPresets: ToolPresetBlueprint[] = [
  {
    label: "Original",
    durationSeconds: null,
    multiClipCount: 1,
    targetAspect: "16:9",
    strategy: "Mantem o enquadramento original com ajuste minimo.",
    headline: "Exportacao direta"
  },
  {
    label: "Reels 1080x1920",
    durationSeconds: 45,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Verticaliza e deixa mais pronto para discovery.",
    headline: "Preset social vertical"
  },
  {
    label: "Shorts 1080x1920",
    durationSeconds: 45,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Recorta para Shorts com area segura e ritmo melhor.",
    headline: "Preset Shorts"
  },
  {
    label: "TikTok 1080x1920",
    durationSeconds: 30,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Mantem o clip curto e pronto para TikTok.",
    headline: "Preset TikTok"
  },
  {
    label: "Stories 1080x1920",
    durationSeconds: 20,
    multiClipCount: 1,
    targetAspect: "9:16",
    strategy: "Encurta e prepara para stories e anuncios curtos.",
    headline: "Preset Stories"
  },
  {
    label: "WhatsApp leve",
    durationSeconds: 20,
    multiClipCount: 1,
    targetAspect: "16:9",
    strategy: "Prioriza leveza e envio rapido.",
    headline: "Preset leve"
  }
];

const toolEngineProfiles: Record<ToolSlug, ToolEngineProfile> = {
  "video-para-clipe-com-legenda-automatica": {
    capabilities: ["autoTrim", "autoCaption", "premiumWorker", "verticalize", "viralPacing"],
    workerEnabled: true,
    autoCaption: true,
    primaryGoal: "Transformar um video bruto em um clipe 1080p com legenda e ritmo de publicacao.",
    highlights: [
      "Legenda automatica com fallback em SRT e VTT",
      "Saida vertical pronta para TikTok, Reels e Shorts",
      "Sincroniza o original e a exportacao no dashboard",
      "Pode gerar um clip pronto sem sair da pagina"
    ],
    steps: ["Selecionar", "Analisar", "Gerar clipe 1080p"],
    premiumStory:
      "Quando voce quer mais consistencia, o SmartClip organiza o processo na propria ferramenta e deixa o resultado mais pronto para publicar.",
    presetBlueprints: [
      {
        label: "Clip com legenda 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Favorito para gancho curto e CTA direto.",
        headline: "30 segundos com legenda"
      },
      {
        label: "Clip com legenda 45s",
        durationSeconds: 45,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Equilibra contexto e retencao.",
        headline: "45 segundos com legenda"
      },
      {
        label: "Clip com legenda podcast 59s",
        durationSeconds: 59,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Usa mais contexto para entrevistas e podcast.",
        headline: "59 segundos para podcast social"
      }
    ]
  },
  "gerar-varios-clipes-automaticos": {
    capabilities: ["autoTrim", "multiClip", "premiumWorker", "verticalize", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Extrair varios cortes publicaveis de um unico upload.",
    highlights: [
      "Ate tres janelas inteligentes do mesmo video",
      "Ritmo pensado para discovery em lote",
      "Resultados separados para testar ganchos diferentes",
      "Varias saidas em um unico processo"
    ],
    steps: ["Subir video", "Escolher preset multiplo", "Baixar varios clipes"],
    premiumStory:
      "Essa e a ferramenta que mais empurra retorno ao site, porque um unico video pode render diversos posts.",
    presetBlueprints: [
      {
        label: "3 clipes 20s",
        durationSeconds: 20,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Versao agressiva para testar varios ganchos curtos.",
        headline: "Tres cortes de 20 segundos"
      },
      {
        label: "3 clipes 30s",
        durationSeconds: 30,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Bom equilibrio entre contexto e retencao.",
        headline: "Tres cortes de 30 segundos"
      },
      {
        label: "3 clipes 45s",
        durationSeconds: 45,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Melhor para videos com mais explicacao.",
        headline: "Tres cortes de 45 segundos"
      }
    ]
  },
  "podcast-para-clipes": {
    capabilities: ["autoTrim", "multiClip", "premiumWorker", "verticalize", "audioNormalize"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Transformar episodios longos em varios cortes de conversa com presenca melhor.",
    highlights: [
      "Janelas separadas para podcast e entrevista",
      "Audio com tratamento mais consistente",
      "Verticalizacao focada em social",
      "Pode gerar mais de um corte do mesmo episodio"
    ],
    steps: ["Selecionar episodio", "Definir duracao", "Receber multiplos cortes"],
    premiumStory:
      "Podcast e um dos fluxos com maior chance de recorrencia porque cada episodio vira varias pecas.",
    presetBlueprints: [
      {
        label: "Podcast 30s",
        durationSeconds: 30,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Mais rapido para discovery.",
        headline: "Podcast curto de 30 segundos"
      },
      {
        label: "Podcast 45s",
        durationSeconds: 45,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Equilibrio entre contexto e ritmo.",
        headline: "Podcast de 45 segundos"
      },
      {
        label: "Podcast 59s",
        durationSeconds: 59,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Mais contexto sem passar de um minuto.",
        headline: "Podcast de 59 segundos"
      }
    ]
  },
  "video-para-anuncio-curto": {
    capabilities: ["autoTrim", "premiumWorker", "verticalize", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Gerar criativos curtos para oferta, UGC e testes de anuncio.",
    highlights: [
      "Ritmo mais direto",
      "Visual mais contrastado",
      "Foco em hook curto e CTA",
      "Pronto para testes de criativo"
    ],
    steps: ["Escolher duracao", "Ajustar qualidade", "Exportar anuncio curto"],
    premiumStory:
      "Essa rota puxa uso recorrente de times que precisam subir novas variacoes quase todos os dias.",
    presetBlueprints: [
      {
        label: "Anuncio 15s",
        durationSeconds: 15,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais agressivo e melhor para teste de hook.",
        headline: "Criativo de 15 segundos"
      },
      {
        label: "Anuncio 20s",
        durationSeconds: 20,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Equilibrio para UGC e prova social.",
        headline: "Criativo de 20 segundos"
      },
      {
        label: "Anuncio 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais contexto para venda e demonstracao.",
        headline: "Criativo de 30 segundos"
      }
    ]
  },
  "video-para-clipe-viral": {
    capabilities: ["autoTrim", "premiumWorker", "verticalize", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Criar um corte com cara de discovery rapido para as redes mais competitivas.",
    highlights: [
      "Clip curto com framing vertical",
      "Heuristicas de ritmo mais fortes",
      "Saida pronta para social",
      "Bom para topo de funil"
    ],
    steps: ["Subir video", "Escolher modo viral", "Exportar clipe"],
    premiumStory:
      "E a ferramenta mais facil de entender e uma das melhores para atrair trafego amplo.",
    presetBlueprints: [
      {
        label: "Clip viral 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Gancho forte e pouca gordura.",
        headline: "Clip viral de 30 segundos"
      },
      {
        label: "Clip viral 45s",
        durationSeconds: 45,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais contexto sem perder ritmo.",
        headline: "Clip viral de 45 segundos"
      },
      {
        label: "UGC 20s",
        durationSeconds: 20,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Bom para prova social e anuncios curtos.",
        headline: "UGC de 20 segundos"
      },
      {
        label: "Podcast 59s",
        durationSeconds: 59,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais contexto para cortes de conversa.",
        headline: "Podcast social de 59 segundos"
      }
    ]
  },
  "cortar-video-automaticamente": {
    capabilities: ["autoTrim", "premiumWorker"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Reduzir trechos fracos e gerar uma primeira versao mais enxuta.",
    highlights: [
      "Trim mais rapido",
      "Bom para limpar introducoes longas",
      "Fluxo simples e util",
      "Escala bem para usuarios recorrentes"
    ],
    steps: ["Subir video", "Escolher duracao", "Cortar automaticamente"],
    premiumStory:
      "Ajuda o usuario a resolver uma dor simples rapido e cria chance de volta para lapidar o resultado.",
    presetBlueprints: [
      {
        label: "Auto corte 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Primeiro resumo rapido.",
        headline: "Corte automatico de 30 segundos"
      },
      {
        label: "Auto corte 45s",
        durationSeconds: 45,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Equilibrio entre contexto e velocidade.",
        headline: "Corte automatico de 45 segundos"
      },
      {
        label: "Auto corte 60s",
        durationSeconds: 60,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Mais contexto para videos com explicacao.",
        headline: "Corte automatico de 60 segundos"
      }
    ]
  },
  "video-horizontal-para-vertical": {
    capabilities: ["verticalize", "premiumWorker", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Reaproveitar videos horizontais no formato 9:16 sem precisar regravar.",
    highlights: [
      "Blur de fundo ou crop central",
      "Saida 1080x1920",
      "Melhor para reutilizar acervo",
      "Pronto para Reels, Shorts e TikTok"
    ],
    steps: ["Subir video", "Escolher verticalizacao", "Exportar em 1080x1920"],
    premiumStory:
      "Essa rota converte acervo antigo em novas pecas, o que aumenta muito o valor percebido do produto.",
    presetBlueprints: [
      {
        label: "Vertical com blur",
        durationSeconds: 45,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mantem o quadro inteiro com blur no fundo.",
        headline: "Vertical com blur"
      },
      {
        label: "Vertical com crop central",
        durationSeconds: 45,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Corta o centro para dar mais presenca.",
        headline: "Vertical com crop central"
      },
      {
        label: "Stories 1080x1920",
        durationSeconds: 20,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Versao curta para stories.",
        headline: "Stories 1080x1920"
      }
    ]
  },
  "criar-trailer-curto": {
    capabilities: ["autoTrim", "premiumWorker", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Criar uma abertura curta com mais curiosidade e ritmo.",
    highlights: [
      "Visual mais forte",
      "Duracoes prontas para teaser",
      "Bom para lancamento e campanha",
      "Ajuda a chamar clique"
    ],
    steps: ["Subir video", "Escolher teaser", "Exportar trailer curto"],
    premiumStory:
      "Boa rota de alta intencao para creators, cursos e produtos que vivem de lancamento.",
    presetBlueprints: [
      {
        label: "Trailer 15s",
        durationSeconds: 15,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Mais rapido para anuncios e teasers de abertura.",
        headline: "Trailer de 15 segundos"
      },
      {
        label: "Trailer 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Contexto e curiosidade em equilibrio.",
        headline: "Trailer de 30 segundos"
      },
      {
        label: "Teaser 45s",
        durationSeconds: 45,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Mais espaco para narrativa e CTA.",
        headline: "Teaser de 45 segundos"
      }
    ]
  },
  "gerar-ganchos-de-video": {
    capabilities: ["autoTrim", "multiClip", "premiumWorker", "verticalize", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Extrair varias aberturas curtas para testar qual hook performa melhor.",
    highlights: [
      "Quatro ganchos curtos do mesmo video",
      "Ideal para teste de criativo e descoberta",
      "Enfatiza os primeiros segundos",
      "Bom para campanhas e organico"
    ],
    steps: ["Selecionar video", "Gerar hooks", "Comparar variacoes"],
    premiumStory:
      "Ferramenta excelente para atrair marketers e creators que pensam em teste e volume.",
    presetBlueprints: [
      {
        label: "4 ganchos 12s",
        durationSeconds: 12,
        multiClipCount: 4,
        targetAspect: "9:16",
        strategy: "Ideal para hook testing puro.",
        headline: "Quatro hooks de 12 segundos"
      },
      {
        label: "4 ganchos 15s",
        durationSeconds: 15,
        multiClipCount: 4,
        targetAspect: "9:16",
        strategy: "Dobra como anuncio curto ou organico.",
        headline: "Quatro hooks de 15 segundos"
      },
      {
        label: "4 ganchos 20s",
        durationSeconds: 20,
        multiClipCount: 4,
        targetAspect: "9:16",
        strategy: "Mais contexto para videos educacionais e oferta.",
        headline: "Quatro hooks de 20 segundos"
      }
    ]
  },
  "aula-para-clipes": {
    capabilities: ["autoTrim", "multiClip", "premiumWorker", "verticalize"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Pegar uma aula longa e gerar cortes que ainda ensinam algo em pouco tempo.",
    highlights: [
      "Recortes de valor para conteudo educativo",
      "Bom para aulas, workshops e lives",
      "Mais de um corte no mesmo fluxo",
      "Formato social em 1080x1920"
    ],
    steps: ["Subir aula", "Escolher tamanho", "Gerar clipes educativos"],
    premiumStory:
      "Aula longa gera muito reaproveitamento, o que aumenta o retorno ao site e a chance de upgrade.",
    presetBlueprints: [
      {
        label: "Aula 30s",
        durationSeconds: 30,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Cortes mais rapidos para discovery.",
        headline: "Tres clipes educativos de 30 segundos"
      },
      {
        label: "Aula 45s",
        durationSeconds: 45,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Melhor para explicacoes com mais contexto.",
        headline: "Tres clipes educativos de 45 segundos"
      },
      {
        label: "Aula 60s",
        durationSeconds: 60,
        multiClipCount: 3,
        targetAspect: "9:16",
        strategy: "Para quando a resposta precisa ser mais completa.",
        headline: "Tres clipes educativos de 60 segundos"
      }
    ]
  },
  "depoimento-para-anuncio": {
    capabilities: ["autoTrim", "premiumWorker", "verticalize", "viralPacing"],
    workerEnabled: true,
    autoCaption: false,
    primaryGoal: "Transformar prova social em criativo curto de venda.",
    highlights: [
      "Perfeito para depoimentos e reviews",
      "Ritmo melhor para performance",
      "Pode virar UGC rapido",
      "Saida pronta para anuncios"
    ],
    steps: ["Subir depoimento", "Escolher duracao", "Exportar criativo social"],
    premiumStory:
      "Depoimento convertido em anuncio curto e uma dor muito comercial e recorrente.",
    presetBlueprints: [
      {
        label: "Depoimento 15s",
        durationSeconds: 15,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Hook e prova social em poucos segundos.",
        headline: "Depoimento de 15 segundos"
      },
      {
        label: "Depoimento 20s",
        durationSeconds: 20,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Bom equilibrio para criativo de venda.",
        headline: "Depoimento de 20 segundos"
      },
      {
        label: "Depoimento 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais contexto sem ficar longo demais.",
        headline: "Depoimento de 30 segundos"
      }
    ]
  },
  "video-para-status-de-whatsapp": {
    capabilities: ["autoTrim", "verticalize", "highCompression"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Gerar uma versao curta e leve para Status do WhatsApp.",
    highlights: [
      "Leve para upload rapido",
      "Duracao curta para status",
      "Compatibilidade melhor com celular",
      "Bom para uso comercial"
    ],
    steps: ["Selecionar video", "Escolher preset curto", "Baixar versao leve"],
    premiumStory:
      "Essa e uma rota de utilidade massiva, boa para atrair busca ampla e uso recorrente.",
    presetBlueprints: [
      {
        label: "Status 15s",
        durationSeconds: 15,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais direto para status e atendimento.",
        headline: "Status de 15 segundos"
      },
      {
        label: "Status 30s",
        durationSeconds: 30,
        multiClipCount: 1,
        targetAspect: "9:16",
        strategy: "Mais contexto mantendo leveza.",
        headline: "Status de 30 segundos"
      },
      {
        label: "Status leve",
        durationSeconds: 20,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Compacta mais para envio rapido.",
        headline: "Status leve"
      }
    ]
  },
  "cortar-video": {
    capabilities: ["autoTrim"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Cortar um video rapidamente sem abrir um editor pesado.",
    highlights: [
      "Fluxo simples",
      "Bom para primeira resolucao de dor",
      "Funciona direto no navegador",
      "Serve como porta de entrada para outras tools"
    ],
    steps: ["Subir video", "Definir corte", "Baixar resultado"],
    premiumStory: "Mesmo nas rotas mais simples, o objetivo e mostrar valor rapido para puxar retorno.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "extrair-audio": {
    capabilities: ["audioNormalize"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Extrair o audio de um video para podcast, transcricao ou reaproveitamento.",
    highlights: ["MP3 ou WAV", "Rapido", "Muito util", "Forte em SEO"],
    steps: ["Subir video", "Escolher formato", "Baixar audio"],
    premiumStory: "A utilidade imediata ajuda o produto a ganhar share de busca e repeticao.",
    presetBlueprints: [
      {
        label: "Original",
        durationSeconds: null,
        multiClipCount: 1,
        targetAspect: "audio",
        strategy: "Extrai a trilha sem cortar.",
        headline: "Audio completo"
      }
    ]
  },
  "comprimir-video": {
    capabilities: ["highCompression"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Reduzir o tamanho do arquivo com usabilidade melhor para envio e upload.",
    highlights: ["Arquivo menor", "Mais rapido de compartilhar", "Muito recorrente", "Pratico"],
    steps: ["Subir video", "Escolher qualidade", "Baixar versao comprimida"],
    premiumStory: "Compressao resolve uma dor recorrente e puxa retorno semanal para muita gente.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "converter-video": {
    capabilities: ["formatConvert"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Trocar o formato do arquivo para rodar melhor onde voce precisa.",
    highlights: ["MP4 e MOV", "Compatibilidade melhor", "Fluxo simples", "Utilidade ampla"],
    steps: ["Subir video", "Escolher formato", "Converter"],
    premiumStory: "Conversao amplia a base de entrada do produto e abre porta para upgrade posterior.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "video-para-reels": {
    capabilities: ["verticalize", "viralPacing"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Preparar o video no formato certo do Instagram Reels.",
    highlights: ["1080x1920", "Ritmo social", "Pronto para discovery", "Muito buscado"],
    steps: ["Subir video", "Escolher preset Reels", "Baixar"],
    premiumStory: "Rotas por plataforma ajudam muito no SEO comercial.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "video-para-shorts": {
    capabilities: ["verticalize", "viralPacing"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Gerar um video pronto para YouTube Shorts.",
    highlights: ["Shorts-safe", "1080x1920", "Fluxo simples", "Alta intencao"],
    steps: ["Subir video", "Escolher preset Shorts", "Exportar"],
    premiumStory: "Shorts e uma das buscas mais comerciais do catalogo.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "video-para-tiktok": {
    capabilities: ["verticalize", "viralPacing"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Ajustar o upload para a dinamica do TikTok.",
    highlights: ["TikTok-safe", "Vertical", "Ritmo mais curto", "Bom para organico e ads"],
    steps: ["Subir video", "Escolher preset TikTok", "Baixar"],
    premiumStory: "TikTok e rota de alta procura e boa capacidade de conversao.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "video-para-stories": {
    capabilities: ["verticalize", "highCompression"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Gerar uma versao curta para Stories.",
    highlights: ["Vertical", "Curto", "Leve", "Bom para mobile"],
    steps: ["Subir video", "Escolher preset Stories", "Exportar"],
    premiumStory: "Stories aproxima o uso do produto das rotinas de venda e atendimento.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "video-para-whatsapp": {
    capabilities: ["highCompression"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Preparar um video que envie mais facil no WhatsApp.",
    highlights: ["Mais leve", "Compatibilidade melhor", "Boa rota recorrente", "Pratico"],
    steps: ["Subir video", "Compactar", "Baixar"],
    premiumStory: "Ferramentas de envio rapido costumam gerar muito retorno de usuarios pequenos e equipes comerciais.",
    presetBlueprints: [...defaultVideoPresets]
  },
  "mov-para-mp4": {
    capabilities: ["formatConvert"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Converter arquivos MOV em MP4 com mais compatibilidade.",
    highlights: ["Bom para iPhone", "Roda melhor na web", "Alta busca", "Fluxo simples"],
    steps: ["Subir MOV", "Converter para MP4", "Baixar"],
    premiumStory: "Um classico de SEO utilitario com potencial de entrada forte no funil.",
    presetBlueprints: [
      {
        label: "Original",
        durationSeconds: null,
        multiClipCount: 1,
        targetAspect: "16:9",
        strategy: "Conversao simples para MP4.",
        headline: "Conversao MOV para MP4"
      }
    ]
  },
  "mp4-para-mp3": {
    capabilities: ["formatConvert", "audioNormalize"],
    workerEnabled: false,
    autoCaption: false,
    primaryGoal: "Extrair um MP3 a partir de MP4 com o minimo de atrito.",
    highlights: ["MP3 pronto", "Bom para transcricao", "Fluxo simples", "Utilidade alta"],
    steps: ["Subir MP4", "Converter para MP3", "Baixar"],
    premiumStory: "Outro classico de SEO utilitario que atrai muita busca qualificada.",
    presetBlueprints: [
      {
        label: "Original",
        durationSeconds: null,
        multiClipCount: 1,
        targetAspect: "audio",
        strategy: "Extrai o audio inteiro em MP3.",
        headline: "Conversao MP4 para MP3"
      }
    ]
  }
};

export function getToolEngineProfile(slug: ToolSlug) {
  return toolEngineProfiles[slug];
}

export function getPresetBlueprints(slug: ToolSlug) {
  return getToolEngineProfile(slug).presetBlueprints;
}

export function supportsToolCapability(slug: ToolSlug, capability: ToolCapability) {
  return getToolEngineProfile(slug).capabilities.includes(capability);
}

export function getDefaultPresetLabel(slug: ToolSlug) {
  return getPresetBlueprints(slug)[0]?.label || "Original";
}

function getOrientation(width: number, height: number): MediaAnalysis["orientation"] {
  if (!width || !height) {
    return "audio";
  }

  if (width === height) {
    return "square";
  }

  if (height > width) {
    return "vertical";
  }

  return "horizontal";
}

function formatDurationLabel(duration: number) {
  if (!duration || duration <= 0) {
    return "Duracao ainda nao detectada";
  }

  if (duration < 60) {
    return `${Math.round(duration)} segundos`;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  return seconds > 0 ? `${minutes} min ${seconds}s` : `${minutes} min`;
}

function getBaseWindow(duration: number, trimStart: number, trimEnd: number) {
  if (duration <= 0) {
    return { start: 0, end: 0 };
  }

  const start = Math.max(0, trimStart);
  const end = trimEnd > start ? Math.min(duration, trimEnd) : duration;

  return { start, end };
}

function createSequencedWindows(params: {
  count: number;
  clipDuration: number;
  baseStart: number;
  baseEnd: number;
  labels: string[];
}) {
  const { count, clipDuration, baseStart, baseEnd, labels } = params;
  const safeCount = Math.max(1, count);
  const usableEnd = Math.max(baseStart + clipDuration, baseEnd);
  const spacing =
    safeCount === 1
      ? 0
      : Math.max(clipDuration * 0.65, (usableEnd - baseStart - clipDuration) / (safeCount - 1));

  return Array.from({ length: safeCount }, (_, index) => {
    const rawStart = baseStart + spacing * index;
    const start = Number(
      Math.max(baseStart, Math.min(rawStart, usableEnd - clipDuration)).toFixed(2)
    );
    const end = Number(Math.min(usableEnd, start + clipDuration).toFixed(2));

    return {
      label: labels[index] || `Clip ${index + 1}`,
      trimStart: start,
      trimEnd: Math.max(start + 4, end),
      headline: labels[index] || `Clip ${index + 1}`
    };
  });
}

export function buildSmartWindows(params: {
  toolSlug: ToolSlug;
  preset: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
}) {
  const { toolSlug, preset, duration, trimStart, trimEnd } = params;
  const blueprint =
    getPresetBlueprints(toolSlug).find((item) => item.label === preset) ||
    getPresetBlueprints(toolSlug)[0];
  const clipDuration = Math.max(8, blueprint?.durationSeconds || Math.min(45, duration || 45));
  const baseWindow = getBaseWindow(duration, trimStart, trimEnd);
  const baseStart = baseWindow.start;
  const baseEnd = baseWindow.end || Math.max(clipDuration, duration);

  if (toolSlug === "criar-trailer-curto") {
    return createSequencedWindows({
      count: 1,
      clipDuration,
      baseStart,
      baseEnd: Math.min(baseEnd, baseStart + clipDuration),
      labels: [blueprint?.headline || "Trailer curto"]
    });
  }

  if (toolSlug === "gerar-ganchos-de-video") {
    return createSequencedWindows({
      count: blueprint?.multiClipCount || 4,
      clipDuration,
      baseStart,
      baseEnd: Math.min(baseEnd, baseStart + clipDuration * 5),
      labels: ["Hook 1", "Hook 2", "Hook 3", "Hook 4"]
    });
  }

  if (
    toolSlug === "gerar-varios-clipes-automaticos" ||
    toolSlug === "podcast-para-clipes" ||
    toolSlug === "aula-para-clipes"
  ) {
    return createSequencedWindows({
      count: blueprint?.multiClipCount || 3,
      clipDuration,
      baseStart,
      baseEnd,
      labels:
        toolSlug === "podcast-para-clipes"
          ? ["Trecho forte", "Insight", "Fechamento"]
          : toolSlug === "aula-para-clipes"
            ? ["Conceito", "Exemplo", "Resumo"]
            : ["Clip 1", "Clip 2", "Clip 3"]
    });
  }

  return [
    {
      label: blueprint?.headline || "Resultado principal",
      trimStart: baseStart,
      trimEnd:
        clipDuration && baseEnd > baseStart
          ? Number(Math.min(baseEnd, baseStart + clipDuration).toFixed(2))
          : baseEnd,
      headline: blueprint?.strategy || "Resultado principal"
    }
  ];
}

export function analyzeMediaForTool(params: {
  toolSlug: ToolSlug;
  preset: string;
  duration: number;
  width: number;
  height: number;
  trimStart: number;
  trimEnd: number;
  fileSizeMb: number;
}) {
  const { toolSlug, preset, duration, width, height, trimStart, trimEnd, fileSizeMb } = params;
  const profile = getToolEngineProfile(toolSlug);
  const windows = buildSmartWindows({
    toolSlug,
    preset,
    duration,
    trimStart,
    trimEnd
  });
  const orientation = getOrientation(width, height);
  const targetIsVertical =
    getPresetBlueprints(toolSlug).find((item) => item.label === preset)?.targetAspect === "9:16";
  const durationScore =
    duration <= 0 ? 58 : duration >= 12 && duration <= 240 ? 92 : duration <= 600 ? 78 : 64;
  const orientationScore =
    orientation === "audio"
      ? 75
      : targetIsVertical && orientation === "vertical"
        ? 96
        : targetIsVertical
          ? 78
          : 88;
  const sizeScore = fileSizeMb <= 800 ? 92 : fileSizeMb <= 2500 ? 82 : 68;
  const score = Math.max(
    48,
    Math.min(99, Math.round(durationScore * 0.45 + orientationScore * 0.35 + sizeScore * 0.2))
  );
  const scoreLabel =
    score >= 90
      ? "Excelente para processar"
      : score >= 75
        ? "Bom encaixe"
        : "Vai funcionar melhor com ajuste";
  const recommendations: string[] = [];

  if (targetIsVertical && orientation === "horizontal") {
    recommendations.push(
      "O video e horizontal. O SmartClip vai verticalizar com blur ou crop para manter foco."
    );
  }

  if (duration > 300 && !supportsToolCapability(toolSlug, "multiClip")) {
    recommendations.push(
      "Video longo demais para uma unica saida curta. Vale testar a versao de varios clipes."
    );
  }

  if (supportsToolCapability(toolSlug, "multiClip")) {
    recommendations.push(
      `Este preset deve render ${windows.length} saida${windows.length > 1 ? "s" : ""} separada${windows.length > 1 ? "s" : ""}.`
    );
  }

  if (supportsToolCapability(toolSlug, "autoCaption")) {
    recommendations.push(
      "Legenda automatica pode sair embutida no video ou como arquivos SRT e VTT."
    );
  }

  if (supportsToolCapability(toolSlug, "premiumWorker")) {
    recommendations.push(
      "Quando o arquivo rende mais de um corte, vale testar varias saidas do mesmo preset."
    );
  }

  return {
    orientation,
    durationLabel: formatDurationLabel(duration),
    score,
    scoreLabel,
    strategy: profile.primaryGoal,
    summary: `${profile.primaryGoal} O preset atual trabalha em ${windows.length} saida${windows.length > 1 ? "s" : ""}.`,
    recommendations,
    windows
  } satisfies MediaAnalysis;
}
