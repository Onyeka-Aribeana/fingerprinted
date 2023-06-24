import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const res = await fetch(
          "https://fingerprinted1.000webhostapp.com/api/admin/login.php",
          {
            mode: "no-cors",
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );

        const user = await res.json();
        //const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user && user["error"]) {
          throw new Error(user["error"]);
        } else if (user && !user["error"]) {
          return user;
        }
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages: {
    signIn: "/auth/signIn",
  },
  callbacks: {
    jwt(params) {
      if (params.user?.role) {
        params.token.role = params.user.role;
      }
      return params.token;
    },
  },
});
