<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专家抽取</el-breadcrumb-item>
      <el-breadcrumb-item>直接抽取</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
        <el-alert
          title="抽取专家"
          type="info"
          center
          show-icon
          :closable="false">
        </el-alert>
      <div style="padding:0 25%">
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="选择项目"></el-step>
          <el-step title="挑选参数"></el-step>
          <el-step title="选择专家"></el-step>
          <el-step title="查看结果"></el-step>
        </el-steps>
      </div>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="top" label-width="100px" class="addFrom">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked" style="min-height: 600px">
          <el-tab-pane label="选择项目" name="0" style="padding: 10px 50px">
            <el-alert
              title="先选择项目"
              type="warning"
              center
              show-icon
              :closable="false"></el-alert>
            <el-form-item label="选择项目:" prop="projectId" style="margin-bottom: 50px;text-align: center">
            <el-select
              v-model="addForm.projectId"
              filterable
              @change="getProjectInfo(addForm.projectId)"
              style="width: 220px"
              placeholder="请选择项目">
              <el-option
                v-for="item in projectList"
                :key="item.projectId"
                :label="item.proName"
                :value="item.projectId">
              </el-option>
            </el-select>
            </el-form-item>
            <el-divider>完成项目信息</el-divider>
            <div style="padding: 0 150px;">
            <el-form v-if="addForm.projectId" :model="projectForm" ref="projectFormRef" :rules="projectFormRules" label-position="top" label-width="100px" status-icon class="projectForm">
              <el-form-item label="项目名称" prop="proName">
                  <el-input v-model="projectForm.proName"  disabled/>
                </el-form-item>
              <el-row>
                <el-form-item label="创建时间" prop="createTime" style="display: inline-block">
                  <el-date-picker
                    v-model="projectForm.createTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              <el-form-item label="完成时间"  style="display: inline-block;margin-left: 100px">
                <el-date-picker
                  v-model="projectForm.completeTime"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              </el-row>
              <el-row >
              <el-form-item label="抽取次数" prop="extractNum">
                <el-input v-model="projectForm.extractNum" />
              </el-form-item>
              <el-form-item label="补抽次数" prop="moreExtNum">
                <el-input v-model="projectForm.moreExtNum" />
              </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="项目备注" prop="proRemark">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                            maxlength="500"
                            show-word-limit
                            v-model="projectForm.proRemark" />
                </el-form-item>
              </el-row>
            </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="挑选参数" name="1" class="chooseInfo">
            <el-alert
              title="挑选抽取条件"
              type="success"
              center
              show-icon
              :closable="false"></el-alert>
            <el-form-item label="所在城市" prop="city" style="">
              <el-cascader type='text' v-model='addForm.city' :options="pca" :props="props" collapse-tags clearable  @change="selectLabel('City')"></el-cascader>
            </el-form-item>
            <el-form-item label="职称" prop="jobGrade">
              <el-select
                v-model="addForm.jobGrade"
                ref="addJobGrade"
                filterable
                multiple
                collapse-tags
                clearable
                @change="selectLabel('JobGrade')"
                style="width: 200px"
                placeholder="请选择职称">
                <el-option
                  v-for="item in jobGradeOption"
                  :key="item.id"
                  :label="item.jobGrade"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
              <el-select
                v-model="addForm.industry"
                ref="addIndustry"
                filterable
                multiple
                collapse-tags
                clearable
                @change="selectLabel('Industry')"
                style="width: 200px"
                placeholder="请选择行业">
                <el-option
                  v-for="item in industryOption"
                  :key="item.id"
                  :label="item.industry"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作单位" prop="company">
              <el-select
                v-model="addForm.company"
                ref="addCompany"
                filterable
                multiple
                collapse-tags
                clearable
                @change="selectLabel('Company')"
                style="width: 200px"
                placeholder="请选择单位">
                <el-option
                  v-for="item in companyOption"
                  :key="item.id"
                  :label="item.company"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业类型" prop="major">
              <el-select
                v-model="addForm.major"
                ref="addMajor"
                filterable
                multiple
                collapse-tags
                clearable
                @change="selectLabel('Major')"
                style="width: 200px"
                placeholder="请选择专业">
                <el-option
                  v-for="item in majorOption"
                  :key="item.id"
                  :label="item.major"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row style="min-height: 115px">
              <el-form-item label="已选城市">
                <el-tag v-for="item in selectCityOption"  :key="item" effect="dark" closable  style="margin: 5px 5px" @close="updateSelect(1,item)">
                  <span style="display: inline-block;height: 33px">{{item}}</span>
                </el-tag>
              </el-form-item>
            </el-row>
            <el-row style="min-height: 115px">
              <el-form-item label="已选职称">
                <el-tag v-for="item in selectJobGradeOption" :key="item.key" effect="dark" closable type="success" style="margin: 5px 5px" @close="updateSelect(2,item.key)">
                  <span>{{item.value}}</span>
                </el-tag>
              </el-form-item>
            </el-row>
            <el-row style="min-height: 115px">
              <el-form-item label="已选行业">
                <el-tag v-for="item in selectIndustryOption" :key="item.key" effect="dark" closable type="info" style="margin: 5px 5px" @close="updateSelect(3,item.key)">
                  <span>{{item.value}}</span>
                </el-tag>
              </el-form-item>
              </el-row>
            <el-row style="min-height: 115px">
              <el-form-item label="已选单位">
                <el-tag v-for="item in selectCompanyOption" :key="item.key" effect="dark" closable type="warning" style="margin: 5px 5px" @close="updateSelect(4,item.key)">
                  <span>{{item.value}}</span>
                </el-tag>
              </el-form-item>
              </el-row>
              <el-row style="min-height: 115px">
              <el-form-item label="已选专业">
                <el-tag v-for="item in selectMajorOption" :key="item.key" effect="dark" closable type="danger" style="margin: 5px 5px" @close="updateSelect(5,item.key)">
                  <span> {{item.value}}</span>
                </el-tag>
              </el-form-item>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="选择专家" name="2">
            <el-row :gutter="20" style="margin-bottom: 20px">
              <el-alert
                title="先选择抽取模式，然后查看专家信息"
                type="success"
                center
                show-icon
                :closable="false"></el-alert>
              <el-col :span="8">
                <el-form-item label="选择抽取模式" prop="extractType">
                  <el-select v-model="addForm.extractType" placeholder="请选择" @change="extractTypeChange">
                    <el-option
                      v-for="item in extractTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div style="display: inline-block;margin-left: 20px">
                    <el-button v-if="addForm.extractType !=='1'" type="success" @click="extract">随机抽取</el-button>
                    <span v-if="addForm.extractType !=='2'">  抽取个数： {{multipleSelection.length}}/{{addForm.extractType ==='1'? projectForm.extractNum: projectForm.moreExtNum}}</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="float: right;margin: 50px 0 0 0">
                <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.name" clearable @clear="getExpertList">
                  <el-button slot="append" icon="el-icon-search" @click="getExpertList"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-table :data="expertList"
                      stripe
                      :header-cell-style="{ 'font-size':'15px'}"
                      ref="multipleTable" style="width: 100%"
                      @select="handleSelectionChange"
                      @select-all="selectAll"
                      :row-key="getRowKey"
              >
              <el-table-column
                type="selection"
                reserve-selection
                width="55">
              </el-table-column>
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
                    <div style="display: inline-block;width: 20%;height: 250px;position: absolute;top: 5%;">
                      <el-form-item label="个人照片" style="width: 80%">
                        <el-image :src="'http://localhost:8082/pic/'+props.row.picture" style="width: 150px;height: 150px" />
                        <el-rate
                          disabled
                          show-score
                          v-model="props.row.estimate"
                          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                          style="text-align: center"
                        >
                        </el-rate>
                      </el-form-item>
                    </div>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column type="index"/>
              <el-table-column label="姓名" prop="name"/>
              <el-table-column label="年龄" prop="age"/>
              <el-table-column label="性别" prop="sex"/>
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
          </el-tab-pane>
          <el-tab-pane label="查看结果" name="3">
            <el-alert
              title="选择专家并消息通知"
              type="success"
              center
              show-icon
              :closable="false">
            </el-alert>
            <el-form-item>
                <el-transfer
                  v-model="addForm.result"
                  :titles="['专家列表', '发送邮件']"
                  :data="resultData" style="width: 600px;margin: 50px auto">
                </el-transfer>
              <el-button round type="primary" style="margin: 20px auto;width: 400px;display: block" @click="showMessageDialog">发送短信</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog title="消息模板" :visible.sync="messageDialogVisible" @close="MessageDialogClosed" width="30%">
        <!--主体-->
        <el-form :model="messageForm" :rules="messageFormRules" ref="messageFormRef"
                 size="large" label-position="right" label-width="100px" class="addFrom" status-icon>
          <el-form-item label="消息模板选择">
            <el-select v-model="messageForm.messageId" @change="messageChange" placeholder="请选择" style="width: 200px">
              <el-option
                v-for="item in systemMessageList"
                :key="item.messageId"
                :label="item.mesInfo"
                :value="item.messageId"
                style="max-width: 200px"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="messageForm.messageId" label="消息名称" prop="mesInfo">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                      maxlength="500"
                      show-word-limit
                      v-model="messageForm.mesInfo" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="messageDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendSms" v-loading.fullscreen.lock="fullscreenLoading"
                     element-loading-text="正在发送中"
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.8)"
          >确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { pca } from 'area-data'
export default {
  name: 'directExtraction',
  data() {
    var checkInt = (rule, value, cb) => {
      const reg = /^[1-9]\d*$/
      if (value === null) { return cb() }
      if (reg.test(value)) {
        if (value > 10) {
          cb(new Error('最多抽取10位专家'))
        }
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    var checkMessage = (rule, value, cb) => {
      const reg = /(\{expertName\})/
      const reg2 = /(\{createTime\})/
      const reg3 = /(\{projectName\})/
      if (value === null) { return cb() }
      if (reg.test(value) && reg2.test(value) && reg3.test(value)) {
        return cb()
      }
      cb(new Error('必须包含{expertName}、{createTime}、{projectName}'))
    }
    return {
      // 城市级联可多选
      props: { multiple: true },
      activeIndex: '0',
      addForm: {
        extractType: '1',
        result: []
      },
      addFormRules: {
        projectId: [
          {
            required: true,
            message: ' ',
            trigger: 'blur'
          }
        ],
        extractType: [
          {
            required: true,
            message: '请输入抽取次数',
            trigger: 'blur'
          }
        ]
      },
      projectFormRules: {
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
      },
      projectList: [],
      projectForm: {
        projectId: '',
        moreExtNum: '0'
      },
      pca: pca,
      // 单位Option
      companyOption: [],
      // 行业Option
      industryOption: [],
      // 职称Option
      jobGradeOption: [],
      // 专业Option
      majorOption: [],
      selectJobGradeOption: [],
      selectIndustryOption: [],
      selectCompanyOption: [],
      selectMajorOption: [],
      selectCityOption: [],
      expertList: [],
      queryInfo: {
        name: '',
        pageNum: 1,
        pageSize: 3
      },
      total: 0,
      multipleSelection: [],
      extractTypeList: [
        {
          value: '1',
          label: '直接抽取'
        },
        {
          value: '2',
          label: '随机抽取'
        },
        {
          value: '3',
          label: '补足抽取'
        }
      ],
      // 控制tab跳转
      validateValue: false,
      // 抽取结果
      resultList: [],
      // 穿梭款数据
      resultData: [],
      // 信息对话框
      messageDialogVisible: false,
      messageForm: {},
      messageFormRules: {
        mesInfo: [{
          validator: checkMessage,
          trigger: 'blur'
        }]
      },
      systemMessageList: [],
      // loading 判断
      fullscreenLoading: false
    }
  },
  created () {
    this.getProjectList()
  },
  methods: {
    async getProjectList () {
      const { data: res } = await this.$http.get('/commonProjectInfoController/selectAll')
      if (res.code !== 200) return this.$message.error('获取项目列表失败')
      this.projectList = res.data
    },
    // 获得option
    async getOption () {
      const { data: res } = await this.$http.get('commonCompanyInfoController/selectAll', { params: { status: 1 } })
      const { data: res2 } = await this.$http.get('commonIndustryInfoController/selectAll', { params: { status: 1 } })
      const { data: res3 } = await this.$http.get('commonMajorInfoController/selectAll', { params: { status: 1 } })
      const { data: res4 } = await this.$http.get('commonJobgradeInfoController/selectAll', { params: { status: 1 } })
      if (res.code !== 200 || res2.code !== 200 || res3.code !== 200 || res4.code !== 200) return this.$message.error('获取option失败')
      this.companyOption = res.data
      this.industryOption = res2.data
      this.majorOption = res3.data
      this.jobGradeOption = res4.data
    },
    async getProjectInfo (projectId) {
      const { data: res } = await this.$http.get('/commonProjectInfoController/selectById/' + projectId)
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.projectForm = res.data
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && !this.addForm.projectId) {
        this.$message.error('先完成项目信息')
        return false
      }
      if (activeName === '3' && this.resultList.length === 0 && this.multipleSelection.length === 0) {
        this.$message.error('请先抽取专家')
        return false
      }
      if (oldActiveName === '3') {
        this.multipleSelection = []
        this.resultList = []
        this.resultData = []
        this.addForm.result = []
        this.$refs.multipleTable.clearSelection()
      }
      this.$refs.projectFormRef.validate(valid => {
        this.validateValue = valid
      })
      if (!this.validateValue) this.$message.error('信息未完成')
      return this.validateValue
    },
    tabClicked: function () {
      if (this.activeIndex === '1') {
        this.getOption()
      }
      if (this.activeIndex === '2') {
        this.getExpertList()
      }
      if (this.activeIndex === '3') {
        const data = []
        this.multipleSelection.forEach(item => {
          data.push({
            key: item.expertId,
            label: item.name
          })
        })
        this.resultData = data
        if (this.multipleSelection.length < (this.addForm.extractType !== '3' ? this.projectForm.extractNum : this.projectForm.moreExtNum)) {
          this.$confirm('您还有未使用的抽取次数', '是否返回', '提示', {
            confirmButtonText: '离开',
            cancelButtonText: '返回',
            type: 'warning'
          }).catch(err => {
            if (err === 'cancel') { this.activeIndex = '2' }
          })
        }
      }
    },
    // 动态显示下方已选标签
    selectLabel(value) {
      this.$nextTick(() => {
        switch (value) {
          case 'JobGrade':
            this.selectJobGradeOption = []
            this.$refs.addJobGrade.selected.forEach(item => {
              this.selectJobGradeOption.push({ key: item.value, value: item.label })
            })
            break
          case 'Industry':
            this.selectIndustryOption = []
            this.$refs.addIndustry.selected.forEach(item => {
              this.selectIndustryOption.push({ key: item.value, value: item.label })
            })
            break
          case 'Company':
            this.selectCompanyOption = []
            this.$refs.addCompany.selected.forEach(item => {
              this.selectCompanyOption.push({ key: item.value, value: item.label })
            })
            break
          case 'Major':
            this.selectMajorOption = []
            this.$refs.addMajor.selected.forEach(item => {
              this.selectMajorOption.push({ key: item.value, value: item.label })
            })
            break
          case 'City':
            this.selectCityOption = []
            this.addForm.city.forEach(item => {
              this.selectCityOption.push(item.toString())
            })
            break
          default:
        }
      })
    },
    // 动态更新已选标签
    updateSelect: function (index, key) {
      switch (index) {
        case 1:
          this.addForm.city = []
          this.selectCityOption.splice(this.selectCityOption.indexOf(key), 1)
          this.selectCityOption.forEach(item => {
            this.addForm.city.push(item.split(','))
          })
          break
        case 2:
          this.addForm.jobGrade.splice(this.addForm.jobGrade.indexOf(key), 1)
          this.selectJobGradeOption.splice(this.selectJobGradeOption.indexOf(key), 1)
          break
        case 3:
          this.addForm.industry.splice(this.addForm.industry.indexOf(key), 1)
          this.selectIndustryOption.splice(this.selectIndustryOption.indexOf(key), 1)
          break
        case 4:
          this.addForm.company.splice(this.addForm.company.indexOf(key), 1)
          this.selectCompanyOption.splice(this.selectCompanyOption.indexOf(key), 1)
          break
        case 5:
          this.addForm.major.splice(this.addForm.major.indexOf(key), 1)
          this.selectMajorOption.splice(this.selectMajorOption.indexOf(key), 1)
          break
        default:
          break
      }
    },
    // 获得专家列表
    getExpertList: async function () {
      const { data: res } = await this.$http.post('/expertExtractionController/expertExtraction', {
        cityList: this.selectCityOption,
        jobGradeList: this.addForm.jobGrade,
        industryList: this.addForm.industry,
        companyList: this.addForm.company,
        majorList: this.addForm.major,
        ...this.queryInfo
      })
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
    handleSelectionChange(val) {
      if (this.addForm.extractType !== '3' && val.length <= this.projectForm.extractNum) {
        this.multipleSelection = val
      } else if (this.addForm.extractType === '3' && val.length <= this.projectForm.moreExtNum) {
        this.multipleSelection = val
      } else {
        const row = val.pop()
        this.$refs.multipleTable.toggleRowSelection(row, false)
        this.$message.error('抽取次数不足')
      }
    },
    selectAll(val) {
      if (this.addForm.extractType !== '3' && val.length <= this.projectForm.extractNum) {
        this.multipleSelection = val
      } else if (this.addForm.extractType === '3' && val.length <= this.projectForm.moreExtNum) {
        this.multipleSelection = val
      } else {
        this.$refs.multipleTable.clearSelection()
        this.$message.error('抽取次数不足,不可全选')
      }
    },
    extractTypeChange() {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    getRowKey (row) {
      return row.expertId
    },
    extract: async function () {
      if ((this.addForm.extractType === '2' ? this.projectForm.extractNum : this.projectForm.moreExtNum) > this.total) {
        this.$message.warning('因专家数量不足，只抽取了' + this.total + '位专家')
      }
      const { data: res } = await this.$http.post('/expertExtractionController/expertExtractionByRandom', {
        cityList: this.selectCityOption,
        jobGradeList: this.addForm.jobGrade,
        industryList: this.addForm.industry,
        companyList: this.addForm.company,
        majorList: this.addForm.major,
        num: this.addForm.extractType === '2' ? this.projectForm.extractNum : this.projectForm.moreExtNum
      })
      if (res.code !== 200) return this.$message.error('抽取失败')
      this.resultList = res.data
      const data = []
      this.resultList.forEach(item => {
        data.push({
          key: item.expertId,
          label: item.name
        })
      })
      this.resultData = data
      this.activeIndex = '3'
    },
    async showMessageDialog () {
      if (this.addForm.result.length === 0) {
        return this.$message.error('未选择发送对象')
      }
      this.messageDialogVisible = true
      const { data: res } = await this.$http.get('/commonSystemMessageController/selectAll')
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.systemMessageList = res.data
    },
    MessageDialogClosed () {
      // 重置表单
      this.messageForm.messageId = ''
      this.$refs.messageFormRef.resetFields()
    },
    async messageChange () {
      const { data: res } = await this.$http.get('/commonSystemMessageController/selectById/' + this.messageForm.messageId)
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.messageForm = res.data
    },
    sendSms () {
      this.$refs.messageFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('修改格式')
        }
        this.sendSms2()
      })
    },
    sendSms2() {
      this.fullscreenLoading = true
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.projectForm.projectId = this.addForm.projectId
        const { data: res } = await this.$http.put('/commonProjectInfoController/updateById', this.projectForm)
        const { data: res2 } = await this.$http.post('/expertExtractionController/sendSms', {
          expertInfo: this.resultList.length === 0 ? this.multipleSelection : this.resultList,
          projectInfo: this.projectForm,
          type: this.addForm.extractType,
          sendId: this.addForm.result,
          sendText: this.messageForm.mesInfo
        })
        if (res.code !== 200) {
          return this.$message.error('更新失败')
        }
        if (res2.code !== 200) {
          return this.$message.error('发送失败')
        }
        this.$message.success('抽取完成')
        this.fullscreenLoading = false
        await this.$router.push({ name: 'resultInfo', params: { resultId: res2.data } })
        window.sessionStorage.setItem('activePath', '/resultInfo')
      })
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
    margin-right: 100px;
  }
.projectForm {
  padding-left: 225px;
  border-left:1px solid gainsboro;
  border-right:1px solid gainsboro ;
  padding-right: 225px;
}
  .chooseInfo{
    .el-form-item{
      display: inline-block;
      margin-right: 50px;
    }
  }
</style>
