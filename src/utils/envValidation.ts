import {z} from 'zod'

const envSchema = z.object({
     DATABASE_URL: z.string().min(5),
     JWT_ACCESS_KEY_SECRET: z.string().min(5)
})

export function validate(config: Record<string,unknown>){
    return envSchema.parse(config)
}

export type envConfig = z.infer<typeof envSchema> 