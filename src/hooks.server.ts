import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    event.locals.pb = new PocketBase(pbUrl);

    // Load auth state from cookie
    const cookie = event.request.headers.get('cookie') || '';
    event.locals.pb.authStore.loadFromCookie(cookie);

    try {
        // Refresh auth if valid
        if (event.locals.pb.authStore.isValid) {
            await event.locals.pb.collection('users').authRefresh();
        }
    } catch (_) {
        // Clear on error
        event.locals.pb.authStore.clear();
    }

    event.locals.user = event.locals.pb.authStore.model ? structuredClone(event.locals.pb.authStore.model) : null;

    const response = await resolve(event);

    // Send back the updated cookie to the client
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ httpOnly: false }));

    return response;
};