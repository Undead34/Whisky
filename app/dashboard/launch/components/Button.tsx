'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" aria-disabled={pending} className={`rounded bg-blue-500 px-6 py-2 text-white ${pending ?? "bg-blue-400"}`}>
            Enviar
        </button>
    )
}