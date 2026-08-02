import { v4 } from "uuid";
import { orm, transporter } from "./db";
import { Session, SessionSchema } from "./entities/session.entity";
import { User } from "./entities/user.entity";
import { EmailVerificationAttempt } from "./entities/verification.entity";

export function createSession(user: User) {
    let em = orm.em.fork();
    let session = em.create(Session, {
        id: v4(),
        user: user
    });
    em.flush();
    return session.id;
}

export async function getSessionUser(sid: string) {
    let em = orm.em.fork();
    let session = await em.findOne(Session, { id: sid }, { populate: ["user"] });
    console.log(session);
    console.log(session?.user);
    console.log("HELP")
    return session?.user;
}

export async function sendEmail(link: string, email: string) {
    try{
        const info = await transporter.sendMail({
            from: '"Deltarune Group Chat" <noreply@deltarunegroupchat.com>',
            to: email,
            subject: "Verify your email for Deltarune Group Chat",
            text: "Click the link to verify your email: " + link
        })
    } catch{
        console.error("Failed to send email")
    }
}