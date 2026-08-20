

# Roadmap Builder - Documentação da Aplicação

## 1. Visão Geral
O **Roadmap Builder** é uma ferramenta de automação para gestão de projetos no GitHub. Ele permite que gerentes de projeto e desenvolvedores configurem todo o ambiente de um repositório (duração de marcos, sistema de tags e backlog inicial) de forma centralizada e automática, reduzindo o esforço manual na criação e padronização de projetos.

---

## 2. Como Iniciar a Aplicação

Para executar o ambiente de desenvolvimento localmente, abra terminais separados e execute os comandos:

### Backend (API)
```bash
cd backend
py -m uvicorn backend.api.api:app --reload

```

### Frontend (Interface)

```bash
cd frontend
npm run dev

```

---

## 3. Fluxo de Operação (Wizard)

A interface foi desenhada em uma estrutura de assistente (Wizard) com **6 etapas**, que guiam o usuário na definição das configurações do repositório:

1. **Início (Configurações):** Definição das credenciais (`GitHub Token`), alvo (`Owner/Repo`) e metadados do projeto (Título e Data de Início).
2. **Durações:** Definição dinâmica do tempo de duração de cada `Milestone` (ex: M1, M2...), permitindo escolha entre dias ou meses.
3. **Labels:** Configuração das etiquetas do projeto com seletor visual de cores e descrição, permitindo personalização total das cores da paleta GitHub.
4. **Marcos (Milestones):** Definição dos títulos e descrições dos marcos. Estas informações serão vinculadas às issues posteriormente.
5. **Issues:** O core da aplicação. Permite cadastrar e gerenciar todo o backlog de atividades, vinculando cada issue a um milestone específico, definindo entregáveis e critérios de aceite com barra de rolagem dedicada.
6. **Revisão:** Resumo final do projeto e trigger para envio dos dados à API.

---

## 4. Estrutura de Dados e API

A aplicação envia os dados para o endpoint `POST /api/build-roadmap`. O payload gerado na submissão (`handleSubmit`) segue a estrutura:

```json
{
  "owner": "string",
  "repo": "string",
  "apply": true,
  "create_project": true,
  "project_title": "string",
  "project_number": 0,
  "project_start_date": "YYYY-MM-DD",
  "config": {
    "schedule": {
      "project_start_date": "YYYY-MM-DD",
      "project_date_fields": { 
        "start": "Início previsto", 
        "end": "Fim previsto" 
      },
      "milestone_durations": { 
        "M1": { 
          "value": 15, 
          "unit": "days" 
        } 
      }
    },
    "labels": [ 
      { 
        "name": "fase:i", 
        "color": "1D76DB", 
        "description": "Fase I - Exploração" 
      } 
    ],
    "milestones": [ 
      { 
        "key": "M1", 
        "title": "M1 - Exploração", 
        "description": "Portfólio priorizado e problema selecionado." 
      } 
    ],
    "issues": [ 
      { 
        "title": "[Atividade] Levantar problemas e oportunidades", 
        "milestone": "M1", 
        "labels": ["fase:i", "tipo:atividade", "governança"],
        "description": "Descrição detalhada da atividade...",
        "entregaveis": ["Entregável 1"],
        "criterios_aceite": ["Critério 1"] 
      } 
    ]
  }
}

```

---

## 5. Tecnologias e Particularidades

* **React State Management:** A aplicação utiliza o `useState` para gerenciar estados complexos e aninhados (Milestones, Labels e Issues), permitindo adição/remoção dinâmica de elementos.
* **Identidade Visual:** A aplicação possui um esquema de cores corporativo focado em azul e laranja, com transições suaves e design responsivo, acompanhado de tela de boas-vindas customizada.
* **Integração com GitHub:** O cabeçalho da requisição (`github-token`) garante que a autenticação seja processada com segurança pelo backend.
* **Favicon:** Configurado para exibir a logo em contraste adequado na aba do navegador.

---

## 6. Dicas de Manutenção

* **Adicionar novas Issues:** O formulário de Issues é expansível e conta com suporte a scroll vertical para grandes volumes de dados. Para modificar a lista padrão, atualize o estado inicial no `App.jsx`.
* **Persistência:** Atualmente, os dados são gerenciados em memória durante o ciclo de vida da sessão no navegador. Recarregar a página reinicializa o formulário com os valores padrão definidos no código.



