'use client';

import { useState } from "react";
import Button from "./Button";
import { MdAdd } from "react-icons/md";
import {motion} from 'framer-motion';

export default function List({ array }: {
    array: string[]
}) {
    const [shown, setShown] = useState<string[]>([])

    return <div className="flex flex-col">
        <div className="inline-flex flex-wrap">{shown.map(((s, i) => <motion.p initial={{y: 20}} exit={{ y: -20 }} animate={{ y: 0 }}>{s}{i < shown.length - 1 ? ", " : ""}</motion.p>))}</div>
        {shown.length < array.length && <Button onClick={() => {
            if(shown.length < array.length){
                setShown([...shown, shown.length === 0 ? array[0] : array[shown.length]])
            }
        }} style={{ display: 'inline-flex'}}><MdAdd /></Button>}
    </div>
}