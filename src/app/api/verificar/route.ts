import { NextResponse } from "next/server";
import { url } from "@/components/variavel";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${url}/auth/confirmar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Lemos o corpo como texto uma única vez
    const responseText = await res.text();

    if (!res.ok) {
        let errorMsg = "Código de verificação inválido";
        try {
            // Tentamos converter o texto para JSON se for um erro estruturado
            const errorData = JSON.parse(responseText);
            errorMsg = errorData.error || errorMsg;
        } catch (e) {
            // Se não for JSON, usamos o texto puro ou a mensagem padrão
            errorMsg = responseText || errorMsg;
        }
        
        return NextResponse.json(
            { error: errorMsg, status: res.status },
            { status: res.status }
        );
    }

    try {
        // Sucesso: Tentamos converter o texto para JSON
        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        // Se o back-end retornar uma String pura de sucesso
        return NextResponse.json({ message: responseText }, { status: res.status });
    }

  } catch (error) {
    console.error("Erro no proxy de verificação:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com API" },
      { status: 500 }
    );
  }
}
