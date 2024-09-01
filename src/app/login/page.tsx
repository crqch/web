"use client";
import { useState } from "react";
import Button from "../_components/Button";
import { MdArrowLeft } from "react-icons/md"
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Form, FormField } from "../_components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Wrapper from "../_components/ui/wrapper";

const schema = z
    .object({
        username: z.string().min(1, 'Username is required').max(32, "Username cannot exceed 32 characters"),
        password: z
            .string()
            .min(1, "Password is required")
            .max(128, "Password cannot exceed 128 characters")
    })

type FormValues = z.infer<typeof schema>

const resolver = zodResolver(schema)

const fields = [
    { name: 'username' as const, label: 'Username', type: 'text' },
    { name: 'password' as const, label: 'Password', type: 'password' },
]

export default function RegisterPage() {
    const [loginTitle, setLoginTitle] = useState<string>("Login!")
    const router = useRouter()
    const form = useForm<FormValues>({ resolver })

    const resetLoginTitle = () => {
        setTimeout(() => {
            setLoginTitle("Login!")
        }, 1500)
    }

    const login = form.handleSubmit(async ({ ...data }) => {
        setLoginTitle("Logging in")
        api.dashboard.login.post(data).then(res => {
            if (res.status !== 200) {
                setLoginTitle(res.error.message)
                resetLoginTitle()
            }
            else {
                setLoginTitle("Logged in")
                router.replace('/dashboard')
            }
        })
    })

    return (
        <Wrapper title="login into crqch.ftp.sh">
            <Form onSubmit={login}>
                {fields.map((field) => (
                    <FormField {...field}
                        key={field.name}
                        register={form.register} />
                ))}
                <div className="flex flex-row mt-4 items-center justify-between">
                    <a href="/register">Register</a>
                    <Button onClick={login} className="w-max text-nowrap" style={{ padding: "4px 30px" }}>{loginTitle}</Button>
                </div>
            </Form>
        </Wrapper>
    )
}