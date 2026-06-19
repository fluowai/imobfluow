import React, { useState } from "react";
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  User, 
  ShieldAlert, 
  CheckCircle, 
  FileText,
  Clock,
  ArrowRight,
  PlusCircle
} from "lucide-react";
import { LeaseContract } from "../types";

const initialRentalContracts: LeaseContract[] = [
  {
    id: "loc-1",
    tenantName: "Maurício Neves",
    ownerName: "Pedro Albuquerque",
    propertyTitle: "Apartamento Premium Jardins #41",
    monthlyValue: 6500,
    guarantor: "Seguro Fiança (Porto Seguro)",
    status: "Ativo",
    dueDate: "10/07/2026",
    nextReadjustmentDate: "15/10/2026",
  },
  {
    id: "loc-2",
    tenantName: "Renata Godoy",
    ownerName: "Evelyn Prado",
    propertyTitle: "Studio Loft Moema #108",
    monthlyValue: 3200,
    guarantor: "Caução Imobiliária (3 meses depositado)",
    status: "Em Atraso",
    dueDate: "15/06/2026",
    nextReadjustmentDate: "01/02/2027",
  },
  {
    id: "loc-3",
    tenantName: "Lucas Alvarenga",
    ownerName: "José da Silva",
    propertyTitle: "Sítio Vista Verde - Casa de Campo",
    monthlyValue: 8500,
    guarantor: "Fiador Tradicional (Matrícula de Imóvel)",
    status: "Renovação",
    dueDate: "05/07/2026",
    nextReadjustmentDate: "19/06/2026", // Hoje!
  },
];

export default function LocacaoView() {
  const [contracts, setContracts] = useState<LeaseContract[]>(initialRentalContracts);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [activeRentFilter, setActiveRentFilter] = useState<"Todos" | "Ativo" | "Em Atraso" | "Renovação">("Todos");

  // State: dynamic addition of locacao
  const [newLoc, setNewLoc] = useState({
    tenantName: "",
    ownerName: "",
    propertyTitle: "Apartamento Premium Jardins",
    monthlyValue: "3500",
    guarantor: "Seguro Fiança",
    status: "Ativo" as const,
  });

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoc.tenantName || !newLoc.ownerName) return;

    const added: LeaseContract = {
      id: `loc-${Date.now()}`,
      tenantName: newLoc.tenantName,
      ownerName: newLoc.ownerName,
      propertyTitle: newLoc.propertyTitle,
      monthlyValue: Number(newLoc.monthlyValue) || 3500,
      guarantor: newLoc.guarantor,
      status: newLoc.status,
      dueDate: "10/07/2026",
      nextReadjustmentDate: "19/06/2027",
    };

    setContracts([added, ...contracts]);
    setShowPayoutForm(false);
    setNewLoc({
      tenantName: "",
      ownerName: "",
      propertyTitle: "Apartamento Premium Jardins",
      monthlyValue: "3500",
      guarantor: "Seguro Fiança",
      status: "Ativo",
    });
  };

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  // Automated adjustment simulation with IGP-M (4.12%)
  const handleApplyAdjustment = (id: string, value: number) => {
    const adjustedValue = Math.round(value * 1.0412); // apply general 4.12% adjustment
    setContracts(contracts.map(c => {
      if (c.id === id) {
        // pushing date 1 year into future
        return {
          ...c,
          monthlyValue: adjustedValue,
          nextReadjustmentDate: "19/06/2027"
        };
      }
      return c;
    }));
    alert(`Reajuste IGP-M / IPCA de 4.12% aplicado com sucesso! O novo aluguel cadastrado para este imóvel é de ${adjustedValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`);
  };

  const display = activeRentFilter === "Todos" 
    ? contracts 
    : contracts.filter(c => c.status === activeRentFilter);

  // Derived financial statistics
  const totalRentBook = contracts.reduce((acc, curr) => acc + curr.monthlyValue, 0);
  const totalInArrears = contracts.filter(c => c.status === "Em Atraso").reduce((acc, curr) => acc + curr.monthlyValue, 0);

  return (
    <div className="space-y-6" id="locacaoview-root">
      
      {/* KPI Locação row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="rentals-kpis">
        
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total de Aluguéis Ativos</span>
            <span className="text-xl font-bold text-slate-800">
              {totalRentBook.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <span className="text-[10px] text-slate-400 block">{contracts.length} carteiras sob gestão</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Inadimplência de Aluguéis</span>
            <span className="text-xl font-bold text-rose-600">
              {totalInArrears.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Taxa de {Math.round((totalInArrears / (totalRentBook || 1)) * 100)}% de reajuste pendente
            </span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tarifa de Organização do repasse</span>
            <span className="text-xl font-bold text-emerald-600">
              {(totalRentBook * 0.08).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <span className="text-[10px] text-slate-400 block">Comissão de 8.0% sobre recebimento recorrente</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Percent className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Control Actions & Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3" id="payouts-controls">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(["Todos", "Ativo", "Em Atraso", "Renovação"] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveRentFilter(f)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeRentFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f === "Todos" ? "Todos os Contratos" : f}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowPayoutForm(!showPayoutForm)}
          className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
          id="btn-rent-form-trigger"
        >
          <PlusCircle className="w-4 h-4" /> Cadastrar Contrato de Locação
        </button>
      </div>

      {/* Cadastro de Aluguel Form */}
      {showPayoutForm && (
        <form onSubmit={handleCreateContract} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4" id="rentals-form">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">
            Novo Contrato de Aluguel Urbano / Rural
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Nome do Locatário / Inquilino</label>
              <input 
                type="text" 
                required
                value={newLoc.tenantName}
                onChange={(e) => setNewLoc({ ...newLoc, tenantName: e.target.value })}
                placeholder="Ex: João da Silva"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Nome do Proprietário / Locador</label>
              <input 
                type="text" 
                required
                value={newLoc.ownerName}
                onChange={(e) => setNewLoc({ ...newLoc, ownerName: e.target.value })}
                placeholder="Ex: Maria de Souza"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Imóvel Sede</label>
              <select
                value={newLoc.propertyTitle}
                onChange={(e) => setNewLoc({ ...newLoc, propertyTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none font-semibold"
              >
                <option value="Apartamento Premium Jardins #41">Apartamento Premium Jardins #41</option>
                <option value="Studio Loft Moema #108">Studio Loft Moema #108</option>
                <option value="Mansão Contemporânea Alphaville">Mansão Contemporânea Alphaville</option>
                <option value="Sítio Vista Verde">Sítio Vista Verde - Casa de Campo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Valor do Aluguel (R$ / Mês)</label>
              <input 
                type="number" 
                required
                value={newLoc.monthlyValue}
                onChange={(e) => setNewLoc({ ...newLoc, monthlyValue: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Garantia Locatícia Exigida</label>
              <select
                value={newLoc.guarantor}
                onChange={(e) => setNewLoc({ ...newLoc, guarantor: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
              >
                <option value="Seguro Fiança (Porto Seguro)">Seguro Fiança (Porto Seguro)</option>
                <option value="Caução Bancária (3 meses depositado)">Caução Bancária (3 meses depositado)</option>
                <option value="Fiador Tradicional (Com Imóvel registrado)">Fiador Tradicional (Com Imóvel registrado)</option>
                <option value="Sem Garantia (Aluguel Antecipado)">Sem Garantia (Aluguel Antecipado)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Status do Registro</label>
              <select
                value={newLoc.status}
                onChange={(e) => setNewLoc({ ...newLoc, status: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
              >
                <option value="Ativo">Ativo</option>
                <option value="Em Atraso">Em Atraso</option>
                <option value="Renovação">Renovação</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs font-bold pt-1">
            <button 
              type="button" 
              onClick={() => setShowPayoutForm(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-lg shadow-sm"
            >
              Salvar Contrato de Aluguel
            </button>
          </div>
        </form>
      )}

      {/* Contracts Table List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" id="rentals-table-container">
        <table className="w-full text-xs text-slate-700 text-left border-collapse" id="locacao-table">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5 pl-5">Nº Contrato / Imóvel</th>
              <th className="p-3.5">Locatário / Proprietário</th>
              <th className="p-3.5 text-right">Aluguel Corrente</th>
              <th className="p-3.5">Garantia Locatícia</th>
              <th className="p-3.5">Vencimento Boleto</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 pr-5 text-right">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {display.map(c => {
              const overdue = c.status === "Em Atraso";
              const inReneg = c.status === "Renovação";

              return (
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3.5 pl-5 font-semibold text-slate-800">
                    <span className="block text-[11px] text-slate-500 font-mono text-[10px]">ID: {c.id.toUpperCase()}</span>
                    <span className="text-xs">{c.propertyTitle}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="block font-bold text-slate-800">{c.tenantName}</span>
                    <span className="block text-[10px] text-slate-400">Prop: {c.ownerName}</span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-800">
                    {c.monthlyValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-500">
                    {c.guarantor}
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {c.dueDate}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      overdue 
                        ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse" 
                        : inReneg 
                        ? "bg-amber-100 text-amber-800 border border-amber-200" 
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex gap-2 items-center justify-end">
                      {overdue ? (
                        <button
                          onClick={() => handleUpdateStatus(c.id, "Ativo")}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 transition"
                          title="Confirmar pagamento mensalidade no ERP"
                        >
                          Quitar Boleto
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(c.id, "Em Atraso")}
                          className="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[10px] font-bold rounded border border-slate-205 transition"
                        >
                          Marcar Atraso
                        </button>
                      )}

                      {/* IGP-M apply adjust action btn */}
                      <button
                        onClick={() => handleApplyAdjustment(c.id, c.monthlyValue)}
                        className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-bold rounded border border-sky-150 transition flex items-center gap-0.5"
                        title="Reajustar IPCA / IGP-M (4.12% anual)"
                      >
                        <TrendingUp className="w-3 h-3 text-sky-500" /> Reajustar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Prestação de contas / Repasses automáticos advice panel */}
      <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl space-y-2 text-xs text-sky-900" id="rental-repasses-info">
        <h4 className="font-bold flex items-center gap-1.5 text-sky-800">
          <Clock className="w-4 h-4 text-sky-500" /> Repasse Automatizado ImobFluow
        </h4>
        <p className="leading-relaxed">
          Toda segunda semana útil do mês corrente, nosso ERP calcula automaticamente tarifas de administração (8.0%), deduz seguro fiança caso seja parceiro, e gera as ordens de repasse Pix diretamente à conta bancária de cada proprietário cadastrado, notificando-os pelo aplicativo e por e-mail com o respectivo extrato consolidado em anexo.
        </p>
      </div>

    </div>
  );
}
