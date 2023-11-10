import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const nextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        //Check emails exists
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        if (existingUser) {
          //User already exists, do nothing or update some fields
          console.log("User already exists:", existingUser)
        } 
        else {
          //User does not exist, create a new user with the profile data
          const newUser = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.image,
              },
            })
            console.log("User created:", newUser)
          }
        }
      return profile
    }
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/home"
  },
  session: {
    strategy: "jwt",
    maxAge: 86400, //1 day
    updateAge: 3600, //1 hour
  }
}

export default NextAuth(nextAuthOptions)