$("button#check-box").on("click", function(event){
    $(".item p").toggleClass("checked");
    console.log(event);
});