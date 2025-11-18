// URL da API
const API_URL = "http://localhost:3000/api/publicacoes";

// Função para buscar e exibir as publicações
async function carregarPublicacoes() {
  try {
    const resposta = await fetch(API_URL);
    const publicacoes = await resposta.json();

    const tabela = document.getElementById("lista-publicacoes");
    tabela.innerHTML = ""; // limpa antes de inserir

    publicacoes.forEach(publicacao => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${publicacao.idpublicacao}</td>
        <td>${publicacao.texto}</td>
        <td>${publicacao.ano}</td>
        <td><a href="${publicacao.link}" target="_blank">Acessar</a></td>
        <td>${publicacao.doi}</td>
        <td><a href="${publicacao.filePath}" target="_blank">Acessar</a></td>
        <td class="acoes">
          <button class="action-btn btn-edit" onclick="editarPublicacao(${publicacao.idpublicacao})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button class="action-btn btn-delete" onclick="excluirPublicacao(${publicacao.idpublicacao})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
            `;

      tabela.appendChild(linha);
    });
  } catch (erro) {
    
    document.getElementById("lista-publicacoes").innerHTML =
      `<tr><td colspan="6">Erro ao carregar publicações.</td></tr>`;
  }
}

// 🔹 Adicionar ou atualizar notícia (POST ou PUT)
async function adicionarPublicacao(event) {
  event.preventDefault(); // evita recarregar a página

  const texto = document.getElementById("texto").value.trim();
  const ano = document.getElementById("ano").value.trim();
  const link = document.getElementById("link").value.trim();
  const doi = document.getElementById("doi").value.trim();
  const filePath = document.getElementById("filePath").value;

  if (!texto || !ano || !link || !doi || !filePath) {
    mensagem.textContent = "Preencha todos os campos!";
    mensagem.style.color = "red";
    return;
  }

  // Descobre se estamos editando ou criando
  const idEditando = document
    .getElementById("form-publicacao")
    .dataset.editandoId || null;

  const metodo = idEditando ? "PUT" : "POST";
  const url = idEditando ? `${API_URL}/${idEditando}` : API_URL;

  mensagem.textContent = "Salvando...";
  mensagem.style.color = "black";

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, ano, link, doi, filePath }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar publicação.");
    }

    mensagem.textContent = idEditando
      ? "✅ Publicação atualizada com sucesso!"
      : "✅ Publicação adicionada com sucesso!";
    mensagem.style.color = "green";

    document.getElementById("form-publicacao").reset();
    delete document.getElementById("form-publicacao").dataset.editandoId; // limpa modo edição

    carregarPublicacoes(); // recarrega lista
  } catch (erro) {
    
    mensagem.textContent = "❌ Erro ao salvar publicação.";
    mensagem.style.color = "red";
  }
}

// põe um Evento no botão cadastrar publicação
document.getElementById("form-publicacao").addEventListener("submit", adicionarPublicacao);

//Controle de exibição do formulário
const botaoMostrarForm = document.getElementById("btn-mostrar-form");
const formSection = document.getElementById("form-section");

botaoMostrarForm.addEventListener("click", () => {
  // Alterna entre mostrar e ocultar o formulário
  const visivel = formSection.style.display === "block";

  formSection.style.display = visivel ? "none" : "block";
  botaoMostrarForm.textContent = visivel
    ? "📰 Cadastrar nova publicação"
    : "❌ Fechar formulário";
});

carregarPublicacoes();