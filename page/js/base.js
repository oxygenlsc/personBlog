var randomTag = new Vue({
    el:'#RandomTag',
    data:{
        tags:['more...']
    },
    methods:{
        getRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        },
      randArr(arr) {
            for (var i = 0; i < arr.length; i++) {
                var iRand = parseInt(arr.length * Math.random());
                var temp = arr[i];
                arr[i] = arr[iRand];
                arr[iRand] = temp;
            }
            return arr;
        }
    },
    computed:{
        randomColor:function(){
            return function(){
                var r =this.getRandom(50,255);
                var g = this.getRandom(50,255);
                var b = this.getRandom(50,255);
                return `rgba(${r},${g},${b})`
            }
          
        },
        randomSize:function(){
            return function(){
                return this.getRandom(15,30)+'px'
            }
            
        }
    },
    created(){
       
        axios({
            method: 'get',
            url: '/queryAllTag'
        }).then(function (resp) {
            console.log(resp.data)
            var arr = [];
            for (let i = 0; i <  resp.data.length; i++) {
                arr.push(resp.data[i].tag);
            }
            randomTag.tags = randomTag.randArr(arr);
           
        }).catch(function (resp) {
            console.log('请求失败')
        })
    }
})
var newHot = new Vue({
    el:'#new_hot',
    data:{
        titleList:[]
         
    },
    created(){
        axios({
            method:'get',
            url:'/queryHotBlog?size=6'
        }).then((res)=>{
            console.log(res.data);
            var arr = [];
            for(let i =0;i<res.data.length;i++){
                var obj = {};
                var el = res.data[i];
                obj.title = el.title
                obj.link = 'blog_detail.html?bid='+el.id
                arr.push(obj)
            }
            newHot.titleList =arr
        })
        
    }
})
var newComments = new Vue({
    el:'#new_comment',
    data:{
        commentList:[{
            name:'这里是用户名',
            date:'2018-10-10',
            comment:'bababababababa'
        },{
            name:'这里是用户名',
            date:'2018-10-10',
            comment:'bababababababa'
        }]
    },
    created(){
        axios({
            method:'get',
            url:'/getNewComments'
        }).then((res)=>{
            console.log(res.data);
            var arr = [];
            for(let i =0;i<res.data.length;i++){
                var obj = {};
                var el = res.data[i];
                obj.name = el.user_name
                obj.comment = el.comments
                obj.date = new Date(parseInt(el.ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
                arr.push(obj)
            }
            newComments.commentList =arr
        })
    }
})