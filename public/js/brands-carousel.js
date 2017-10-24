$(document).ready(function() 
{
    $('#brands-carousel').carousel(
    {
        interval: 3000
    })
    
    $('#brands-carousel').on('slid.bs.carousel', function()
    {
        //alert("slid");
    });
});