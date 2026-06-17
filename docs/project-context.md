# Contexto do Projeto

O StageFlow é uma proposta acadêmica de inovação para acompanhamento de estágios no contexto da UNIC - Universidade de Cuiabá.

A versão pública foi criada para portfólio e apresentação acadêmica. Ela utiliza registros de apresentação para permitir navegação completa sem expor informações reais de estudantes, supervisores ou setores.

## Decisões

- `index.html` permanece na raiz como página de apresentação.
- As telas internas ficam em `/pages`, com caminhos relativos para publicação.
- `assets/js/data/demoRecords.js` concentra a base inicial de acompanhamento.
- `assets/js/storage.js` centraliza leitura, gravação e restauração dos registros locais.
- A interface usa Bootstrap como apoio, mas recebe identidade visual própria em CSS.

## Limites da Versão Pública

- Não representa um sistema oficial da UNIC.
- Não expõe dados reais.
- Tem foco em portfólio, estudo e apresentação de proposta.
- Pode evoluir futuramente para integração com uma API acadêmica.
