import dayjs from "dayjs";

// seleciona as sessões manhã, tarde e noite
const periodMorning = document.getElementById("period-morning");
const periodAfternoon = document.getElementById("period-afternoon");
const periodNight = document.getElementById("period-night");

export function schedulesShow({ dailySchedules }) {

    try {
        periodMorning.innerHTML = "";
        periodAfternoon.innerHTML = "";
        periodNight.innerHTML = "";

        // Percorre cada agendamento do dia
        dailySchedules.forEach((schedule) => {
            // Cria o item de lista (<li>) e define o ID como atributo
            const item = document.createElement("li");
            item.setAttribute("data-id", schedule.id);

            // Cria o conteúdo com horário e nome do pet/cliente
            const topContent = document.createElement("div");

            // Cria o horário formatado (ex: 09:30)
            const time = document.createElement("strong");
            time.textContent = dayjs(schedule.when).format("HH:mm");

            // Cria o span com o nome do pet e do cliente
            const pet = document.createElement("span");
            pet.classList.add("pet");
            pet.innerHTML = `${schedule.namePet} <span class="client">/ ${schedule.name}</span>`;

            // Cria o span com o nome do pet e do cliente
            topContent.append(time, pet);

            // Cria a descrição do agendamento
            const description = document.createElement("span");
            description.classList.add("description");
            description.textContent = schedule.description;

            // Cria o botão de remoção do agendamento
            const deleteBtn = document.createElement("span");
            deleteBtn.classList.add("delete");
            deleteBtn.textContent = "Remover agendamento";

            // Adiciona os elementos ao item da lista
            item.append(topContent, description, deleteBtn);

            // Pega a hora do agendamento para decidir em qual período ele será exibido
            const hour = dayjs(schedule.when).hour();

            // Classifica o agendamento por período do dia
            if (hour < 12) {
                periodMorning.appendChild(item);
            } else if (hour >= 12 && hour < 18) {
                periodAfternoon.appendChild(item);
            } else {
                periodNight.appendChild(item);
            }
        });

    } catch (error) {
        console.log(error)
        alert("Nao foi possivel exibir os agendamentos")
    }

}
