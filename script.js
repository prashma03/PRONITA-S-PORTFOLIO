const cursordot = document.querySelector('.cursor-dot');
document.addEventListener('mousemove', function(event){
    
    cursordot.style.left = event.pageX + 'px';
    cursordot.style.top = event.pageY + 'px';

    const trail = document.createElement("div");
    trail.className = "sparkly-trail";
    trail.style.left = event.clientX + "px";
    trail.style.top = event.clientY + "px";

    document.body.appendChild(trail);
    setTimeout(function() {
    trail.remove();
  }, 100);
});

