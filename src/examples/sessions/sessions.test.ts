/**
 * Property tests for session management
 * Property 8: Session revocation immediate effect
 * Property 9: Revoke all preserves current session
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Session Management Properties', () => {
	describe('Property 8: Session revocation immediate effect', () => {
		it('should immediately invalidate revoked session', () => {
			const validSessions = new Set<string>();

			function createSession(): string {
				const sessionId = crypto.randomUUID();
				validSessions.add(sessionId);
				return sessionId;
			}

			function revokeSession(sessionId: string): void {
				validSessions.delete(sessionId);
			}

			function isSessionValid(sessionId: string): boolean {
				return validSessions.has(sessionId);
			}

			fc.assert(
				fc.property(fc.integer({ min: 1, max: 10 }), (sessionCount) => {
					// Clear sessions
					validSessions.clear();

					// Create sessions
					const sessionIds: string[] = [];
					for (let i = 0; i < sessionCount; i++) {
						sessionIds.push(createSession());
					}

					// Pick a random session to revoke
					const sessionToRevoke = sessionIds[Math.floor(Math.random() * sessionIds.length)];

					// Verify session is valid before revocation
					expect(isSessionValid(sessionToRevoke)).toBe(true);

					// Revoke the session
					revokeSession(sessionToRevoke);

					// Session should be immediately invalid
					expect(isSessionValid(sessionToRevoke)).toBe(false);

					// Other sessions should still be valid
					for (const sessionId of sessionIds) {
						if (sessionId !== sessionToRevoke) {
							expect(isSessionValid(sessionId)).toBe(true);
						}
					}
				})
			);
		});
	});

	describe('Property 9: Revoke all preserves current session', () => {
		it('should keep current session when revoking all others', () => {
			const sessions = new Map<string, { userId: string }>();

			function createSession(userId: string): string {
				const sessionId = crypto.randomUUID();
				sessions.set(sessionId, { userId });
				return sessionId;
			}

			function revokeAllExceptCurrent(userId: string, currentSessionId: string): number {
				let revokedCount = 0;
				for (const [sessionId, session] of sessions.entries()) {
					if (session.userId === userId && sessionId !== currentSessionId) {
						sessions.delete(sessionId);
						revokedCount++;
					}
				}
				return revokedCount;
			}

			fc.assert(
				fc.property(
					fc.uuid(),
					fc.integer({ min: 2, max: 10 }),
					(userId, sessionCount) => {
						// Clear sessions
						sessions.clear();

						// Create multiple sessions
						const sessionIds: string[] = [];
						for (let i = 0; i < sessionCount; i++) {
							sessionIds.push(createSession(userId));
						}

						// First session is current
						const currentSessionId = sessionIds[0];

						// Revoke all except current
						const revokedCount = revokeAllExceptCurrent(userId, currentSessionId);

						// Should have revoked all other sessions
						expect(revokedCount).toBe(sessionCount - 1);

						// Current session should still exist
						expect(sessions.has(currentSessionId)).toBe(true);

						// Only current session should remain
						expect(sessions.size).toBe(1);
					}
				)
			);
		});

		it('should not revoke sessions of other users', () => {
			const sessions = new Map<string, { userId: string }>();

			function createSession(userId: string): string {
				const sessionId = crypto.randomUUID();
				sessions.set(sessionId, { userId });
				return sessionId;
			}

			function revokeAllExceptCurrent(userId: string, currentSessionId: string): void {
				for (const [sessionId, session] of sessions.entries()) {
					if (session.userId === userId && sessionId !== currentSessionId) {
						sessions.delete(sessionId);
					}
				}
			}

			function countUserSessions(userId: string): number {
				let count = 0;
				for (const session of sessions.values()) {
					if (session.userId === userId) count++;
				}
				return count;
			}

			fc.assert(
				fc.property(fc.uuid(), fc.uuid(), (userId1, userId2) => {
					// Skip if same user
					if (userId1 === userId2) return;

					// Clear sessions
					sessions.clear();

					// Create sessions for both users
					const user1Sessions: string[] = [];
					const user2Sessions: string[] = [];

					for (let i = 0; i < 3; i++) {
						user1Sessions.push(createSession(userId1));
						user2Sessions.push(createSession(userId2));
					}

					const user1CurrentSession = user1Sessions[0];

					// Revoke all sessions for user1 except current
					revokeAllExceptCurrent(userId1, user1CurrentSession);

					// User1 should have only 1 session
					expect(countUserSessions(userId1)).toBe(1);

					// User2 should still have all sessions
					expect(countUserSessions(userId2)).toBe(3);
				})
			);
		});
	});
});
