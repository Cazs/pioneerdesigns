window.addEventListener('scroll',function(event)
{
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    if(top<=200)
    {
        if(top/200>=0.1)
            $('.navbar').css({'background-color':'rgba(0, 0, 0, '+(top/200)+')'});
        else $('.navbar').css({'background-color':'rgba(0, 0, 0, 0.2)'});
    }else{
        $('.navbar').css({'background-color':'rgba(0, 0, 0, 0.9)'});
    }
});