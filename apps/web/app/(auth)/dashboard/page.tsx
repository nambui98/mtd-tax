'use client';
import { Button } from '@workspace/ui/components/button';
import { signOut } from 'next-auth/react';
import React from 'react';

type Props = {};

export default function DashboardPage({}: Props) {
    return (
        <div>
            Dashboard
            <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
    );
}
