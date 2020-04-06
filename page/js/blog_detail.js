// var util = require('./utile')
var util = new Vue();
util.getLocalTime = function(nS) {     
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
 }
 util.initComment = function(){
    document.getElementById('comment_reply').value=-1;
    document.getElementById('comment_reply_name').value='0';
    document.getElementById('comment_name').value='';
    document.getElementById('comment_email').value='';
    document.getElementById('comment_content').value='';
    document.getElementById('comment_code').value='';
 }
var blogDetail = new Vue({
    el: '#blogDetail',
    data: {
        title: '',
        content: '',
        ctime: '',
        tags: '',
        views: ''
    },
    computed: {

    },
    created() {
        var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
        if (searchUrlParams == '') {
            return;
        }
        var bid = -1;
        for (var i = 0; i < searchUrlParams.length; i++) {
            if (searchUrlParams[i].split('=')[0] == 'bid') {
                try {
                    bid = parseInt(searchUrlParams[i].split('=')[1])
                } catch (error) {
                    console.log(error)
                }
            }
        }

        axios({
            method: 'get',
            url: '/queryBlogById?bid=' + bid
        }).then(function (res) {
            blogDetail.title = res.data[0].title;
            blogDetail.content = res.data[0].content;
            blogDetail.tags = res.data[0].tags;
            blogDetail.ctime = util.getLocalTime(res.data[0].ctime) ;
            blogDetail.views = res.data[0].views;
        }).catch(function (res) {
            console.log(res);
        })
    },
    
})
var sendComments = new Vue({
    el: '#sendComments',
    data: {
        vcode: '',
        rightcode: ''
    },
    computed: {
        changeVcode: function () {
            return function () {
                axios({
                    method: 'get',
                    url: '/queryRandomCode'
                }).then((res) => {
                    sendComments.vcode = res.data.data
                    sendComments.rightcode = res.data.text;
                })
            }
        },
        submitComment: function () {
            return function () {
                var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
                if (searchUrlParams == '') {
                    return;
                }
                var bid = -1;
                for (var i = 0; i < searchUrlParams.length; i++) {
                    if (searchUrlParams[i].split('=')[0] == 'bid') {
                        try {
                            bid = parseInt(searchUrlParams[i].split('=')[1])
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
                var reply = document.getElementById('comment_reply').value;
                var replyName = document.getElementById('comment_reply_name').value;
                var name = document.getElementById('comment_name').value;
                var email = document.getElementById('comment_email').value;
                var content = document.getElementById('comment_content').value;
                var code = document.getElementById('comment_code').value;
                if (name == '') {
                    alert('请输入姓名');
                    return;
                }
                if (email == '') {
                    alert('请输入email');
                    return;
                }
                if (content == '') {
                    alert('请输入内容');
                    return;
                }
                if (code != sendComments.rightcode) {
                    alert('验证码错误');
                    return;
                }
                axios({
                    method: 'get',
                    url: '/addComment?bid=' + bid + '&parent=' + reply + '&parentName=' + replyName + '&userName=' + name + '&email=' + email + '&content=' + content
                }).then(function (res) {
                    alert('提交成功');
                    util.initComment();
                    blogComments.searchComment()
                }).catch(function (res) {
                    console.log(res);
                })

            }
        }
    },
    methods: {

    },
    created() {
        this.changeVcode();
        // axios({
        //     method:'get',
        //     url:'/queryRandomCode'
        // }).then((res)=>{
        //     console.log(res);
        //     sendComments.vcode = res.data.data
        // })
    }
})
var blogComments = new Vue({
    el: '#blogComments',
    data: {
        totle: 0,
        comments: [{
            id: 1,
            name: 'lsc',
            ctime: 'ssss',
            content: 'ddddddd',
            options: 'sdasda'
        }],
    },
    methods:{
        searchComment(){
            var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
            if (searchUrlParams == '') {
                return;
            }
            var bid = -10;
            for (var i = 0; i < searchUrlParams.length; i++) {
                if (searchUrlParams[i].split('=')[0] == 'bid') {
                    try {
                        bid = parseInt(searchUrlParams[i].split('=')[1])
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            axios({
                method: 'get',
                url: '/queryCommentsByBlogId?bid=' + bid
            }).then((res) => {
                console.log(res.data);
                var arr = [];
                for(let i=0 ; i<res.data.length;i++){
                    var obj = {}
                    var el = res.data[i]
                    obj.id = el.id;
                    obj.name = el.user_name
                    obj.ctime =  util.getLocalTime(el.ctime)
                    obj.content = el.comments
                    if(el.parent>-1){
                        obj.options ='回复@'+ el.parent_name+':'
                    }else{
                        obj.options =  ''
                    }
                   
                    arr.push(obj)
                }
                this.comments = arr;
               
            })
        }
    },
    computed: {
        getTotle(){
            return this.comments.length
        },
        reply:function(){
            return function(commentId,userName){
                    document.getElementById("comment_reply").value = commentId;
                    document.getElementById("comment_reply_name").value = userName;
                    // location.href = '#send_comment'
                    window.scrollTo(0,1000)
            }
        }
    },
    created() {
        this.searchComment()
    }
})