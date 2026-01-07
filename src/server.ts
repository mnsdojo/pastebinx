import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    console.log("✅ HTTP server closed");
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => {
    console.error("❌ Forcing shutdown...");
    process.exit(1);
  }, 10_000);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
