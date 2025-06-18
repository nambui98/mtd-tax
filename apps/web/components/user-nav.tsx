'use client';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const maskEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username && username.length <= 4) return email;
    return `${username?.slice(0, 2)}...${username?.slice(-2)}@${domain}`;
};

export function UserNav({ session }: { session: Session }) {
    const displayName =
        `${session?.user?.firstName} ${session?.user?.lastName}` ||
        (session?.user?.email || '').split('@')[0];

    // Handle logout
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="outline-none focus:outline-none focus:right-0 focus-visible:ring-0 relative h-9 w-9 rounded-full p-0"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={session?.user?.image ?? ''} />
                        <AvatarFallback className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold cursor-pointer">
                            {session?.user?.firstName?.charAt(0) || ''}
                            {session?.user?.lastName?.charAt(0) || ''}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {displayName}
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="text-xs leading-none text-muted-foreground dark:text-dark-text-secondary">
                                {maskEmail(session?.user?.email || '')}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/create-account">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
