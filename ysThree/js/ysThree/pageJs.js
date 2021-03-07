$('.tips-btn').click(function () {
    var  c =  $(".tips-container")
    if(parseInt(c.css('left'))===0){
        c.removeClass("tips-container-show")
    }else{
        c.addClass("tips-container-show")
    }
})
