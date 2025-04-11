import dayjs from "dayjs";

// Importando as horas disponíveis
import { openingHours } from "../utils/opening-hour.js";
import { scheduleNew } from "../services/schedule-new.js";
import { scheduleFetchByDay } from "../services/schedule-fetch-by-day.js";
import { schedulesShow } from "./schedules/show.js";

const modal = document.getElementById('modal');
const openButton = document.getElementById('new-schedule');
const cancelButton = document.getElementById('btn-cancel');
const scheduleDate = document.getElementById("date");
const formDate = document.getElementById("date-modal");
const form = document.querySelector("form");
const clientName = document.getElementById("client");
const petName = document.getElementById("pet");

const phoneInput = document.getElementById("phone");

// Data atual formatada
const today = dayjs().format("YYYY-MM-DD");

// Função para configurar o input de data
function setDateInputMinAndValue(input) {
    if (input) {
        input.value = today;
        input.min = today;
    }
}

// Aplica a data atual nos campos de data
setDateInputMinAndValue(scheduleDate);
setDateInputMinAndValue(formDate);

// Abre o modal e aplica o blur no fundo
openButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
});

// Fecha o modal e remove o blur
cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
});


// Formatando o input de telefone
phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // Aceita até 11 dígitos
    if (value.length > 11) value = value.slice(0, 11);

    // Formato: (00) 00000-0000
    if (value.length === 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        value = value.replace(/(\d{0,2})/, "($1");
    }

    e.target.value = value;
});

form.onsubmit = async (e) => {
    e.preventDefault();

    try {
        // recuperando o nome do cliente
        const name = clientName.value.trim();
        //verifica se o nome do cliente foi informado
        if (!name) {
            return alert("Por favor, informe o nome do cliente.")
        }

        // recuperando o nome do pet
        const namePet = petName.value.trim();
        //verifica se o nome do pet foi informado
        if (!namePet) {
            return alert("Por favor, informe o nome do Pet.")
        }

        // recuperando o telefone
        const phone = phoneInput.value.replace(/\D/g, "");
        if (phone.length !== 11) {
            return alert("Por favor, informe um telefone válido com DDD (ex: (81) 98214-9112).");
        }

        // recuperando a descrição do serviço
        const description = form.description.value.trim();
        //verifica se a descrição do serviço foi informado
        if (!description) {
            return alert("Por favor, informe a descrição do serviço.")
        }

        // Recuperando a data selecionada pelo input
        const date = formDate.value;
        //verifica se a data foi informada
        if (!date) {
            return alert("Por favor, informe a data.")
        }

        // Recuperando o horário selecionado pelo option do select
        const time = document.getElementById("time").value;

        //recuperando somente a hora
        const [hour] = time.split(":");

        // insere a data na hora
        const when = dayjs(formDate.value).add(hour, "hour");

        // gera o ID
        const id = new Date().getTime();

        await scheduleNew({
            id,
            name,
            namePet,
            phone,
            description,
            date,
            time,
            when
        });

        // fecha o modal
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');

        // limpa o formulário
        form.reset();


    } catch (error) {
        console.log(error);
        alert("Não foi possivel realizar o agendamento");
    }

}

// Função para gerar as opções de hora usando a lista de horários disponíveis
function generateTimeOptions() {
    const select = document.getElementById("time");

    // Limpa o select
    select.innerHTML = "";

    // Percorre a lista de horários disponíveis
    openingHours.forEach((time, index) => {
        const option = new Option(time, time);

        // Define o primeiro horário como selecionado por padrão
        if (index === 0) option.selected = true;

        select.add(option);
    });
}
generateTimeOptions();


// Função de carregamento de agendamentos
export async function schedulesDay() {
    // obtem a data do input
    const date = formDate.value

    // busca na api os agendamentos do dia selecionado
    const dailySchedules = await scheduleFetchByDay({ date })
    console.log(dailySchedules);

    //exibe os agendamentos
    schedulesShow({ dailySchedules })

    // rendizando os horas disponíveis
    hoursLoad({ date, dailySchedules });
};


// Função para carregar as horas disponíveis
function hoursLoad({ date, dailySchedules }) {
    const select = document.getElementById("time");
    select.innerHTML = "";

    // Pegando os horários ocupados
    const busyHours = dailySchedules.map(schedule => schedule.time);

    const opening = openingHours.map((hour) => {
        const [scheduleHour] = hour.split(":");

        const isHourPast = dayjs(date).add(scheduleHour, "hour").isAfter(dayjs());

        // verifica se esse horário está ocupado
        const isBusy = busyHours.includes(hour);

        return {
            hour,
            available: isHourPast && !isBusy, // agora checa se não está ocupado
        };
    });

    // renderizar as horas disponíveis
    opening.forEach(({ hour, available }) => {

        // Verifica se o horário está disponível
        if (available) {
            const option = document.createElement("option");

            // Define o valor do option como o horário
            option.value = hour;
            option.textContent = hour;
            // Adiciona o option ao elemento <select>
            select.appendChild(option);
        }
    });


    // Se não houver horários disponíveis
    if (select.options.length === 0) {
        const option = document.createElement("option");

        option.disabled = true;
        option.selected = true;
        option.textContent = "Sem horários";
        select.appendChild(option);
    }
}

//recarregar a lista de horarios quando o input de data mudar
formDate.addEventListener("input", async (e) => {
    const date = e.target.value;

    const dailySchedules = await scheduleFetchByDay({ date });

    hoursLoad({ date, dailySchedules });
});

// Recarrega os agendamentos e horários quando a data principal for alterada
scheduleDate.addEventListener("input", async (e) => {
    const date = e.target.value;

    // atualiza o input do modal com a mesma data, se quiser manter sincronizado
    formDate.value = date;

    // Carrega os agendamentos do dia e horários disponíveis
    await schedulesDay();
});