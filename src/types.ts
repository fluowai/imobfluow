export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string; // e.g. "Zap Imóveis", "Instagram Ads", "WhatsApp"
  stage: string; // Kanban column
  kanbanType: "atendimento" | "oportunidade" | "posvenda";
  score: number;
  category: "Frio" | "Morno" | "Quente";
  createdAt: string;
  avatarColor: string;
  profile: {
    city: string;
    bairro: string;
    tipo: string;
    faixaInvestimento: string;
    formaPagamento: string;
    prazoCompra: string;
    perfilComprador: string;
  };
}

export interface Property {
  id: string;
  type: "urbano" | "rural";
  category: string; // e.g. "apartamento", "fazenda", "casa", "lote"
  title: string;
  neighborhood: string;
  city: string;
  price: number;
  rentPrice?: number;
  area?: number; // m² for urban
  rooms?: number;
  bathrooms?: number;
  suites?: number;
  parking?: number;
  description: string;
  features: string[];
  // Rural fields
  areaHectares?: number;
  usableAreaHectares?: number;
  waterResources?: string;
  soilType?: string;
  production?: string;
  incra?: string;
  car?: string;
}

export interface ContractDraft {
  nomeDocumento: string;
  tipoLegislacao: string;
  dataGeracao: string;
  minutaMarkdown: string;
  observacoesAdvogado: string;
}

export interface LeaseContract {
  id: string;
  tenantName: string;
  ownerName: string;
  propertyTitle: string;
  monthlyValue: number;
  guarantor: string; // seguro fiança / caução / fiador
  status: "Ativo" | "Em Atraso" | "Renovação" | "Rescindido";
  dueDate: string;
  nextReadjustmentDate: string;
}
