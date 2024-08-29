document.querySelector('.search-btn').addEventListener('click', () => {
    const searchValue = document.querySelector('.search-input').value;

    // Fazendo uma solicitação GET ao servidor
    fetch(`/consulta?search=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('results-body');
            tbody.innerHTML = ''; // Limpa os resultados anteriores

            // Itera sobre os resultados e adiciona à tabela
            data.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.idade}</td>
                        <td>${item.email}</td>
                        <td>${item.cpf}</td>
                        <td>${item.placa_carro}</td>
                        <td>${item.endereco}</td>
                        <td>${item.data_nascimento}</td>
                        <td><button class="action-btn">Visualizar</button></td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(err => console.error('Erro ao buscar dados:', err));
});

// Função para abrir e fechar o menu lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active'); // Adiciona ou remove a classe "active"
}
