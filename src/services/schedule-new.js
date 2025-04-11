import { apiConfig } from "./api-config.js";

// Função assíncrona scheduleNew para criar um novo agendamento
export async function scheduleNew({ id, name, namePet, phone, description, date, time, when }) {

    // Tentando realizar a requisição para a API
    try {

        await fetch(`${apiConfig.baseURL}/schedules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: String(id), // Garantindo que o ID é uma string
                name,
                namePet,
                phone,
                description,
                date,
                time,
                when
            }),
        })

        alert("Agendamento realizado com sucesso!")


        // Se ocorrer um erro na requisição, entra no bloco catch
    } catch (error) {
        console.log(error)
        alert("Não foi possível agendar. Tente novamente mais tarde.")
    }
}