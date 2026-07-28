import jwt from "jsonwebtoken";
import { orm } from "./db";
import { UserSchema } from "./entities/user.entity";

export function generateJwtToken(sub: string, lastsSeconds: number) {
    let payload = {
        sub: sub,
        iss: "DeltaruneGroupChat",
        aud: "DeltaruneGroupChat",
    }

    return jwt.sign(payload, "anawesomedopeasssecret", {
        expiresIn: "10m"
    });
}

export async function verifyJwtToken(token: string) {
    try {
        let claims = jwt.verify(token, "anawesomedopeasssecret");
        if (claims?.sub !== undefined) {
            const sub: string = typeof claims.sub === "function" ? claims.sub() : claims.sub;
            let em = orm.em.fork();

            return await em.findOne(UserSchema, { publicId: sub });
        }
    }
    catch {
        return undefined;
    }
}