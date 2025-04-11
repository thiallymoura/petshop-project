import dayjs from "dayjs";

const form = document.querySelector("form");
const selectedDate = document.getElementById("date-modal");

// Date atual para o input
const inputToday = dayjs(new Date()).format("YYYY-MM-DD");

//carrega a data atual e define a data mínima como sendo a data atual
selectedDate.value = inputToday
selectedDate.min = inputToday

form.onsubmit = async (e) => {
    e.preventDefault();

    console.log("enviou");
}

