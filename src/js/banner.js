const scrollToAbout = () => {
  smoothScroll(document.querySelector('.main-about'), 500, 'easeInQuad');
};

document
  .querySelector('.banner button')
  .addEventListener('click', scrollToAbout);