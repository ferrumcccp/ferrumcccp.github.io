fs=require("fs");
curdir=fs.readdirSync(".");
//console.log(curdir);

//define startWith and endWith
String.prototype.startWith=function(s){return(new RegExp("^"+s)).test(this);}
String.prototype.endWith=function(s){return(new RegExp(s+"$")).test(this);}

ss="";cur=0;len=0;
raw_mode=false;
sta=["root"];
sta2=[["root",[]]];
raws={
    "raw_html":1,"code":1,"$":1,"*":-1
}
meta="";
bookmarx=[];
// Finish the subtree, returns false when the whole tree is proceeded
function collapse(){
    if(sta.length==1)return false;
    sta2[sta.length-2].push(sta2[sta.length-1]);
    sta2.pop();sta.pop();
    if(raws[sta[sta.length-1]]==1)raw_mode=true;else raw_mode=false;
    return true;
}
function make_error(s){
    return "<html><body><h1 style=\"color:red\">ERROR</h1><p>"
        +s+"</p></body></html>";
}
function make_escape(s){
    let t="";
    for(let i=0;i<s.length;i++){
        if(s[i]=="\"")t+="&quot;";
        else if(s[i]==" ")t+=" ";
        else if(s[i]=="&")t+="&amp;";
        else if(s[i]=="<")t+="&lt;";
        else if(s[i]==">")t+="&gt;";
        else t+=s[i];
    }
    return t;
}
function has_quote(s){
    for(let i=0;i<s.length;i++)if(s[i]=="\"")return true;
    return false;
}
function rep_str(s,tim){if(tim<1)return"";else return s+rep_str(s,tim-1);}
function rec_proc(s){
    let tt="";
    let ttraw="";
    if(s.length==0)return make_error("Empty array(This is an internal error.)");
    let las_li=false;
    for(let i=2;i<s.length;i++){
        if((typeof(s[i]))=="string"){
            if(s[0]=="code")tt+=make_escape(s[i]);
            else{
                if(s[i]=="\n"){
                        if(tt!="")tt+="<br>\n";
                }else if(s[i]=="\r"){
                    if(i>2&&(typeof(s[i-1])=="string"&&s[i-1]=="\n")); //DOS
	                     else tt+="<br>\n";
                }else tt+=make_escape(s[i]);
            }
            ttraw+=s[i];
        }else if(s[i][0]=="*"){
            if(las_li)tt+="</li><li>";else{
                tt+="<li>";las_li=1;
            }
        }else tt+=rec_proc(s[i]);
    }
    switch(s[0]){
        case"root":{
            let tit="";
            if(meta!=undefined&&typeof(meta.title)=="string")
                tit=make_escape(meta.title);
            let bookht="";
            if(bookmarx.length>0){
                bookht+="<a href=\"javascript:;\" onclick=\"javascript:close_content();\" class=\"close-content\">关闭目录</a><br>";
            }
            for(let i=0;i<bookmarx.length;i++){
                let lev=bookmarx[i][0];let v=bookmarx[i][1];
                bookht+="<a href=\"#bm"+(i+1)+"\" onclick=\"javascript:close_content();\">"+rep_str("&nbsp;",6*(lev-1))+v.trim()+"</a><br>";
            }
            let ret="<!DOCTYPE html><html><title>"+tit+` - Ferrum CCCP's blog</title>
        <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,  initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />`
        ret+=`<link rel="stylesheet" type="text/css" href="emerg.css">`;
	ret+=`<link rel="stylesheet" type="text/css" href="ferrous.css">`
	ret+=`
  	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
	<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
	<link href="icon.png" rel="Shortcut Icon">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0-rc.1/katex.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0-rc.1/katex.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0-rc.1/contrib/auto-render.js"></script>
        <link href="https://cdn.bootcss.com/highlight.js/8.0/styles/monokai_sublime.min.css" rel="stylesheet">
        <script src="https://cdn.bootcss.com/highlight.js/8.0/highlight.min.js"></script>
        <script src="https://ajax.proxy.ustclug.org/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

        `
	if(meta.emerg)ret+=`<body id="body" class="emerg">`
	else ret+=`<body id="body">`
	ret+=`
        <div class="top-bar">
        <a href="`;
	if(meta.filename&&(meta.filename.startWith("en")||meta.filename.startWith("indexen")))ret+="indexen.html";else ret+="index.html";
	ret+=`" class="tpi icon-top primary"><img src="home.svg" class="svg"></a>
        <p class="tpi">`+tit+`</p>
        <a href="javascript:;" onclick="javascript:open_content();" class="tpi icon-top"><img src="top.svg" class="svg"></a></div>
        `;
        if(true)ret+=`<div class="article">`+tt+`</div>`;
        else ret+=tt;
        if(bookht!="")ret+=`<nav id="table-content">`+bookht+`</nav>`;
        ret+=`
<div id="gitalk-container" class="container"></div>`;
	ret+=`
	<script>

if(location.href.substr(0,5)=="file:"||location.hostname.substr(0,3)=="127"){
    $("#gitalk-container").css("display","none");}else{
const gitalk = new Gitalk({
  clientID: '133aa544ab7aacc0e908',
  clientSecret: 'fe362d1dd84949381a7cb9bc6701219881316394',
  repo: 'afogi-comment',
  owner: 'awayfromoi',
  admin: ['awayfromoi','ferrumcccp'],
  id: location.pathname,
  distractionFreeMode: false
})
gitalk.render('gitalk-container')
}
	</script>
    <!-- 1-800-273-8255 -->
    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="https://music.163.com/outchain/player?type=2&id=518077470&auto=1&height=66" class="embed-player"></iframe>
	<div id="gitalk-container"></div>
	<footer>
        <script src="wycero-1.js"></script>
        <p>Copyright `+new Date().getFullYear()+` Ferrum CCCP</p>
        <p>Powered By: 
        <a href="http://nodejs.org">Node.js</a>
        <a href="https://katex.org">$\\KaTeX$</a>
        <a href="https://highlightjs.org/">Highlightjs</a></p>
        <p>Hosted On coding.me</p>
        </footer>
        <script >hljs.initHighlightingOnLoad();</script>
        <script>
            renderMathInElement(document.body,
           {
                      delimiters: [
                          {left: "$$", right: "$$", display: true},
                          {left: "$", right: "$", display: false}
                      ]
                  }
          );
        </script>`+"</body></html>";
        return ret;}
        case"h1":
        case"h2":
        case"h3":
        case"h4":
        case"h5":
        case"h6":{
            bookmarx.push([JSON.parse(s[0][1]),tt]);
            return"<a name=\"bm"+bookmarx.length+"\"></a><"+s[0]+">"+tt+"</"+s[0]+">";
        }
        case"b":{return"<strong>"+tt+"</strong>";}
        case"i":{return"<em>"+tt+"</em>";}
        case"$":{return"$"+tt+"$";}
        case"u":{
            console.log("Warning: Do not use underline as it mixes up with hyperlink.");
            return tt;}
        case"del":{return"<del>"+tt+"</del>";}
        case"url":
        case"urlbox":{
            let target="";
		    if(typeof(s[1])=="undefined")target=ttraw;else target=s[1];
		    if(s[0]=="url")return"<a href=\""+target+"\">"+tt+"</a>";
            else return"<div class=\"posti alone\"><a href=\""+target+"\">"+tt+"</a></div>";
	    }
        case"ubg":{
            return"<div class=\"posti-group\">"+tt+"</div>";
        }
        case"quote":{
            if(typeof(s[1])=="undefined")return"<blockquote>"+tt+"</blockquote>";
            else return"<blockquote><cite>"+make_escape(s[1])+": </cite><br>"+tt+"</blockquote>";
        }
	    case"img":{return"<img class=\"article-img\" src=\""+ttraw+"\" alt=\"\"/>";}
        case"raw_html":{return ttraw;}
        case"code":{return "<pre><code class=\"hljs "+(s[1]||"")+"\">"+tt+"</code></pre>"}
        case"frontpage":{return"<div class=\"frontpage\"><div class=\"frontpage-overlay\"><div class=\"frontpage-inner container\">"+tt+"<a class=\"primary\" onclick=\"close_front()\">Enter BLog</a></div></div></div>";}
        case"*":{return;}
        case"rem":{return;}
        case"list":{
            if(typeof(s[1])=="undefined")return"<ul>"+tt+"</ul>";
            else return"<ol start=\""+s[1]+"\">"+tt+"</ol>";
        }
        default:{
            console.log("Warning: Unknown Tag: "+s[0]);
            return "["+s[0]+"]"+tt+"[/"+s[0]+"]";}
    }
}
pages=[];
function arr_proc(s){
    if(meta==undefined||meta.filename=="");else{
        pages.push(meta);
    }
    return rec_proc(s);
}
function proc(s,filename){
    //s="[h1]AFO[/h1]";
    ss="";cur=0;len=0;
    raw_mode=false;
    sta=["root"];
    sta2=[["root",[]]];
    bookmarx=[];
    meta=undefined;
    ss=s;cur=0;
    len=ss.length;
    while(cur<len){
        if(ss[cur]=="["){
            if(raw_mode){
                // Only Checks if this tag ends, regardless of anything else
                if(sta.length&&cur+sta[sta.length-1].length+3<len
                    &&ss.substr(cur,sta[sta.length-1].length+3)
                    =="[/"+sta[sta.length-1]+"]"){
                    cur+=sta[sta.length-1].length+3;
                    if(!collapse())return arr_proc(sta2[0]);
                }
                else{
                    sta2[sta.length-1].push(ss[cur]);cur++;
                }
            }else{
                if(cur+1>=len)return make_error("Expected tag or escape, but found EOF");
                if(cur+1<len&&(ss[cur+1]=="["||ss[cur+1]=="]"||ss[cur+1]=="@")){
                    sta2[sta.length-1].push(ss[cur+1]);cur+=2;
                }else{
                    cur++;
                    let tag="";
                    let arg="";let argon=false;
                    while(true){
                        if(cur>=len)return make_error("Expected tag, but found EOF");
                        if(argon){
                            //arg+=ss[cur];
                            if(ss[cur]=="\\"){
                                if(cur+1<len){
                                    if(ss[cur+1]=="x"||ss[cur+1]=="u")
                                        return make_error("x/u escape is not supported");
                                    let es="\"\\"+ss[cur+1]+"\"";
                                    es=JSON.parse(es);
                                    arg+=es;cur++;
                                }else{
                                    return make_error("Expected escape sequence, but found EOF");
                                }
                            }else if(ss[cur]=="\""){
                                if(cur+1<len&&ss[cur+1]=="]"){cur+=2;break;}
                                else return make_error("Expected ]");
                            }else arg+=ss[cur];
                        }else{
                            if(ss[cur]=="]"){cur++;break;}
                            if(ss[cur]=="="){
                                argon=true;
                                if(cur+1<len&&ss[cur+1]=="\"")cur++;
                                else return make_error("Expected quote after =");
                            }
                            else tag+=ss[cur];
                        }
                        cur++;
                    }
                    if(tag.length==0)return make_error("Empty tag(It's an internal problem.)");
                    if(tag[0]=='/'){
                        tag=tag.substr(1,tag.length-1);
                        if(tag==sta[sta.length-1]){
                            if(!collapse())return arr_proc(sta2[0]);
                        }else return make_error("Mismatched close tag: expected "+sta[sta.length-1]+" found "+tag);
                    }else{
                        if(raws[tag]==1)raw_mode=true;else raw_mode=false;
                        sta.push(tag);
                        sta2.push([]);
                        sta2[sta.length-1].push(tag);
                        if(argon){
                            sta2[sta.length-1].push(arg);
                        }else sta2[sta.length-1].push(undefined);
                        if(raws[tag]==-1)if(!collapse())return arr_proc(sta2[0]);
                    }
                }
            }
        }else if(ss[cur]=="@"){
            cur++;
            let mt="";
            while(cur<len&&ss[cur]!="\n"&&ss[cur]!="\r"){
                mt+=ss[cur];cur++;
            }
            meta=JSON.parse(mt.trim());
            if(filename!="")meta.filename=filename;
        }else if(ss[cur]=="$"){
            if(raw_mode){
                if(sta[sta.length-1]=="$"){
                    if(!collapse())return arr_proc(sta2[0]);
                    raw_mode=0;
                }else{sta2[sta.length-1].push(ss[cur]);}
            }else{
                sta.push("$");
                sta2.push([]);
                sta2[sta.length-1].push("$");
                sta2[sta.length-1].push(undefined);
                raw_mode=true;
            }
            cur++;
        }else{
            sta2[sta.length-1].push(ss[cur]);cur++;
        }
    }
    if(sta.din!=1)make_error("Expected more close tabs, but found EOF");
    return arr_proc(sta2[0]);
}
function htmlize(s){return s.substr(0,s.length-4)+".html";}
for(let i=0;i<curdir.length;i++){
    if(curdir[i].endWith(".txt")){
        console.log("Proceeding BBCODE: "+curdir[i]);
        fs.writeFileSync("../blog/"+htmlize(curdir[i]),proc(fs.readFileSync(curdir[i],"utf8"),htmlize(curdir[i])));
    }else if((!curdir[i].endWith(".gen.js"))&&(curdir[i]!="g")){
        console.log("Copying File: "+curdir[i]);
        fs.writeFileSync("../blog/"+curdir[i],fs.readFileSync(curdir[i]));
    }else console.log("Skipping: "+curdir[i]);
}
// Sorry4hardcoding
index_page=`@{"title":"首页"}
[frontpage][raw_html]<h1>Ferrum CCCP</h1>[/raw_html][b]一只文化课小蒟蒻[/b][/frontpage]
[ubg]`;
indexen=`@{"title":"Home"}
[frontpage][raw_html]<h1>Ferrum CCCP</h1>[/raw_html][b]Student[/b][/frontpage]
[ubg]`
for(let i=0;i<pages.length;i++){
	if(pages[i].hidden)continue;
	let ub="[urlbox=\""+pages[i].filename+"\"]"+pages[i].title+"[/urlbox]";
	if(pages[i].filename.startWith("en"))indexen+=ub;
	else if(pages[i].filename.startWith("multi")){index_page+=ub;indexen+=ub;}
	else index_page+=ub;
}
indexen+="[/ubg]";
index_page+="[/ubg]";
fs.writeFileSync("../blog/index.html",proc(index_page,"index.html"));
fs.writeFileSync("../blog/indexen.html",proc(indexen,"indexen.html"));
