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
 export default util