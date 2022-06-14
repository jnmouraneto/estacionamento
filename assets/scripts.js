(function () {
    var _a;
    const $ = (querry) => document.querySelector(querry);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        if (min > 60) {
            const horas = Math.floor(min / 60);
            const minutos = min % 60;
            const textoHoras = (`00${horas}`).slice(-2);
            const textoMinutos = (`00${minutos}`).slice(-2);
            return `permaneceu por: ${textoHoras}:${textoMinutos}`;
        }
        if (min < 1) {
            return "permaneceu por menos de um minuto";
        }
        return `permaneceu por: ${min} minutos`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome} </td>
            <td>${veiculo.placa} </td>
            <td>${veiculo.entrada} </td>
            <td>
                <button class = "delete" data-placa = "${veiculo.placa}">X</button>
            </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veículo ${nome} - ${tempo}. Deseja removê-lo?`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        console.log("" + nome + placa);
        if (!nome || !placa) {
            alert("Os campos 'nome' e 'placa' não podem ficar em branco!");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
