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
const sendLetterButton = document.querySelector('.send-letter');

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

sendLetterButton.addEventListener('click', function() {
  sendLetterButton.textContent = 'Letter Saved';

  setTimeout(function() {
    sendLetterButton.textContent = 'Send Letter';
  }, 1400);
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

const hobbyDetails = {
  dance: {
    title: 'Dancing',
    text: 'Dance gives me a different kind of discipline and expression. It connects movement, emotion, culture, and storytelling in a way that feels very natural to me.'
  },
  writing: {
    title: 'Creative Writing',
    text: 'Writing helps me slow down and understand my thoughts better. I like turning small observations, feelings, and ideas into something with voice and shape.'
  },
  reading: {
    title: 'Reading',
    text: 'Reading keeps me curious. Whether it is research, technology, or reflective writing, I like learning how other people think and seeing the world through different perspectives.'
  },
  travel: {
    title: 'Travel',
    text: 'I want to travel for fun, but also to know local people and their stories. I think places teach you things that classrooms and screens cannot always teach.'
  }
};

const hobbyTiles = document.querySelectorAll('.hobby-tile');
const hobbyDetail = document.querySelector('.hobby-detail');

hobbyTiles.forEach(function(tile) {
  tile.addEventListener('click', function() {
    const selectedHobby = hobbyDetails[tile.dataset.hobby];

    hobbyTiles.forEach(function(otherTile) {
      otherTile.classList.remove('active-hobby');
    });

    tile.classList.add('active-hobby');
    hobbyDetail.querySelector('h3').textContent = selectedHobby.title;
    hobbyDetail.querySelector('p:last-child').textContent = selectedHobby.text;
  });
});

const achievementDetails = {
  'fall-list': {
    label: 'academic star',
    title: "Chancellor's List",
    text: 'Fall 2025. A reminder that consistent effort, curiosity, and discipline can become something visible.'
  },
  'spring-list': {
    label: 'academic star',
    title: "Chancellor's List",
    text: 'Spring 2026. A second bright point in the same constellation, showing that I can keep showing up and growing.'
  },
  ambassador: {
    label: 'campus star',
    title: 'UAM Ambassador',
    text: 'Starting Fall 2026, I will represent UAM as a student ambassador, welcoming others with the same grounded confidence I am building for myself.'
  },
  growth: {
    label: 'growth star',
    title: 'Academic Growth',
    text: 'Each semester teaches me how to balance mathematics, computer science, projects, and research with patience and consistency.'
  },
  balance: {
    label: 'creative star',
    title: 'Creative Balance',
    text: 'I am learning to keep both sides of myself alive: the logical side that loves DSA and the creative side that dances, writes, and builds.'
  }
};

const achievementStars = document.querySelectorAll('.achievement-star');
const achievementDetail = document.querySelector('.achievement-detail');

achievementStars.forEach(function(star) {
  function showAchievement() {
    const selectedAchievement = achievementDetails[star.dataset.achievement];

    achievementStars.forEach(function(otherStar) {
      otherStar.classList.remove('active-achievement');
    });

    star.classList.add('active-achievement');
    achievementDetail.querySelector('.achievement-detail-label').textContent = selectedAchievement.label;
    achievementDetail.querySelector('h3').textContent = selectedAchievement.title;
    achievementDetail.querySelector('p:last-child').textContent = selectedAchievement.text;
    achievementDetail.style.left = 'min(calc(' + star.style.getPropertyValue('--x') + ' + 130px), calc(100% - 180px))';
    achievementDetail.style.top = 'max(calc(' + star.style.getPropertyValue('--y') + ' - 44px), 120px)';
  }

  star.addEventListener('click', showAchievement);
  star.addEventListener('mouseenter', showAchievement);
});

const goalDetails = {
  software: {
    label: 'currently dreaming toward',
    title: 'Become a Software Engineer',
    text: 'I like mathematics, logic, and DSA, so software engineering feels like a place where my mathematical brain can solve problems and turn ideas into something real.'
  },
  ai: {
    label: 'learning with intention',
    title: 'Build with AI',
    text: 'I see AI as a powerful innovation when it is used thoughtfully. I want to learn how to build with it in a smart, useful way that supports development instead of just following trends.'
  },
  fullstack: {
    label: 'building the whole thing',
    title: 'Grow as a Full-Stack Developer',
    text: 'I started with an interest in front-end design, but I want deeper, more useful knowledge too. Learning full stack helps me understand the whole app, not just the part people see.'
  },
  travel: {
    label: 'life outside the screen',
    title: 'Travel The World',
    text: 'I want to travel for joy, curiosity, and the chance to know local people and their stories. Seeing more of the world feels like another way of learning.'
  }
};

const goalTasks = document.querySelectorAll('.goal-task');
const goalNote = document.querySelector('.goal-note');

goalTasks.forEach(function(task) {
  task.addEventListener('click', function() {
    const selectedGoal = goalDetails[task.dataset.goal];

    goalTasks.forEach(function(otherTask) {
      otherTask.classList.remove('active-goal');
    });

    task.classList.add('active-goal');
    goalNote.querySelector('.goal-note-label').textContent = selectedGoal.label;
    goalNote.querySelector('h3').textContent = selectedGoal.title;
    goalNote.querySelector('p:last-child').textContent = selectedGoal.text;
  });
});
