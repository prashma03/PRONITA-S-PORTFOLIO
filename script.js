const cursordot = document.querySelector('.cursor-dot');
document.addEventListener('mousemove', function(event){
    console.log(event);
    cursordot.style.left = event.pageX + 'px';
    cursordot.style.top = event.pageY + 'px';
});