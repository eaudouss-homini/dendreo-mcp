// ============================================================
// tools/participants.ts — Outils Participants / Stagiaires
// ============================================================
import { z } from "zod";
import type { DendreoClient } from "../client.js";

export function registerParticipantTools(server: any, client: DendreoClient) {

  // ── Lister les participants ───────────────────────────────
  server.tool(
    "lister_participants",
    "Liste les participants (stagiaires) enregistrés dans Dendreo.",
    {
      search: z.string().optional().describe("Recherche par nom, prénom ou email"),
      limit: z.string().optional().describe("Nombre maximum de résultats"),
    },
    async ({ search, limit }: { search?: string; limit?: string }) => {
      const params: Record<string, string> = {};
      if (search) params["search"] = search;
      if (limit) params["limit"] = limit;

      const data = await client.get("participants.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Afficher un participant ───────────────────────────────
  server.tool(
    "afficher_participant",
    "Affiche le détail d'un participant par son ID ou son email.",
    {
      id_participant: z.string().optional().describe("ID du participant"),
      email: z.string().optional().describe("Email du participant"),
    },
    async ({ id_participant, email }: { id_participant?: string; email?: string }) => {
      const params: Record<string, string> = {};
      if (id_participant) params["id_participant"] = id_participant;
      if (email) params["email"] = email;

      const data = await client.get("participants.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Créer un participant ──────────────────────────────────
  server.tool(
    "creer_participant",
    "Crée un nouveau participant (stagiaire) dans Dendreo.",
    {
      nom: z.string().describe("Nom du participant"),
      prenom: z.string().describe("Prénom du participant"),
      email: z.string().describe("Email du participant"),
      civilite: z.enum(["M.", "Mme"]).optional().describe("Civilité"),
      telephone: z.string().optional().describe("Numéro de téléphone"),
      id_add: z.string().describe("ID de l'administrateur qui crée le participant"),
    },
    async (args: Record<string, string>) => {
      const data = await client.post("participants.php", args);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Inscriptions d'un participant ────────────────────────
  server.tool(
    "inscriptions_participant",
    "Liste toutes les formations auxquelles un participant est inscrit.",
    {
      id_participant: z.string().describe("ID du participant"),
    },
    async ({ id_participant }: { id_participant: string }) => {
      const data = await client.get("lcp.php", { id_participant });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
