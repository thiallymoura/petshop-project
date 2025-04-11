import { schedulesDay } from "../schedule"
import { scheduleCancel } from "../../services/schedule-cancel.js"

const periods = document.querySelectorAll('.period')

//gerar evento de click para cada lista 
periods.forEach((period) => {
    //captura o evento de click na lista 
    period.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete')) {
            // obtem a lista pai do elemento que foi clicado
            const item = event.target.closest('li')
            // console.log(item);

            //obtem o id do agendamento
            const { id } = item.dataset
            // console.log(id);

            // verifica se o id do agendamento foi obtido
            if (id) {
                const isConfirm = confirm("Tem certeza que deseja cancelar o agendamento?")

                if (isConfirm) {
                    // console.log('removeu');
                    //faz a requisição na API para cancelar o agendamento
                    await scheduleCancel({ id })

                    // recarrega a lista de agendamentos
                    schedulesDay()
                }
            }
        };
    })
})