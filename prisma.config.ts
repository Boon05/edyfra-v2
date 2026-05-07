import { defineConfig } from '@prisma/config';

export default defineConfig({
    datasource: {
        // For CLI operations like migrate and db pull, 
        // it is best to use your direct connection URL.
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
});