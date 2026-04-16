import { setupApp } from "./app";
import { connectDB } from "./core/database";
import { connectRedis, closeRedis } from "./core/cache";

const PORT = process.env.API_PORT || 4000;

async function bootstrap() {
  try {
    await connectDB();
    await connectRedis();

    const app = await setupApp();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down gracefully...");
      server.close(async () => {
        await closeRedis();
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

bootstrap();
