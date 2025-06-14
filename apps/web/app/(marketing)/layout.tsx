import React from 'react';

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <div className="bg-white text-gray-700 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            {children}
        </div>
    );
}
