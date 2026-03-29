// ============================================================
// tools/catalogue.ts — Outils Catalogue & Modules
// ============================================================
import { z } from "zod";
import type { DendreoClient } from "../client.js";

export function registerCatalogueTools(server: any, client: DendreoClient) {

  // ── Lister les modules ────────────────────────────────────
  server.tool(
    "lister_modules",
    "Liste tous les modules de formation du catalogue Dendreo.",
    {
      search: z.string().optional().describe("Recherche par titre ou mot-clé"),
      id_categorie: z.string().optional().describe("Filtrer par catégorie"),
      limit: z.string().optional().describe("Nombre maximum de résultats"),
    },
    async ({ search, id_categorie, limit }: { search?: string; id_categorie?: string; limit?: string }) => {
      const params: Record<string, string> = {};
      if (search) params["search"] = search;
      if (id_categorie) params["id_categorie"] = id_categorie;
      if (limit) params["limit"] = limit;

      const data = await client.get("modules.php", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Afficher un module ────────────────────────────────────
  server.tool(
    "afficher_module",
    "Affiche le détail d'un module de formation par son ID.",
    {
      id: z.string().describe("ID du module"),
    },
    async ({ id }: { id: string }) => {
      const data = await client.get("modules.php", { id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Lister les catégories de module ──────────────────────
  server.tool(
    "lister_categories_modules",
    "Liste toutes les catégories de modules du catalogue.",
    {},
    async () => {
      const data = await client.get("categories_modules.php", {});
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ── Prochaines sessions publiques ────────────────────────
  server.tool(
    "prochaines_sessions",
    "Liste les prochaines sessions disponibles dans le catalogue public.",
    {
      id_module: z.string().optional().describe("Filtrer par module"),
      limit: z.string().optional().describe("Nombre maximum de résultats"),
    },
    async ({ id_module, limit }: { id_module?: string; limit?: string }) => {
      const params: Record<string, string> = {};
      if (id_module) params["id_module"] = id_module;
      if (limit) params["limit"] = limit;

      const data = await client.get("adfs.php", { ...params, catalogue: "1" });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
