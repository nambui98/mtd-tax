import { Button } from '@workspace/ui/components/button';
import { User } from '@workspace/database';

export default async function Page() {
    const data = await fetch('http://localhost:8000/api/v1/users');
    const json = await data.json();
    const users: User[] = json.data;
    console.log('====================================');
    console.log(json.data);
    console.log('====================================');
    return (
        <div className="flex items-center justify-center min-h-svh">
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Hello World</h1>
                {users.map((a) => (
                    <p key={a.id} className="text-white">
                        {a.email}
                    </p>
                ))}

                <Button size="sm">Button</Button>
            </div>
        </div>
    );
}
