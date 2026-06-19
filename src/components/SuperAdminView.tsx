import React, { useState } from "react";
import { 
  Building2, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Database, 
  Lock, 
  LineChart, 
  Check, 
  RefreshCw, 
  Users, 
  DollarSign,
  Briefcase,
  ToggleLeft,
  FileText,
  Globe,
  Mail,
  Sparkles,
  HelpCircle,
  Eye,
  AlertCircle,
  Clock,
  Terminal,
  Grid,
  Scale,
  Ban,
  Pencil,
  Key,
  Trash2,
  Search,
  Plus
} from "lucide-react";

interface TenantSubscription {
  companyName: string;
  id: string;
  slug: string;
  plan: string;
  responsavelName: string;
  responsavelEmail: string;
  nicho: "TRADITIONAL" | "RURAL";
  status: "Ativo" | "Suspenso" | "Trial" | "Cancelado";
}

const initialTenants: TenantSubscription[] = [
  { companyName: "Test Org 2", id: "5d44a16e", slug: "test-org-temp-2-1781710844787", plan: "SEM PLANO", responsavelName: "test2", responsavelEmail: "", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "imobiliariadaterra", id: "5e8b4d3e", slug: "imobiliariadaterra", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "RURAL", status: "Ativo" },
  { companyName: "Castello", id: "76ef00bd", slug: "castello", plan: "SEM PLANO", responsavelName: "Castelo", responsavelEmail: "JOSEJONASRNS@GMAIL.COM", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "Argolo", id: "93920dae", slug: "argolo", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "Paulo Fazendas Rurais", id: "fc644813", slug: "paulo-fazendas-rurais", plan: "SEM PLANO", responsavelName: "Paulo Adriano", responsavelEmail: "PAULO@IMOBZY.COM.BR", nicho: "RURAL", status: "Ativo" },
  { companyName: "paulo fazendas", id: "55a2982d", slug: "paulo-fazendas", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "RURAL", status: "Ativo" },
  { companyName: "magosltda", id: "b5dd49c5", slug: "magosltda", plan: "SEM PLANO", responsavelName: "Mago", responsavelEmail: "DONVITOR.SOUZA@OUTLOOK.COM", nicho: "RURAL", status: "Ativo" },
  { companyName: "Alvax", id: "cc1fce44", slug: "alvax", plan: "SEM PLANO", responsavelName: "Alvax", responsavelEmail: "FLUOWAI@GMAIL.COM", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "Argoloimoveis", id: "a3bf70cc", slug: "argoloimoveis", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "pauloargolo", id: "66c66391", slug: "pauloargolo", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "Leo Imóveis", id: "25d7b44c", slug: "leo-imoveis", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "OKA Imóveis", id: "0e2dc1dc", slug: "okaimoveis", plan: "SEM PLANO", responsavelName: "Renato", responsavelEmail: "CONTATO@OKAIMOVEIS.COM.BR", nicho: "TRADITIONAL", status: "Ativo" },
  { companyName: "Fazendas Brasil", id: "ee2eafa9", slug: "fazendasbrasil1", plan: "SEM PLANO", responsavelName: "Renato Piovesan", responsavelEmail: "CONTATO@FAZENDASBRASIL.COM.BR", nicho: "RURAL", status: "Ativo" },
  { companyName: "IMOBZY Demo", id: "550e8400", slug: "imobzy-demo", plan: "SEM PLANO", responsavelName: "", responsavelEmail: "", nicho: "RURAL", status: "Ativo" }
];

interface SuperAdminViewProps {
  activeSassTab?: string;
  onActionComplete?: (label: string) => void;
  // Impersonation switch
  onImpersonateClient?: (companyName: string, niche: "urbana" | "rural") => void;
}

export default function SuperAdminView({ 
  activeSassTab = "dashboard", 
  onActionComplete,
  onImpersonateClient 
}: SuperAdminViewProps) {
  
  const [tenants, setTenants] = useState<TenantSubscription[]>(initialTenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<"Start" | "Growth" | "Enterprise" | "White Label">("Enterprise");

  // Dynamic simulation variables
  const [cpuThrottling, setCpuThrottling] = useState(false);
  
  // Feature flags state simulation
  const [flags, setFlags] = useState({
    geminiLive: true,
    autoSDRCall: false,
    whatsappMultiTenant: true,
    sigefIntegration: true,
    pdfTaxCrawler: false
  });

  // Log notifications simulator
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[16:21:05] GET /api/v1/auth/session - Multi-tenant isolated mapping OK",
    "[16:21:40] DB Migration worker check: 14 table spaces up to date",
    "[16:22:15] CRON Job: Resettled quotas reset countdown: 11 days remaining",
    "[16:23:01] WEBHOOK WhatsApp Gateway: canal session active for Vanguard",
    "[16:24:55] BROADCAST Marketing sync: campaign queue dispatched for Moema"
  ]);

  // Support tickets mock list
  const [tickets, setTickets] = useState([
    { id: "T-102", title: "Erro na sincronização de Matrícula INCRA", status: "Aberto", level: "Urgente", elapsed: "2h atrás" },
    { id: "T-103", title: "Cota de tokens esgotada no meio da campanha", status: "Em Progresso", level: "Normal", elapsed: "5h atrás" },
    { id: "T-104", title: "Configuração de SPF / CNAME pendente", status: "Aberto", level: "Baixo", elapsed: "1 dia atrás" }
  ]);

  const handleToggleFlag = (key: keyof typeof flags) => {
    setFlags({ ...flags, [key]: !flags[key] });
    if (onActionComplete) {
      onActionComplete(`Flag de Recurso: ${String(key)} atualizada.`);
    }
  };

  const handleToggleStatus = (companyName: string) => {
    setTenants(tenants.map(t => {
      if (t.companyName === companyName) {
        const nextStatus = t.status === "Ativo" ? "Suspenso" as const : "Ativo" as const;
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    if (onActionComplete) onActionComplete(`Status da empresa "${companyName}" alterado.`);
  };

  const handleDeleteTenant = (companyName: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente o tenant "${companyName}"?`)) {
      setTenants(tenants.filter(t => t.companyName !== companyName));
      if (onActionComplete) onActionComplete(`Tenant "${companyName}" removido com sucesso.`);
    }
  };

  const handleAddImobiliaria = () => {
    const name = prompt("Nome da Nova Imobiliária:");
    if (!name) return;
    const isRural = confirm("Nicho Rural? (Cancelar para Tradicional/Urbano)");
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newTenant: TenantSubscription = {
      companyName: name,
      id: Math.random().toString(16).slice(2, 10),
      slug,
      plan: "SEM PLANO",
      responsavelName: "Responsável Temporário",
      responsavelEmail: "contato@" + slug + ".com.br",
      nicho: isRural ? "RURAL" : "TRADITIONAL",
      status: "Ativo"
    };
    setTenants([newTenant, ...tenants]);
    if (onActionComplete) onActionComplete(`Nova imobiliária "${name}" adicionada.`);
  };

  // Filter tenants
  const filteredTenants = tenants.filter(t => 
    t.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.responsavelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="superadmin-wrapper">
      
      {/* Top Indicators KPI Row - Clear light layout with thin borders */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="saas-system-kpis">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Empresas Cadastradas</span>
          <span className="text-2xl font-black text-slate-900">
            {tenants.length} Imobiliárias
          </span>
          <span className="text-[10px] text-slate-500 block">Isolamento Multi-tenant Ativo</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mix de Ativos por Nicho</span>
          <span className="text-2xl font-black text-emerald-700">
            {tenants.filter(t => t.nicho === "RURAL").length}R / {tenants.filter(t => t.nicho === "TRADITIONAL").length}U
          </span>
          <span className="text-[10px] text-slate-500 block">Sintonizados no Core</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Acessos de Suporte Logged</span>
          <span className="text-2xl font-black text-red-600">
            {filteredTenants.length} Prontas
          </span>
          <span className="text-[10px] text-slate-500 block">Sessão Segura Encriptada</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-emerald-800 font-bold">Monitor Sincronizador</span>
          <span className="text-2xl font-black text-emerald-600 flex items-center gap-1.5 leading-none">
            99.99% OK <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </span>
          <span className="text-[10px] text-slate-500 block">Serviços e APIs Ativos</span>
        </div>
      </div>

      {/* CORE RENDER DECISION BASED ON ACTIVE SASS TAB */}
      {(activeSassTab === "dashboard" || activeSassTab === "imobiliarias") && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main List Management Panel */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6" id="imobiliarias-panel">
            
            {/* Header with Search and Create button - Exactly mimicking user's provided print */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Gerenciar Imobiliárias</h3>
                <p className="text-xs text-slate-500 font-medium">Crie e edite empresas manualmente.</p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72 max-w-sm">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar empresa..." 
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-red-300 focus:bg-white font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                </div>

                <button 
                  onClick={handleAddImobiliaria}
                  className="bg-[#2B59FF] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-blue-50"
                >
                  <Plus className="w-4 h-4" /> Nova Imobiliária
                </button>
              </div>
            </div>

            {/* List Table modeled perfectly after print */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700 text-left border-collapse">
                <thead className="bg-[#FAFBFD] text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200/60 select-none">
                  <tr>
                    <th className="p-3.5 font-bold">EMPRESA</th>
                    <th className="p-3.5 font-bold">URL (SLUG)</th>
                    <th className="p-3.5 text-center font-bold">PLANO</th>
                    <th className="p-3.5 font-bold">RESPONSÁVEL</th>
                    <th className="p-3.5 font-bold">NICHO</th>
                    <th className="p-3.5 font-bold">STATUS</th>
                    <th className="p-3.5 text-right font-bold">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTenants.map(t => {
                    const isRural = t.nicho === "RURAL";
                    const isSuspended = t.status === "Suspenso";

                    return (
                      <tr key={t.companyName} className="hover:bg-[#F8FAFC]/60 transition items-center">
                        {/* Column 1: ERP Name + ID Below */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                              <Building2 className="w-4.5 h-4.5" />
                            </div>
                            <div className="space-y-0.5 leading-none">
                              <span className="font-extrabold text-slate-800 text-[13px] block">{t.companyName}</span>
                              <span className="text-[10px] text-slate-400 block font-normal">ID: {t.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: URL (SLUG) */}
                        <td className="p-3.5">
                          <span className="text-[#3B82F6] hover:underline font-bold text-xs select-all cursor-pointer">
                            {t.slug}
                          </span>
                        </td>

                        {/* Column 3: PLANO */}
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200/50 rounded text-[9px] font-black text-slate-500 uppercase tracking-wide">
                            {t.plan}
                          </span>
                        </td>

                        {/* Column 4: RESPONSÁVEL (User Name & Mail or "—" as shown in screen) */}
                        <td className="p-3.5">
                          {t.responsavelName ? (
                            <div className="leading-tight">
                              <span className="font-bold text-slate-700 text-xs block">{t.responsavelName}</span>
                              {t.responsavelEmail && (
                                <span className="text-[10px] text-slate-400 font-semibold block select-all">{t.responsavelEmail}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">&mdash;</span>
                          )}
                        </td>

                        {/* Column 5: NICHO (With blue for urban, emerald for rural) */}
                        <td className="p-3.5">
                          {isRural ? (
                            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] uppercase font-black rounded-md tracking-wider">
                              RURAL
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] uppercase font-black rounded-md tracking-wider">
                              TRADITIONAL
                            </span>
                          )}
                        </td>

                        {/* Column 6: STATUS */}
                        <td className="p-3.5">
                          {isSuspended ? (
                            <span className="text-rose-500 font-bold block text-xs flex items-center gap-1">
                              ● Suspenso
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold block text-xs flex items-center gap-1">
                              ● Ativo
                            </span>
                          )}
                        </td>

                        {/* Column 7: AÇÕES (Circle button row like the ones in provided screen check-out list) */}
                        <td className="p-3.5 text-right font-semibold">
                          <div className="flex items-center gap-2.5 justify-end">
                            
                            {/* Action 1: Ban/Suspend (Red) */}
                            <button
                              onClick={() => handleToggleStatus(t.companyName)}
                              className={`h-7 w-7 rounded-lg flex items-center justify-center border transition shadow-sm ${
                                isSuspended 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                                  : "bg-red-50 text-red-650 border-red-200 hover:bg-red-100"
                              }`}
                              title={isSuspended ? "Reativar" : "Bloquear/Suspender"}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>

                            {/* Action 2: Pencil Edit (Blue) */}
                            <button
                              onClick={() => {
                                const newName = prompt(`Editar nome para a imobiliária:`, t.companyName);
                                if (newName) {
                                  setTenants(tenants.map(x => x.companyName === t.companyName ? { ...x, companyName: newName } : x));
                                  if (onActionComplete) onActionComplete(`Empresa renomeada para "${newName}".`);
                                }
                              }}
                              className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 flex items-center justify-center transition shadow-sm"
                              title="Editar Dados"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Action 3: SUPPORT ACCESSED KEY - "chave onde ele clica e acesa o painel do cliente para suporte" */}
                            <button
                              onClick={() => {
                                if (onImpersonateClient) {
                                  onImpersonateClient(t.companyName, isRural ? "rural" : "urbana");
                                }
                              }}
                              className="h-7 w-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 flex items-center justify-center transition shadow-sm font-black"
                              title="🔧 Chave de Suporte: Acessar Painel"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Action 4: Trash Delete (Red) */}
                            <button
                              onClick={() => handleDeleteTenant(t.companyName)}
                              className="h-7 w-7 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center justify-center transition shadow-sm"
                              title="Excluir Permanentemente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* SLA Metrics row in Light mode & Feature Flags simulation below */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Terminal Logs simulator in light-charcoal tone for pristine UX */}
            <div className="lg:col-span-2 bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">Auditoria de Operações Multi-Tenant</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">SAAS INTEGRAÇÃO ATIVA</span>
              </div>
              
              <div className="bg-slate-900 text-slate-300 text-xs font-mono p-4 rounded-xl space-y-1.5 max-h-48 overflow-y-auto shadow-inner">
                {terminalLogs.slice(-5).map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-red-550 text-red-500 font-extrabold">&gt;</span>
                    <span className="font-semibold select-all">{log}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button 
                  onClick={() => setTerminalLogs([...terminalLogs, `[${new Date().toLocaleTimeString()}] ADMIN ACTION: Forçada validação de perímetro de segurança.`])}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-xl shadow-sm transition"
                >
                  Sincronizar Chaves de Segurança
                </button>
              </div>
            </div>

            {/* Right 1 Col: SLA Tickets */}
            <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">Fila de Chamados SLA</span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tickets.map(tk => (
                  <div key={tk.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] font-bold text-slate-400">ID: {tk.id}</span>
                      <span className={`text-[8px] font-black px-1.5 rounded uppercase ${
                        tk.level === "Urgente" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                      }`}>{tk.level}</span>
                    </div>
                    <span className="font-bold text-slate-800 block text-[11px] leading-tight">{tk.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Analytics VM */}
      {activeSassTab === "analytics" && (
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Cluster Metrics &amp; VM Performance</h3>
            <p className="text-xs text-slate-500 font-medium">Latência de barramento de dados e consumo do hardware analítico cognitivo de leads.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Carga do Processador VM</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{cpuThrottling ? "85%" : "21%"}</span>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded-sm">SAUDÁVEL</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                <div className={`h-full transition-all duration-300 ${cpuThrottling ? "bg-red-500 w-[85%]" : "bg-emerald-500 w-[21%]"}`} />
              </div>
              <button 
                onClick={() => setCpuThrottling(!cpuThrottling)}
                className="w-full text-center bg-white border border-slate-300 text-[10px] font-bold py-1.5 rounded-lg hover:bg-slate-50 transition"
              >
                {cpuThrottling ? "Remover Stress de Cluster" : "Simular Coleta Pico"}
              </button>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Leitura de Banco (SSD I/O)</span>
              <span className="text-3xl font-black text-slate-900">415 ops/s</span>
              <p className="text-[11px] text-slate-500 leading-tight">Escritas lógicas em canais multi-tenant ativos e isolados.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Conexões Sockets Multi</span>
              <span className="text-3xl font-black text-slate-900">1,489 conexões</span>
              <p className="text-[11px] text-slate-500 leading-tight">Canais WebSockets abertos para atualização dinâmica de mensagens.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SLA Tickets */}
      {activeSassTab === "suporte" && (
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm font-sans uppercase">Aconselhamento e Chamados Técnicos</h3>
            <p className="text-xs text-slate-500 font-medium">Controle as prioridades urgentes dos corretores cadastrados nas imobiliárias.</p>
          </div>

          <div className="space-y-3">
            {tickets.map(tk => (
              <div key={tk.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs hover:border-blue-100 transition shadow-inner">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">{tk.id}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${tk.level === "Urgente" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                      Prioridade: {tk.level}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-800 block text-sm">{tk.title}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Aberto há {tk.elapsed}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setTickets(tickets.filter(t => t.id !== tk.id));
                      alert(`Ticket ${tk.id} arquivado.`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Feature Flags */}
      {activeSassTab === "feature_flags" && (
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Chaveadores de Recursos (Feature Flags)</h3>
            <p className="text-xs text-slate-500 font-medium">Habilite ou desabilite recursos para fins de homologação rápida ou canário.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {Object.keys(flags).map(key => {
              const k = key as keyof typeof flags;
              return (
                <div key={k} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-slate-800 block text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-slate-400 text-[10px] font-bold block">Controle do cluster de backend cognição.</span>
                  </div>
                  <button 
                    onClick={() => handleToggleFlag(k)}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider transition ${
                      flags[k] 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300" 
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {flags[k] ? "LIGADO" : "DESLIGADO"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER FALLBACK FOR ALL OTHER TABS PLANNED */}
      {!["dashboard", "imobiliarias", "analytics", "monitoring", "suporte", "feature_flags"].includes(activeSassTab) && (
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Briefcase className="w-5 h-5 text-slate-600" />
            <h3 className="font-black text-slate-800 capitalize text-sm">{activeSassTab.replace("_", " ")} &mdash; SaaS Module</h3>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Este painel controla as regras integradas e variáveis do módulo de <strong>{activeSassTab.replace("_", " ").toUpperCase()}</strong>.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block font-mono">INSPEÇÃO DE SEGURANÇA</span>
            <div className="flex justify-between font-bold text-slate-600">
              <span>Status Operacional do Modulo:</span>
              <span className="text-emerald-600 font-bold">QUALIFICADO &amp; PRONTO</span>
            </div>
          </div>

          <div className="flex gap-2 text-xs pt-2">
            <button 
              onClick={() => alert(`Sincronização forçada iniciada.`)}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold"
            >
              Reiniciar Módulo
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
