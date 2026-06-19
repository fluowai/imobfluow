import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  User, 
  FolderDown, 
  Calculator, 
  Scale, 
  DollarSign, 
  PlusCircle, 
  ShieldCheck, 
  Users, 
  FileCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { Lead, Property, ContractDraft } from "../types";

interface AIViewProps {
  leads: Lead[];
  selectedLeadFromNav?: Lead | null;
  onUpdateLeads: (leads: Lead[]) => void;
}

export default function AIView({ leads, selectedLeadFromNav, onUpdateLeads }: AIViewProps) {
  // Sub-tabs for the different IA core engines
  const [activeSubTab, setActiveSubTab] = useState<"sdr" | "comercial" | "juridico" | "financeiro">("sdr");

  // State: Lead selected for the active context
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  useEffect(() => {
    if (selectedLeadFromNav) {
      setSelectedLeadId(selectedLeadFromNav.id);
      setActiveSubTab("sdr");
    } else if (leads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(leads[0].id);
    }
  }, [selectedLeadFromNav, leads]);

  // 1. SDR IA Simulator State
  const [sdrChatInput, setSdrChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ia"; text: string }>>([
    { sender: "ia", text: "Olá! Sou a Inteligência de Atendimento e SDR da ImobFluow. Meu objetivo é extrair o perfil do cliente e qualificá-lo de forma natural. Diga-me, o que o seu lead Thiago ou Fernando mandou no chat?" }
  ]);
  const [isSdrLoading, setIsSdrLoading] = useState(false);

  // 2. Comercial IA State
  const [comercialActiveCategory, setComercialActiveCategory] = useState("urbano");
  const [comercialResult, setComercialResult] = useState<any | null>(null);
  const [isComercialLoading, setIsComercialLoading] = useState(false);

  // 3. Jurídico IA State
  const [contractType, setContractType] = useState("Compra e Venda Residencial");
  const [parties, setPartes] = useState("Thiago Mendes (Vendedor) e Camila Prado (Compradora)");
  const [dealValue, setDealValue] = useState("R$ 850.000,00 à vista com sinal de 10%");
  const [propertyLocation, setPropertyLocation] = useState("Rua dos Pinheiros, 120, Apto 41 - Pinheiros, São Paulo - SP");
  const [customClausules, setCustomClausules] = useState("Reajuste anual pelo IPCA. Caução locatícia de 3 meses se aluguel.");
  const [draftResult, setDraftResult] = useState<ContractDraft | null>(null);
  const [isJuridicoLoading, setIsJuridicoLoading] = useState(false);

  // 4. Financeiro IA State
  const [finReceitas, setFinReceitas] = useState("145000");
  const [finDespesas, setFinDespesas] = useState("38000");
  const [finInadimplencia, setFinInadimplencia] = useState("4.8");
  const [financeiroResult, setFinanceiroResult] = useState<any | null>(null);
  const [isFinanceiroLoading, setIsFinanceiroLoading] = useState(false);

  // Alert/Status Box
  const [systemHasGeminiKey, setSystemHasGeminiKey] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(d => setSystemHasGeminiKey(d.hasKey))
      .catch(() => setSystemHasGeminiKey(false));
  }, []);

  // Action: SDR Chat message submission
  const handleSendSDRMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sdrChatInput.trim() || !activeLead) return;

    const userMsg = sdrChatInput;
    setSdrChatInput("");
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsSdrLoading(true);

    try {
      const response = await fetch("/api/gemini/sdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory,
          currentProfile: activeLead.profile
        })
      });

      if (!response.ok) throw new Error("Erro de comunicação do servidor.");
      const data = await response.json();

      setChatHistory(prev => [...prev, { sender: "ia", text: data.reply }]);
      
      // Crucial: Update our main React state for leads
      const updatedLeads = leads.map(l => {
        if (l.id === activeLead.id) {
          return {
            ...l,
            score: data.score,
            category: data.category,
            profile: {
              ...l.profile,
              city: data.profile.city || l.profile.city,
              bairro: data.profile.bairro || l.profile.bairro,
              tipo: data.profile.tipo || l.profile.tipo,
              faixaInvestimento: data.profile.faixaInvestimento || l.profile.faixaInvestimento,
              formaPagamento: data.profile.formaPagamento || l.profile.formaPagamento,
              prazoCompra: data.profile.prazoCompra || l.profile.prazoCompra,
              perfilComprador: data.profile.perfilComprador || l.profile.perfilComprador,
            }
          };
        }
        return l;
      });

      onUpdateLeads(updatedLeads);

    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { sender: "ia", text: `Ops, erro ao consultar: ${err.message}` }]);
    } finally {
      setIsSdrLoading(false);
    }
  };

  // Action: Request Comercial Recommendation
  const handleGetComercialAdvice = async () => {
    if (!activeLead) return;
    setIsComercialLoading(true);

    try {
      const response = await fetch("/api/gemini/assist/comercial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadProfile: activeLead.profile,
          activeFilters: { targetType: comercialActiveCategory }
        })
      });

      if (!response.ok) throw new Error("Falha no serviço comercial.");
      const data = await response.json();
      setComercialResult(data);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setIsComercialLoading(false);
    }
  };

  // Action: Generate Legal minute draft
  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJuridicoLoading(true);

    try {
      const response = await fetch("/api/gemini/assist/juridico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoContrato: contractType,
          nomes: parties,
          valor: dealValue,
          local: propertyLocation,
          detalhesAdicionais: customClausules
        })
      });

      if (!response.ok) throw new Error("Erro no assistente jurídico.");
      const data = await response.json();
      setDraftResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsJuridicoLoading(false);
    }
  };

  // Action: Calculate and evaluate Finance metrics
  const handleAnalyzeFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinanceiroLoading(true);

    try {
      const response = await fetch("/api/gemini/assist/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalReceitas: finReceitas,
          totalDespesas: finDespesas,
          comissaoGeral: "6%",
          inadimplenciaTaxa: `${finInadimplencia}%`
        })
      });

      if (!response.ok) throw new Error("Erro no assistente financeiro.");
      const data = await response.json();
      setFinanceiroResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFinanceiroLoading(false);
    }
  };

  // Prompt Preset questions helper to feed organic conversational chats
  const applyPresetInput = (text: string) => {
    setSdrChatInput(text);
  };

  return (
    <div className="space-y-6" id="aiview-root">
      
      {/* Top Warning regarding Sandbox secrets key if missing */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
        systemHasGeminiKey 
          ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
          : "bg-amber-50 text-amber-800 border-amber-100"
      }`} id="ai-provider-badge">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500 fill-sky-200 animate-spin" />
          <div>
            <p className="font-bold">
              {systemHasGeminiKey 
                ? "Motor Ativo: Inteligência Artificial Gemini 3.5 Flash Oficial Conectada!" 
                : "Aviso: Sem Chave de API ativa (Utilizando gerador preditivo local)."
              }
            </p>
            <p className="opacity-90">
              {systemHasGeminiKey 
                ? "Respostas geradas em tempo real com leitura do histórico e formulação de propostas de vendas brasileiras."
                : "A plataforma opera no modo simulador para permitir decolagem imediata sem cadastro de cartões ou chaves nos Segredos."
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 bg-slate-900 text-white rounded font-mono font-black uppercase text-[10px]">
            {systemHasGeminiKey ? "PRO MODE" : "SIMULADOR OFF"}
          </span>
        </div>
      </div>

      {/* Main Grid: Control Bar on Left / Output context on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR DA ESQUERDA: Escolha do Mecanismo & Seleção de Lead */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Navegação entre os 4 Módulos IA */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5" id="ai-module-selector">
            <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 mb-2">Engrenagens de IA</span>
            <button
              onClick={() => setActiveSubTab("sdr")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition duration-150 ${
                activeSubTab === "sdr" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
              }`}
              id="subtab-ia-sdr"
            >
              <Users className="w-4 h-4 text-blue-500" />
              1. IA SDR (Qualificação)
            </button>
            <button
              onClick={() => setActiveSubTab("comercial")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition duration-150 ${
                activeSubTab === "comercial" ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-50"
              }`}
              id="subtab-ia-comercial"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              2. Assistente Comercial
            </button>
            <button
              onClick={() => setActiveSubTab("juridico")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition duration-150 ${
                activeSubTab === "juridico" ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
              }`}
              id="subtab-ia-juridico"
            >
              <Scale className="w-4 h-4 text-purple-500" />
              3. Assistente Jurídico
            </button>
            <button
              onClick={() => setActiveSubTab("financeiro")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition duration-150 ${
                activeSubTab === "financeiro" ? "bg-rose-50 text-rose-700" : "text-slate-600 hover:bg-slate-50"
              }`}
              id="subtab-ia-financeiro"
            >
              <Calculator className="w-4 h-4 text-rose-500" />
              4. Contas e Inadimplência
            </button>
          </div>

          {/* Selecionador de Lead Ativo */}
          {activeSubTab !== "financeiro" && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3" id="ai-lead-context">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Contexto de Lead</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-bold">Vínculo Ativo</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Selecione o lead da sua base que alimentará os dados de entrada das inteligências artificiais abaixo:
              </p>
              
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 text-slate-700 text-xs rounded border border-slate-200 outline-none focus:ring-1 focus:ring-sky-500 font-bold"
                id="select-active-ai-lead"
              >
                {leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.category} - {l.score}pts)
                  </option>
                ))}
              </select>

              {activeLead && (
                <div className="bg-slate-50/70 p-3 rounded-lg space-y-2 border border-slate-100 text-[11px]">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Nome:</span>
                    <span>{activeLead.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Score de Compra:</span>
                    <span className={`font-bold ${activeLead.score > 75 ? "text-emerald-600" : "text-amber-600"}`}>{activeLead.score} %</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cidade:</span>
                    <span>{activeLead.profile.city || "Indefinida"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Preferência:</span>
                    <span>{activeLead.profile.tipo || "Indefinido"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* CONTAINER DIREITO: Visualizações de Execução */}
        <div className="lg:col-span-3">
          
          {/* 1. ABA DE SDR: ATENDIMENTO EM CHAT E CLASSIFICAÇÃO DOURADA */}
          {activeSubTab === "sdr" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5" id="sdr-chatbot">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Atendimento e SDR Inteligente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Insira as conversas reais dos portais. A IA formula respostas e extrai automaticamente a ficha da oportunidade.
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-bold">
                    Classificação Automática
                  </span>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="border border-slate-100 rounded-xl bg-slate-50/50 p-4 space-y-4 h-[250px] overflow-y-auto" id="sdr-chat-area">
                {chatHistory.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-lg text-xs max-w-[80%] leading-relaxed ${
                      m.sender === "user" 
                        ? "bg-slate-900 border border-slate-800 text-white rounded-br-none" 
                        : "bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-none"
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1 opacity-70">
                        {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-sky-500" />}
                        {m.sender === "user" ? "Comentário Lead" : "ImobFluow SDR Bot"}
                      </div>
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
                {isSdrLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-600 p-3 rounded-lg text-xs leading-relaxed border border-slate-200 animate-pulse">
                      Processando com IA Flash...
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Simulators options (Prompts pré-organizados para demonstrar a extração instantânea) */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sugestões de Simulação de Entrada</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => applyPresetInput("Oi, vi o anúncio no site do Apartamento Premium nos Jardins de R$ 1.8M e queria agendar visita se aceitar financiamento.")}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 transition"
                  >
                    Simular: Financiar Jardins
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyPresetInput("Preciso de uma Fazenda grande acima de 250 Hectares em Sorocaba para plantar soja. Pago à vista se estiver georreferenciada.")}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 transition"
                  >
                    Simular: Comprar Fazenda
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyPresetInput("Só estou dando uma olhadinha por enquanto, não tenho dinheiro ainda, valeu.")}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 transition"
                  >
                    Simular: Lead Frio / Curioso
                  </button>
                </div>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendSDRMessage} className="flex gap-2" id="chatbot-submit-form">
                <input 
                  type="text" 
                  value={sdrChatInput}
                  onChange={(e) => setSdrChatInput(e.target.value)}
                  placeholder="Envie uma mensagem do lead ou resposta simulada do cliente..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl outline-none focus:ring-1 focus:ring-sky-500"
                  id="chat-input-text"
                />
                <button 
                  type="submit"
                  disabled={isSdrLoading}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0"
                  id="chat-send-btn"
                >
                  <Send className="w-4 h-4" /> Enviar
                </button>
              </form>

              {/* Tabela de Ficha Técnica Extraída em Tempo Real */}
              {activeLead && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3" id="profile-extraction-panel">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-slate-700 uppercase">Perfil Extraído pelo Auto-Profiler</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded">
                      Fidelidade: Média-Alta
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Cidade Ideal</span>
                      <span className="font-semibold text-slate-800">{activeLead.profile.city || "Pendente"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Bairro</span>
                      <span className="font-semibold text-slate-800">{activeLead.profile.bairro || "Pendente"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Tipo Imóvel</span>
                      <span className="font-semibold text-slate-800">{activeLead.profile.tipo || "Pendente"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Faixa Orçamento</span>
                      <span className="font-semibold text-slate-800 text-emerald-700 font-black">{activeLead.profile.faixaInvestimento || "Pendente"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Forma de Pagamento</span>
                      <span className="font-semibold text-slate-800">{activeLead.profile.formaPagamento || "Pendente"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Urgência de Compra</span>
                      <span className="font-semibold text-slate-800">{activeLead.profile.prazoCompra || "Pendente"}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Score Computado:</span> {activeLead.score} / 100 pontos. 
                      Categoria atual do Lead: <span className="font-bold underline">{activeLead.category}</span>.
                    </div>
                    {activeLead.category === "Quente" && (
                      <span className="p-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">Pronto para Oportunidades</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ABA DO ASSISTENTE COMERCIAL: CRITÉRIOS DE COMPATIBILIDADE */}
          {activeSubTab === "comercial" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn" id="comercial-wizard">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Módulo de Correspondência e Pitch Comercial
                </h3>
                <p className="text-xs text-slate-500">
                  A IA analisa os dados de preferência extraídos do seu Lead selecionado ({activeLead?.name || "Sem Nome"}) e cruza com a carteira de imóveis rurais e urbanos ativos.
                </p>
              </div>

              {/* Filters toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setComercialActiveCategory("urbano")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    comercialActiveCategory === "urbano" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Filtrar Imóveis Urbanos
                </button>
                <button
                  type="button"
                  onClick={() => setComercialActiveCategory("rural")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    comercialActiveCategory === "rural" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Filtrar Imóveis Rurais
                </button>
              </div>

              {/* Dispatch Action */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="font-bold text-slate-700 text-xs block">Consultar Cruzamento Inteligente</span>
                  <span className="text-[10px] text-slate-500 block">Compara faixa de valores de {activeLead?.profile.faixaInvestimento || "Qualquer valor"}</span>
                </div>
                <button 
                  onClick={handleGetComercialAdvice}
                  disabled={isComercialLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  id="btn-trigger-match"
                >
                  {isComercialLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Recomendações e Script"}
                </button>
              </div>

              {/* Display Result in High Density styling wrapper */}
              {comercialResult ? (
                <div className="space-y-4 pt-1" id="comercial-analysis-output">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-800 block mb-1">Análise Estratégica do Perfil:</span>
                    <p className="leading-relaxed">{comercialResult.analisePerfil}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comercialResult.recomendacoes?.map((rec: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 border border-amber-200 rounded-xl shadow-sm relative overflow-hidden">
                        <span className="absolute top-0 right-0 p-1 bg-amber-500 text-white text-[8px] font-black px-2">ALTAMENTE COMPATÍVEL</span>
                        <span className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">{rec.id}</span>
                        <h4 className="text-xs font-black text-slate-800 mt-2">{rec.titulo}</h4>
                        <span className="text-xs text-emerald-600 font-bold block">{rec.preco}</span>
                        
                        <div className="mt-3 bg-amber-50/50 p-2.5 rounded border border-amber-100 text-[11px] text-slate-700 italic leading-snug">
                          <span className="font-bold block text-[9px] text-amber-800 uppercase not-italic">Pitch de Vendas Sugerido:</span>
                          "{rec.pitchVenda}"
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg text-xs leading-relaxed flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Próxima Ação de Fechamento sugerida:</span> {comercialResult.proximaAcao}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Aperte no botão acima para consultar o portfólio e formatar os argumentos do corretor.
                </div>
              )}

            </div>
          )}

          {/* 3. ABA DO ASSISTENTE JURÍDICO: CÉLULA DE MINUTAS DE CONTRATO */}
          {activeSubTab === "juridico" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4" id="juridico-wizard">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-500" />
                  Dr. Fluow &mdash; Minutas e Documentação Legal brasileira
                </h3>
                <p className="text-xs text-slate-500">
                  Preenchimento automático inteligente de minutas de locações urbanas, seguro fiança ou contratos de compra e venda de fazendas rurais.
                </p>
              </div>

              <form onSubmit={handleGenerateDraft} className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="legal-form-inputs">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tipo de Instrumento</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                  >
                    <option value="Compra e Venda Residencial Urbana">Compra e Venda Residencial Urbana</option>
                    <option value="Locação Residencial (Lei do Inquilinato)">Locação Residencial (Lei do Inquilinato) com Seguro Fiança</option>
                    <option value="Compromisso de Cessão de Direto e Permuta">Compromisso de Cessão de Direto e Permuta</option>
                    <option value="Arrendamento Rural de Fazenda Produtiva">Arrendamento Rural de Fazenda Produtiva</option>
                    <option value="Contrato de Administração e Exclusividade">Contrato de Administração e Exclusividade</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Qualificação das Partes</label>
                  <input
                    type="text"
                    required
                    value={parties}
                    onChange={(e) => setPartes(e.target.value)}
                    placeholder="Ex: Nome do Locador e Locatário"
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Valor do Negócio e Fluxo</label>
                  <input
                    type="text"
                    required
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="Ex: R$ 4.500 mensais ou R$ 1.200.000 à vista"
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Endereço / Divisão da Propriedade</label>
                  <input
                    type="text"
                    required
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    placeholder="Ex: Rua dos Pinheiros, 120"
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Garantias, Ajustes e Cláusulas Extra</label>
                  <input
                    type="text"
                    value={customClausules}
                    onChange={(e) => setCustomClausules(e.target.value)}
                    placeholder="Ex: Juros de atraso de 10%, Seguro Fiança ou Caução"
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isJuridicoLoading}
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-black rounded-lg shadow-sm flex items-center gap-1.5"
                    id="btn-draft-legal"
                  >
                    {isJuridicoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    Construir Rascunho de Minuta de Lei
                  </button>
                </div>
              </form>

              {/* Minute Output display */}
              {draftResult ? (
                <div className="space-y-4 pt-4 border-t border-slate-200" id="draft-document-output">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs">
                    <div><strong>Documento:</strong> {draftResult.nomeDocumento}</div>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-1 rounded font-bold">{draftResult.dataGeracao}</span>
                  </div>

                  {/* Document preview container */}
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-xl text-xs font-mono max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                    {draftResult.minutaMarkdown}
                  </div>

                  {/* IA Advice panel */}
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3.5 text-xs text-purple-900 space-y-1">
                    <span className="font-extrabold flex items-center gap-1.5 uppercase tracking-wide text-purple-800">
                      <ShieldCheck className="w-4 h-4" /> Notas de Validação do Dr. Fluow
                    </span>
                    <p className="leading-snug">{draftResult.observacoesAdvogado}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Modifique os campos da minuta legal acima e solicite a confecção da minuta regulamentada.
                </div>
              )}

            </div>
          )}

          {/* 4. ABA DO ASSISTENTE FINANCEIRO: RELATÓRIOS E COMPREENSÃO DE RETORNOS */}
          {activeSubTab === "financeiro" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4" id="financeiro-wizard">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-rose-500" />
                  Módulo Financeiro IA &mdash; Consultoria e Margens
                </h3>
                <p className="text-xs text-slate-500">
                  Preveja os fluxos de caixa estipulando suas taxas recorrentes de carteira de aluguel e despesas gerais.
                </p>
              </div>

              <form onSubmit={handleAnalyzeFinance} className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="finance-calculator-inputs">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Receitas Gerais Mensais (R$)</label>
                  <input
                    type="number"
                    required
                    value={finReceitas}
                    onChange={(e) => setFinReceitas(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    placeholder="Ex: 145000"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Despesas Corporativas (R$)</label>
                  <input
                    type="number"
                    required
                    value={finDespesas}
                    onChange={(e) => setFinDespesas(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    placeholder="Ex: 38000"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Taxa de Inadimplência (%)</label>
                  <input
                    type="text"
                    required
                    value={finInadimplencia}
                    onChange={(e) => setFinInadimplencia(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    placeholder="Ex: 4.8"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isFinanceiroLoading}
                    className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 border border-rose-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                    id="btn-trigger-finance"
                  >
                    {isFinanceiroLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                    Analisar Saúde Financeira
                  </button>
                </div>
              </form>

              {financeiroResult ? (
                <div className="space-y-4 pt-4 border-t border-slate-200" id="finance-results-output">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Resumo Operacional</span>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">{financeiroResult.resumoDesempenho}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Estudo de Margens</span>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">{financeiroResult.margemContribuicao}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Análise de Delinquência</span>
                      <p className="text-xs text-rose-700 font-semibold leading-relaxed mt-1">
                        {financeiroResult.taxaInadimplenciaAnalise}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-black text-slate-700 uppercase block">Recomendações Prótivas do CFO IA</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {financeiroResult.conselhosProativos?.map((co: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                          <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> {co.titulo}
                          </h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed mt-1">{co.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Insira o faturamento, gastos e clique em analisar para gerar a projeção corporativa em tempo real.
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
