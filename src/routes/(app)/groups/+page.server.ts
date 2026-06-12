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

            // Ensure groups collection exists with the isPublic and slug fields
            try {
                const collection = await adminPb.collections.getOne('groups');
                let fieldsToAdd = [];
                
                const hasPublicField = collection.fields?.find((f: any) => f.name === 'isPublic') || 
                                     collection.schema?.find((f: any) => f.name === 'isPublic');
                if (!hasPublicField) fieldsToAdd.push({ name: 'isPublic', type: 'bool' });

                const hasSlugField = collection.fields?.find((f: any) => f.name === 'slug') || 
                                     collection.schema?.find((f: any) => f.name === 'slug');
                if (!hasSlugField) fieldsToAdd.push({ name: 'slug', type: 'text' });

                if (fieldsToAdd.length > 0) {
                    console.log("[Groups] Adding missing fields to existing collection...", fieldsToAdd);
                    await adminPb.collections.update('groups', {
                        'fields+': fieldsToAdd
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
                        { name: 'isPublic', type: 'bool' },
                        { name: 'slug', type: 'text' }
                    ]
                });
            }

            const randomSlug = Math.random().toString(36).substring(2, 10);

            const record = await adminPb.collection('groups').create({
                name,
                userId: locals.user.id,
                isPublic: false,
                slug: randomSlug
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