"use client";
import Head from "next/head";
import NavBar from "@/components/navbar";
import YearSelector from "@/components/yearselector";
import { useEffect } from "react";
import { useState } from "react";

export default function HomeUser() {
  interface Dizimo {
  id: string | number;
  data: string | Date;
  valor: number;
  }
    const [ano, setAno] = useState(new Date().getFullYear());
	const [dizimos, setDizimos] = useState<Dizimo[]>([]);
	const meses = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro",
	];

	function getIdUsuario(): number | null {
		try {
			const user = localStorage.getItem("user");
			return user ? JSON.parse(user).id : null;
		} catch (error) {
			console.error("Erro ao ler localStorage:", error);
			return null;
		}
	}

	useEffect(() => {
		async function fetchDizimosPorUsuario() {
			try {
				const id_usuario = getIdUsuario();
				const res = await fetch(`/api/movimentacoes/dizimos/porUsuario?id_usuario=${id_usuario}`);
				const data = await res.json();
				setDizimos(data);
				
			} catch (err) {
				console.error("Erro ao carregar saldo:", err);
			}
		}
		fetchDizimosPorUsuario()
	}, [ano]);

	const dizimosFiltrados = dizimos.filter(
		(d) => new Date(d.data).getFullYear() === ano
	);

	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			<div>
				<NavBar />
				<YearSelector
                    initialYear={ano}
                    onChange={(novoAno) => {
                    setAno(novoAno);
                    }}
				/>

				<div className="flex flex-col items-center justify-center mb-10 mt-10">
					<h2 className="text-center md:text-2xl text-xl font-bold mb-6">Seus dízimos</h2>
					<div className="shadow-lg rounded-lg overflow-x-auto md:w-3/4 m-2">
						<table className="w-full table-fixed border-collapse text-center">
							<thead className="bg-black text-white">
								<tr>
									<th className="px-4 py-2 border w-1/3">Mês</th>
									<th className="px-4 py-2 border w-1/3">Data</th>
									<th className="px-4 py-2 border w-1/3">Valor</th>
								</tr>
							</thead>
							<tbody>
								{dizimosFiltrados.length > 0 ? (
									dizimosFiltrados.map((d) => (
										<tr key={d.id} className="bg-white hover:bg-gray-100">
											<td className="px-4 py-2 border w-1/3">{meses[new Date(d.data).getMonth()]}</td>
											<td className="px-4 py-2 border w-1/3">{new Date(d.data).toLocaleDateString("pt-BR")}</td>
											<td className="px-4 py-2 border w-1/3">
												R$ {d.valor.toFixed(2).replace(".", ",")}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={3} className="px-4 py-2 border text-center">
											Nenhum dízimo encontrado
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
