import { UserSchema } from "$lib/entities/user.entity";
import { defineConfig, EntityCaseNamingStrategy } from "@mikro-orm/mariadb";

export default defineConfig({
    dbName: "deltadb",
    user: "deltadb",
    port: 3306,
    password: "password",
    debug: true,
    entities: [UserSchema]
});