<template>
<div>
  <!--面包屑导航栏-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>专家管理</el-breadcrumb-item>
    <el-breadcrumb-item>专家信息</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片区域-->
  <el-card class="box-card">
    <!--搜索框区域-->
    <el-row :gutter="20">
      <el-col :span="8" style="position: absolute;right: 1%" >
        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.name" clearable @clear="getExpertList">
          <el-button slot="append" icon="el-icon-search" @click="getExpertList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true">添加专家</el-button>
      </el-col>
    </el-row>
    <el-table :data="expertList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
      <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="right" label-width="80px" class="expandFrom" inline >
          <div style="width:80%;display:inline-block">
          <el-form-item label="生日">
            <span>{{ props.row.birthday }}</span>
          </el-form-item>
          <el-form-item label="民族">
            <span>{{ props.row.nation }}</span>
          </el-form-item>
          <el-form-item label="身份证号">
            <span>{{ props.row.icCard }}</span>
          </el-form-item>
          <el-form-item label="职务">
            <span>{{ props.row.job }}</span>
          </el-form-item>
          <el-form-item label="职称">
            <span>{{ props.row.jobGrade }}</span>
          </el-form-item>
          <el-form-item label="所属行业">
            <span>{{ props.row.industry }}</span>
          </el-form-item>
          <el-form-item label="工作单位">
            <span>{{ props.row.company }}</span>
          </el-form-item>
          <el-form-item label="工作年限">
            <span>{{ props.row.workingYear }}</span>
          </el-form-item>
          <el-form-item label="学历">
            <span>{{ props.row.degree }}</span>
          </el-form-item>
          <el-form-item label="专业类型">
            <span>{{ props.row.major }}</span>
          </el-form-item>
          <el-form-item label="毕业学院">
            <span>{{ props.row.college }}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ props.row.phone }}</span>
          </el-form-item>
          <el-form-item label="座机号">
            <span>{{ props.row.tellPhone }}</span>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="所在城市">
            <span>{{ props.row.city }}</span>
          </el-form-item>
          </div>
          <div style="display: inline-block;width: 20%;height: 300px;position: absolute;top: 5%;">
            <el-form-item label="个人照片" style="width: 100%">
              <el-image :src="'http://localhost:8082/pic/'+props.row.picture" style="width: 200px;height: 200px" />
            </el-form-item>
            <el-form-item label="评价分数" style="position: absolute;bottom: 0;width: 100%;left: 0;">
              <div style="display: inline-block;width: 50px;height: 50px">1111<span>{{ props.row.estimate }}</span></div>
            </el-form-item>
          </div>
        </el-form>
      </template>
      </el-table-column>
      <el-table-column type="index"/>
      <el-table-column label="姓名" prop="name"/>
      <el-table-column label="年龄" prop="age"/>
      <el-table-column label="性别" prop="sex"/>
      <el-table-column label="状态" prop="status">
        <!--scope为这一行的数据-->
        <template slot-scope="scope">
          <!--active-value控制激活状态-->
          <el-switch
          v-model="scope.row.status"
          active-value="1"
          inactive-value="0"
          @change="userStateChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <!--提示-->
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <!--操作按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteExpert(scope.row.expertId)"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
          <el-button type="primary" icon="el-icon-edit" size="mini"/>
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
  <el-dialog title="添加专家" :visible.sync="addDialogVisible" @close="addDialogClosed">
    <!--主体-->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
             size="small" inline label-position="right" label-width="80px" class="addFrom">
      <el-row>
        <el-col :span="12">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-row >
      <el-form-item label="年龄" prop="age">
        <el-input v-model="addForm.age" />
      </el-form-item>
      </el-row>
      <el-row >
      <el-form-item label="性别" prop="sex">
        <el-radio v-model="addForm.sex" label="男">男</el-radio>
        <el-radio v-model="addForm.sex" label="女">女</el-radio>
      </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="addForm.birthday"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期" style="width: 200px">
        </el-date-picker>
        </el-form-item>
      </el-row>
        </el-col>
        <el-col :span="12">
      <el-form-item label="个人照片" prop="picture">
        <el-upload
          class="avatar-uploader"
          action="#"
          :http-request="myUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="民族" prop="nation">
        <el-input v-model="addForm.nation" />
      </el-form-item>
      <el-form-item label="身份证号" prop="icCard">
        <el-input v-model="addForm.icCard" />
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-input v-model="addForm.job" />
      </el-form-item>
      <el-form-item label="职称" prop="jobGrade">
        <el-input v-model="addForm.jobGrade" />
      </el-form-item>
      <el-form-item label="所属行业" prop="industry">
        <el-input v-model="addForm.industry" />
      </el-form-item>
      <el-form-item label="工作单位" prop="company">
        <el-input v-model="addForm.company" />
      </el-form-item>
      <el-form-item label="工作年限" prop="workingYear">
        <el-input v-model="addForm.workingYear" />
      </el-form-item>
      <el-form-item label="学历" prop="degree">
        <el-input v-model="addForm.degree" />
      </el-form-item>
      <el-form-item label="专业类型" prop="major">
        <el-input v-model="addForm.major" />
      </el-form-item>
      <el-form-item label="毕业学院" prop="college">
        <el-input v-model="addForm.college" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="addForm.phone" />
      </el-form-item>
      <el-form-item label="座机号" prop="tellPhone">
        <el-input v-model="addForm.tellPhone" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="addForm.email" />
      </el-form-item>
      <el-form-item label="所在城市" prop="city">
        <el-input v-model="addForm.city" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addExpert">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" >
    <!--主体-->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
             size="small" inline label-position="right" label-width="80px" class="addFrom" status-icon>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name"  disabled/>
          </el-form-item>
          <el-row >
            <el-form-item label="年龄" prop="age">
              <el-input v-model="editForm.age" />
            </el-form-item>
          </el-row>
          <el-row >
            <el-form-item label="性别" prop="sex">
              <el-radio v-model="editForm.sex" label="男">男</el-radio>
              <el-radio v-model="editForm.sex" label="女">女</el-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期" style="width: 200px">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form-item label="个人照片" prop="picture">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="myUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <el-image v-if="imageUrl" :src="imageUrl" class="avatar"/>
              <el-image v-else>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="民族" prop="nation">
        <el-input v-model="editForm.nation" />
      </el-form-item>
      <el-form-item label="身份证号" prop="icCard">
        <el-input v-model="editForm.icCard" disabled/>
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-input v-model="editForm.job" />
      </el-form-item>
      <el-form-item label="职称" prop="jobGrade">
        <el-input v-model="editForm.jobGrade" />
      </el-form-item>
      <el-form-item label="所属行业" prop="industry">
        <el-input v-model="editForm.industry" />
      </el-form-item>
      <el-form-item label="工作单位" prop="company">
        <el-input v-model="editForm.company" />
      </el-form-item>
      <el-form-item label="工作年限" prop="workingYear">
        <el-input v-model="editForm.workingYear" />
      </el-form-item>
      <el-form-item label="学历" prop="degree">
        <el-input v-model="editForm.degree" />
      </el-form-item>
      <el-form-item label="专业类型" prop="major">
        <el-input v-model="editForm.major" />
      </el-form-item>
      <el-form-item label="毕业学院" prop="college">
        <el-input v-model="editForm.college" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="editForm.phone" />
      </el-form-item>
      <el-form-item label="座机号" prop="tellPhone">
        <el-input v-model="editForm.tellPhone" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="editForm.email" />
      </el-form-item>
      <el-form-item label="所在城市" prop="city">
        <el-input v-model="editForm.city" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateExpert">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'expertInfo',
  data() {
    // 验证手机号
    var checkPhone = (rule, value, cb) => {
      const reg = /0?(13|14|15|18|17)[0-9]{9}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    // 验证座机号
    var checkTelPhone = (rule, value, cb) => {
      const reg = /[0-9-()（）]{7,18}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    // 验证座机号
    var checkCardId = (rule, value, cb) => {
      const reg = /\d{17}[\d|x]|\d{15}/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    // 验证正整数
    var checkInt = (rule, value, cb) => {
      const reg = /^[1-9]\d*$/
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
      expertList: [],
      total: 0,
      imageUrl: '',
      // 控制添加用户对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据
      addForm: {
        name: '',
        age: '',
        sex: '男',
        birthday: '',
        nation: '',
        icCard: '',
        job: '',
        jobGrade: '',
        industry: '',
        workingYear: '',
        company: '',
        degree: '',
        college: '',
        major: '',
        phone: '',
        tellPhone: '',
        email: '',
        city: '',
        picture: ''
      },
      editForm: {
        expertId: '',
        name: '',
        age: '',
        sex: '',
        birthday: '',
        nation: '',
        icCard: '',
        job: '',
        jobGrade: '',
        industry: '',
        workingYear: '',
        company: '',
        degree: '',
        college: '',
        major: '',
        phone: '',
        tellPhone: '',
        email: '',
        city: '',
        picture: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '姓名长度为1到10之间', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' }
        ],
        sex: [
          { required: true }
        ],
        birthday: [
          { required: true, message: '请输入生日', trigger: 'blur' }
        ],
        nation: [
          { required: true, message: '请输入民族', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        icCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkCardId, trigger: 'blur' }
        ],
        job: [
          { required: true, message: '请输入职务', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        jobGrade: [
          { required: true, message: '请输入职称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请输入所属行业', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        workingYear: [
          { required: true, message: '请输入工作年限', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入工作单位', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        degree: [
          { required: true, message: '请输入学历', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        college: [
          { required: true, message: '请输入毕业学院', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入专业类型', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        tellPhone: [
          { required: true, message: '请输入座机号', trigger: 'blur' },
          { validator: checkTelPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入所在城市', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ]
      },
      editFormRules: {
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' }
        ],
        sex: [
          { required: true }
        ],
        birthday: [
          { required: true, message: '请输入生日', trigger: 'blur' }
        ],
        nation: [
          { required: true, message: '请输入民族', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        job: [
          { required: true, message: '请输入职务', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        jobGrade: [
          { required: true, message: '请输入职称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请输入所属行业', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        workingYear: [
          { required: true, message: '请输入工作年限', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入工作单位', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        degree: [
          { required: true, message: '请输入学历', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        college: [
          { required: true, message: '请输入毕业学院', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入专业类型', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        tellPhone: [
          { required: true, message: '请输入座机号', trigger: 'blur' },
          { validator: checkTelPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入所在城市', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1到10之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getExpertList()
  },
  methods: {
    async getExpertList () {
      const { data: res } = await this.$http.get('/commonExpertInfoController/selectAllForPage', { params: this.queryInfo })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取专家列表失败')
      this.expertList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getExpertList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getExpertList()
    },
    // 状态改变
    async userStateChange (expertInfo) {
      console.log(expertInfo)
      const { data: res } = await this.$http.put('/commonExpertInfoController/updateById', {
        expertId: expertInfo.expertId,
        status: expertInfo.status
      })
      if (res.code !== 200) {
        expertInfo.status = !expertInfo.status
        return this.$message.error('修改状态失败')
      }
    },
    // 文件上传
    async myUpload (fileObj) {
      const formData = new FormData()
      formData.set('upload', fileObj.file)
      const { data: res } = await this.$http.post('/commonExpertInfoController/uploadHead', formData)
      this.imageUrl = res.data
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
    // 添加专家信息
    addExpert () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonExpertInfoController/insert', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getExpertList()
      })
    },
    // 显示编辑信息对话框
    showEditDialog (expertInfo) {
      this.editDialogVisible = true
      this.editForm = expertInfo
      this.imageUrl = 'http://localhost:8082/pic/' + this.editForm.picture
    },
    // 更新专家
    updateExpert () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonExpertInfoController/updateById', this.editForm)
        if (res.code !== 200) {
          this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getExpertList()
        this.$message.success('更新成功')
      })
    },
    // 删除专家
    async deleteExpert (expertId) {
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
        const { data: res } = await that.$http.delete('/commonExpertInfoController/deleteById/' + expertId)
        if (res.code !== 200) { return that.$message.error('删除失败') }
        await that.getExpertList()
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
      width: 30%;
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
