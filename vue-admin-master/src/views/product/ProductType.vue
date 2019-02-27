<template id="productType">
    <el-row style="height: 100%;border: 1px solid rebeccapurple;margin-top: 10px">
        <el-col :span="6" style="border-right: 1px solid rebeccapurple; min-height:500px;">
            <div class="grid-content bg-purple">
                <el-tree :data="productTypes" :props="defaultProps" @node-contextmenu="openContextMenu" @node-click="handleNodeClick">
                </el-tree>
            </div>
        </el-col>
        <el-col :span="17" style="margin-left: 10px;padding-top: 10px">
            <div>
                <el-form>
                    <el-form-item label="活动名称">
                        <el-input style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="活动名称">
                        <el-input style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="活动名称">
                        <el-input style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="活动名称">
                        <el-input style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="活动名称">
                        <el-input style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div v-show = "menuVisible">
                <ul id = "menu">
                    <li tabindex="-1" class="menu__item" id="menu-4994-1-0">Axure Components</li>
                    <li tabindex="-1" class="menu__item" id="menu-4994-1-1">Sketch Templates</li>
                    <li tabindex="-1" class="menu__item" id="menu-4994-1-2">组件交互文档</li>
                </ul>
            </div>
        </el-col>
    </el-row>
</template>
<style>
    .el-row {
        margin-bottom: 20px;
        height: 100%;
    }
    :last-child {
        margin-bottom: 0;
    }
    #productType el-col {
        border: 1px solid red;
        border-radius: 4px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>

<script>
    export default {
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                menuVisible:false,
                productTypes:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods:{
            onSubmit() {
                console.log('submit!');
            },
            openContextMenu(event,object,value,element){
                if(value.level == 1){
                    this.menuVisible = true;
                    let menu = document.querySelector("#menu");
                    /* 菜单定位基于鼠标点击位置 */
                    menu.style.left = event.clientX + 20 + "px" ;
                    menu.style.top = event.clientY -10 + "px";
                }
                console.log("右键被点击的event:",event);
                console.log("右键被点击的object:",object);
                console.log("右键被点击的value:",value);
                console.log("右键被点击的element:",element);
            },
            getTreeData(){
                console.log(this);
                this.$http.get("/product/productType/treeData")
                    .then(res=>{
                            console.log(this);
                            this.productTypes = res.data;
                        });

                // 这有什么区别呢??????
                // function (res) {
                //     console.log(this);
                //     this.productTypes = res.data;
                // }
            }
        },
        mounted(){
            //对productTypes数据赋值
            console.log(this);
           this.getTreeData();
        }
    };
</script>