<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.name" clearable @clear="getProjectList">
            <el-button slot="append" icon="el-icon-search" @click="getProjectList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加项目</el-button>
        </el-col>
      </el-row>
      <el-table :data="projectList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="right" label-width="100px" class="expandFrom" inline >
                <el-form-item label="完成时间:"  v-if="props.row.completeTime">
                  <span>{{ props.row.completeTime }}</span>
                </el-form-item>
                <el-form-item label="补足次数:" v-if="props.row.moreExtNum">
                  <span>{{ props.row.moreExtNum }}</span>
                </el-form-item>
              <el-row>
                <el-form-item label="项目备注:">
                  <span>{{ props.row.proRemark }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index"/>
        <el-table-column label="项目名称" prop="proName"/>
        <el-table-column label="开始时间" prop="createTime"/>
        <el-table-column label="抽取次数" prop="extractNum"/>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--提示-->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false" :open-delay="700">
              <!--操作按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.projectId)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false" :open-delay="700">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProject(scope.row.projectId)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户的对话框-->
    <el-dialog title="添加项目" :visible.sync="addDialogVisible" @close="addDialogClosed">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
        <el-row>
            <el-form-item label="项目名称" prop="proName">
              <el-input v-model="addForm.proName" />
            </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="addForm.createTime"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
        </el-row>
        <el-form-item label="抽取次数" prop="extractNum">
          <el-input v-model="addForm.extractNum" />
        </el-form-item>
        <el-form-item label="项目备注" prop="proRemark">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}"   maxlength="500"
                    show-word-limit v-model="addForm.proRemark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" >
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
        <el-row>
          <el-form-item label="项目名称" prop="proName">
            <el-input v-model="editForm.proName" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="editForm.createTime"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="editForm.completeTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抽取次数" prop="extractNum">
          <el-input v-model="editForm.extractNum" />
        </el-form-item>
        <el-form-item label="补抽次数" prop="moreExtNum">
          <el-input v-model="editForm.moreExtNum" />
        </el-form-item>
        <el-form-item label="项目备注" prop="proRemark">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}"
                    maxlength="500"
                    show-word-limit
                    v-model="editForm.proRemark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'projectInfo',
  data () {
    // 验证正整数
    var checkInt = (rule, value, cb) => {
      const reg = /^[1-9]\d*$/
      if (value === null) { return cb() }
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    return {
      queryInfo: {
        name: '',
        pageNum: 1,
        pageSize: 3
      },
      projectList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据
      addForm: {
        proName: '',
        createTime: '',
        extractNum: '',
        proRemark: '无'
      },
      editForm: {
        projectId: '',
        proName: '',
        createTime: '',
        completeTime: '',
        extractNum: '',
        moreExtNum: '',
        proRemark: ''
      },
      addFormRules: {
        proName: [
          {
            required: true,
            message: '请输入项目名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '项目名长度为1到10之间',
            trigger: 'blur'
          }
        ],
        extractNum: [
          {
            required: true,
            message: '请输入抽取次数',
            trigger: 'blur'
          },
          {
            validator: checkInt,
            trigger: 'blur'
          }
        ],
        createTime: [
          {
            required: true,
            message: '请输入创建时间',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        proName: [
          {
            required: true,
            message: '请输入项目名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '项目名长度为1到10之间',
            trigger: 'blur'
          }
        ],
        extractNum: [
          {
            required: true,
            message: '请输入抽取次数',
            trigger: 'blur'
          },
          {
            validator: checkInt,
            trigger: 'blur'
          }
        ],
        moreExtNum: [
          {
            validator: checkInt,
            trigger: 'blur'
          }
        ],
        createTime: [
          {
            required: true,
            message: '请输入创建时间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getProjectList()
  },
  methods: {
    async getProjectList () {
      const { data: res } = await this.$http.get('/commonProjectInfoController/selectAllForPage', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取项目列表失败')
      this.projectList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getProjectList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getProjectList()
    },
    // 监听添加对话框关闭操作
    addDialogClosed () {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 添加项目信息
    addProject () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonProjectInfoController/insert', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getProjectList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (projectId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonProjectInfoController/selectById/' + projectId)
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.editForm = res.data
    },
    // 更新项目
    updateProject () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonProjectInfoController/updateById', this.editForm)
        if (res.code !== 200) {
          this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getProjectList()
        this.$message.success('更新成功')
      })
    },
    // 删除项目
    async deleteProject (projectId) {
      const that = this
      this.$swal({
        title: '确定删除吗？',
        text: '你将无法恢复它！',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确定删除！',
        allowOutsideClick: false
      }).then(async function (result) {
        if (result.dismiss === 'cancel') return
        const { data: res } = await that.$http.delete('/commonProjectInfoController/deleteById/' + projectId)
        if (res.code !== 200) {
          return that.$message.error('删除失败')
        }
        await that.getProjectList()
        that.$swal(
          '删除！',
          '已经被删除。',
          'success'
        )
      }).catch(this.$swal.noop)
    }
  }
}
</script>

<style lang="less" scoped>
  .expandFrom {
    color: #99a9bf;
    .el-form-item {
      width: 40%;
    }
  }
  .addFrom{
    .el-form-item{
      padding-left: 40px;
      margin-right: 120px;
    }
    .avatar-uploader{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
