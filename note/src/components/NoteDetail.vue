<template>
  <div id="note">
    <div id="note" class="detail">
      <!-- <note-sidebar @update:notes="val => (notes = val)"></note-sidebar> -->
      <note-sidebar :notes.sync="notes"></note-sidebar>
      <div class="note-detail">
        <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
        <div class="note-detail-ct" v-show="curNote.id">
          <div class="note-bar">
            <span> 创建日期: {{ curNote.createdAt | fromatDate }}</span>
            <span> 更新日期: {{ curNote.updatedAt | fromatDate }}</span>
            <span> {{ msg }}</span>
            <span>{{ curNote.statusText }}</span>
            <span class="iconfont icon-delete" @click="deleteNote"></span>
            <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>
          </div>
          <div class="note-title">
            <input type="text" v-model="curNote.title" placeholder="输入标题" @keydown="down" @input="updateNote" />
          </div>
          <div class="editor">
            <textarea
              v-show="isShowPreview"
              v-model="curNote.content"
              @input="updateNote"
              @keydown="statusText = '正在输入...'"
              placeholder="输入内容, 支持 markdown 语法"
            ></textarea>
            <div class="preview markdown-body" v-html="previewContent" v-show="!isShowPreview"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteSidebar from '@/components/NoteSidebar'
import request from '@/helpers/request.js'
import Bus from '@/helpers/bus.js'
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
let md = new MarkdownIt()
export default {
  components: {
    NoteSidebar
  },
  data () {
    return {
      curNote: {

      },
      notes: [],
      msg: '未修改',
      isShowPreview: false
    }
  },
  computed: {
    previewContent () {
      // console.log(this.curNote.content || '')
      return md.render(this.curNote.content || '')
    }
  },
  created () {
    request.getInfo().then(res => {
      // console.log(res)
      if (res.isLogin === false) {
        this.$router.push('/')
      }
    })
    Bus.$on('update:notes', val => {
      this.curNote = val.find(note => note.id === parseInt(this.$route.query.noteId)) || {}
    })
  },
  methods: {
    updateNote: _.debounce(function () {
      // console.log(this.curNote)
      request.updateNotebooks({ noteId: this.curNote.id }, { title: this.curNote.title, content: this.curNote.content })
        .then(res => {
          this.msg = res.msg
        }).catch(err => {
          this.msg = '修改异常!' + Object.entries(err).map((item, key) => item[1])
          // console.log(this.msg)
        })
    }, 300),
    down () {
      this.msg = '正在输入...'
    },
    deleteNote () {
      // console.log(this.curNote.id)
      request.deleteNotebooks(this.curNote.id).then(res => {
        this.$message.success(res.msg)
        this.notes.splice(this.notes.indexOf(this.curNote), 1)
        this.$router.replace({ path: '/note' })
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    // console.log('beforeRouteUpdate')
    this.curNote = this.notes.find(note => note.id === parseInt(to.query.noteId)) || {}
    // console.log(this.curNote)
    next()
  }
}
</script>

<style lang="less" scoped>
@import url(../assets/css/note-detail.less);

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}
</style>
