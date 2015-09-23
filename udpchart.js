/**
 * Created by mac on 15/4/24.
 */

/**
 * 这个是实现nodejs udp聊天的例子
 * */
var dgram = require("dgram");

/*
 * 目标IP
 * */
var HOST='192.168.2.110';

/*目标端口*/
var PORT=3000;

function input(x,msg){
    process.stdout.write(x);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (chunk) {
        /*必须用对象方式传递引用*/
        msg.val=chunk;
    });
    process.stdin.resume();
}

/* 创建发送数据message */
var message = '** conneting '+HOST+' \n请输入消息：\n';

/*消息对象，javascript的奇葩设定，必须用对象方式才能传递引用*/
var _msg = {val:''};

/* 创建udp4 socket对象 */
var client = dgram.createSocket("udp4");
setInterval(function(){
    if(message){
        console.log('YOUR-MESAG '+Date().substring(16,25)+" SET:\n\t"+message+'\n');
        message=new Buffer(message);
        client.send(message, 0, message.length, PORT, HOST);
        message=null;
        input('',_msg);
    }else{
        message = _msg.val;
        _msg.val='';
    }
},100);

/*
 * 服务端内容
 * */
var server = dgram.createSocket("udp4");
/* 监听message消息事件 */
server.on("message", function (msg, rinfo) {
    console.log('PORT-'+rinfo.port+' '+Date().substring(16,25)+" GET:\n\t" + msg+'\n');
});

/* 监听listening事件 */
server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});

server.bind(PORT);

