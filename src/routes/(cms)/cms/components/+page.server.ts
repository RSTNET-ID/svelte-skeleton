import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { backendApi } from '#lib/server/backend-api.ts';
import { ApiError } from '#lib/api/error.ts';

type User = { id: string; permissions?: string[] };

export const load: PageServerLoad = async (event) => {
	let user: User;
	try {
		user = await backendApi<User>(event, { path: '/auth/me' });
	} catch (cause) {
		if (cause instanceof ApiError && [401, 403].includes(cause.status)) error(403, 'Access denied');
		throw cause;
	}
	if (!user?.id || !user.permissions?.includes('cms.components.read')) error(403, 'Access denied');
	return {};
};
