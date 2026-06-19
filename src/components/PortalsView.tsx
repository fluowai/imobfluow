import React, { useState } from "react";
import { 
  FolderLock, 
  UserSquare2, 
  Building2, 
  Home, 
  FileCheck2, 
  Download, 
  Eye, 
  TrendingUp, 
  Clock, 
  CalendarDays, 
  Calculator, 
  Heart,
  Award
} from "lucide-react";

export default function PortalsView() {
  const [activePortal, setActivePortal] = useState<"proprietario" | "locatario" | "comprador" | "corretor">("proprietario");

  return (
    <div className="space-y-6" id="portalsview-root">
      
      {/* Top Selector Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" id="portal-selector-bar">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-600">Simulador de Experiência do Cliente</span>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Portais do Ecossistema Imobiliário</h2>
        </div>

        {/* 4 portals switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto" id="portal-tab-group">
          <button 
            type="button"
            onClick={() => setActivePortal("proprietario")}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 shrink-0 ${
              activePortal === "proprietario" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> 1. Proprietário
          </button>
          <button 
            type="button"
            onClick={() => setActivePortal("locatario")}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 shrink-0 ${
              activePortal === "locatario" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <UserSquare2 className="w-3.5 h-3.5" /> 2. Locatário
          </button>
          <button 
            type="button"
            onClick={() => setActivePortal("comprador")}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 shrink-0 ${
              activePortal === "comprador" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Home className="w-3.5 h-3.5" /> 3. Comprador
          </button>
          <button 
            type="button"
            onClick={() => setActivePortal("corretor")}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 shrink-0 ${
              activePortal === "corretor" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Award className="w-3.5 h-3.5" /> 4. Corretor
          </button>
        </div>
      </div>

      {/* PORTAL DO PROPRIETÁRIO VIEW */}
      {activePortal === "proprietario" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="portal-proprietario-pane">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Painel do Rentista / Proprietário</h3>
              <p className="text-xs text-slate-500">Extratos de repasse mensais e status de locação dos seus bens patrimoniais.</p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold font-mono">CLIENTE: PEDRO ALBUQUERQUE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: Meus imóveis sob custódia */}
            <div className="border border-slate-100 shadow-sm rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Meus Imóveis cadastrados</span>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                  <span>Apto Jardins #41 (Locado)</span>
                  <span className="font-bold text-slate-800">R$ 6.500/mês</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                  <span>Studio Moema #108 (Locado)</span>
                  <span className="font-bold text-slate-800">R$ 3.200/mês</span>
                </div>
              </div>
            </div>

            {/* Box 2: Repasses consolidados */}
            <div className="border border-slate-100 shadow-sm rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Repasses Este Mês</span>
              <div className="space-y-1">
                <div className="text-lg font-black text-slate-800">R$ 8.924,00</div>
                <p className="text-[10px] text-slate-500 leading-snug">Taxa de administração imobiliária de 8.0% deduzida na fonte.</p>
                <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold text-[9px]">Pago via Pix em 12/06</span>
              </div>
            </div>

            {/* Box 3: Agendamentos de Visitas */}
            <div className="border border-slate-100 shadow-sm rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Visitas Agendadas p/ Venda</span>
              <div className="space-y-2 text-xs">
                <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100 text-[10px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Sábado, dia 24 às 10:00</span>
                    <span>Apto Jardins</span>
                  </div>
                  <p className="text-slate-500">Inquilino avisado com antecedência de 48h conforme Lei.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PORTAL DO LOCATÁRIO VIEW */}
      {activePortal === "locatario" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="portal-locatario-pane">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Espaço do Inquilino / Locatário</h3>
              <p className="text-xs text-slate-500">Segunda via de boletos de aluguel, reajuste IPCA de cláusula e prestação de ocorrências.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold font-mono">CLIENTE: MAURÍCIO NEVES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Boletos de Aluguel Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" /> Boleto da Mensalidade Corrente
              </h4>

              <div className="bg-white p-3.5 border border-slate-150 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Competência Julho/2026</span>
                  <span className="block text-base font-black text-slate-800">R$ 6.500,00</span>
                  <span className="text-[10px] text-slate-400">Vence em 10/07/2026 &mdash; Porto Seguro Fiança</span>
                </div>
                <button 
                  type="button"
                  onClick={() => alert("Simulando download do boleto bancário PDF formatado com código Pix válido.")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>

              <div className="text-[10px] text-slate-500">
                Qualquer atraso incidirá multa de 10.0% e juros de 1.0% ao mês com encaminhamento ao seguro fiador Porto Seguro em até 30 dias.
              </div>
            </div>

            {/* Chamado de Manutenção Rápido */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" /> Histórico de Chamados / Manutenção
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold">Manutenção Ar-Condicionado</span>
                    <span className="block text-[10px] text-slate-400">Aberto em 18/06/2026</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-black text-[9px] rounded uppercase">Técnico Agendado</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold">Vazamento Válvula Hydra Lavabo</span>
                    <span className="block text-[10px] text-slate-400">Aberto em 02/06/2026</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[9px] rounded uppercase">Finalizado</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PORTAL DO COMPRADOR VIEW */}
      {activePortal === "comprador" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="portal-comprador-pane">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Espaço do Investidor / Comprador</h3>
              <p className="text-xs text-slate-500">Acompanhe suas propostas em andamento, simule financiamentos de imóveis salvos e veja favoritos.</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold font-mono">CLIENTE: JULIANA DIAS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Propostas em andamento */}
            <div className="border border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Histórico de Propostas Enviadas</h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-xs">Sítio Vista Verde Orgânicos</span>
                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-850 font-bold rounded text-[9px]">EM ANÁLISE JURÍDICA</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Valor Ofertado:</span>
                    <span className="font-bold">R$ 2.300.000,00</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">"Simulando fluxo safra com 40% entrada e saldo parcelado em 3 parcelas anuais."</p>
                </div>
              </div>
            </div>

            {/* Imóveis Favoritos */}
            <div className="border border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Meus Favoritos Guardados
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                  <span>Apartamento Premium Jardins &mdash; SP</span>
                  <button onClick={() => alert("Favorito guardado")} className="text-sky-600 font-bold hover:underline">Ver Detalhes</button>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                  <span>Mansão contemporânea Alphaville &mdash; Baru</span>
                  <button onClick={() => alert("Favorito guardado")} className="text-sky-600 font-bold hover:underline">Ver Detalhes</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PORTAL DO CORRETOR VIEW */}
      {activePortal === "corretor" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="portal-corretor-pane">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Espaço de Alta Performance do Corretor</h3>
              <p className="text-xs text-slate-500">Sua agenda diária de visitas aos imóveis, metas de vendas e acompanhamento de comissões.</p>
            </div>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold font-mono">CORRETOR: RICARDO SILVA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: Minhas comissões */}
            <div className="border border-slate-150 p-4 rounded-xl space-y-2 shadow-sm bg-gradient-to-br from-purple-50/50 to-white">
              <span className="text-[10px] text-purple-705 font-bold uppercase tracking-wider block">Minhas Comissões Estimadas</span>
              <div className="text-xl font-black text-slate-800">R$ 54.200,00</div>
              <p className="text-[10px] text-slate-500">Base média de 1.8% de repasse pessoal sobre VGV das vendas Moema e Jardins.</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[80%]" />
              </div>
            </div>

            {/* Box 2: Minhas metas */}
            <div className="border border-slate-150 p-4 rounded-xl space-y-2 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Minha Meta Comercial Trimestral</span>
              <div className="text-lg font-black text-slate-800">VGV Realizado: R$ 3.8M</div>
              <p className="text-[10px] text-slate-500">Meta estipulada de R$ 5.0M. Falta apenas mais um fechamento de fazenda!</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[76%]" />
              </div>
            </div>

            {/* Box 3: Compromissos / Visitas hoje */}
            <div className="border border-slate-150 p-4 rounded-xl space-y-2 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Agenda de Visita &amp; Vistorias</span>
              <div className="space-y-1.5 text-[10px]">
                <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="font-bold block">14:00 - Visita Apto Moema Studio</span>
                  <span className="text-slate-500">Adquirente: Patrícia Menezes</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="font-bold block">16:30 - Vistoria Entrada Jardins</span>
                  <span className="text-slate-500">Inquilino: Maurício Neves</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
