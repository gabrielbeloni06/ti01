let db = [];

// Faz a requisição para o servidor Node.js e carrega os dados
fetch('/api/contatos')
  .then(res => {
    if (!res.ok) throw new Error('Falha ao carregar JSON');
    return res.json();
  })
  .then(data => {
    db = data;
    renderLista();  // exibe tudo na tela
  })
  .catch(err => {
    console.error(err);
    document.getElementById('msg').innerHTML = 
      `<div class="alert alert-danger">Erro ao carregar contatos.</div>`;
  });

// função que lê os filtros e renderiza a tabela
function renderLista() {
  const filtroDireito = document.getElementById('filtro_direito').value;
  const filtroCategoria = document.getElementById('filtro_categoria').value;
  const tbody = document.getElementById('table-contatos');
  tbody.innerHTML = '';

  // filtra o array: se filtro em branco, mantém todos
  const filtrados = db.filter(c => {
    const matchDireito = filtroDireito === '' || c.direito === filtroDireito;
    const matchCat = filtroCategoria === '' || c.categoria === filtroCategoria;
    return matchDireito && matchCat;
  });

  // se não houve resultado
  if (filtrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">Nenhum contato encontrado.</td>
      </tr>`;
    return;
  }

  // monta as linhas
  filtrados.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.dados}</td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td>${c.direito}</td>
      <td>${c.categoria}</td>
      <td><a href="${c.website}" target="_blank">Visitar</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// vincula renderLista ao onchange dos selects
const selDireito = document.getElementById('filtro_direito');
if (selDireito) selDireito.addEventListener('change', renderLista);
document.getElementById('filtro_categoria')
  .addEventListener('change', renderLista);

// quando a página carrega, garante exibição
window.addEventListener('DOMContentLoaded', () => {
  renderLista();
});