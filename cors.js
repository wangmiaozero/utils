// cors.js (node端)
let express = require("express");
let app = express();
let whitList = ["http://localhost:8080"]; //设置白名单 因为我上面项目启动端口是8080
app.use(function(req, res, next) {
    let origin = req.headers.origin;
    if (whitList.includes(origin)) {
        // 设置哪个源可以访问我
        res.setHeader("Access-Control-Allow-Origin", origin);
        // 允许携带哪个头访问我
        res.setHeader("Access-Control-Allow-Headers", "sessionno");
        // 允许哪个方法访问我 可以设置*
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
        // 允许携带cookie
        res.setHeader("Access-Control-Allow-Credentials", true);
        // 预检的存活时间
        res.setHeader("Access-Control-Max-Age", 6);
        // 允许返回的头
        res.setHeader("Access-Control-Expose-Headers", "sessionno");
        if (req.method === "OPTIONS") {
            res.end(); // OPTIONS请求不做任何处理
        } else {
            next();
        }
    }
});
app.get("/say", (req, res) => {
    let { wd, callback } = req.query;
    console.log(wd);
    console.log(callback);
    res.setHeader("sessionno", "sakura"); //返回一个响应头，后台需设置
    res.end(`${callback}('hello world')`);
});

app.use(express.static(__dirname));
app.listen(3000);