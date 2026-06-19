import React, { useState } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  User, 
  Phone, 
  DollarSign, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Search, 
  Check, 
  FileText,
  Building2,
  TrendingUp,
  Brain,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Lead } from "../types";

interface LeadIntelligenceProps {
  leads: Lead[];
  onUpdateLeads: (newLeads: Lead[]) => void;
  mode: "urbana" | "rural";
  subTab: "quiz" | "leads";
}

export default function LeadIntelligence({ leads, onUpdateLeads, mode, subTab }: LeadIntelligenceProps) {
  // Navigation inside this tab if needed, but App.tsx will tell us which subTab to show

  // --- QUIZ STATE ---
  const [quizStep, setQuizStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "",
    propertyType: mode === "rural" ? "Fazenda de Grãos" : "Apartamento 3 Quartos",
    budget: "",
    payment: "À Vista / Financiado",
    timeframe: "Imediato",
    objective: "Moradia própria / Operação própria",
  });

  const [quizFeedback, setQuizFeedback] = useState<{ score: number; classification: "Quente" | "Morno" | "Frio" } | null>(null);

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizFeedback(null);
    setFormData({
      name: "",
      phone: "",
      region: "",
      propertyType: mode === "rural" ? "Fazenda de Grãos" : "Apartamento 3 Quartos",
      budget: "",
      payment: "À Vista / Financiado",
      timeframe: "Imediato",
      objective: "Moradia própria / Operação própria",
    });
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate dynamic smart score
    let baseScore = 40;
    if (formData.timeframe === "Imediato") baseScore += 30;
    if (formData.timeframe === "Até 3 meses") baseScore += 20;
    if (formData.payment === "À Vista" || formData.payment === "À Vista / Financiado") baseScore += 20;
    if (formData.budget.includes("M") || formData.budget.includes("Milhões") || parseInt(formData.budget.replace(/\D/g, "")) > 1000000) baseScore += 10;
    
    const score = Math.min(99, baseScore);
    const classification = score >= 80 ? "Quente" : score >= 50 ? "Morno" : "Frio";

    // Create custom lead
    const newLead: Lead = {
      id: `L-${Date.now().toString().slice(-4)}`,
      name: formData.name || "Lead Anônimo Qualificado",
      phone: formData.phone || "(11) 99999-9999",
      source: "Quiz Onboarding",
      stage: "atendimento",
      kanbanType: "atendimento",
      score: score,
      category: classification,
      createdAt: new Date().toLocaleDateString("pt-BR"),
      avatarColor: mode === "rural" ? "emerald" : "orange",
      profile: {
        city: formData.region || "Goiânia / GO",
        bairro: formData.objective,
        tipo: formData.propertyType,
        faixaInvestimento: formData.budget || "R$ 800.500",
        formaPagamento: formData.payment,
        prazoCompra: formData.timeframe,
        perfilComprador: classification + " Onboarding"
      }
    };

    onUpdateLeads([newLead, ...leads]);
    setQuizFeedback({ score, classification });
    setQuizStep(4); // Shows gorgeous feedback screen
  };

  // Filter leads that come from our diagnostic quiz or have high significance
  const qualifiedLeadsList = leads.filter(l => l.score >= 50 || l.source === "Quiz Onboarding");

  return (
    <div className="space-y-6" id="lead-intelligence-wrapper">
      
      {/* Visual Header containing unified style */}
      <div className={`p-6 bg-white border rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        mode === "rural" ? "border-emerald-100" : "border-orange-100"
      }`}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[9px] uppercase font-black text-white rounded ${
              mode === "rural" ? "bg-emerald-600" : "bg-orange-600"
            }`}>
              Inteligência de Leads
            </span>
            <span className="bg-slate-50 text-[10px] text-slate-400 font-bold border border-slate-200 px-1.5 py-0.5 rounded">
              v2.1 Qualificador Unificado
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {subTab === "quiz" ? "Quiz de Demanda de Lead" : "Painel de Leads Qualificados"}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {subTab === "quiz" 
              ? "Formulário inteligente e dinâmico para mapear o perfil, capital físico e urgência real do comprador."
              : "Visão centralizada de clientes quentes qualificados com relatórios de preferências."
            }
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-500 px-2 font-bold uppercase tracking-wider">Mapeados globalmente: <strong className="text-slate-800">{qualifiedLeadsList.length} leads</strong></p>
        </div>
      </div>

      {subTab === "quiz" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="quiz-interaction-container">
          
          {/* Main Quiz Flow Panel */}
          <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Step Indicators */}
            {quizStep < 4 && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                    quizStep >= 0 
                      ? (mode === "rural" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850") 
                      : "bg-slate-100 text-slate-400"
                  }`}>1</span>
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline">Identificação</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-3" />
                <div className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                    quizStep >= 1 
                      ? (mode === "rural" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850") 
                      : "bg-slate-100 text-slate-400"
                  }`}>2</span>
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline">Local &amp; Objetivo</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-3" />
                <div className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                    quizStep >= 2 
                      ? (mode === "rural" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850") 
                      : "bg-slate-100 text-slate-400"
                  }`}>3</span>
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline">Orçamento &amp; Prazo</span>
                </div>
              </div>
            )}

            {/* Step 1: Identificação Básica */}
            {quizStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Dados de Identificação</h3>
                  <p className="text-xs text-slate-500">Comece coletando as informações de contato do seu comprador em potencial.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo do Lead:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: João da Silva Reis"
                        className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp de Contato:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    disabled={!formData.name || !formData.phone}
                    onClick={() => setQuizStep(1)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      formData.name && formData.phone
                        ? (mode === "rural" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white")
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Mapear Local &raquo;
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Local & Propriedades preferidas */}
            {quizStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Foco e Região de Interesse</h3>
                  <p className="text-xs text-slate-500">Mapeie as preferências estruturais de tipo de ativo desejado pelo cliente.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cidade / Região Desejada:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        placeholder={mode === "rural" ? "Ex: Rio Verde / GO, Sorocaba / SP" : "Ex: Moema / SP, Leblon / RJ"}
                        className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Propriedade Preferida:</label>
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                    >
                      {mode === "rural" ? (
                        <>
                          <option value="Fazenda de Grãos">Fazenda de Grãos (Soja/Milho)</option>
                          <option value="Sítio / Chácara Recreativa">Sítio / Chácara Recreativa</option>
                          <option value="Área de Silvicultura">Área de Silvicultura / Eucalipto</option>
                          <option value="Gleba Agroindustrial">Gleba Agroindustrial</option>
                        </>
                      ) : (
                        <>
                          <option value="Apartamento 3 Quartos">Apartamento 3 Quartos</option>
                          <option value="Cobertura Duplex">Cobertura Duplex</option>
                          <option value="Casa em Condomínio Fechado">Casa em Condomínio Fechado</option>
                          <option value="Lote / Terreno Residencial">Lote / Terreno Residencial</option>
                          <option value="Sala Comercial">Sala Comercial</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Objetivo de Aquisição:</label>
                    <input 
                      type="text" 
                      value={formData.objective}
                      onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                      placeholder="Ex: Morar com a família, expandir safra anual, investimento passivo"
                      className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    onClick={() => setQuizStep(0)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Voltar
                  </button>
                  <button 
                    disabled={!formData.region || !formData.objective}
                    onClick={() => setQuizStep(2)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      formData.region && formData.objective
                        ? (mode === "rural" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white")
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Mapear Viabilidade &raquo;
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Orçamento & Prazo */}
            {quizStep === 2 && (
              <form onSubmit={handleQuizSubmit} className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Poder Financeiro e Velocidade</h3>
                  <p className="text-xs text-slate-500">Determine o fôlego comercial e o prazo de tomada de decisão do lead.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Aproximação de Orçamento / Capital:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder={mode === "rural" ? "Ex: R$ 4.500.000" : "Ex: R$ 950.000"}
                        className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                      />
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Forma de Pagamento Pretendida:</label>
                    <select 
                      value={formData.payment}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:border-slate-350 font-medium"
                    >
                      <option value="À Vista">À Vista (Total do recurso livre)</option>
                      <option value="À Vista / Financiado">À Vista com Financiamento Imobiliário</option>
                      <option value="Parcelamento Direto">Parcelamento Direto / Safras Futuras</option>
                      <option value="Aceita Permuta">Aceita Imóvel de Menor Valor em Permuta</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Prazo para Fechar Negócio:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Urgente (Imediato)", val: "Imediato", icon: Sparkles },
                        { label: "Até 3 meses", val: "Até 3 meses", icon: Clock },
                        { label: "Apenas pesquisando", val: "Apenas pesquisando", icon: HelpCircle }
                      ].map(item => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, timeframe: item.val })}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                            formData.timeframe === item.val
                              ? (mode === "rural" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-orange-50 border-orange-200 text-orange-850")
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setQuizStep(1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Voltar
                  </button>
                  <button 
                    disabled={!formData.budget}
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm ${
                      formData.budget
                        ? (mode === "rural" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-50" : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-50")
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Calcular Score &amp; Qualificar Lead &raquo;
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Gorgeous Onboarding Quiz Success Screening with interactive variables */}
            {quizStep === 4 && quizFeedback && (
              <div className="space-y-6 text-center py-6 animate-fade-in">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                    quizFeedback.classification === "Quente" ? "bg-red-50 text-red-650" : "bg-amber-50 text-amber-600"
                  } shadow-inner`}>
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 font-sans uppercase">Lead Qualificado com Sucesso!</h3>
                  <p className="text-xs text-slate-500 max-w-md">O cliente respondeu todas as diretrizes de compliance do seu funil e foi pontuado em tempo real pelo analisador da ImobFluow.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SCORE DO COGNITIVO</span>
                    <span className={`text-xl font-black ${
                      quizFeedback.classification === "Quente" ? "text-red-650" : "text-amber-600"
                    }`}>
                      {quizFeedback.score} / 100
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150 text-xs">
                    <span className="text-slate-500 font-bold">Classificação:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                      quizFeedback.classification === "Quente" ? "bg-red-500" : "bg-amber-500"
                    }`}>
                      {quizFeedback.classification}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-left border-t border-slate-200 pt-3 text-xs text-slate-700">
                    <p><strong>Nome:</strong> {formData.name}</p>
                    <p><strong>WhatsApp:</strong> {formData.phone}</p>
                    <p><strong>Região Desejada:</strong> {formData.region}</p>
                    <p><strong>Tipo de Ativo:</strong> {formData.propertyType}</p>
                    <p><strong>Orçamento Estimativo:</strong> {formData.budget}</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={resetQuiz}
                    className="bg-white border border-slate-250 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Simular Novo Quiz
                  </button>
                  <button 
                    onClick={() => {
                      alert("Conversão disparada: Lead adicionado ao topo do Kanban de Atendimento.");
                      resetQuiz();
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition ${
                      mode === "rural" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-600 hover:bg-orange-700"
                    }`}
                  >
                    Visualizar Leads Qualificados
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right sidebar info panel */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-slate-500" /> Funcionamento do Funil
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Este diagnóstico substitui questionários estáticos e entediantes. Ele se alimenta de dados em tempo real para pontuar cada resposta de maneira autônoma.
              </p>
              
              <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
                <div className="flex gap-2">
                  <span className="text-emerald-600 font-extrabold">&bull;</span>
                  <p className="text-[10px] text-slate-500 font-medium"><strong>SDR Integration</strong>: Leads classificados como Quentes recebem triagem automática do WhatsApp comercial.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-600 font-extrabold">&bull;</span>
                  <p className="text-[10px] text-slate-500 font-medium"><strong>Matchmaking Ativo</strong>: Cruzamento imediato com lotes urbanos, residenciais ou fazendas cadastradas na sua base de inventário.</p>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border bg-white space-y-3 ${
              mode === "rural" ? "border-emerald-100" : "border-orange-100"
            }`}>
              <h4 className="font-bold text-xs text-slate-800">Visualização em Tempo Real</h4>
              <p className="text-[11px] text-slate-500">Ao finalizar a qualificação acima, o perfil do comprador é salvo e renderizado no painel lateral oposto.</p>
              <div className="h-24 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aguardando Execução</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* PANEL: Leads Qualificados (Detailed onboarding results for clients) */
        <div className="space-y-6 animate-fade-in" id="leads-qualificados-dashboard">
          
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800">Pipeline de Leads Qualificados via Quiz Corporativo</h3>
                <p className="text-xs text-slate-500">Compradores com scoring elevado e mapeamento de demandas físicas finalizado.</p>
              </div>
              
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar lead qualificado..." 
                  className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:border-slate-350"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700 text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 select-none">
                  <tr>
                    <th className="p-3">Nome do Cliente</th>
                    <th className="p-3">Canal / Origem</th>
                    <th className="p-3 text-center">Score Calculado</th>
                    <th className="p-3">Nicho &amp; Tipologia</th>
                    <th className="p-3">Capital Pretendido</th>
                    <th className="p-3">Prazo Tomada</th>
                    <th className="p-3 text-right">Contato &amp; Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {qualifiedLeadsList.map(lead => {
                    const isHot = lead.score >= 80;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-full font-bold text-[11px] flex items-center justify-center border uppercase shadow-sm ${
                              lead.category === "Quente" 
                                ? "bg-red-50 border-red-100 text-red-700" 
                                : lead.category === "Morno" 
                                ? "bg-amber-50 border-amber-100 text-amber-700" 
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}>
                              {lead.name.slice(0, 2)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-xs">{lead.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono font-bold block">{lead.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600">
                            {lead.source}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`text-sm font-black ${
                              isHot ? "text-red-650" : lead.score >= 60 ? "text-amber-600" : "text-slate-500"
                            }`}>
                              {lead.score} pts
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                              {lead.category}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <span className="text-slate-800 font-sans block text-xs font-bold">{lead.profile?.tipo || "Apartamento Médio"}</span>
                            <span className="text-[10px] text-slate-400 block font-semibold">{lead.profile?.city || "Cidade N/I"}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-800 font-black">
                            {lead.profile?.faixaInvestimento || "R$ 450.000"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs font-bold text-slate-600">
                            {lead.profile?.prazoCompra || "Até 3 meses"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => alert(`Disparando Whatsapp comercial automatizado para ${lead.name} no número ${lead.phone}`)}
                              className="p-1.5 bg-[#25D366]/10 text-[#075E54] border border-[#25D366]/20 hover:bg-[#25D366]/20 rounded-lg text-xs font-bold transition flex items-center gap-1"
                              title="Suporte: Falar via WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="text-[10px]">WhatsApp</span>
                            </button>
                            <button
                              onClick={() => alert(`Analisando perfil cognitivo do lead via IA da ImobFluow...`)}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold transition flex items-center gap-1"
                              title="Gerar IA Profile"
                            >
                              <Brain className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Perfil IA</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* Detailed Diagnostic Insights Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-orange-600" /> Prospecção Demográfica &amp; Preferências
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Nossos leads qualificados demonstram interesse expressivo em bairros com alta taxa de valorização (VIP) e propriedades rurais com documentação legal ambiental já validada.
              </p>
              <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Região Líder:</span>
                  <span>Gleba Oeste &amp; Moema / SP</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Faixa de Capital Média:</span>
                  <span>R$ 1.2M &mdash; R$ 4.5M</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> SLA de Resposta e Conversão
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Monitore o atendimento comercial. Leads quentes com SLA de resposta inferior a 15 minutos convertem até 8x mais do que a média dos concorrentes.
              </p>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${mode === "rural" ? "bg-emerald-600 w-[78%]" : "bg-orange-500 w-[65%]"}`} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Meta Conversão: {mode === "rural" ? "78%" : "65%"}</span>
                <span>Objetivo: 85%</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
