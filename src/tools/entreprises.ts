// ============================================================
// tools/entreprises.ts — Outils Entreprises / CRM
// ============================================================
import { z } from "zod";
import type { DendreoClient } from "../client.js";

export function registerEntrepriseTools(server: any, client: DendreoClient) {

  // ── Lister les entreprises ────────────────────────────────
  server.tool(
    "lister_entreprises",
    "Liste les entreprises clientes enregistrées dans Dendreo.",
    {
      search: z.string().optional().describe("Recherche par nom ou SIRET"),
      limit: z.string().optional().describe("Nombre maximum de résultats"),
    },
    async ({ search, limit }: { search?: string; limit?: string }) => {
      const params: Record<string, string> = {};
      if (search) params["search"] = search;
      if (limit) params["limit"] = limit;

      const data = await client.get("entreprises.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Afficher une entreprise ───────────────────────────────
  server.tool(
    "afficher_entreprise",
    "Affiche le détail d'une entreprise par son ID.",
    {
      id: z.string().describe("ID de l'entreprise"),
    },
    async ({ id }: { id: string }) => {
      const data = await client.get("entreprises.php", { id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Créer une entreprise ──────────────────────────────────
  server.tool(
    "creer_entreprise",
    "Crée une nouvelle entreprise cliente dans Dendreo.",
    {
      raison_sociale: z.string().describe("Raison sociale de l'entreprise"),
      siret: z.string().optional().describe("Numéro SIRET"),
      email: z.string().optional().describe("Email de contact"),
      telephone: z.string().optional().describe("Téléphone"),
      adresse: z.string().optional().describe("Adresse postale"),
      code_postal: z.string().optional().describe("Code postal"),
      ville: z.string().optional().describe("Ville"),
      id_add: z.string().describe("ID de l'administrateur qui crée l'entreprise"),
    },
    async (args: Record<string, string>) => {
      const data = await client.post("entreprises.php", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Lister les contacts d'une entreprise ─────────────────
  server.tool(
    "lister_contacts_entreprise",
    "Liste les contacts associés à une entreprise.",
    {
      id_entreprise: z.string().describe("ID de l'entreprise"),
    },
    async ({ id_entreprise }: { id_entreprise: string }) => {
      const data = await client.get("contacts.php", { id_entreprise });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
