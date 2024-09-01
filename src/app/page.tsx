'use client';

import { api } from "@/lib/api";
import { Post } from "@prisma/client";
import { Suspense, useEffect, useState } from "react";
import { MdArrowLeft, MdArrowRight, MdArrowRightAlt } from "react-icons/md";
import MDPreview from "@uiw/react-markdown-preview"
import List from "./_components/List";
import Button from "./_components/Button";
import ThemeSwitch from "./_components/ThemeSwitch";
import { useTheme } from "next-themes";


export default function HomePage() {

  const [posts, setPosts] = useState<{
    results: {
      content: string;
      author: {
        id: string;
        name: string;
      };
      id: string;
      title: string;
      createdAt: Date;
      authorId: string;
    }[];
    pages: number;
  }>({
    results: [],
    pages: 0
  });
  const [page, setPage] = useState<number>(0)
  const [maxPage, setMaxPage] = useState<number>();

  const search = () => {
    api.public.posts.get({
      query: {
        page
      }
    }).then(r => {
      if (r.data) setPosts(r.data)
    })
  }

  useEffect(() => {
    search()
  }, [page])

  return (
    <main className="flex flex-col items-center justify-between lg:p-24 p-4 pt-6">
      <div className="border-foreground border-4" style={{
        padding: 20,
        width: '100%',
      }}>
        <div className="flex flex-row justify-between items-center" style={{ marginTop: -40 }}>
          <p className="blob">crqch.vercel.app</p>
          <ThemeSwitch />
        </div>
        <div className="flex flex-col md:flex-row gap-y-10 md:gap-y-0 gap-x-10 mt-4 mb-20">
          <div className="flex flex-col w-max text-nowrap">
            <p className='text-2xl'>About me</p>
            <p>years.length = 18</p>
            <p>origin = 🇵🇱</p>
            <p><span className="text-amber-500">let</span> <span className="text-fuchsia-500">socials</span> = {"{"}</p>
            <p className="ml-6"><span className="text-blue-500">discord</span>: <a href="https://discord.com/users/300619808863682562" target="blank">crqch</a>,</p>
            <p className="ml-6"><span className="text-blue-500">github:</span> <a href="https://github.com/crqch" target="blank">crqch</a>,</p>
            <p className="ml-6"><span className="text-blue-500">twitter:</span> <a href="https://x.com/crqch" target="blank">crqch</a></p>
            <p>{"}"}</p>
          </div>
          <div className="flex flex-col w-full">
            <p className='text-2xl'>Projects</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              <div className="blob">
                <p className="text-xl line-through">redacted</p>
                <p><b>Techstack</b></p>
                <List array={["kubernetes", "docker", "bun", "elysia", "java", "redis", "pm2", "nginx", "velocity", "websockets", "tailwindcss"]} />
              </div>
              <div className="blob">
                <a href="https://maz3.vercel.app/" target="_blank" className="text-xl">maz3</a>
                <div className="flex flex-row items-center gap-x-2">
                  <p><b>Techstack</b></p>
                  <a href="https://github.com/crqch/maz3" target="_blank">github</a>
                </div>
                <List array={["postgresql", "prisma", "nextjs", "elysia", "vercel", "tailwindcss"]} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-4 border-foreground" style={{
        padding: 20,
        width: '100%',
        marginTop: -4
      }}>
        <p className='text-2xl w-min blob justify-self-center self-center text-center' style={{ marginTop: -45 }}>Posts</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-10">
          {posts.results.map((p) => <div key={p.id} className="blob">
            <p className="text-2xl line-clamp-2">{p.title}</p>
            <p style={{ color: 'var(--gray)' }}>{new Date(p.createdAt).toLocaleString()} by {p.author.name}</p>
            <div className="flex flex-row gap-x-2" style={{ textOverflow: "ellipsis" }}>
              <p style={{ textOverflow: "ellipsis", maxHeight: 70, overflowWrap: "break-word", overflow: 'hidden' }}><p>{p.content}</p></p>
              <Button className="group text-nowrap flex flex-row items-center gap-x-2 h-min place-self-end -mr-2 -mb-2" onClick={() => { location.href = '/post/' + p.id }}>
                <p>Read more</p>
                <MdArrowRight className="group-hover:translate-x-2 mr-2 transition-transform" />
              </Button>
            </div>
          </div>)}
          {posts.pages === 0 && <p>No posts found</p>}
        </div>
        {maxPage !== undefined && maxPage > 1 && <div className="flex flex-row content-end place-self-end items-center gap-x-2">
          {page > 0 && <Button onClick={(() => setPage(page - 1))}>
            <MdArrowLeft />
          </Button>}
          <p>Page {page}</p>
          {page < maxPage && <Button onClick={(() => setPage(page + 1))}>
            <MdArrowRight />
          </Button>}
        </div>}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mt-4 w-full">
        <p>crqch2024</p>
        <a href="https://github.com/crqch/web" target="blank">source</a>
      </div>
    </main>
  );
}
