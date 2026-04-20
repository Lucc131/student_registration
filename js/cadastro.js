function obterChaveAlunos() {
    return "alunos";
}

function obterChaveExclusoesPorDia() {
    return "exclusoesPorDia";
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

function obterAlunos() {
    return JSON.parse(localStorage.getItem(obterChaveAlunos())) || [];
}

function salvarAlunos(alunos) {
    localStorage.setItem(obterChaveAlunos(), JSON.stringify(alunos));
}

function carregarAlunos() {
    configurarPesquisa();

    const lista = document.getElementById("lista-alunos");
    const contadorAlunos = document.getElementById("contador-alunos");
    const contadorExclusoes = document.getElementById("contador-exclusoes");
    const dataAtualizacao = document.getElementById("data-atualizacao");
    const alunos = obterAlunos();
    const hoje = obterDataAtualFormatada();
    const alunosFiltrados = filtrarAlunos(alunos);

    lista.innerHTML = "";

    if (contadorAlunos) {
        contadorAlunos.textContent = contarCadastrosHoje(alunos, hoje);
    }

    if (contadorExclusoes) {
        contadorExclusoes.textContent = obterExclusoesHoje();
    }

    if (dataAtualizacao) {
        dataAtualizacao.textContent = new Date().toLocaleDateString("pt-BR");
    }

    if (alunosFiltrados.length === 0) {
        lista.innerHTML = `
            <tr class="empty-search-message">
                <td colspan="6">Nenhum aluno encontrado com esse filtro.</td>
            </tr>
        `;
        return;
    }

    alunosFiltrados.forEach(({ aluno, index }) => {
        const idade = calcularIdade(aluno.dataNascimento);

        lista.innerHTML += `
            <tr>
                <td data-label="Matricula">${aluno.matricula}</td>
                <td data-label="Nome">${aluno.nome}</td>
                <td data-label="Idade">${idade}</td>
                <td data-label="E-mail">${aluno.email}</td>
                <td data-label="Curso">${aluno.curso}</td>
                <td data-label="Acoes">
                    <button class="acao-btn" onclick="abrirAvisoExclusao(${index})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

function configurarPesquisa() {
    const campoPesquisa = document.getElementById("campoPesquisa");
    const filtroPesquisa = document.getElementById("filtroPesquisa");

    if (campoPesquisa && !campoPesquisa.dataset.listenerAtivo) {
        campoPesquisa.addEventListener("input", carregarAlunos);
        campoPesquisa.dataset.listenerAtivo = "true";
    }

    if (filtroPesquisa && !filtroPesquisa.dataset.listenerAtivo) {
        filtroPesquisa.addEventListener("change", carregarAlunos);
        filtroPesquisa.dataset.listenerAtivo = "true";
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
    document.getElementById("form-aluno").reset();
    carregarAlunos();
}

function abrirAvisoExclusao(index) {
    const avisoExclusao = document.getElementById("avisoExclusao");

    definirIndiceAlunoParaExcluir(index);

    if (avisoExclusao) {
        avisoExclusao.classList.add("active");
        avisoExclusao.setAttribute("aria-hidden", "false");
    }
}

function fecharAvisoExclusao() {
    const avisoExclusao = document.getElementById("avisoExclusao");

    limparIndiceAlunoParaExcluir();

    if (avisoExclusao) {
        avisoExclusao.classList.remove("active");
        avisoExclusao.setAttribute("aria-hidden", "true");
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

function contarCadastrosHoje(alunos, dataHoje) {
    return alunos.filter((aluno) => aluno.dataCadastro === dataHoje).length;
}

function obterExclusoesPorDia() {
    return JSON.parse(localStorage.getItem(obterChaveExclusoesPorDia())) || {};
}

function salvarExclusoesPorDia(exclusoesPorDia) {
    localStorage.setItem(obterChaveExclusoesPorDia(), JSON.stringify(exclusoesPorDia));
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

function filtrarAlunos(alunos) {
    const campoPesquisa = document.getElementById("campoPesquisa");
    const filtroPesquisa = document.getElementById("filtroPesquisa");
    const termoBusca = campoPesquisa ? campoPesquisa.value.trim().toLowerCase() : "";
    const filtroSelecionado = filtroPesquisa ? filtroPesquisa.value : "todos";

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
