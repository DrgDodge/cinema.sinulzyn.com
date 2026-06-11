import { fail, redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { Actions } from './$types';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || !locals.user.id) {
            throw redirect(303, '/login');
        }

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

            // Ensure groups collection exists with the isPublic field
            try {
                const collection = await adminPb.collections.getOne('groups');
                // Check if isPublic field exists, if not, add it
                const hasPublicField = collection.fields?.find(f => f.name === 'isPublic') || 
                                     collection.schema?.find(f => f.name === 'isPublic');
                
                if (!hasPublicField) {
                    console.log("[Groups] Adding missing isPublic field to existing collection...");
                    await adminPb.collections.update('groups', {
                        'fields+': [{ name: 'isPublic', type: 'bool' }]
                    });
                }
            } catch (e) {
                console.log("[Groups] Creating groups collection...");
                await adminPb.collections.create({
                    name: 'groups',
                    type: 'base',
                    listRule: '', 
                    viewRule: '',
                    createRule: null,
                    updateRule: null,
                    deleteRule: null,
                    fields: [
                        { name: 'name', type: 'text', required: true },
                        { name: 'userId', type: 'text', required: true },
                        { name: 'isPublic', type: 'bool' }
                    ]
                });
            }

            const record = await adminPb.collection('groups').create({
                name,
                userId: locals.user.id,
                isPublic: false 
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