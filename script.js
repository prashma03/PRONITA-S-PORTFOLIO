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

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'scrapbook-card';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const text = document.createElement('p');
  text.textContent = item.text;

  card.appendChild(title);
  card.appendChild(text);

  if (item.link) {
    card.classList.add('clickable-card');
    card.dataset.link = item.link;
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', 'Open ' + item.title + ' website');

    const link = document.createElement('a');
    link.className = 'scrapbook-link';
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.linkText || 'Open link';
    card.appendChild(link);

    card.addEventListener('click', function(event) {
      if (event.target.closest('a')) {
        return;
      }

      window.open(item.link, '_blank', 'noopener');
    });

    card.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.open(item.link, '_blank', 'noopener');
      }
    });
  }

  return card;
}

function renderCards(sectionId, items) {
  const container = document.querySelector('#' + sectionId + ' .scrapbook-cards');

  if (!container || !items) {
    return;
  }

  container.innerHTML = '';

  items.forEach(function(item) {
    container.appendChild(createCard(item));
  });
}

function renderFeaturedProject(project) {
  if (!project) {
    return;
  }

  const caseStudy = document.querySelector('.featured-case-study');
  if (!caseStudy) {
    return;
  }

  caseStudy.querySelector('.case-label').textContent = project.label;
  caseStudy.querySelector('h3').textContent = project.title;
  caseStudy.querySelector('.case-summary').textContent = project.summary;

  const fields = caseStudy.querySelectorAll('.case-grid p');
  fields[0].textContent = project.problem;
  fields[1].textContent = project.role;
  fields[2].textContent = project.engineering;

  const highlights = caseStudy.querySelector('.case-highlights');
  if (highlights) {
    highlights.innerHTML = '';
    project.highlights.forEach(function(highlight) {
      const item = document.createElement('li');
      item.textContent = highlight;
      highlights.appendChild(item);
    });
  }

  const meta = document.createElement('div');
  meta.className = 'case-tags';
  project.stack.forEach(function(item) {
    const tag = document.createElement('span');
    tag.textContent = item;
    meta.appendChild(tag);
  });

  const existingTags = caseStudy.querySelector('.case-tags');
  if (existingTags) {
    existingTags.remove();
  }

  caseStudy.appendChild(meta);
}

function renderSkills(skills) {
  if (!skills) {
    return;
  }

  const summary = document.querySelector('.skill-summary p:last-child');
  if (summary) {
    summary.textContent = skills.summary;
  }

  Object.keys(skills).forEach(function(group) {
    if (group === 'summary') {
      return;
    }

    const list = document.querySelector('[data-skill-group="' + group + '"]');
    if (!list) {
      return;
    }

    list.innerHTML = '';
    skills[group].forEach(function(skill) {
      const item = document.createElement('li');
      item.textContent = skill;
      list.appendChild(item);
    });
  });
}

function renderPortfolioData() {
  if (typeof portfolioData === 'undefined') {
    return;
  }

  const owner = portfolioData.owner;
  const contact = portfolioData.contact;

  document.title = owner.portfolioTitle;
  document.querySelector('.intro-label').textContent = owner.introLabel;
  document.querySelector('.title-left').textContent = owner.firstName + "'s";
  document.querySelector('.title-right').textContent = 'Portfolio';
  document.querySelector('.role-line').textContent = owner.roleLine;
  document.querySelector('.polaroid-img').src = owner.photo;
  document.querySelector('.polaroid-img').alt = owner.fullName;
  document.querySelector('.polaroid p').textContent = owner.photoCaption;
  document.querySelector('.intro-text p').textContent = owner.bio;

  document.querySelector('.contact-card > p:first-of-type').textContent = owner.fullName;
  document.querySelector('.contact-card > p:nth-of-type(2)').textContent = contact.subtitle;
  document.querySelector('.email-text').textContent = contact.email;
  document.querySelector('.linkedin-link').href = contact.linkedin;
  document.querySelector('.github-link').href = contact.github;

  const resumeLink = document.querySelector('.resume-link');
  if (contact.resume) {
    resumeLink.href = contact.resume;
    resumeLink.hidden = false;
  } else {
    resumeLink.hidden = true;
  }

  const letterForm = document.querySelector('.letter-form');

  if (contact.formEndpoint) {
    letterForm.action = contact.formEndpoint;
  }

  renderFeaturedProject(portfolioData.featuredProject);
  renderSkills(portfolioData.skills);
  renderCards('projects', portfolioData.projects);
  renderCards('research', portfolioData.research);
  renderCards('hackathons', portfolioData.hackathons);

  window.portfolioTemplateState = {
    achievementDetails: {},
    goalDetails: {},
    hobbyDetails: {}
  };

  const achievementStars = document.querySelectorAll('.achievement-star');

  portfolioData.achievements.forEach(function(achievement, index) {
    const star = achievementStars[index];

    window.portfolioTemplateState.achievementDetails[achievement.id] = {
      label: achievement.label,
      title: achievement.title,
      text: achievement.text
    };

    if (star) {
      star.dataset.achievement = achievement.id;
      star.style.setProperty('--x', achievement.x);
      star.style.setProperty('--y', achievement.y);
      star.style.setProperty('--color', achievement.color);
      star.style.setProperty('--glow', achievement.glow);
    }
  });

  const firstAchievement = portfolioData.achievements[0];
  document.querySelector('.achievement-detail-label').textContent = firstAchievement.label;
  document.querySelector('.achievement-detail h3').textContent = firstAchievement.title;
  document.querySelector('.achievement-detail p:last-child').textContent = firstAchievement.text;

  const goalsList = document.querySelector('.goals-list');
  const goalNote = document.querySelector('.goal-note');
  goalsList.innerHTML = '';

  portfolioData.goals.forEach(function(goal, index) {
    window.portfolioTemplateState.goalDetails[goal.id] = {
      label: goal.label,
      title: goal.title,
      text: goal.text
    };

    const button = document.createElement('button');
    button.className = 'goal-task';
    button.dataset.goal = goal.id;

    if (index === 0) {
      button.classList.add('active-goal');
      goalNote.querySelector('.goal-note-label').textContent = goal.label;
      goalNote.querySelector('h3').textContent = goal.title;
      goalNote.querySelector('p:last-child').textContent = goal.text;
    }

    button.innerHTML = '<span class="goal-check"></span><span><strong></strong><small></small></span>';
    button.querySelector('strong').textContent = goal.title;
    button.querySelector('small').textContent = goal.short;
    goalsList.appendChild(button);
  });

  const hobbyGrid = document.querySelector('.hobby-grid');
  hobbyGrid.innerHTML = '';

  portfolioData.hobbies.forEach(function(hobby, index) {
    window.portfolioTemplateState.hobbyDetails[hobby.id] = {
      title: hobby.title,
      text: hobby.text,
      image: hobby.image || '',
      caption: hobby.caption || ''
    };

    const button = document.createElement('button');
    button.className = 'hobby-tile';
    button.dataset.hobby = hobby.id;

    if (index === 0) {
      button.classList.add('active-hobby');
      document.querySelector('.hobby-copy h3').textContent = hobby.title;
      document.querySelector('.hobby-copy p:last-child').textContent = hobby.text;
      document.querySelector('.hobby-photo').src = hobby.image || '';
      document.querySelector('.hobby-photo').alt = hobby.title;
      document.querySelector('.hobby-photo-frame figcaption').textContent = hobby.caption || '';
    }

    button.innerHTML = '<span class="hobby-symbol"></span><span class="hobby-name"></span><span class="hobby-short"></span>';
    button.querySelector('.hobby-symbol').textContent = hobby.symbol;
    button.querySelector('.hobby-name').textContent = hobby.title;
    button.querySelector('.hobby-short').textContent = hobby.short;
    hobbyGrid.appendChild(button);
  });
}

renderPortfolioData();

const scrapbookPageOrder = ['projects', 'skills', 'achievements', 'goals', 'hobbies', 'research', 'hackathons'];

document.querySelectorAll('.scrapbook-section').forEach(function(section) {
  const backButton = document.createElement('button');
  backButton.className = 'section-back-button';
  backButton.type = 'button';
  backButton.textContent = 'Back to Pages';

  const pageIndex = scrapbookPageOrder.indexOf(section.id);
  const pageControls = document.createElement('nav');
  pageControls.className = 'page-turn-controls';
  pageControls.setAttribute('aria-label', 'Scrapbook page navigation');

  const previousButton = document.createElement('button');
  previousButton.className = 'page-turn-button previous-page';
  previousButton.type = 'button';
  previousButton.dataset.pageTarget = pageIndex > 0 ? scrapbookPageOrder[pageIndex - 1] : 'scrapbook-menu';
  previousButton.textContent = pageIndex > 0 ? 'Previous Page' : 'Chapter Index';

  const nextButton = document.createElement('button');
  nextButton.className = 'page-turn-button next-page';
  nextButton.type = 'button';
  nextButton.dataset.pageTarget = pageIndex < scrapbookPageOrder.length - 1 ? scrapbookPageOrder[pageIndex + 1] : 'scrapbook-menu';
  nextButton.textContent = pageIndex < scrapbookPageOrder.length - 1 ? 'Next Page' : 'Chapter Index';

  pageControls.appendChild(previousButton);
  pageControls.appendChild(nextButton);
  section.prepend(pageControls);
  section.prepend(backButton);
});

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
const letterForm = document.querySelector('.letter-form');
const letterStatus = document.querySelector('.letter-status');

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

letterForm.addEventListener('submit', function(event) {
  const hasEndpoint = letterForm.action && !letterForm.action.endsWith(window.location.pathname);

  if (!hasEndpoint) {
    event.preventDefault();
    letterStatus.textContent = 'Add a Formspree endpoint in data.js so this letter can arrive in Gmail.';
    return;
  }

  sendLetterButton.textContent = 'Sending...';
  letterStatus.textContent = 'Sending your letter...';
});

const mainTitle = document.querySelector('#main-title');
const openBookButton = document.querySelector('.open-book-button');
const backToCoverButton = document.querySelector('.back-to-cover');

function openCurtain() {
  document.body.classList.add('open-curtain');
  setActiveDot('polaroid-page');
}

mainTitle.addEventListener('click', openCurtain);
openBookButton.addEventListener('click', openCurtain);

backToCoverButton.addEventListener('click', function() {
  const allSections = document.querySelectorAll('.scrapbook-section');

  allSections.forEach(function(scrapbookSection) {
    scrapbookSection.classList.remove('active-section');
  });

  document.body.classList.remove('open-curtain', 'paper-pulled');
  paperHasPulled = false;
  setActiveDot('');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

let paperHasPulled = false;
let wheelPageTurnLocked = false;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

function shouldIgnorePageTurn(event) {
  return event.target.closest('.ai-panel, .contact-card, .letter-form');
}

function pullToChapterIndex() {
  paperHasPulled = true;
  document.body.classList.add('paper-pulled');
  setActiveDot('scrapbook-menu');

  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
}

function isActiveSectionAtEdge(activeSection, edge) {
  const sectionTop = activeSection.offsetTop;
  const sectionBottom = sectionTop + activeSection.scrollHeight;

  if (edge === 'top') {
    return window.scrollY <= sectionTop + 16;
  }

  return window.scrollY + window.innerHeight >= sectionBottom - 16;
}

function turnPageFromScroll(direction) {
  const activeSection = document.querySelector('.scrapbook-section.active-section');

  if (!activeSection || wheelPageTurnLocked) {
    return false;
  }

  const activeIndex = scrapbookPageOrder.indexOf(activeSection.id);

  if (activeIndex === -1) {
    return false;
  }

  wheelPageTurnLocked = true;

  setTimeout(function() {
    wheelPageTurnLocked = false;
  }, 900);

  if (direction === 'next') {
    if (activeIndex < scrapbookPageOrder.length - 1) {
      showScrapbookSection(scrapbookPageOrder[activeIndex + 1]);
    } else {
      showScrapbookMenu();
    }

    return true;
  }

  if (activeIndex > 0) {
    showScrapbookSection(scrapbookPageOrder[activeIndex - 1]);
  } else {
    showScrapbookMenu();
  }

  return true;
}

window.addEventListener('wheel', function(event) {
  if (paperHasPulled === true && !shouldIgnorePageTurn(event)) {
    const activeSection = document.querySelector('.scrapbook-section.active-section');

    if (activeSection) {
      const atTop = isActiveSectionAtEdge(activeSection, 'top');
      const atBottom = isActiveSectionAtEdge(activeSection, 'bottom');

      if (event.deltaY > 0 && atBottom && turnPageFromScroll('next')) {
        event.preventDefault();
        return;
      }

      if (event.deltaY < 0 && atTop && turnPageFromScroll('previous')) {
        event.preventDefault();
        return;
      }
    }
  }

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
    pullToChapterIndex();
  }
}, { passive: false });

document.addEventListener('touchstart', function(event) {
  if (shouldIgnorePageTurn(event)) {
    return;
  }

  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', function(event) {
  if (shouldIgnorePageTurn(event) || touchStartTime === 0) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const elapsed = Date.now() - touchStartTime;

  touchStartTime = 0;

  if (elapsed > 900 || absY < 64 || absY < absX * 1.25) {
    return;
  }

  const swipedUp = deltaY < 0;
  const swipedDown = deltaY > 0;

  if (swipedUp && document.body.classList.contains('open-curtain') && paperHasPulled === false) {
    pullToChapterIndex();
    return;
  }

  if (paperHasPulled !== true) {
    return;
  }

  const activeSection = document.querySelector('.scrapbook-section.active-section');

  if (!activeSection) {
    if (swipedUp) {
      showScrapbookSection(scrapbookPageOrder[0]);
    }

    return;
  }

  if (swipedUp && isActiveSectionAtEdge(activeSection, 'bottom')) {
    turnPageFromScroll('next');
  }

  if (swipedDown && isActiveSectionAtEdge(activeSection, 'top')) {
    turnPageFromScroll('previous');
  }
}, { passive: true });

const menuButtons = document.querySelectorAll('.menu-boxes button');
const backToPolaroidButton = document.querySelector('.back-to-polaroid');
const sideDots = document.querySelectorAll('.side-dot');
const sectionBackButtons = document.querySelectorAll('.section-back-button');
const pageTurnButtons = document.querySelectorAll('.page-turn-button');

function setActiveDot(sectionId) {
  sideDots.forEach(function(dot) {
    dot.classList.toggle('active-dot', dot.dataset.jump === sectionId);
  });
}

function clearActiveSections() {
  document.querySelectorAll('.scrapbook-section').forEach(function(scrapbookSection) {
    scrapbookSection.classList.remove('active-section');
  });
}

function showScrapbookMenu() {
  clearActiveSections();
  document.body.classList.add('open-curtain', 'paper-pulled');
  paperHasPulled = true;
  setActiveDot('scrapbook-menu');

  document.querySelector('#scrapbook-menu').scrollIntoView({
    behavior: 'smooth'
  });
}

function showScrapbookSection(sectionId) {
  const section = document.querySelector('#' + sectionId);

  if (!section) {
    return;
  }

  clearActiveSections();
  document.body.classList.add('open-curtain', 'paper-pulled');
  paperHasPulled = true;
  section.classList.add('active-section');
  setActiveDot(sectionId);

  section.scrollIntoView({
    behavior: 'smooth'
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

sectionBackButtons.forEach(function(button) {
  button.addEventListener('click', showScrapbookMenu);
});

pageTurnButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    if (button.dataset.pageTarget === 'scrapbook-menu') {
      showScrapbookMenu();
      return;
    }

    showScrapbookSection(button.dataset.pageTarget);
  });
});

menuButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    showScrapbookSection(button.dataset.section);
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

    if (sectionId === 'scrapbook-menu') {
      showScrapbookMenu();
      return;
    }

    showScrapbookSection(sectionId);
  });
});

const hobbyDetails = window.portfolioTemplateState?.hobbyDetails || {
  dance: {
    title: 'Dancing',
    text: 'Kathak is one of the ways I understand discipline, expression, and storytelling. The rhythm, footwork, spins, and gestures make dance feel both intellectual and emotional to me, almost like solving a pattern while still leaving room for feeling.',
    image: 'dance.jpg',
    caption: 'Kathak rhythm'
  },
  writing: {
    title: 'Creative Writing',
    text: 'Writing helps me slow down and understand my thoughts better. I like turning small observations, feelings, and ideas into something with voice and shape.',
    image: '',
    caption: ''
  },
  reading: {
    title: 'Reading',
    text: 'Reading keeps me curious. Whether it is research, technology, or reflective writing, I like learning how other people think and seeing the world through different perspectives.',
    image: '',
    caption: ''
  },
  travel: {
    title: 'Travel',
    text: 'I want to travel for fun, but also to know local people and their stories. I think places teach you things that classrooms and screens cannot always teach.',
    image: '',
    caption: ''
  }
};

const hobbyTiles = document.querySelectorAll('.hobby-tile');
const hobbyDetail = document.querySelector('.hobby-detail');
const hobbyPhotoFrame = document.querySelector('.hobby-photo-frame');
const hobbyPhoto = document.querySelector('.hobby-photo');
const hobbyPhotoCaption = document.querySelector('.hobby-photo-frame figcaption');

hobbyTiles.forEach(function(tile) {
  function showHobby() {
    const selectedHobby = hobbyDetails[tile.dataset.hobby];

    hobbyTiles.forEach(function(otherTile) {
      otherTile.classList.remove('active-hobby');
    });

    tile.classList.add('active-hobby');
    hobbyDetail.querySelector('h3').textContent = selectedHobby.title;
    hobbyDetail.querySelector('p:last-child').textContent = selectedHobby.text;

    if (selectedHobby.image) {
      hobbyPhotoFrame.classList.add('hidden-photo');
      hobbyPhoto.src = selectedHobby.image;
      hobbyPhoto.alt = 'Pronita dancing Kathak';
      hobbyPhotoCaption.textContent = selectedHobby.caption;

      if (hobbyPhoto.complete && hobbyPhoto.naturalWidth > 0) {
        hobbyPhotoFrame.classList.remove('hidden-photo');
      }
    } else {
      hobbyPhotoFrame.classList.add('hidden-photo');
    }
  }

  tile.addEventListener('click', showHobby);
  tile.addEventListener('mouseenter', showHobby);
});

hobbyPhoto.addEventListener('error', function() {
  hobbyPhotoFrame.classList.add('hidden-photo');
});

hobbyPhoto.addEventListener('load', function() {
  hobbyPhotoFrame.classList.remove('hidden-photo');
});

const achievementDetails = window.portfolioTemplateState?.achievementDetails || {
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
  'resident-assistant': {
    label: 'leadership star',
    title: 'Resident Assistant',
    text: 'Appointed as a Resident Assistant for Fall 2026, a role where I can support students, build community, and grow as a grounded campus leader.'
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

const goalDetails = window.portfolioTemplateState?.goalDetails || {
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

const aiWidget = document.querySelector('.ai-widget');
const aiButton = document.querySelector('.ai-button');
const aiClose = document.querySelector('.ai-close');
const aiForm = document.querySelector('.ai-form');
const aiInput = document.querySelector('.ai-input');
const aiMessages = document.querySelector('.ai-messages');
const aiSuggestionButtons = document.querySelectorAll('.ai-suggestions button');

function addAiMessage(text, sender) {
  const message = document.createElement('div');
  message.className = 'ai-message ' + sender + '-message';
  message.textContent = text;
  aiMessages.appendChild(message);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function listTitles(items) {
  return items.map(function(item) {
    return item.title;
  }).join(', ');
}

function listDetailedItems(items) {
  return items.map(function(item) {
    return item.title + ': ' + item.text;
  }).join(' ');
}

function listSkillItems(skills) {
  return Object.keys(skills).filter(function(group) {
    return group !== 'summary';
  }).map(function(group) {
    return group + ': ' + skills[group].join(', ');
  }).join('. ');
}

function getPortfolioAnswer(question) {
  const lowerQuestion = question.toLowerCase();
  const data = typeof portfolioData !== 'undefined' ? portfolioData : null;

  if (!data) {
    return 'I can answer once the portfolio data file is loaded.';
  }

  if (lowerQuestion === 'hi' || lowerQuestion === 'hello' || lowerQuestion === 'hey' || lowerQuestion.includes('good morning') || lowerQuestion.includes('good afternoon') || lowerQuestion.includes('good evening')) {
    return "Hello! I am Pronita's portfolio guide. You can ask me about her projects, skills, achievements, research, goals, hobbies, or why she would be a strong hire.";
  }

  if (lowerQuestion.includes('thank')) {
    return "You are welcome! I am happy to help you explore Pronita's work.";
  }

  if (lowerQuestion.includes('who are you') || lowerQuestion.includes('what can you do')) {
    return "I am a small interactive guide for this portfolio. I can summarize Pronita's projects, skills, achievements, research, goals, hobbies, contact details, and featured case study.";
  }

  if (lowerQuestion.includes('hire') || lowerQuestion.includes('why pronita') || lowerQuestion.includes('recruiter')) {
    return data.owner.firstName + ' combines computer science, mathematics, creative communication, leadership, and project-building energy. She is early-career, but she shows strong signals big teams care about: curiosity, consistency, empathy for users, and the discipline to keep learning hard technical skills.';
  }

  if (lowerQuestion.includes('skill') || lowerQuestion.includes('tech') || lowerQuestion.includes('technology') || lowerQuestion.includes('stack')) {
    return 'Skill snapshot: ' + listSkillItems(data.skills) + '.';
  }

  if (lowerQuestion.includes('strongest') || lowerQuestion.includes('materna') || lowerQuestion.includes('case study')) {
    return data.featuredProject.title + ' is the featured project. ' + data.featuredProject.summary + ' Engineering focus: ' + data.featuredProject.engineering + ' Stack and concepts: ' + data.featuredProject.stack.join(', ') + '.';
  }

  if (lowerQuestion.includes('resume')) {
    return 'Use the Resume link in the contact card. Before submitting, make sure Pronita-Ghimire-Resume.pdf is in the same folder as this website.';
  }

  if (lowerQuestion.includes('project')) {
    return data.owner.firstName + "'s projects include " + listTitles(data.projects) + '. The featured case study is ' + data.featuredProject.title + ', which shows product thinking, user empathy, and engineering growth.';
  }

  if (lowerQuestion.includes('achievement') || lowerQuestion.includes('star') || lowerQuestion.includes('resident') || lowerQuestion.includes('ambassador')) {
    return 'Achievement highlights: ' + listTitles(data.achievements) + '. The constellation includes academic, leadership, campus, growth, and creative stars.';
  }

  if (lowerQuestion.includes('hobby') || lowerQuestion.includes('hobbies') || lowerQuestion.includes('dance') || lowerQuestion.includes('dancing') || lowerQuestion.includes('kathak')) {
    return 'Outside of coding, ' + data.owner.firstName + ' enjoys ' + listTitles(data.hobbies) + '. ' + listDetailedItems(data.hobbies);
  }

  if (lowerQuestion.includes('goal') || lowerQuestion.includes('future')) {
    return 'Her goals include ' + listTitles(data.goals) + '. ' + listDetailedItems(data.goals);
  }

  if (lowerQuestion.includes('research') || lowerQuestion.includes('article')) {
    return 'Research and writing highlights include ' + listTitles(data.research) + '.';
  }

  if (lowerQuestion.includes('contact') || lowerQuestion.includes('email')) {
    return 'You can contact ' + data.owner.firstName + ' at ' + data.contact.email + ', or use the letter form in the contact card.';
  }

  return 'Try asking about projects, skills, the featured case study, why Pronita would be a strong hire, achievements, goals, research, or contact info.';
}

function askPortfolioGuide(question) {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) {
    return;
  }

  addAiMessage(cleanQuestion, 'user');

  setTimeout(function() {
    addAiMessage(getPortfolioAnswer(cleanQuestion), 'bot');
  }, 260);
}

aiButton.addEventListener('click', function() {
  aiWidget.classList.toggle('open');
});

aiClose.addEventListener('click', function() {
  aiWidget.classList.remove('open');
});

aiForm.addEventListener('submit', function(event) {
  event.preventDefault();
  askPortfolioGuide(aiInput.value);
  aiInput.value = '';
});

aiSuggestionButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    askPortfolioGuide(button.dataset.question);
  });
});
