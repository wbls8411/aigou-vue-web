<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBrands">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="brands" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="englishName" label="英文名" width="200" sortable>
			</el-table-column>
			<!--有点屌-->
			<el-table-column prop="productType.name" label="商品类型" width="180" sortable>
			</el-table-column>
			<el-table-column prop="description" label="描述"  min-width="250" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑/添加界面-->
		<el-dialog title="编辑" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="form" label-width="80px" :rules="formRules" ref="form">
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="英文名" prop="englishName">
					<el-input v-model="form.englishName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="logo" prop="logo">
					<!--upload上传的后台地址-->
					<el-upload
							class="upload-demo"
							action="http://127.0.0.1:9527/aigou/common/common/upload"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:file-list="fileList2"
							:on-success="handleSuccess"
							list-type="picture"
					       >
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="排序号" prop="sortIndex">
					<el-input v-model="form.sortIndex" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="productTypeId">
					<el-input v-model="form.productTypeId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="form.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	export default {
		data() { //数据
			return {
				filters: {
                    keyword: ''
				},
				brands: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
                fileList2: [],
				formVisible: false,//编辑界面是否显示
				editLoading: false,
				formRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				staticIp:"http://172.16.7.150",
				//编辑界面数据
				form: {
					id: 0,
					name: '',
					englishName: '',
					sortIndex: '',
					description: '',
					logo: '',
					productTypeId: 0
				}
			}
		},
		methods: { //方法\
            handleSuccess(response, file, fileList){
                console.debug("55555555555555555555555555555")
				// response   {"success":true,"msg":"上传成功","object":"/group1/M00/00/01/rBAHllx6oXWAKD5xAACIceIBrog280.jpg"}
                console.debug(response)
                console.debug("===============")
                console.debug(fileList)
                //上传成功回调
				this.form.logo = file.response.object;
			},
			// 上传文件的删除
            handleRemove(file, fileList) {
                console.debug("delete===============")
                console.debug(file);
                console.debug("delete=====88888888==========")
               console.debug(fileList);
                var filePath1;
                if(file.response){
                    // 打开新增--->图片的上传:先上传,不关闭这个页面,这个时候点击删除,就能获取到这个file的图片地址
                    filePath1=file.response.object;
				}
               var filePath2 =file.lg;// url: ip:端口/group/fileName   lg:logo-->/group/fileName
               var filePath="";
               if(filePath1){
                   filePath=filePath1;
			   }else if(filePath2){
                   filePath=filePath2;
			   }
			   // filePath  = /group/sdlfjsdlf/
                this.$http.delete("/common/common/delete?filePath="+filePath)
					.then(res=>{
                        console.debug("3333333333333")
					    console.debug(res)
					    if(res.data.success){
                            this.$message({
                                message: '删除成功!',
                                type: 'success'
                            });
						}else{
                            this.$message({
                                message: '删除失败!',
                                type: 'error'
                            });
						}
					})
            },
            handlePreview(file) {
                console.log(file);
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getBrands();
			},
			//获取品牌的列表:
            getBrands() {
                //查询条件
				let para = {
					page: this.page,
					keyword: this.filters.keyword
				};
				//加载
				this.listLoading = true;
				//异步请求:
				this.$http.post("/product/brand/json",para)
                    .then((res) => {
                        console.log(this);
                        this.total = res.data.total;
                        this.brands = res.data.rows;
                        this.listLoading = false;
                    });
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let id =  row.id ;
                    this.$http.delete("/product/brand/"+id)
                        .then((res) => {
                            let { msg, success, object } = res.data;
                            if (!success) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                this.listLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getBrands();
                            }
                        });
				}).catch(() => {
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.formVisible = true;
				//回显 要提交后台
				this.form = Object.assign({}, row);
				//回显缩略图
				// url: http://172.16.7.150/group1/M00/00/01/rBAHllx6l32AHfQtAAEu5hxxfm4554.jpg
				// fileList2:这里,在编辑的时候,把当前的logo值压入lg对象中,在删除的时候,可以获取
				this.fileList2.push({
					"url":this.staticIp+row.logo,
					"lg":row.logo
				})
			},
			//显示新增界面
			handleAdd: function () {
				this.formVisible = true;
				this.form = {
                    name: '',
                    englishName: '',
                    sortIndex: '',
                    description: '',
                    logo: '',
                    productTypeId: 0
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.form.validate((valid) => {
					if (valid) {
                        console.log(this.fileList2);
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.form);
							// axios: 全局路径: http://localhost:9527/aigou/product/brand/save
							this.$http.post("/product/brand/save",para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['form'].resetFields();
								this.formVisible = false;
								//列表刷新
								this.getBrands();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getBrands();
					});
				}).catch(() => {

				});
			}
		}, // $(function()) 加载完毕后执行
		mounted() {
			this.getBrands();
		}
	}

</script>

<style scoped>

</style>