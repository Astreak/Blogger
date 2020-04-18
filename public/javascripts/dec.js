$(document).ready(()=>{
    $("h1").on("click",()=>{

        var xhr=new XMLHttpRequest();
        xhr.open("GET","ok.txt",true);
        xhr.onload=function(){
                console.log(this.status)
                console.log(this.responseText);
            
        }
        xhr.send();

    });
});