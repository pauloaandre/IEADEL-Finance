"use client"; 
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [perfil, setPerfil] = useState("");

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/";
    }

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            const nomeCompleto = user.nome.split(" ");
            const primeirosNomes = nomeCompleto.slice(0, 2).join(" ")
            setNome(primeirosNomes);
            setPerfil(user.perfil);
        }
    }, []);

    return (
        <div className="flex w-full py-1 shadow-md">
            <div className="flex flex-row justify-between items-center m-4 w-full relative">
                <Link href={perfil === "ADMIN" ? "/homeadmin" : (perfil === "USER" ? "/homeuser" : "/")}>
                    <Image 
                        src="/logo.png"
                        alt="Logo"
                        width={35}
                        height={35}
                    />
                </Link>

                <h1 className="text-center font-semibold text-sm md:text-xl px-2">Bem-vindo, {nome ? nome : "Visitante"}</h1>

                <div className="relative">
                    <button 
                        title="Menu" 
                        className="cursor-pointer focus:outline-none items-center justify-center flex" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Image
                            src="/perfil.png"
                            alt="Menu"
                            width={50}
                            height={50}
                        />
                    </button>   

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                            <Link 
                                href="/perfil" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Meu Perfil
                            </Link>
                            {perfil === "ADMIN" && (
                                <Link 
                                    href="/homeadmin" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Página Admin
                                </Link>
                            )}
                            <Link 
                                href="/homeuser" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Meus Dízimos
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100 mt-1 pt-1"
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
