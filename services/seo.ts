import type { SeoCluster } from "@/types";

export const seoClusters: SeoCluster[] = [
  {
    slug: "clipes-virais",
    title: "Cluster SEO: clipes virais, trailers curtos e cortes automaticos",
    description:
      "Cluster focado em transformar videos longos em formatos curtos com alto apelo para redes sociais e descoberta.",
    intent: "Atrair usuarios que querem mais alcance, mais retenção e menos tempo editando manualmente.",
    keywords: [
      "clipe com legenda automatica",
      "transformar video em clipe viral",
      "gerar varios clipes automaticos",
      "gerar ganchos de video",
      "podcast para clipes",
      "aula para clipes",
      "depoimento para anuncio",
      "cortar video automaticamente",
      "criar trailer curto",
      "video curto para tiktok"
    ],
    relatedRoutes: [
      "/video-para-clipe-com-legenda-automatica",
      "/gerar-varios-clipes-automaticos",
      "/gerar-ganchos-de-video",
      "/podcast-para-clipes",
      "/aula-para-clipes",
      "/depoimento-para-anuncio",
      "/video-para-clipe-viral",
      "/cortar-video-automaticamente",
      "/criar-trailer-curto",
      "/video-horizontal-para-vertical"
    ],
    faqs: [
      {
        question: "O SmartClip consegue encurtar videos automaticamente?",
        answer:
          "Sim. As novas rotas usam presets inteligentes para cortar, condensar e deixar o arquivo mais pronto para formatos curtos."
      },
      {
        question: "Consigo receber mais de um clipe do mesmo video?",
        answer:
          "Sim. Algumas ferramentas foram preparadas para gerar varias saidas curtas do mesmo upload quando o preset suporta esse fluxo."
      },
      {
        question: "Da para testar varios hooks do mesmo video?",
        answer:
          "Sim. O SmartClip agora tem rotas especificas para gerar ganchos curtos, varios clipes automáticos e recortes de aulas ou podcasts."
      },
      {
        question: "Posso transformar um video horizontal em algo pronto para TikTok?",
        answer:
          "Sim. A ferramenta de horizontal para vertical centraliza o quadro e gera saidas 9:16 pensadas para descoberta."
      }
    ]
  },
  {
    slug: "cortar-video",
    title: "Cluster SEO: cortar video online",
    description:
      "Cluster voltado para intencao comercial de corte rapido, reaproveitamento e exportacao social.",
    intent: "Ferramenta online com dor imediata e alta propensao de uso recorrente.",
    keywords: ["cortar video online", "clipar video", "editor de corte rapido"],
    relatedRoutes: ["/cortar-video", "/video-para-reels", "/video-para-shorts"],
    faqs: [
      {
        question: "Posso cortar video sem instalar programa?",
        answer: "Sim. O SmartClip foi desenhado para rodar no navegador com upload simples e exportacao guiada."
      },
      {
        question: "Consigo repetir o mesmo corte depois?",
        answer: "Sim. O dashboard foi preparado para repetir ultima exportacao e salvar projeto simples."
      }
    ]
  },
  {
    slug: "extrair-audio",
    title: "Cluster SEO: extrair audio e converter para MP3",
    description:
      "Cluster com foco em reaproveitamento de conteudo, podcast, transcricao e distribuicao multiformato.",
    intent: "Capturar usuario com dor de conversao simples e levar para rotinas recorrentes.",
    keywords: ["extrair audio de video", "mp4 para mp3", "converter video em audio"],
    relatedRoutes: ["/extrair-audio", "/mp4-para-mp3", "/mov-para-mp4"],
    faqs: [
      {
        question: "Extrair audio perde o video original?",
        answer: "Nao. O video permanece intacto e o SmartClip gera um novo arquivo de audio."
      },
      {
        question: "Posso fazer isso com arquivos do iPhone?",
        answer: "Sim. A base do produto ja contempla fluxos MOV para MP4 e extracao de audio."
      }
    ]
  },
  {
    slug: "compressao-de-video",
    title: "Cluster SEO: compressao e envio rapido",
    description:
      "Cluster para usuarios que precisam reduzir peso sem travar a rotina de publicacao ou compartilhamento.",
    intent: "Atrair quem precisa resolver upload, WhatsApp, email e plataformas com limite de tamanho.",
    keywords: ["comprimir video", "reduzir tamanho de video", "video leve para whatsapp"],
    relatedRoutes: [
      "/comprimir-video",
      "/video-para-whatsapp",
      "/video-para-status-de-whatsapp",
      "/converter-video"
    ],
    faqs: [
      {
        question: "Da para comprimir sem destruir a qualidade?",
        answer: "Sim. O fluxo de compressao foi desenhado para equilibrar tamanho final e clareza percebida."
      },
      {
        question: "Qual plano vale para uso frequente?",
        answer: "O Creator tende a ser o melhor custo-beneficio para lotes recorrentes e exportacao sem limite."
      }
    ]
  },
  {
    slug: "video-para-redes-sociais",
    title: "Cluster SEO: video para Reels, Shorts, TikTok e Stories",
    description:
      "Cluster com foco em presets sociais, proporcao correta, reaproveitamento e velocidade de publicacao.",
    intent: "Levar trafego altamente qualificado para paginas de ferramenta e upgrade premium.",
    keywords: ["video para reels", "video para shorts", "video para tiktok", "video para stories"],
    relatedRoutes: [
      "/video-para-clipe-com-legenda-automatica",
      "/video-para-reels",
      "/video-para-shorts",
      "/video-para-tiktok",
      "/video-para-stories",
      "/video-para-status-de-whatsapp",
      "/video-horizontal-para-vertical"
    ],
    faqs: [
      {
        question: "O SmartClip ja mostra presets prontos?",
        answer: "Sim. Os principais formatos sociais aparecem no fluxo e podem ser repetidos depois."
      },
      {
        question: "Tem legenda automatica nesses formatos?",
        answer: "Sim. A legenda automatica esta estruturada como recurso premium central do produto."
      }
    ]
  }
];

export function getSeoClusterBySlug(slug: string) {
  return seoClusters.find((cluster) => cluster.slug === slug);
}
