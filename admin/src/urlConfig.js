// const baseUrl = process.env.API || "https://flipkart-rest-server.herokuapp.com";
const baseUrl = 'http://localhost:4000'
//const baseUrl = 'http://34.224.218.231:4000'

export const api = `${baseUrl}/api`

export const generatePublicUrl = (fileName) => {
  return `${baseUrl}/public/${fileName}`
}
