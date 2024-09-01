'use client';

import { CSSProperties, ReactNode } from "react";

export default function Button({ children, onClick, style, className }: {
    children: ReactNode,
    onClick: () => void;
    style?: CSSProperties,
    className?: string;
}) {
    return <div className={"btn " + className} style={style} onClick={onClick}>
        {children}
    </div>
}