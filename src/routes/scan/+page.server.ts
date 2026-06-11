import { fail, redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { Actions } from './$types';

export const actions: Actions = {
    save: async ({ request, locals }) => {
        const data = await request.formData();
        const movie = data.get('movie') as string;
        const date = data.get('date') as string;
        const time = data.get('time') as string;
        const room = data.get('room') as string;
        const row = data.get('row') as string;
        const seat = data.get('seat') as string;
        let qrData = data.get('qrData') as string;
        let qrText = data.get('qrText') as string;

        // Fallbacks if missing
        if (!qrData && qrText) qrData = qrText; 
        if (!qrData) qrData = Math.floor(Math.random() * 9000000000) + 1000000000 + '';
        if (!qrText) qrText = qrData;

        const userId = locals.user?.id;
        if (!userId) return fail(401, { error: 'Please login to save passes.' });

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

            // Ensure collection exists
            try {
                await adminPb.collections.getOne('tickets');
            } catch (e) {
                // Try creating via v0.24+ fields format
                try {
                    await adminPb.collections.create({
                        name: 'tickets',
                        type: 'base',
                        listRule: '', // Anyone with the URL can view it
                        viewRule: '',
                        createRule: null,
                        updateRule: null,
                        deleteRule: null,
                        fields: [
                            { name: 'movie', type: 'text' },
                            { name: 'date', type: 'text' },
                            { name: 'time', type: 'text' },
                            { name: 'room', type: 'text' },
                            { name: 'row', type: 'text' },
                            { name: 'seat', type: 'text' },
                            { name: 'qrData', type: 'text' },
                            { name: 'qrText', type: 'text' },
                            { name: 'userId', type: 'text' }
                        ]
                    });
                } catch (e2) {
                    // Try fallback v0.22 schema format
                    await adminPb.collections.create({
                        name: 'tickets',
                        type: 'base',
                        listRule: '',
                        viewRule: '',
                        createRule: null,
                        updateRule: null,
                        deleteRule: null,
                        schema: [
                            { name: 'movie', type: 'text' },
                            { name: 'date', type: 'text' },
                            { name: 'time', type: 'text' },
                            { name: 'room', type: 'text' },
                            { name: 'row', type: 'text' },
                            { name: 'seat', type: 'text' },
                            { name: 'qrData', type: 'text' },
                            { name: 'qrText', type: 'text' },
                            { name: 'userId', type: 'text' }
                        ]
                    });
                }
            }

            const record = await adminPb.collection('tickets').create({
                movie, date, time, room, row, seat, qrData, qrText, userId
            });

            throw redirect(303, '/passes/' + record.id);
        } catch (e: any) {
            if (e?.status === 303) throw e;
            console.error('Save error:', e);
            return fail(500, { error: e?.response?.message || 'Failed to save pass.' });
        } finally {
            adminPb.authStore.clear();
        }
    }
};