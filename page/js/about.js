var util = new Vue();
util.getLocalTime = function (nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
util.initComment = function () {
    document.getElementById('comment_reply').value = -1;
    document.getElementById('comment_reply_name').value = '0';
    document.getElementById('comment_name').value = '';
    document.getElementById('comment_email').value = '';
    document.getElementById('comment_content').value = '';
    document.getElementById('comment_code').value = '';
}
var aboutComments = new Vue({
    el: '#aboutComments',
    data: {
        page: 1,
        pageSize: 3,
        comments: [],
        count: 0,
        panelNumber: 4,
        barlist: [],
        totlepage: 1,
    },
    methods: {
        getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        },
        getMin(page) {
            let min = page - Math.floor(this.panelNumber / 2)
            if (min < 1) {
                min = 1
            }
            return min
        },
        getMax(allPagernumber) {
            let max = this.page + Math.floor(this.panelNumber / 2)
            if (max > allPagernumber) {
                max = allPagernumber
            }
            return max;
        },
        dealPageChange(type) {
            var newpage = this.page;
            if (type == 'first') {
                this.page = 1;
            } else if (type == 'former') {
                newpage = this.page - 1
                if (newpage <= 0) {
                    newpage = 1
                }
                // this.page = newpage;
            } else if (type == 'next') {
                newpage = this.page + 1
                console.log(this.page);
                if (newpage >= aboutComments.getTotlepage) {
                    newpage = aboutComments.getTotlepage
                }
                // this.page = newpage;
            } else {
                this.page = aboutComments.getTotlepage;
            }
            if (newpage == this.page) {
                return;
            }
            if (type == 'next' || type == 'former') {
                this.page = newpage;
            }
            aboutComments.barlist = aboutComments.generatePageTool
            this.searchComment(this.page, this.pageSize);
        },
        delMiddlePageChange(page) {
            if (this.page == page) {
                return;
            }
            this.page = page;
            aboutComments.barlist = aboutComments.generatePageTool
            this.searchComment(this.page, this.pageSize);
        },
        searchComment(page,pageSize) {
            var bid = -1;
            axios({
                method: 'get',
                url: '/queryCommentsByBlogIdForMe?page=' + page + '&pageSize=' + pageSize
            }).then((res) => {
                console.log(res.data);
                var arr = [];
                for (let i = 0; i < res.data.length; i++) {
                    var obj = {}
                    var el = res.data[i]
                    obj.id = el.id;
                    obj.name = el.user_name
                    obj.ctime = util.getLocalTime(el.ctime)
                    obj.content = el.comments
                    if (el.parent > -1) {
                        obj.options = '回复@' + el.parent_name + ':'
                    } else {
                        obj.options = ''
                    }
                    arr.push(obj)
                }
                this.comments = arr;
            })
            axios({
                method: "get",
                url: '/queryMyCount'
            }).then(function (res) {
                console.log(res.data[0].count);
                aboutComments.count = res.data[0].count
                aboutComments.barlist = aboutComments.generatePageTool
                aboutComments.totlepage = Math.ceil(aboutComments.count / aboutComments.pageSize);
            }).catch(function (res) {
                console.log('请求错误')
            })
        }

    },
    computed: {
        generatePageTool: function () {
            var pageSize = this.pageSize;
            var totleCount = this.count;
            var len = Math.ceil(totleCount / pageSize);
            var min = this.getMin(this.page);
            var max = this.getMax(len);
            var result = [];
            for (var i = min; i <= max; i++) {
                result.push({
                    text: i
                })
            }


            return result;

        },
        getTotlepage() {
            return Math.ceil(aboutComments.count / aboutComments.pageSize);
        },
        reply: function () {
            return function (commentId, userName) {
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName;
                // location.href = '#send_comment'
                window.scrollTo(0, 1000)
            }
        }
    },
    created() {
        this.searchComment(this.page, this.pageSize);
    }
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
                var bid = -1;
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