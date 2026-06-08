import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"Prisma blog" <prisma@gmail.com>', // sender address
                    to: user.email, // list of recipients
                    subject: "Hello", // subject line
                    text: "Hello world?", // plain text body
                    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Verify Your Email</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:10px;padding:40px;">
        <h1 style="text-align:center;">Prisma Blog</h1>

        <h2>Verify Your Email Address</h2>

        <p>
          Thank you for signing up. Please verify your email address by clicking
          the button below.
        </p>

        <div style="text-align:center;margin:30px 0;">
          <a
            href="${verificationUrl}"
            style="
              background:#2563eb;
              color:white;
              text-decoration:none;
              padding:12px 24px;
              border-radius:6px;
              display:inline-block;
            "
          >
            Verify Email
          </a>
        </div>

        <p>If the button doesn't work, copy this link:</p>

        <p>${verificationUrl}</p>
      </div>
    </body>
    </html>
  `, // HTML body
                });
                console.log("email send to user")
            } catch (err) {
                console.error(err)
                throw err;
            }

        },
    },
});