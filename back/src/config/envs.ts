import 'dotenv/config';
import * as joi from 'joi'

interface EnvConfig {

    PORT: number;
    DATABASE_URL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    WOMPI_BASE_URL: string;
    WOMPI_PUBLIC_KEY: string;
    WOMPI_PRIVATE_KEY: string;
    WOMPI_EVENTS_KEY: string;
    WOMPI_INTEGRITY_KEY: string;
    WOMPI_ACCEPTANCE_TTL_MIN: number;
    APP_URL: string;


}

const ensSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().uri().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().default(5432),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    WOMPI_BASE_URL: joi.string().uri().required(),
    WOMPI_PUBLIC_KEY: joi.string().required(),
    WOMPI_PRIVATE_KEY: joi.string().required(),
    WOMPI_EVENTS_KEY: joi.string().required(),
    WOMPI_INTEGRITY_KEY: joi.string().required(),
    WOMPI_ACCEPTANCE_TTL_MIN: joi.number().default(10),
    APP_URL: joi.string().uri().required(),
})
    .unknown(true) // allow other keys

const { error, value } = ensSchema.validate(process.env)
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvConfig = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    host: envVars.DB_HOST,
    dbport: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    wompiBaseUrl: envVars.WOMPI_BASE_URL,
    wompiPublicKey: envVars.WOMPI_PUBLIC_KEY,
    wompiPrivateKey: envVars.WOMPI_PRIVATE_KEY,
    wompiEventsKey: envVars.WOMPI_EVENTS_KEY,
    wompiIntegrityKey: envVars.WOMPI_INTEGRITY_KEY,
    wompiAcceptanceTtlMin: envVars.WOMPI_ACCEPTANCE_TTL_MIN,
    appUrl: envVars.APP_URL,


}