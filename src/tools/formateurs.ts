// ============================================================
// tools/formateurs.ts — Outils Formateurs
// ============================================================
import { z } from "zod";
import type { DendreoClient } from "../client.js";

export function registerFormateurTools(server: any, client: DendreoClient) {

  // ── Lister les formateurs ─────────────────────────────────
  server.tool(
    "lister_formateurs",
    "Liste tous les formateurs enregistrés dans Dendreo.",
    {
      search: z.string().optional().describe("Recherche par nom ou prénom"),
      limit: z.string().optional().describe("Nombre maximum de résultats"),
    },
    async ({ search, limit }: { search?: string; limit?: string }) => {
      const params: Record<string, string> = {};
      if (search) params["search"] = search;
      if (limit) params["limit"] = limit;

      const data = await client.get("formateurs.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Afficher un formateur ─────────────────────────────────
  server.tool(
    "afficher_formateur",
    "Affiche le détail d'un formateur par son ID.",
    {
      id: z.string().describe("ID du formateur"),
    },
    async ({ id }: { id: string }) => {
      const data = await client.get("formateurs.php", { id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Interventions d'un formateur ─────────────────────────
  server.tool(
    "interventions_formateur",
    "Liste toutes les Actions de Formation où un formateur intervient.",
    {
      id_formateur: z.string().describe("ID du formateur"),
      date_debut: z.string().optional().describe("Filtrer à partir de cette date (YYYY-MM-DD)"),
      date_fin: z.string().optional().describe("Filtrer jusqu'à cette date (YYYY-MM-DD)"),
    },
    async ({ id_formateur, date_debut, date_fin }: { id_formateur: string; date_debut?: string; date_fin?: string }) => {
      const params: Record<string, string> = { id_formateur };
      if (date_debut) params["date_debut"] = date_debut;
      if (date_fin) params["date_fin"] = date_fin;

      const data = await client.get("formateurs_adfs.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Créer un formateur ────────────────────────────────────
  server.tool(
    "creer_formateur",
    "Crée un nouveau formateur dans Dendreo.",
    {
      nom: z.string().describe("Nom du formateur"),
      prenom: z.string().describe("Prénom du formateur"),
      email: z.string().describe("Email du formateur"),
      civilite: z.enum(["M.", "Mme"]).optional().describe("Civilité"),
      telephone: z.string().optional().describe("Téléphone"),
      id_add: z.string().describe("ID de l'administrateur qui crée le formateur"),
    },
    async (args: Record<string, string>) => {
      const data = await client.post("formateurs.php", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
