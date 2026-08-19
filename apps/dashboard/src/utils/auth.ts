declare namespace Clerk {
  export const session: {
    getToken: () => Promise<string | null>;
  };
}

export async function getToken(): Promise<string> {
  if (typeof Clerk !== 'undefined' && Clerk.session) {
    return (await Clerk.session.getToken()) || '';
  }
  return localStorage.getItem('better-auth-session-token') || '';
}
