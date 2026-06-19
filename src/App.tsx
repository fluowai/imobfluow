import React, { useState } from "react";
import { 
  BarChart4, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  Building2, 
  CalendarDays, 
  ShieldCheck, 
  Settings2, 
  HeartHandshake, 
  Users, 
  DollarSign, 
  Menu, 
  X,
  Compass,
  Briefcase,
  Mail,
  Activity,
  Sliders,
  ToggleLeft,
  FileText,
  Globe,
  Database,
  Lock,
  Search,
  Bell,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  MapPin,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Terminal,
  Shield,
  BriefcaseIcon
} from "lucide-react";

import { Lead } from "./types";
import { initialLeads } from "./mockData";

// View Imports
import DashboardView from "./components/DashboardView";
import KanbanView from "./components/KanbanView";
import PropertyView from "./components/PropertyView";
import AIView from "./components/AIView";
import LocacaoView from "./components/LocacaoView";
import OmniChatView from "./components/OmniChatView";
import PortalsView from "./components/PortalsView";
import SuperAdminView from "./components/SuperAdminView";
import MarketingAutomationView from "./components/MarketingAutomationView";
import LeadIntelligence from "./components/LeadIntelligence";

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  
  // profile state: 'urbana' | 'rural' | 'superadmin'
  const [workspaceProfile, setWorkspaceProfile] = useState<"urbana" | "rural" | "superadmin">("superadmin");
  
  // active tab of the current active workspace profile
  const [activeTab, setActiveTab] = useState<string>("imobiliarias");

  // State enabling navigation link from Kanban to AI SDR
  const [targetedLeadForAI, setTargetedLeadForAI] = useState<Lead | null>(null);

  // Impersonated client company state (🔧 Modo Suporte Activo)
  const [impersonatedCompany, setImpersonatedCompany] = useState<{ name: string; niche: "urbana" | "rural" } | null>(null);

  // Helper handling active lead navigation straight into SDR
  const handleQualifyLeadWithAI = (lead: Lead) => {
    setTargetedLeadForAI(lead);
    setWorkspaceProfile("urbana");
    setActiveTab("ai");
  };

  const handleUpdateLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
  };

  const handleTriggerAction = (actionLabel: string) => {
    alert(`[Ação ImobFluow]: Iniciando "${actionLabel}" com sucesso!`);
  };

  // Helper to change workspace mode reset tab
  const handleSwitchProfile = (profile: "urbana" | "rural" | "superadmin") => {
    setWorkspaceProfile(profile);
    if (profile === "superadmin") {
      setActiveTab("imobiliarias");
    } else {
      setActiveTab("dashboard");
    }
    setTargetedLeadForAI(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased" id="app-root">
      
      {/* Impersonation active banner - styled with amber alert tone */}
      {impersonatedCompany && (
        <div className="bg-[#FFFBEB] border-b border-amber-200 text-amber-900 px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-semibold animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1 px-2 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
              🔧 Suporte Ativo
            </span>
            <span>
              Simulando sessão corporativa para <strong>{impersonatedCompany.name}</strong> ({impersonatedCompany.niche === "rural" ? "Agro Rural" : "Tradicional Urbana"})
            </span>
          </div>
          <button 
            onClick={() => {
              setImpersonatedCompany(null);
              setWorkspaceProfile("superadmin");
              setActiveTab("imobiliarias");
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            Sair e Voltar para os Planos &raquo;
          </button>
        </div>
      )}

      {/* Dynamic Global Header - Adaptive styling depending on active Profile */}
      <header className={`py-3 px-6 flex items-center justify-between border-b transition-all duration-300 ${
        workspaceProfile === "superadmin" 
          ? "bg-[#FCFDFE] text-slate-800 border-red-100" 
          : "bg-white text-slate-800 border-slate-100"
      }`} id="global-header">
        <div className="flex items-center gap-3">
          {workspaceProfile === "superadmin" ? (
            <div className="h-8 w-8 bg-gradient-to-br from-rose-500 to-red-650 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
          ) : workspaceProfile === "rural" ? (
            <div className="h-8 w-8 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
          ) : (
            <div className="h-8 w-8 bg-orange-50 text-[#EA580C] rounded-xl flex items-center justify-center border border-orange-100 shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight uppercase">
                ImobFluow
              </h1>
              {workspaceProfile === "superadmin" ? (
                <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                  ADMIN CONSOLE
                </span>
              ) : workspaceProfile === "rural" ? (
                <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                  AGRO INTELLIGENCE
                </span>
              ) : (
                <span className="bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                  TRADITIONAL URBAN
                </span>
              )}
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider leading-none text-slate-400">
              {workspaceProfile === "superadmin" 
                ? "SaaS Control Center & Cluster Status" 
                : "Sistema de Atendimento e Ativos Integrados"}
            </p>
          </div>
        </div>

        {/* Global status counters and sandbox switch */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] ${
            workspaceProfile === "superadmin" 
              ? "bg-[#FAFBFD] border-slate-200 text-slate-600" 
              : "bg-slate-50 border-slate-100 text-slate-600"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${workspaceProfile === "rural" ? "bg-emerald-500" : workspaceProfile === "superadmin" ? "bg-rose-500" : "bg-orange-500"}`} />
            <span>Infraestrutura: <strong className="font-extrabold uppercase">Estável</strong></span>
          </div>

          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] ${
            workspaceProfile === "superadmin" 
              ? "bg-[#FAFBFD] border-slate-200 text-slate-600" 
              : "bg-slate-50 border-slate-100 text-slate-600"
          }`}>
            <span>Selo de Conformidade: <strong className="text-emerald-600 font-extrabold">OK CONCRESP</strong></span>
          </div>
        </div>
      </header>

      {/* Main Grid: Navigation sidebar + viewport */}
      <div className="flex-1 flex flex-col lg:flex-row" id="workspace-layout">
        
        {/* Dynamic Sidebar - Styling shifts according to active Profile */}
        <aside className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-r p-4 flex flex-col shrink-0 transition-all duration-300 ${
          workspaceProfile === "superadmin"
            ? "bg-[#FCFDFE] text-slate-800 border-[#F1F5F9]"
            : "bg-white text-slate-800 border-slate-150"
        }`} id="navigation-sidebar">

          {/* Environment Switcher Area - Pristine UX */}
          <div className={`p-3 rounded-xl mb-4 space-y-2 border transition-all duration-300 ${
            workspaceProfile === "superadmin" 
              ? "bg-slate-900 border-slate-800" 
              : "bg-slate-50 border-slate-100"
          }`}>
            <span className={`text-[9px] uppercase font-bold block tracking-wider font-mono ${
              workspaceProfile === "superadmin" ? "text-slate-400" : "text-slate-400"
            }`}>
              ⚡ Ambiente Operacional
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => handleSwitchProfile("urbana")}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  workspaceProfile === "urbana" 
                    ? "bg-white border-orange-200 text-[#EA580C] shadow-sm font-black" 
                    : `${workspaceProfile === "superadmin" ? "bg-transparent border-transparent text-slate-400 hover:bg-slate-800" : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100"}`
                }`}
                title="Imobiliária Urbana"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Urbano</span>
              </button>

              <button 
                onClick={() => handleSwitchProfile("rural")}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  workspaceProfile === "rural" 
                    ? "bg-white border-emerald-200 text-[#15803D] shadow-sm font-black" 
                    : `${workspaceProfile === "superadmin" ? "bg-transparent border-transparent text-slate-400 hover:bg-slate-800" : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100"}`
                }`}
                title="Imobiliária Rural"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Agro Rural</span>
              </button>

              <button 
                onClick={() => handleSwitchProfile("superadmin")}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  workspaceProfile === "superadmin" 
                    ? "bg-[#EA580C] border-none text-white shadow-sm font-black" 
                    : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100"
                }`}
                title="Super Admin SaaS"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super VIP</span>
              </button>
            </div>
          </div>

          {/* ACTIVE PROFILE SIDEBARS */}
          
          {/* 1. URBAN SIDEBAR NAVIGATION (Matching Image 2 exactly) */}
          {workspaceProfile === "urbana" && (
            <div className="space-y-4" id="urban-nav-group">
              
              {/* Category 1: OPERAÇÃO */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">OPERAÇÃO</span>
                
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "dashboard" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BarChart4 className="w-4 h-4" />
                    Dashboard
                  </span>
                  {activeTab === "dashboard" && <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />}
                </button>

                <button 
                  onClick={() => setActiveTab("omnichat")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "omnichat" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    Mensagens
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("marketing")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "marketing" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    Email marketing
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("kanban")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "kanban" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    Kanban
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("ai")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "ai" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4" />
                    CRM Leads IA
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("clientes_unificados")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "clientes_unificados" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    Clientes Unificados
                  </span>
                </button>
              </div>

              {/* Category: QUALIFICAÇÃO DE LEADS */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">QUALIFICAÇÃO DE LEADS</span>
                
                <button 
                  onClick={() => setActiveTab("quiz_demandas")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "quiz_demandas" ? "bg-orange-50 text-[#EA580C] font-black" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Quiz de Geral Demanda
                  </span>
                  {activeTab === "quiz_demandas" && <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />}
                </button>

                <button 
                  onClick={() => setActiveTab("leads_qualificados")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "leads_qualificados" ? "bg-orange-50 text-[#EA580C] font-black" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    Leads Qualificados
                  </span>
                  {activeTab === "leads_qualificados" && <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />}
                </button>
              </div>

              {/* Category 2: CARTEIRA URBANA */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">CARTEIRA URBANA</span>
                
                <button 
                  onClick={() => setActiveTab("properties")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "properties" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4" />
                    Imóveis Urbanos
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("locacao")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "locacao" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4" />
                    Gestão de Locação
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("loteamentos")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "loteamentos" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4" />
                    Loteamentos
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("condominios")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "condominios" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4" />
                    Adm. Condomínios
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("controle_chaves")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "controle_chaves" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4" />
                    Controle de Chaves
                  </span>
                </button>
              </div>

              {/* Category 3: GESTÃO */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">GESTÃO</span>
                
                <button 
                  onClick={() => setActiveTab("portals")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "portals" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4" />
                    Financeiro &amp; ERP
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("simulador_financeiro")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "simulador_financeiro" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4" />
                    Simulador Financeiro
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("contratos_juridico")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "contratos_juridico" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    Contratos &amp; Jurídico
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("documentos_ged")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "documentos_ged" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Database className="w-4 h-4" />
                    Documentos (GED)
                  </span>
                </button>
              </div>

              {/* Category 4: CRESCIMENTO */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">CRESCIMENTO</span>
                
                <button 
                  onClick={() => setActiveTab("meu_site")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "meu_site" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4" />
                    Meu Site
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("editor_visual")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "editor_visual" ? "bg-orange-50 text-[#EA580C]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4" />
                    Editor Visual
                  </span>
                </button>
              </div>

            </div>
          )}

          {/* 2. RURAL SIDEBAR NAVIGATION (Matching Image 3 exactly) */}
          {workspaceProfile === "rural" && (
            <div className="space-y-4" id="rural-nav-group">
              
              {/* Category 1: OPERAÇÃO */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">OPERAÇÃO</span>
                
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "dashboard" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BarChart4 className="w-4 h-4" />
                    Dashboard
                  </span>
                  {activeTab === "dashboard" && <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />}
                </button>

                <button 
                  onClick={() => setActiveTab("omnichat")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "omnichat" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    Mensagens
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("marketing")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "marketing" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    Email
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("kanban")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "kanban" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    Kanban
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("crm")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "crm" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    CRM Agro rurais
                  </span>
                </button>
              </div>

              {/* Category: QUALIFICAÇÃO DE LEADS */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">QUALIFICAÇÃO DE LEADS</span>
                
                <button 
                  onClick={() => setActiveTab("quiz_demandas")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "quiz_demandas" ? "bg-emerald-50 text-[#15803D] font-black" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Quiz do Produtor Rústico
                  </span>
                  {activeTab === "quiz_demandas" && <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />}
                </button>

                <button 
                  onClick={() => setActiveTab("leads_qualificados")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "leads_qualificados" ? "bg-emerald-50 text-[#15803D] font-black" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    Leads Qualificados
                  </span>
                  {activeTab === "leads_qualificados" && <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />}
                </button>
              </div>

              {/* Category 2: CARTEIRA RURAL */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">CARTEIRA RURAL</span>
                
                <button 
                  onClick={() => setActiveTab("properties")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "properties" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4" />
                    Imóveis Rurais
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("territorio_rural")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "territorio_rural" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4" />
                    Território Rural (CAR)
                  </span>
                </button>
              </div>

              {/* Category 3: CRESCIMENTO */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">CRESCIMENTO</span>
                
                <button 
                  onClick={() => setActiveTab("metas_vendas")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "metas_vendas" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Award className="w-4 h-4" />
                    Metas &amp; Vendas
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("meu_site")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "meu_site" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4" />
                    Meu Site rústico
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("editor_visual")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "editor_visual" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4" />
                    Editor Visual rústico
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("configurar_site")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "configurar_site" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Settings2 className="w-4 h-4" />
                    Configurar Site
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("landing_pages")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "landing_pages" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    Landing Pages
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("quiz")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "quiz" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4" />
                    Quiz do Produtor
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("matchmaking_360")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "matchmaking_360" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4" />
                    Matchmaking 360
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("agentes_ia")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "agentes_ia" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4" />
                    Agentes IA Agro
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab("relatorios")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "relatorios" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    Relatórios PDF
                  </span>
                </button>
              </div>

              {/* Category 4: SISTEMA */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 tracking-wider">SISTEMA</span>
                
                <button 
                  onClick={() => setActiveTab("conexoes")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === "conexoes" ? "bg-emerald-50 text-[#15803D]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Database className="w-4 h-4" />
                    Conexões SIGEF
                  </span>
                </button>
              </div>

            </div>
          )}

          {/* 3. SUPER ADMIN SIDEBAR NAVIGATION (Matching Image 1 EXACTLY!) */}
          {workspaceProfile === "superadmin" && (
            <div className="flex flex-col h-full justify-between" id="super-admin-root-menu">
              {/* Single cohesive list of 18 items with soft light active pill highlight */}
              <div className="space-y-1">
                <div className="px-2 py-1 mb-2 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-black text-red-600 tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-red-500" /> SUPER ADMIN OS
                  </span>
                </div>

                {/* Dashboard */}
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "dashboard" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Dashboard
                </button>

                {/* Analytics */}
                <button 
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "analytics" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Analytics
                </button>

                {/* Monitoring */}
                <button 
                  onClick={() => setActiveTab("monitoring")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "monitoring" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Monitoring
                </button>

                {/* Imobiliárias */}
                <button 
                  onClick={() => setActiveTab("imobiliarias")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "imobiliarias" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Imobiliárias
                </button>

                {/* Suporte */}
                <button 
                  onClick={() => setActiveTab("suporte")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "suporte" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Suporte
                </button>

                {/* Equipe */}
                <button 
                  onClick={() => setActiveTab("equipe")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "equipe" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Equipe
                </button>

                {/* Planos */}
                <button 
                  onClick={() => setActiveTab("planos")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "planos" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Planos
                </button>

                {/* Billing */}
                <button 
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "billing" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Billing
                </button>

                {/* Feature Flags */}
                <button 
                  onClick={() => setActiveTab("feature_flags")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "feature_flags" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <ToggleLeft className="w-4 h-4" />
                  Feature Flags
                </button>

                {/* Audit Log */}
                <button 
                  onClick={() => setActiveTab("audit_log")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "audit_log" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Audit Log
                </button>

                {/* Templates */}
                <button 
                  onClick={() => setActiveTab("templates")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "templates" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Templates
                </button>

                {/* Domínios */}
                <button 
                  onClick={() => setActiveTab("dominios")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "dominios" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Domínios
                </button>

                {/* Consultoria */}
                <button 
                  onClick={() => setActiveTab("consultoria")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "consultoria" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Consultoria
                </button>

                {/* Importador IA */}
                <button 
                  onClick={() => setActiveTab("importador_ia")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "importador_ia" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Importador IA
                </button>

                {/* Migração FluowAI */}
                <button 
                  onClick={() => setActiveTab("migracao_fluowai")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "migracao_fluowai" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Migração FluowAI
                </button>

                {/* Storage Intelligence */}
                <button 
                  onClick={() => setActiveTab("storage_intelligence")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "storage_intelligence" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Storage Intelligence
                </button>

                {/* Marketing & SEO */}
                <button 
                  onClick={() => setActiveTab("marketing_seo")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "marketing_seo" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Marketing &amp; SEO
                </button>

                {/* Configurações */}
                <button 
                  onClick={() => setActiveTab("configuracoes")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    activeTab === "configuracoes" 
                      ? "bg-red-50 text-red-700 border border-red-150/60 shadow-sm font-black" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                  Configurações
                </button>
              </div>

              {/* Immutable small compliance badge */}
              <div className="pt-4 text-[10px] text-slate-400 select-none pb-2 border-t border-slate-100 mt-8" id="super-admin-sidebar-footer">
                <span className="font-bold text-slate-500 block uppercase">ImobFluow SaaS Console</span>
                <span>Port ingress: 3000. Partition isolated.</span>
              </div>
            </div>
          )}

          {/* Quick info footer for commercial users */}
          {workspaceProfile !== "superadmin" && (
            <div className="pt-8 text-[11px] text-slate-400 leading-normal space-y-1.5 mt-auto" id="sidebar-footer-info">
              <p className="font-bold text-slate-500 select-none flex items-center gap-1">
                <ShieldCheck className={`w-3.5 h-3.5 ${workspaceProfile === "rural" ? "text-emerald-600" : "text-orange-500"}`} />
                <span>Nativo ImobFluow OS</span>
              </p>
              <p>Segurança de dados regulamentada por criptografia militar e LGPD brasileira em bancos isolados.</p>
            </div>
          )}

        </aside>

        {/* Dynamic workspace viewport render window */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-full bg-[#f8fafc]" id="main-content-viewport">
          
          {/* VIEW ROUTER */}
          {workspaceProfile === "superadmin" ? (
            /* Inside Super Admin mode, all 18 sidebar choices route to SuperAdminView with custom sub-tab props */
            <SuperAdminView 
              activeSassTab={activeTab} 
              onActionComplete={handleTriggerAction} 
              onImpersonateClient={(companyName, niche) => {
                setImpersonatedCompany({ name: companyName, niche: niche });
                setWorkspaceProfile(niche);
                setActiveTab("quiz_demandas");
              }}
            />
          ) : (
            /* Inside Urban or Rural modes, we route standard components or styled sandboxes */
            <>
              {activeTab === "quiz_demandas" && (
                <LeadIntelligence 
                  mode={workspaceProfile} 
                  subTab="quiz" 
                  leads={leads}
                  onUpdateLeads={handleUpdateLeads}
                />
              )}

              {activeTab === "leads_qualificados" && (
                <LeadIntelligence 
                  mode={workspaceProfile} 
                  subTab="leads" 
                  leads={leads}
                  onUpdateLeads={handleUpdateLeads}
                />
              )}

              {activeTab === "dashboard" && (
                <DashboardView 
                  leads={leads} 
                  mode={workspaceProfile} 
                  onNavigate={(tab) => {
                    if (tab === "ai") {
                      setActiveTab("ai");
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                />
              )}

              {activeTab === "omnichat" && (
                <OmniChatView />
              )}

              {activeTab === "marketing" && (
                <MarketingAutomationView leads={leads} />
              )}

              {activeTab === "kanban" && (
                <KanbanView 
                  leads={leads} 
                  onUpdateLeads={handleUpdateLeads} 
                  onNavigateToAI={handleQualifyLeadWithAI} 
                />
              )}

              {activeTab === "crm" && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-950">Ficha Geral de Clientes e Investidores Rurais</h3>
                  <p className="text-xs text-slate-500">Mapeamento integrado de fazendeiros contratantes e pools de investidores florestais.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leads.slice(0, 4).map(lead => (
                      <div key={lead.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <span className="font-extrabold text-xs block text-slate-800">{lead.name}</span>
                        <div className="flex gap-2 text-[10px] uppercase font-mono">
                          <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold">Agroinvestor</span>
                          <span className="bg-slate-250 text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded font-bold">{lead.category}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">Interesse em glebas no Mato Grosso, Goiás e Bahia.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <AIView 
                  leads={leads} 
                  selectedLeadFromNav={targetedLeadForAI} 
                  onUpdateLeads={handleUpdateLeads} 
                />
              )}

              {activeTab === "properties" && (
                <PropertyView />
              )}

              {activeTab === "locacao" && (
                <LocacaoView />
              )}

              {activeTab === "portals" && (
                <PortalsView />
              )}

              {/* UNIVERSAL COMPLETED INTERACTIVE FEATURE SANDBOX */}
              {![
                "dashboard", "omnichat", "marketing", "kanban", "crm", "ai", "properties", "locacao", "portals", "quiz_demandas", "leads_qualificados"
              ].includes(activeTab) && (
                <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-6" id="feature-sandbox-view">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white ${workspaceProfile === "rural" ? "bg-emerald-600" : "bg-orange-500"}`}>
                          MÓDULO SIMULADOR {workspaceProfile.toUpperCase()}
                        </span>
                        <span className="bg-slate-50 text-[10px] text-slate-400 font-bold border border-slate-200 px-1.5 py-0.5 rounded">
                          ESTAGIADO v3.5
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-sans text-slate-800 tracking-tight capitalize">
                        {activeTab.replace("_", " ")}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Ferramenta tática integrada para otimização, simulação tributária, propostas e controle de fluxo do ambiente {workspaceProfile}.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleTriggerAction(activeTab)} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition ${
                          workspaceProfile === "rural" 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                            : "bg-[#EA580C] hover:bg-orange-600 text-white"
                        }`}
                      >
                        Executar Sincronização
                      </button>
                      <button 
                        onClick={() => handleTriggerAction(`Baixar Relatórios de ${activeTab}`)} 
                        className="bg-white border border-slate-250 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Exportar XLS
                      </button>
                    </div>
                  </div>

                  {/* Sandbox interactive visual placeholder */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* Left 2 cols */}
                    <div className="md:col-span-2 space-y-4">
                      
                      {/* Fake live records simulation list */}
                      <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white shadow-inner">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 font-mono flex justify-between">
                          <span>Registros Simativos de {activeTab.replace("_", " ")}</span>
                          <span>Audit: 100% OK</span>
                        </div>
                        
                        <div className="divide-y divide-slate-50 px-4">
                          <div className="py-3 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 font-sans">#FR-8941 &mdash; Lote Adjacente Moema Residencial</span>
                            <span className="font-mono text-slate-400">Pendente de Escritura</span>
                            <span className="font-bold text-[#EA580C]">R$ 1.250.000</span>
                          </div>
                          <div className="py-3 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 font-sans">#FR-8942 &mdash; Haras Sorocaba Logística Agro</span>
                            <span className="font-mono text-[#15803D]">CAR Validado (IBAMA)</span>
                            <span className="font-bold text-slate-800">R$ 4.800.000</span>
                          </div>
                          <div className="py-3 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 font-sans font-sans">#FR-8943 &mdash; Gleba B Bahia Loteamento Rural</span>
                            <span className="font-mono text-slate-400">Sincronizado SIGEF</span>
                            <span className="font-bold text-slate-800">R$ 15.200.000</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive form feedback sandbox */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                        <span className="font-extrabold text-[10px] uppercase text-slate-400 block tracking-wider">Ajustar Variáveis de Teste</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="text-slate-500 block mb-1">Margem Projetada (% ou Taxa Selic):</label>
                            <input type="text" placeholder="Default: 12.5% ao ano" className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2 focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-slate-500 block mb-1">Inadimplência Tolerável (%):</label>
                            <input type="text" placeholder="Default: 4.8%" className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2 focus:outline-none" />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right 1 col: System Health monitor card */}
                    <div className="bg-slate-50/40 p-4 border border-slate-150 rounded-2xl space-y-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-bold block">Status da Conexão</span>
                      
                      <div className="flex items-center gap-2">
                        <div className="h-8.5 w-8.5 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-black text-xs text-slate-800 block">Sincronizado</span>
                          <span className="text-[9px] text-slate-400 block font-semibold">Atualizado ha 2 minutos</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed italic border-t border-slate-150 pt-3">
                        "Todas as atas, perímetros rurais e certidões negativas são lidas pelo nosso analisador em tempo recorde utilizando chaves de API restritas."
                      </p>

                      <div className="bg-white border border-slate-150 rounded-xl p-3 flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Tempo de Ingestão:</span>
                        <span className="font-mono text-slate-800">0.05s (Ultra Veloz)</span>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </>
          )}

        </main>

      </div>
      
    </div>
  );
}
