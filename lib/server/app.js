import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import service from "../service";
import getpwd from "../user/username";
import session from "express-session";
import path from "path";
import ejs from "ejs";
const app = express();
app.set('views', path.join(__dirname, 'views'));

app.set("view engine", "ejs");
app.use(session({
    secret: 'keyboard cat', // 建议使用 128 个字符的随机字符串
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
 app.use(function(req, res, next) {
    if (!req.session.user) {
        if (req.url === "/login") {
            next();// 如果请求的地址是登录则通过，进行下一个请求
        } else {
            res.redirect('/login');
        }
    } else if (req.session.user) {
        next();
    }
});
app.get('/login', function(req, res) {
    res.render("login", {errMsg: '' });
});
app.post("/login", getpwds);
async function getpwds(req, res) {
    let flag = await getpwd(req.body.username, req.body.password);
    if (flag) {
        var user = {'username': req.body.username};
        req.session.user = user;
        res.redirect('/realtime');
    }
    else
    {
        res.render('login', {errMsg: '用户名或者密码错误' });
    }
} 

app.use(express.static("public", {
    extensions: ['html', 'htm']
}));

app.use(service);
app.all("/", (req, res, next) => {
    res.redirect('/');
    next();
});

export default app;
