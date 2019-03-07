<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProducts">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="managerViewProperties">显示属性管理</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="managerSkuProperties">SKU属性管理</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">上架</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">下架</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="products" highlight-current-row v-loading="listLoading"
                  @row-click="rowClick" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" :show-overflow-tooltip="true" label="标题" width="180" sortable>
            </el-table-column>
            <el-table-column prop="subName" :show-overflow-tooltip="true" label="副标题" width="200" sortable>
            </el-table-column>
            <el-table-column prop="onSaleTime" label="上架时间" width="200" sortable>
            </el-table-column>
            <el-table-column prop="offSaleTimeStr" label="下架时间" width="200" sortable>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="200" :formatter="formatState" sortable>
                <!--<template slot-scope="scope">
                    <el-popover placement="top">


                        <div v-if="scope.row.state ==1" slot="reference" class="name-wrapper">
                            <el-tag size="medium" class="stateStyle">上架</el-tag>
                        </div>
                        <div v-else-if="scope.row.state ==0" slot="reference" class="name-wrapper">
                            <el-tag size="medium">下架</el-tag>
                        </div>
                    </el-popover>
                </template>-->
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
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑/添加界面-->
        <el-dialog title="编辑" v-model="formVisible" :close-on-click-modal="false">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="标题" prop="name">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="副标题" prop="subName">
                    <el-input v-model="form.subName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="productTypeId">
                    <!-- <el-input v-model="form.productTypeId" auto-complete="off"></el-input>-->
                    <select-tree width="200" :options="productTypes" v-model="form.productTypeId"/>
                </el-form-item>
                <el-form-item label="品牌" prop="brandId">
                    <el-select v-model="form.brandId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in brands"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>

                    <!-- <el-input v-model="form.brandId" auto-complete="off"></el-input>-->
                </el-form-item>
                <el-form-item label="简介" prop="productExt.description">
                    <el-input v-model="form.productExt.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="详情" prop="productExt.richContent">
                    <div class="edit_container">
                        <quill-editor v-model="form.productExt.richContent" ref="myQuillEditor" class="editer"
                                      :options="editorOption" @ready="onEditorReady($event)"></quill-editor>
                    </div>
                    <!-- <el-input v-model="form.productExt.richContent" auto-complete="off"></el-input>-->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--显示属性的dialog-->
        <el-dialog title="编辑" v-model="viewPropertiesVisible" :close-on-click-modal="false">
            <!--viewProperties:数一个数组-->
            <el-card class="box-card">
                <div v-for="p in viewProperties" :key="p" class="text item">
                    {{ p.specName }}:
                    <el-input v-model="p.value" auto-complete="off"></el-input>
                </div>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="viewPropertiesVisible = false">取消</el-button>
                <el-button type="primary" @click.native="viewPropertiesSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--sku属性的dialog-->
        <el-dialog title="编辑" v-model="skuPropertiesVisible" :close-on-click-modal="false">
            <el-card class="box-card">
                <div v-for="p in skuProperties" :key="p" class="text item">
                    {{ p.specName }}:
                    <!--sku的值的输入框的多少是根据你的值的多少来显示的:
                      后台的属性字段中有一个skuValues的字段:是一个字符串的数组
                      p.skuValues
                      i in 3====>3

                    -->
                    <div v-for="i in p.skuValues.length+1" :key="i">
                        <el-input v-model="p.skuValues[i-1]" auto-complete="off" style="width: 80%"></el-input>
                        <!--splice(i-1,1):数组的移除:
                            　splice(index,len,[item])    注释：该方法会改变原始数组。
                            splice有3个参数，它也可以用来替换/删除/添加数组内某一个或者几个值
                            index:数组开始下标        len: 替换/删除的长度       item:替换的值，删除操作的话 item为空
                          -->
                        <el-button type="primary" @click="p.skuValues.splice(i-1,1)" :loading="editLoading">删除
                        </el-button>
                    </div>
                </div>
            </el-card>
            <!--table-->
            <el-table
                    :data="skuDatas"
                    style="width: 100%" >
                <div v-for="(col,index) in cols">
                    <!--有多少个:cols-->
                    <el-table-column
                            :prop="col.prop"
                            :label="col.label"
                            width="180">
                    </el-table-column>
                </div>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="skuPropertiesVisible = false">取消</el-button>
                <el-button type="primary" @click.native="skuPropertiesSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>

</template>

<script>
    import SelectTree from '@/components/SelectTree.vue';
    import {quillEditor} from "vue-quill-editor"; //调用编辑器
    import "quill/dist/quill.core.css"
    import "quill/dist/quill.snow.css"
    import "quill/dist/quill.bubble.css"

    export default {
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        components: {
            SelectTree, quillEditor
        },
        data() { //数据
            return {
                brands: [],
                filters: {
                    keyword: ''
                },
                editorOption: {},
                products: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                fileList2: [],
                formVisible: false,//编辑界面是否显示
                editLoading: false,
                formRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                staticIp: "http://172.16.7.150",
                //编辑界面数据:定义模型
                form: {
                    name: '',
                    subName: '',
                    brandId: '',
                    productTypeId: '',
                    productExt: {"description": "", "richContent": ""}
                },
                // 默认选中值
                selected: 'A',
                // 数据默认字段
                defaultProps: {
                    parent: 'pid',   // 父级唯一标识
                    value: 'id',          // 唯一标识
                    label: 'name',       // 标签显示
                    children: 'children', // 子级
                },
                // 数据列表
                productTypes: [],
                viewPropertiesVisible: false,//显示属性的dialog默认是关闭
                viewProperties: [],//显示属性对象数组  数组转换为后台的list
                skuPropertiesVisible: false,//sku属性的dialog默认是关闭
                skuProperties: [],//sku属性数组
                skuDatas: [],//sku的属性
                cols:[],//table的头的数组
                currentRow: null //选中行,默认是null
            }
        },
        watch: {
            skuProperties: {
                handler(curVal,oldVal){
                    console.debug("222222222222222222222222")
                    var pp = this.skuProperties.reduce((pre,cur)=>{
                        const r =[];//返回的数组
                        pre.forEach(p1=>{
                            cur.skuValues.forEach(c1=>{
                                // c1: 就是单个的值: yellow,或者green
                                const obj ={};//
                                Object.assign(obj,p1);
                                // obj.name="zs";
                                // obj ={"颜色":"yellow"}
                                // specName
                                obj[cur.specName]=c1;
                                r.push(obj);
                            })
                        })
                        return r;
                    },[{}]);

                    this.skuDatas =pp;
                    // skuDatas = [{"颜色":"yellow","尺寸":6},{"颜色":"yellow","尺寸":9}]
                    // skuDatas = [{"颜色":"yellow","尺寸":6,"price":""},{"颜色":"yellow","尺寸":9,"price":""}]
                   //增加额外的sku的属性:
                    this.skuDatas.forEach(item=>{
                        // {"颜色":"yellow","尺寸":6}
                        item['price']="";
                        item['availableStock']="";
                    });


                    //table的头的处理:
                    let header =[];
                    var skuData1 = this.skuDatas[0];

                    //  ["颜色", "尺寸", "price", "availableStock"]
                    var hh = Object.keys(skuData1);
                    hh.forEach(
                        h=>{
                            //prop="date"
                            //label="日期"
                            // "颜色"
                            let value = h;
                            if(h=='price'){
                                value="价格"
                            }else if(h=='availableStock'){
                                value="可用库存";
                            }
                            let col =  {"label":value,"prop":h};
                            this.cols.push(col);
                        }
                    );

                },
                deep:true
            }
        },
        methods: { //方法\
            managerSkuProperties: function () {
                //1:选中行的判断 row-click	当某一行被点击时会触发该事件	row, column, event
                if (this.currentRow) {
                    //有值
                    //2:点击显示属性按钮-->弹出一个dialog
                    this.skuPropertiesVisible = true;//弹出dialog
                    let productTypeId = this.currentRow.productTypeId;
                    //3:获取到当前产品类型的显示属性:发送axios
                    // http://localhost:9527/aigou/product/product/viewProperties/3
                    let skuPropertiesUrl = "/product/product/skuProperties/" + productTypeId;
                    this.$http.get(skuPropertiesUrl).then(res => {
                        //直接把返回的数据,赋予给页面的有一个变量:
                        this.skuProperties = res.data;
                        console.debug(this.skuProperties);
                    })
                } else {
                    //没有选中:给一个提示,并返回
                    this.$message({
                        message: '请选中需要设置的一行数据!',
                        type: 'warning'
                    });
                    return;
                }
            },
            skuPropertiesSubmit: function () {
                //sku属性保存
            },
            //显示属性的提交:
            viewPropertiesSubmit: function () {
                //后台发送一个请求:关键是我要得到viewProperties
                // 把这个存到t_product_ext表的一个viewProperties,需要根据productId进行过滤:
                let productId = this.currentRow.id;
                let params = {"productId": productId, "viewProperties": this.viewProperties};
                this.$http.post("/product/product/viewProperties", params).then(res => {
                    //判断res的success:
                    if (res.data.success) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.viewPropertiesVisible = false;//关闭dialog
                })

            },
            //点击行触发的事件:  row选中行
            rowClick(row, column, event) {
                //  把选中的行赋予给一个变量
                this.currentRow = row;
            },
            //显示属性的管理
            managerViewProperties() {
                //1:选中行的判断 row-click	当某一行被点击时会触发该事件	row, column, event
                if (this.currentRow) {
                    //有值
                    //2:点击显示属性按钮-->弹出一个dialog
                    this.viewPropertiesVisible = true;//弹出dialog
                    let productTypeId = this.currentRow.productTypeId;
                    let productId = this.currentRow.id;
                    //3:获取到当前产品类型的显示属性:发送axios
                    // http://localhost:9527/aigou/product/product/viewProperties/3
                    let viewPropertiesUrl = "/product/product/viewProperties/" + productTypeId + "/" + productId;
                    this.$http.get(viewPropertiesUrl).then(res => {
                        //直接把返回的数据,赋予给页面的有一个变量:
                        this.viewProperties = res.data;
                        console.debug(this.viewProperties);
                    })
                } else {
                    //没有选中:给一个提示,并返回
                    this.$message({
                        message: '请选中需要设置的一行数据!',
                        type: 'warning'
                    });
                    return;
                }

            },
            onEditorReady(editor) {
            },
            formatState: function (row, column) {
                return row.state === 1 ? '上架' : '下架'
            },
            handleSuccess(response, file, fileList) {
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
                if (file.response) {
                    // 打开新增--->图片的上传:先上传,不关闭这个页面,这个时候点击删除,就能获取到这个file的图片地址
                    filePath1 = file.response.object;
                }
                var filePath2 = file.lg;// url: ip:端口/group/fileName   lg:logo-->/group/fileName
                var filePath = "";
                if (filePath1) {
                    filePath = filePath1;
                } else if (filePath2) {
                    filePath = filePath2;
                }
                // filePath  = /group/sdlfjsdlf/
                this.$http.delete("/common/common/delete?filePath=" + filePath)
                    .then(res => {
                        console.debug("3333333333333")
                        console.debug(res)
                        if (res.data.success) {
                            this.$message({
                                message: '删除成功!',
                                type: 'success'
                            });
                        } else {
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
                this.getProducts();
            },
            //获取品牌的列表:
            getProducts() {
                //查询条件
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                //加载
                this.listLoading = true;
                //异步请求:
                this.$http.post("/product/product/json", para)
                    .then((res) => {
                        console.log(this);
                        this.total = res.data.total;
                        this.products = res.data.rows;
                        this.listLoading = false;
                    });
            },
            getBrands() {
                //加载
                this.listLoading = true;
                //异步请求:
                this.$http.get("/product/brand/list")
                    .then((res) => {
                        this.brands = res.data;
                        this.listLoading = false;
                    });
            },
            getProductTypes() {
                //加载
                this.listLoading = true;
                //异步请求:
                this.$http.get("/product/productType/treeData")
                    .then(res => {
                        this.listLoading = false;
                        this.productTypes = res.data;
                        console.debug(this.productTypes)
                    });
            },

            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let id = row.id;
                    this.$http.delete("/product/product/" + id)
                        .then((res) => {
                            let {msg, success, object} = res.data;
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
                                this.getProducts();
                            }
                        });
                }).catch(() => {
                });
            },
            //显示编辑界面
            uhandleEdit: function (index, row) {
                this.formVisible = true;
                //回显 要提交后台
                this.form = Object.assign({}, row);
                //回显缩略图
                // url: http://172.16.7.150/group1/M00/00/01/rBAHllx6l32AHfQtAAEu5hxxfm4554.jpg
                // fileList2:这里,在编辑的时候,把当前的logo值压入lg对象中,在删除的时候,可以获取
                this.fileList2.push({
                    "url": this.staticIp + row.logo,
                    "lg": row.logo
                })
            },

            //显示新增界面
            handleAdd: function () {
                this.formVisible = true;
                this.form = {
                    name: '',
                    subName: '',
                    brandId: '',
                    productTypeId: '',
                    productExt: {"description": "", "richContent": ""}
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
                            // axios: 全局路径: http://localhost:9527/aigou/product/product/save
                            this.$http.post("/product/product/save", para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['form'].resetFields();
                                this.formVisible = false;
                                //列表刷新
                                this.getProducts();
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
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProducts();
                    });
                }).catch(() => {

                });
            }
        }, // $(function()) 加载完毕后执行
        mounted() {
            this.getProducts();
            this.getBrands();
            this.getProductTypes();
        }
    }

</script>

<style scoped>
    .stateStyle {
        color: red;
    }

</style>