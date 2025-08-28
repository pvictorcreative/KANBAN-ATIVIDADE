import axios from 'axios'

const api = axios.create({
  baseURL: "process.env.BASE_API_URL",
  timeout: 10000,
  headers: { 'accept': 'application/json',
  'content-type': 'application/json',
  }
})

export default api
