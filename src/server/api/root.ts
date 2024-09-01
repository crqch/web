import { createElysia } from '@/server/api/elysia'
import dashboard from './routes/dashboard'
import index from './routes/index'

export const appRouter = createElysia({ prefix: '/api' }).use(index).use(dashboard).compile()

export type App = typeof appRouter