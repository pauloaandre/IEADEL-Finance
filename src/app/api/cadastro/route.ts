import { NextResponse } from "next/server";
import { url } from "@/components/variavel";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${url}/auth/novo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();

    if (!res.ok) {
      let errorMsg = "Falha no cadastro";
      try {
        const errorData = JSON.parse(responseText);
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        errorMsg = responseText || errorMsg;
      }

      return NextResponse.json(
        { error: errorMsg, status: res.status },
        { status: res.status }
      );
    }

    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        return NextResponse.json({ message: responseText }, { status: res.status });
    }

  } catch (error) {
    console.error("Erro no proxy de cadastro:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com API" },
      { status: 500 }
    );
  }
}
