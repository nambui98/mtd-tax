import React from 'react';

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    return (
        <div className="bg-gray-50 text-gray-700 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            {children}
        </div>
    );
}
