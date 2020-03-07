import Koa from 'koa'
import Pug from 'koa-pug'
import Router from '@koa/router'
import db from 'lowdb'
import Filesync from 'lowdb/adapters/Filesync'
import bodyparser from 'koa-bodyparser'
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
router.get('/sample/:user',async (ctx)=>{
    var contact1=mydb1.get(`${ctx.params.user}`).value()
    var shared=mydb1.get(`shared`).value()
    var contacts={
        contact1,
        shared
    }
    await ctx.render('sample',{contacts})
})

router.get('/', async ctx=>{
    await ctx.render('index')
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
        await ctx.redirect(`/sample/con${uname}`)
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