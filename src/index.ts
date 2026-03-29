// ============================================================
// index.ts — Point d'entrée du serveur MCP Dendreo
// ============================================================
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";

import { DendreoClient } from "./client.js";
import { registerAdfTools } from "./tools/adf.js";
import { registerParticipantTools } from "./tools/participants.js";
import { registerEntrepriseTools } from "./tools/entreprises.js";
import { registerFormateurTools } from "./tools/formateurs.js";
import { registerCatalogueTools } from "./tools/catalogue.js";

// ── Configuration ─────────────────────────────────────────
// Ces valeurs sont lues depuis les variables d'environnement.
// Ne mettez JAMAIS vos clés directement dans le code !
const DENDREO_BASE_URL = process.env.DENDREO_BASE_URL;
const DENDREO_API_KEY  = process.env.DENDREO_API_KEY;
const PORT = parseInt(process.env.PORT ?? "3000", 10);

if (!DENDREO_BASE_URL || !DENDREO_API_KEY) {
  console.error("❌ Variables d'environnement manquantes :");
  console.error("   DENDREO_BASE_URL  — ex: https://pro.dendreo.com/VOTRE_COMPTE/api");
  console.error("   DENDREO_API_KEY   — votre clé API Dendreo");
  process.exit(1);
}

// ── Client Dendreo ────────────────────────────────────────
const client = new DendreoClient({
  baseUrl: DENDREO_BASE_URL,
  apiKey: DENDREO_API_KEY,
});

// ── Serveur MCP ───────────────────────────────────────────
const server = new McpServer({
  name: "dendreo-mcp",
  version: "1.0.0",
});

// Enregistrement de tous les outils
registerAdfTools(server, client);
registerParticipantTools(server, client);
registerEntrepriseTools(server, client);
registerFormateurTools(server, client);
registerCatalogueTools(server, client);

// ── Transport HTTP ────────────────────────────────────────
const transport = new StreamableHTTPServerTransport({ path: "/mcp" });
await server.connect(transport);

const httpServer = createServer((req, res) => {
  // Health check
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", server: "dendreo-mcp" }));
    return;
  }
  transport.handleRequest(req, res);
});

httpServer.listen(PORT, () => {
  console.log(`✅ Serveur MCP Dendreo démarré sur le port ${PORT}`);
  console.log(`   URL MCP : http://localhost:${PORT}/mcp`);
  console.log(`   Health  : http://localhost:${PORT}/health`);
  console.log(`\n📋 Outils disponibles :`);
  console.log(`   Actions de Formation : lister, afficher, créer`);
  console.log(`   Participants         : lister, afficher, créer, inscriptions`);
  console.log(`   Entreprises          : lister, afficher, créer, contacts`);
  console.log(`   Formateurs           : lister, afficher, créer, interventions`);
  console.log(`   Catalogue            : modules, catégories, prochaines sessions`);
});
