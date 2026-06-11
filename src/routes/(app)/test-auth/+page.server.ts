import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // If we have a user in locals, auth is working!
    const authStatus = {
        isAuthenticated: !!locals.user,
        user: locals.user ? {
            id: locals.user.id,
            email: locals.user.email
        } : null,
        cookieExists: true // If we got here, hooks.server.ts ran
    };

    return { authStatus };
};