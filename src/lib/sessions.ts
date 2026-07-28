import { v4 } from "uuid";
import { orm } from "./db";
import { Session, SessionSchema } from "./entities/session.entity";
import { User } from "./entities/user.entity";

export function createSession(user: User){
    let em = orm.em.fork();
    let session = em.create(Session, {
        id: v4(),
        user: user
    });
    em.flush();
    return session.id;
}

export async function getSessionUser(sid: string){
    let em = orm.em.fork();
    let session = await em.findOne(Session, {id: sid});
    let user = await em.findOne(User, {id: session?.user.id});
    return session?.user;
}