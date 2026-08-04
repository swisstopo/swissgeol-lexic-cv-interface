# Controlled Vocabularies Interface

Interfaccia web Next.js per consultare i vocabolari controllati Swissgeol tramite GraphDB.

## Stack principale

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Gluestack UI v2 con componenti locali in `components/ui`
- GraphDB client
- Docker per build e runtime di produzione

## Avvio con Docker

Il percorso Docker e quello da considerare prioritario per test e produzione.

```bash
docker compose up --build
```

L'applicazione viene esposta su:

```text
http://localhost:3050
```

Per l'ambiente di test CVI:

```bash
docker compose -f docker-compose.testCVI.yml up --build
```

## Avvio locale

```bash
npm install
npm run dev
```

L'applicazione locale viene esposta da Next.js su:

```text
http://localhost:3000
```

Per verificare la build:

```bash
npm run build
```

## Variabili ambiente

Le variabili principali sono documentate in `.env.example`.

I file `docker-compose.yml` e `docker-compose.testCVI.yml` definiscono gia i valori usati dagli ambienti Docker. In locale, usare `.env.local` o variabili ambiente equivalenti.

Variabili principali:

- `GRAPHDB_BASE_URL`
- `GRAPHDB_USERNAME`
- `GRAPHDB_PASSWORD`
- `CHRONOSTRATIGRAPHY_REPO_ID`
- `TECTONICUNITS_REPO_ID`
- `LITHOSTRATIGRAPHY_REPO_ID`
- `LITHOLOGY_REPO_ID`
- `LS_CORRELATIONS_REPO_ID`
- `VOCABULARY_PREFIX_URL`
- `GOOGLE_ANALYTICS_ID`
- `GITHUB_OWNER`
- `CHRONOSTRATIGRAPHY_REPO_SLUG`
- `TECTONICUNITS_REPO_SLUG`
- `LITHOSTRATIGRAPHY_REPO_SLUG`
- `LITHOLOGY_REPO_SLUG`
- `LS_CORRELATIONS_REPO_SLUG`

## Struttura UI

La UI e stata migrata da Gluestack v1 a Gluestack v2.

I componenti Gluestack attivi sono componenti locali sotto `components/ui`. Il provider attivo e `components/ui/gluestack-ui-provider`, usato da `app/providers.tsx`.

Non usare nuovi import da:

- `@gluestack-ui/themed`
- `@gluestack-ui/config`
- `@gluestack-style/react`

Per preservare il risultato grafico, alcuni stili restano intenzionalmente in Tailwind o React style object. Questo aiuta anche a ridurre gradualmente la dipendenza da Gluestack.

## Note di manutenzione

- `.npmrc` contiene `legacy-peer-deps=true` per compatibilita con lo stack Gluestack.
- `.gluestack/` e un artefatto della migrazione v1 -> v2. Non rimuoverlo senza una verifica dedicata di build, Docker e UI.
- I documenti e gli script interni di migrazione non fanno parte del repository applicativo.
