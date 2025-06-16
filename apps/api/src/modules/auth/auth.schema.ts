import { z } from 'zod';

// export const signupSchema = z.object({
//     user: z
//         .object({
//             email: z.string().email(),
//             firstName: z.string().min(1),
//             lastName: z.string().min(1),
//             password: z.string().min(8),
//             confirmPassword: z.string(),
//             phoneNumber: z.string().optional(),
//             jobTitle: z.string().optional(),
//             practiceType: z
//                 .enum([
//                     'accountancy_practice',
//                     'bookkeeping_service',
//                     'tax_advisory_firm',
//                 ])
//                 .optional(),
//         })
//         .refine((data) => data.password === data.confirmPassword, {
//             message: "Passwords don't match",
//             path: ['confirmPassword'],
//         }),
//     company: z
//         .object({
//             name: z.string().min(1),
//             companyNumber: z.string().optional(),
//             vatNumber: z.string().optional(),
//             addressLine1: z.string().min(1),
//             addressLine2: z.string().optional(),
//             city: z.string().min(1),
//             postcode: z.string().min(1),
//             phoneNumber: z.string().optional(),
//         })
//         .optional(),
// });

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export const refreshTokensSchema = z.object({
    refreshToken: z.string().min(1),
});
