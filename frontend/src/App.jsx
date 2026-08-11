import { useState } from "react";
import "./App.css";

function App() {
  // Estado para controlar se exibe a tela de boas-vindas ou o formulário
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Estado global mapeando exatamente a estrutura do JSON
  const [formData, setFormData] = useState({
    githubToken: "",
    owner: "",
    repo: "",
    apply: true,
    createProject: true,
    projectTitle: "RoadmapBuilder",
    projectNumber: 0,
    projectStartDate: "2026-08-05",

    // 1. Milestones e Durações padrão baseadas no seu JSON
    milestones: [
      {
        key: "M1",
        title: "M1 - Exploração",
        description: "Portfólio priorizado e problema selecionado.",
        value: 15,
        unit: "days",
      },
      {
        key: "M2",
        title: "M2 - Viabilidade e Concepção",
        description: "Viabilidade comprovada e caso de uso especificado.",
        value: 1,
        unit: "months",
      },
      {
        key: "M3",
        title: "M3 - MVP",
        description: "MVP funcional em homologação.",
        value: 3,
        unit: "months",
      },
      {
        key: "M4",
        title: "M4 - Piloto Controlado",
        description: "Validação de campo e recomendação para escala.",
        value: 1,
        unit: "months",
      },
      {
        key: "M5",
        title: "M5 - Escala e Operação",
        description: "Solução operacionalizada com transferência tecnológica.",
        value: 15,
        unit: "days",
      },
    ],

    // 2. Labels padrão baseadas no seu JSON
    labels: [
      { name: "fase:i", color: "#1D76DB", description: "Fase I - Exploração" },
      {
        name: "fase:ii",
        color: "#5319E7",
        description: "Fase II - Viabilidade e Concepção",
      },
      { name: "tipo:atividade", color: "#C2E0C6", description: "Atividade" },
      {
        name: "governança",
        color: "#6F42C1",
        description: "Comitê / decisão formal",
      },
    ],

    // 3. Issues dinâmicas
    issues: [
      {
        title:
          "[Atividade] Levantar problemas e oportunidades com órgão demandante",
        milestone: "M1",
        labels: ["fase:i", "tipo:atividade", "governança"],
        description:
          "Realizar oficinas e entrevistas com o órgão demandante para identificar dores, oportunidades e objetivos de negócio que possam ser endereçados com IA, registrando contexto, impacto esperado e restrições institucionais.",
        entregaveis: [
          "Ata das oficinas/entrevistas com participantes e contexto.",
          "Lista estruturada de problemas e oportunidades com evidências.",
        ],
        criterios_aceite: [
          "Órgão demandante valida que o levantamento representa as principais dores.",
          "Cada problema possui descrição, unidade impactada e evidência de origem.",
        ],
      },
      {
        title: "[Atividade] Avaliar impacto público e complexidade preliminar",
        milestone: "M1",
        labels: ["fase:i", "tipo:atividade", "governança"],
        description:
          "Aplicar critérios iniciais de priorização para estimar impacto público potencial, urgência, complexidade técnica e esforço de implementação de cada problema identificado.",
        entregaveis: [
          "Matriz de impacto público x complexidade para os problemas mapeados.",
          "Pontuação preliminar por critérios acordados.",
        ],
        criterios_aceite: [
          "Todos os problemas possuem pontuação documentada.",
          "Critérios e pesos utilizados estão explícitos e revisáveis.",
        ],
      },
      {
        title: "[Atividade] Priorizar portfólio com critérios acordados",
        milestone: "M1",
        labels: ["fase:i", "tipo:atividade", "governança"],
        description:
          "Consolidar e ranquear o portfólio de problemas com base em critérios acordados entre as partes (impacto, viabilidade, risco e custo), produzindo justificativa de priorização.",
        entregaveis: [
          "Ranking priorizado do portfólio com justificativas.",
          "Registro da decisão de priorização com stakeholders.",
        ],
        criterios_aceite: [
          "Top prioridades possuem racional de escolha claro.",
          "Há concordância formal dos responsáveis do órgão e time técnico.",
        ],
      },
      {
        title:
          "[Entregável] Documento de Portfólio de Problemas e Oportunidades de IA",
        milestone: "M1",
        labels: ["fase:i", "tipo:entregavel", "governança"],
        description:
          "Produzir documento formal com a lista estruturada de problemas e oportunidades de IA, critérios usados na análise, ranking final e recomendação de foco para o próximo ciclo.",
        entregaveis: [
          "Documento consolidado do portfólio versionado.",
          "Anexo com metodologia, critérios e ranking final.",
        ],
        criterios_aceite: [
          "Documento cobre problemas, oportunidades e recomendação de foco.",
          "Documento aprovado e publicado no repositório/projeto.",
        ],
      },
      {
        title:
          "[Atividade] Detalhar problema prioritário (objetivos, stakeholders, dados, riscos)",
        milestone: "M1",
        labels: ["fase:i", "tipo:atividade", "dados", "governança"],
        description:
          "Detalhar o problema priorizado com definição de objetivos, stakeholders envolvidos, fontes de dados, hipóteses, riscos e premissas para orientar a fase de viabilidade.",
        entregaveis: [
          "Ficha do problema prioritário (objetivos, stakeholders, dados e riscos).",
          "Mapa de premissas e restrições institucionais.",
        ],
        criterios_aceite: [
          "Escopo e objetivo do problema estão mensuráveis.",
          "Fontes de dados e riscos iniciais foram identificados e validados.",
        ],
      },
      {
        title: "[Entregável] Documento de Detalhamento do Problema Priorizado",
        milestone: "M1",
        labels: ["fase:i", "tipo:entregavel", "dados", "governança"],
        description:
          "Consolidar em documento o escopo do problema prioritário, requisitos iniciais, riscos mapeados e critérios que sustentam a decisão de avançar para a Fase II.",
        entregaveis: [
          "Documento de detalhamento do problema priorizado.",
          "Seção de requisitos iniciais, riscos e próximos passos.",
        ],
        criterios_aceite: [
          "Documento permite iniciar a fase de viabilidade sem lacunas críticas.",
          "Aprovação formal dos responsáveis registrada.",
        ],
      },
      {
        title: "[Gate] Validar critérios de saída da Fase I (M1)",
        milestone: "M1",
        labels: ["fase:i", "tipo:gate", "governança"],
        description:
          "Conduzir reunião de gate para confirmar portfólio validado, priorização concluída, decisão explícita de continuidade e detalhamento suficiente do problema para início da Fase II.",
        entregaveis: [
          "Checklist de saída da Fase I preenchido.",
          "Ata de gate com decisão de continuidade/não continuidade.",
        ],
        criterios_aceite: [
          "Todos os critérios de saída de M1 estão avaliados.",
          "Decisão formal do comitê registrada com responsáveis.",
        ],
      },
      {
        title:
          "[Atividade] Executar EDA e mapear qualidade/disponibilidade de dados",
        milestone: "M2",
        labels: ["fase:ii", "tipo:atividade", "dados", "ml"],
        description:
          "Executar análise exploratória dos dados para avaliar cobertura, consistência, qualidade, vieses, lacunas, disponibilidade e esforço de preparo necessário ao caso de uso.",
        entregaveis: [
          "Notebook/relatório EDA com estatísticas e diagnósticos de qualidade.",
          "Inventário de fontes com disponibilidade e lacunas.",
        ],
        criterios_aceite: [
          "Cobertura, qualidade e principais vieses dos dados foram medidos.",
          "Há conclusão sobre aptidão dos dados para o caso de uso.",
        ],
      },
      {
        title:
          "[Atividade] Avaliar viabilidade técnica, científica e operacional",
        milestone: "M2",
        labels: ["fase:ii", "tipo:atividade", "dados", "ml", "governança"],
        description:
          "Avaliar se há viabilidade técnica, científica e operacional para o caso de uso, considerando maturidade dos dados, alternativas de modelagem, infraestrutura e capacidade de adoção.",
        entregaveis: [
          "Matriz de viabilidade técnica/científica/operacional.",
          "Parecer com recomendação de continuidade.",
        ],
        criterios_aceite: [
          "Avaliação considera dados, arquitetura, operação e adoção.",
          "Riscos críticos possuem estratégia de mitigação definida.",
        ],
      },
      {
        title:
          "[Atividade] Definir métricas técnicas e limiares mínimos de aceitação",
        milestone: "M2",
        labels: ["fase:ii", "tipo:atividade", "ml", "governança"],
        description:
          "Definir métricas de desempenho e qualidade do modelo, além de limiares mínimos de aceitação para orientar decisão de avanço, testes e validação do MVP.",
        entregaveis: [
          "Catálogo de métricas técnicas e de impacto do caso de uso.",
          "Tabela de limiares mínimos para avanço do MVP.",
        ],
        criterios_aceite: [
          "Cada métrica possui definição de cálculo e fonte de dados.",
          "Limiar mínimo aprovado para decisão de gate.",
        ],
      },
      {
        title: "[Atividade] Consolidar riscos e plano de mitigação",
        milestone: "M2",
        labels: ["fase:ii", "tipo:atividade", "governança"],
        description:
          "Mapear riscos de dados, modelagem, operação, ética e conformidade, classificando impacto/probabilidade e estabelecendo plano de mitigação com responsáveis.",
        entregaveis: [
          "Registro de riscos priorizados (probabilidade x impacto).",
          "Plano de mitigação com donos e prazos.",
        ],
        criterios_aceite: [
          "Riscos críticos têm ação de mitigação e responsável definido.",
          "Plano foi revisado com governança do projeto.",
        ],
      },
      {
        title:
          "[Atividade] Especificar caso de uso de IA e requisitos (funcionais e não funcionais)",
        milestone: "M2",
        labels: ["fase:ii", "tipo:atividade", "software", "governança"],
        description:
          "Especificar o caso de uso de IA com escopo funcional, requisitos não funcionais, integrações, restrições legais e critérios de sucesso técnico e de impacto público.",
        entregaveis: [
          "Especificação funcional e não funcional do caso de uso.",
          "Diagrama de integração e restrições legais/operacionais.",
        ],
        criterios_aceite: [
          "Requisitos estão claros, testáveis e priorizados.",
          "Stakeholders técnicos e de negócio validaram a especificação.",
        ],
      },
      {
        title:
          "[Entregável] Documento de Viabilidade (técnica/científica/operacional)",
        milestone: "M2",
        labels: ["fase:ii", "tipo:entregavel", "governança"],
        description:
          "Entregar documento consolidando evidências de viabilidade técnica, científica e operacional, com conclusão objetiva sobre continuidade para desenvolvimento do MVP.",
        entregaveis: [
          "Documento de viabilidade consolidado e versionado.",
          "Recomendação formal de avançar (ou não) para MVP.",
        ],
        criterios_aceite: [
          "Documento apresenta evidências e conclusão objetiva.",
          "Aprovação da liderança/comitê registrada.",
        ],
      },
      {
        title: "[Entregável] Relatório EDA",
        milestone: "M2",
        labels: ["fase:ii", "tipo:entregavel", "dados", "ml"],
        description:
          "Entregar relatório de EDA com diagnóstico de qualidade e disponibilidade dos dados, análises descritivas, principais achados e implicações para modelagem.",
        entregaveis: [
          "Relatório EDA com perfil, qualidade e lacunas de dados.",
          "Anexos com consultas/notebooks reprodutíveis.",
        ],
        criterios_aceite: [
          "Resultados EDA permitem decisão de modelagem.",
          "Relatório possui rastreabilidade das fontes analisadas.",
        ],
      },
      {
        title: "[Entregável] Plano preliminar do MVP",
        milestone: "M2",
        labels: ["fase:ii", "tipo:entregavel", "ml", "software", "governança"],
        description:
          "Produzir plano preliminar do MVP com escopo, arquitetura inicial, cronograma macro, recursos necessários, riscos e estratégia de validação.",
        entregaveis: [
          "Plano de trabalho do MVP com arquitetura e cronograma.",
          "Mapa de recursos, riscos e estratégia de validação.",
        ],
        criterios_aceite: [
          "Plano é executável no prazo do marco M3.",
          "Dependências e riscos críticos estão explicitados.",
        ],
      },
      {
        title: "[Entregável] Documento de Especificação do Caso de Uso de IA",
        milestone: "M2",
        labels: ["fase:ii", "tipo:entregavel", "software", "governança"],
        description:
          "Formalizar especificação do caso de uso contendo objetivos, requisitos, fluxos, métricas, limites operacionais e critérios de aceite para implementação.",
        entregaveis: [
          "Documento final de especificação do caso de uso.",
          "Critérios de sucesso técnico e de negócio definidos.",
        ],
        criterios_aceite: [
          "Escopo e critérios de aceite estão fechados para desenvolvimento.",
          "Documento aprovado pelo órgão demandante e equipe técnica.",
        ],
      },
      {
        title: "[Gate] Aprovar avanço para MVP (M2)",
        milestone: "M2",
        labels: ["fase:ii", "tipo:gate", "governança"],
        description:
          "Realizar gate de decisão para aprovar o início do MVP com base em evidências de viabilidade, riscos tratados, métricas definidas e caso de uso refinado.",
        entregaveis: [
          "Checklist de saída da Fase II concluído.",
          "Ata de gate com decisão formal para início do MVP.",
        ],
        criterios_aceite: [
          "Viabilidade demonstrada e métricas mínimas definidas.",
          "Comitê aprova formalmente o avanço para M3.",
        ],
      },
      {
        title: "[Atividade] Implementar pipeline de dados versionado",
        milestone: "M3",
        labels: ["fase:iii", "tipo:atividade", "dados", "software"],
        description:
          "Construir pipeline de ingestão, transformação e validação de dados com versionamento de artefatos e rastreabilidade para suportar reprodutibilidade do MVP.",
        entregaveis: [
          "Pipeline de ingestão/transformação versionado em repositório.",
          "Documentação do fluxo de dados e versionamento.",
        ],
        criterios_aceite: [
          "Pipeline executa ponta a ponta com rastreabilidade.",
          "Processo de versionamento de dados está operacional.",
        ],
      },
      {
        title: "[Atividade] Treinar e versionar modelo MVP",
        milestone: "M3",
        labels: ["fase:iii", "tipo:atividade", "ml", "dados"],
        description:
          "Treinar o modelo inicial do MVP, registrar experimentos e versionar modelos para garantir rastreabilidade de parâmetros, dados e resultados.",
        entregaveis: [
          "Versão treinada do modelo MVP registrada.",
          "Log de experimentos e parâmetros versionados.",
        ],
        criterios_aceite: [
          "Treino é reproduzível com dados e parâmetros versionados.",
          "Modelo atende baseline mínimo definido.",
        ],
      },
      {
        title:
          "[Atividade] Implementar avaliação offline e baseline comparativa",
        milestone: "M3",
        labels: ["fase:iii", "tipo:atividade", "ml", "dados"],
        description:
          "Implementar rotina de avaliação offline comparando o modelo MVP com baseline de referência, documentando ganhos, limitações e critérios de desempenho.",
        entregaveis: [
          "Rotina de avaliação offline automatizada.",
          "Relatório comparativo entre MVP e baseline.",
        ],
        criterios_aceite: [
          "Métricas de avaliação são calculadas de forma consistente.",
          "Comparação indica desempenho do MVP frente ao baseline.",
        ],
      },
      {
        title: "[Atividade] Configurar CI/CD do repositório",
        milestone: "M3",
        labels: ["fase:iii", "tipo:atividade", "software"],
        description:
          "Configurar esteiras de CI/CD para testes, validações automatizadas, build e deploy do MVP, assegurando qualidade e padronização de entregas.",
        entregaveis: [
          "Pipelines de CI/CD configurados para build/test/deploy.",
          "Políticas de qualidade e validações automáticas documentadas.",
        ],
        criterios_aceite: [
          "Execução de CI ocorre em pull requests principais.",
          "Falhas de qualidade bloqueiam integração conforme regras definidas.",
        ],
      },
      {
        title:
          "[Atividade] Implementar protótipo funcional (API/serviço/aplicação)",
        milestone: "M3",
        labels: ["fase:iii", "tipo:atividade", "software", "ml"],
        description:
          "Desenvolver protótipo funcional do MVP (API, serviço ou aplicação) com fluxo ponta a ponta e interface mínima para homologação.",
        entregaveis: [
          "Protótipo funcional com fluxo ponta a ponta.",
          "Guia de uso e execução em homologação.",
        ],
        criterios_aceite: [
          "Protótipo responde aos cenários essenciais do caso de uso.",
          "Integração mínima com componentes previstos foi validada.",
        ],
      },
      {
        title: "[Entregável] Repositório com CI/CD e documentação técnica",
        milestone: "M3",
        labels: ["fase:iii", "tipo:entregavel", "software"],
        description:
          "Disponibilizar repositório versionado com pipelines de CI/CD ativos e documentação técnica suficiente para manutenção e evolução.",
        entregaveis: [
          "Repositório principal com CI/CD ativo.",
          "Documentação técnica de arquitetura e operação.",
        ],
        criterios_aceite: [
          "Documentação permite setup e manutenção por outro time.",
          "Pipelines passam nos checks definidos para o MVP.",
        ],
      },
      {
        title: "[Entregável] Pipeline + dataset preparado e documentado",
        milestone: "M3",
        labels: ["fase:iii", "tipo:entregavel", "dados", "software"],
        description:
          "Entregar pipeline de dados operacional e dataset preparado/documentado, com origem, transformações, qualidade e versionamento explicitados.",
        entregaveis: [
          "Pipeline de dados pronto para execução recorrente.",
          "Dataset preparado com dicionário de dados e versionamento.",
        ],
        criterios_aceite: [
          "Dataset possui rastreabilidade de origem e transformações.",
          "Qualidade mínima de dados documentada e aceita.",
        ],
      },
      {
        title: "[Entregável] Modelo MVP + relatório de avaliação offline",
        milestone: "M3",
        labels: ["fase:iii", "tipo:entregavel", "ml", "dados"],
        description:
          "Entregar versão do modelo MVP acompanhada de relatório de avaliação offline com métricas, comparação com baseline e análise de riscos de performance.",
        entregaveis: [
          "Artefato do modelo MVP versionado.",
          "Relatório de avaliação offline com métricas e análise.",
        ],
        criterios_aceite: [
          "Métricas mínimas do MVP foram atingidas ou justificadas.",
          "Relatório explicita limitações e próximos ajustes.",
        ],
      },
      {
        title: "[Entregável] MVP em homologação",
        milestone: "M3",
        labels: ["fase:iii", "tipo:entregavel", "software", "ml"],
        description:
          "Disponibilizar MVP funcional em ambiente de homologação para validações técnicas e de integração com atores do projeto.",
        entregaveis: [
          "MVP implantado em ambiente de homologação.",
          "Evidências de testes técnicos e integração básica.",
        ],
        criterios_aceite: [
          "MVP disponível para validação dos stakeholders.",
          "Estabilidade mínima em homologação comprovada.",
        ],
      },
      {
        title: "[Gate] Validar saída da Fase III (M3)",
        milestone: "M3",
        labels: ["fase:iii", "tipo:gate", "governança"],
        description:
          "Conduzir gate para confirmar MVP em homologação, atendimento de métricas técnicas mínimas e validação da integração básica com sistemas legados.",
        entregaveis: [
          "Checklist de saída da Fase III concluído.",
          "Ata de gate com decisão para piloto controlado.",
        ],
        criterios_aceite: [
          "MVP homologado atende métricas técnicas mínimas.",
          "Comitê valida avanço para Fase IV.",
        ],
      },
      {
        title: "[Atividade] Implantar MVP em ambiente piloto controlado",
        milestone: "M4",
        labels: ["fase:iv", "tipo:atividade", "software", "governança"],
        description:
          "Implantar o MVP em ambiente piloto controlado com escopo delimitado, usuários definidos e plano de acompanhamento operacional.",
        entregaveis: [
          "Plano e evidência de implantação no piloto.",
          "Configuração do ambiente e público piloto documentados.",
        ],
        criterios_aceite: [
          "Piloto opera com escopo e período definidos.",
          "Riscos operacionais iniciais estão monitorados.",
        ],
      },
      {
        title: "[Atividade] Monitorar KPIs técnicos e de negócio no piloto",
        milestone: "M4",
        labels: ["fase:iv", "tipo:atividade", "software", "ml", "governança"],
        description:
          "Monitorar continuamente KPIs técnicos e de negócio durante o piloto, consolidando evidências de desempenho, estabilidade e geração de valor.",
        entregaveis: [
          "Painel de KPIs técnicos e de negócio do piloto.",
          "Relatórios periódicos de desempenho e valor.",
        ],
        criterios_aceite: [
          "KPIs são coletados com periodicidade acordada.",
          "Desvios críticos geram ações corretivas registradas.",
        ],
      },
      {
        title: "[Atividade] Coletar feedback de usuários e curar Golden Set",
        milestone: "M4",
        labels: ["fase:iv", "tipo:atividade", "dados", "ml"],
        description:
          "Coletar feedback estruturado dos usuários do piloto e curar Golden Set para suporte a ajustes de modelo e validação de qualidade.",
        entregaveis: [
          "Registro estruturado de feedback de usuários.",
          "Golden Set curado e versionado para validação.",
        ],
        criterios_aceite: [
          "Feedback cobre principais perfis/cenários de uso.",
          "Golden Set atende critérios de qualidade e representatividade.",
        ],
      },
      {
        title:
          "[Atividade] Avaliar salvaguardas éticas e conformidade operacional",
        milestone: "M4",
        labels: ["fase:iv", "tipo:atividade", "governança"],
        description:
          "Avaliar salvaguardas éticas, riscos de viés, aderência regulatória e conformidade operacional, propondo ajustes para uso responsável.",
        entregaveis: [
          "Checklist de conformidade ética e operacional.",
          "Relatório de riscos de viés e ações recomendadas.",
        ],
        criterios_aceite: [
          "Riscos éticos relevantes foram avaliados e mitigados.",
          "Conformidade regulatória mínima foi comprovada.",
        ],
      },
      {
        title: "[Entregável] Relatório de Validação de Campo",
        milestone: "M4",
        labels: ["fase:iv", "tipo:entregavel", "governança"],
        description:
          "Entregar relatório de validação de campo com resultados do piloto, evidências de impacto, análise de estabilidade e recomendações de evolução.",
        entregaveis: [
          "Relatório consolidado de validação de campo.",
          "Evidências de impacto, estabilidade e limitações do piloto.",
        ],
        criterios_aceite: [
          "Relatório suporta decisão de escala com dados objetivos.",
          "Stakeholders-chave revisaram e aprovaram o material.",
        ],
      },
      {
        title: "[Entregável] Golden Set do Piloto",
        milestone: "M4",
        labels: ["fase:iv", "tipo:entregavel", "dados", "ml"],
        description:
          "Entregar Golden Set do piloto com critérios de curadoria, cobertura de cenários e qualidade assegurada para avaliação contínua.",
        entregaveis: [
          "Golden Set final do piloto versionado.",
          "Critérios de curadoria e cobertura documentados.",
        ],
        criterios_aceite: [
          "Golden Set é reproduzível e auditável.",
          "Conjunto cobre cenários críticos para avaliação contínua.",
        ],
      },
      {
        title: "[Entregável] Parecer de Ajuste Ético",
        milestone: "M4",
        labels: ["fase:iv", "tipo:entregavel", "governança"],
        description:
          "Produzir parecer técnico sobre ajustes éticos e de conformidade necessários antes da escala, com recomendações priorizadas.",
        entregaveis: [
          "Parecer técnico com ajustes éticos priorizados.",
          "Plano de implementação das recomendações de conformidade.",
        ],
        criterios_aceite: [
          "Recomendações têm responsável e prazo definidos.",
          "Comitê de governança valida o parecer.",
        ],
      },
      {
        title: "[Gate] Recomendação formal para escala (M4)",
        milestone: "M4",
        labels: ["fase:iv", "tipo:gate", "governança"],
        description:
          "Realizar gate para decidir recomendação formal de escala com base em impacto comprovado, estabilidade técnica e aderência ética/operacional.",
        entregaveis: [
          "Checklist de gate de M4 preenchido.",
          "Recomendação formal de escala (ou não) emitida.",
        ],
        criterios_aceite: [
          "Impacto e estabilidade no piloto foram comprovados.",
          "Decisão formal registrada com justificativas.",
        ],
      },
      {
        title: "[Atividade] Preparar release package de produção",
        milestone: "M5",
        labels: ["fase:v", "tipo:atividade", "software"],
        description:
          "Preparar pacote de release para produção contendo artefatos validados (imagens, binários, scripts), instruções de implantação e critérios de rollback.",
        entregaveis: [
          "Pacote de release com artefatos de produção validados.",
          "Procedimento de deploy e rollback documentado.",
        ],
        criterios_aceite: [
          "Pacote pode ser implantado sem passos manuais ambíguos.",
          "Checklist de segurança e operação foi atendido.",
        ],
      },
      {
        title:
          "[Atividade] Executar transferência tecnológica para órgão demandante",
        milestone: "M5",
        labels: ["fase:v", "tipo:atividade", "software", "governança"],
        description:
          "Executar plano de transferência tecnológica para o órgão demandante, incluindo capacitação, documentação e transição assistida de operação.",
        entregaveis: [
          "Plano executado de transferência e capacitação.",
          "Registro de treinamentos e materiais repassados.",
        ],
        criterios_aceite: [
          "Equipe do órgão consegue operar a solução com autonomia inicial.",
          "Pendências de transição foram tratadas e registradas.",
        ],
      },
      {
        title:
          "[Atividade] Definir e operacionalizar matriz de monitoramento/observabilidade",
        milestone: "M5",
        labels: ["fase:v", "tipo:atividade", "software", "ml", "governança"],
        description:
          "Definir e operacionalizar matriz de monitoramento e observabilidade com indicadores, alertas, rotinas de resposta e governança de incidentes.",
        entregaveis: [
          "Matriz de monitoramento com indicadores e alertas.",
          "Runbook de incidentes e rotinas operacionais.",
        ],
        criterios_aceite: [
          "Alertas críticos estão ativos e testados.",
          "Responsáveis por resposta e escalonamento foram definidos.",
        ],
      },
      {
        title: "[Atividade] Formalizar governança, papéis e responsabilidades",
        milestone: "M5",
        labels: ["fase:v", "tipo:atividade", "governança"],
        description:
          "Formalizar modelo de governança da solução em produção, com papéis, responsabilidades, fluxos decisórios e acordos de operação.",
        entregaveis: [
          "Documento de governança com papéis e responsabilidades.",
          "Fluxo decisório e ritos de acompanhamento formalizados.",
        ],
        criterios_aceite: [
          "Papéis e alçadas estão aprovados pelos responsáveis.",
          "Modelo de governança está aplicável em operação contínua.",
        ],
      },
      {
        title: "[Entregável] Release package validado",
        milestone: "M5",
        labels: ["fase:v", "tipo:entregavel", "software"],
        description:
          "Entregar release package validado para produção com checklist de qualidade, segurança, desempenho e operação concluído.",
        entregaveis: [
          "Release package aprovado para produção.",
          "Registro de validações técnicas e operacionais.",
        ],
        criterios_aceite: [
          "Pacote atende critérios de qualidade definidos.",
          "Aprovação de publicação em produção foi formalizada.",
        ],
      },
      {
        title: "[Entregável] Kit de Transferência Tecnológica",
        milestone: "M5",
        labels: ["fase:v", "tipo:entregavel", "software", "governança"],
        description:
          "Entregar kit de transferência tecnológica com repositório, manuais, materiais de capacitação e matriz operacional de monitoramento.",
        entregaveis: [
          "Kit com repositório, manuais e materiais de capacitação.",
          "Matriz operacional de monitoramento incluída no kit.",
        ],
        criterios_aceite: [
          "Kit é suficiente para operação e evolução local.",
          "Itens do kit estão versionados e acessíveis ao órgão.",
        ],
      },
      {
        title: "[Entregável] Termo de Transferência de Tecnologia assinado",
        milestone: "M5",
        labels: ["fase:v", "tipo:entregavel", "governança"],
        description:
          "Obter e registrar termo de transferência de tecnologia assinado pelas partes, formalizando a conclusão da transição operacional.",
        entregaveis: [
          "Termo de transferência assinado pelas partes.",
          "Registro formal do aceite da transição operacional.",
        ],
        criterios_aceite: [
          "Documento assinado está arquivado e rastreável.",
          "Responsabilidades pós-transferência estão explícitas.",
        ],
      },
      {
        title: "[Gate] Encerramento formal do projeto (M5)",
        milestone: "M5",
        labels: ["fase:v", "tipo:gate", "governança"],
        description:
          "Conduzir gate final para confirmar solução operacionalizada, governança estabelecida e encerramento formal do projeto com aceite institucional.",
        entregaveis: [
          "Checklist final de encerramento preenchido.",
          "Ata de encerramento com aceite institucional.",
        ],
        criterios_aceite: [
          "Solução está operacionalizada com governança ativa.",
          "Comitê confirma encerramento formal do projeto.",
        ],
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Funções Dinâmicas para Milestones ---
  const handleMilestoneChange = (index, field, value) => {
    const list = [...formData.milestones];
    list[index][field] = value;
    setFormData({ ...formData, milestones: list });
  };
  const addMilestone = () => {
    const nextKey = `M${formData.milestones.length + 1}`;
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        {
          key: nextKey,
          title: `${nextKey} - Novo Marco`,
          description: "",
          value: 1,
          unit: "months",
        },
      ],
    });
  };
  const removeMilestone = (index) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index),
    });
  };

  // --- Funções Dinâmicas para Labels ---
  const handleLabelChange = (index, field, value) => {
    const list = [...formData.labels];
    list[index][field] = value;
    setFormData({ ...formData, labels: list });
  };
  const addLabel = () => {
    setFormData({
      ...formData,
      labels: [
        ...formData.labels,
        { name: "nova:label", color: "#0052CC", description: "" },
      ],
    });
  };
  const removeLabel = (index) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((_, i) => i !== index),
    });
  };

  // --- Funções Dinâmicas para Issues ---
  const handleIssueChange = (index, field, value) => {
    const list = [...formData.issues];
    list[index][field] = value;
    setFormData({ ...formData, issues: list });
  };
  const handleIssueArrayChange = (issueIndex, arrayField, itemIndex, value) => {
    const list = [...formData.issues];
    list[issueIndex][arrayField][itemIndex] = value;
    setFormData({ ...formData, issues: list });
  };
  const addIssueItem = (issueIndex, arrayField) => {
    const list = [...formData.issues];
    list[issueIndex][arrayField].push("");
    setFormData({ ...formData, issues: list });
  };
  const removeIssueItem = (issueIndex, arrayField, itemIndex) => {
    const list = [...formData.issues];
    list[issueIndex][arrayField] = list[issueIndex][arrayField].filter(
      (_, i) => i !== itemIndex,
    );
    setFormData({ ...formData, issues: list });
  };
  const addIssue = () => {
    setFormData({
      ...formData,
      issues: [
        ...formData.issues,
        {
          title: "[Atividade] Nova Atividade",
          milestone: formData.milestones[0]?.key || "M1",
          labels: [],
          description: "",
          entregaveis: [""],
          criterios_aceite: [""],
        },
      ],
    });
  };
  const removeIssue = (index) => {
    setFormData({
      ...formData,
      issues: formData.issues.filter((_, i) => i !== index),
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Submissão Final formatando o JSON exato esperado pelo Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const milestone_durations = {};
    formData.milestones.forEach((m) => {
      milestone_durations[m.key] = {
        value: parseInt(m.value) || 1,
        unit: m.unit,
      };
    });

    const formattedLabels = formData.labels.map((l) => ({
      name: l.name,
      color: l.color.replace("#", ""),
      description: l.description,
    }));

    const formattedMilestones = formData.milestones.map((m) => ({
      key: m.key,
      title: m.title,
      description: m.description,
    }));

    const payload = {
      owner: formData.owner,
      repo: formData.repo,
      apply: formData.apply,
      create_project: formData.createProject,
      project_title: formData.projectTitle,
      project_number: formData.projectNumber
        ? parseInt(formData.projectNumber)
        : null,
      project_start_date: formData.projectStartDate,
      config: {
        schedule: {
          project_start_date: formData.projectStartDate,
          project_date_fields: {
            start: "Início previsto",
            end: "Fim previsto",
          },
          milestone_durations: milestone_durations,
        },
        labels: formattedLabels,
        milestones: formattedMilestones,
        issues: formData.issues,
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/build-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "github-token": formData.githubToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Erro ao processar roadmap");

      setMessage(
        `Sucesso! Roadmap aplicado com ${formData.issues.length} issues.`,
      );
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- TELA DE BOAS-VINDAS ---
  if (!started) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <img
            src="/roadmap.png"
            alt="Roadmap Builder Logo"
            className="welcome-logo"
          />
          <span className="welcome-tag">RoadMap Builder</span>
          <h1>Construa Roadmaps Inteligentes para o GitHub</h1>
          <p>
            Automatize a criação de marcos, etiquetas, cronogramas e painéis de
            projeto diretamente no seu repositório com uma experiência fluida,
            estruturada e integrada.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="btn-welcome-start"
          >
            Começar a Construir ➔
          </button>
        </div>
      </div>
    );
  }

  // --- APLICAÇÃO PRINCIPAL (FORMULÁRIO EM PASSOS) ---
  return (
    <div className="app-wrapper">
      <div className="form-container-wrapper">
        {/* Botão compacto posicionado no canto superior esquerdo do formulário */}
        <button onClick={() => setStarted(false)} className="btn-top-welcome">
          ← Voltar a Página Apresentação
        </button>

        <div className="container">
          {/* Stepper com 6 Passos */}
          <div className="stepper">
            {[
              "Início",
              "Durações",
              "Labels",
              "Marcos",
              "Issues",
              "Revisão",
            ].map((labelName, i) => {
              const num = i + 1;
              return (
                <div
                  key={num}
                  className={`step ${step >= num ? "active" : ""}`}
                >
                  <div className="step-circle">{num}</div>
                  <div className="step-label">{labelName}</div>
                </div>
              );
            })}
          </div>

          <div className="form-content">
            {/* PASSO 1: Início */}
            {step === 1 && (
              <div className="step-panel">
                <h2>Configurações Iniciais</h2>
                <div className="form-group">
                  <label>Token do GitHub (Classic) *</label>
                  <input
                    type="password"
                    name="githubToken"
                    value={formData.githubToken}
                    onChange={handleInputChange}
                    placeholder="ghp_..."
                  />
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Owner *</label>
                    <input
                      type="text"
                      name="owner"
                      value={formData.owner}
                      onChange={handleInputChange}
                      placeholder="Ex: JuanPabloFAC"
                    />
                  </div>
                  <div className="form-group">
                    <label>Repositório *</label>
                    <input
                      type="text"
                      name="repo"
                      value={formData.repo}
                      onChange={handleInputChange}
                      placeholder="Ex: roadmap3"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Título do Projeto</label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Data de Início</label>
                    <input
                      type="date"
                      name="projectStartDate"
                      value={formData.projectStartDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 2: Durações dos Milestones */}
            {step === 2 && (
              <div className="step-panel">
                <h2>Durações dos Marcos (Milestones Durations)</h2>
                <p
                  className="subtitle"
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "20px",
                  }}
                >
                  Defina o identificador e o tempo de duração de cada marco para
                  o cálculo automático do cronograma.
                </p>
                {formData.milestones.map((m, index) => (
                  <div key={index} className="dynamic-row">
                    <input
                      type="text"
                      value={m.key}
                      onChange={(e) =>
                        handleMilestoneChange(index, "key", e.target.value)
                      }
                      placeholder="Ex: M1"
                      className="short-input"
                    />
                    <input
                      type="number"
                      min="1"
                      value={m.value}
                      onChange={(e) =>
                        handleMilestoneChange(index, "value", e.target.value)
                      }
                      className="short-input"
                    />
                    <select
                      value={m.unit}
                      onChange={(e) =>
                        handleMilestoneChange(index, "unit", e.target.value)
                      }
                    >
                      <option value="days">Dias</option>
                      <option value="months">Meses</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="btn-remove"
                      style={{
                        visibility:
                          formData.milestones.length === 1
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="btn-secondary"
                  style={{ marginTop: "10px" }}
                >
                  + Adicionar Duração
                </button>
              </div>
            )}

            {/* PASSO 3: Labels com Seletor de Cores */}
            {step === 3 && (
              <div className="step-panel">
                <h2>Etiquetas (Labels)</h2>
                <p
                  className="subtitle"
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "20px",
                  }}
                >
                  Configure o nome, a cor de identificação e a descrição de cada
                  label.
                </p>
                {formData.labels.map((l, index) => (
                  <div key={index} className="label-row">
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) =>
                        handleLabelChange(index, "name", e.target.value)
                      }
                      placeholder="Ex: fase:i"
                      className="label-name-input"
                    />
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={
                          l.color.startsWith("#") ? l.color : `#${l.color}`
                        }
                        onChange={(e) =>
                          handleLabelChange(index, "color", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        value={l.color}
                        onChange={(e) =>
                          handleLabelChange(index, "color", e.target.value)
                        }
                        placeholder="#1D76DB"
                        className="color-text-input"
                      />
                    </div>
                    <input
                      type="text"
                      value={l.description}
                      onChange={(e) =>
                        handleLabelChange(index, "description", e.target.value)
                      }
                      placeholder="Descrição da label"
                      className="label-desc-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeLabel(index)}
                      className="btn-remove"
                      style={{
                        visibility:
                          formData.labels.length === 1 ? "hidden" : "visible",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLabel}
                  className="btn-secondary"
                  style={{ marginTop: "10px" }}
                >
                  + Adicionar Label
                </button>
              </div>
            )}

            {/* PASSO 4: Marcos (Milestones Título/Descrição) */}
            {step === 4 && (
              <div className="step-panel">
                <h2>Marcos do Projeto (Milestones)</h2>
                <p
                  className="subtitle"
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "20px",
                  }}
                >
                  Defina os detalhes de título e descrição de cada marco do
                  roadmap.
                </p>
                {formData.milestones.map((m, index) => (
                  <div key={index} className="milestone-card">
                    <div className="milestone-top-row">
                      <input
                        type="text"
                        value={m.key}
                        onChange={(e) =>
                          handleMilestoneChange(index, "key", e.target.value)
                        }
                        placeholder="Chave"
                        className="milestone-key-input"
                      />
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) =>
                          handleMilestoneChange(index, "title", e.target.value)
                        }
                        placeholder="Título do Marco (ex: M1 - Exploração)"
                        className="milestone-title-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="btn-remove"
                        style={{
                          visibility:
                            formData.milestones.length === 1
                              ? "hidden"
                              : "visible",
                        }}
                      >
                        X
                      </button>
                    </div>
                    <div className="milestone-desc-row">
                      <textarea
                        rows="2"
                        value={m.description}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Descrição detalhada do marco..."
                        className="milestone-textarea"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="btn-secondary"
                  style={{ marginTop: "10px" }}
                >
                  + Adicionar Milestone
                </button>
              </div>
            )}

            {/* PASSO 5: Issues Dinâmicas */}
            {step === 5 && (
              <div className="step-panel">
                <h2>Issues e Entregáveis</h2>
                <p
                  className="subtitle"
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "20px",
                  }}
                >
                  Cadastre as atividades, entregáveis e critérios de aceite
                  vinculados aos marcos.
                </p>

                {/* Container com scroll para as issues */}
                <div className="issues-scroll-container">
                  {formData.issues.map((iss, issIndex) => (
                    <div key={issIndex} className="issue-card-box">
                      <div className="issue-top-row">
                        <input
                          type="text"
                          value={iss.title}
                          onChange={(e) =>
                            handleIssueChange(issIndex, "title", e.target.value)
                          }
                          placeholder="Título da Issue (ex: [Atividade] ...)"
                          className="issue-title-input"
                        />
                        <select
                          value={iss.milestone}
                          onChange={(e) =>
                            handleIssueChange(
                              issIndex,
                              "milestone",
                              e.target.value,
                            )
                          }
                          className="issue-milestone-select"
                        >
                          {formData.milestones.map((m) => (
                            <option key={m.key} value={m.key}>
                              {m.key}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeIssue(issIndex)}
                          className="btn-remove"
                        >
                          X
                        </button>
                      </div>
                      <div className="issue-desc-row">
                        <textarea
                          rows="2"
                          value={iss.description}
                          onChange={(e) =>
                            handleIssueChange(
                              issIndex,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Descrição detalhada da issue..."
                          className="issue-textarea"
                        />
                      </div>

                      <div className="sub-section">
                        <label className="sub-section-title">
                          Entregáveis:
                        </label>
                        {iss.entregaveis.map((ent, eIdx) => (
                          <div key={eIdx} className="sub-row">
                            <input
                              type="text"
                              value={ent}
                              onChange={(e) =>
                                handleIssueArrayChange(
                                  issIndex,
                                  "entregaveis",
                                  eIdx,
                                  e.target.value,
                                )
                              }
                              placeholder="Ex: Ata das oficinas..."
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeIssueItem(issIndex, "entregaveis", eIdx)
                              }
                              className="btn-remove-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addIssueItem(issIndex, "entregaveis")}
                          className="btn-text"
                        >
                          + Adicionar Entregável
                        </button>
                      </div>

                      <div className="sub-section">
                        <label className="sub-section-title">
                          Critérios de Aceite:
                        </label>
                        {iss.criterios_aceite.map((crit, cIdx) => (
                          <div key={cIdx} className="sub-row">
                            <input
                              type="text"
                              value={crit}
                              onChange={(e) =>
                                handleIssueArrayChange(
                                  issIndex,
                                  "criterios_aceite",
                                  cIdx,
                                  e.target.value,
                                )
                              }
                              placeholder="Ex: Órgão demandante valida..."
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeIssueItem(
                                  issIndex,
                                  "criterios_aceite",
                                  cIdx,
                                )
                              }
                              className="btn-remove-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            addIssueItem(issIndex, "criterios_aceite")
                          }
                          className="btn-text"
                        >
                          + Adicionar Critério
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addIssue}
                  className="btn-secondary"
                  style={{ marginTop: "15px" }}
                >
                  + Adicionar Nova Issue
                </button>
              </div>
            )}

            {/* PASSO 6: Revisão e Envio */}
            {step === 6 && (
              <div className="step-panel">
                <h2>Revisão e Confirmação</h2>
                <div className="summary-box">
                  <p>
                    <strong>Repositório:</strong> {formData.owner}/
                    {formData.repo}
                  </p>
                  <p>
                    <strong>Total de Milestones:</strong>{" "}
                    {formData.milestones.length}
                  </p>
                  <p>
                    <strong>Total de Labels:</strong> {formData.labels.length}
                  </p>
                  <p>
                    <strong>Total de Issues:</strong> {formData.issues.length}
                  </p>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="apply"
                      checked={formData.apply}
                      onChange={handleInputChange}
                    />{" "}
                    Aplicar no GitHub
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="createProject"
                      checked={formData.createProject}
                      onChange={handleInputChange}
                    />{" "}
                    Criar Painel de Projeto (Projects V2)
                  </label>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`message ${message.includes("Erro") ? "error" : "success"}`}
              >
                {message}
              </div>
            )}

            {/* Controles de Navegação */}
            <div className="form-actions">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Voltar
                </button>
              )}
              {step < 6 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Próximo
                </button>
              )}
              {step === 6 && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-success"
                >
                  {loading ? (
                    <span className="loading-container">
                      <span className="spinner-css"></span>
                      Processando...
                    </span>
                  ) : (
                    "Finalizar e Enviar"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
