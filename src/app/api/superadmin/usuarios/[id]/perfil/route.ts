import { NextResponse } from "next/server";
import { url } from "@/components/variavel";
import { cookies } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json(); // Espera { perfil: "ADMIN" } ou { perfil: "USER" }
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${url}/superadmin/usuarios/${id}/perfil`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Falha ao atualizar perfil", status: res.status },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Perfil atualizado com sucesso" });
  } catch (error) {
    console.error("Erro no proxy de perfil superadmin:", error);
    return NextResponse.json({ error: "Erro ao conectar com API" }, { status: 500 });
  }
}
