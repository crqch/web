"use client";

import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import Wrapper from "../_components/ui/wrapper";
import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import MDEditor from "@uiw/react-md-editor";
import Button from "../_components/Button";
import MarkdownRenderer from "../_components/ui/markdown";

export default function Dashboard() {
    const { isAuthed, user } = useSession()

    const router = useRouter();
    const [posts, setposts] = useState<Post[]>([]);
    const [creatingnew, setcreatingnew] = useState<boolean>(false);
    const [title, settitle] = useState<string>("");
    const [content, setcontent] = useState<string>("");
    const [ispreviewing, setispreviewing] = useState<boolean>(false);
    const [submitbutton, setsubmitbutton] = useState<string>("Create post");

    useEffect(() => {
        if (submitbutton !== "Create post") setsubmitbutton("Create post")
    }, [content, title])

    const createPost = () => {
        api.dashboard.post.post({
            content,
            title
        }).then((res) => {
            if (res.error) return setsubmitbutton(res.error.value);
            if (res.data) router.push('/post/' + res.data.id)
        })
    }

    const logout = () => {
        api.dashboard.logout.post().then(r => {
            if(!r.error) router.replace("/login")
        })
    }

    useEffect(() => {
        api.dashboard["my-posts"].get().then((res) => {
            if (!res.error) {
                setposts(res.data)
            }
        })
    }, [])

    if (!isAuthed) return router.replace("/");

    return <Wrapper title="dashboard">
        <p>Welcome to dashboard, {user.name}!</p>
        <div className="flex flex-col md:flex-row gap-2 items-center">
            <Button onClick={() => setcreatingnew(!creatingnew)}>{creatingnew ? "Cancel" : "Create new post"}</Button>
            {!creatingnew && <Button onClick={logout}>Logout</Button>}
        </div>
        {creatingnew && <div className="gap-y-4 p-y-4 flex flex-col">
            <input placeholder="Title" value={title} onChange={(e) => settitle(e.target.value)} />
            {ispreviewing ? <MarkdownRenderer>{content}</MarkdownRenderer> : <textarea rows={8} placeholder="Content" value={content} onChange={(e) => setcontent(e.target.value)} />}
            <Button onClick={() => setispreviewing(!ispreviewing)}>{ispreviewing ? "Edit" : "Preview"}</Button>
            <Button onClick={createPost}>{submitbutton}</Button>
        </div>}
        <p className="mt-8">Here are your posts:</p>
        <div className="flex flex-col gap-y-4">
            {posts.map(post => (
                <div className="gap-y-2 blob">
                    <h1>{post.title}</h1>
                    <p className="line-clamp-3">{post.content}</p>
                    <a href={"/post/" + post.id}>Visit</a>
                </div>
            ))}
        </div>
    </Wrapper>
}
