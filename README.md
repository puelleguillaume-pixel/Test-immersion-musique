# Naifos — site vitrine & e-commerce

Site immersif pour Naifos, pianiste devenu producteur de musique urbaine : landing avec scène
Three.js (piano vu en reflet), piano jouable, catalogue de loops/prods/toplines avec panier et
checkout, mur des collabs, univers/à propos, contact & booking.

## Stack

- **Frontend** : React 18 + Vite + TypeScript (strict) + Tailwind CSS + Framer Motion
- **3D** : Three.js (scène hero + fallback CSS pour mobile / `prefers-reduced-motion`)
- **State** : Zustand (panier, préférences audio)
- **Backend** : Supabase (Postgres + Storage) pour le catalogue et les collabs
- **Emails transactionnels & paiement** : webhook Google Apps Script (checkout + contact)
- **Hébergement** : Netlify (`netlify.toml` fourni)

## Démarrage

```bash
npm install
cp .env.example .env   # puis renseigner les variables (voir ci-dessous)
npm run dev
```

Le site fonctionne **sans aucune variable d'environnement configurée** : le catalogue et le mur
des collabs se chargent depuis les données locales (`src/data/`), le panier fonctionne en
localStorage, et le checkout/contact affichent un message clair indiquant qu'ils ne sont pas
encore branchés plutôt que de planter.

### ⚠️ Vérification du build non exécutée dans cette session

Cet environnement d'exécution a bloqué l'accès réseau à `registry.npmjs.org` (politique
d'égress de la session, refus explicite — pas une erreur de configuration). Je n'ai donc pas pu
lancer `npm install` / `npm run build` / le serveur de dev ici pour vérifier la compilation ou
tester dans un navigateur. Le code a été relu manuellement (types, imports, cohérence des
props) et plusieurs bugs réels ont été corrigés pendant cette relecture, mais **il faut lancer
`npm install && npm run build` dans un environnement avec accès réseau (poste local, CI,
build Netlify) avant la mise en prod**, et remonter toute erreur résiduelle.

## Variables d'environnement

Voir `.env.example`. Rien n'est obligatoire pour développer en local :

| Variable | Rôle |
| --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Si absentes, le site sert le catalogue/collabs depuis `src/data/`. Une fois renseignées, `getPacks()` / `getCollabs()` lisent les tables Supabase (voir migration ci-dessous). |
| `VITE_CHECKOUT_WEBHOOK_URL` | URL du webhook Apps Script qui crée la session de paiement (Stripe recommandé) et déclenche l'email avec le lien de téléchargement. Contrat : `POST { email, items, total } → { url }`. |
| `VITE_CONTACT_WEBHOOK_URL` | URL du webhook Apps Script pour le formulaire de contact/booking. Contrat : `POST { name, email, subject, message } → 200 OK`. |
| `VITE_INSTAGRAM_HANDLE`, `VITE_GENIUS_URL` | Liens affichés en footer/contact. |

## Supabase

`supabase/migrations/0001_init.sql` crée les tables `packs`, `collabs`, `orders`, `order_items`,
`contact_messages` avec RLS (lecture publique sur `packs`/`collabs`, écriture réservée au rôle
service — utilisé par le webhook Apps Script ou une edge function, jamais depuis le client).

Pour ajouter un nouveau pack/collab : une ligne dans la table Supabase suffit, aucun changement
front nécessaire (`getPacks()` / `getCollabs()` retombent sur les seeds locales uniquement si
Supabase n'est pas configuré ou renvoie une liste vide).

## ⚠️ Données de démonstration à remplacer avant mise en ligne

Cette session n'a pas d'accès réseau à Genius, donc `src/data/collabs.ts` contient des noms
d'artistes **inventés** (pour ne pas afficher de fausses collaborations avec de vrais artistes)
— à remplacer par les crédits vérifiés depuis <https://genius.com/artists/Naifos> avant de
publier le site. Idem pour `src/data/gallery.ts` (dégradés de couleur en attendant de vraies
photos) et pour les `audioUrl` des packs (vides — brancher Supabase Storage ou tout CDN audio
pour activer la lecture réelle ; sans URL, chaque lecteur affiche un aperçu visuel généré et le
bouton play reste désactivé plutôt que de mentir sur le contenu).

## Structure

```
src/
  components/
    three/      scène hero Three.js + fallback CSS + sélecteur selon l'appareil
    piano/       piano interactif jouable (Web Audio, pas de fichiers son requis)
    catalogue/   grille de packs, waveform, filtres, panier, licences
    collabs/     mur des collabs
    about/       galerie photo
    contact/     formulaire de booking
    layout/      navbar, footer, curseur custom, toggle son, transitions de page
  pages/         Home, Catalogue, Collabs, Univers, Contact, NotFound
  data/          seeds + accès Supabase-first pour packs/collabs/galerie
  lib/           supabase client, checkout/contact webhooks, synthé piano, tempo partagé
  state/         panier (Zustand + localStorage), préférences audio
```

## Choix techniques notables

- **Piano en reflet** : la scène hero affiche deux rangées de touches miroir — une rangée
  "réelle" très estompée en haut, sa réflexion vive et glossy en bas — pour traduire l'idée que
  le piano n'est jamais montré brut, seulement réfléchi. Le fallback CSS (`PianoReflectionFallback`)
  reprend la même logique sans WebGL.
- **Tempo partagé** (`src/lib/tempo.ts`) : toutes les transitions (pages, reveals, hovers) sont
  dérivées d'un BPM unique (90) pour que la navigation ait un groove cohérent plutôt que des
  durées CSS arbitraires.
- **Piano jouable sans assets audio** : `src/lib/audioEngine.ts` synthétise les notes en Web
  Audio (deux oscillateurs + reverb par convolution) — le piano est jouable immédiatement, sans
  attendre de vrais samples. Remplaçable par de vrais one-shots plus tard si besoin.
- **Dégradation mobile/accessibilité** : `useDeviceTier` bascule vers le fallback CSS sur
  pointeur tactile + petit écran ou peu de cœurs CPU ; `usePrefersReducedMotion` coupe les
  animations Framer Motion et fige la scène 3D sur un seul rendu statique.
- **Aucun autoplay** : le son ambiant et les extraits ne démarrent que sur clic explicite
  (`SoundToggle`, `WaveformPlayer`).

## Déploiement (Netlify)

`netlify.toml` est fourni (build `npm run build`, publish `dist`, redirect SPA). Renseigner les
variables d'environnement `VITE_*` dans les paramètres du site Netlify.
