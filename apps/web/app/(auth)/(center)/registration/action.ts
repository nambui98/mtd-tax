'use server';

import { Env } from '@/lib/env';
import {
    InsertCompany,
    InsertHMRC,
    InsertUser,
} from '@workspace/database/dist/schema';

export async function signup(data: {
    user: InsertUser & InsertHMRC;
    company: InsertCompany;
}) {
    console.log(data);
    console.log(Env.NEXT_PUBLIC_BACKEND_API_URL);
    const response = await fetch(
        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signup`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    const result = await response.json();
    return result;
}

export async function verifyEmail(data: { otp: string; email: string }) {
    console.log(data);
    const response = await fetch(
        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-email`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    const result = await response.json();
    return result;
}

export async function signInWithPassword(data: {
    email: string;
    password: string;
}) {
    console.log(data);
    const response = await fetch(
        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signin-with-password`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    const result = await response.json();
    return result;
}
