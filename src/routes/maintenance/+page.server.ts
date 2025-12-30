import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// These values could come from environment variables or a config file
	return {
		estimatedReturn: null, // e.g., "December 31, 2024 at 10:00 AM UTC"
		contactEmail: 'support@example.com'
	};
};
