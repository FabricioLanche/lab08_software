import { createApp } from './infrastructure/api/server';

const PORT = process.env.PORT || 3002;

async function main() {
  const { app, messageBroker, consumer } = await createApp();

  const server = app.listen(PORT, () => {
    console.log(`Rewards service running on port ${PORT}`);
  });

  const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    server.close();
    await consumer.close();
    await messageBroker.close();
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

main().catch(console.error);
