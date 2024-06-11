window.addEventListener("load", function(){
    this.setTimeout(
        function open(event){
            document.querySelector(".popup").style.
            display = "block" 
        },
        800
    )
});

document.querySelector("#close").addEventListener
("click", function(){
    document.querySelector(".popup").style.display =
    "none"; 
});