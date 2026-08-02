import type { Actions } from "@sveltejs/kit";
import { error, fail, json } from "@sveltejs/kit";
import { orm } from "$lib/db";
import { UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "$lib/tokens";
import type { RequestEvent } from "./$types";

export const actions = {
    default: async (event) => {
        let data = await event.request.formData();

        let email = data.get("email")?.toString();
        let password = data.get("password")?.toString();

        if (email == undefined || password == undefined) {
            return fail(400, "Email and password required");
        }

        let em = orm.em.fork();
        const user = await em.findOne(UserSchema, { email: email });

        if (user == undefined) return fail(401, "Incorrect email or password");

        let match = await bcrypt.compare(password, user.passwordHash);
        if (match) {
            let token = generateJwtToken(user.publicId, 10);
            return { success: true, token: token };
        }
        else return fail(400, "Incorrect email or password");
    }
} satisfies Actions;