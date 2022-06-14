interface Veiculo {
    nome: string,
    placa: string,
    entrada: Date | string,
}

(function () {
    const $ = (querry: string): HTMLInputElement | null => document.querySelector(querry);

    function calcTempo (mil: number){
        const min = Math.floor(mil/60000)

        if (min > 60){
            const horas = Math.floor(min/ 60);          
            const minutos = min % 60;
            const textoHoras = (`00${horas}`).slice(-2);
            const textoMinutos = (`00${minutos}`).slice(-2);
            return `permaneceu por: ${textoHoras }:${textoMinutos}`;
        }
        if (min < 1){
            return "permaneceu por menos de um minuto";
        }
        return `permaneceu por: ${min} minutos`;

        
    }

    function patio() {
        function ler(): Veiculo[] {

            return localStorage.patio ? JSON.parse(localStorage.patio) : [];

        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }


        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome} </td>
            <td>${veiculo.placa} </td>
            <td>${veiculo.entrada} </td>
            <td>
                <button class = "delete" data-placa = "${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function () {
                remover(this.dataset.placa)
            })

            $("#patio")?.appendChild(row);
            if (salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: String) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo  = calcTempo(new Date().getTime()- new Date(entrada).getTime());

            if(!confirm(`O veículo ${nome} - ${tempo}. Deseja removê-lo?`)) return
            salvar(ler().filter(veiculo => veiculo.placa !== placa))
            render();
        }


        function render() {
            $("#patio")!.innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return { ler, adicionar, remover, salvar, render }
    }
    
    patio().render();

    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        console.log("" + nome + placa);
        if (!nome || !placa) {
            alert("Os campos 'nome' e 'placa' não podem ficar em branco!")
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString()}, true)
    })
})();