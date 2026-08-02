import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { orm } from "../../../lib/db";
import { User, UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "$lib/tokens";
import { createSession, sendEmail } from "$lib/sessions";
import { verifyTurnstileToken } from "$lib/turnstile";
import { EmailVerificationAttempt } from "$lib/entities/verification.entity";
import { v4 } from "uuid";


export async function POST(event: RequestEvent) {
    let data = await event.request.json();

    if (!data.email || !data.password) {
        return error(400, { message: "Must provide email and password" });
    }

    if (!data.token) {
        return error(400, { message: "No turnstile token" });
    }

    let turnstile = await verifyTurnstileToken(data.token);
    if(!turnstile) return error(400, { message: "Turnstile failed" });

    let em = orm.em.fork();
    const user = await em.findOne(User, { email: data.email });

    if(user?.emailVerificationStatus != "Verified") {
        let verification = await em.findOne(EmailVerificationAttempt, { user: user }, {populate: ["user"]});
        if(verification == undefined) {
            let token = v4();
            verification = await em.create(EmailVerificationAttempt, {
                user: user,
                token: token
            })
            await em.flush();
        }
        await sendEmail("http://deltarunegroupchat.com/verify?token=" + verification?.token + "&publicId=" + verification?.user.publicId, data.email);
        return error(400, { message: "Email not verified. A new verification email has been sent." });
    }

    if (user == undefined) return error(401, { message: "Incorrect email or password" });

    let match = await bcrypt.compare(data.password, user.passwordHash);

    if (match) {
        let sid = createSession(user);
        return json({ success: true }, {
            headers: {
                'Set-Cookie': 'sid=' + sid + '; Path=/'
            }
        })
    }
    else return error(400, { message: "Incorrect email or password" });
}