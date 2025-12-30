/**
 * OAuth service - handles account creation and linking
 */

import { db } from '$lib/server/db';
import { users, oauthAccounts, sessions } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from '$lib/utils/id';

export type OAuthProvider = 'google' | 'github';

export interface OAuthUserData {
	provider: OAuthProvider;
	providerAccountId: string;
	email: string;
	name?: string;
	avatarUrl?: string;
	locale?: string;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: Date;
}

/**
 * Find existing OAuth account
 */
export async function findOAuthAccount(provider: OAuthProvider, providerAccountId: string) {
	const [account] = await db
		.select()
		.from(oauthAccounts)
		.where(
			and(
				eq(oauthAccounts.provider, provider),
				eq(oauthAccounts.providerAccountId, providerAccountId)
			)
		)
		.limit(1);

	return account || null;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
	const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
	return user || null;
}

/**
 * Create or link OAuth account
 * - If OAuth account exists, return existing user
 * - If user with email exists, link OAuth account
 * - Otherwise, create new user with OAuth account
 */
export async function createOrLinkOAuthAccount(data: OAuthUserData): Promise<{
	userId: string;
	isNewUser: boolean;
	isLinked: boolean;
}> {
	// Check if OAuth account already exists
	const existingAccount = await findOAuthAccount(data.provider, data.providerAccountId);
	if (existingAccount) {
		// Update tokens if provided
		if (data.accessToken) {
			await db
				.update(oauthAccounts)
				.set({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					expiresAt: data.expiresAt
				})
				.where(eq(oauthAccounts.id, existingAccount.id));
		}
		return { userId: existingAccount.userId, isNewUser: false, isLinked: false };
	}

	// Check if user with email exists
	const existingUser = await findUserByEmail(data.email);
	if (existingUser) {
		// Link OAuth account to existing user
		await db.insert(oauthAccounts).values({
			id: generateId(),
			userId: existingUser.id,
			provider: data.provider,
			providerAccountId: data.providerAccountId,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			expiresAt: data.expiresAt
		});
		return { userId: existingUser.id, isNewUser: false, isLinked: true };
	}

	// Create new user with OAuth account
	const userId = generateId();
	await db.insert(users).values({
		id: userId,
		email: data.email,
		passwordHash: '', // OAuth users don't have password
		name: data.name,
		avatarUrl: data.avatarUrl,
		emailVerified: true, // OAuth emails are verified
		locale: data.locale || 'en'
	});

	await db.insert(oauthAccounts).values({
		id: generateId(),
		userId,
		provider: data.provider,
		providerAccountId: data.providerAccountId,
		accessToken: data.accessToken,
		refreshToken: data.refreshToken,
		expiresAt: data.expiresAt
	});

	return { userId, isNewUser: true, isLinked: false };
}

/**
 * Create session for user
 */
export async function createSession(
	userId: string,
	userAgent?: string,
	ipAddress?: string
): Promise<string> {
	const sessionId = generateId();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

	await db.insert(sessions).values({
		id: sessionId,
		userId,
		expiresAt,
		userAgent,
		ipAddress
	});

	return sessionId;
}

/**
 * Get user's linked OAuth accounts
 */
export async function getUserOAuthAccounts(userId: string) {
	return db.select().from(oauthAccounts).where(eq(oauthAccounts.userId, userId));
}

/**
 * Unlink OAuth account from user
 */
export async function unlinkOAuthAccount(userId: string, provider: OAuthProvider): Promise<boolean> {
	const result = await db
		.delete(oauthAccounts)
		.where(and(eq(oauthAccounts.userId, userId), eq(oauthAccounts.provider, provider)))
		.returning();

	return result.length > 0;
}

// Re-export providers
export * from './google';
export * from './github';
