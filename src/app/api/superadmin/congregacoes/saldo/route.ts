import { NextResponse } from "next/server";
import { url } from "@/components/variavel";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idCongregacao = searchParams.get("idCongregacao");

  if (!idCongregacao) {
    return NextResponse.json(
      { error: "Parâmetro 'idCongregacao' é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(`${url}/movimentacoes/totalGeral?idCongregacao=${idCongregacao}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar saldo", status: res.status },
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
