import { type Handle } from "@sveltejs/kit";
import { getSessionUser } from "$lib/sessions";

export const handle: Handle = async ({event, resolve}) => {
    const sid = event.cookies.get('sid');

    if(sid != undefined){
        console.log(sid);
        const user = await getSessionUser(sid);
        if(user != undefined) event.locals.user = user;
    }

    return resolve(event);
};