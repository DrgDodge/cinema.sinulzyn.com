import { fail, redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
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

        // Initialize a temporary Admin client to bypass API rules safely
        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        console.log(`[Auth] Attempting login/register at: ${pbUrl}`);
        const adminPb = new PocketBase(pbUrl);
        
        try {
            // Authenticate as Admin using environment variables
            const adminEmail = process.env.PB_ADMIN_EMAIL;
            const adminPassword = process.env.PB_ADMIN_PASSWORD;

            if (!adminEmail || !adminPassword) {
                console.error("Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD environment variables.");
                return fail(500, { action: 'register', error: true, message: 'Server misconfiguration: Admin credentials missing.' });
            }

            await adminPb.admins.authWithPassword(adminEmail, adminPassword);

            // Create the user using the Admin client (bypasses the locked "Create" API rule)
            await adminPb.collection('users').create({
                email,
                password,
                passwordConfirm
            });
            
            // Log the new user into the client's actual session
            await locals.pb.collection('users').authWithPassword(email, password);

        } catch (e: any) {
            console.error('Registration error:', e);
            return fail(400, { action: 'register', error: true, message: e?.response?.message || 'Failed to register account.' });
        } finally {
            // Ensure we clear the admin session
            adminPb.authStore.clear();
        }

        throw redirect(303, '/scan');
    }
};