export const CODES = {
    ok: {code: 10000, message: '成功'},
    error: {code: 10001, message: '失败'},
    logout: {code: 20004, message: '无法获取登录信息'},
    imageType : {1 : 'logo', 2 : 'cover', 3 : 'content'},
    stauts:[{id: 1, name:"正常"}, {id:2, name:"禁用"}],
}

export const Numbers = {
    statusOk : 1,
    statusForbidden : 2,

    imageTypeLogo : 1,
    imageTypeCover : 2,
    imageTypeContent : 3,

    zero : 0,
    yes : 1,
    no : 2,

    one :1,
    two:2,
    three:3,

    all : 100000,

    authTypeDir :1,
    authTypeWeb :2,
    authTypeButton :3,
    authTypeUrl :4,

    errorNoLogin:10003,
    errorJwtError:10004,
    errorJwtExpired:10005,
    
}

export const CONFIG_DATA = {
    projectId : 1,

    authKey : "auths",
    autoKey : 'access_token',
    autoRefreshKey : 'refresh_token',
    authTypeMenu:1,
    authTypeData:2,

    //权限组
    authorityListId : "auth:list",              //权限列表
    authorityEditId : "auth:edit",              //权限编辑
    authorityDetailId : "auth:detail",          //权限详情
    authorityTitlesId : "auth:titles",          //权限下拉
    authorityStatusId : "auth:status",          //权限状态
    
    //公共
    publicProjectTitlesId: "project:sortList",  //项目下拉

    //角色组
    roleEdidId:"role:edit",                     //角色编辑
    roleStatusId:"role:status",                 //角色状态
    roleListId:"role:list",                     //角色列表
    roleDetailId:"role:detail",                 //角色详情
    roleAuthsTitleId:"role:auths",              //下拉所有角色
    roleDelId:"role:del",                       //角色删除

    //部门组
    departmentListId:"department:list",         //公司列表
    departmentEditId:"department:edit",         //公司编辑
    departmentStatusId:"department:status",     //公司状态
    departmentDetailId:"department:detail",     //公司详情

     //项目组
     projectListId:"project:list",              //项目列表
     projectDelId:"project:del",                //项目删除
     projectEditId:"project:edit",              //项目编辑
     projectStatusId:"project:status",          //项目状态
     projectDetailId:"project:detail",          //项目详情
     projectMemberId:"project:member",          //项目成员详情
     projectMemberEditId:"project:memberedit",  //项目成员编辑

     //管理员组
     adminSortListId:"admin:sortList",          //管理员下拉
     adminListId:"admin:list",                  //管理员列表
     adminEditId:"admin:edit",                  //管理员编辑
     adminStatusId:"admin:status",              //管理员状态
     adminDelId:"admin:del",                    //管理员删除， 普通管理员有权限
     adminComapnyId:"admin:company",            //管理员公司下拉，超级管理员有权限
     adminRoleId:"admin:role",                  //管理员角色
     adminDetailId:"admin:detail",              //管理员详情
     adminPasswordId : "admin:password",        //权限添加
     
     //日志
     logLoginId : "log:login",                  //登录日志
     logActionId : "log:action",                //操作日志
}
