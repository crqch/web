import { error, t } from "elysia";
import { createElysia } from "../elysia";
import { env } from "@/env";
import { db } from "@/server/db";
import { Scrypt } from "lucia";
import { lucia } from "@/server/auth/lucia";
import { cookies } from "next/headers";

export default createElysia({ prefix: '/dashboard' })
    .post('/register', async ({
        body: {
            username,
            registerKey,
            password
        }, db
    }) => {
        if (env.REGISTER_KEY !== "" && env.REGISTER_KEY !== registerKey) {
            return error(401, "Register key incorrect!");
        }
        if (await db.user.findUnique({ where: { name: username } }) !== null) return error(400, "Username is already taken!");
        await db.user.create({ data: { name: username, password: await new Scrypt().hash(password) } })
        return error(200, "Created account!")
    }, {
        body: t.Object({
            username: t.String({
                maxLength: 32
            }),
            registerKey: t.String({
                maxLength: 128
            }),
            password: t.String({
                maxLength: 128
            })
        })
    })
    .post('/login', async ({
        body: {
            username,
            password
        }, db
    }) => {
        const user = await db.user.findUnique({ where: { name: username } });
        if (user === null) return error(401, "Username or password is invalid!");

        if (!await new Scrypt().verify(user.password, password)) return error(401, "Username or password is invalid!");

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return { success: true }
    }, {
        body: t.Object({
            username: t.String({
                maxLength: 32
            }),
            password: t.String({
                maxLength: 128
            })
        })
    })
    .post('/logout', async ({ session, error }) => {
        if (!session) return error('Unauthorized', 'You must be logged in to sign out.')
        await lucia.invalidateSession(session.id)
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return { success: true }
    })
    .get('/my-posts', async ({ user, db }) => {
        if (!user) return error(401, "Unauthorized");
        return await db.post.findMany({ where: { authorId: user.id } })
    })
    .post('/post', async ({ user, db, body }) => {
        if (!user) return error(401, "Unauthorized");
        return await db.post.create({
            data: {
                ...body,
                author: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
    }, {
        body: t.Object({
            content: t.String(),
            title: t.String()
        })
    })
    .post('/edit', async ({ user, db, body }) => {
        if (!user) return error(401, "Unauthorized");
        const post = await db.post.findUnique({ where: { id: body.id } })
        if(!post) return error(400, "Post not found");
        if(post.authorId !== user.id) return error(401, "You cannot modify this post!")
        await db.post.update({ where: { 
            id: body.id
        }, data: {
            content: body.content
        } })
        return { success: true }
    }, {
        body: t.Object({
            id: t.String(),
            content: t.String()
        })
    })
    .post('/delete', async ({ user, db, body }) => {
        if (!user) return error(401, "Unauthorized");
        const post = await db.post.findUnique({ where: { id: body } })
        if(!post) return error(400, "Post not found");
        if(post.authorId !== user.id) return error(401, "You cannot modify this post!")
        await db.post.delete({ where: { 
            id: body
        }})
        return { success: true }
    }, {
        body: t.String(),
    })