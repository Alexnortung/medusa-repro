// import { loadEnv, defineConfig } from '@medusajs/utils'

const { loadEnv, defineConfig } = require('@medusajs/framework/utils')
const { SYNC_SERVICE } = require('./src/modules/sync-service')
const { BRAND_MODULE } = require('./src/modules/brand')

loadEnv(process.env.NODE_ENV, process.cwd())

module.exports = defineConfig({
  projectConfig: {
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    backendUrl: process.env.PUBLIC_URL?.replace(/\/+$/, ""),
  },
  modules: {
    [BRAND_MODULE]: {
      resolve: './modules/brand/',
    },
    [SYNC_SERVICE]: {
      resolve: './modules/sync-service/',
      /** @type {import('src/modules/sync-service/config').SyncServiceConfig} */
      options: {
        baseUrl: process.env.SYNC_SERVICE_BASE_URL || 'http://localhost:3000/full-sync',
        token: process.env.SYNC_SERVICE_TOKEN,
      },
    },
  },
})
