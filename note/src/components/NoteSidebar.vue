<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="addNote">添加笔记</span>
    <el-dropdown class="notebook-title" @command="handleCommand" placement="bottom">
      <span class="el-dropdown-link">{{ curBook.title }}<i class="iconfont icon-down"></i> </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in notebooks" :key="index" :command="item.id">
          {{ item.title }}
        </el-dropdown-item>
        <el-dropdown-item command="trash">回收站</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <div class="notes" v-for="(note, index) in notes" :key="index">
      <div class="date">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`"
          >{{ note.updatedAt | fromatDate }}
        </router-link>
      </div>
      <div class="title">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">{{ note.title }} </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/helpers/bus.js'
import request from '@/helpers/request.js'
export default {

  data () {
    return {
      notebooks: [],
      notes: [],
      curBook: {}
    }
  },
  created () {
    this.getNoteBooks()
  },

  methods: {
    getNoteBooks () {
      request.getNoteBooks()
        .then(res => {
          this.notebooks = res.data
          this.curBook = this.notebooks.find(notebook => notebook.id === parseInt(this.$route.query.notebookId)) ||
            this.notebooks[0] || {}
          return request.getNotebooksId({ notebookId: parseInt(this.$route.query.notebookId) || 0 })
        }).then(res => {
          // console.log(res)
          this.notes = res.data
          this.$emit('update:notes', this.notes)
          Bus.$emit('update:notes', this.notes)
        }
        )
    },
    handleCommand (notebookId) {
      if (notebookId === 'trash') {
        return this.$router.push({ path: '/trash' })
      }
      this.curBook = this.notebooks.find(notebook => notebook.id === notebookId)
      request.getNotebooksId({ notebookId })
        .then(res => {
          // console.log(res)
          this.notes = res.data
          this.$emit('update:notes', this.notes)
        })
      // request.getNotebooksId({ notebookId })
      //   .then(res => {
      //     this.notes = res.data
      //   })
    },

    addNote () {
      request.createNotebooks({ notebookId: this.curBook.id }).then(res => {
        // console.log(res)
        this.notes.unshift(res.data)
      })
    }

  }
}

</script>

<style lang="less">
@import url(../assets/css/note-sidebar.less);
.notes {
  display: flex !important;
}
.notes .date,
.title {
  width: 100% !important;
}
</style>
