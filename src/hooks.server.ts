import { type Handle } from "@sveltejs/kit";
import type { RequestEvent } from "./routes/api/$types";
import { verifyJwtToken } from "$lib/tokens";
import { orm } from "./lib/db";
import { User, UserSchema } from "$lib/entities/user.entity";
import { Server } from "socket.io";
import { createSession, getSessionUser } from "$lib/sessions";

export const handle: Handle = async ({event, resolve}) => {
    const sid = event.cookies.get('sid');

    if(sid != undefined){
        console.log(sid);
        const user = await getSessionUser(sid);
        if(user != undefined) event.locals.user = user;
    }

    return resolve(event);
};