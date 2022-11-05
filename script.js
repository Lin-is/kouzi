const callbackLinks = document.querySelectorAll('.callback-link');
const body = document.body;
const lockPadding = document.querySelectorAll('.lock-padding');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const menuLinks = document.querySelectorAll('.header_menu-item[data-goto]');
const menuIcon = document.querySelector('.header_menu-icon');
const menu = document.querySelector('.header_menu');
const additBtns = document.querySelectorAll('.catalog_toggle-addit');
const firstAdditBtn = document.querySelector('.catalog_first-toggle');
const secAdditBtn = document.querySelector('.catalog_sec-toggle');
const catalogAdditContainer = document.querySelector('.catalog-line_addit');
const callbackForms = document.querySelectorAll('.callback-form');

let unlock = true;
const transitionTime = 400;

const div = document.createElement('div');
div.style.overflowY = 'scroll';
div.style.width =  '50px';
div.style.height = '50px';
div.style.visibility = 'hidden';
document.body.appendChild(div);
const lockPaddingValue = div.offsetWidth - div.clientWidth + 'px';
document.body.removeChild(div);

// if (callbackLinks.length > 0) {
//   for (let i = 0; i <= callbackLinks.length; i++) {
//     const callbackLink = callbackLinks[i];
//     console.log(callbackLinks[i]);
//     console.log(callbackLink);
//     callbackLink.addEventListener('click', function(e) {
//         const modalName = callbackLink.getAttribute('href').replace('#', '');
//         const currentModal = document.getElementById(modalName);
//         modalOpen(currentModal);
//         e.preventDefault();
//     });
//   }
// }

if (callbackLinks.length > 0) {
  for (const callbackLink of callbackLinks) {
    callbackLink.addEventListener('click', function(e) {
        const modalName = callbackLink.getAttribute('href').replace('#', '');
        const itemName = (modalName === 'modal_from-catalog') ? callbackLink.previousElementSibling.previousElementSibling.innerHTML : '';
        console.log(itemName);
        const currentModal = document.getElementById(modalName);
        modalOpen(currentModal, itemName);
        e.preventDefault();
    });
  }
}

// if (modalCloseBtns.length > 0) {
//   for (let i = 0; i <= modalCloseBtns.length; i++) {
//     const closeBtn = modalCloseBtns[i];
//     console.log(modalCloseBtns[i]);
//     console.log(closeBtn);
//     closeBtn.addEventListener("click", function(e) {
//       modalClose(e.target.closest('.modal'));
//       e.preventDefault();
//     });
//   }
// }

if (modalCloseBtns.length > 0) {
  for (const closeBtn of modalCloseBtns) {
    closeBtn.addEventListener("click", function(e) {
      modalClose(e.target.closest('.modal'));
      e.preventDefault();
    });
  }
}

// валидация формы



// Отправка формы

if (callbackForms.length > 0) {
  for (const form of callbackForms) {
    form.addEventListener('submit', sendForm);
  }
}

async function sendForm(e) {
  e.preventDefault();

  const form = e.target;
  form.closest('.form_body').classList.add('_sending');

  let formData = new FormData(form);
  let response = await fetch('sendmail.php', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    let result = await response.json();
    alert(result.message);
    form.reset();
    form.closest('.form_body').classList.remove('_sending');
  } else {
    alert('Ошибка, попробуйте еще раз');
    form.closest('.form_body').classList.remove('_sending');
  }
}

// показать/скрыть дополнительные карточки в каталоге

if (additBtns.length > 0) {
  for (const additBtn of additBtns) {
    additBtn.addEventListener("click", additBtnListener);
  }
}

function additBtnListener(e) {
  let isDivOpened = (catalogAdditContainer && catalogAdditContainer.classList.contains('hidden')) ? true : false;

  for (const additBtn of additBtns) {
    additBtnChangeText(additBtn, isDivOpened);
  }

  catalogAdditContainer.classList.toggle('hidden');
  secAdditBtn.classList.toggle('hidden');
  e.preventDefault();
}

function additBtnChangeText (btn, isDivOpened) {
  let btnText = "Показать дополнительные товары";
  if (isDivOpened) {
    btnText = "Скрыть дополнительные товары";
  }
  btn.firstChild.removeChild(btn.firstChild.firstChild);
  btn.firstChild.appendChild(document.createTextNode(btnText));
}

// модалки

function modalOpen(currentModal, itemName) {
  if (currentModal && unlock) {
    const modalActive = document.querySelector('.modal.open');
    if (modalActive) {
      modalClose(modalActive, false);
    } else {
      bodyLock();
    }
    currentModal.classList.add('open');

    // подстановка названия товара в форму
    if (itemName) {
      currentModal.firstElementChild.children[1].getElementsByTagName('textarea')[0].innerHTML = itemName;
    }

    currentModal.addEventListener('click', function (e) {
      if (!e.target.closest('.modal_window')) {
        modalClose(e.target.closest('.modal'));
      }
    });  
  }
}

function modalClose(modalActive, doUnlock = true) {
  if (unlock) {
    modalActive.classList.remove('open');
    if (doUnlock) {
      bodyUnlock();
    }
  }
}

function bodyLock() {
  if (lockPadding.length > 0) {
    for (let i = 0; i < lockPadding.length; i++) {
      const element = lockPadding[i];
      element.getElementsByClassName.paddingRight = lockPaddingValue;
    }
  }
  console.log(lockPaddingValue);
  body.style.paddingRight = lockPaddingValue;
  // body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(()=> {
    unlock = true;
  }, transitionTime);
}

function bodyUnlock() {
  setTimeout(() => {
    if (lockPadding.length > 0) {
      for (let i =0;i < lockPadding.length; i++) {
        const element = lockPadding[i];
        element.style.paddingRight = '0px'; 
      }
    }

    body.style.paddingRight = '0px';
    body.classList.remove('lock');

  }, transitionTime);

  unlock = false;
  setTimeout(() => {
    unlock = true;
  }, transitionTime);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    const modalActive = document.querySelector('.modal.open');
    modalClose(modalActive);
  }
});

(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      const node = this;
      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }
})();

(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }
})();


// Прокрутка к секциям 

if (menuLinks.length > 0) {
  for (const menuLink of menuLinks) {
    menuLink.addEventListener('click', (e) => {
      const link = e.target.parentElement;
      if (link.dataset.goto && document.querySelector(link.dataset.goto)) {
        const gotoSection = document.querySelector(link.dataset.goto);
        const gotoSectionVal = gotoSection.getBoundingClientRect().top + window.pageYOffset;
        
        if (menuIcon.classList.contains('open')) {
          body.classList.remove('lock');
          menuIcon.classList.remove('open');
          menu.classList.remove('open');
        }

        scrollToSmoothly(gotoSectionVal);
      }
      e.preventDefault();
    });
  }
}

// Меню бургер

if (menuIcon) {
  menuIcon.addEventListener('click', (e) => {
    body.classList.toggle('lock');
    menuIcon.classList.toggle('open');
    menu.classList.toggle('open');
  });
}


// Кнопка для возврата наверх

(function() {
  'use strict';

  function trackScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopBtn.classList.add('btn_goup-show');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('btn_goup-show');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  var goTopBtn = document.querySelector('.btn_goup');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);
})();

/*
   @param time: the exact amount of time the scrolling will take (in milliseconds)
   @param pos: the y-position to scroll to (in pixels)
*/
function scrollToSmoothly(pos, time) {
  var currentPos = window.pageYOffset;
  var start = null;
  if(time == null) time = 1000;
  pos = +pos, time = +time;
  window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      var progress = currentTime - start;
      if (currentPos < pos) {
          window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
      } else {
          window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
      }
      if (progress < time) {
          window.requestAnimationFrame(step);
      } else {
          window.scrollTo(0, pos);
      }
  });
}

