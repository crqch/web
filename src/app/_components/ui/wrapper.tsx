import { ReactNode } from "react";
import Button from "../Button";
import { MdArrowLeft } from "react-icons/md"
import ThemeSwitch from "../ThemeSwitch";

export default function Wrapper({ children, title }: {
    children: ReactNode[] | ReactNode | undefined,
    title: string
}) {
    return <main className={`flex flex-col items-center justify-between p-4 lg:p-24 pt-6`}>
        <div className="border-4 border-foreground" style={{
            padding: 20,
            minWidth: '50%',
            placeSelf: 'center'
        }}>
            <div className="flex flex-row justify-between items-center" style={{ marginTop: -40 }}>
                <div className="flex flex-row items-center">
                    <a href="/" className="btn" style={{ padding: 8, marginRight: -4 }}><MdArrowLeft /></a>
                    <p className="blob">{title}</p>
                </div>
                <ThemeSwitch />
            </div>
            {children}
        </div>
    </main>
}