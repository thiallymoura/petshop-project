import dayjs from 'dayjs'
import { apiConfig } from './api-config'

export async function scheduleFetchByDay({ date }) {
    try {
        // faz a requisicao para a api
        const response = await fetch(`${apiConfig.baseURL}/schedules`)
        //converte a resposta em json
        const data = await response.json()

        //filtra os agendamentos do dia selecionado
        const dailySchedules = data.filter((schedule) =>
            //A função 'isSame' do dayjs compara as datas considerando apenas o dia 
            dayjs(date).isSame(schedule.when, 'day')
        )

        return dailySchedules

    } catch (error) {
        console.log(error)
        alert("Nao foi possível buscar os agendamentos do dia selecionado")
    }
}
