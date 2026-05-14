const cursordot = document.querySelector('.cursor-dot');
const sparklytrail = document.querySelector('.sparkly-trail');
document.addEventListener('mousemove', function(event){
    console.log(event);
    cursordot.style.left = event.pageX + 'px';
    cursordot.style.top = event.pageY + 'px';
});
document.addEventListener('mousemove', function(event){
    console.log(event);
    sparklytrail.style.left = event.pageX + 'px';
    sparklytrail.style.top = event.pageY + 'px';
});