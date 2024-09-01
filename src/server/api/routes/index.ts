import { error, t } from "elysia";
import { createElysia } from "../elysia";

export default createElysia({ prefix: "/public" })
    .get("/posts", async ({ query: {
        page
    }, db }) => {
        return {
            results: (await db.post.findMany({ orderBy: {
                createdAt: "desc"
            }, include: {
                author: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }, skip: page * 15, take: 15 })).map(r => ({
                ...r,
                content: r.content.substring(0, 300) 
            })),
            pages: Math.ceil(await db.post.count() / 15)
        }
    }, {
        query: t.Object({
            page: t.Number({
                minimum: 0,
                maximum: 100
            })
        })
    })
    .get('/post', async ({ db, query: {
        id
    } }) => {
        const post = await db.post.findUnique({ where: { id: id }, include: {
            author: {
                select: {
                    name: true,
                    id: true
                }
            }
        } })
        if(!post) return error(400, "Not found");
        return post
    }, {
        query: t.Object({
            id: t.String()
        })
    })
