"use client";
import { useState } from "react";

type Pessoa = { id_usuario: number; nome: string };

interface DizimoModalProps {
  onSuccess?: () => void;
}

export default function DizimoModal({ onSuccess }: DizimoModalProps) {
  const hoje = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const [isOpen, setIsOpen] = useState(false); 
  const [descricao, setDescricao] = useState("");
  const [id_usuario, setIdUsuario] = useState<number | null>(null);
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hoje);
  const [sugestoes, setSugestoes] = useState<Pessoa[]>([]);
  const [isVisitante, setIsVisitante] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorInput = e.target.value;
    setDescricao(valorInput);

    if (!isVisitante && valorInput.length > 2) {
      const res = await fetch(`/api/usuario?query=${valorInput}`);
      const data: Pessoa[] = await res.json();
      setSugestoes(data);
    } else {
      setSugestoes([]);
    }
  }
  

  function handleSelect(pessoa: Pessoa) {
    setDescricao(pessoa.nome);
    setIdUsuario(pessoa.id_usuario);
    setSugestoes([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      descricao,
      valor: Number(valor) || 0,
      data,
      tipo: "DIZIMO",
      isVisitante: isVisitante,
    };

    if (!isVisitante) {
      payload.usuarioId = id_usuario;
    }

    console.log("Dízimo enviado:", payload);

    const res = await fetch("/api/movimentacoes/novo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        setDescricao("");
        setValor("");
        setData(hoje);
        setSugestoes([]);
        setIdUsuario(null);
        setIsVisitante(false);
        setIsOpen(false);
        if (onSuccess) onSuccess();
    } else {
        alert("Erro ao salvar dízimo");
    }
  }


  return (
    <div className="p-4 flex flex-col items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Adicionar Dízimo
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Novo Dízimo</h2>

            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="relative">
                <input
                  type="text"
                  value={descricao}
                  onChange={handleChange}
                  placeholder={isVisitante ? "Nome do visitante" : "Nome da pessoa"}
                  className="border p-2 w-full"
                  required
                />
                {!isVisitante && sugestoes.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
                    {sugestoes.map((p) => (
                      <li
                        key={p.id_usuario}
                        onClick={() => handleSelect(p)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {p.nome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="visitante"
                  checked={isVisitante}
                  onChange={(e) => {
                    setIsVisitante(e.target.checked);
                    if (e.target.checked) {
                      setIdUsuario(null);
                      setSugestoes([]);
                    }
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="visitante" className="text-sm font-medium cursor-pointer">Não é membro (Visitante)</label>
              </div>

              <input
                type="number"
                value={valor}
                inputMode="decimal" 
                step="0.01"
                placeholder="R$ 0,00"
                onChange={(e) => setValor(e.target.value)}
                className="border p-2 w-full mb-3"
                required
              />

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="border p-2 w-full"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
