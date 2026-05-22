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
const toggleButton = document.querySelector('.toggle');
toggleButton.addEventListener('click', function() {
  console.log('Toggle button clicked');
  document.body.classList.toggle('dark-mode');
  const sunIcon = toggleButton.querySelector('.sun-icon');
  const moonIcon = toggleButton.querySelector('.moon-icon');
  sunIcon.style.display = sunIcon.style.display === 'none' ? 'inline' : 'none';
  moonIcon.style.display = moonIcon.style.display === 'none' ? 'inline' : 'none';
});
