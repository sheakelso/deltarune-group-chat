import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { orm } from "../../../lib/db";
import { User, UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "$lib/tokens";
import { createSession } from "$lib/sessions";


export async function POST(event: RequestEvent){
    let data = await event.request.json();
    
    if(!data.email || !data.password){
        return error(400, "Email and password required");
    }

    let em = orm.em.fork();
    const user = await em.findOne(User, { email: data.email });

    if(user == undefined) return error(401, "Incorrect email or password");
    
    let match = await bcrypt.compare(data.password, user.passwordHash);

    if(match) {
        let sid = createSession(user);
        return json({success: true}, {
            headers: {
                'Set-Cookie': 'sid=' + sid + '; Path=/'
            }
        })
    }
    else return error(400, "Incorrect email or password");
}