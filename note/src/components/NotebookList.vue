<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"><i class="iconfont icon-plus"></i> 新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表</h3>
        <router-link v-for="(item, index) in notebooks" :key="index" :to="`/note?notebookId=${item.id}`">
          <div class="book-list">
            <div>
              <span class="iconfont icon-notebook"></span>{{ item.title }}
              <span>{{ item.noteCounts }}</span>
              <span class="action" @click.stop.prevent="onEdit(item)">编辑</span>
              <span class="action" @click.stop.prevent="onDelete(item)">删除</span>
              <span class="date">{{ item.createdAt | fromatDate }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import request from '@/helpers/request.js'
window.request = request
export default {
  data () {
    return {
      notebooks: []
    }
  },
  created () {
    request.getInfo().then(res => {
      // console.log(res)
      if (res.isLogin === false) {
        this.$router.push('/')
      }
    })
    this.getNoteList()
  },
  methods: {
    async getNoteList () {
      let res = await request.getNoteBooks()
      // console.log(res)
      this.notebooks = res.data
    },
    // 创建笔记本
    onCreate () {
      this.$prompt('请输入标题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '标题不能为空且不能超过30个字符'
      }).then(({ value }) => {
        return request.create({ title: value })
        // 第一种刷新方式
        // setTimeout(() => { this.getNoteList() }, 2000)
      }).then(res => {
        this.notebooks.unshift(res.data)
        this.$message.success('添加成功')
      })
    },
    // 编辑笔记本
    onEdit (item) {
      this.$prompt('请编辑标题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '标题不能为空且不能超过30个字符',
        inputValue: item.title
      }).then(({ value }) => {
        return request.update(item.id, { title: value })
        // 第一种刷新方式
        // setTimeout(() => { this.getNoteList() }, 2000)
      }).then(res => {
        this.getNoteList()
        this.$message.success(res.msg)
      })
    },
    // 删除笔记本
    onDelete (item) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return request.delete(item.id)
      }).then(res => {
        this.notebooks.splice(this.notebooks.indexOf(item), 1)
        this.$message.success(res.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url(../assets/css/notebook-list.less);
</style>
