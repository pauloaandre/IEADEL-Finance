import { NextResponse } from "next/server";
import { url } from "@/components/variavel";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${url}/superadmin/usuarios`, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar usuários", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no proxy de usuários superadmin:", error);
    return NextResponse.json({ error: "Erro ao conectar com API" }, { status: 500 });
  }
}
