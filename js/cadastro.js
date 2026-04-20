const chaveAlunos = "alunos";
const chaveExclusoesPorDia = "exclusoesPorDia";
let indiceAlunoParaExcluir = null;

function obterAlunos() {
    return JSON.parse(localStorage.getItem(chaveAlunos)) || [];
}

function salvarAlunos(alunos) {
    localStorage.setItem(chaveAlunos, JSON.stringify(alunos));
}

function carregarAlunos() {
    const lista = document.getElementById("lista-alunos");
    const contadorAlunos = document.getElementById("contador-alunos");
    const contadorExclusoes = document.getElementById("contador-exclusoes");
    const dataAtualizacao = document.getElementById("data-atualizacao");
    const alunos = obterAlunos();
    const hoje = obterDataAtualFormatada();

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

    alunos.forEach((aluno, index) => {
        const idade = calcularIdade(aluno.dataNascimento);

        const linha = `
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

        lista.innerHTML += linha;
    });
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

    const aluno = {
        matricula,
        nome,
        dataNascimento,
        email,
        curso,
        dataCadastro: obterDataAtualFormatada()
    };

    alunos.push(aluno);
    salvarAlunos(alunos);

    document.getElementById("form-aluno").reset();

    carregarAlunos();
}

function abrirAvisoExclusao(index) {
    indiceAlunoParaExcluir = index;

    const avisoExclusao = document.getElementById("avisoExclusao");

    if (avisoExclusao) {
        avisoExclusao.classList.add("active");
        avisoExclusao.setAttribute("aria-hidden", "false");
    }
}

function fecharAvisoExclusao() {
    indiceAlunoParaExcluir = null;

    const avisoExclusao = document.getElementById("avisoExclusao");

    if (avisoExclusao) {
        avisoExclusao.classList.remove("active");
        avisoExclusao.setAttribute("aria-hidden", "true");
    }
}

function confirmarExclusao() {
    if (indiceAlunoParaExcluir === null) {
        return;
    }

    excluirAluno(indiceAlunoParaExcluir);
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
    const idade = new Date(diff).getUTCFullYear() - 1970;

    return idade;
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
    return JSON.parse(localStorage.getItem(chaveExclusoesPorDia)) || {};
}

function salvarExclusoesPorDia(exclusoesPorDia) {
    localStorage.setItem(chaveExclusoesPorDia, JSON.stringify(exclusoesPorDia));
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
