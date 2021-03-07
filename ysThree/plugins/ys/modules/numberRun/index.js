import $ from "../jquery"
const numberRun = data =>{
    let el=$(data.name).addClass("clearfix")
        ,number=data.number.toString()
        ,l=number.length
        ,n=1
    for(let i=0;i<l;i++){
        if(l-3*n>0){
            number=number.slice(0,l - 3 * n)+','+number.slice(l - 3 * n)
            n++
        }
    }//加逗号
    setNumber(el,number)
}
//初始化
function setNumber(el,number){
    let arr=[],mt=[]
    el.children().each( (i,e)=> {
        arr.push($(e).attr("number"))
        mt.push($(e).css("margin-top"))
    })
    el.html('')
    for(let i=0;i<number.length;i++){
        el.append(`<div style="margin-top: ${mt[i]}"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  <span>6</span><span>7</span><span>8</span><span>9</span><span>,</span></div>`)
    }
    let H=parseInt(el.children().css("height"))/11//单个number高度
    for(let i=0;i<number.length;i++){
        let y=number[i]*H
        if(number[i]===','){
            y=10*H
            el.children().eq(i).addClass("dot-li")
        }else{
            el.children().eq(i).removeClass("dot-li")
        }
        if(arr[i]===number[i]){
            el.children().eq(i).css({
                marginTop:-y// transform:'matrix(1, 0, 0, 1, 0, '+-y+')'
            }).attr("number",number[i])
        }else{
            el.children().eq(i).animate({
                marginTop:-y  // transform:'matrix(1, 0, 0, 1, 0, '+-y+')'
            },500).attr("number",number[i])
        }
    }
}
export default numberRun