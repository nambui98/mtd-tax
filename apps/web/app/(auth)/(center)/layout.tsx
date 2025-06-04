export default async function CenteredLayout(props: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50 text-gray-700 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] flex min-h-screen items-center justify-center">
            {props.children}
        </div>
    );
}
