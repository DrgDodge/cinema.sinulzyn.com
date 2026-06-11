import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, { email, missing: true });
        }

        try {
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (e) {
            return fail(400, { email, incorrect: true });
        }

        throw redirect(303, '/scan');
    }
};