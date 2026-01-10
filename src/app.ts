import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
  rateLimit?: {
    max: number;
    timeWindow: string;
  };
  cors?: {
    origins: string[];
  };
}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  trustProxy: true,
  rateLimit: {
    max: 100,
    timeWindow: "1 minute",
  },
  cors: {
    origins: [
      "https://app.example.com",
      "https://admin.example.com",
    ],
  },
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}

export default app
export { app, options }
