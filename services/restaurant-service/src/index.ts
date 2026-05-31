import { createApp } from './infrastructure/api/server';

const PORT = process.env.PORT || 3001;

async function main() {
  const { app, messageBroker } = await createApp();

  const server = app.listen(PORT, () => {
    console.log(`Restaurant service running on port ${PORT}`);
  });

  const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    server.close();
    await messageBroker.close();
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

main().catch(console.error);
