let mainDivsFadeInTimeOut;
// Variable to store the value of the requestAnimationFrame called below

window.addEventListener('scroll', () => {
  requestAnimationFrame(headerSlideAnimation);
  // From header-animation.js

  if (mainDivsFadeIn.completed) {
    cancelAnimationFrame(mainDivsFadeInTimeOut);
    // Cancel the requestAnimationFrame for mainDivsFadeIn once all the main sections are shown
  }

  mainDivsFadeInTimeOut = requestAnimationFrame(mainDivsFadeIn.run);
  // From main-sections.js
});
