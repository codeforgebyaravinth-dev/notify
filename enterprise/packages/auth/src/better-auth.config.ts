import { betterAuth } from 'better-auth';
import { organization, twoFactor } from 'better-auth/plugins';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/novu';
const client = new MongoClient(mongoUrl);
client.connect().catch(console.error);

const db = client.db();

export const auth: any = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.API_ROOT_URL ? `${process.env.API_ROOT_URL}/v1/better-auth` : 'http://localhost:3000/v1/better-auth',
  trustedOrigins: [process.env.FRONT_BASE_URL || 'http://127.0.0.1:4201', 'http://localhost:4201', 'http://localhost:4200'],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  plugins: [
    organization(),
    twoFactor(),
  ],
  advanced: {
    useSessionToken: true,
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
});
