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
`supabase/migrations/0002_admin_catalogue.sql` ajoute les policies d'écriture pour l'espace
artiste (voir ci-dessous) et crée le bucket de stockage `pack-audio`.

Pour ajouter un nouveau pack : soit une ligne dans la table Supabase, soit — plus simple —
directement depuis `/admin` une fois le projet connecté. `getPacks()` / `getCollabs()` retombent
sur les seeds locales uniquement si Supabase n'est pas configuré ou renvoie une liste vide.

## Espace artiste (`/admin`)

Page de gestion du catalogue en libre-service, pour que Naifos ajoute/modifie/supprime ses packs
(prix inclus) et dépose ses fichiers audio sans toucher au code. Lien discret en bas de page
("Espace artiste"), protégé par Supabase Auth.

**Mise en service (une fois) :**

1. Crée un projet Supabase, renseigne `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
2. Applique les deux migrations SQL (`supabase/migrations/0001_init.sql` puis `0002_admin_catalogue.sql`) — via le SQL Editor du tableau de bord Supabase, ou la CLI Supabase.
3. **Désactive les inscriptions publiques** : Authentication → Providers → Email → décocher
   "Allow new users to sign up". Les policies d'écriture du catalogue autorisent n'importe quel
   compte authentifié — sans cette étape, n'importe qui pourrait s'inscrire et modifier le
   catalogue.
4. Crée le compte de l'artiste : Authentication → Users → Add user (email + mot de passe).
5. Va sur `/admin`, connecte-toi. Le catalogue Supabase est vide au départ — les 8 packs de
   démo restent visibles tant qu'aucune ligne n'existe dans la table `packs` (comportement de
   secours habituel), donc la première étape sur `/admin` est d'ajouter les vrais packs.

**Utilisation :** "Nouveau pack" ouvre un formulaire — titre, type, BPM, tonalité, mood, tags,
deux couleurs de cover, fichier audio (upload direct vers Supabase Storage, durée détectée
automatiquement), et le prix des 4 licences (MP3/WAV/Trackout/Exclusivité) modifiable
individuellement. "Modifier" sur un pack existant réutilise le même formulaire ; "Supprimer"
demande une confirmation. Les filtres du catalogue public (mood, tonalité, BPM) se recalculent
automatiquement à partir de ce qui existe réellement, donc un pack ajouté avec un nouveau mood
ou un nouveau BPM est immédiatement filtrable sans toucher au code.

## ⚠️ Données de démonstration restantes

`src/data/collabs.ts` contient désormais les vraies collaborations (9 morceaux — Ninho, Kaneki,
HOUDI & Anyme023, Emkal ×2, Niro ×2, Yaro, Béné (FRA)), fournies par l'artiste depuis la page
<https://genius.com/artists/Naifos>. C'est une liste **partielle** — Genius affiche "Afficher
toutes les chansons de Naifos", donc il y en a d'autres à ajouter au fil de l'eau. Les années de
sortie n'étaient pas visibles sur la capture fournie, donc `year` est volontairement laissé vide
plutôt que deviné (le champ est optionnel, l'UI l'affiche seulement quand il est renseigné).
*"BESOIN DE TOI"* (feat. FAYV) est marqué *(Non publié)* sur Genius et n'a délibérément pas été
ajouté — à inclure quand l'artiste décide de l'annoncer.

La page Collabs affiche ces 9 morceaux dans un carrousel 3D en CSS pur
(`src/components/ui/image-stream-hero.tsx`). Les vraies pochettes Genius ne nous appartiennent
pas et ne sont pas redistribuables sans l'accord de l'ayant droit, donc chaque carte y est un
dégradé généré à partir de la couleur d'accent du morceau (`src/lib/coverPlaceholder.ts`) plutôt
qu'une image copiée depuis Genius. À remplacer par les vraies pochettes si l'artiste a les droits
de les afficher.

### Composants au format shadcn

`src/components/ui/` suit la convention shadcn (un composant = un fichier, style copié-collé plutôt
qu'installé en dépendance) même si le projet n'a pas été scaffoldé avec le CLI shadcn — il a déjà
tout ce qu'il faut pour l'accueillir : TypeScript strict, Tailwind, et ce dossier. `src/lib/utils.ts`
ré-exporte le `cn` du projet (`src/lib/cn.ts`) sous le nom que ces composants attendent par
convention (`@/lib/utils`), pour que de nouveaux composants shadcn puissent être copiés-collés
tels quels sans réécrire leurs imports.

Reste en placeholder : `src/data/gallery.ts` (dégradés de couleur en attendant de vraies photos
studio/scène/portraits). Les packs du catalogue de démo (`src/data/packs.ts`) n'ont pas de
fichier audio — une fois `/admin` en service (voir plus bas), l'upload s'y fait directement ; en
attendant, chaque lecteur affiche un aperçu visuel généré et le bouton play reste désactivé
plutôt que de mentir sur le contenu. Le mur des collabs a le même comportement : sans `audioUrl`
par morceau (pas encore gérable depuis `/admin`, à ajouter en base si besoin), le mini-player
s'ouvre mais la lecture reste désactivée.

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
    admin/       espace artiste — connexion + formulaire de gestion du catalogue
    layout/      navbar, footer, curseur custom, toggle son, transitions de page
  pages/         Home, Catalogue, Collabs, Univers, Contact, Admin, NotFound
  data/          seeds + accès Supabase-first (lecture + écriture) pour packs/collabs/galerie
  lib/           supabase client, checkout/contact webhooks, synthé piano, tempo partagé, slugify
  hooks/         useAuth (session Supabase), useDeviceTier, usePrefersReducedMotion
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
