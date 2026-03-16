"use client";
import Image from "next/image";
import Head from "next/head";
import NavBar from "@/components/navbar";
import MonthSelector from "@/components/monthselector";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function ViewCongregacaoContent() {
    const searchParams = useSearchParams();
    const idCongregacao = searchParams.get("id");
    const nomeCongregacao = searchParams.get("nome");

    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [saldo, setSaldo] = useState(0);
    const [dizimo, setDizimo] = useState(0);
    const [oferta, setOferta] = useState(0);
    const [despesa, setDespesa] = useState(0);

    useEffect(() => {
        if (!idCongregacao) return;

        async function fetchSaldoGeral() {
            try {
                const res = await fetch(`/api/superadmin/congregacoes/saldo?idCongregacao=${idCongregacao}`);
                const data = await res.json();
                setSaldo(data.total || 0);
            } catch (err) {
                console.error("Erro ao carregar saldo:", err);
            }
        }

        fetchSaldoGeral();
    }, [idCongregacao]);

    useEffect(() => {
        if (!idCongregacao) return;

        async function fetchTotais() {
            try {
                const res = await fetch(`/api/superadmin/congregacoes/totais?mes=${mes}&ano=${ano}&idCongregacao=${idCongregacao}`);
                const data = await res.json();
                setDizimo(data.dizimo || 0);
                setOferta(data.oferta || 0);
                setDespesa(data.despesa || 0);
            } catch (err) {
                console.error("Erro ao carregar totais:", err);
            }
        }
        fetchTotais();
    }, [mes, ano, idCongregacao]);

    function formatBRL(value: number | string | null) {
        const num =
            value == null
                ? 0
                : typeof value === "string"
                    ? parseFloat(value.replace(/\./g, "").replace(",", "."))
                    : Number(value);
        if (Number.isNaN(num)) return "R$ 0,00";
        return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    if (!idCongregacao) {
        return <div className="p-8 text-center">ID da congregação não fornecido.</div>;
    }

    return (
        <>
            <Head>
                <title>Visualizar {nomeCongregacao}</title>
            </Head>
            <div>
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 mt-8">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">Visualizando: {nomeCongregacao}</h1>
                </div>
                <MonthSelector
                    initialMonth={mes}
                    initialYear={ano}
                    onChange={(novoMes, novoAno) => {
                        setMes(novoMes);
                        setAno(novoAno);
                    }}
                />
                <div className="flex flex-col items-center font-medium w-full md:mt-14 mt-10 md:gap-20 gap-8 pb-10">
                    <div className="flex flex-row justify-center md:gap-30 gap-10 md:w-full w-90">
                        <section className="flex bg-[#008eff] md:py-8 py-5 px-2 w-40 rounded-sm md:w-1/3">
                            <div className="w-full flex justify-center items-center gap-4">
                                <div className="flex flex-col md:items-center">
                                    <h1 className="text-xl md:text-3xl text-center text-white">Dízimos</h1>
                                    <span className="text-[#004781] md:text-base text-sm">{formatBRL(dizimo)}</span>
                                </div>
                                <Image
                                    alt="Símbolo financeiro"
                                    src="/dizimo.png"
                                    width={40}
                                    height={40}
                                    className="md:w-1/7 md:ml-6"
                                />
                            </div>
                        </section>
                        <section className="flex gap-4 bg-[#f5dd02] md:py-8 py-5 px-2 w-40 rounded-sm md:w-1/3">
                            <div className="w-full flex justify-center items-center gap-4">
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-3xl text-center text-white">Ofertas</h1>
                                    <span className="text-[#9c8d00] text-center md:text-base text-sm">{formatBRL(oferta)}</span>
                                </div>
                                <Image
                                    alt="Símbolo financeiro"
                                    src="/oferta.png"
                                    width={40}
                                    height={40}
                                    className="md:w-1/7 md:ml-4"
                                />
                            </div>
                        </section>
                    </div>
                    <div className="flex flex-shrink-0 flex-row justify-center md:gap-30 gap-10 md:w-full min-w-90">
                        <section className="flex gap-4 bg-[#ff2200] md:py-8 py-5 px-2 w-40 rounded-sm md:w-1/3">
                            <div className="w-full flex justify-center items-center gap-2">
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-3xl text-center text-white">Despesas</h1>
                                    <span className="text-[#961400] md:text-base text-center text-sm">{formatBRL(despesa)}</span>
                                </div>
                                <Image
                                    alt="Símbolo financeiro"
                                    src="/despesa.png"
                                    width={40}
                                    height={40}
                                    className="md:w-1/7 md:ml-4"
                                />
                            </div>
                        </section>
                        <section className="flex bg-[#00cf40] py-5 px-2 w-40 rounded-sm md:w-1/3">
                            <div className="w-full flex justify-center items-center gap-4">
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-3xl text-center text-white">Saldo</h1>
                                    <span className="text-[#007525] md:text-base text-sm">{formatBRL(saldo)}</span>
                                </div>
                                <Image
                                    alt="Símbolo financeiro"
                                    src="/saldo.png"
                                    width={40}
                                    height={40}
                                    className="md:w-1/7 md:ml-6"
                                />
                            </div>
                        </section>
                    </div>
                    <Link 
                        href={`/relatorio?mes=${mes}&ano=${ano}&idCongregacao=${idCongregacao}&nomeCongregacao=${nomeCongregacao}`} 
                        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mb-10"
                    >
                        Gerar relatório mensal
                    </Link>
                </div>
            </div>
        </>
    );
}

export default function ViewCongregacaoPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ViewCongregacaoContent />
        </Suspense>
    );
}
