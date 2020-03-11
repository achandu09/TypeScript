import Koa from 'koa'
import Pug from 'koa-pug'
import Router from '@koa/router'
import db from 'lowdb'
import Filesync from 'lowdb/adapters/Filesync'
import bodyparser from 'koa-bodyparser'
import e from 'express'
const app=new Koa()
new Pug({
    viewPath:'./res/views',
    basedir:'./res/views',
    app:app
})

const adapters = new Filesync('./res/db.json')
const adapters1 = new Filesync('./res/db1.json')
const mydb=new db(adapters)
const mydb1=new db(adapters1)
const router = new Router()
router.get('/sample',async (ctx)=>{
    if(JSON.stringify(ctx.cookies.get("user"))==undefined){
        //console.log("hello")
        await ctx.redirect('/')
    }
    else{
    var contact1=mydb1.get(`${ctx.cookies.get("user")}`).value()
    var shared=mydb1.get(`shared`).value()
    var contacts={
        contact1,
        shared
    }
    //console.log("hello1")
    await ctx.render('sample',{contacts})
}
})

router.get('/', async ctx=>{
    await ctx.render('index')
})
router.post('/del/shared/:num',async ctx=>{
    //console.log('Successful')
    //`${ctx.cookies.get("user")}`
    mydb1.get("shared").remove({phone: `${ctx.params.num}`}).write()
    await ctx.redirect("/sample")
})
router.post('/del/user/:num',async ctx=>{
    //console.log('Successful')
    mydb1.get(`${ctx.cookies.get("user")}`).remove({phone: `${ctx.params.num}`}).write()
    await ctx.redirect("/sample")
})
router.post('/add/user',async ctx=>{
    const contacts = mydb1.get(`${ctx.cookies.get("user")}`).value()
    contacts.push({
        ...ctx.request.body
    })
    await ctx.redirect('/sample')
})
router.post('/add/shared',async ctx=>{
    const shared = mydb1.get("shared").value()
    shared.push({
        ...ctx.request.body
    })
    await ctx.redirect('/sample')
})
router.post('/logout',async ctx=>{
    ctx.cookies.set("user","")
    console.log("LoggedOut")
    await ctx.redirect('/')
})
router.post('/',async ctx=>{
    const userl=mydb.get("users").value();
    const uname=ctx.request.body.name;
    const upass=ctx.request.body.pass;
    var flag=false;
    //console.log(JSON.stringify(uname))
    for(var i=0;i<userl.length;i++){
        //console.log(JSON.stringify(userl[i].name))
        if((JSON.stringify(uname)==JSON.stringify(userl[i].name))&&(JSON.stringify(upass)==JSON.stringify(userl[i].pass))){
            //console.log("working")
            flag=true;
            break;       
        }
    }
    if(flag){
        ctx.cookies.set("user",`con${uname}`)
        await ctx.redirect("/sample")
    }   
    if(!flag){
    await ctx.redirect('/')}
})
 app.use(bodyparser())
 app.use(router.routes())

 const PORT=3001

 app.listen(PORT,()=>{
     console.log("server started at " + PORT)
 })