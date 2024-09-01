'use client';

import { useSession } from "@/lib/session";
import { useTheme } from "next-themes";
import { BiSolidMoon, BiSolidSun } from "react-icons/bi";

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const { isAuthed } = useSession();

    return <div className="btn" onClick={(e) => {
        if (e.shiftKey) window.location.href = isAuthed ? '/dashboard' : '/login'
        else setTheme(theme === "dark" ? "light" : "dark")
    }}>
        {theme === "dark" ? <BiSolidSun /> : <BiSolidMoon />}
    </div>
}