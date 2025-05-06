const categorias = [
  {
    "id_categoria": 1,
    "nome_categoria": "Insalubridade",
    "cursos_ids": [1, 2, 3],
    "palavras_chave": ["segurança", "perigos", "insalubridade", "riscos", "saúde", "trabalho", "condições"]
  },
  {
    "id_categoria": 2,
    "nome_categoria": "Horas Extras",
    "cursos_ids": [1, 2],
    "palavras_chave": ["horas", "horário", "horario", "horas extras"]
  },
  {
    "id_categoria": 3,
    "nome_categoria": "FGTS",
    "cursos_ids": [1, 2, 3],
    "palavras_chave": ["fgts", "fundo", "garantia", "remuneração", "trabalhador", "direitos", "trabalhista"]
  }
];

const artigos = ["artigos", "leitura"];

function buscar() {
  const termo = document.getElementById("searchInput").value.toLowerCase();

  if (artigos.some(palavra => palavra.startsWith(termo))) {
    window.location.href = "artigos.html";
    return;
  }

  for (const categoria of categorias) {
    if (categoria.palavras_chave.some(palavra => palavra.startsWith(termo))) {
      window.location.href = `aulas/${categoria.nome_categoria.toLowerCase()}.html`;
      return;
    }
  }

  alert("Sem resultados.");
}

document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    buscar();
  }
});

document.getElementById("searchInput").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const sugestoes = document.getElementById("sugestoes");
  sugestoes.innerHTML = "";

  if (termo.length > 0) {
    artigos.forEach(palavra => {
      if (palavra.startsWith(termo)) {
        const li = document.createElement("li");
        li.innerHTML = "📚 " + palavra;
        li.classList.add("sugestao-artigo");
        li.onclick = () => {
          document.getElementById("searchInput").value = palavra;
          buscar();
        };
        sugestoes.appendChild(li);
      }
    });
    for (const categoria of categorias) {
      const palavrasFiltradas = categoria.palavras_chave.filter(palavra =>
        palavra.toLowerCase().startsWith(termo)
      );

      palavrasFiltradas.forEach(palavra => {
        const li = document.createElement("li");
        li.textContent = palavra;
        li.onclick = () => {
          document.getElementById("searchInput").value = palavra;
          buscar();
        };
        sugestoes.appendChild(li);
      });
    }
  }
});