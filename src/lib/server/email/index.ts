/**
 * Email service with template support and multiple providers
 */

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createResendProvider } from './resend';

// Import templates as raw strings
import verificationTemplate from './templates/verification.html?raw';
import resetPasswordTemplate from './templates/reset-password.html?raw';
import welcomeTemplate from './templates/welcome.html?raw';

export interface EmailOptions {
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
	template?: 'verification' | 'reset-password' | 'welcome';
	data?: Record<string, string>;
}

export interface EmailResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

export interface EmailProvider {
	name: string;
	send(options: EmailOptions): Promise<EmailResult>;
}

// Template registry
const templates: Record<string, string> = {
	verification: verificationTemplate,
	'reset-password': resetPasswordTemplate,
	welcome: welcomeTemplate
};

/**
 * Substitute variables in template
 * Variables are in format {variableName}
 */
export function substituteVariables(template: string, data: Record<string, string>): string {
	let result = template;
	for (const [key, value] of Object.entries(data)) {
		const regex = new RegExp(`\\{${key}\\}`, 'g');
		result = result.replace(regex, value);
	}
	return result;
}

/**
 * Console email provider for development
 */
function createConsoleProvider(): EmailProvider {
	return {
		name: 'console',
		async send(options: EmailOptions): Promise<EmailResult> {
			console.log('📧 [DEV EMAIL]');
			console.log(`   To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
			console.log(`   Subject: ${options.subject}`);
			if (options.template) {
				console.log(`   Template: ${options.template}`);
			}
			if (options.data) {
				console.log(`   Data: ${JSON.stringify(options.data)}`);
			}
			if (options.html) {
				// Extract text content from HTML for console display
				const textContent = options.html
					.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
					.replace(/<[^>]+>/g, ' ')
					.replace(/\s+/g, ' ')
					.trim()
					.slice(0, 200);
				console.log(`   Preview: ${textContent}...`);
			}
			console.log('');
			return { success: true, messageId: `dev-${Date.now()}` };
		}
	};
}

/**
 * Create email service with configured provider
 */
export function createEmailService(config?: {
	provider?: 'resend' | 'console';
	apiKey?: string;
	from?: string;
}): EmailService {
	const provider = config?.provider || (env.RESEND_API_KEY ? 'resend' : 'console');
	const apiKey = config?.apiKey || env.RESEND_API_KEY;
	const from = config?.from || env.EMAIL_FROM || 'noreply@example.com';

	let emailProvider: EmailProvider;

	if (provider === 'resend' && apiKey) {
		emailProvider = createResendProvider({ apiKey, from });
	} else {
		emailProvider = createConsoleProvider();
	}

	return new EmailServiceImpl(emailProvider);
}

export interface EmailService {
	send(options: EmailOptions): Promise<EmailResult>;
	sendVerification(email: string, name: string, link: string): Promise<EmailResult>;
	sendPasswordReset(email: string, name: string, link: string): Promise<EmailResult>;
	sendWelcome(email: string, name: string, link: string): Promise<EmailResult>;
}

class EmailServiceImpl implements EmailService {
	constructor(private provider: EmailProvider) {}

	async send(options: EmailOptions): Promise<EmailResult> {
		let html = options.html;

		// If template is specified, use it
		if (options.template && templates[options.template]) {
			html = templates[options.template];
			if (options.data) {
				html = substituteVariables(html, options.data);
			}
		}

		try {
			const result = await this.provider.send({
				...options,
				html
			});

			if (!result.success) {
				console.error(`[EMAIL] Failed to send: ${result.error}`);
			}

			return result;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			console.error(`[EMAIL] Error: ${message}`);
			return { success: false, error: message };
		}
	}

	async sendVerification(email: string, name: string, link: string): Promise<EmailResult> {
		return this.send({
			to: email,
			subject: 'Verify Your Email Address',
			template: 'verification',
			data: { name: name || 'there', link }
		});
	}

	async sendPasswordReset(email: string, name: string, link: string): Promise<EmailResult> {
		return this.send({
			to: email,
			subject: 'Reset Your Password',
			template: 'reset-password',
			data: { name: name || 'there', link }
		});
	}

	async sendWelcome(email: string, name: string, link: string): Promise<EmailResult> {
		return this.send({
			to: email,
			subject: 'Welcome to Svelteship! 🎉',
			template: 'welcome',
			data: { name: name || 'there', link }
		});
	}
}

// Default email service instance
export const emailService = createEmailService();

// Legacy helper functions for backward compatibility
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
	const baseUrl = dev ? 'http://localhost:5173' : env.PUBLIC_BASE_URL || '';
	const resetUrl = `${baseUrl}/reset-password?token=${token}`;
	await emailService.sendPasswordReset(email, '', resetUrl);
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
	const baseUrl = dev ? 'http://localhost:5173' : env.PUBLIC_BASE_URL || '';
	const verifyUrl = `${baseUrl}/verify-email?token=${token}`;
	await emailService.sendVerification(email, '', verifyUrl);
}

export async function sendWelcomeEmail(email: string, name: string | null): Promise<void> {
	const baseUrl = dev ? 'http://localhost:5173' : env.PUBLIC_BASE_URL || '';
	const dashboardUrl = `${baseUrl}/dashboard`;
	await emailService.sendWelcome(email, name || '', dashboardUrl);
}

export async function sendAccountDeletedEmail(email: string): Promise<void> {
	await emailService.send({
		to: email,
		subject: 'Account Deleted',
		html: '<p>Your account has been successfully deleted. We\'re sorry to see you go!</p>'
	});
}
