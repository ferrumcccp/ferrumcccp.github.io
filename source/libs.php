<?php function errormsg($s){
?><p style="color:red;font-size:32px;font-variant:small-caps;">Something Is Wrong</p><br>
<p>Please contact 2401829082@qq.com!</p><br>
<p>Detailed information:</p><br><p><?php
	echo $s;
?></p><?php
}
function dochead($t){ ?>
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title><?php echo $t;?> -- Wycero's blog</title>
<link rel="stylesheet" type="text/css" href="wycero-1.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0-rc.1/katex.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0-rc.1/katex.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0-rc.1/contrib/auto-render.js"></script>
<link href="http://cdn.bootcss.com/highlight.js/8.0/styles/monokai_sublime.min.css" rel="stylesheet">  
<script src="http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js"></script>  
<script >hljs.initHighlightingOnLoad();</script>  
<link href="icon.png" rel="Shortcut Icon">
</head>
<?php if($t=="Home"){?>
<body id="body">
<div class="top-bar">
<p class="tpi juruo">wycero</p>
</div>
<br><br><br><br>
<?php }else{ ?>
<body id="body">
<div class="top-bar">
<a href="index.html" class="tpi icon-top"><img src="home.svg" class="svg"></img></a>
<p class="tpi"><?php echo $t ?></p>
<a href="#" class="tpi icon-top"><img src="top.svg" class="svg"></img></a></div>
<br><br><br><br>
<?php
}
}
function auto_mk($tag,$in){
	?><<?php
	echo $tag
?>><?php
	$l=strlen($in);
	for($i=0;$i<$l;$i++){
		if($in[$i]=="\n" or $in[$i]=="\r"){
			?> <<?php echo '/';echo $tag; ?>>
<?php if($i>0&&($in[$i-1]=="\n" or $in[$i-1]=="\r")){
?>
<br>
<?
}
?>
<<?php echo $tag ?>><?php
		}
//else if($s[$i]=='<')echo '&lt';
//else if($s[$i]=='>')echo '&gt';
//else if($s[$i]=='&')echo '&amp';
//else if($s[$i]=='"')echo '&quot';
else echo($in[$i]);
	}
?>
<<?php echo '/';echo $tag; ?>>
<?php
}
?>
<?php
/* Now the document begins*/
?>
<?php function docfoot(){
?>
<footer>
<script src="wycero-1.js"></script>
<p>Copyright <?php echo date("Y"); ?> wycero</p>
<p>Powered By: 
<a href="http://php.net">PHP</a>
<a href="https://katex.org">$\KaTeX$</a>
<a href="https://highlightjs.org/">Highlightjs</a></p>
<p>Hosted On coding.me</p>
</footer>
<script>
    renderMathInElement(document.body,
   {
              delimiters: [
                  {left: "$$", right: "$$", display: true},
                  {left: "$", right: "$", display: false},
                  {left: "\\(", right: "\\)", display: false}
              ]
          }
  );
</script>

</body>
</html>
<?php
}
?>
<?php
function fetch_info($f){
	$ff=fopen($f,"r");
	$s=trim(fgets($ff));
	if(strcmp(trim($s),"<!--")!=0){
?><h2 class="postii untitled">Untitled: <?php errormsg($f); ?></h2><?php
		return;
	}
	$cnt=1;
	while(strcmp(($s=trim(fgets($ff))),"-->")!=0){
		if($cnt==1){
?><h2 class="postii"><?php echo($s); ?></h2><?php
		}else if(false){
?><p class="postii"><?php echo($s); ?></p><?php
		}
		$cnt+=1;
	}
	fclose($ff);
}
function get_posts(){
?>
<div class="posts">
<?php
if($d=opendir('.')){
	$i=0;
	while(false!==($f=readdir($d))){
		if(strlen($f)>=5&&strncmp($f,"post_",5)==0){
			$fs[$i][1]=$f;
			$fs[$i][2]=(string)filemtime($f);
			//echo($fs[$i][2]);
			$i++;
		}
	}
	closedir($d);
	//print_r($fs);
	foreach($fs as $k=>$v){
		$n[$k]=$v[1];
		$t[$k]=$v[2];
	}
	array_multisort($t,SORT_DESC,SORT_STRING,$fs);
	//print_r($fs);
	foreach($fs as $k=>$v){
		$f=$v[1];
	?>
<a class="posta" href="<?php
			echo(substr_replace($f,".html",-4,5));
?>"><div class="posti"><?php
			fetch_info($f);
?></div></a><?php
	}
}
?>
</div>
<?php
}
function mk_cota($class,$s){
?><pre><code class=<?php echo $class; ?>><?php
$len=strlen($s);
for($i=0;$i<$len;$i++){
if($s[$i]=='<')echo '&lt';
else if($s[$i]=='>')echo '&gt';
else if($s[$i]=='&')echo '&amp';
else if($s[$i]=='"')echo '&quot';
else echo $s[$i];
}
?></pre></code><?php
}
?>
