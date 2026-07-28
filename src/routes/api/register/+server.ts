import { error } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { orm } from "../../../lib/db";
import { UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import { UuidType } from "@mikro-orm/core";
import { v4 } from "uuid";

export async function POST(event: RequestEvent) {

    let data = await event.request.json();

    if (!data.username || !data.password || !data.email) {
        return error(400, "Must provide username email and password");
    }

    if (validateEmail(data.email) && validatePassword(data.password) && validateUsername(data.username)) {
        try {
            let em = orm.em.fork();
            em.create(UserSchema, {
                username: data.username,
                email: data.email,
                passwordHash: await hashPassword(data.password),
                publicId: v4()
            })
            em.flush();
            return new Response("success");
        }
        catch{
            return error(400, "Username, email or password is invalid");
        }
    }

    return error(400, "Username, email or password is invalid");
}

function validatePassword(password: string) {
    if (password.length <= 20) return true;
}

function validateUsername(username: string) {
    if (username.length <= 20) return true;
}

function validateEmail(email: string) {
    if (email.length <= 320) return true;
}

async function hashPassword(password: string) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds)
    return hash;
}