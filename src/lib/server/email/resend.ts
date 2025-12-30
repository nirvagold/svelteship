/**
 * Resend email provider implementation
 * @see https://resend.com/docs
 */

import type { EmailOptions, EmailResult, EmailProvider } from './index';

interface ResendConfig {
	apiKey: string;
	from: string;
}

interface ResendEmailPayload {
	from: string;
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
}

interface ResendResponse {
	id?: string;
	error?: {
		message: string;
		name: string;
	};
}

export function createResendProvider(config: ResendConfig): EmailProvider {
	const { apiKey, from } = config;

	return {
		name: 'resend',

		async send(options: EmailOptions): Promise<EmailResult> {
			const payload: ResendEmailPayload = {
				from,
				to: options.to,
				subject: options.subject,
				html: options.html,
				text: options.text
			};

			try {
				const response = await fetch('https://api.resend.com/emails', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${apiKey}`
					},
					body: JSON.stringify(payload)
				});

				const data = (await response.json()) as ResendResponse;

				if (!response.ok) {
					return {
						success: false,
						error: data.error?.message || `HTTP ${response.status}: ${response.statusText}`
					};
				}

				return {
					success: true,
					messageId: data.id
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unknown error';
				return {
					success: false,
					error: message
				};
			}
		}
	};
}
