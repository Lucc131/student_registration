# Cadastro de Alunos

Projeto front-end para cadastro e gerenciamento de alunos, com interface moderna, responsiva e armazenamento local no navegador via `localStorage`.

## Visao Geral

O sistema permite cadastrar alunos por meio de um formulario e visualizar os registros em uma tabela com opcoes de exclusao. Tambem exibe indicadores diarios com a quantidade de alunos cadastrados hoje e a quantidade de alunos excluidos hoje.

## Funcionalidades

- Cadastro de alunos com os campos:
  - matricula
  - nome completo
  - data de nascimento
  - e-mail
  - curso
- Validacao de campos obrigatorios no formulario
- Listagem dos alunos em tabela
- Exclusao de alunos cadastrados
- Armazenamento local com `localStorage`
- Resumo diario com:
  - alunos cadastrados hoje
  - alunos excluidos hoje
- Layout responsivo
- Estrutura semantica com `header`, `main`, `section`, `aside`, `article` e `footer`

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- localStorage

## Estrutura de Pastas

```text
my work/
├── css/
│   └── cadastro.css
├── html/
│   └── cadastro.html
├── js/
│   └── cadastro.js
└── README.md
```

## Como Executar

1. Baixe ou clone este repositorio.
2. Abra o arquivo `html/cadastro.html` no navegador.

Nao e necessario instalar dependencias, frameworks ou rodar servidor para usar o projeto.

## Como Funciona o Armazenamento

- Os alunos cadastrados ficam salvos no `localStorage` do navegador.
- Os dados permanecem salvos localmente mesmo ao recarregar a pagina.
- Os resumos diarios usam a data atual do navegador para mostrar os numeros de hoje.

## Destaques do Projeto

- Codigo organizado em tres pastas: `html`, `css` e `js`
- Classes com nomes claros
- Interface com paleta moderna e visual limpo
- Estrutura preparada para evoluir com novas funcionalidades

## Melhorias Futuras

- Edicao de alunos cadastrados
- Busca e filtro por nome ou curso
- Ordenacao de registros
- Publicacao com GitHub Pages

## Autor

Desenvolvido por Lucca.
