import { Section } from "@/components/ui/Section";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function Admin() {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <Section kicker="Espace artiste" title="Non configuré">
        <p className="max-w-md text-brume-pale/80">
          Le catalogue en libre-service a besoin d'un projet Supabase (base de données + stockage
          des fichiers + authentification). Renseigne <code>VITE_SUPABASE_URL</code> et{" "}
          <code>VITE_SUPABASE_ANON_KEY</code>, applique la migration SQL, puis crée ton compte
          depuis Authentication → Users dans le tableau de bord Supabase. Détails dans le README.
        </p>
      </Section>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ivoire/20 border-t-cuir-bright" />
      </div>
    );
  }

  return <Section>{session ? <AdminDashboard /> : <LoginForm />}</Section>;
}
