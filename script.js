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
const openBookButton = document.querySelector('.open-book-button');

function openCurtain() {
  document.body.classList.add('open-curtain');
}

mainTitle.addEventListener('click', openCurtain);
openBookButton.addEventListener('click', openCurtain);

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

const menuButtons = document.querySelectorAll('.menu-boxes button');

menuButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const sectionId = button.dataset.section;
    const section = document.querySelector('#' + sectionId);
    const allSections = document.querySelectorAll('.scrapbook-section');

    allSections.forEach(function(scrapbookSection) {
      scrapbookSection.classList.remove('active-section');
    });

    section.classList.add('active-section');

    section.scrollIntoView({
      behavior: 'smooth'
    });
  });
});
