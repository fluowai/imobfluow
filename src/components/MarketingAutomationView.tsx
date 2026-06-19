import React, { useState, useEffect } from "react";
import { 
  Mail, 
  MessageSquare, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Zap, 
  Send, 
  History, 
  Users, 
  Target, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  X,
  CheckCircle2,
  Clock,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Lead } from "../types";

interface MarketingAutomationViewProps {
  leads: Lead[];
}

interface Campaign {
  id: string;
  name: string;
  channel: "email" | "sms";
  triggerType: "status" | "behavior" | "interest";
  triggerValue: string; // e.g. "Quente", "Inativo > 15 dias", "fazenda"
  customInstruction: string;
  subject: string;
  body: string;
  status: "Ativo" | "Pausado";
  estimatedConversionRate: number;
  complianceNote: string;
  sentCount: number;
  openCount: number;
}

interface SimulationLog {
  id: string;
  campaignName: string;
  leadName: string;
  channel: "email" | "sms";
  destination: string;
  status: "Enviado" | "Entregue" | "Aberto" | "Clicado" | "Erro";
  timestamp: string;
}

export default function MarketingAutomationView({ leads }: MarketingAutomationViewProps) {
  // Pre-configured elegant marketing campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp-1",
      name: "Régua de Boas-vindas: Lead Quente",
      channel: "email",
      triggerType: "status",
      triggerValue: "Quente",
      customInstruction: "Oferecer simulação de financiamento e agendar visita presencial.",
      subject: "Personalizado: Oportunidade Exclusiva ImobFluow",
      body: "Olá, [Nome do Lead]! Reparamos sua urgência na escolha do seu próximo imóvel em [Cidade]. Selecionamos a dedo as melhores opções em [Bairro] atendendo perfeitamente seu perfil de [Perfil do Comprador]. O que acha de fazermos uma simulação com entrada facilitada nesse sábado? Veja mais no link: [Link do Portfólio]",
      status: "Ativo",
      estimatedConversionRate: 18.5,
      complianceNote: "Você está recebendo este e-mail por estar cadastrado de forma ativa no CRM ImobFluow. Para se retirar, clique no link descadastrar.",
      sentCount: 48,
      openCount: 39,
    },
    {
      id: "camp-2",
      name: "Alerta Instantâneo: Interesse Rural",
      channel: "sms",
      triggerType: "interest",
      triggerValue: "Fazenda",
      customInstruction: "Ser muito focado em produtividade de grãos e logistica do local.",
      subject: "",
      body: "[Nome do Lead], nova fazenda produtiva em [Cidade], com solos de excelente dreno e água abundante. Responda SIM para falarmos sobre o Georreferenciamento [Link do Portfólio]!",
      status: "Ativo",
      estimatedConversionRate: 12.2,
      complianceNote: "Conformidade ANATEL. Responda PARAR para cancelar.",
      sentCount: 112,
      openCount: 84,
    },
    {
      id: "camp-3",
      name: "Reengajamento: Leads Frios de Alphaville",
      channel: "email",
      triggerType: "status",
      triggerValue: "Frio",
      customInstruction: "Estilo mais calmo, sem pressão, focado no excelente custo-benefício dos condomínios horizontais.",
      subject: "Tendências e Oportunidades em Alphaville para este Semestre",
      body: "Prezado [Nome do Lead], o mercado de Alphaville registrou uma leve acomodação de preços de 4% em lotes de alto padrão, tornando este o melhor ponto de entrada do trimestre. Selecionamos alternativas de portfólio exclusivas. Acesse: [Link do Portfólio]",
      status: "Pausado",
      estimatedConversionRate: 9.8,
      complianceNote: "Para cancelar o recebimento desta newsletter de tendências de mercado da ImobFluow, clique aqui.",
      sentCount: 220,
      openCount: 65,
    }
  ]);

  // Campaign creator state
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newCampChannel, setNewCampChannel] = useState<"email" | "sms">("email");
  const [newCampTriggerType, setNewCampTriggerType] = useState<"status" | "behavior" | "interest">("status");
  const [newCampTriggerValue, setNewCampTriggerValue] = useState("Quente");
  const [newCampCustomInstruction, setNewCampCustomInstruction] = useState("");
  const [newCampSubject, setNewCampSubject] = useState("");
  const [newCampBody, setNewCampBody] = useState("");
  const [newCampEstRate, setNewCampEstRate] = useState(12.0);
  const [newCampCompNote, setNewCampCompNote] = useState("");

  // Simulated queue and dispatch logs
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([
    {
      id: "log-1",
      campaignName: "Régua de Boas-vindas: Lead Quente",
      leadName: "Mateus Ribeiro",
      channel: "email",
      destination: "mateus.rib@gmail.com",
      status: "Clicado",
      timestamp: "Hoje, 15:42",
    },
    {
      id: "log-2",
      campaignName: "Alerta Instantâneo: Interesse Rural",
      leadName: "Arnaldo Silveira",
      channel: "sms",
      destination: "(15) 99120-4411",
      status: "Entregue",
      timestamp: "Hoje, 14:10",
    },
    {
      id: "log-3",
      campaignName: "Régua de Boas-vindas: Lead Quente",
      leadName: "Juliana Mendes",
      channel: "email",
      destination: "juliana_mendes@outlook.com",
      status: "Aberto",
      timestamp: "Hoje, 11:30",
    },
    {
      id: "log-4",
      campaignName: "Reengajamento: Leads Frios de Alphaville",
      leadName: "Carlos Drumond",
      channel: "email",
      destination: "carlos.drumond@yahoo.com.br",
      status: "Enviado",
      timestamp: "Ontem, 16:55",
    }
  ]);

  const [activeSimulationCampaign, setActiveSimulationCampaign] = useState<string | null>(null);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  // Trigger value mapping choices
  const triggerChoices = {
    status: ["Quente", "Morno", "Frio"],
    interest: ["Apartamento", "Casa", "Fazenda", "Sítio", "Haras"],
    behavior: ["Inatividade > 15 dias", "Acesso recente ao Portal", "Interação Whatsapp falha"]
  };

  // Safe handler to fetch template generator from backend using AI
  const handleGenerateAITemplate = async () => {
    if (!newCampName) {
      alert("Por favor, dê um nome para sua campanha antes de gerar com IA!");
      return;
    }
    setIsGeneratingTemplate(true);
    try {
      // Assemble standard placeholder context based on lead data if available
      const sampleLead = leads.find(l => l.category === (newCampTriggerValue as any)) || (leads.length > 0 ? leads[0] : null);
      
      const response = await fetch("/api/gemini/campaign-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerType: `${newCampTriggerType}_${newCampTriggerValue}`,
          channel: newCampChannel,
          customInstruction: newCampCustomInstruction || "Seja muito cativante e de alta persuasão comercial.",
          leadContext: sampleLead ? {
            name: sampleLead.name,
            city: sampleLead.profile?.city || "São Paulo",
            bairro: sampleLead.profile?.bairro || "Jardins",
            budget: sampleLead.profile?.faixaInvestimento || "R$ 1.500.000",
            perfil: sampleLead.profile?.perfilComprador || "Família"
          } : {}
        })
      });

      if (!response.ok) {
        throw new Error("Erro na solicitação com o servidor.");
      }

      const data = await response.json();
      setNewCampSubject(data.subject || "");
      setNewCampBody(data.body || "");
      setNewCampEstRate(data.estimatedConversionRate || 14.5);
      setNewCampCompNote(data.complianceNote || "Mensagem enviada de forma automatizada pelo CRM ImobFluow.");
    } catch (err) {
      console.error(err);
      // Inline beautiful default fallback if something goes wrong
      if (newCampChannel === "sms") {
        setNewCampSubject("");
        setNewCampBody(`Olá, [Nome do Lead]! Selecionamos excelentes oportunidades correspondentes ao seu perfil de busca em [Cidade]. Acesse nosso portfólio completo em: [Link do Portfólio]. Responda SIM p/ agendar de forma facilitada!`);
        setNewCampCompNote("ANATEL Opt-out: Recuse respondendo PARAR.");
      } else {
        setNewCampSubject(`🎯 Oportunidade Imperdível Selecionada para seu Perfil de Busca`);
        setNewCampBody(`Olá, [Nome do Lead]!\n\nEsperamos que esteja bem.\n\nNotamos seu interesse ativo em opções exclusivas na região de [Cidade]. Por conta disso, nosso sistema integrado de inteligência ImobFluow selecionou o imóvel [Nome do Imóvel], localizado no excelente bairro [Bairro], perfeitamente ajustado para as suas demandas descritas.\n\nPreço Estimado de Venda: [Preço]\n\nGostaria de visitar o local no próximo fim de semana?\n\nClique no link seguro para navegar no tour virtual e ver todas as fotos: [Link do Portfólio]\n\nAtenciosamente,\n[Nome do Consultor]\nConsultoria de Growth Imobiliário ImobFluow`);
        setNewCampCompNote("Essa mensagem foi enviada de forma 100% automatizada pelo seu corretor por intermédio da plataforma integrada ImobFluow. Para não receber novas atualizações, clique descadastrar.");
      }
      setNewCampEstRate(11.8);
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  // Create Campaign logic
  const handleSaveCampaign = () => {
    if (!newCampName || !newCampBody) {
      alert("Por favor, preencha o Nome e o Conteúdo (corpo) da campanha.");
      return;
    }

    const campaign: Campaign = {
      id: "camp-" + Date.now(),
      name: newCampName,
      channel: newCampChannel,
      triggerType: newCampTriggerType,
      triggerValue: newCampTriggerValue,
      customInstruction: newCampCustomInstruction,
      subject: newCampSubject,
      body: newCampBody,
      status: "Ativo",
      estimatedConversionRate: newCampEstRate,
      complianceNote: newCampCompNote || "Campanha em conformidade com as diretrizes da LGPD.",
      sentCount: 0,
      openCount: 0,
    };

    setCampaigns([campaign, ...campaigns]);
    
    // Clear state
    setNewCampName("");
    setNewCampCustomInstruction("");
    setNewCampSubject("");
    setNewCampBody("");
    setNewCampCompNote("");
    setNewCampEstRate(12.0);
    setIsCreating(false);
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === "Ativo" ? "Pausado" : "Ativo"
        };
      }
      return c;
    }));
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta régua de automação?")) {
      setCampaigns(campaigns.filter(c => c.id !== id));
      if (activeSimulationCampaign === id) {
        setActiveSimulationCampaign(null);
      }
    }
  };

  // Campaign firing simulation (highly engaging for developers and sales directors)
  const handleRunSimulation = (camp: Campaign) => {
    if (isSimulatingDispatch) return;
    
    // Find matching leads
    let filteredLeads = leads;
    if (camp.triggerType === "status") {
      filteredLeads = leads.filter(l => l.category.toLowerCase() === camp.triggerValue.toLowerCase());
    } else if (camp.triggerType === "interest") {
      filteredLeads = leads.filter(l => l.profile?.tipo?.toLowerCase().includes(camp.triggerValue.toLowerCase()));
    } else {
      // behavior is simulated with a random sample of 3 leads
      filteredLeads = leads.slice(0, 3);
    }

    if (filteredLeads.length === 0) {
      // Fallback: use any 3 leads
      filteredLeads = leads.slice(0, 4);
    }

    setActiveSimulationCampaign(camp.id);
    setIsSimulatingDispatch(true);
    setSimulationProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSimulationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate dispatch logs
        const newLogs: SimulationLog[] = filteredLeads.map((lead, index) => {
          const statuses: Array<"Enviado" | "Entregue" | "Aberto" | "Clicado"> = ["Enviado", "Entregue", "Aberto", "Clicado"];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          return {
            id: `sim-log-${Date.now()}-${index}`,
            campaignName: camp.name,
            leadName: lead.name,
            channel: camp.channel,
            destination: camp.channel === "email" ? `${lead.name.toLowerCase().replace(/\s+/g, ".")}@imobfluow.com.br` : lead.phone,
            status: randomStatus,
            timestamp: "Poucos segundos atrás",
          };
        });

        // Update counts
        setCampaigns(prev => prev.map(c => {
          if (c.id === camp.id) {
            const clicksOrOpens = newLogs.filter(l => l.status === "Aberto" || l.status === "Clicado").length;
            return {
              ...c,
              sentCount: c.sentCount + filteredLeads.length,
              openCount: c.openCount + clicksOrOpens,
            };
          }
          return c;
        }));

        setSimulationLogs(prev => [...newLogs, ...prev]);
        setIsSimulatingDispatch(false);
        alert(`Sucesso! Campanha de simulação disparada para ${filteredLeads.length} leads correspondentes na base.`);
      }
    }, 450);
  };

  return (
    <div className="space-y-6" id="marketing-automation-root">
      
      {/* Banner Superior */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-950 shadow-md relative overflow-hidden" id="marketing-header">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-indigo-400" /> Automação de Marketing
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Réguas de Comunicação Inteligente</h2>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Monte fluxos de engajamento automático por e-mail ou SMS baseados no comportamento ativo do lead, status de qualificação das fichas do CRM e interesse em categorias de propriedades. Use nossa copywriter IA integrada para redigir mensagens otimizadas de alta taxa de conversão.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="marketing-body-grid">
        
        {/* Lado Esquerdo + Centro: Gerenciador de Campanhas */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">Réguas Organizacionais Cadastradas</h3>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Régua
              </button>
            </div>

            {/* Form de Criação */}
            <AnimatePresence>
              {isCreating && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-55 bg-indigo-50/30 border border-indigo-100 rounded-lg p-4 space-y-4 text-xs overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2">
                    <span className="font-bold text-indigo-900 text-sm flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-indigo-600" /> Configurar Nova Régua com IA
                    </span>
                    <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Nome da Régua */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700">Nome da Régua de Automação:</label>
                      <input 
                        type="text" 
                        value={newCampName}
                        onChange={(e) => setNewCampName(e.target.value)}
                        placeholder="Ex: Reengajamento Semanal de Leads Frios"
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-indigo-500 font-medium"
                      />
                    </div>
                    {/* Canal */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Canal de Envio:</label>
                      <select 
                        value={newCampChannel}
                        onChange={(e) => {
                          setNewCampChannel(e.target.value as any);
                          setNewCampBody("");
                          setNewCampSubject("");
                        }}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-indigo-500 font-medium"
                      >
                        <option value="email">📧 E-mail</option>
                        <option value="sms">📱 SMS Curto</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Tipo de Gatilho (Trigger) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Gatilho do CRM (Trigger Type):</label>
                      <select 
                        value={newCampTriggerType}
                        onChange={(e) => {
                          const type = e.target.value as any;
                          setNewCampTriggerType(type);
                          setNewCampTriggerValue(triggerChoices[type][0]);
                        }}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-indigo-500 font-medium"
                      >
                        <option value="status">Status de Qualificação do CRM (Frio, Morno, Quente)</option>
                        <option value="interest">Interesse em Propriedade Específica (Fazendas, Casas...)</option>
                        <option value="behavior">Comportamento Ativo do Lead no Portal</option>
                      </select>
                    </div>
                    {/* Valor do Gatilho */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Condição do Gatilho:</label>
                      <select 
                        value={newCampTriggerValue}
                        onChange={(e) => setNewCampTriggerValue(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-indigo-500 font-medium"
                      >
                        {triggerChoices[newCampTriggerType].map((choice) => (
                          <option key={choice} value={choice}>{choice}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      Instruções Especiais para a IA de Copywriting:
                      <span className="text-[10px] text-slate-400 font-normal">(Opcional - Estilo, benefícios, tom de voz)</span>
                    </label>
                    <textarea 
                      value={newCampCustomInstruction}
                      onChange={(e) => setNewCampCustomInstruction(e.target.value)}
                      placeholder="Ex: Oferecer desconto na taxa operacional do primeiro aluguel ou ser informal sobre casas de campo."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 focus:outline-indigo-500 resize-none font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-2 pb-1">
                    <button 
                      onClick={handleGenerateAITemplate}
                      disabled={isGeneratingTemplate}
                      className="px-3.5 py-1.5 bg-slate-900 border border-slate-950 text-white rounded font-bold hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-50 transition"
                    >
                      {isGeneratingTemplate ? (
                        <>Generando copy com IA...</>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          Gerar Template com IA
                        </>
                      )}
                    </button>
                  </div>

                  {/* Resultados do Template editável */}
                  {(newCampSubject || newCampBody) && (
                    <div className="bg-white border border-indigo-100 rounded-lg p-3.5 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-semibold">
                        <span>📝 Visualização / Edição do Template Gerado</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> Conversão Estimada: {newCampEstRate}%
                        </span>
                      </div>

                      {newCampChannel === "email" && (
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600">Assunto:</label>
                          <input 
                            type="text" 
                            value={newCampSubject}
                            onChange={(e) => setNewCampSubject(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 focus:outline-indigo-500 font-semibold text-slate-800"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Conteúdo do Disparo:</label>
                        <textarea 
                          value={newCampBody}
                          onChange={(e) => setNewCampBody(e.target.value)}
                          rows={6}
                          className="w-full border border-slate-200 rounded p-2 focus:outline-indigo-500 font-medium text-slate-700 leading-normal"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 flex items-center gap-1">
                          Cláusula de Opt-out (LGPD):
                        </label>
                        <input 
                          type="text" 
                          value={newCampCompNote}
                          onChange={(e) => setNewCampCompNote(e.target.value)}
                          className="w-full border border-slate-100 rounded p-1 text-[10px] text-slate-500 italic"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button 
                          onClick={handleSaveCampaign}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded flex items-center gap-1 shadow transition"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Salvar e Registrar Régua
                        </button>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            {/* Listagem de Campanhas Ativas */}
            <div className="space-y-4" id="registered-rules-list">
              {campaigns.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium">Nenhuma régua de automação cadastrada no momento.</div>
              ) : (
                campaigns.map((camp) => (
                  <div 
                    key={camp.id} 
                    className="border border-slate-100 hover:border-slate-200 rounded-xl p-4 space-y-3.5 bg-slate-50/40 relative transition"
                  >
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm md:text-base leading-tight">{camp.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            camp.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}>
                            {camp.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 items-center pt-1 font-semibold">
                          <span className="flex items-center gap-0.5 bg-white px-2 py-0.5 rounded border border-slate-100">
                            {camp.channel === "email" ? <Mail className="w-3 h-3 text-indigo-500" /> : <MessageSquare className="w-3 h-3 text-emerald-500" />}
                            {camp.channel.toUpperCase()}
                          </span>
                          <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-100/50">
                            Gatilho: {camp.triggerType === "status" ? "Qualificação" : camp.triggerType === "interest" ? "Interesse" : "Comportamento"} ({camp.triggerValue})
                          </span>
                        </div>
                      </div>

                      {/* Ações Rápidas */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleToggleStatus(camp.id)}
                          className={`p-1.5 rounded-lg border text-[11px] transition font-bold flex items-center gap-1.5 ${
                            camp.status === "Ativo" 
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200" 
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                          }`}
                          title={camp.status === "Ativo" ? "Pausar campanha" : "Ativar campanha"}
                        >
                          {camp.status === "Ativo" ? (
                            <>
                              <Pause className="w-3 h-3" /> Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-emerald-600" /> Ativar
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => handleDeleteCampaign(camp.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Conteúdo Template Preview */}
                    <div className="bg-white border border-slate-100 rounded-lg p-3 text-xs space-y-2">
                      {camp.subject && (
                        <p className="text-slate-800 font-bold border-b border-slate-50 pb-1.5">
                          Assunto: <span className="font-normal text-slate-600">{camp.subject}</span>
                        </p>
                      )}
                      <p className="text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                        {camp.body}
                      </p>
                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="italic truncate max-w-[70%]">LGPD: {camp.complianceNote}</span>
                        <span className="text-indigo-600 font-semibold">Conversão Estimada do Copy: {camp.estimatedConversionRate}%</span>
                      </div>
                    </div>

                    {/* Estatísticas e Simulação */}
                    <div className="bg-white px-3 py-2.5 rounded-lg border border-slate-150 flex items-center justify-between gap-4 flex-wrap text-xs">
                      <div className="flex gap-4">
                        <div className="text-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">Enviados</span>
                          <span className="font-bold text-slate-700">{camp.sentCount}</span>
                        </div>
                        <div className="text-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                            {camp.channel === "email" ? "Abertos" : "Interações"}
                          </span>
                          <span className="font-bold text-slate-700">
                            {camp.openCount}
                          </span>
                        </div>
                        <div className="text-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">Cliques Reais</span>
                          <span className="font-bold text-emerald-600">
                            {camp.sentCount > 0 ? Math.round((camp.openCount / camp.sentCount) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      {/* Simulou de Disparo */}
                      <button 
                        onClick={() => handleRunSimulation(camp)}
                        disabled={isSimulatingDispatch || camp.status === "Pausado"}
                        className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-all ${
                          camp.status === "Pausado"
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {activeSimulationCampaign === camp.id && isSimulatingDispatch 
                          ? `Disparando (${simulationProgress}%)` 
                          : "Testar Disparo"
                        }
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Lado Direito: Simulador de Console de Log e Base de Leads do CRM */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Sessão 1: Console de Envio em Tempo Real */}
          <div className="bg-slate-950 text-slate-100 rounded-xl p-5 shadow-md border border-slate-950 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-xs select-none uppercase tracking-wide">Log de Filas e Disparos</h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-3 font-mono text-[10px] max-h-[350px] overflow-y-auto pr-1" id="log-consoles">
              {simulationLogs.length === 0 ? (
                <p className="text-slate-500 italic pr-2">Nenhum disparo detectado.</p>
              ) : (
                simulationLogs.map((log) => (
                  <div key={log.id} className="border-b border-slate-900 pb-2.5 last:border-0 leading-relaxed text-slate-300">
                    <div className="flex justify-between items-center text-slate-500 text-[9px] mb-0.5">
                      <span className="font-bold text-indigo-400">{log.campaignName.slice(0, 20)}...</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">→ {log.leadName}</span>
                      <span className={`px-1 rounded text-[9px] font-bold ${
                        log.status === "Clicado" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" :
                        log.status === "Aberto" ? "bg-sky-950 text-sky-400 border border-sky-900" :
                        "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}>{log.status}</span>
                    </div>
                    <p className="text-slate-400 italic font-sans mt-0.5">
                      Destinatário: <span className="font-mono text-slate-500 text-[9px]">{log.destination}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <div className="text-[10px] pt-1.5 border-t border-slate-900 text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Fila em escuta para gatilhos do CRM de ImobFluow
            </div>
          </div>

          {/* Sessão 2: Leads Ativos e Elegibilidade de Gatilho */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Users className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-sm">Leads Integrados do CRM ({leads.length})</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Estes são os leads ativos de sua imobiliária carregados do CRM que herdam as automações de acordo com suas qualificações:
            </p>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 text-xs">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-slate-50 transition-all">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-slate-700 block truncate">{lead.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate font-medium">
                      Estágio: {lead.stage} | Tipo: {lead.profile?.tipo || "Apto"}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                    lead.category === "Quente" ? "bg-rose-100 text-rose-800" :
                    lead.category === "Morno" ? "bg-amber-100 text-amber-800" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {lead.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[10px] text-indigo-900 leading-relaxed flex gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Reação Bi-direcional:</strong> Toda alteração feita no Pipeline Kanban ou no SDR reconfigura a qualificação de forma paralela e dispara as réguas corretas de imediato!
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
