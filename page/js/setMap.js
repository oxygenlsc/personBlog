var blogList = new Vue({
    el:'#blogList',
    data:{
        blogList:[]
    },
    computed:{

    },
    created(){
       axios({
           method:'get',
           url:'/getAllBlog'
       }).then((res)=>{
            console.log(res);
            blogList.blogList = res.data
       })
    }
})