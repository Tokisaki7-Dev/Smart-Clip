# SmartClip Premium Worker

Worker separado para processar jobs premium fora da Vercel.

## O que ele faz

- busca jobs `auto_clip` e `auto_caption` em `processing_jobs`
- baixa o video original do Supabase Storage
- detecta janelas de fala com heuristicas de silencio
- gera clipes 1080p verticais
- opcionalmente usa o filtro `whisper` do FFmpeg para legenda automatica em SRT
- envia os arquivos finais para o Storage
- grava os resultados em `exports` e atualiza `processing_jobs`

## Requisitos

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ffmpeg` e `ffprobe` instalados
- opcional: `WHISPER_MODEL_PATH` para legenda automatica real no servidor
- opcional: `WHISPER_VAD_MODEL_PATH` para VAD melhor

## Rodar

```bash
npm run worker:premium
```

Rodar uma iteracao so:

```bash
npm run worker:premium:once
```
