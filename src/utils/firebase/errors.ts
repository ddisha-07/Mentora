export function formatAuthError(err: any): string {
  if (!err) return 'An unexpected error occurred.';

  const code = err.code || '';
  const msg = err.message || '';

  if (code === 'auth/configuration-not-found' || msg.includes('auth/configuration-not-found') || msg.includes('CONFIGURATION_NOT_FOUND')) {
    return "Firebase Authentication is not enabled in your Firebase project. In your Firebase Console (mentora-932c5), navigate to 'Build' > 'Authentication', click 'Get started', and enable 'Email/Password' under the 'Sign-in method' tab.";
  }

  if (code === 'auth/operation-not-allowed' || msg.includes('auth/operation-not-allowed')) {
    return "This sign-in method is disabled. Please enable 'Email/Password' or 'Google' in Firebase Console > Authentication > Sign-in method.";
  }

  if (code === 'auth/unauthorized-domain' || msg.includes('auth/unauthorized-domain')) {
    return "This domain (localhost) is not authorized for OAuth. Add 'localhost' in Firebase Console > Authentication > Settings > Authorized domains.";
  }

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' || msg.includes('invalid-credential')) {
    return "Invalid email or password. Please verify your credentials or create an account if you haven't registered yet.";
  }

  if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (code === 'auth/weak-password' || msg.includes('weak-password')) {
    return "Password is too weak. Please use at least 6 characters.";
  }

  if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
    return "Sign-in popup was closed before completing authentication.";
  }

  return msg || 'Authentication failed. Please try again.';
}
