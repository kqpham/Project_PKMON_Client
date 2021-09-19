import axios from "axios"

export const axiosInstance = axios.create({
    baseURL = "https://project-pkmon-server.herokuapp.com/"
})