let lastScrollTop = 0; // Change const to let
const header = document.querySelector('header');
window.addEventListener('scroll', onScroll);

function onScroll() {
  var scrollTop = window.scrollX || document.documentElement.scrollTop; // Fix document reference
  if (scrollTop > lastScrollTop) {
    header.style.top = '-141px';
  } else {
    header.style.top = '0';
  }
  lastScrollTop = scrollTop;
}
