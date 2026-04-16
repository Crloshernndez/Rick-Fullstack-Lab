import { setupApp } from "./app";

const PORT = process.env.API_PORT || 4000;

async function bootstrap() {
  try {
    const app = await setupApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

bootstrap();
