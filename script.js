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
});

const mainTitle = document.querySelector('#main-title');

mainTitle.addEventListener('click', function() {
  document.body.classList.add('open-curtain');
});

let paperHasPulled = false;

window.addEventListener('wheel', function(event) {
  if (event.deltaY > 0 && document.body.classList.contains('open-curtain') && paperHasPulled === false) {
    event.preventDefault();
    paperHasPulled = true;
    document.body.classList.add('paper-pulled');

    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}, { passive: false });
