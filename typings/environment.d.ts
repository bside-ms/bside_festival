declare namespace NodeJS {
    export interface ProcessEnv {
        NEXT_ENV?: string;

        APP_URL?: string;

        DB_HOST?: string;
        DB_DATABASE?: string;
        DB_USER?: string;
        DB_PASSWORD?: string;
        DATABASE_URL?: string;

        NEXTAUTH_URL?: string;
        NEXTAUTH_SECRET?: string;

        KEYCLOAK_ISSUER_URL?: string;
        KEYCLOAK_CLIENT_ID?: string;
        KEYCLOAK_CLIENT_SECRET?: string;

        MAIL_HOST?: string;
        MAIL_USER?: string;
        MAIL_PASSWORD?: string;

        CRYPTO_SECRET?: string;

        NEXT_PUBLIC_IONOS_HOST_NAME?: string;
        NEXT_PUBLIC_IONOS_BUCKET_NAME?: string;
        IONOS_ACCESS_KEY_ID?: string;
        IONOS_SECRET_ACCESS_KEY?: string;
    }
}
