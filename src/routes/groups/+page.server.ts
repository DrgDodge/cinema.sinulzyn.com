import { error, redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { Actions } from './$types';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) throw redirect(303, '/login');

        const data = await request.formData();
        const name = data.get('name') as string;

        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);

        try {
            const adminEmail = process.env.PB_ADMIN_EMAIL;
            const adminPassword = process.env.PB_ADMIN_PASSWORD;
            
            if (adminEmail && adminPassword) {
                 await adminPb.admins.authWithPassword(adminEmail, adminPassword);
            } else {
                 return fail(500, { error: 'Server misconfiguration: Admin credentials missing.' });
            }

            // Ensure groups collection exists
            try {
                await adminPb.collections.getOne('groups');
            } catch (e) {
                await adminPb.collections.create({
                    name: 'groups',
                    type: 'base',
                    listRule: '',
                    viewRule: '',
                    createRule: null,
                    updateRule: null,
                    deleteRule: null,
                    fields: [
                        { name: 'name', type: 'text' },
                        { name: 'userId', type: 'text' }
                    ]
                });
            }

            const record = await adminPb.collection('groups').create({
                name,
                userId: locals.user.id
            });

            throw redirect(303, '/groups/' + record.id);
        } catch (e: any) {
            if (e?.status === 303) throw e;
            console.error('Group Create error:', e);
            return fail(500, { error: 'Failed to create group.' });
        } finally {
            adminPb.authStore.clear();
        }
    }
};