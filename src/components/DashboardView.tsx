import React, { useState } from "react";
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  TrendingDown, 
  Award, 
  ShieldCheck, 
  Building2, 
  Activity, 
  AlertCircle,
  Clock,
  Sparkles,
  Gauge,
  BookOpen,
  ArrowUpRight,
  MessageSquare,
  Search,
  Check,
  Zap,
  Leaf,
  Globe,
  Plus
} from "lucide-react";
import { Lead } from "../types";

interface DashboardViewProps {
  leads: Lead[];
  mode: "urbana" | "rural";
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ leads, mode, onNavigate }: DashboardViewProps) {
  // Common interactive simulation variables
  const [selectedPeriod, setSelectedPeriod] = useState("6-meses");

  // Urban interactive variables
  const [selectedUrbRegion, setSelectedUrbRegion] = useState("Moema / SP");
  const [isUrbIAHelpOpen, setIsUrbIAHelpOpen] = useState(false);

  // Rural interactive variables
  const [selectedCapTarget, setSelectedCapTarget] = useState(15.0); // em Milhões de R$
  const currentCapValue = 12.5; // em Milhões de R$
  const capProgressPercent = Math.min(100, Math.round((currentCapValue / selectedCapTarget) * 100));

  // AI-inspired insight response Simulation
  const [agroInsight, setAgroInsight] = useState("O mercado de grãos na região de Sorocaba projeta alta de 14% no arrendamento de glebas Classe A para safra 2026/2027. O escoamento está com nota logística alta.");

  // Handler for custom actions
  const handleTriggerAction = (actionName: string) => {
    alert(`[Ação Simulada]: Iniciando "${actionName}" para maximizar os resultados no ambiente.`);
  };

  if (mode === "urbana") {
    return (
      <div className="space-y-6" id="dashboard-urbano-root">
        {/* Top Header Row representing image header structure */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-slate-100 gap-4" id="urb-top-actions">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">IMOBILIÁRIA TRADICIONAL</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-1 px-2 rounded bg-orange-50 text-orange-600 text-xs font-black">Urbano</span>
              Dashboard Urbano
            </h2>
            <p className="text-xs text-slate-500 font-medium">Visão geral da sua operação imobiliária urbana.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Soft, beautiful search bar input */}
            <div className="relative flex-1 sm:w-64 max-w-xs">
              <input 
                type="text" 
                placeholder="Buscar imóveis..." 
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-orange-300"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>

            <button 
              onClick={() => handleTriggerAction("Novo Imóvel Comercial/Residencial")}
              className="bg-[#EA580C] hover:bg-[#D97706] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-orange-100"
            >
              <Plus className="w-4 h-4" /> Novo Imóvel
            </button>
          </div>
        </div>

        {/* IA Insights Container exactly like the print */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4" id="urb-ia-insights-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">IA INSIGHTS • ATIVO</span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">SINCRONIZADO</span>
            </div>
            <button 
              onClick={() => setIsUrbIAHelpOpen(!isUrbIAHelpOpen)}
              className="text-[11px] text-orange-600 font-extrabold hover:underline"
            >
              {isUrbIAHelpOpen ? "Ocultar Ajuda" : "O que é isso?"}
            </button>
          </div>

          {isUrbIAHelpOpen && (
            <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-lg text-xs text-orange-850 leading-relaxed transition-all">
              Nosso motor cognitivo lê os leads entrantes no pipeline e seu portfólio de imóveis em tempo real para disparar correspondências lógicas de venda instantânea (matchmaking), poupando horas de busca manual.
            </div>
          )}

          {/* Core Insights grid mirroring those in print */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="urb-insights-grid">
            {/* Item 1 */}
            <div className="bg-[#FAF9F5] border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-orange-200 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Leads Pendentes</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Você tem 3 leads quentes aguardando resposta há mais de 4 horas no canal comercial.
                </p>
              </div>
              <button 
                onClick={() => onNavigate("kanban")}
                className="text-[11px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline self-start"
              >
                RESPONDER AGORA &rarr;
              </button>
            </div>

            {/* Item 2 */}
            <div className="bg-[#FAF9F5] border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-200 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Relatório de Desempenho</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  A Fazenda Sol Nascente teve um aumento de 45% nas visualizações após a última atualização de imagens aéreas.
                </p>
              </div>
              <button 
                onClick={() => handleTriggerAction("Ver Relatório Fazenda Sol Nascente")}
                className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline self-start"
              >
                VER RELATÓRIO &rarr;
              </button>
            </div>

            {/* Item 3 */}
            <div className="bg-[#FAF9F5] border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-200 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-600 text-xs font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  <span>Oportunidade de Match</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Baseado no seu perfil, 2 novos imóveis em Moema e Jardins combinam com seus investidores ativos no CRM.
                </p>
              </div>
              <button 
                onClick={() => handleTriggerAction("Ver Matchmaking Tradicional")}
                className="text-[11px] text-purple-700 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline self-start"
              >
                VER MATCHMAKING &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Urban KPI Cards row (Mirroring Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="urb-kpis-grid">
          {/* Leads Ativos */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Leads Ativos</span>
              <span className="text-4xl font-extrabold text-slate-950">64</span>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +12% <ArrowUpRight className="w-3 h-3" />
              </span>
              <div className="h-9 w-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Disponíveis (Urbano) */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Disponíveis (Urbano)</span>
              <span className="text-4xl font-extrabold text-slate-950">1</span>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +3% <ArrowUpRight className="w-3 h-3" />
              </span>
              <div className="h-9 w-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Locações Ativas */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Locações Ativas</span>
              <span className="text-4xl font-extrabold text-slate-950">0</span>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                Estável
              </span>
              <div className="h-9 w-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* VGV em Estoque */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">VGV em Estoque</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] leading-none">R$ 0.0M</span>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +24% <ArrowUpRight className="w-3 h-3" />
              </span>
              <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Major Charts Row mapping Image 2 precisely */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="urb-charts-panels">
          {/* Leads por Canal Area Line Chart (Left 2 columns) */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4" id="leads-canal-card">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-800 text-sm">Leads por Canal</h3>
                <p className="text-[10px] text-slate-400">Origem de captação e canais de entrada qualificados no ano corrente.</p>
              </div>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-lg p-1.5 text-slate-600 focus:outline-none"
              >
                <option value="6-meses">Últimos 6 meses</option>
                <option value="12-meses">Ano Completo</option>
              </select>
            </div>

            {/* Custom SVG line area graph mimicking print exactly */}
            <div className="h-[220px] relative w-full pt-4">
              <span className="absolute left-0 top-3 text-[10px] font-bold text-slate-300">36</span>
              <span className="absolute left-0 top-[60px] text-[10px] font-bold text-slate-300">27</span>
              <span className="absolute left-0 top-[110px] text-[10px] font-bold text-slate-300">18</span>
              <span className="absolute left-0 top-[160px] text-[10px] font-bold text-slate-300 font-bold">9</span>
              <span className="absolute left-0 bottom-6 text-[10px] font-bold text-slate-300">0</span>

              {/* Horizontal dotted gridlines */}
              <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-5" />
              <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-16" />
              <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-[115px]" />
              <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-[165px]" />
              <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 bottom-8" />

              <div className="pl-8 w-full h-[180px] text-slate-300">
                <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Series 1 Area & Line: Instagram / Facebook (Purple/Violet) */}
                  <path d="M 0,110 Q 75,60 150,85 T 300,90 T 450,40 T 500,30 L 500,120 L 0,120 Z" fill="#818CF8" fillOpacity="0.08" />
                  <path d="M 0,110 Q 75,60 150,85 T 300,90 T 450,40 T 500,30" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Series 2 Area & Line: Google Search / Ads (Emerald/Green) */}
                  <path d="M 0,90 Q 75,40 150,55 T 300,70 T 450,30 T 500,15 L 500,120 L 0,120 Z" fill="#34D399" fillOpacity="0.05" />
                  <path d="M 0,90 Q 75,40 150,55 T 300,70 T 450,30 T 500,15" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

                  {/* Series 3 Area & Line: Portal Tradicional ZAP (Orange) */}
                  <path d="M 0,105 Q 75,80 150,100 T 300,95 T 450,75 T 500,60 L 500,120 L 0,120 Z" fill="#FB923C" fillOpacity="0.04" />
                  <path d="M 0,105 Q 75,80 150,100 T 300,95 T 450,75 T 500,60" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Time tick labels */}
              <div className="flex justify-between pl-8 text-[10px] font-bold text-slate-400 mt-2">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
              </div>
            </div>

            {/* Sub-Legend Indicator */}
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 justify-center pt-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Zap Imóveis (Tradicional)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#6366F1]" /> Instagram Ads (Campanha)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F97316]" /> Google / Google Ads
              </span>
            </div>
          </div>

          {/* Donut Chart: Estoque por tipo (Right 1 column) */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4" id="estoque-canal-card">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Estoque por Tipo</h3>
              <p className="text-[10px] text-slate-400">Classificação física do acervo imobiliário.</p>
            </div>

            {/* Interactive Vector Donut Graphic */}
            <div className="flex justify-center items-center py-2">
              <div className="relative h-32 w-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Base Ring */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  
                  {/* Apartamento Segment (45%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3.5" 
                    strokeDasharray="45 55" strokeDashoffset="100" />

                  {/* Casa Segment (25%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F97316" strokeWidth="3.5" 
                    strokeDasharray="25 75" strokeDashoffset="55" />

                  {/* Comercial Segment (15%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366F1" strokeWidth="3.5" 
                    strokeDasharray="15 85" strokeDashoffset="30" />

                  {/* Terreno Segment (10%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EAB308" strokeWidth="3.5" 
                    strokeDasharray="10 90" strokeDashoffset="15" />

                  {/* Lançamento Segment (5%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06B6D4" strokeWidth="3.5" 
                    strokeDasharray="5 95" strokeDashoffset="5" />
                </svg>
                {/* Center Badge */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-400 text-[8px] font-bold uppercase block tracking-wider leading-none">Acervo</span>
                  <span className="text-base font-black text-slate-800">100%</span>
                </div>
              </div>
            </div>

            {/* Detailed Custom legend matching image numbers perfectly */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-slate-700">Apartamento</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-slate-700">Casa</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                  <span className="text-slate-700">Comercial</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                  <span className="text-slate-700">Terreno</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                  <span className="text-slate-700">Lançamento</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Simulators and Bottom Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="urb-bottom-row">
          {/* Conversão por corretor */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Conversão por Corretor</h3>
              <p className="text-[10px] text-slate-400">Produtividade individual baseada em visitas e negociações finalizadas.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Alvax Fernandes (Urbano Prime)</span>
                  <span className="text-emerald-600">88% Eficiência</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Juliana Nogueira (Locação Comercial)</span>
                  <span className="text-emerald-600">62% Eficiência</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "62%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Carlos Antunes (Lançamentos e Condomínios)</span>
                  <span className="text-amber-500">45% Eficiência</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Leads Recentes CRM list */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Leads Recentes</h3>
                <p className="text-[10px] text-slate-400 font-medium">As últimas atividades registradas no funil.</p>
              </div>
              <button 
                onClick={() => onNavigate("kanban")}
                className="text-[11px] font-bold text-orange-600 hover:underline"
              >
                Ver CRM &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-50 font-medium text-xs text-slate-700">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-slate-800">Bruno Matos</span>
                  <span className="text-[10px] text-slate-400 font-mono">Apartamento 3 dormitórios, Pinheiros</span>
                </div>
                <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded">Quente</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-slate-800">Mariana de Souza</span>
                  <span className="text-[10px] text-slate-400 font-mono">Locação Comercial, Bela Vista</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Frio</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-slate-800">Renato Guedes</span>
                  <span className="text-[10px] text-slate-400 font-mono font-mono">Cobertura Triplex, Jardins</span>
                </div>
                <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded">Quente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Dashboard Rural (Image 3)
  return (
    <div className="space-y-6" id="dashboard-rural-root">
      {/* Top Header Row representing image header structure */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-slate-100 gap-4" id="rural-top-actions">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">IMOBILIÁRIA RURAL</span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1 px-2 rounded bg-emerald-50 text-emerald-800 text-xs font-black">Rural</span>
            Dashboard Rural
          </h2>
          <p className="text-xs text-slate-500 font-medium">Seja bem-vindo, Alvax. Gerenciamento de ativos e performance comercial.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Soft, beautiful search bar input */}
          <div className="relative flex-1 sm:w-64 max-w-xs">
            <input 
              type="text" 
              placeholder="Buscar fazendas..." 
              className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-300"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>

          <button 
            onClick={() => handleTriggerAction("Nova Fazenda ou Sítio")}
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-100"
          >
            <Plus className="w-4 h-4" /> Nova Fazenda
          </button>
        </div>
      </div>

      {/* IA Insights Container exactly like the print */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4" id="rural-ia-insights-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-[#15803D] uppercase">IA INSIGHTS • ATIVO</span>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">SINCRONIZADO</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded-full">Inteligência Territorial Ativa</span>
        </div>

        {/* Core Insights grid mirroring those in print */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="rural-insights-grid">
          {/* Notice 1 */}
          <div className="bg-[#FAF9F5] border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Urgente: Leads Pendentes</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Você tem 3 leads quentes aguardando resposta para áreas produtoras de grãos e silos há mais de 4 horas.
              </p>
            </div>
            <button 
              onClick={() => onNavigate("kanban")}
              className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline self-start"
            >
              RESPONDER AGORA &rarr;
            </button>
          </div>

          {/* Notice 2 */}
          <div className="bg-[#FAF9F5] border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <Activity className="w-4 h-4" />
                <span>Acompanhamento Clientes</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                A Fazenda Sol Nascente (Gado de Corte) registrou aumento de 45% nas visualizações de investidores rurais.
              </p>
            </div>
            <button 
              onClick={() => handleTriggerAction("Ver Relatório Fazenda Sol Nascente")}
              className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline self-start"
            >
              VER RELATÓRIO &rarr;
            </button>
          </div>

          {/* Notice 3 */}
          <div className="bg-[#FAF9F5] border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Georreferenciamento Match</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Baseado no perfil do CAR/SIGEF, 2 novos perímetros rurais no Mato Grosso combinam com seus investidores institucionais.
              </p>
            </div>
            <button 
              onClick={() => handleTriggerAction("Ver Matchmaking Rural")}
              className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline self-start"
            >
              VER MATCHMAKING &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Rural KPI Cards Row (Mirroring Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="rural-kpis-grid">
        {/* Propriedades */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Propriedades</span>
            <span className="text-4xl font-extrabold text-[#111827]">24</span>
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <span className="text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +12% <ArrowUpRight className="w-3 h-3" />
            </span>
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 border border-emerald-100">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Investidores */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Investidores</span>
            <span className="text-4xl font-extrabold text-[#111827]">775</span>
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <span className="text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +5% <ArrowUpRight className="w-3 h-3" />
            </span>
            <div className="h-9 w-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Due Diligence */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Due Diligence</span>
            <span className="text-4xl font-extrabold text-[#111827]">18</span>
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <span className="text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +8% <ArrowUpRight className="w-3 h-3" />
            </span>
            <div className="h-9 w-9 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Negócios (Mês) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Negócios (Mês)</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-none">R$ 8.2M</span>
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <span className="text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +24% <ArrowUpRight className="w-3 h-3" />
            </span>
            <div className="h-9 w-9 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#15803D]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Actions section - Mirroring Image 3 precisely */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="rural-charts-panels">
        {/* Volume de Negociações area-graph panel (Left 2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4" id="volume-rural-card">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-800 text-sm">Volume de Negociações</h3>
              <p className="text-[10px] text-slate-400">Variação mensal de captação em milhões (R$). Gráfico de expansão territorial.</p>
            </div>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-lg p-1.5 text-slate-600 focus:outline-none"
            >
              <option value="6-meses">Últimos 6 meses</option>
              <option value="12-meses">Ano Completo</option>
            </select>
          </div>

          {/* Elegant dark green shaded curve SVG matching Image 3 */}
          <div className="h-[220px] relative w-full pt-4">
            <span className="absolute left-0 top-3 text-[10px] font-bold text-slate-300">80</span>
            <span className="absolute left-0 top-[60px] text-[10px] font-bold text-slate-300">60</span>
            <span className="absolute left-0 top-[110px] text-[10px] font-bold text-slate-300">40</span>
            <span className="absolute left-0 top-[160px] text-[10px] font-bold text-slate-300">20</span>
            <span className="absolute left-0 bottom-6 text-[10px] font-bold text-slate-300">0</span>

            {/* Horizontal dotted gridlines */}
            <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-5" />
            <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-16" />
            <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-[115px]" />
            <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 top-[165px]" />
            <div className="absolute left-7 right-0 h-[1px] border-t border-dashed border-slate-100 bottom-8" />

            <div className="pl-8 w-full h-[180px]">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="forestAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                <path d="M 0,90 Q 75,55 150,75 T 300,85 T 450,55 T 500,45 L 500,120 L 0,120 Z" fill="url(#forestAreaGrad)" />
                
                {/* Thick Green Curve */}
                <path d="M 0,90 Q 75,55 150,75 T 300,85 T 450,55 T 500,45" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Time ticks matching Jan-Jun loop */}
            <div className="flex justify-between pl-8 text-[10px] font-bold text-slate-400 mt-2">
              <span>Jan</span>
              <span>Fev</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>Mai</span>
              <span>Jun</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>O fluxo de captações agropecuárias acelerou no segundo trimestre de 2026.</span>
            </span>
            <span className="text-[#15803D] font-bold underline cursor-pointer" onClick={() => handleTriggerAction("Exportar Laudo Técnico Rural")}>
              Gerenciar CAR &rarr;
            </span>
          </div>
        </div>

        {/* Right column: Ações Estratégicas list & Meta de Captação progress meter */}
        <div className="space-y-4" id="rural-actions-progress-panel">
          {/* Ações Estratégicas List */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">AÇÕES ESTRATÉGICAS</h3>
            </div>

            <div className="space-y-3.5">
              {/* Item 1 */}
              <div 
                onClick={() => handleTriggerAction("Incra/SIGEF Sync")}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-200 transition"
              >
                <div className="h-9 w-9 shrink-0 bg-white border border-slate-150 rounded-lg flex items-center justify-center text-emerald-700 font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Análise Fundiária</span>
                  <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Sincronizar dados do CAR/SIGEF</span>
                </div>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => handleTriggerAction("Heatmap Investidores")}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-purple-50/30 hover:border-purple-200 transition"
              >
                <div className="h-9 w-9 shrink-0 bg-white border border-slate-150 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Inteligência Comercial</span>
                  <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Mapa de calor de investidores</span>
                </div>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => handleTriggerAction("Proposta Personalizada")}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-yellow-50/30 hover:border-yellow-200 transition"
              >
                <div className="h-9 w-9 shrink-0 bg-white border border-slate-150 rounded-lg flex items-center justify-center text-yellow-600 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Novo Prospecto</span>
                  <span className="text-[10px] text-slate-400 font-semibold block leading-tight font-sans">Criar apresentação personalizada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta de Captação progress slider block */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4" id="meta-captacao-card">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Meta de Captação</span>
            
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-black text-slate-900">R$ {currentCapValue}M / R$ {selectedCapTarget}M</span>
              <span className="text-xs font-bold text-[#15803D]">{capProgressPercent}%</span>
            </div>

            {/* Slider to interactively adjust target and see dynamic layout shifts */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#15803D] rounded-full transition-all duration-300" style={{ width: `${capProgressPercent}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 leading-none">
                <span>0</span>
                <span>Alcançado R$ 12.5M</span>
                <span>Meta R$ {selectedCapTarget}M</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 block uppercase">Simulador de Meta:</label>
              <input 
                type="range" 
                min="13.0" 
                max="25.0" 
                step="0.5" 
                value={selectedCapTarget} 
                onChange={(e) => setSelectedCapTarget(parseFloat(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Agronomic AI grounder block */}
      <div className="bg-[#FAF9F5] border border-slate-150 p-5 rounded-2xl shadow-inner space-y-3" id="agro-ai-consultor">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          <span className="font-bold text-xs uppercase text-emerald-800 tracking-wider">AgroCognitive™ IA Assistant</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
          "{agroInsight}"
        </p>
        <div className="flex gap-2 pt-1.5 flex-wrap">
          <button 
            onClick={() => setAgroInsight("Analisando safra... De acordo com o INCC e o preço do saco de soja em Luís Eduardo Magalhães/BA, o retorno por hectare projetado está em 12% ao ano com ressalva ecológica.")}
            className="bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-600 transition"
          >
            Fração Bahia (LEM)
          </button>
          <button 
            onClick={() => setAgroInsight("As terras avermelhadas de Londrina e interior paranaense valorizaram 18.2% devido à segurança florestal e recursos hídricos. Há alta demanda de investidores do sul.")}
            className="bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-600 transition"
          >
            Norte do Paraná (Londrina)
          </button>
          <button 
            onClick={() => setAgroInsight("A região de Rio Verde/GO projeta expansão extraordinária de galpões frigoríficos. Aluguel de terras para lavouras de milho rotativo atingiu pico histórico de sementeira.")}
            className="bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-600 transition"
          >
            Sudoeste Goiano (Rio Verde)
          </button>
        </div>
      </div>
    </div>
  );
}
