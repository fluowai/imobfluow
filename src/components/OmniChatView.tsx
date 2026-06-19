import React, { useState } from "react";
import { 
  QrCode, 
  Settings, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Mail, 
  CheckCheck, 
  Volume2, 
  UserPlus2, 
  Activity, 
  HeartHandshake, 
  Check, 
  Zap,
  Clock,
  Sparkles,
  Send
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  channel: "whatsapp" | "instagram" | "facebook" | "email" | "chat";
  text: string;
  time: string;
  status: "lido" | "recebido" | "enviado";
  phoneOrHandle: string;
}

const initialInbox: ChatMessage[] = [
  {
    id: "msg-1",
    senderName: "Carlos Eduardo (Zap)",
    senderAvatar: "CE",
    channel: "whatsapp",
    text: "Olá! Vi a cobertura de R$ 3.4M anunciada no site e queria saber o valor do condomínio mensal.",
    time: "14:20",
    status: "recebido",
    phoneOrHandle: "(11) 98211-3050",
  },
  {
    id: "msg-2",
    senderName: "Carla Menezes @prado",
    senderAvatar: "CM",
    channel: "instagram",
    text: "Vocês aceitam permuta de apartamento menor valor na casa de Alphaville?",
    time: "13:45",
    status: "lido",
    phoneOrHandle: "@carla_menezes",
  },
  {
    id: "msg-3",
    senderName: "Roberto Marinho (E-Mail)",
    senderAvatar: "RM",
    channel: "email",
    text: "Prezados, favor enviar a matrícula INCRA atualizada do Sítio Vista Verde para análise jurídica do banco.",
    time: "Ontem, 17:10",
    status: "enviado",
    phoneOrHandle: "roberto@marinho.com.br",
  },
  {
    id: "msg-4",
    senderName: "Ana Júlia Santos",
    senderAvatar: "AJ",
    channel: "chat",
    text: "Oi, qual a taxa de seguro fiança que vocês exigem para locação do Studio Loft Moema?",
    time: "10:05",
    status: "recebido",
    phoneOrHandle: "Chat Site Direto",
  },
];

export default function OmniChatView() {
  const [inbox, setInbox] = useState<ChatMessage[]>(initialInbox);
  const [activeChatId, setActiveChatId] = useState<string>("msg-1");
  const [qrCodeConnected, setQrCodeConnected] = useState<boolean>(true);
  const [replyInput, setReplyInput] = useState<string>("");

  // Simulated live message thread state for the chat
  const [conversations, setConversations] = useState<Record<string, Array<{ text: string; sender: "client" | "agent"; time: string }>>>({
    "msg-1": [
      { text: "Oi! Vi o anúncio no Zap Imóveis.", sender: "client", time: "14:18" },
      { text: "Estou muito interessado na cobertura dos Jardins.", sender: "client", time: "14:19" },
      { text: "Vocês poderiam me passar o valor exato das taxas de IPTU e do condomínio?", sender: "client", time: "14:20" },
    ],
    "msg-2": [
      { text: "Olá! Gostaria de tirar uma dúvida sobre permutas.", sender: "client", time: "13:40" },
      { text: "Aceitam apartamento no Panamby de R$ 900 mil como parte do pagamento?", sender: "client", time: "13:45" },
    ],
    "msg-3": [
      { text: "Bom dia, o banco pediu o CAR e INCRA para liberação do financiamento rural.", sender: "client", time: "Ontem, 16:55" },
      { text: "Pode me enviar?", sender: "client", time: "Ontem, 17:10" },
    ],
    "msg-4": [
      { text: "Estou no site procurando quitinetes ou estúdios em Moema.", sender: "client", time: "10:00" },
      { text: "Consegue simular o aluguel sem fiador?", sender: "client", time: "10:05" },
    ]
  });

  const activeMsg = inbox.find(m => m.id === activeChatId) || inbox[0];
  const activeThread = conversations[activeChatId] || [];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    // Add to specific conversation thread
    const updatedThread = [
      ...activeThread,
      { text: replyInput, sender: "agent" as const, time: "16:11" }
    ];

    setConversations({
      ...conversations,
      [activeChatId]: updatedThread
    });

    setReplyInput("");

    // Simulate Client Quick Auto Response after a few moments
    setTimeout(() => {
      const responses = [
        "Perfeito! Vou avaliar com a minha esposa e te aviso.",
        "Pode me enviar esse material completo por favor?",
        "Qual o próximo passo para visitarmos o local?",
        "Maravilha, vou entrar em contato com o meu gerente de financiamento!"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      setConversations(prev => ({
        ...prev,
        [activeChatId]: [
          ...prev[activeChatId],
          { text: randomReply, sender: "client", time: "Just now" }
        ]
      }));
    }, 1500);
  };

  const toggleQrConnection = () => {
    setQrCodeConnected(!qrCodeConnected);
  };

  return (
    <div className="space-y-6" id="omnichat-wrapper">
      
      {/* Top Banner explaining Multi-session integration with WhatsMeow */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-5" id="omni-banner">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-[10px] uppercase font-bold text-sky-600 block">Atendimento Omnichannel &amp; Multi-empresa</span>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Central Única de Conversas &mdash; WhatsMeow Nilo</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nossa plataforma utiliza a consagrada integração nativa <strong>WhatsMeow Go</strong> para fornecer multi-sessão e QR Code estáveis, de modo que suas contas de imobiliária urbanas e rurais permaneçam logadas simultaneamente sem desconectar.
          </p>
        </div>

        {/* WhatsApp QR Code connection status widget */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0 select-none">
          <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
            {qrCodeConnected ? (
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs rounded">
                ● LIVE
              </div>
            ) : (
              <QrCode className="w-10 h-10 text-slate-700" />
            )}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Dispositivo WhatsApp</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${qrCodeConnected ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
              <span className="text-xs font-bold text-slate-800">
                {qrCodeConnected ? "Sessão Conectada (WhatsMeow)" : "Sessão Desconectada"}
              </span>
            </div>
            <button 
              type="button"
              onClick={toggleQrConnection}
              className="text-[10px] text-sky-600 hover:text-sky-800 block underline font-bold"
              id="btn-toggle-qr-sim"
            >
              {qrCodeConnected ? "Desconectar Sessão" : "Escanear QR Code de Ativação"}
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Setup Modal if session is false */}
      {!qrCodeConnected && (
        <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border-2 border-dashed border-sky-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-6 shadow-sm shrink-0" id="qr-scan-module">
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center">
            {/* Visual simulation of QR Code */}
            <div className="bg-slate-900 h-44 w-44 rounded-lg p-2.5 flex flex-wrap gap-0.5 justify-center items-center">
              {Array.from({ length: 49 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-5 w-5 rounded-sm ${
                    (i % 3 === 0 && i % 2 === 0) || i < 12 || i > 38 ? "bg-white" : "bg-slate-900"
                  }`} 
                />
              ))}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-3 block">QR Code Autogerado</span>
            <span className="text-xs font-black text-blue-600">v4.12.5 Stable Session</span>
          </div>

          <div className="space-y-3.5 max-w-md">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100/60 text-blue-800 text-[10px] font-bold rounded-full">
              <Zap className="w-3.5 h-3.5" /> Integração Multiempresas
            </div>
            <h4 className="text-base font-extrabold text-slate-800">Como conectar o seu WhatsApp Comercial?</h4>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-snug">
              <li>Abra o aplicativo WhatsApp no seu celular</li>
              <li>Acesse <span className="font-bold">Aparelhos Conectados</span> na engrenagem de configurações</li>
              <li>Toque em <span className="font-bold">Conectar um Aparelho</span></li>
              <li>Aponte a câmera do seu telefone para esta tela e escaneie o código de barras</li>
            </ol>
            <button 
              type="button"
              onClick={() => setQrCodeConnected(true)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow transition"
              id="btn-trigger-ws-connect"
            >
              Simular Conexão Realizada
            </button>
          </div>
        </div>
      )}

      {/* Main Omnichannel Unified inbox workspace: Columns list on Left / Active message chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="omni-workspace">
        
        {/* Inbox message listing column */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between" id="omni-inbox-column">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="text-xs font-black text-slate-700 uppercase">Caixa Unificada ({inbox.length})</span>
            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-bold rounded-full flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Som Ativado
            </span>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[360px]" id="inbox-list-items">
            {inbox.map(item => {
              const active = item.id === activeChatId;
              let logo = <MessageCircle className="w-4 h-4 text-emerald-500" />;
              if (item.channel === "instagram") logo = <Instagram className="w-4 h-4 text-purple-500" />;
              if (item.channel === "facebook") logo = <Facebook className="w-4 h-4 text-blue-600" />;
              if (item.channel === "email") logo = <Mail className="w-4 h-4 text-slate-500" />;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveChatId(item.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                    active ? "bg-sky-50/50 border-l-4 border-l-sky-500" : "hover:bg-slate-50"
                  }`}
                  id={`btn-inbox-item-${item.id}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-150 flex items-center justify-center font-bold text-slate-700 text-xs text-center shrink-0">
                    {item.senderAvatar}
                  </div>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 text-xs truncate block">{item.senderName}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate leading-snug">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {logo}
                      <span className="text-[9px] text-slate-400 font-bold">{item.phoneOrHandle}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-wider font-semibold">
            Merged Instagram &amp; Zap feeds
          </div>
        </div>

        {/* Active conversation details and response box */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between" id="active-chat-conversation">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50" id="active-chat-header">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                {activeMsg.senderAvatar}
              </div>
              <div>
                <span className="font-extrabold text-slate-800 text-xs block leading-tight">{activeMsg.senderName}</span>
                <span className="text-[10px] text-slate-400 block font-semibold">{activeMsg.phoneOrHandle}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="px-2.5 py-0.5 bg-white border border-slate-250 text-slate-700 text-[10px] font-bold rounded">
                Canal: {activeMsg.channel.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Live thread scrollarea */}
          <div className="p-4 bg-slate-50/20 space-y-3.5 h-[230px] overflow-y-auto" id="conversation-scroller">
            {activeThread.map((msg, i) => {
              const isAgent = msg.sender === "agent";
              return (
                <div key={i} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg text-xs max-w-[75%] leading-relaxed ${
                    isAgent 
                      ? "bg-slate-950 text-white rounded-br-none" 
                      : "bg-white text-slate-700 border border-slate-150 shadow-sm rounded-bl-none"
                  }`}>
                    <p>{msg.text}</p>
                    <div className="flex justify-end gap-1 items-center mt-1 text-[9px] opacity-70">
                      <span>{msg.time}</span>
                      {isAgent && <CheckCheck className="w-3 h-3 text-sky-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick replies pre-filled suggestions */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1.5" id="preset-replies">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Respostas Rápidas do Atendimento</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setReplyInput("Olá! Que excelente contato. Verifiquei aqui no acervo e o IPTU deste apartamento é R$ 420,00 mensal. Gostaria de simular as condições de pagamento?")}
                className="px-2 py-1 bg-white hover:bg-slate-150 text-[10px] text-slate-600 rounded border border-slate-200 transition"
              >
                Passar Condomínio / IPTU
              </button>
              <button
                type="button"
                onClick={() => setReplyInput("Claro! Podemos simular permutas sim. Nosso painel comercial aceita imóveis como parte do pagamento mediante avaliação física prévia.")}
                className="px-2 py-1 bg-white hover:bg-slate-150 text-[10px] text-slate-600 rounded border border-slate-200 transition"
              >
                Permuta de Imóvel
              </button>
              <button
                type="button"
                onClick={() => setReplyInput("O rascunho da minuta solicitada está pronto. Por favor acesse o menu ao lado para assinar digitalmente via Dr. Fluow de exclusividade.")}
                className="px-2 py-1 bg-white hover:bg-slate-150 text-[10px] text-slate-600 rounded border border-slate-200 transition"
              >
                Aviso: Contrato Pronto
              </button>
            </div>
          </div>

          {/* Send Input form */}
          <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 flex gap-2 bg-white" id="omnichat-form-input">
            <input 
              type="text" 
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Digite a resposta do atendente..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-sky-500"
              id="txt-omnichat-input"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0"
              id="btn-omnichat-submit"
            >
              Responder <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
