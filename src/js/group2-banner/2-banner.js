const scrollToAbout = () => {
  scrollToElement('.main-about');
};

document
  .querySelector('.banner button')
  .addEventListener('click', scrollToAbout);
