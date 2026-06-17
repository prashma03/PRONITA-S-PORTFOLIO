const cursordot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let targetStarX = 0;
let targetStarY = 0;
let currentStarX = 0;
let currentStarY = 0;
let ringX = window.innerWidth / 2;
let ringY = window.innerHeight / 2;

document.addEventListener('mousemove', function(event){
    
    cursordot.style.left = event.clientX + 'px';
    cursordot.style.top = event.clientY + 'px';

    targetStarX = (event.clientX / window.innerWidth - 0.5) * 28;
    targetStarY = (event.clientY / window.innerHeight - 0.5) * 28;

    const trail = document.createElement("div");
    trail.className = "sparkly-trail";
    trail.style.left = event.clientX + "px";
    trail.style.top = event.clientY + "px";

    document.body.appendChild(trail);
    setTimeout(function() {
    trail.remove();
  }, 100);
});

function moveStars() {
  currentStarX = currentStarX + (targetStarX - currentStarX) * 0.04;
  currentStarY = currentStarY + (targetStarY - currentStarY) * 0.04;

  document.body.style.setProperty('--star-x', currentStarX + 'px');
  document.body.style.setProperty('--star-y', currentStarY + 'px');

  requestAnimationFrame(moveStars);
}

moveStars();

function moveCursorRing() {
  ringX = ringX + ((parseFloat(cursordot.style.left) || ringX) - ringX) * 0.16;
  ringY = ringY + ((parseFloat(cursordot.style.top) || ringY) - ringY) * 0.16;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';

  requestAnimationFrame(moveCursorRing);
}

moveCursorRing();

document.querySelectorAll('button, a').forEach(function(element) {
  element.addEventListener('mouseenter', function() {
    cursorRing.style.width = '58px';
    cursorRing.style.height = '58px';
    cursorRing.style.borderColor = 'rgba(247, 215, 255, 0.9)';
  });

  element.addEventListener('mouseleave', function() {
    cursorRing.style.width = '42px';
    cursorRing.style.height = '42px';
    cursorRing.style.borderColor = 'rgba(205, 189, 255, 0.65)';
  });
});
const toggleButton = document.querySelector('.toggle');
toggleButton.addEventListener('click', function() {
  console.log('Toggle button clicked');
  document.body.classList.toggle('dark-mode');
});

const contactWidget = document.querySelector('.contact-widget');
const contactButton = document.querySelector('.contact-button');
const copyEmailButton = document.querySelector('.copy-email');
const emailText = document.querySelector('.email-text');

contactButton.addEventListener('click', function() {
  contactWidget.classList.toggle('open');
});

document.addEventListener('click', function(event) {
  if (contactWidget.classList.contains('open') && !contactWidget.contains(event.target)) {
    contactWidget.classList.remove('open');
  }
});

copyEmailButton.addEventListener('click', function() {
  navigator.clipboard.writeText(emailText.textContent);
  copyEmailButton.textContent = 'Copied';

  setTimeout(function() {
    copyEmailButton.textContent = 'Copy';
  }, 1200);
});

const mainTitle = document.querySelector('#main-title');
const openBookButton = document.querySelector('.open-book-button');

function openCurtain() {
  document.body.classList.add('open-curtain');
  setActiveDot('polaroid-page');
}

mainTitle.addEventListener('click', openCurtain);
openBookButton.addEventListener('click', openCurtain);

let paperHasPulled = false;

window.addEventListener('wheel', function(event) {
  if (event.deltaY < 0 && paperHasPulled === true && window.scrollY <= window.innerHeight + 80) {
    event.preventDefault();

    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });

    return;
  }

  if (event.deltaY > 0 && document.body.classList.contains('open-curtain') && paperHasPulled === false) {
    event.preventDefault();
    paperHasPulled = true;
    document.body.classList.add('paper-pulled');
    setActiveDot('scrapbook-menu');

    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}, { passive: false });

const menuButtons = document.querySelectorAll('.menu-boxes button');
const backToPolaroidButton = document.querySelector('.back-to-polaroid');
const sideDots = document.querySelectorAll('.side-dot');

function setActiveDot(sectionId) {
  sideDots.forEach(function(dot) {
    dot.classList.toggle('active-dot', dot.dataset.jump === sectionId);
  });
}

backToPolaroidButton.addEventListener('click', function() {
  const allSections = document.querySelectorAll('.scrapbook-section');

  allSections.forEach(function(scrapbookSection) {
    scrapbookSection.classList.remove('active-section');
  });

  document.body.classList.add('open-curtain');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  setTimeout(function() {
    document.body.classList.remove('paper-pulled');
    paperHasPulled = false;
    setActiveDot('polaroid-page');
  }, 120);
});

menuButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const sectionId = button.dataset.section;
    const section = document.querySelector('#' + sectionId);
    const allSections = document.querySelectorAll('.scrapbook-section');

    allSections.forEach(function(scrapbookSection) {
      scrapbookSection.classList.remove('active-section');
    });

    section.classList.add('active-section');
    setActiveDot(sectionId);

    section.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

sideDots.forEach(function(dot) {
  dot.addEventListener('click', function() {
    const sectionId = dot.dataset.jump;
    const allSections = document.querySelectorAll('.scrapbook-section');

    allSections.forEach(function(scrapbookSection) {
      scrapbookSection.classList.remove('active-section');
    });

    document.body.classList.add('open-curtain');

    if (sectionId === 'polaroid-page') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      setTimeout(function() {
        document.body.classList.remove('paper-pulled');
        paperHasPulled = false;
        setActiveDot('polaroid-page');
      }, 120);

      return;
    }

    document.body.classList.add('paper-pulled');
    paperHasPulled = true;

    if (sectionId !== 'scrapbook-menu') {
      document.querySelector('#' + sectionId).classList.add('active-section');
    }

    document.querySelector('#' + sectionId).scrollIntoView({
      behavior: 'smooth'
    });

    setActiveDot(sectionId);
  });
});
