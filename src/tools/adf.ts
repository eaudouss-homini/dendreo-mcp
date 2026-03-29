// ============================================================
// tools/adf.ts — Outils Actions de Formation
// ============================================================
import { z } from "zod";
import type { DendreoClient } from "../client.js";

export function registerAdfTools(server: any, client: DendreoClient) {

  // ── Lister les Actions de Formation ──────────────────────
  server.tool(
    "lister_actions_de_formation",
    "Liste les Actions de Formation (ADF) dans Dendreo. Peut être filtré par statut, date ou formateur.",
    {
      statut: z.string().optional().describe("Filtre par statut (ex: 'realisation', 'bilan', 'prospect')"),
      date_debut: z.string().optional().describe("Date de début au format YYYY-MM-DD"),
      date_fin: z.string().optional().describe("Date de fin au format YYYY-MM-DD"),
      limit: z.string().optional().describe("Nombre maximum de résultats (défaut: 50)"),
    },
    async ({ statut, date_debut, date_fin, limit }: { statut?: string; date_debut?: string; date_fin?: string; limit?: string }) => {
      const params: Record<string, string> = {};
      if (statut) params["statut"] = statut;
      if (date_debut) params["date_debut"] = date_debut;
      if (date_fin) params["date_fin"] = date_fin;
      if (limit) params["limit"] = limit;

      const data = await client.get("adfs.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Afficher une Action de Formation ─────────────────────
  server.tool(
    "afficher_action_de_formation",
    "Affiche le détail complet d'une Action de Formation par son ID.",
    {
      id: z.string().describe("L'identifiant de l'Action de Formation"),
    },
    async ({ id }: { id: string }) => {
      const data = await client.get("adfs.php", { id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Créer une Action de Formation ────────────────────────
  server.tool(
    "creer_action_de_formation",
    "Crée une nouvelle Action de Formation dans Dendreo.",
    {
      intitule: z.string().describe("Intitulé / titre de la formation"),
      id_module: z.string().describe("ID du module de formation associé"),
      date_debut: z.string().describe("Date de début au format YYYY-MM-DD"),
      date_fin: z.string().describe("Date de fin au format YYYY-MM-DD"),
      nb_heures: z.string().optional().describe("Nombre d'heures de formation"),
      lieu: z.string().optional().describe("Lieu de la formation"),
      id_add: z.string().describe("ID de l'administrateur qui crée l'ADF"),
    },
    async (args: Record<string, string>) => {
      const data = await client.post("adfs.php", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
