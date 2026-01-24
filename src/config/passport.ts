import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Profile } from "passport-github2";
import { VerifyCallback } from "passport-oauth2";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
      scope: ["user:email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      return done(null, { profile, accessToken });
    },
  ),
);

export default passport;
