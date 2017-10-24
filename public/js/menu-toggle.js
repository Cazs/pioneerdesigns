document.querySelector('.navbar-toggle').addEventListener('click', function(event)
{
  if(document.querySelector('#third_bar').style.display != "none")
  {
    $({deg: -20}).animate({deg: 139},
    {
      duration: 500,
      step: function(now)
      {
        if(now<=45)
          $('#first_bar').css({transform:'rotate('+now+'deg)'});
        $('#second_bar').css({transform:'rotate('+now+'deg)'});
      }
    });

    document.querySelector('#first_bar').style.marginTop="6px";
    document.querySelector('#second_bar').style.marginBottom="6px";
    document.querySelector('#second_bar').style.marginTop="-2px";
    document.querySelector('#third_bar').style.display = "none";
  }else
  {
    $({deg: 139}).animate({deg: 0},
    {
      duration: 500,
      step: function(now)
      {
        if(now<=45)
        $('#first_bar').css({transform:'rotate('+now+'deg)'});
        $('#second_bar').css({transform:'rotate('+now+'deg)'});
      },
      complete: function()
      {
        document.querySelector('#third_bar').style.display = "block";
      }
    });
    document.querySelector('#first_bar').style.marginTop="0px";
    document.querySelector('#second_bar').style.marginBottom="0px";
    document.querySelector('#second_bar').style.marginTop="3px";
  }
});