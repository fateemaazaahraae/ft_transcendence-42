import "./config/env.js"
import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import { settingsRoutes } from "./routes/settings.js"
import fastifyMultipart from "@fastify/multipart";

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors, {
    origin: '*',
    credentials: true,
});
await fastify.register(fastifyMultipart, {
    attachFieldsToBody: false,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

settingsRoutes(fastify);
const start = async () => {
    try {
      await fastify.listen({ port: 3001, host: '0.0.0.0' })
      fastify.log.info(`Server listening on port 3001`)
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();