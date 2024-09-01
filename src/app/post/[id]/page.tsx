import PostEdit from "@/app/_components/postedit";
import MarkdownRenderer from "@/app/_components/ui/markdown";
import Wrapper from "@/app/_components/ui/wrapper"
import { api } from "@/lib/api"
import { useSession } from "@/lib/session";
import MDPreview from "@uiw/react-markdown-preview";

export default async function PostPage({ params }: {
    params: {
        id: string
    }
}) {

    const post = await api.public.post.get({
        query: {
            id: params.id
        }
    })

    if (post.error) return (
        <Wrapper title="error">
            <h2 className="py-4">This post does not exist!</h2>
        </Wrapper>
    )

    return <Wrapper title={post.data.title}>
        <MarkdownRenderer className="mt-4">
            {post.data.content}
        </MarkdownRenderer>
        <PostEdit post={post.data} />
    </Wrapper>
}