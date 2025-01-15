
export default () => ({
    environment: process.env.ENVIRONMENT,
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        user: process.env.DATABASE_USERNAME,
        pass: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiry: process.env.JWT_EXPIRY
    }
});