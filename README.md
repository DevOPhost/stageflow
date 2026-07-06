# StageFlow

**[English](#english) · [Português](#portugues)**

---

<a name="english"></a>

<img src="assets/images/logo-unic-mark.png" alt="UNIC" width="88">

![StageFlow dashboard preview](assets/images/screenshots/stageflow-preview.svg)

**StageFlow** is a web system for internship management, developed as an academic innovation project in the context of the **Mandatory Supervised Internship**. The proposal organizes student records, activities, attendance, workload, and management reports in a single interface, focused on the academic monitoring routine of **UNIC — Universidade de Cuiabá**.

The project was built for portfolio purposes with a complete navigation-ready monitoring base. The application works as a static frontend and is ready to be published on GitHub Pages.

> All data displayed in this version is simulated. The main project developed during the supervised internship remains private because it involves internal routines and institutional information.

## Objective

StageFlow centralizes information that is usually spread across spreadsheets, activity tracking forms, and academic documents. The interface makes it possible to monitor students, supervisors, activities, daily attendance, and workload progress with an experience close to an institutional system.

## Academic context

The solution simulates a common need in supervised internships in the technology field: recording activities, tracking completed hours, validating attendance, and generating reports for coordination, advisors, and supervisors.

The records were organized with names, courses, phone numbers with area code 65, dates between **August 20, 2025** and **September 17, 2025**, schedules from **08:00 to 14:00**, and activities related to an IT internship routine in Cuiabá, Mato Grosso.

## Visual identity

The StageFlow brand was designed as a custom and minimal monogram. The continuous **S-shaped** line represents the internship journey, the flow of records, and the progress of tracked hours. The simple reading was designed to work well as a favicon, sidebar icon, and identity for a modern academic system.

## Features

* Administrative dashboard with metrics, workload progress, and visual indicators.
* Student records with search, status, linked supervisors, and academic progress.
* Supervisor records with department, contact, assigned students, and related activities.
* Activity records with category, period, workload, and full details.
* Attendance control with filters, presence records, absences, hours, and monitoring percentage.
* General, individual, period-based, attendance, and activity reports.
* PDF report export with an academic format.
* Settings for theme, visual density, animations, displayed institution, and default workload.
* Light theme, dark theme, and option to follow the browser preference.
* Detail panels when clicking students, supervisors, activities, and attendance records.

## Technologies

* HTML5
* CSS3
* JavaScript ES6+
* Bootstrap 5
* Chart.js
* jsPDF
* Local persistence in the browser

## Structure

```text
StageFlow/
|-- index.html
|-- pages/
|   |-- projeto.html
|   |-- dashboard.html
|   |-- estagiarios.html
|   |-- supervisores.html
|   |-- atividades.html
|   |-- frequencia.html
|   |-- relatorios.html
|   `-- configuracoes.html
|-- assets/
|   |-- css/
|   |   |-- main.css
|   |   |-- components.css
|   |   `-- pages/
|   |-- images/
|   |   |-- logo-stageflow.svg
|   |   |-- logo-unic.png
|   |   |-- logo-unic-mark.png
|   |   `-- screenshots/
|   `-- js/
|       |-- app.js
|       |-- storage.js
|       |-- ui.js
|       |-- pdf.js
|       |-- rescuePanel.js
|       |-- data/
|       `-- pages/
|-- docs/
|-- README.md
|-- LICENSE
`-- package.json
```

## Running locally

From the project root, run:

```bash
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500/index.html
```

Administrative dashboard:

```text
http://127.0.0.1:5500/pages/dashboard.html?v=7
```

## Publishing

StageFlow can be published directly on GitHub Pages from the repository root. The initial page is `index.html`, and the internal screens are located in the `pages` directory.

## What I learned

* Organization of a static frontend project with JavaScript modules.
* Separation between data, interface components, pages, and reports.
* Dashboard construction with indicators and charts.
* Implementation of persistent visual preferences.
* PDF report generation.
* Modeling of an academic experience focused on internship monitoring.
* Attention to responsiveness, contrast, microinteractions, and institutional language.

## Possible improvements

* Authentication by user profile.
* Integration with academic services.
* Change history for each record.
* Upload and verification of internship documents.
* Digital signatures in reports.
* Dedicated panel for external supervisors.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file.

---

<a name="portugues"></a>

<img src="assets/images/logo-unic-mark.png" alt="UNIC" width="88">

![Prévia do dashboard StageFlow](assets/images/screenshots/stageflow-preview.svg)

**StageFlow** é um sistema web para gestão de estágios desenvolvido como projeto acadêmico de inovação no contexto do **Estágio Supervisionado Obrigatório**. A proposta organiza cadastros, atividades, frequência, carga horária e relatórios gerenciais em uma interface única, com foco em uma rotina de acompanhamento acadêmico da **UNIC — Universidade de Cuiabá**.

O projeto foi construído para portfólio com uma base de acompanhamento preparada para navegação completa. A aplicação funciona de forma estática, pronta para publicação no GitHub Pages.

> Todos os dados exibidos nesta versão são simulados. O projeto principal desenvolvido durante o estágio supervisionado permanece privado por envolver rotinas internas e informações institucionais.

## Objetivo

O StageFlow centraliza informações que normalmente ficam espalhadas entre planilhas, fichas de acompanhamento e documentos acadêmicos. A interface permite acompanhar estudantes, supervisores, atividades desenvolvidas, frequência diária e progresso de carga horária com uma experiência próxima de um sistema institucional.

## Contexto acadêmico

A solução simula uma necessidade comum em estágios supervisionados da área de tecnologia: registrar atividades, acompanhar horas cumpridas, validar presença e gerar relatórios para coordenação, orientadores e supervisores.

Os registros foram organizados com nomes, cursos, telefones com DDD 65, datas entre **20/08/2025** e **17/09/2025**, horários de **08:00 às 14:00** e atividades relacionadas à rotina de estágio em TI em Cuiabá/MT.

## Identidade visual

A marca do StageFlow foi desenhada como um monograma próprio e minimalista. O traço contínuo em forma de **S** representa a jornada do estágio, o fluxo dos registros e a evolução das horas acompanhadas. A leitura simples foi pensada para funcionar bem como favicon, sidebar e identidade de um sistema acadêmico moderno.

## Funcionalidades

* Dashboard administrativo com métricas, progresso de horas e indicadores visuais.
* Cadastro de estagiários com consulta, status, supervisores vinculados e progresso acadêmico.
* Cadastro de supervisores com setor, contato, alunos acompanhados e atividades relacionadas.
* Registro de atividades com categoria, período, carga horária e detalhes completos.
* Controle de frequência com filtros, presenças, ausências, horas e percentual de acompanhamento.
* Relatórios geral, individual, por período, de frequência e de atividades.
* Exportação de relatório em PDF com formato acadêmico.
* Configurações de tema, densidade visual, animações, instituição exibida e carga horária padrão.
* Tema claro, tema escuro e opção de seguir a preferência do navegador.
* Painéis de detalhes ao clicar em alunos, supervisores, atividades e registros de frequência.

## Tecnologias

* HTML5
* CSS3
* JavaScript ES6+
* Bootstrap 5
* Chart.js
* jsPDF
* Persistência local no navegador

## Estrutura

```text
StageFlow/
|-- index.html
|-- pages/
|   |-- projeto.html
|   |-- dashboard.html
|   |-- estagiarios.html
|   |-- supervisores.html
|   |-- atividades.html
|   |-- frequencia.html
|   |-- relatorios.html
|   `-- configuracoes.html
|-- assets/
|   |-- css/
|   |   |-- main.css
|   |   |-- components.css
|   |   `-- pages/
|   |-- images/
|   |   |-- logo-stageflow.svg
|   |   |-- logo-unic.png
|   |   |-- logo-unic-mark.png
|   |   `-- screenshots/
|   `-- js/
|       |-- app.js
|       |-- storage.js
|       |-- ui.js
|       |-- pdf.js
|       |-- rescuePanel.js
|       |-- data/
|       `-- pages/
|-- docs/
|-- README.md
|-- LICENSE
`-- package.json
```

## Como executar localmente

Na raiz do projeto, execute:

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://127.0.0.1:5500/index.html
```

Painel administrativo:

```text
http://127.0.0.1:5500/pages/dashboard.html?v=7
```

## Publicação

O StageFlow pode ser publicado diretamente no GitHub Pages a partir da raiz do repositório. A página inicial é `index.html`, e as telas internas ficam no diretório `pages`.

## Aprendizados

* Organização de um projeto frontend estático com módulos JavaScript.
* Separação entre dados, componentes de interface, páginas e relatórios.
* Construção de dashboard com indicadores e gráficos.
* Implementação de preferências visuais persistentes.
* Geração de relatórios em PDF.
* Modelagem de uma experiência acadêmica voltada para acompanhamento de estágio.
* Cuidado com responsividade, contraste, microinterações e linguagem institucional.

## Melhorias futuras

* Autenticação por perfil de usuário.
* Integração com serviços acadêmicos.
* Histórico de alterações por registro.
* Upload e conferência de documentos de estágio.
* Assinaturas digitais em relatórios.
* Painel específico para supervisores externos.

## Licença

Distribuído sob licença MIT. Consulte o arquivo [LICENSE](LICENSE).
