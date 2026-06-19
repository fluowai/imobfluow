import React, { useState } from "react";
import { 
  Building2, 
  Map, 
  Calendar, 
  Layers, 
  Compass, 
  DollarSign, 
  Droplets, 
  TrendingUp, 
  Gauge, 
  Navigation, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  ArrowUpRight 
} from "lucide-react";
import { Property } from "../types";

// Base starting list representing preloaded urban/rural real-estate portfolio
const preloadedProperties: Property[] = [
  {
    id: "urb-1",
    type: "urbano",
    category: "apartamento",
    title: "Apartamento Premium Jardins",
    neighborhood: "Jardins",
    city: "São Paulo",
    price: 1850000,
    rentPrice: 6500,
    area: 120,
    rooms: 3,
    bathrooms: 4,
    suites: 2,
    parking: 2,
    description: "Apartamento de alto padrão inteiramente reformado, varanda gourmet envidraçada e lazer de resort.",
    features: ["Piscina Aquecida", "Academia", "Varanda Gourmet", "Automação"],
  },
  {
    id: "urb-2",
    type: "urbano",
    category: "casa",
    title: "Mansão Contemporânea Alphaville",
    neighborhood: "Alphaville",
    city: "Barueri",
    price: 3400000,
    rentPrice: 15000,
    area: 380,
    rooms: 4,
    bathrooms: 5,
    suites: 4,
    parking: 4,
    description: "Casa espetacular em condomínio de luxo com energia fotovoltaica, piscina de borda infinita e pé direito duplo.",
    features: ["Energia Solar", "Piscina", "Suítes Completas", "Churrasqueira"],
  },
  {
    id: "rur-1",
    type: "rural",
    category: "fazenda",
    title: "Fazenda Progresso & Grãos",
    neighborhood: "Setor Agrícola",
    city: "Sorocaba",
    price: 12500000,
    areaHectares: 280,
    usableAreaHectares: 210,
    waterResources: "Nascente própria, 2 represas internas de grande porte e canal do rio principal.",
    soilType: "Argila vermelha profunda (terra roxa) excelente dreno.",
    production: "Cultivo ativo de soja e rotação de safrinha (milho). Porteira fechada com barracão.",
    description: "Fazenda de grãos produtiva diferenciada, com excelente escoamento e acesso logístico.",
    features: ["Silobox", "Barracão Maquinários", "Casa Sede Histórica", "CAR Regularizado"],
    incra: "950.120.340.540-1",
    car: "SP-3552205-EABC-DF91",
  },
  {
    id: "rur-2",
    type: "rural",
    category: "sitio",
    title: "Sítio Vista Verde Orgânicos",
    neighborhood: "Área Ecológica",
    city: "Bragança Paulista",
    price: 2400000,
    areaHectares: 24,
    usableAreaHectares: 15,
    waterResources: "Ribeirão cristalino contornando a divisa total, poço artesiano potente.",
    soilType: "Terra mista arenosa corrigida, estufas instaladas.",
    production: "Hortaliças hidropônicas orgânicas com distribuição direta de atacado.",
    description: "Lindo sítio produtivo focado no agronegócio de orgânicos, estufas modernas e sede completa.",
    features: ["Casa de Trabalhadores", "Curral", "Estufas de Irrigação", "Pomar Produtivo"],
    incra: "951.100.220.110-3",
    car: "SP-3601509-FDCB-1122",
  },
];

export default function PropertyView() {
  const [properties, setProperties] = useState<Property[]>(preloadedProperties);
  const [activeTab, setActiveTab] = useState<"urbano" | "rural">("urbano");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  // Cadastro States
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    neighborhood: "Centro",
    price: "",
    rentPrice: "",
    description: "",
    category: "apartamento",
    // Urbano fields
    area: "",
    rooms: "2",
    bathrooms: "2",
    suites: "1",
    parking: "1",
    // Rural fields
    areaHectares: "",
    usableAreaHectares: "",
    waterResources: "Poço artesiano e nascentes",
    soilType: "Terra roxa boa drenagem",
    production: "Lazer e pecuária rústica",
    incra: "",
    car: "",
  });

  // Integrations Simulated Verification state
  const [verifiedGov, setVerifiedGov] = useState<Record<string, "idle" | "verifying" | "verified">>({});

  const handleVerifyRegistry = (id: string, typeRegistry: string) => {
    setVerifiedGov(prev => ({ ...prev, [`${id}-${typeRegistry}`]: "verifying" }));
    setTimeout(() => {
      setVerifiedGov(prev => ({ ...prev, [`${id}-${typeRegistry}`]: "verified" }));
    }, 1200);
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      type: activeTab,
      category: formData.category,
      title: formData.title,
      neighborhood: formData.neighborhood,
      city: formData.city || "São Paulo",
      price: Number(formData.price) || 0,
      rentPrice: Number(formData.rentPrice) || undefined,
      description: formData.description || "Sem descrição cadastrada.",
      features: ["Recém cadastrado", "Exclusividade Fluow"],
      // Urbano
      area: Number(formData.area) || undefined,
      rooms: Number(formData.rooms) || undefined,
      bathrooms: Number(formData.bathrooms) || undefined,
      suites: Number(formData.suites) || undefined,
      parking: Number(formData.parking) || undefined,
      // Rural
      areaHectares: Number(formData.areaHectares) || undefined,
      usableAreaHectares: Number(formData.usableAreaHectares) || undefined,
      waterResources: formData.waterResources,
      soilType: formData.soilType,
      production: formData.production,
      incra: formData.incra || `INCRA-${Math.floor(Math.random() * 900000 + 100000)}`,
      car: formData.car || `CAR-${Math.floor(Math.random() * 800000 + 200000)}`,
    };

    setProperties([newProp, ...properties]);
    setShowAddForm(false);
    // Reset fundamental fields
    setFormData({
      ...formData,
      title: "",
      price: "",
      rentPrice: "",
      description: "",
      area: "",
      areaHectares: "",
      usableAreaHectares: "",
      incra: "",
      car: "",
    });
  };

  const filtered = properties.filter(p => {
    if (p.type !== activeTab) return false;
    if (categoryFilter !== "Todos" && p.category !== categoryFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.neighborhood.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6" id="propview-root">
      
      {/* Header and Type Toggles */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" id="properties-control">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-600 block">Inventário Geral Integrado</span>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Portfólio de Imóveis ImobFluow</h2>
        </div>

        {/* Urbano / Rural Tab Mode */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto" id="property-tab-switcher">
          <button 
            type="button"
            onClick={() => { setActiveTab("urbano"); setCategoryFilter("Todos"); }}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${
              activeTab === "urbano" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            id="btn-tab-urbano"
          >
            <Building2 className="w-4 h-4" /> Painel Urbano
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab("rural"); setCategoryFilter("Todos"); }}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${
              activeTab === "rural" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            id="btn-tab-rural"
          >
            <Map className="w-4 h-4" /> Painel Rural
          </button>
        </div>
      </div>

      {/* Grid of 2 columns: BI Inteligente on Left / Property listings on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLENA 1: Business Intelligence Avançado (Urbano vs Rural) */}
        <div className="lg:col-span-1 space-y-6" id="bi-panel">
          
          {activeTab === "urbano" ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4" id="bi-urbano-card">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Gauge className="w-5 h-5 text-blue-500" />
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Módulo BI Urbano</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dados macroeconômicos integrados automaticamente via BrasilAPI, IBGE e históricos internos ImobFluow.
              </p>

              <div className="space-y-3 pt-1">
                {/* m2 price indicator */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Preço Médio do m²</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-slate-800">R$ 10.450 / m²</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-bold">+4.12% aa</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tempo de Liquidez (venda):</span>
                    <span className="font-semibold text-slate-800">110 dias</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tempo de Liquidez (locação):</span>
                    <span className="font-semibold text-slate-800">18 dias</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Potencial Valorização regional:</span>
                    <span className="font-semibold text-sky-600 font-bold flex items-center gap-0.5">Alto <TrendingUp className="w-3 h-3" /></span>
                  </div>
                </div>

                {/* Proximidades e Mobilidade urbana */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Zona de Zoneamento Mun.</span>
                  <div className="bg-blue-50/50 border border-blue-100 rounded p-2.5 space-y-1.5 text-[10px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Proximidade Metrô:</span>
                      <span className="font-bold text-slate-800">88%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escolas / Hospitais:</span>
                      <span className="font-bold text-slate-800">92% (Excelente)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zoneamento Comercial:</span>
                      <span className="font-bold text-slate-800">Permitido (ZCOR)</span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Provisório */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Mapa de Valor da Região</span>
                  <div className="h-28 bg-slate-100 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-200">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-300 via-sky-100 to-slate-100 opacity-60" />
                    <span className="text-[10px] font-bold text-slate-600 bg-white/90 px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-sky-500 animate-pulse" /> SP &bull; Jardins High Demand
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4" id="bi-rural-card">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Módulo BI Rural</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Métricas de fazendas e plantios com dados públicos do INCRA, Embrapa e cotações de sacas de commodities.
              </p>

              <div className="space-y-3 pt-1">
                {/* Hectare price indicator */}
                <div className="bg-emerald-50/50 rounded-lg p-3 space-y-1 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block text-xs">Valor por Hectare</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-slate-800">R$ 45.000 / ha</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded font-bold">Sorocaba/SP</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Aptidão Pecuária:</span>
                    <span className="font-semibold text-slate-800">Alta (Capim Mombaça)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Aptidão Agrícola (Grãos):</span>
                    <span className="font-semibold text-emerald-600 font-bold">Excelente (72 sacas/ha)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Potencial Loteamento Chácaras:</span>
                    <span className="font-semibold text-slate-800">Viável com plano diretor</span>
                  </div>
                </div>

                {/* Hidrografia e Logística */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Recursos e Logística</span>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2.5 space-y-1.5 text-[10px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Proximidade Rodovia Pavimentada:</span>
                      <span className="font-bold text-slate-800">4.5 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distância do Porto Principal:</span>
                      <span className="font-bold text-slate-800">180 km (Santos/SP)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reserva Legal / APP:</span>
                      <span className="font-bold text-slate-800 border-b border-dotted border-slate-400 cursor-help" title="Área de Preservação Permanente">20% Regularizada</span>
                    </div>
                  </div>
                </div>

                {/* Atividade Econômica Estimada */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 space-y-1">
                  <span className="font-bold block uppercase">Cotações Spot Real ImobFluow:</span>
                  <p>Soja (Saca 60kg): <strong>R$ 138,50</strong> | Milho (Saca): <strong>R$ 62,40</strong></p>
                  <p className="text-[9px] text-amber-700">Análise de VGV Rural se beneficia por aumento cambial ativo.</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* COLUNA 2 e 3: Listas das propriedades + Cadastro */}
        <div className="lg:col-span-2 space-y-4" id="listings-panel">
          
          {/* Barra de Filtros e Busca de Imóvel */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3" id="filters-properties">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "urbano" ? "Buscar por bairro, condomínio, cidade..." : "Buscar fazendas, recursos, CAR..."}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-sky-500"
                id="search-properties"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Categoria:</span>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-xs rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                id="filter-category"
              >
                <option value="Todos">Todos</option>
                {activeTab === "urbano" ? (
                  <>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="sala">Sala Comercial</option>
                  </>
                ) : (
                  <>
                    <option value="fazenda">Fazenda</option>
                    <option value="sitio">Sítio</option>
                    <option value="haras">Haras</option>
                  </>
                )}
              </select>

              {/* Botão para Acionar Cadastro */}
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="ml-2 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                id="btn-add-property-toggle"
              >
                <Plus className="w-3.5 h-3.5" /> Incluir Imóvel
              </button>
            </div>
          </div>

          {/* Form de Cadastro de Imóvel */}
          {showAddForm && (
            <form onSubmit={handleAddProperty} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4" id="add-property-form">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                  Cadastro de Imóvel {activeTab.toUpperCase()}
                </h3>
                <span className="text-[10px] text-sky-600 font-bold">Ficha Técnica Completa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-500 block mb-1">Título de Exibição</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Fazenda Santa Maria Café"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none focus:ring-1 focus:ring-sky-500"
                    id="inp-prop-title"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none focus:ring-1 focus:ring-sky-500"
                    id="inp-prop-cat"
                  >
                    {activeTab === "urbano" ? (
                      <>
                        <option value="apartamento">Apartamento</option>
                        <option value="casa">Casa</option>
                        <option value="sala comercial">Sala Comercial</option>
                      </>
                    ) : (
                      <>
                        <option value="fazenda">Fazenda</option>
                        <option value="sitio">Sítio</option>
                        <option value="haras">Haras</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Sorocaba"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    id="inp-prop-city"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Bairro / Região</label>
                  <input 
                    type="text" 
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Ex: Centro"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    id="inp-prop-nh"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Preço Venda (R$)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 850000"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    id="inp-prop-price"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Preço Locação / Mês (Opcional)</label>
                  <input 
                    type="number" 
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    placeholder="Ex: 4500"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none"
                    id="inp-prop-rent"
                  />
                </div>
              </div>

              {/* DYNAMIC FIELDS: URBANO VS RURAL */}
              {activeTab === "urbano" ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Área m²</label>
                    <input 
                      type="number" 
                      value={formData.area} 
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                      id="inp-urban-area"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Quartos</label>
                    <input 
                      type="number" 
                      value={formData.rooms} 
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                      id="inp-urban-rooms"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Banheiros</label>
                    <input 
                      type="number" 
                      value={formData.bathrooms} 
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                    id="inp-urban-bath"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Suítes</label>
                    <input 
                      type="number" 
                      value={formData.suites} 
                      onChange={(e) => setFormData({ ...formData, suites: e.target.value })}
                      className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                      id="inp-urban-suites"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Vagas</label>
                    <input 
                      type="number" 
                      value={formData.parking} 
                      onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                      className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                      id="inp-urban-park"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Área total (Hectares)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.areaHectares} 
                        onChange={(e) => setFormData({ ...formData, areaHectares: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                        placeholder="Ex: 100"
                        id="inp-rural-ha"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Área útil de uso (ha)</label>
                      <input 
                        type="number" 
                        value={formData.usableAreaHectares} 
                        onChange={(e) => setFormData({ ...formData, usableAreaHectares: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                        placeholder="Ex: 80"
                        id="inp-rural-uha"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Matrícula INCRA</label>
                      <input 
                        type="text" 
                        value={formData.incra} 
                        onChange={(e) => setFormData({ ...formData, incra: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                        placeholder="Ex: 950.120..."
                        id="inp-rural-incra"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Cadastro Ambiental (CAR)</label>
                      <input 
                        type="text" 
                        value={formData.car} 
                        onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none rounded"
                        placeholder="Ex: SP-355..."
                        id="inp-rural-car"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Recursos Hídricos</label>
                      <input 
                        type="text" 
                        value={formData.waterResources} 
                        onChange={(e) => setFormData({ ...formData, waterResources: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none"
                        id="inp-rural-water"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Tipo de Solo</label>
                      <input 
                        type="text" 
                        value={formData.soilType} 
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none"
                        id="inp-rural-soil"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Produção Ativa</label>
                      <input 
                        type="text" 
                        value={formData.production} 
                        onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                        className="w-full p-1 border border-slate-200 text-xs text-slate-800 outline-none"
                        id="inp-rural-prod"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Descrição Comercial</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Informações adicionais persistentes..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 rounded outline-none h-16 resize-none"
                  id="inp-prop-desc"
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
                  id="btn-prop-cancel"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                  id="btn-prop-save"
                >
                  Salvar Imóvel no Acervo
                </button>
              </div>
            </form>
          )}

          {/* List Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="properties-grid-list">
            {filtered.length === 0 ? (
              <div className="md:col-span-2 py-12 text-center text-slate-400 font-medium bg-white rounded-xl border border-slate-200">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Nenhum imóvel encontrado para essa combinação de busca ou categoria.</p>
              </div>
            ) : (
              filtered.map(prop => {
                return (
                  <div 
                    key={prop.id} 
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                    id={`prop-item-${prop.id}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          prop.type === "urbano" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {prop.category.toUpperCase()}
                        </span>
                        
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-800 block">
                            {prop.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                          </span>
                          {prop.rentPrice && (
                            <span className="text-[10px] text-slate-500 font-bold">
                              Aluguel: {prop.rentPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-800 leading-snug line-clamp-1">{prop.title}</h4>
                      <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <LocationIcon /> {prop.neighborhood}, {prop.city}
                      </p>
                      
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {prop.description}
                      </p>
                    </div>

                    {/* DYNAMIC METRICS FOOTER */}
                    {prop.type === "urbano" ? (
                      <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-lg text-center" id="urban-badge-list">
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block">Área</span>
                          <span className="text-xs font-bold text-slate-700">{prop.area} m²</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block">Quartos</span>
                          <span className="text-xs font-bold text-slate-700">{prop.rooms} Q &bull; {prop.suites} Suítes</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block">Vagas</span>
                          <span className="text-xs font-bold text-slate-700">{prop.parking || 0} vagas</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-600" id="rural-badge-list">
                        <div className="grid grid-cols-2 gap-1.5 text-center">
                          <div className="border-r border-slate-200">
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Área Total</span>
                            <span className="text-xs font-bold text-slate-700">{prop.areaHectares} Hectares</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Área Útil</span>
                            <span className="text-xs font-bold text-slate-700">{prop.usableAreaHectares} ha ({Math.round(((prop.usableAreaHectares || 1) / (prop.areaHectares || 1)) * 100)}%)</span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-200 space-y-1">
                          <div><span className="font-bold text-slate-500">Solo:</span> {prop.soilType}</div>
                          <div><span className="font-bold text-slate-500">Hidrografia:</span> {prop.waterResources}</div>
                          <div><span className="font-bold text-slate-500">Produção:</span> {prop.production}</div>
                        </div>

                        {/* Brazilian CAR/INCRA integrated validator */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                          <div className="space-y-0.5 text-[9px]">
                            <div><span className="font-semibold text-slate-400">INCRA:</span> <code className="bg-white px-1 py-0.5 border border-slate-200 rounded">{prop.incra}</code></div>
                            <div><span className="font-semibold text-slate-400">CAR:</span> <code className="bg-white px-1 py-0.5 border border-slate-200 rounded">{prop.car}</code></div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => handleVerifyRegistry(prop.id, "gov")}
                            className={`px-2 py-1 text-[9px] font-bold rounded flex items-center gap-1 leading-none shadow-sm transition-all ${
                              verifiedGov[`${prop.id}-gov`] === "verified"
                                ? "bg-emerald-100 text-emerald-800"
                                : verifiedGov[`${prop.id}-gov`] === "verifying"
                                ? "bg-amber-100 text-amber-800 animate-pulse"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                            id={`btn-verify-${prop.id}`}
                          >
                            <FileText className="w-3 h-3" />
                            {verifiedGov[`${prop.id}-gov`] === "verified"
                              ? "SIGEF / INCRA Ativos"
                              : verifiedGov[`${prop.id}-gov`] === "verifying"
                              ? "Sincronizando..."
                              : "Validar Dados"
                            }
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Código: #{prop.type === "urbano" ? "URB" : "RUR"}-{prop.id.split("-")[1]}</span>
                      <div className="flex gap-1">
                        {prop.features.slice(0, 2).map((feat, i) => (
                          <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] text-slate-600 font-semibold">{feat}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-sky-500 fill-none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
