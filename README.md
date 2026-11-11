# Exam Generator

Aplicação web para auxiliar professores, monitores e responsáveis pela elaboração de provas e simulados.

## 1. Apresentação do projeto

### 1.1 Contexto e problema

A elaboração de provas é uma atividade constante na rotina dos professores e exige tempo e dedicação: revisar os assuntos ministrados, selecionar os pontos mais importantes, definir o nível de dificuldade e elaborar perguntas alinhadas aos objetivos das aulas.

O processo é ainda mais trabalhoso porque as questões precisam estar adequadas ao material utilizado em sala, como livros, apostilas e slides. Isso obriga o professor a consultar constantemente os documentos da disciplina para garantir que a avaliação reflita o que foi ensinado. Também é necessário evitar repetições, explorar diferentes aspectos do conteúdo e manter enunciados claros e adequados ao nível dos estudantes.

O problema central identificado é a ineficiência do processo manual de elaboração de provas, causada pelo tempo excessivo necessário para analisar conteúdos, selecionar tópicos relevantes e produzir questões adequadas aos alunos.

### 1.2 Objetivo

Reduzir o tempo e o esforço necessários para preparar avaliações, apoiando o professor na geração de questões a partir do material didático da disciplina, sem substituir sua análise e decisão final.

### 1.3 Público-alvo

Professores, monitores e responsáveis pela elaboração de provas e simulados no contexto educacional, incluindo diferentes níveis de ensino.

### 1.4 Solução proposta

Uma aplicação web que utiliza um Modelo de Linguagem (LLM) integrado a uma arquitetura RAG (Retrieval-Augmented Generation). O usuário envia um documento com o conteúdo das aulas, que passa a servir de base contextual para a geração automática de questões de múltipla escolha e subjetivas.

A aplicação deve oferecer uma interface simples e intuitiva para carregar o arquivo, escolher o formato e a quantidade de questões e visualizar os resultados. As questões devem permanecer fiéis ao conteúdo do documento fornecido, e o professor permanece no papel principal de revisar e aprovar o que foi gerado.

## 2. Escopo funcional

### 2.1 Funcionalidades previstas

1. **Envio de documentos:** permitir que o usuário envie documentos contendo os conteúdos das aulas.
2. **Uso dos documentos como base:** utilizar os documentos enviados como base contextual para a geração das questões.
3. **Escolha do formato:** permitir a escolha entre questões de múltipla escolha e questões subjetivas.
4. **Definição da quantidade:** permitir que o usuário defina a quantidade de questões a serem geradas.
5. **Geração com LLM e RAG:** gerar as questões utilizando o LLM integrado à arquitetura RAG.
6. **Visualização dos resultados:** apresentar as questões geradas em uma interface para visualização.
7. **Revisão e aprovação:** permitir que o professor revise e aprove as questões geradas.

As questões devem permanecer fiéis ao conteúdo dos documentos fornecidos.

### 2.2 Fluxo geral da aplicação

1. Envio do documento pelo usuário.
2. Processamento e recuperação de informações utilizando RAG.
3. Configuração do formato e da quantidade de questões.
4. Geração das questões por meio do LLM.
5. Apresentação dos resultados.
6. Revisão e aprovação pelo professor.

Esse fluxo representa a proposta funcional, não uma arquitetura técnica definitiva.

### 2.3 Limites do escopo

Funcionalidades não previstas na proposta não devem ser implementadas sem autorização. Itens como autenticação, multiusuário, exportação de provas e persistência de aprovações não foram definidos e permanecem como pendências.

## 3. Arquitetura geral

O projeto é dividido em dois módulos principais, com responsabilidades separadas.

### 3.1 Frontend (`frontend/`)

Responsável pela interface e pela interação com o usuário:

- Envio de documentos.
- Configuração do formato e da quantidade de questões.
- Apresentação dos resultados.
- Interface de revisão e aprovação das questões.

### 3.2 Backend (`backend/`)

Responsável pela lógica de negócio e pelo processamento:

- Recebimento e processamento dos documentos.
- Recuperação de informações utilizando RAG.
- Integração com o LLM.
- Geração das questões de múltipla escolha e subjetivas.
- Disponibilização dos resultados para o frontend.

### 3.3 Comunicação entre os módulos

Espera-se que o frontend envie requisições ao backend com o documento e as configurações da geração, e que o backend devolva as questões geradas. A implementação atual do backend já expõe uma API HTTP, mas o contrato definitivo, o formato dos dados e a política de erros ainda precisam ser definidos e documentados.

## 4. Tecnologias

### 4.1 Tecnologias já presentes no repositório

As tecnologias abaixo já fazem parte do projeto e são apenas identificadas nesta etapa. Elas não constituem uma nova escolha ou recomendação.

**Backend:**

- Python
- FastAPI
- Uvicorn
- Pydantic
- Ollama
- LangChain
- `langchain-chroma`
- `langchain-huggingface`
- `sentence-transformers`
- `python-multipart`
- `pypdf`
- `langchain-text-splitters`
- ChromaDB, por meio do diretório `chroma/` e da integração `langchain-chroma`

**Implementação atual, sujeita a confirmação:**

- LLM via Ollama, atualmente referenciado no código como `qwen3:1.7b`.
- Modelo de embeddings atualmente referenciado como `sentence-transformers/all-MiniLM-L6-v2`.

**Versionamento:**

- Git e GitHub.

**Frontend:**

- Nenhuma tecnologia de frontend está definida no repositório.

### 4.2 Decisões tecnológicas pendentes

- Framework e bibliotecas do frontend.
- Provedor e modelo de LLM definitivos, incluindo parâmetros de geração.
- Banco ou armazenamento definitivo para os dados vetoriais.
- Modelo de embeddings definitivo.
- Formatos de documento suportados além dos atualmente previstos.
- Estratégia de persistência de documentos, provas e aprovações.
- Autenticação e autorização.
- Contrato definitivo da API e política de erros.
- Requisitos de implantação e ambientes de execução.
- Estratégia de testes e critérios de qualidade.

Nenhuma decisão tecnológica adicional foi tomada nesta etapa.

## 5. Estrutura de diretórios

```text
.
├── .gitignore
├── README.md
├── backend/
│   ├── AGENTS.md
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── chroma/
└── frontend/
    └── AGENTS.md
```

- **`.gitignore`**: configuração de arquivos ignorados pelo Git, mantida na raiz.
- **`README.md`**: fonte principal de planejamento global do projeto.
- **`backend/`**: lógica de negócio, processamento de documentos, RAG, integração com LLM e API.
- **`backend/AGENTS.md`**: diretrizes específicas do backend, a serem preenchidas posteriormente.
- **`backend/requirements.txt`**: dependências do backend.
- **`backend/app/`**: código da aplicação backend.
  - `main.py`: ponto de entrada da API.
  - `models/`: modelos internos.
  - `routes/`: rotas da API.
  - `schemas/`: contratos de entrada e saída.
  - `services/`: serviços de RAG e integração com o LLM.
- **`backend/chroma/`**: dados persistidos do armazenamento vetorial utilizado pelo backend.
- **`frontend/`**: interface e interação com o usuário, ainda sem implementação.
- **`frontend/AGENTS.md`**: diretrizes específicas do frontend, a serem preenchidas posteriormente.

O backend deve ser executado com diretório de trabalho em `backend/`, pois a configuração atual utiliza o caminho relativo `./chroma`.

## 6. Planejamento das entregas (To-do List)

As tarefas abaixo estão organizadas por módulo e iniciam todas como pendentes. A divisão de responsabilidades é: José Fortunato no backend, Pedro Otávio no frontend e integração compartilhada.

### 6.1 Backend

| ID | Descrição | Módulo | Responsável | Status |
|---|---|---|---|---|
| BE-01 | Preparar ambiente e validar o backend existente. | Backend | José Fortunato | [ ] |
| BE-02 | Definir formatos de documento suportados e regras de validação. | Backend | José Fortunato | [ ] |
| BE-03 | Revisar e ajustar a extração de texto e a divisão em chunks. | Backend | José Fortunato | [ ] |
| BE-04 | Revisar e ajustar a indexação e a persistência vetorial. | Backend | José Fortunato | [ ] |
| BE-05 | Revisar e ajustar a recuperação de contexto (retrieval). | Backend | José Fortunato | [ ] |
| BE-06 | Definir e documentar a integração com o LLM. | Backend | José Fortunato | [ ] |
| BE-07 | Implementar e validar a geração de questões de múltipla escolha. | Backend | José Fortunato | [ ] |
| BE-08 | Implementar e validar a geração de questões subjetivas. | Backend | José Fortunato | [ ] |
| BE-09 | Validar a fidelidade ao contexto e tratar respostas inválidas do LLM. | Backend | José Fortunato | [ ] |
| BE-10 | Disponibilizar a geração de questões em lote via API. | Backend | José Fortunato | [ ] |
| BE-11 | Disponibilizar a geração de prova com distribuição por tipo via API. | Backend | José Fortunato | [ ] |
| BE-12 | Definir e documentar o contrato de resposta consumido pelo frontend. | Backend | José Fortunato | [ ] |
| BE-13 | Implementar testes automatizados do backend. | Backend | José Fortunato | [ ] |
| BE-14 | Documentar execução e configuração no `backend/AGENTS.md`. | Backend | José Fortunato | [ ] |

### 6.2 Frontend

| ID | Descrição | Módulo | Responsável | Status |
|---|---|---|---|---|
| FE-01 | Definir a stack do frontend e criar o esqueleto do projeto. | Frontend | Pedro Otávio | [ ] |
| FE-02 | Estruturar o layout e a navegação base da aplicação. | Frontend | Pedro Otávio | [ ] |
| FE-03 | Implementar o envio de documentos. | Frontend | Pedro Otávio | [ ] |
| FE-04 | Implementar a seleção do formato das questões. | Frontend | Pedro Otávio | [ ] |
| FE-05 | Implementar a configuração da quantidade e da distribuição das questões. | Frontend | Pedro Otávio | [ ] |
| FE-06 | Integrar o frontend aos endpoints do backend. | Frontend | Pedro Otávio | [ ] |
| FE-07 | Apresentar as questões geradas. | Frontend | Pedro Otávio | [ ] |
| FE-08 | Implementar a interface de revisão e aprovação das questões. | Frontend | Pedro Otávio | [ ] |
| FE-09 | Implementar estados de carregamento, tratamento de erros e validações de formulário. | Frontend | Pedro Otávio | [ ] |
| FE-10 | Implementar testes do frontend. | Frontend | Pedro Otávio | [ ] |

### 6.3 Integração e validação final

| ID | Descrição | Módulo | Responsável | Status |
|---|---|---|---|---|
| INT-01 | Definir o contrato de comunicação entre frontend e backend. | Integração | José Fortunato e Pedro Otávio | [ ] |
| INT-02 | Integrar o fluxo ponta a ponta: envio, geração, visualização e aprovação. | Integração | José Fortunato e Pedro Otávio | [ ] |
| INT-03 | Validar a fidelidade e a qualidade das questões geradas. | Integração | José Fortunato e Pedro Otávio | [ ] |
| INT-04 | Realizar ajustes finais e documentação de uso. | Integração | José Fortunato e Pedro Otávio | [ ] |
| INT-05 | Revisar e validar o escopo final do projeto. | Integração | José Fortunato e Pedro Otávio | [ ] |

### 6.4 Dependências entre as tarefas

- As tarefas de backend devem avançar antes da integração ponta a ponta.
- O frontend pode iniciar pela estruturação da interface enquanto o backend evoluí.
- O contrato de comunicação deve ser definido antes da integração dos endpoints.
- A validação final depende da conclusão das tarefas de backend, frontend e integração.

## 7. Gitflow e versionamento semântico

| Branch | Finalidade |
|---|---|
| `master` | Versão estável do projeto. |
| `develop` | Integração das funcionalidades em desenvolvimento. |
| `feature/nome-da-feature` | Novas funcionalidades. |
| `fix/nome-do-ajuste` | Correções. |
| `refactor/nome-da-refatoracao` | Refatorações. |

Os commits devem seguir o padrão Conventional Commits:

- `feat`: novas funcionalidades.
- `fix`: correções.
- `refactor`: refatorações.
- `docs`: documentação.
- `chore`: manutenção e configurações.
- `test`: testes.

Os nomes devem ser objetivos, descritivos e preferencialmente em inglês.

## 8. Orientações para os agentes

- Antes de iniciar qualquer implementação, consultar este `README.md` na raiz.
- Consultar também o `AGENTS.md` do módulo em que se trabalhará.
- Respeitar integralmente o escopo e as funcionalidades planejadas.
- Atualizar o status das tarefas correspondentes após a conclusão de cada implementação.
- Não implementar funcionalidades que não estejam previstas no planejamento sem autorização.
- Manter a organização e os padrões estabelecidos para o projeto.

## 9. Pendências e decisões em aberto

- Framework, bibliotecas e padrões do frontend.
- Provedor e modelo de LLM definitivos.
- Parâmetros de geração e critérios de qualidade das questões.
- Banco ou armazenamento definitivo para os dados vetoriais.
- Modelo de embeddings definitivo.
- Formatos de documento suportados além dos atualmente previstos.
- Limites de quantidade e regras de distribuição entre tipos de questão.
- Contrato definitivo da API e política de erros.
- Persistência de documentos, provas e aprovações.
- Suporte a múltiplos usuários.
- Autenticação e autorização.
- Idioma da interface e das questões.
- Exportação ou download de provas.
- Requisitos de implantação e ambientes.
- Estratégia de testes e critérios de aceitação.
