import React, { useState } from "react";
import { 
  Plus, 
  Sparkles, 
  MoreVertical, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  Info,
  UserPlus2,
  Trash2,
  Zap,
  ArrowRight
} from "lucide-react";
import { Lead } from "../types";

interface KanbanViewProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
  onNavigateToAI: (selectedLead: Lead) => void;
}

export default function KanbanView({ leads, onUpdateLeads, onNavigateToAI }: KanbanViewProps) {
  // Toggle between the 3 Multi-Kanban stages
  const [activeBoard, setActiveBoard] = useState<"atendimento" | "oportunidade" | "posvenda">("atendimento");

  // Form for adding a new lead
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadSource, setNewLeadSource] = useState("Instagram Ads");
  const [newLeadStage, setNewLeadStage] = useState("Novo Lead");

  // Filter state
  const [filterSource, setFilterSource] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todos");

  // Column arrangements according to the prompt spec
  const columnsByBoard = {
    atendimento: [
      "Novo Lead",
      "Recebido",
      "Atendimento IA",
      "Atendimento Humano",
      "Qualificado",
      "Desqualificado"
    ],
    oportunidade: [
      "Oportunidade Criada",
      "Visita Agendada",
      "Visita Realizada",
      "Proposta",
      "Negociação",
      "Contrato",
      "Fechado Ganho",
      "Fechado Perdido"
    ],
    posvenda: [
      "Documentação",
      "Financiamento",
      "Escritura",
      "Entrega",
      "Pós-Venda"
    ]
  };

  const availableStages = columnsByBoard[activeBoard];

  // Filtered list
  const displayLeads = leads.filter(lead => {
    if (lead.kanbanType !== activeBoard) return false;
    if (filterSource !== "Todos" && lead.source !== filterSource) return false;
    if (filterCategory !== "Todos" && lead.category !== filterCategory) return false;
    return true;
  });

  // Action: Add new lead to the pipeline
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const colors = [
      "bg-blue-50 text-blue-700 font-bold", 
      "bg-emerald-50 text-emerald-700 font-bold", 
      "bg-purple-50 text-purple-700 font-bold", 
      "bg-amber-50 text-amber-700 font-bold", 
      "bg-rose-50 text-rose-700 font-bold"
    ];
    const itemColor = colors[Math.floor(Math.random() * colors.length)];

    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadName,
      phone: newLeadPhone || "(11) 99999-0000",
      source: newLeadSource,
      stage: activeBoard === "atendimento" ? newLeadStage : availableStages[0],
      kanbanType: activeBoard,
      score: activeBoard === "atendimento" ? 20 : 75,
      category: activeBoard === "atendimento" ? "Frio" : "Morno",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      avatarColor: itemColor,
      profile: {
        city: "",
        bairro: "",
        tipo: "",
        faixaInvestimento: "",
        formaPagamento: "",
        prazoCompra: "",
        perfilComprador: ""
      }
    };

    onUpdateLeads([created, ...leads]);
    setNewLeadName("");
    setNewLeadPhone("");
    setShowAddForm(false);
  };

  // Move lead stage
  const moveLead = (leadId: string, nextStage: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        // Adjust score slightly based on stage advancement
        let updatedScore = l.score;
        let updatedCat = l.category;
        
        if (nextStage === "Qualificado") {
          updatedScore = Math.max(76, updatedScore);
          updatedCat = "Quente";
        } else if (nextStage === "Desqualificado") {
          updatedScore = Math.min(30, updatedScore);
          updatedCat = "Frio";
        }

        return { ...l, stage: nextStage, score: updatedScore, category: updatedCat };
      }
      return l;
    });
    onUpdateLeads(updated);
  };

  // Convert/promote qualified lead from 'Atendimento' board to 'Oportunidades' board
  const promoteToOportunidade = (lead: Lead) => {
    // If the user attempts to promote a cold/warm lead directly, notify of rules
    if (lead.category !== "Quente") {
      alert(`Regra Estratégica ImobFluow: O lead "${lead.name}" está com status "${lead.category}" (Score: ${lead.score}). Somente leads pré-qualificados ou qualificados através do Atendimento (Score mínimo de 75) podem prosseguir no pipeline para evitar a poluição do pipeline comercial!`);
      return;
    }

    const updated = leads.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          kanbanType: "oportunidade" as const,
          stage: "Oportunidade Criada",
          score: Math.max(75, l.score)
        };
      }
      return l;
    });
    onUpdateLeads(updated);
  };

  // Convert opportunity to Pós-venda
  const promoteToPosVenda = (lead: Lead) => {
    const updated = leads.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          kanbanType: "posvenda" as const,
          stage: "Documentação"
        };
      }
      return l;
    });
    onUpdateLeads(updated);
  };

  // Delete lead helper
  const deleteLead = (leadId: string) => {
    if (confirm("Deseja realmente remover este lead do sistema?")) {
      onUpdateLeads(leads.filter(l => l.id !== leadId));
    }
  };

  // Render a single lead card
  const renderLeadCard = (lead: Lead) => {
    const isHot = lead.category === "Quente";
    const isWarm = lead.category === "Morno";
    const isCold = lead.category === "Frio";

    let labelClass = "bg-slate-100 text-slate-700";
    if (isHot) labelClass = "bg-rose-50 text-rose-600 font-bold border border-rose-200";
    if (isWarm) labelClass = "bg-amber-50 text-amber-700 border border-amber-200";
    if (isCold) labelClass = "bg-sky-50 text-sky-700";

    return (
      <div 
        key={lead.id} 
        className={`bg-white rounded-lg p-3.5 border border-slate-200 hover:shadow-md transition-all group ${
          isHot ? "border-l-4 border-l-rose-500 shadow-sm" : isWarm ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-sky-400"
        }`}
        id={`card-${lead.id}`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${lead.avatarColor}`}>
              {lead.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">{lead.name}</span>
              <span className="text-[10px] text-slate-400 block">{lead.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => deleteLead(lead.id)}
              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
              title="Excluir"
              id={`btn-del-${lead.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lead profile chips */}
        <div className="mt-2.5 space-y-1.5" id={`profile-chips-${lead.id}`}>
          {lead.profile && lead.profile.tipo && (
            <div className="text-[10px] text-slate-600 flex items-center gap-1">
              <span className="font-semibold text-slate-400">Pref:</span> 
              <span className="bg-slate-100 px-1 rounded truncate max-w-[160px]">{lead.profile.tipo} &bull; {lead.profile.city || "Geral"}</span>
            </div>
          )}
          {lead.profile && lead.profile.faixaInvestimento && (
            <div className="text-[10px] text-slate-600 flex items-center gap-1">
              <span className="font-semibold text-slate-400">Verba:</span>
              <span className="bg-emerald-50 text-emerald-800 font-semibold px-1 rounded">{lead.profile.faixaInvestimento}</span>
            </div>
          )}
        </div>

        {/* Dynamic status line or IA summary if present */}
        {lead.stage === "Atendimento IA" && (
          <div className="mt-2 text-[10px] bg-sky-50 text-sky-800 p-2 rounded border border-sky-100 flex items-start gap-1">
            <Sparkles className="w-3 h-3 text-sky-500 shrink-0 mt-0.5" />
            <p className="italic leading-relaxed">"IA respondendo. Coletando perfil de interesse rural..."</p>
          </div>
        )}

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
          {/* Label indicating score/temperature */}
          <div className="flex items-center gap-1">
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${labelClass}`}>
              {lead.category.toUpperCase()} {lead.score} pts
            </span>
          </div>

          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{lead.source}</div>
        </div>

        {/* Actions section based on the current board context */}
        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-100 flex items-center justify-between gap-1 flex-wrap bg-slate-50/50 p-1.5 rounded">
          <span className="text-[9px] text-slate-400">Mover para:</span>
          
          <div className="flex gap-1.5 items-center">
            {availableStages.filter(st => st !== lead.stage).slice(0, 2).map(nextS => (
              <button
                key={nextS}
                onClick={() => moveLead(lead.id, nextS)}
                className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-800 text-slate-500 font-medium rounded transition"
                id={`btn-move-${lead.id}-${nextS}`}
              >
                {nextS}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Promotion buttons */}
        {activeBoard === "atendimento" && isHot && (
          <button
            onClick={() => promoteToOportunidade(lead)}
            className="w-full mt-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-[10px] font-bold rounded shadow-sm flex items-center justify-center gap-1 transition-all"
            id={`btn-promote-op-${lead.id}`}
          >
            <Zap className="w-3 h-3 fill-amber-300 stroke-none" /> PROMOVER A OPORTUNIDADE
          </button>
        )}

        {activeBoard === "oportunidade" && lead.stage === "Contrato" && (
          <button
            onClick={() => promoteToPosVenda(lead)}
            className="w-full mt-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold rounded shadow-sm flex items-center justify-center gap-1"
            id={`btn-promote-pv-${lead.id}`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-300" /> ENVIAR PARA PÓS-VENDA
          </button>
        )}

        {/* Action: talk with IA option */}
        <button
          onClick={() => onNavigateToAI(lead)}
          className="w-full mt-1.5 py-1 text-sky-600 bg-sky-50/30 hover:bg-sky-50 text-[10px] font-bold rounded border border-sky-100 flex items-center justify-center gap-1"
          id={`btn-chat-ia-${lead.id}`}
        >
          <Sparkles className="w-3 h-3 text-sky-500" /> Atendimento Assistido IA
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4" id="kanban-wrapper">
      
      {/* Header com os 3 Multi-Kanbans */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" id="multi-kanban-nav">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600">ImobFluow Pipeline Control</span>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Arquitetura de Multi-Kanbans Blindados</h2>
        </div>

        {/* Os 3 botões dos pipelines */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto" id="kanban-selector">
          <button 
            onClick={() => { setActiveBoard("atendimento"); setShowAddForm(false); }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-xs transition duration-150 flex items-center justify-center gap-2 ${
              activeBoard === "atendimento" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            id="tab-kb-atendimento"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            1. Atendimento ({leads.filter(l => l.kanbanType === "atendimento").length})
          </button>
          <button 
            onClick={() => { setActiveBoard("oportunidade"); setShowAddForm(false); }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-xs transition duration-150 flex items-center justify-center gap-2 ${
              activeBoard === "oportunidade" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            id="tab-kb-oportunidade"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            2. Oportunidades ({leads.filter(l => l.kanbanType === "oportunidade").length})
          </button>
          <button 
            onClick={() => { setActiveBoard("posvenda"); setShowAddForm(false); }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-xs transition duration-150 flex items-center justify-center gap-2 ${
              activeBoard === "posvenda" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            id="tab-kb-posvenda"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            3. Pós-Venda ({leads.filter(l => l.kanbanType === "posvenda").length})
          </button>
        </div>
      </div>

      {/* Regra de Ouro da Qualificação */}
      {activeBoard === "atendimento" && (
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-sky-800" id="tactical-rule-msg">
          <Info className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Regra Estratégica da Plataforma:</span> Todos os novos contatos de portais (Zap, OLX, Ads) entram obrigatoriamente nesta fase de <strong>Qualificação de Leads</strong>. O lead só pode progredir para o pipeline de "Oportunidades" se possuir pontuação <strong>quente (&gt;75)</strong>, garantindo corretores focados apenas em quem tem real capacidade e interesse de compra imediata.
          </div>
        </div>
      )}

      {/* Filtros e Controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl" id="kanban-filters">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs">
            <label className="text-slate-500 mr-2">Origem:</label>
            <select 
              value={filterSource} 
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-2 py-1 bg-slate-50 text-slate-700 text-xs rounded border border-slate-200 outline-none focus:ring-1 focus:ring-sky-500"
              id="flt-kb-source"
            >
              <option value="Todos">Todas as Origens</option>
              <option value="Zap Imóveis">Zap Imóveis</option>
              <option value="Instagram Ads">Instagram Ads</option>
              <option value="Google Ads">Google Ads</option>
              <option value="WhatsApp Orgânico">WhatsApp Orgânico</option>
            </select>
          </div>

          <div className="text-xs">
            <label className="text-slate-500 mr-2">Temperatura:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 bg-slate-50 text-slate-700 text-xs rounded border border-slate-200 outline-none focus:ring-1 focus:ring-sky-500"
              id="flt-kb-temp"
            >
              <option value="Todos">Todas as Categorias</option>
              <option value="Frio">Frio</option>
              <option value="Morno">Morno</option>
              <option value="Quente">Quente</option>
            </select>
          </div>
        </div>

        {/* Botão de Adição Rápida */}
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
          id="btn-trigger-add-lead"
        >
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      {/* Formulário de Adição Rápida de Lead */}
      {showAddForm && (
        <form onSubmit={handleAddLead} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3" id="form-add-lead">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cadastrar Lead Manualmente ({activeBoard.toUpperCase()})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-500 block mb-1">Nome Completo</label>
              <input 
                type="text" 
                required
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                placeholder="Ex: Carlos Augusto"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none focus:ring-1 focus:ring-sky-500"
                id="input-add-name"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">WhatsApp / Telefone</label>
              <input 
                type="text" 
                value={newLeadPhone}
                onChange={(e) => setNewLeadPhone(e.target.value)}
                placeholder="Ex: (11) 98888-7711"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none focus:ring-1 focus:ring-sky-500"
                id="input-add-phone"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Central de Entrada</label>
              <select 
                value={newLeadSource}
                onChange={(e) => setNewLeadSource(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none focus:ring-1 focus:ring-sky-500"
                id="select-add-source"
              >
                <option value="Instagram Ads">Instagram Ads</option>
                <option value="Zap Imóveis">Zap Imóveis</option>
                <option value="Google Ads">Google Ads</option>
                <option value="WhatsApp Orgânico">WhatsApp Orgânico</option>
                <option value="OLX">OLX</option>
              </select>
            </div>
          </div>

          {activeBoard === "atendimento" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Coluna Inicial no Atendimento</label>
                <select 
                  value={newLeadStage}
                  onChange={(e) => setNewLeadStage(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none focus:ring-1 focus:ring-sky-500"
                  id="select-add-col"
                >
                  <option value="Novo Lead">Novo Lead</option>
                  <option value="Recebido">Recebido</option>
                  <option value="Atendimento IA">Atendimento IA</option>
                  <option value="Atendimento Humano">Atendimento Humano</option>
                </select>
              </div>
              <div className="flex items-end justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-300"
                  id="btn-cancel-add"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded"
                  id="btn-submit-add"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </div>
          )}

          {activeBoard !== "atendimento" && (
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-300"
                id="btn-cancel-add-alt"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded"
                id="btn-submit-add-alt"
              >
                Confirmar Cadastro
              </button>
            </div>
          )}
        </form>
      )}

      {/* Grid Kanban do Quadro Ativo */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-x-auto pb-4 pt-1" 
        id="kanban-columns-grid"
      >
        {availableStages.map(stageName => {
          const colLeads = displayLeads.filter(l => l.stage === stageName);
          return (
            <div 
              key={stageName} 
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-3 min-w-[240px] max-h-[600px]"
              id={`col-${stageName.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {/* Header da Coluna */}
              <div className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    stageName === "Novo Lead" || stageName === "Oportunidade Criada" || stageName === "Documentação"
                      ? "bg-blue-500" 
                      : stageName === "Qualificado" || stageName === "Fechado Ganho" || stageName === "Pós-Venda"
                      ? "bg-emerald-500"
                      : stageName === "Desqualificado" || stageName === "Fechado Perdido"
                      ? "bg-rose-500"
                      : "bg-amber-400"
                  }`} />
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{stageName}</span>
                </div>
                <span className="text-[11px] font-black text-slate-400 bg-slate-100 h-5 w-5 rounded-full flex items-center justify-center">
                  {colLeads.length}
                </span>
              </div>

              {/* Lista dos leads na coluna */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[160px] max-h-[500px]">
                {colLeads.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8 border-2 border-dashed border-slate-200 rounded-lg bg-white/40">
                    <HelpCircle className="w-5 h-5 text-slate-300 mb-1" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Sem leads</span>
                  </div>
                ) : (
                  colLeads.map(lead => renderLeadCard(lead))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
