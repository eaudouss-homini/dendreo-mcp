import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";

import { DendreoClient } from "./client.js";
import { registerAdfTools } from "./tools/adf.js";
import { registerParticipantTools } from "./tools/participants.js";
import { registerEntrepriseTools } from "./tools/entreprises.js";
import { registerFormateurTools } from "./tools/formateurs.js";
import { registerCatalogueTools } from "./tools/catalogue.js";

const DENDREO_BASE_URL = process.env.DENDREO_BASE_URL;
const DENDREO_API_KEY  = process.env.DENDREO_API_KEY;
const PORT = parseInt(process.env.PORT ?? "3000", 10);

if (!DENDREO_BASE_URL || !DENDREO_API_KEY) {
  console.error("❌ Variables d'environnement manquantes :");
  console.error("   DENDREO_BASE_URL");
  console.error("   DENDREO_API_KEY");
  process.exit(1);
}

const client = new DendreoClient({ baseUrl: DENDREO_BASE_URL, apiKey: DENDREO_API_KEY });

function createMcpServer() {
  const server = new McpServer({ name: "dendreo-mcp", version: "1.0.0" });
  registerAdfTools(server, client);
  registerParticipantTools(server, client);
  registerEntrepriseTools(server, client);
  registerFormateurTools(server, client);
  registerCatalogueTools(server, client);
  return server;
}

const httpServer = createServer(async (req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", server: "dendreo-mcp" }));
    return;
  }
  if (req.url === "/mcp") {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }
  res.writeHead(404);
  res.end("Not found");
});

httpServer.listen(PORT, () => {
  console.log(`✅ Serveur MCP Dendreo démarré sur le port ${PORT}`);
});