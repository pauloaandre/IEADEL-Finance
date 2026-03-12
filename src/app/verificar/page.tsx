"use client";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerificarPage() {
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro("");

        try {
            const res = await fetch("/api/verificar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codigo }),
            });

            const data = await res.json();

            if (res.ok) {
                // Sucesso na verificação
                localStorage.removeItem("userEmail");
                router.push("/"); // Redireciona para o login
            } else {
                setErro(data.error || "Código inválido. Tente novamente.");
            }
        } catch (err) {
            setErro("Erro ao conectar com o servidor.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <Head>
                <title>Verificar Código - IEADEL Finance</title>
            </Head>
            <div className="flex flex-col items-center w-full mt-8">
                <main className="flex flex-col items-center gap-6">
                    <Image 
                        src="/logo.png"
                        alt="Logo"
                        width={90}
                        height={90}
                    />
                    <p className="text-xl text-center">ASSEMBLÉIA DE DEUS <br />EL-SHADDAI</p>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white mt-4 shadow-sm rounded-lg p-6 w-96 flex flex-col gap-4"
                    >
                        <h1 className="font-semibold text-3xl text-center mb-2">Verificação</h1>
                        <p className="text-center text-gray-600 mb-4">
                            Enviamos um código para <br /> 
                            <span className="font-semibold">{email || "seu e-mail"}</span>
                        </p>

                        {!email && (
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Confirmar seu e-mail"
                                    className="w-full p-2 border text-lg placeholder-[#383838] ring-[#6d6d6d] ring-1 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="text"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                placeholder="Código de 6 dígitos"
                                className="w-full p-2 border text-center text-2xl tracking-[0.5em] font-bold placeholder-[#383838] ring-[#6d6d6d] ring-1 rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                                maxLength={6}
                            />
                        </div>

                        {erro && <span className="text-red-500 text-sm text-center font-medium">{erro}</span>}

                        <button
                            type="submit"
                            disabled={carregando}
                            className={`bg-blue-600 text-white text-xl cursor-pointer py-2 rounded-md hover:bg-blue-700 transition font-semibold ${carregando ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {carregando ? "Validando..." : "Validar Conta"}
                        </button>
                        
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-center text-sm">
                                Não recebeu o código? <button type="button" className="text-blue-600 underline">Reenviar</button>
                            </p>
                            <Link href="/cadastro" className="text-center text-sm text-gray-500 underline">
                                Voltar para o cadastro
                            </Link>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
