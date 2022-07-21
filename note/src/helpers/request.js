import axios from 'axios'
import { options } from 'less'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'https://note-server.hunger-valley.com'
export default function request (url, type = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const option = {
      url,
      method: type,
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 400// default
      }
    }
    if (type.toLowerCase() === 'get') {
      options.params = data
    } else {
      option.data = data
    }
    axios(option)
      .then(function (response) {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      }).catch(err => {
        reject(new Error(err))
      })
  })
}
