import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    login: async ({ request, locals }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, { action: 'login', missing: true });
        }

        try {
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (e: any) {
            console.error('Login error:', e);
            return fail(400, { action: 'login', incorrect: true });
        }

        throw redirect(303, '/scan');
    },

    register: async ({ request, locals }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const passwordConfirm = data.get('passwordConfirm') as string;

        if (!email || !password || !passwordConfirm) {
            return fail(400, { action: 'register', missing: true });
        }

        if (password !== passwordConfirm) {
            return fail(400, { action: 'register', mismatch: true });
        }

        try {
            // Create the user
            await locals.pb.collection('users').create({
                email,
                password,
                passwordConfirm
            });
            
            // Automatically log them in after creation
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (e: any) {
            console.error('Registration error:', e);
            return fail(400, { action: 'register', error: true, message: e?.response?.message || 'Failed to register account.' });
        }

        throw redirect(303, '/scan');
    }
};