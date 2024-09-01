"use client";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Post } from "@prisma/client";
import Button from "./Button";
import { useState } from "react";
import MarkdownRenderer from "./ui/markdown";
import { useRouter } from "next/navigation";

export default function PostEdit({ post }: {
    post: {
        author: {
            name: string;
            id: string;
        };
        id: string;
        content: string;
        title: string;
        createdAt: Date;
        authorId: string;
    }
}) {
    const router = useRouter();
    const { isAuthed, user } = useSession();
    const [isediting, setisediting] = useState<boolean>(false);
    const [content, setcontent] = useState<string>(post.content);
    const [ispreviewing, setispreviewing] = useState<boolean>(false);

    const submitEdit = () => {
        api.dashboard.edit.post({
            id: post.id,
            content
        }).then(r => {
            if(!r.error) {
                setisediting(false)
                setispreviewing(false)
                router.refresh()
            }
        })
    }

    const submitDelete = () => {
        api.dashboard.delete.post(post.id).then(r => {
            if(!r.error){
                router.replace("/")
            }
        })
    }

    if(!isAuthed) return null;

    return <div className="outline-dashed mt-8 p-4">
        <p className="-translate-y-8 bg-background w-max outline-dashed px-2">EDIT SPACE</p>
        {user.id === post.authorId ? <div className="flex flex-col gap-y-4">
            {isediting && <>
                {ispreviewing ? <MarkdownRenderer>{content}</MarkdownRenderer> : <textarea rows={8} placeholder="Content" className="w-full" value={content} onChange={(e) => setcontent(e.target.value)} />}
                <Button onClick={() => setispreviewing(!ispreviewing)}>{ispreviewing ? "Edit" : "Preview"}</Button></>}
            <Button onClick={() => setisediting(!isediting)}>{isediting ? "Cancel editing" : "Edit post"}</Button>
            {isediting && <Button onClick={submitEdit}>Submit edit</Button>}
            <Button className="!bg-danger hover:text-white" onClick={submitDelete}>Delete post</Button>
            </div> : <p>You cannot edit this post as you didn't create it!</p>}
    </div>
}