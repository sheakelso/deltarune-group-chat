import { error, json, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { orm, transporter } from "../../../lib/db";
import { User, UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import { UuidType } from "@mikro-orm/core";
import { v4 } from "uuid";
import { verifyTurnstileToken } from "$lib/turnstile";
import nodemailer from "nodemailer";
import { sendEmail } from "$lib/sessions";
import { EmailVerificationAttempt } from "$lib/entities/verification.entity";

export async function POST(event: RequestEvent) {
    let data = await event.request.json();

    if (!data.username || !data.password || !data.email) {
        return error(400, { message: "Must provide username, email and password" });
    }

    if (!data.token) {
        return error(400, { message: "No turnstile token" });
    }

    let turnstile = await verifyTurnstileToken(data.token);
    if (!turnstile) return error(400, { message: "Turnstile failed" });

    if (validateEmail(data.email) && validatePassword(data.password) && validateUsername(data.username)) {
        try {
            let em = orm.em.fork();
            let user = await em.create(User, {
                username: data.username,
                email: data.email,
                passwordHash: await hashPassword(data.password),
                publicId: v4()
            });

            let token = v4();

            await em.create(EmailVerificationAttempt, {
                user: user,
                token: token
            })
            await em.flush();

            let verificationLink = "http://deltarunegroupchat.com/verify?token=" + token + "&publicId=" + user.publicId;
            await sendEmail(verificationLink, data.email);

            return json({ message: "Account created successfully. \nPlease check your email to verify your account." });
        }
        catch {
            return error(400, { message: "Username, email or password is invalid" });
        }
    }

    return error(400, { message: "Username, email or password is invalid" });
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