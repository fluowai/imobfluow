import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize Gemini client safely with standard parameters
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// A robust set of mock Brazilian properties for the AI SDR and Comercial assistant to match
const mockProperties = [
  {
    id: "urb-1",
    type: "urbano",
    category: "apartamento",
    title: "Apartamento Premium Jardins",
    neighborhood: "Jardins",
    city: "São Paulo",
    price: 1850000,
    rentPrice: 6500,
    area: 120, // m2
    rooms: 3,
    bathrooms: 4,
    suites: 2,
    parking: 2,
    description: "Apartamento alto padrão mobiliado, varanda gourmet envidraçada, lazer completo nos Jardins.",
    features: ["Piscina Aquecida", "Academia", "Segurança 24h", "Varanda Gourmet"],
  },
  {
    id: "urb-2",
    type: "urbano",
    category: "casa",
    title: "Minimalist House Alphaville",
    neighborhood: "Alphaville",
    city: "Barueri",
    price: 3400000,
    rentPrice: 15000,
    area: 380,
    rooms: 4,
    bathrooms: 5,
    suites: 4,
    parking: 4,
    description: "Mansão contemporânea com energia solar, piscina com borda infinita, conceito aberto inovador.",
    features: ["Energia Solar", "Piscina", "Automação Residencial", "Condomínio Fechado"],
  },
  {
    id: "urb-3",
    type: "urbano",
    category: "apartamento",
    title: "Studio Loft Moema",
    neighborhood: "Moema",
    city: "São Paulo",
    price: 650000,
    rentPrice: 3200,
    area: 45,
    rooms: 1,
    bathrooms: 1,
    suites: 1,
    parking: 1,
    description: "Studio moderno ideal para jovens profissionais ou investidores, no coração de Moema, a 200m do metrô.",
    features: ["Coworking", "Rooftop com piscina", "Bicicletário", "Laundromat"],
  },
  {
    id: "rur-1",
    type: "rural",
    category: "fazenda",
    title: "Fazenda Produtiva Grãos",
    neighborhood: "Rural",
    city: "Sorocaba",
    price: 12500000,
    areaHectares: 280,
    usableAreaHectares: 210,
    waterResources: "Nascente própria, 2 açudes e margem de rio de grande porte.",
    soilType: "Terra Roxa massapê profunda.",
    production: "Soja e Milho (média de 72 sacas/ha soja).",
    features: ["Silobox", "Barracão maquinários", "Casa sede colonial", "Georreferenciada"],
    incra: "950.120.340.540-1",
    car: "SP-3552205-EABC-DF91",
  },
  {
    id: "rur-2",
    type: "rural",
    category: "sitio",
    title: "Sítio Vista Verde",
    neighborhood: "Rural",
    city: "Bragança Paulista",
    price: 2400000,
    areaHectares: 24,
    usableAreaHectares: 15,
    waterResources: "Poço artesiano de alta vazão, ribeirão na divisa.",
    soilType: "Terra mista arenosa ideal para fruticultura e pasto.",
    production: "Pecuária leiteira de pequeno porte e turismo rural.",
    features: ["Curral novo", "Casa de hóspedes", "Pomar formado", "Lago para pesca"],
    incra: "951.100.220.110-3",
    car: "SP-3601509-FDCB-1122",
  },
  {
    id: "rur-3",
    type: "rural",
    category: "haras",
    title: "Haras Real do Sol",
    neighborhood: "Rural",
    city: "Goiânia",
    price: 7800000,
    areaHectares: 45,
    usableAreaHectares: 38,
    waterResources: "Mini-barragem e 4 bebedouros automáticos com água de mina.",
    soilType: "Terra firme de excelente drenagem para equinos.",
    production: "Criação de cavalos de raça Manga-larga e lazer.",
    features: ["20 Baías ventiladas", "Pista de treinamento", "Veterinária de apoio", "Redondel coberto"],
    incra: "970.080.140.220-4",
    car: "GO-5208707-AA99-B88D",
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log system information
  console.log("Starting ImobFluow Server with process.env.GEMINI_API_KEY presence:", !!process.env.GEMINI_API_KEY);

  // API 1: Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      project: "ImobFluow Applet Platform",
      timestamp: new Date().toISOString(),
      models: {
        active: "gemini-3.5-flash",
      },
      hasKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // API 2: Live Property Database
  app.get("/api/properties", (req, res) => {
    res.json(mockProperties);
  });

  // API 3: IA SDR Simulator (Active Lead Conversation, Profiler & Scoring)
  app.post("/api/gemini/sdr", async (req, res) => {
    const { message, history, currentProfile } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    // Default configuration for initial empty state
    const profile = currentProfile || {
      city: "",
      bairro: "",
      tipo: "",
      faixaInvestimento: "",
      formaPagamento: "",
      prazoCompra: "",
      perfilComprador: "",
    };

    // System instruction forcing Brazilian Real Estate SDR identity and JSON output
    const systemPrompt = `Você é o "SDR ImobFluow", a inteligência artificial especialista em primeiro atendimento e qualificação de leads imobiliários no Brasil.
Seu objetivo é conversar com o cliente, responder suas dúvidas com simpatia e extrair as seguintes informações DE FORMA NATURAL ao longo da conversa:
1. Cidade de preferência
2. Bairro de preferência
3. Tipo de imóvel (Urbano: casa, apto, lote | Rural: fazenda, sítio, haras)
4. Faixa de investimento (orçamento)
5. Forma de pagamento (à vista, financiamento bancário, permuta, carta de crédito, parcelamento rural, etc.)
6. Prazo para a compra ou mudança (urgência)
7. Perfil do comprador (casal com filhos, investidor, produtor agrícola, lazer, etc.)

REGRAS CRUCIANTES:
1. Nunca apresente formulários chatos ou robóticos. Responda à última mensagem do usuário com extrema inteligência e cordialidade na propriedade 'reply'.
2. Analise TODA a conversa e atualize os campos de perfil ('profile') se o usuário tiver mencionado alguma informação correspondente em suas mensagens. Preserve valores anteriores que já tenham sido preenchidos se o usuário não os atualizou.
3. Atribua um 'score' de temperatura de leads de 0 a 100 baseado na solidez das respostas (leads que informam orçamento, urgência e perfil real de compra ganham score alto. Curiosos, sem orçamento ou de respostas evasivas ganham score baixo).
4. Classifique o lead na propriedade 'category' como:
   - "Frio": score < 40 (pouca informação ou sem real interesse de compra rápida)
   - "Morno": score entre 40 e 75 (demonstra perfil mas ainda falta preencher pilares como valor ou urgência clara)
   - "Quente": score > 75 (urgência alta, orçamento compatível, perfil de pagamento definido e localização selecionada)

Você DEVE responder rigidamente em formato JSON com o seguinte esquema exato:
{
  "reply": "Sua resposta simpática e engajadora ao cliente (em português de Portugal/Brasil, preferencialmente português brasileiro moderno). Diga o que ele quer saber e estimule a próxima informação de forma elegante.",
  "score": 65,  // Inteiro de 0 a 100
  "category": "Morno", // "Frio" | "Morno" | "Quente"
  "profile": {
    "city": "Prefácio de cidade se identificado",
    "bairro": "Bairro de preferência se identificado",
    "tipo": "tipo do imóvel se identificado (ex: apartamento, fazenda, casa)",
    "faixaInvestimento": "Ex: R$ 500mil a R$ 800mil",
    "formaPagamento": "Ex: Financiamento bancário, À vista, etc.",
    "prazoCompra": "Ex: Curto prazo (até 3 meses), Médio prazo (até 1 ano), etc.",
    "perfilComprador": "Ex: Família com filhos, Produtor de Grãos, Investidor"
  }
}

Histórico anterior da conversa como contexto:
${JSON.stringify(history || [])}

Mensagem atual do usuário: "${message}"`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback robust mock response when API Key is missing so the platform works flawlessly
        const mockReply = `Olá! Que bacana sua mensagem. Eu sou o Assistente SDR da ImobFluow. Infelizmente, a chave da API do Gemini ainda não foi cadastrada nos Segredos da plataforma ou o servidor está em modo offline. Mas não se preocupe! Vou qualificar este lead de maneira simulada. Você disse: "${message}". Me conta um pouquinho mais sobre o que procura (bairro, orçamento ou urgência) para que eu possa cadastrar sua proposta!`;
        const words = message.toLowerCase();
        let addedScore = 15;
        let pCity = profile.city || "";
        let pBairro = profile.bairro || "";
        let pTipo = profile.tipo || "";
        let pInvest = profile.faixaInvestimento || "";
        
        if (words.includes("são paulo") || words.includes("sp") || words.includes("bragança") || words.includes("goiânia")) {
          pCity = words.includes("goiânia") ? "Goiânia" : words.includes("bragança") ? "Bragança Paulista" : "São Paulo";
          addedScore += 15;
        }
        if (words.includes("apartamento") || words.includes("apto") || words.includes("casa")) {
          pTipo = words.includes("apartamento") || words.includes("apto") ? "Apartamento" : "Casa";
          addedScore += 15;
        }
        if (words.includes("fazenda") || words.includes("hectares") || words.includes("rural") || words.includes("sítio")) {
          pTipo = words.includes("fazenda") ? "Fazenda" : "Sítio";
          addedScore += 25;
        }
        if (words.includes("orçamento") || words.includes("milhões") || words.includes("mil") || words.includes("r$") || words.includes("investir")) {
          pInvest = "R$ 1.500.000 a R$ 3.000.000";
          addedScore += 20;
        }

        const newScore = Math.min(95, (profile.score || 25) + addedScore);
        const newCat = newScore > 75 ? "Quente" : newScore > 40 ? "Morno" : "Frio";

        return res.json({
          reply: mockReply,
          score: newScore,
          category: newCat,
          profile: {
            city: pCity || "São Paulo",
            bairro: pBairro || "Centro",
            tipo: pTipo || "Apartamento Urbano",
            faixaInvestimento: pInvest || "R$ 800.000",
            formaPagamento: profile.formaPagamento || "Financiamento Bancário",
            prazoCompra: profile.prazoCompra || "Até 3 meses",
            perfilComprador: profile.perfilComprador || "Família residência principal",
          },
        });
      }

      // Live Gemini call with Portuguese response expectations
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const text = response.text || "{}";
      const parsedData = JSON.parse(text.trim());
      res.json(parsedData);
    } catch (err: any) {
      console.error("Gemini SDR Error:", err);
      res.status(500).json({
        error: "Falha na resposta do assistente inteligente.",
        details: err.message,
      });
    }
  });

  // API 4: Assistente Comercial (Generates tailored real-estate advice points or listings match)
  app.post("/api/gemini/assist/comercial", async (req, res) => {
    const { leadProfile, activeFilters } = req.body;

    const systemPrompt = `Você é o "Assistente Comercial ImobFluow", um corretor de elite e cientista de dados imobiliários brasileiros.
Com base no perfil do lead qualificado:
${JSON.stringify(leadProfile)}

E os filtros de busca ativos do corretor:
${JSON.stringify(activeFilters)}

Liste os top 2 melhores imóveis recomendados do portfólio para este perfil (Portfólio disponível: ${JSON.stringify(mockProperties)}).
Caso não haja correspondência perfeita, descreva por que essas alternativas são excelentes (p ex. custo-benefício, infraestrutura ou facilidades de pagamento).
Para cada um dos 2 imóveis gerados, faça um breve pitch persuasivo de venda para o corretor usar na ligação.

Sua resposta DEVE estar em formato JSON formatado exatamente como:
{
  "analisePerfil": "Breve análise do perfil do cliente e do mercado atual para este segmento.",
  "recomendacoes": [
    {
      "id": "ID do imóvel correspondente ou similar",
      "titulo": "Título do Imóvel",
      "preco": "Valor formatado em R$",
      "pitchVenda": "O argumento irresistível para o corretor usar que conecta este imóvel diretamente aos desejos do lead."
    }
  ],
  "proximaAcao": "Sugestão da próxima melhor ação para o corretor (ex: agendar visita no sabádo, simular financiamento, enviar material)."
}`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback mock
        return res.json({
          analisePerfil: "Cliente demonstra necessidade de investimento seguro com liquidez média, preferindo áreas consolidadas.",
          recomendacoes: [
            {
              id: "urb-1",
              titulo: "Apartamento Premium Jardins",
              preco: "R$ 1.850.000",
              pitchVenda: "Diga ao cliente que a liquidez nos Jardins é histórica e o preço por m² deste apartamento está 8% abaixo da média de mercado para imóveis prontos na região. Excelente para a família que busca as melhores escolas particulares de São Paulo a menos de 10 min de distância.",
            },
            {
              id: "rur-2",
              titulo: "Sítio Vista Verde",
              preco: "R$ 2.400.000",
              pitchVenda: "Se o perfil pender a uma vida silenciosa de final de semana, comande a conversa destacando os recursos hídricos formidáveis e o fácil acesso pela Rodovia Fernão Dias, poupando trânsito pesado.",
            },
          ],
          proximaAcao: "Enviar simulação de fluxo de parcelas via WhatsApp com 30% de entrada.",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Comercial Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API 5: Assistente Jurídico (Generates a beautifully filled formal lease or sales contract in markdown)
  app.post("/api/gemini/assist/juridico", async (req, res) => {
    const { tipoContrato, nomes, valor, local, detalhesAdicionais } = req.body;

    const todayStr = new Date().toLocaleDateString("pt-BR");

    const systemPrompt = `Você é o "Dr. Fluow - Assistente Jurídico ImobFluow", inteligência artificial treinada em direito imobiliário brasileiro (Lei do Inquilinato nº 8.245/91, Código Civil, etc.).
Gere uma MINUTA COMPLETA de contrato profissional para o seguinte pedido comercial:
- Tipo de Contrato: ${tipoContrato || "Locação Residencial Urbana"}
- Partes Envolvidas: ${nomes || "João da Silva (Locador/Vendedor) e Maria Souza (Locatário/Comprador)"}
- Valor do Negócio: ${valor || "R$ 5.000,00 mensais ou R$ 450.000,00 total"}
- Imóvel/Local: ${local || "Rua dos Pinheiros, 120, Apto 41 - Pinheiros, São Paulo - SP"}
- Cláusulas ou detalhes adicionais solicitados: ${detalhesAdicionais || "Nenhum detalhe adicional informado."}
- Data de celebração do instrumento: ${todayStr}

Estruture a minuta em Markdown de forma impecavelmente legal, contendo:
1. Preâmbulo com a qualificação das partes de maneira formal (mesmo que simplificada)
2. Objeto do contrato descrito minuciosamente
3. Valor, formas de repasse, multas moratórias (ex: 10% por atraso e juros de 1% ao mês)
4. Vigência, termos de rescisão antecipada e multa de reajuste (ex: IGP-M ou IPCA)
5. Garantias (Locatícias como Seguro Fiança, Fiança ou Caução de 3 meses, se aplicável)
6. Foro competente e assinaturas digitais.

Escreva o contrato Inteiro e Profissional de forma que pareça redigido por um escritório de advocacia premium.
Retorne o JSON no seguinte formato:
{
  "nomeDocumento": "Minuta de Contrato de ${tipoContrato}",
  "tipoLegislacao": "Seguindo a Lei Federal correspondente brasileira",
  "dataGeracao": "${todayStr}",
  "minutaMarkdown": "MUITO CONTEÚDO EM MARKDOWN DO CONTRATO COMPLETO...",
  "observacoesAdvogado": "Notas rápidas da nossa inteligência artificial sobre cuidados extras com este documento (ex: necessidade de testemunhas, registro em cartório, regularidade fiscal)."
}`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback markdown minuta when Gemini API Key is absent
        const sampleMarkdown = `# CONTRATO PARTICULAR DE COMPROMISSO DE VENDA E COMPRA DE IMÓVEL URBANO

**VENDEDOR:** ${nomes ? nomes.split(" e ")[0] : "QUALIFICAÇÃO DO PROPRIETÁRIO COMERCIAL"}  
**COMPRADOR:** ${nomes ? nomes.split(" e ")[1] || "QUALIFICAÇÃO DO COMPRADOR" : "QUALIFICAÇÃO DO ADQUIRENTE INTERESSADO"}  

### CLÁUSULA PRIMEIRA - DO OBJETO E LOCALIZAÇÃO
O VENDEDOR, legítimo proprietário possuidor do imóvel situado à ${local || "Rua do Portfólio ImobFluow, São Paulo"}, compromete-se por este instrumento a vendê-lo ao COMPRADOR devidamente livre de ônus ou gravames judiciais ou extrajudiciais.

### CLÁUSULA SEGUNDA - DO PREÇO E DA FORMA DE PAGAMENTO
O preço total ajustado para a presente transação é de **${valor || "R$ 450.000,00 (quatrocentos e cinquenta mil reais)"}**, sendo pago de acordo com os termos firmados de comum acordo pelas partes e devidamente intermediado pela plataforma **ImobFluow**.

### CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES E DA POSSE
As chaves e a respectiva posse precária serão entregues imediatamente após a comprovação de quitação ou liberação do crédito imobiliário bancário, respondendo o comprador por todos os tributos incidentes a partir da respectiva data.

### CLÁUSULA QUARTA - DO FORO COMARCA
Para dirimir qualquer questão oriunda deste compromisso de compra e venda, elegem as partes o foro da comarca do referido imóvel com renúncia expressa a qualquer outro por mais privilegiado que seja.

São Paulo, ${todayStr}.

__________________________________
**VENDEDOR**

__________________________________
**COMPRADOR**

__________________________________
**TESTEMUNHA 1**  |  **TESTEMUNHA 2**
`;

        return res.json({
          nomeDocumento: `Contrato Particular de ${tipoContrato || "Compra e Venda"}`,
          tipoLegislacao: "Legislação Civil Brasileira (Lei 10.406/02)",
          dataGeracao: todayStr,
          minutaMarkdown: sampleMarkdown,
          observacoesAdvogado: "Atenção: Por se tratar de um rascunho de simulação offline (sua chave Gemini não está ativa ou está em cache), revise as qualificações e insira o CPF/CNPJ de ambas as partes antes de assinar eletronicamente na plataforma.",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Jurídico Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API 6: Assistente Financeiro (Simulates analysis of rent repasses, fees, or due notices)
  app.post("/api/gemini/assist/financeiro", async (req, res) => {
    const { totalReceitas, totalDespesas, comissaoGeral, inadimplenciaTaxa } = req.body;

    const systemPrompt = `Você é o "Gerente de Finanças IA ImobFluow", CFO artificial automatizado de gestoras imobiliárias brasileiras.
Com base nos números operacionais mensais inseridos pelo usuário:
- Receitas Totais (Locações + Taxas de Adm): R$ ${totalReceitas || "120.000,00"}
- Despesas Operacionais (Escritório + Marketing): R$ ${totalDespesas || "35.000,00"}
- Taxa média de Comissão Comercial sobre Vendas: ${comissaoGeral || "6%"}
- Taxa de Inadimplência de Aluguéis Corrente: ${inadimplenciaTaxa || "4.8%"}

Gere uma avaliação de desempenho financeiro e forneça 3 conselhos práticos e pragmáticos de gestão de capital aplicados à realidade brasileira (ex: renegociação de aluguéis, redução de custos de aquisição de leads - CAC, atenuadores de inadimplência usando cobrança por WhatsApp ou seguro fiança).

Retorne sua resposta estritamente estruturada em JSON no formato:
{
  "resumoDesempenho": "Parágrafo resumindo a saúde financeira e lucratividade estimada.",
  "margemContribuicao": "Cálculo de margem estimada ou insights sobre ROI de vendas.",
  "taxaInadimplenciaAnalise": "Análise da inadimplência brasileira atual e como isso afeta as contas imobiliárias.",
  "conselhosProativos": [
    {
      "titulo": "Título do conselho proativo",
      "descricao": "Explicação pragmática e como aplicar no dia a dia com a ImobFluow."
    }
  ]
}`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          resumoDesempenho: "Sua plataforma está funcionando com excelente taxa de eficiência. O fluxo de receitas recorrentes cobre confortavelmente as despesas corporativas básicas.",
          margemContribuicao: "Estimada em 70.8%, valor considerado excelente para o nicho de intermediação.",
          taxaInadimplenciaAnalise: `Sua inadimplência está em ${inadimplenciaTaxa || "4.8%"}, dentro da média nacional brasileira de 5.2%. No entanto, recomendamos atenção contínua.`,
          conselhosProativos: [
            {
              titulo: "Ativação de Cobrança IA Inteligente via WhatsApp",
              descricao: "Configure lembretes automáticos amigáveis 3 dias antes do vencimento do boleto no ImobFluow para reduzir atrasos recorrentes de clientes 'esquecidos'.",
            },
            {
              titulo: "Promoção de Seguro Fiança como Padrão",
              descricao: "Elimine a figura do fiador tradicional dificultoso e substitua por Seguro Fiança parcelado diretamente no boleto, aumentando a velocidade das novas locações.",
            },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Financeiro Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API 7: Analisador de Tendências de Mercado IA (Appreciation, liquidity, investing)
  app.post("/api/gemini/market-trends", async (req, res) => {
    const { region, propertyType } = req.body;

    const targetRegion = region || "São Paulo";
    const targetType = propertyType || "urbano";

    const systemPrompt = `Você é o "Analisador de Mercado Imobiliário ImobFluow", um cientista de dados e especialista macroeconômico brasileiro com acesso a dados históricos de transações imobiliárias, registros de cartórios de imóveis e indicadores do IBGE, Selic e IPCA.
    
    Analise a região de "${targetRegion}" focando em imóveis do segmento de interesse "${targetType}" (urbano ou rural).
    Gere uma análise completa contendo:
    1. Histórico e projeção de Valorização Anual (taxas em % para cada ano de 2021 a 2027)
    2. Liquidez de Mercado (tempo de escoamento/venda médio com nota de Liquidez de 0 a 100)
    3. Potencial de Investimento Geral (classificação: Ouro, Prata ou Bronze, com justificativa em texto)
    4. Análise de Indicadores Econômicos que afetam a praça (Selic atual em 10.5%, IPCA, custo de construção INCC, crédito imobiliário SBPE)
    5. Estudo de Registros Públicos & Cartórios (dinâmica recente de escrituras lavradas de compra e venda na região)
    6. Um resumo executivo altamente descritivo e amigável (2-3 parágrafos) para apresentação direta no dashboard de BI.

    Sua resposta DEVE ser estritamente formatada em JSON com a seguinte estrutura exata:
    {
      "region": "${targetRegion}",
      "propertyType": "${targetType}",
      "appreciationData": [
        {"year": "2021", "rate": 6.5},
        {"year": "2022", "rate": 10.2},
        {"year": "2023", "rate": 7.8},
        {"year": "2024", "rate": 9.1},
        {"year": "2025", "rate": 8.4},
        {"year": "2026", "rate": 11.2},
        {"year": "2027", "rate": 12.5}
      ],
      "liquidityScore": 85,
      "liquidityDetails": "Explicação detalhada da velocidade de vendas no local...",
      "investmentPotential": "Ouro", // "Ouro" | "Prata" | "Bronze"
      "investmentDetails": "Justificativa de mercado detalhada sobre o potencial de rentabilidade...",
      "economicImpact": "Como juros e juros futuros influenciam esta zona de negociação...",
      "publicRecords": "Principais conclusões das matrículas e registros públicos locais...",
      "digestibleSummary": "Parágrafos bem escritos de análise resumida para o corretor ou investidor."
    }`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Dynamic mock generator based on Brazas locations to guarantee perfect user experience offline
        let appData = [
          { year: "2021", rate: 7.2 },
          { year: "2022", rate: 11.8 },
          { year: "2023", rate: 8.9 },
          { year: "2024", rate: 9.5 },
          { year: "2025", rate: 10.2 },
          { year: "2026", rate: 11.4 },
          { year: "2027", rate: 12.8 }
        ];
        let score = 80;
        let pType = targetType === "urbano" ? "Urbano (Apartamentos/Casas)" : "Rural (Fazendas/Sítios)";
        let potential: "Ouro" | "Prata" | "Bronze" = "Ouro";
        let liqText = "";
        let invText = "";
        let econText = "A taxa Selic atualmente estabilizada em patamares de dois dígitos mantém os fundos de investimento imobiliários mais cautelosos, porém o financiamento via recursos de Poupança (SBPE) continua aquecido para a classe média-alta. O custo do material de construção (INCC) desacelerou, abrindo espaço para melhores margens de incorporação.";
        let registryText = "Processamento do 1º e 2º Oficial de Registro de Imóveis demonstra estabilização de transferências de compra e venda ordinárias, com aumento substancial de emissão de cédulas de crédito rural imobiliárias para custeio.";
        let summary = "";

        if (targetRegion.toLowerCase().includes("são paulo") || targetRegion.toLowerCase().includes("sp")) {
          score = 92;
          potential = "Ouro";
          liqText = "Altíssima fluidez de vendas com tempo de conversão médio de 45 a 90 dias nas áreas nobres (Jardins, Moema e Itaim). A escassez de terrenos para lançamentos de luxo mantém a revenda extremamente disputada.";
          invText = "Excelente blindagem patrimonial. O retorno de aluguel (yield) médio cresceu para 0.58% ao mês, superando a poupança histórica. Demanda crônica para locações de curta e média temporada impulsiona o potencial Ouro.";
          summary = `O mercado imobiliário em São Paulo (Zona Sul e Oeste) continua sendo o porto seguro de investidores de grande porte no Brasil. Para a categoria de imóveis ${pType}, observamos uma sólida aceleração de valorização sustentada principalmente pelo alto poder aquisitivo local e escassez estrutural de novos lançamentos em bairros consolidados. Nossa projeção para 2026/2027 estima ganhos consistentes acima da inflação do IPCA.`;
        } else if (targetRegion.toLowerCase().includes("barueri") || targetRegion.toLowerCase().includes("alphaville")) {
          score = 88;
          potential = "Ouro";
          appData = [
            { year: "2021", rate: 9.5 },
            { year: "2022", rate: 14.2 },
            { year: "2023", rate: 10.5 },
            { year: "2024", rate: 11.1 },
            { year: "2025", rate: 12.0 },
            { year: "2026", rate: 12.5 },
            { year: "2027", rate: 13.9 }
          ];
          liqText = "Liquidez robusta guiada pela busca por condomínios fechados horizontais pós-pandemia. Tempo médio de fechamento de 60 a 110 dias para imóveis de alto padrão reformados.";
          invText = "Ganho de capital proeminente. O polo empresarial de Barueri e a isenção parcial de impostos corporativos atraem altos tomadores de decisão em busca de refúgios familiares de altíssimo luxo ao lado de São Paulo.";
          summary = `Barueri/Alphaville representa um dos maiores fenômenos de valorização do estado. O segmento ${pType} é altamente impulsionado por famílias buscando segurança armada, amplos quintais ecológicos e excelente infraestrutura escolar internacional. Os dados agregados sugerem alto potencial para locações corporativas de executivos multinacionais com rendimento estável.`;
        } else if (targetRegion.toLowerCase().includes("goiânia") || targetRegion.toLowerCase().includes("go")) {
          score = 86;
          potential = "Ouro";
          appData = [
            { year: "2021", rate: 8.5 },
            { year: "2022", rate: 13.1 },
            { year: "2023", rate: 11.0 },
            { year: "2024", rate: 12.4 },
            { year: "2025", rate: 12.8 },
            { year: "2026", rate: 13.5 },
            { year: "2027", rate: 14.1 }
          ];
          liqText = "Sólida absorção impulsionada pelos milionários do bioma agropecuário brasileiro. Para fazendas e haras de ponta, o escoamento é fechado de forma privada em canais restritos em até 120 dias.";
          invText = "Investimento atrativo. Goiânia consolidou-se como o polo da riqueza do agronegócio nacional. A liquidez de terras no cinturão rural do município e cidades próximas goza de altíssima fidelidade e segurança de lastro.";
          summary = `Goiânia desponta com as maiores taxas de valorização média no Centro-Oeste brasileiro. O apetite por propriedades agro-residenciais premium, haras particulares e fazendas de manejo integrado criou uma forte espiral de rentabilidade de capital. Os registros públicos indicam forte fluxo comprador à vista com lastro em commodities agrícolas (soja e gado premium).`;
        } else if (targetRegion.toLowerCase().includes("sorocaba")) {
          score = 78;
          potential = "Prata";
          liqText = "Mercado ágil de transição industrial e logística. Tempo de escoamento de 90 a 150 dias para glebas rurais mecanizadas e fazendas de rotação agrícola sazonal.";
          invText = "Excelente porta de entrada para investidores institucionais de grãos com orçamento intermediário. O rendimento produtivo por hectare de Sorocaba e arredores é muito estável devido à ótima distribuição hídrica local.";
          summary = `A região de Sorocaba destaca-se pela excepcional infraestrutura de malha viária e proximidade logística com o porto de Santos e capital. Imóveis ${pType} mantêm uma excelente liquidez e as transações de compra de terras registram estabilidade superior ao longo da última década, ancoradas em cooperativas agrícolas e canais consolidados de safras.`;
        } else {
          // Fallback Default (e.g. Bragança / General)
          score = 75;
          potential = "Prata";
          liqText = "Liquidez mista associada ao turismo ecológico, lazer de final de semana, ou plantios orgânicos familiares. Ciclo médio de vendas dura de 100 a 180 dias dependendo do acesso asfalto.";
          invText = "Ótima relação custo-benefício de terra nua comparada com polos saturados. Forte expansão urbana residencial de baixa densidade gera expectativa de futuras valorizações via loteamentos ecológicos.";
          summary = `Região serrana e de interior de médio porte focado em chácaras residenciais e unidades produtivas hidropônicas orgânicas. Indicadores de registros públicos de Bragança Paulista demonstram forte migração residencial em busca de qualidade de vida, o que impulsionará o valor do m² e dos hectares utilizáveis nos próximos períodos econômicos.`;
        }

        return res.json({
          region: targetRegion,
          propertyType: targetType,
          appreciationData: appData,
          liquidityScore: score,
          liquidityDetails: liqText,
          investmentPotential: potential,
          investmentDetails: invText,
          economicImpact: econText,
          publicRecords: registryText,
          digestibleSummary: summary
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Market-Trends Error:", err);
      res.status(500).json({
        error: "Falha na análise inteligente de tendências de mercado.",
        details: err.message
      });
    }
  });

  // API 8: Copywriter Gerador de Campanhas de Automação de Marketing IA
  app.post("/api/gemini/campaign-template", async (req, res) => {
    const { triggerType, channel, customInstruction, leadContext } = req.body;

    const systemPrompt = `Você é o "Copywriter Sênior de Marketing Imobiliário ImobFluow", especialista brasileiro em Growth Hacking, réguas de automação, e engajamento automatizado por email e SMS para nichos de alto padrão e rural.
    
    Crie o conteúdo de uma campanha automatizada altamente persuasiva e profissional com as seguintes configurações:
    - Canal de Disparo: ${channel || "email"} (Emails admitem assuntos e estrutura visual; SMS deve ter foco absoluto em 160 caracteres)
    - Gatilho Operacional (Trigger): ${triggerType || "lead_behavior"} (ex: lead_behavior, qualification_status, ou specific_property)
    - Orientações/Instruções Adicionais: ${customInstruction || "Ser cordial, profissional e chamar para visita de simulação."}
    - Contexto Extra da Base de Clientes: ${JSON.stringify(leadContext || {})}

    Use tags de substituição padrões da nossa plataforma como: [Nome do Lead], [Nome do Imóvel], [Cidade], [Preço], [Nome do Consultor], [Link do Portfólio] para deixar o layout flexível.

    Ao gerar o texto:
    - Para SMS: O texto deve ser conciso, direto, impactante e focar em gerar uma resposta ("Responda SIM para simular"). Não use Assunto (subject) para SMS.
    - Para email: Escreva um assunto irresistível de alta taxa de clique e um corpo de email estruturado, mantendo a cordialidade brasileira corporativa contemporânea (sem clichês de vendas agressivas). 
    - Atribua uma taxa estimada de conversão de cliques fundamentada para este tipo de copy.
    - Forneça uma observação rápida sobre conformidade LGPD e melhores horários de disparo para o corretor.

    Retorne sua resposta estritamente estruturada em JSON no formato exato descrita abaixo:
    {
      "subject": "Título do e-mail (ou vazio se canal for SMS)",
      "body": "Corpo completo estruturado com as tags de substituição...",
      "estimatedConversionRate": 8.5, // Inteiro ou decimal representando % histórico
      "complianceNote": "Garantia legal de opt-out em português..."
    }`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback copy generator for offline sandbox testing
        if (channel === "sms") {
          return res.json({
            subject: "",
            body: `[Nome do Lead], vimos seu interesse no imóvel [Nome do Imóvel], localizado em [Cidade]. O que acha de receber fotos do condomínio pelo WhatsApp? Responda SIM p/ agendar.`,
            estimatedConversionRate: 14.2,
            complianceNote: "Envio em conformidade com as diretrizes da Anatel. Para deixar de receber alertas de prospecção da ImobFluow, envie STOP para 27180."
          });
        } else {
          return res.json({
            subject: "💡 Oportunidade Selecionada em [Cidade]: [Nome do Imóvel]",
            body: `Olá, [Nome do Lead]! Espero que este e-mail o encontre muito bem.\n\nSou o [Nome do Consultor], consultor de investimentos da ImobFluow.\n\nEntendemos que você busca por propriedades de alto nível na região que reúnam excelente padrão de construção e liquidez. O imóvel [Nome do Imóvel], cotado a [Preço], acaba de entrar em nosso pipeline exclusivo offline e bate 100% com as preferências mapeadas em sua ficha comercial.\n\nGostaria de agendar uma breve chamada de vídeo ou visita privada de 20 minutos neste sábado?\n\nVeja as especificações completas e fotos HD em nosso portal seguro: [Link do Portfólio]\n\nAtenciosamente,\n[Nome do Consultor] - Equipe ImobFluow`,
            estimatedConversionRate: 18.5,
            complianceNote: "Você está recebendo este e-mail porque se cadastrou nos portais integrados ImobFluow. Para não receber mais nossas análises de oportunidades imobiliárias, clique no link de descadastro."
          });
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Campaign-Template Error:", err);
      res.status(500).json({
        error: "Falha na geração inteligente de templates de copywriting.",
        details: err.message
      });
    }
  });

  // Vite middleware setup or production static files serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
