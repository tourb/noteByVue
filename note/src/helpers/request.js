import axios from 'axios'
import { options } from 'less'
import { Message } from 'element-ui'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'https://note-server.hunger-valley.com'
axios.defaults.withCredentials = true // 跨域
const URL = {
  // 用户注册POST
  REGISTER: '/auth/register',
  // 判断用户是否登录GET
  GET_INFO: '/auth',
  // 注销登录GET
  LOGOUT: '/auth/logout',
  // 用户登录POST
  LOGIN: '/auth/login',
  // 获取笔记本列表GET
  GET_NOTEBOOKS: '/notebooks',
  // 创建笔记本POST
  CREATE: '/notebooks',
  // 修改笔记本PATCH
  UPDATE: '/notebooks/:notebookId',
  // 删除笔记本，只有笔记本为空或者回收站中没有属于当前笔记本的笔记时才能成功删除。DELETE
  DELETE: '/notebooks/:notebookId',
  // 创建笔记到 notebookId 为 :notebookId 的笔记本POST
  CREATE_NOTEBOOKS: '/notes/to/:notebookId',
  // 从 notebookId 为:notebookId 的笔记本中获取笔记列表GET
  GET_NOTEBOOKS_ID: '/notes/from/:notebookId',
  // 把笔记id 为 :noteId 的笔记放入回收站DELETE
  DELETE_NOTEBOOKS: '/notes/:noteId',
  // 把笔记id 为 :noteId 的笔记修改
  DELETE_NOTEBOOKS_PATCH: '/notes/:noteId',
  // 把笔记id 为 :noteId 的笔记从回收站彻底删除DELETE
  CONFIRM_DELETE_NOTEBOOKS: '/notes/:noteId/confirm',
  // 把笔记id 为 :noteId 的笔记从回收站恢复到原来的笔记本PATCH
  REVERT_NOTEBOOKS: '/notes/:noteId/revert',
  // 获取回收站笔记列表GET
  GET_NOTEBOOKS_TRASH: '/notes/trash'

}
export default {

  request (url, type = 'GET', data = {}) {
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
            Message.error(response.data.msg)
            reject(response.data)
          }
        }).catch(err => {
          Message.error(err + '网络异常')
          reject(new Error(err))
        })
    })
  },
  /**
   * 封装登录接口
   */
  register ({ username, password }) {
    return this.request(URL.REGISTER, 'POST', { username, password })
  },
  getInfo () {
    return this.request(URL.GET_INFO, 'GET')
  },
  logout () {
    return this.request(URL.LOGOUT, 'GET')
  },
  login ({ username, password }) {
    return this.request(URL.LOGIN, 'POST', { username, password })
  },
  getNoteBooks () {
    return new Promise((resolve, reject) => {
      this.request(URL.GET_NOTEBOOKS, 'GET')
        .then(res => {
          res.data = res.data.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  create ({ title = '' } = { title: '' }) {
    return this.request(URL.CREATE, 'POST', { title })
  },
  update (notebookId, { title = '' } = { title: '' }) {
    return this.request(URL.UPDATE.replace(':notebookId', notebookId), 'PATCH', { title })
  },
  delete (notebookId) {
    return this.request(URL.DELETE.replace(':notebookId', notebookId), 'DELETE')
  },
  createNotebooks ({ notebookId }, { title = '', content = '' } = { title: '默认标题', content: '' }) {
    return this.request(URL.CREATE_NOTEBOOKS.replace(':notebookId', notebookId), 'POST', { title, content })
  },
  getNotebooksId ({ notebookId }) {
    return new Promise((resolve, reject) => {
      this.request(URL.GET_NOTEBOOKS_ID.replace(':notebookId', notebookId), 'GET')
        .then(res => {
          res.data = res.data.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
          // console.log(res)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  deleteNotebooks (noteId) {
    return this.request(URL.DELETE_NOTEBOOKS.replace(':noteId', noteId), 'DELETE')
  },
  updateNotebooks ({ noteId }, { title, content }) {
    return this.request(URL.DELETE_NOTEBOOKS_PATCH.replace(':noteId', noteId), 'PATCH', { title, content })
  },
  confirmDeleteNotebooks (noteId) {
    return this.request(URL.CONFIRM_DELETE_NOTEBOOKS.replace(':nodeId', noteId), 'DELETE')
  },
  revertNoteBooks (noteId) {
    return this.request(URL.REVERT_NOTEBOOKS.replace(':noteId', noteId), 'PATCH')
  },
  getNoteBooksTrash () {
    return this.request(URL.GET_NOTEBOOKS_TRASH, 'GET')
  }
}
