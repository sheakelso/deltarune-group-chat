import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals}) => {
    return {
        loggedIn: locals.user != undefined,
        userInfo: locals.user?.info()
    }
};