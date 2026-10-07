// Adiciona as variáveis do HTML
const inputTarefa = document.getElementById("inputTarefa");
const prioridade = document.getElementById("prioridade");
const listaDeTarefas = document.getElementById("listaDeTarefas");

const contadorTodas = document.getElementById("contadorTodas");
const contadorPendentes = document.getElementById("contadorPendentes");
const contadorConcluidas = document.getElementById("contadorConcluidas");

// Carrega as tarefas salvas no localStorage assim que a página abre
document.addEventListener("DOMContentLoaded", carregarTarefas);

// Atualiza os contadores de tarefas
function atualizarContadores() {
    const todas = listaDeTarefas.children.length;
    const concluidas = listaDeTarefas.querySelectorAll(".concluida").length;
    const pendentes = todas - concluidas;

    contadorTodas.textContent = todas;
    contadorPendentes.textContent = pendentes;
    contadorConcluidas.textContent = concluidas;
}

// Salva as tarefas atuais no localStorage
function salvarTarefas() {
    const tarefas = [];
    const itensLi = listaDeTarefas.querySelectorAll("li");

    itensLi.forEach(li => {
        const texto = li.firstChild.textContent.trim();
        const concluida = li.classList.contains("concluida");

        let prioridadeli = "adiavel";
        if (li.classList.contains("urgente")) {
            prioridadeli = "urgente";
        }

        tarefas.push({
            texto: texto,
            concluida: concluida,
            prioridade: prioridadeli
        });
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Carrega as tarefas salvas no localStorage
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return;

    const tarefas = JSON.parse(tarefasSalvas);

    tarefas.forEach(tarefaObj => {
        criarTarefa(tarefaObj.texto, tarefaObj.prioridade, tarefaObj.concluida);
    });

    atualizarContadores();
}

// Função para criar o elemento html da tarefa
function criarTarefa(texto, prioridadeSelecionada, concluida = false) {
    const li = document.createElement("li");
    li.textContent = texto;
    li.classList.add(prioridadeSelecionada);
    
    if (concluida) {
        li.classList.add("concluida");
    }

    // Evento de clique para marcar a tarefa como concluída ou não
    li.addEventListener("click", function() {
        li.classList.toggle("concluida");
        atualizarContadores();
        salvarTarefas();
    });

    // Criando o botão de deletar
    const botaoDeletar = document.createElement("button");
    botaoDeletar.textContent = "❌";
    botaoDeletar.classList.add("botao-deletar");

    // Ação do botão de deletar
    botaoDeletar.addEventListener("click", function(event) {
        event.stopPropagation(); // Impede que o clique dispare o evento da li
        li.remove();
        atualizarContadores();
        salvarTarefas();
    });

    li.appendChild(botaoDeletar);
    listaDeTarefas.appendChild(li);
}

// Função chamada ao clicar no botão "Adicionar" ou apertar Enter
function addTarefa() {
    const tarefa = inputTarefa.value.trim();
    const prioridadeSelecionada = prioridade.value;
    
    if (tarefa === "") {
        alert("Por favor, insira uma tarefa.");
        return;
    }

    // Cria a tarefa na tela
    criarTarefa(tarefa, prioridadeSelecionada, false);

    // Limpa o input, atualiza os contadores e salva no localStorage
    inputTarefa.value = "";
    atualizarContadores();
    salvarTarefas();
}

function mudarTema() {
    const body = document.body;
    body.classList.toggle("tema-escuro");
}

// Permite adicionar a tarefa apertando a tecla "Enter" no teclado
inputTarefa.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTarefa();
    }
});