import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals, cookies}) => {
    return {
        loggedIn: locals.user != undefined,
        userInfo: locals.user?.info(),
        sid: cookies.get("sid")
    }
};