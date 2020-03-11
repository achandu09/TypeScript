"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_pug_1 = __importDefault(require("koa-pug"));
const router_1 = __importDefault(require("@koa/router"));
const lowdb_1 = __importDefault(require("lowdb"));
const Filesync_1 = __importDefault(require("lowdb/adapters/Filesync"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const app = new koa_1.default();
new koa_pug_1.default({
    viewPath: './res/views',
    basedir: './res/views',
    app: app
});
const adapters = new Filesync_1.default('./res/db.json');
const adapters1 = new Filesync_1.default('./res/db1.json');
const mydb = new lowdb_1.default(adapters);
const mydb1 = new lowdb_1.default(adapters1);
const router = new router_1.default();
router.get('/sample', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (JSON.stringify(ctx.cookies.get("user")) == undefined) {
        //console.log("hello")
        yield ctx.redirect('/');
    }
    else {
        var contact1 = mydb1.get(`${ctx.cookies.get("user")}`).value();
        var shared = mydb1.get(`shared`).value();
        var contacts = {
            contact1,
            shared
        };
        //console.log("hello1")
        yield ctx.render('sample', { contacts });
    }
}));
router.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.render('index');
}));
router.post('/del/shared/:num', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('Successful')
    //`${ctx.cookies.get("user")}`
    mydb1.get("shared").remove({ phone: `${ctx.params.num}` }).write();
    yield ctx.redirect("/sample");
}));
router.post('/del/user/:num', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('Successful')
    mydb1.get(`${ctx.cookies.get("user")}`).remove({ phone: `${ctx.params.num}` }).write();
    yield ctx.redirect("/sample");
}));
router.post('/add/user', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = mydb1.get(`${ctx.cookies.get("user")}`).value();
    contacts.push(Object.assign({}, ctx.request.body));
    yield ctx.redirect('/sample');
}));
router.post('/add/shared', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const shared = mydb1.get("shared").value();
    shared.push(Object.assign({}, ctx.request.body));
    yield ctx.redirect('/sample');
}));
router.post('/logout', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.cookies.set("user", "");
    console.log("LoggedOut");
    yield ctx.redirect('/');
}));
router.post('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userl = mydb.get("users").value();
    const uname = ctx.request.body.name;
    const upass = ctx.request.body.pass;
    var flag = false;
    //console.log(JSON.stringify(uname))
    for (var i = 0; i < userl.length; i++) {
        //console.log(JSON.stringify(userl[i].name))
        if ((JSON.stringify(uname) == JSON.stringify(userl[i].name)) && (JSON.stringify(upass) == JSON.stringify(userl[i].pass))) {
            //console.log("working")
            flag = true;
            break;
        }
    }
    if (flag) {
        ctx.cookies.set("user", `con${uname}`);
        yield ctx.redirect("/sample");
    }
    if (!flag) {
        yield ctx.redirect('/');
    }
}));
app.use(koa_bodyparser_1.default());
app.use(router.routes());
const PORT = 3001;
app.listen(PORT, () => {
    console.log("server started at " + PORT);
});
//# sourceMappingURL=index.js.map