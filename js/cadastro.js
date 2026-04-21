function carregarAlunos() {
    configurarPesquisa();

    const listaCadastros = document.getElementById("lista-cadastros");
    const totalCadastrosHoje = document.getElementById("total-cadastros-hoje");
    const totalExclusoesHoje = document.getElementById("total-exclusoes-hoje");
    const dataAtual = document.getElementById("data-atual");
    const alunos = obterAlunos();
    const hoje = obterDataAtualFormatada();
    const alunosFiltrados = filtrarAlunos(alunos);

    listaCadastros.innerHTML = "";

    if (totalCadastrosHoje) {
        totalCadastrosHoje.textContent = contarCadastrosHoje(alunos, hoje);
    }

    if (totalExclusoesHoje) {
        totalExclusoesHoje.textContent = obterExclusoesHoje();
    }

    if (dataAtual) {
        dataAtual.textContent = new Date().toLocaleDateString("pt-BR");
    }

    if (alunosFiltrados.length === 0) {
        listaCadastros.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="6">Nenhum aluno encontrado com esse filtro.</td>
            </tr>
        `;
        return;
    }

    alunosFiltrados.forEach(({ aluno, index }) => {
        const idade = calcularIdade(aluno.dataNascimento);

        listaCadastros.innerHTML += `
            <tr>
                <td data-label="Matricula">${aluno.matricula}</td>
                <td data-label="Nome">${aluno.nome}</td>
                <td data-label="Idade">${idade}</td>
                <td data-label="E-mail">${aluno.email}</td>
                <td data-label="Curso">${aluno.curso}</td>
                <td data-label="Acoes">
                    <button class="botao-acao" onclick="abrirAvisoExclusao(${index})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

function configurarPesquisa() {
    const campoBusca = document.getElementById("campo-busca");
    const filtroBusca = document.getElementById("filtro-busca");

    if (campoBusca && !campoBusca.dataset.listenerAtivo) {
        campoBusca.addEventListener("input", carregarAlunos);
        campoBusca.dataset.listenerAtivo = "true";
    }

    if (filtroBusca && !filtroBusca.dataset.listenerAtivo) {
        filtroBusca.addEventListener("change", carregarAlunos);
        filtroBusca.dataset.listenerAtivo = "true";
    }
}

function cadastrarAluno() {
    const matricula = document.getElementById("matricula").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;
    const email = document.getElementById("email").value.trim();
    const curso = document.getElementById("curso").value.trim();

    if (!matricula || !nome || !dataNascimento || !email || !curso) {
        alert("Preencha todos os campos.");
        return;
    }

    const alunos = obterAlunos();

    alunos.push({
        matricula,
        nome,
        dataNascimento,
        email,
        curso,
        dataCadastro: obterDataAtualFormatada()
    });

    salvarAlunos(alunos);
    document.getElementById("form-cadastro").reset();
    carregarAlunos();
}

function abrirAvisoExclusao(index) {
    const painelExclusao = document.getElementById("painel-exclusao");

    definirIndiceAlunoParaExcluir(index);

    if (painelExclusao) {
        painelExclusao.classList.add("ativo");
        painelExclusao.setAttribute("aria-hidden", "false");
    }
}

function confirmarExclusao() {
    const index = obterIndiceAlunoParaExcluir();

    if (index === null) {
        return;
    }

    excluirAluno(index);
}

function excluirAluno(index) {
    const alunos = obterAlunos();

    alunos.splice(index, 1);
    salvarAlunos(alunos);
    registrarExclusaoHoje();
    fecharAvisoExclusao();
    carregarAlunos();
}

function fecharAvisoExclusao() {
    const painelExclusao = document.getElementById("painel-exclusao");

    limparIndiceAlunoParaExcluir();

    if (painelExclusao) {
        painelExclusao.classList.remove("ativo");
        painelExclusao.setAttribute("aria-hidden", "true");
    }
}

function filtrarAlunos(alunos) {
    const campoBusca = document.getElementById("campo-busca");
    const filtroBusca = document.getElementById("filtro-busca");
    const termoBusca = campoBusca ? campoBusca.value.trim().toLowerCase() : "";
    const filtroSelecionado = filtroBusca ? filtroBusca.value : "todos";

    return alunos
        .map((aluno, index) => ({ aluno, index }))
        .filter(({ aluno }) => {
            const campos = {
                nome: aluno.nome,
                matricula: aluno.matricula,
                email: aluno.email,
                curso: aluno.curso
            };

            if (!termoBusca) {
                return true;
            }

            if (filtroSelecionado === "todos") {
                return Object.values(campos).some((valor) =>
                    String(valor).toLowerCase().includes(termoBusca)
                );
            }

            return String(campos[filtroSelecionado] || "").toLowerCase().includes(termoBusca);
        });
}

function obterAlunos() {
    return JSON.parse(localStorage.getItem(obterChaveAlunos())) || [];
}

function salvarAlunos(alunos) {
    localStorage.setItem(obterChaveAlunos(), JSON.stringify(alunos));
}

function obterExclusoesPorDia() {
    return JSON.parse(localStorage.getItem(obterChaveExclusoes())) || {};
}

function salvarExclusoesPorDia(exclusoesPorDia) {
    localStorage.setItem(obterChaveExclusoes(), JSON.stringify(exclusoesPorDia));
}

function registrarExclusaoHoje() {
    const dataHoje = obterDataAtualFormatada();
    const exclusoesPorDia = obterExclusoesPorDia();
    const totalAtual = exclusoesPorDia[dataHoje] || 0;

    exclusoesPorDia[dataHoje] = totalAtual + 1;
    salvarExclusoesPorDia(exclusoesPorDia);
}

function obterExclusoesHoje() {
    const dataHoje = obterDataAtualFormatada();
    const exclusoesPorDia = obterExclusoesPorDia();

    return exclusoesPorDia[dataHoje] || 0;
}

function contarCadastrosHoje(alunos, dataHoje) {
    return alunos.filter((aluno) => aluno.dataCadastro === dataHoje).length;
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const diff = hoje - nascimento;

    return new Date(diff).getUTCFullYear() - 1970;
}

function obterDataAtualFormatada() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function obterIndiceAlunoParaExcluir() {
    if (typeof window.indiceAlunoParaExcluir === "number") {
        return window.indiceAlunoParaExcluir;
    }

    return null;
}

function definirIndiceAlunoParaExcluir(index) {
    window.indiceAlunoParaExcluir = index;
}

function limparIndiceAlunoParaExcluir() {
    window.indiceAlunoParaExcluir = null;
}

function obterChaveAlunos() {
    return "alunos";
}

function obterChaveExclusoes() {
    return "exclusoesPorDia";
}
