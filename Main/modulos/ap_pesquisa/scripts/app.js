const apiUrl = '/pesquisa'; // URL do JSON Server

function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readContato(callback) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => callback(data))
        .catch(error => {
            displayMessage('Erro ao carregar dados: ' + error.message);
        });
}

var db = [];
readContato(dados => {
    db = dados;
    ListaContatos();
});

const searchInput = document.getElementById("searchInput");
const sugestoes = document.getElementById("sugestoes");

function ListaContatos() {
    let direito = document.getElementById('filtro_direito').value.toLowerCase();
    let tipo = document.getElementById('filtro_tipo').value.toLowerCase();
    let termoBusca = searchInput.value.toLowerCase().trim();
    let tableContatos = document.getElementById("table-contatos");
    tableContatos.innerHTML = "";

    let filtered = db.filter(contato => {
        const titulo = contato.titulo.toLowerCase();
        const tema = contato.tema.toLowerCase();
        const tipoContato = contato.tipo.toLowerCase();
        const duracao = contato.duracao.toLowerCase();
        const data = contato.data.toLowerCase();

        const correspondeFiltro = 
            (tema === direito || direito === '') &&
            (tipoContato === tipo || tipo === '');

        const correspondeBusca =
            termoBusca === '' || 
            titulo.includes(termoBusca) ||
            tema.includes(termoBusca) ||
            tipoContato.includes(termoBusca) ||
            duracao.includes(termoBusca) ||
            data.includes(termoBusca);

        return correspondeFiltro && correspondeBusca;
    });

  /*Atualiza as sugestões*/
    sugestoes.innerHTML = "";

    if (termoBusca.length > 0) {
        const sugestoesSet = new Set();

        filtered.forEach(contato => {
            const campos = [contato.titulo, contato.tema, contato.tipo, contato.duracao, contato.data];
            campos.forEach(campo => {
                if (campo.toLowerCase().startsWith(termoBusca)) {
                    sugestoesSet.add(campo);
                }
            });
        });

        if (sugestoesSet.size > 0) {
            sugestoesSet.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                li.onclick = () => {
                    searchInput.value = item;
                    sugestoes.style.display = "none";
                    ListaContatos(); // atualiza a tabela filtrada
                };
                sugestoes.appendChild(li);
            });
            sugestoes.style.display = "block";
        } else {
            sugestoes.style.display = "none";
        }
    } else {
        sugestoes.style.display = "none";
    }

    if (filtered.length === 0) {
        tableContatos.innerHTML = `<tr><td colspan="7" class="text-center">Nenhum contato encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(contato => {
        tableContatos.innerHTML += `<tr>
            <td scope="row">${contato.id}</td>
            <td>${contato.titulo}</td>
            <td>${contato.tema}</td>
            <td>${contato.tipo}</td>
            <td>${contato.duracao}</td>
            <td>${contato.data}</td>
            <td><a href="${contato.site}" target="_blank">Clique aqui</a></td>
        </tr>`;
    });
}

/*Some com as sugestões quando clicar fora*/
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !sugestoes.contains(e.target)) {
    sugestoes.style.display = "none";
  }
});
searchInput.addEventListener('input', ListaContatos);
document.getElementById('filtro_direito').addEventListener('change', ListaContatos);
document.getElementById('filtro_tipo').addEventListener('change', ListaContatos);