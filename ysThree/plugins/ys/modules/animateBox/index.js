const animateBox = data =>{
    const obj={right:'translateX(-101%)', left:'translateX(101%)', top:'translateY(101%)', bottom:'translateY(-101%)'}
        ,direction= data.direction || 'left',el = $(data.name+">.ys-animateBox-item").css({transform: obj[direction]}).show(0)
        ,dur = data.during||6000,iv = data.interval||300
        ,go = () =>{
          el.each((i,e)=> {
             const st = setTimeout(()=> {
                 $(e).css({transform: 'translateX(0)'})
                 if(data.change && typeof data.change === "function") data.change($(e),$(e).index())
                 clearTimeout(st)
             },iv*i)
          })
         const st =setTimeout(function () {
             el.each((i,e)=> {
                 const st = setTimeout(()=>  {
                    $(e).css({transform: obj[direction]})
                    clearTimeout(st)
                 },iv*i)
             })
             clearTimeout(st)
         },dur)
    }
    go()
    setInterval(()=> go(),dur+iv*el.length)
}
export default animateBox