"use client";
import { useState, useEffect } from "react";
import MonthSelector from "@/components/monthselector";
import NavBar from "@/components/navbar";
import { parseDateLocal } from "@/utils/date";

interface Movimentacao {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: string;
  idUsuario: number | null;
  nomeUsuario: string | null;
  idCongregacao: number;
  dataRegistro: string;
}

interface Totais {
  dizimo: number;
  oferta: number;
  despesa: number;
}

const mesesNomes = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

export default function GerarRelatorio() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [totais, setTotais] = useState<Totais>({ dizimo: 0, oferta: 0, despesa: 0 });
  const [dizimos, setDizimos] = useState<Movimentacao[]>([]);
  const [ofertas, setOfertas] = useState<Movimentacao[]>([]);
  const [despesas, setDespesas] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRelatorioData = async (m: number, a: number) => {
    setLoading(true);
    try {
      const mesFormatado = String(m).padStart(2, "0");
      
      // Fetch Totais
      const resTotais = await fetch(`/api/movimentacoes/totais?mes=${mesFormatado}&ano=${a}`);
      const dataTotais = await resTotais.json();
      setTotais(dataTotais);

      // Fetch Dizimos
      const resDizimos = await fetch(`/api/movimentacoes/dizimos/porCongregacao?tipo=DIZIMO&mes=${mesFormatado}&ano=${a}`);
      const dataDizimos = await resDizimos.json();
      setDizimos(dataDizimos);

      // Fetch Ofertas
      const resOfertas = await fetch(`/api/movimentacoes/dizimos/porCongregacao?tipo=OFERTA&mes=${mesFormatado}&ano=${a}`);
      const dataOfertas = await resOfertas.json();
      setOfertas(dataOfertas);

      // Fetch Despesas
      const resDespesas = await fetch(`/api/movimentacoes/dizimos/porCongregacao?tipo=DESPESA&mes=${mesFormatado}&ano=${a}`);
      const dataDespesas = await resDespesas.json();
      setDespesas(dataDespesas);
    } catch (error) {
      console.error("Erro ao carregar dados do relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorioData(mes, ano);
  }, [mes, ano]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalEntradas = totais.dizimo + totais.oferta;
  const saldoGeral = totalEntradas - totais.despesa;

  return (
    <>
      <div className="no-print">
        <NavBar />
        <div className="flex flex-col items-center py-6 bg-gray-100 border-b">
          <h1 className="text-2xl font-bold mb-4">Gerar Relatório Mensal</h1>
          <MonthSelector
            initialMonth={mes}
            initialYear={ano}
            onChange={(novoMes, novoAno) => {
              setMes(novoMes);
              setAno(novoAno);
            }}
          />
          <button
            onClick={handlePrint}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Imprimir Relatório"}
          </button>
        </div>
      </div>

      <div className="report-container">
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: A4;
            margin: 1cm;
          }

          @media print {
            .no-print { display: none !important; }
            body { background-color: white !important; }
            .page {
              margin: 0 !important;
              box-shadow: none !important;
              page-break-after: always;
            }
          }

          .report-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            padding: 20px 0;
          }

          @media screen {
            .page {
              width: 21cm;
              min-height: 29.7cm;
              padding: 1.5cm;
              margin: 1cm auto;
              background: white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
            }
          }

          @media print {
            .report-container { background-color: white !important; padding: 0 !important; }
            .page {
              width: 100%;
              padding: 1cm;
              margin: 0;
            }
          }

          h1, h2 {
            text-align: center;
            margin: 0 0 5px 0;
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
          }

          h3 {
            text-align: center;
            margin: 0 0 20px 0;
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          table, th, td {
            border: 1.5px solid black;
          }

          th {
            background-color: #f2f2f2;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11pt;
            text-transform: uppercase;
          }

          td {
            padding: 8px;
            font-size: 10.5pt;
          }

          .centered { text-align: center; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .total-row { background-color: #f9f9f9; font-weight: bold; }

          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }

          .signature-box {
            border: 1px solid #ccc;
            padding: 15px;
            width: 350px;
            text-align: center;
            margin-bottom: 30px;
          }

          .signature-line {
            border-top: 1px solid black;
            width: 250px;
            margin: 20px auto 5px auto;
          }

          .footer-date {
            margin-top: 30px;
            text-align: center;
            font-size: 10pt;
          }

          .col-sq { width: 40px; text-align: center; }
          .col-val { width: 120px; text-align: right; }
          .col-desc { text-align: left; }
          .col-sig { width: 250px; }

          .saldo-geral-box {
            border: 2px solid black;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 13pt;
            margin-top: 20px;
          }
        ` }} />

        {/* PAGE 1: RECEITA */}
        <div className="page">
          <h1>IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EL-SHADDAI PIÇARREIRA</h1>
          <h3>RECEITA MÊS: {mesesNomes[mes - 1]} {ano}</h3>

          <table>
            <thead>
              <tr>
                <th style={{ width: "60%" }}>DESCRIÇÃO</th>
                <th style={{ width: "40%" }}>VALORES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bold">1 &nbsp;&nbsp;&nbsp;&nbsp; TOTAL ENTRADA DÍZIMOS</td>
                <td className="right bold">{formatCurrency(totais.dizimo)}</td>
              </tr>
              <tr>
                <td className="bold">2 &nbsp;&nbsp;&nbsp;&nbsp; TOTAL ENTRADA OFERTAS</td>
                <td className="right bold">{formatCurrency(totais.oferta)}</td>
              </tr>
              <tr>
                <td className="bold">3 &nbsp;&nbsp;&nbsp;&nbsp; TOTAL ENTRADAS (1 + 2)</td>
                <td className="right bold">{formatCurrency(totalEntradas)}</td>
              </tr>
              <tr>
                <td className="bold">4 &nbsp;&nbsp;&nbsp;&nbsp; TOTAL SAÍDAS</td>
                <td className="right bold">{formatCurrency(totais.despesa)}</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>

          <div className="saldo-geral-box">
            <span>TOTAL ARRECADADO (3 - 4)</span>
            <span>{formatCurrency(saldoGeral)}</span>
          </div>

          <div className="footer-date">
            São José de Ribamar, {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>

        {/* PAGE 2: DIZIMOS */}
        <div className="page">
          <h1>IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EL-SHADDAI PIÇARREIRA</h1>
          <h3>DÍZIMOS - MÊS: {mesesNomes[mes - 1]} {ano}</h3>

          <table>
            <thead>
              <tr>
                <th className="col-sq">Sq.</th>
                <th>Nome dos Dizimistas</th>
                <th className="col-val">Valor</th>
              </tr>
            </thead>
            <tbody>
              {dizimos.map((item, index) => (
                <tr key={item.id}>
                  <td className="centered">{index + 1}</td>
                  <td>{item.nomeUsuario || item.descricao}</td>
                  <td className="right">{formatCurrency(item.valor)}</td>
                </tr>
              ))}
              {/* Fill with empty rows to reach at least 15 or so, or just let it be dynamic */}
              {dizimos.length === 0 && (
                <tr>
                  <td colSpan={3} className="centered italic py-4 text-gray-400">Nenhum dízimo registrado neste mês.</td>
                </tr>
              )}
              <tr className="total-row">
                <td colSpan={2} className="right">TOTAL</td>
                <td className="right">R$ {formatCurrency(totais.dizimo)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGE 3: OFERTAS */}
        <div className="page">
          <h1>IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EL-SHADDAI PIÇARREIRA</h1>
          <h3>OFERTAS - MÊS: {mesesNomes[mes - 1]} {ano}</h3>

          <table>
            <thead>
              <tr>
                <th className="col-sq">Sq.</th>
                <th>Origem das Ofertas</th>
                <th className="col-val">Valor</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((item, index) => (
                <tr key={item.id}>
                  <td className="centered">{index + 1}</td>
                  <td>{item.descricao}</td>
                  <td className="right">{formatCurrency(item.valor)}</td>
                  <td></td>
                </tr>
              ))}
              {ofertas.length === 0 && (
                <tr>
                  <td colSpan={4} className="centered italic py-4 text-gray-400">Nenhuma oferta registrada neste mês.</td>
                </tr>
              )}
              <tr className="total-row">
                <td colSpan={2} className="right">TOTAL</td>
                <td className="right">R$ {formatCurrency(totais.oferta)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGE 4: SAÍDAS */}
        <div className="page">
          <h1>IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EL-SHADDAI PIÇARREIRA</h1>
          <h3>SAÍDAS MÊS: {mesesNomes[mes - 1]} {ano}</h3>

          <table className="saidas-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>Sq.</th>
                <th>Descrições dos pagamentos</th>
                <th style={{ width: "100px" }}>Data</th>
                <th style={{ width: "120px" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map((item, index) => (
                <tr key={item.id}>
                  <td className="centered">{index + 1}</td>
                  <td>{item.descricao}</td>
                  <td className="centered">{parseDateLocal(item.data).toLocaleDateString("pt-BR")}</td>
                  <td className="right">{formatCurrency(item.valor)}</td>
                </tr>
              ))}
              {despesas.length === 0 && (
                <tr>
                  <td colSpan={4} className="centered italic py-4 text-gray-400">Nenhuma saída registrada neste mês.</td>
                </tr>
              )}
              <tr>
                <td colSpan={3}className="total-row centered" style={{ backgroundColor: "#333", color: "white" }}>TOTAL SAÍDA</td>
                <td className="total-row right" style={{ backgroundColor: "#f2f2f2" }}>{formatCurrency(totais.despesa)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
