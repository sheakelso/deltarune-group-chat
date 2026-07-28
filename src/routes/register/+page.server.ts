import type { Actions } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { orm } from "$lib/db";
import { UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "$lib/tokens";
import type { RequestEvent } from "../api/$types";
import { v4 } from "uuid";

export const actions = {
    default: async (event) => {
        let data = await event.request.formData();

        let email = data.get("email")?.toString();
        let username = data.get("username")?.toString();
        let password = data.get("password")?.toString();

        if (email == undefined || password == undefined || username == undefined) {
            return error(400, "Email and password required");
        }

        try {
            let em = orm.em.fork();
            const user = await em.create(UserSchema, {
                email: email,
                username: username,
                passwordHash: "",
                publicId: v4()
            });
            em.flush();
            return new Response("Success");
        }
        catch{
            return error(400, "Invalid details");
        }
        
    }
} satisfies Actions;