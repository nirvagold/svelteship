/**
 * Email service for sending transactional emails
 * In development mode, emails are logged to console
 * In production, implement with your preferred provider (Resend, SendGrid, AWS SES, etc.)
 */

import { dev } from '$app/environment';

export interface EmailService {
	sendPasswordReset(email: string, resetUrl: string): Promise<void>;
	sendEmailVerification(email: string, verifyUrl: string): Promise<void>;
	sendAccountDeleted(email: string): Promise<void>;
	sendWelcome(email: string, name: string | null): Promise<void>;
}

/**
 * Development email service - logs to console
 */
class DevEmailService implements EmailService {
	async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
		console.log('📧 [DEV EMAIL] Password Reset');
		console.log(`   To: ${email}`);
		console.log(`   Reset URL: ${resetUrl}`);
		console.log('');
	}

	async sendEmailVerification(email: string, verifyUrl: string): Promise<void> {
		console.log('📧 [DEV EMAIL] Email Verification');
		console.log(`   To: ${email}`);
		console.log(`   Verify URL: ${verifyUrl}`);
		console.log('');
	}

	async sendAccountDeleted(email: string): Promise<void> {
		console.log('📧 [DEV EMAIL] Account Deleted');
		console.log(`   To: ${email}`);
		console.log('   Your account has been successfully deleted.');
		console.log('');
	}

	async sendWelcome(email: string, name: string | null): Promise<void> {
		console.log('📧 [DEV EMAIL] Welcome');
		console.log(`   To: ${email}`);
		console.log(`   Welcome ${name || 'there'}! Thanks for signing up.`);
		console.log('');
	}
}

/**
 * Production email service stub
 * Replace with your preferred email provider
 */
class ProductionEmailService implements EmailService {
	async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
		// TODO: Implement with your email provider
		// Example with Resend:
		// await resend.emails.send({
		//   from: 'noreply@yourdomain.com',
		//   to: email,
		//   subject: 'Reset your password',
		//   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
		// });
		console.warn(`[EMAIL] Would send password reset to ${email}: ${resetUrl}`);
	}

	async sendEmailVerification(email: string, verifyUrl: string): Promise<void> {
		// TODO: Implement with your email provider
		console.warn(`[EMAIL] Would send verification to ${email}: ${verifyUrl}`);
	}

	async sendAccountDeleted(email: string): Promise<void> {
		// TODO: Implement with your email provider
		console.warn(`[EMAIL] Would send deletion confirmation to ${email}`);
	}

	async sendWelcome(email: string, name: string | null): Promise<void> {
		// TODO: Implement with your email provider
		console.warn(`[EMAIL] Would send welcome email to ${email} (${name})`);
	}
}

// Export the appropriate service based on environment
export const emailService: EmailService = dev ? new DevEmailService() : new ProductionEmailService();

// Helper functions for common email operations
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
	const baseUrl = dev ? 'http://localhost:5173' : process.env.PUBLIC_BASE_URL || '';
	const resetUrl = `${baseUrl}/reset-password?token=${token}`;
	await emailService.sendPasswordReset(email, resetUrl);
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
	const baseUrl = dev ? 'http://localhost:5173' : process.env.PUBLIC_BASE_URL || '';
	const verifyUrl = `${baseUrl}/verify-email?token=${token}`;
	await emailService.sendEmailVerification(email, verifyUrl);
}

export async function sendAccountDeletedEmail(email: string): Promise<void> {
	await emailService.sendAccountDeleted(email);
}

export async function sendWelcomeEmail(email: string, name: string | null): Promise<void> {
	await emailService.sendWelcome(email, name);
}
