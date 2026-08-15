-- Naifos — catalogue en libre-service (/admin)
--
-- Donne aux utilisateurs authentifiés le droit de créer/modifier/supprimer
-- des packs, et crée le bucket de stockage pour les fichiers audio.
--
-- ⚠️ SÉCURITÉ — étape manuelle obligatoire avant mise en ligne :
-- ces policies autorisent TOUT utilisateur authentifié (auth.role() =
-- 'authenticated'), sans distinction. Ce n'est sûr que si les inscriptions
-- publiques sont désactivées. Dans le tableau de bord Supabase :
--   Authentication → Providers → Email → désactiver "Allow new users to sign up"
-- puis créer le seul compte artiste depuis Authentication → Users → Add user.
-- Sans ça, n'importe qui pourrait créer un compte et modifier le catalogue.

create policy "authenticated can insert packs" on packs
  for insert to authenticated
  with check (true);

create policy "authenticated can update packs" on packs
  for update to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete packs" on packs
  for delete to authenticated
  using (true);

-- Stockage des fichiers audio des packs. Bucket public en lecture (pour que
-- <audio src> fonctionne directement sans URL signée), écriture réservée aux
-- utilisateurs authentifiés.
insert into storage.buckets (id, name, public)
values ('pack-audio', 'pack-audio', true)
on conflict (id) do nothing;

create policy "public read pack audio" on storage.objects
  for select
  using (bucket_id = 'pack-audio');

create policy "authenticated upload pack audio" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'pack-audio');

create policy "authenticated update pack audio" on storage.objects
  for update to authenticated
  using (bucket_id = 'pack-audio');

create policy "authenticated delete pack audio" on storage.objects
  for delete to authenticated
  using (bucket_id = 'pack-audio');
