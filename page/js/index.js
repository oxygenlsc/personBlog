var everyDay = new Vue({
    el: '#everyDay',
    data: {
        content: '',
        color: 'red'
    },
    methods: {
        getRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        },
    },
    computed: {
        getContent() {
            return this.content
        }

    },
    created() {

        axios({
            method: 'get',
            url: '/queryEveryDay'
        }).then(function (resp) {
            everyDay.content = resp.data.data[0].content;
            console.log(resp.data.data[0].content)

        }).catch(function (resp) {
            console.log('请求失败')
        })
        //请求数据向content赋值

        setInterval(function () {
            var r = everyDay.getRandom(50, 255)
            var g = everyDay.getRandom(50, 255)
            var b = everyDay.getRandom(50, 255)
            everyDay.color = `rgb(${r},${g},${b})`
            // console.log(everyDay.color)
        }, 3000)
    }
})

var articleList = new Vue({
    el: '#articleList',
    data: {
        page: 1,
        pageSize: 5,
        count: 100,
        panelNumber: 4,
        barlist: [],
        articleList: [],
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
                if (newpage >= articleList.getTotlepage) {
                    newpage = articleList.getTotlepage
                }
                // this.page = newpage;
            } else {
                this.page = articleList.getTotlepage;
            }
            if (newpage == this.page) {
                return;
            }
            if (type == 'next' || type == 'former') {
                this.page = newpage;
            }
            articleList.barlist = articleList.generatePageTool
            this.getPage(this.page, this.pageSize);
        },
        delMiddlePageChange(page) {
            if (this.page == page) {
                return;
            }
            this.page = page;
            articleList.barlist = articleList.generatePageTool
            this.getPage(this.page, this.pageSize);
        }
    },
    computed: {
        getPage: function () {
            return function (page, pageSize) {
                var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';
                var tag =  searchUrlParams[0]&&searchUrlParams[0].split('=')
                if (!tag) {
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
                        method: "get",
                        url: '/queryBlogByPage?page=' + (page - 1) + '&pageSize=' + pageSize
                    }).then(function (res) {
                        console.log(res.data.data);
                        var list = res.data.data;
                        var temp = [];
                        for (let i = 0; i < list.length; i++) {
                            var obj = {};
                            obj.title = list[i].title;
                            obj.content = decodeURI(list[i].content);
                            obj.date = articleList.getLocalTime(list[i].ctime);
                            obj.views = list[i].views;
                            obj.tags = list[i].tags;
                            obj.id = list[i].id;
                            obj.link = '/blog_detail.html?bid=' + list[i].id;
                            temp.push(obj)
                        }
                        articleList.articleList = temp;
                    }).catch(function (res) {
                        console.log('请求错误')
                    })
                    axios({
                        method: "get",
                        url: '/queryBlogCount'
                    }).then(function (res) {
                        console.log(res.data.count[0].count);
                        articleList.count = res.data.count[0].count
                        articleList.barlist = articleList.generatePageTool
                        articleList.totlepage = Math.ceil(articleList.count / articleList.pageSize);
                    }).catch(function (res) {
                        console.log('请求错误')
                    })

                } else if(tag[0] == 'tag'){
                    axios({
                        method:'get',
                        url:'/getBlogByTagName?page=' + (page - 1) + '&pageSize=' + pageSize+'&tag='+tag[1]
                    }).then((res)=>{
                        console.log(res);
                        // console.log(res.data.data);
                        var list = res.data;
                        var temp = [];
                        for (let i = 0; i < list.length; i++) {
                            var obj = {};
                            obj.title = list[i].title;
                            obj.content = list[i].content;
                            obj.date = articleList.getLocalTime(list[i].ctime);
                            obj.views = list[i].views;
                            obj.tags = list[i].tags;
                            obj.id = list[i].id;
                            obj.link = '/blog_detail.html?bid=' + list[i].id;
                            temp.push(obj)
                        }
                        articleList.articleList = temp;
                    })
                    axios({
                        method: "get",
                        url: '/queryBlogByTagCount?tag='+tag[1]
                    }).then(function (res) {
                        console.log(res.data[0].count);
                        articleList.count = res.data[0].count
                        articleList.barlist = articleList.generatePageTool
                        articleList.totlepage = Math.ceil(articleList.count / articleList.pageSize);
                    }).catch(function (res) {
                        console.log(res)
                    })
                }

            }
        },
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
            return Math.ceil(articleList.count / articleList.pageSize);
        }
    },
    created() {
        this.getPage(this.page, this.pageSize);
    }
})