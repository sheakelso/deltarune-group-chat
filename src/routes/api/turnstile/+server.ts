import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { orm } from "../../../lib/db";
import { UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import { UuidType } from "@mikro-orm/core";
import { v4 } from "uuid";
import { response } from "express";

export async function POST(event: RequestEvent) {

    let data = await event.request.json();

    if (!data.token) {
        return error(400, "Must provide turnstile token");
    }

    let result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: JSON.stringify({
            secret: "0x4AAAAAAECZvqgF2D7wcrCeqcK29algTUY",
            response: data.token
        })
    });
}