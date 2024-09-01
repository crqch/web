"use client";
import { useState } from "react";
import Button from "../_components/Button";
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
            .max(128, "Password cannot exceed 128 characters"),
        registerKey: z.string().min(1, "Register key is required").max(128, "Register key cannot exceed 128 characters"),
    })

type FormValues = z.infer<typeof schema>

const resolver = zodResolver(schema)

const fields = [
    { name: 'username' as const, label: 'Username', type: 'text' },
    { name: 'registerKey' as const, label: 'Register Key', type: 'text' },
    { name: 'password' as const, label: 'Password', type: 'password' },
]

export default function RegisterPage() {
    const [registerTitle, setRegisterTitle] = useState<string>("Register!")
    const router = useRouter()
    const form = useForm<FormValues>({ resolver })

    const resetRegisterTitle = () => {
        setTimeout(() => {
            setRegisterTitle("Login!")
        }, 1500)
    }

    const register = form.handleSubmit(async ({ ...data }) => {
        setRegisterTitle("Registering")
        api.dashboard.register.post(data).then(res => {
            if (res.error) {
                setRegisterTitle(res.error.value)
                resetRegisterTitle()
            }
            else {
                setRegisterTitle("Registered")
                router.replace("/login")
            }
        })
    })

    return (
        <Wrapper title="register on crqch.ftp.sh">
            <Form onSubmit={register}>
                {fields.map((field) => (
                    <FormField {...field}
                        key={field.name}
                        register={form.register} />
                ))}
                <div className="flex flex-row mt-4 items-center justify-between">
                    <a href="/login">Login</a>
                    <Button onClick={register} className="w-max text-nowrap" style={{ padding: "4px 30px" }}>{registerTitle}</Button>
                </div>
            </Form>
        </Wrapper>
    )
}