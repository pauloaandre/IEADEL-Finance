import { NextResponse } from "next/server";
import { url } from "@/components/variavel";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mes = searchParams.get("mes");
  const ano = searchParams.get("ano");
  const idCongregacao = searchParams.get("idCongregacao");

  if (!mes || !ano || !idCongregacao) {
    return NextResponse.json(
      { error: "Parâmetros 'mes', 'ano' e 'idCongregacao' são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const mesFormatado = String(mes).padStart(2, "0");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${url}/movimentacoes/totais?mes=${mesFormatado}&ano=${ano}&idCongregacao=${idCongregacao}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar dados", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no proxy:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com API" },
      { status: 500 }
    );
  }
}
