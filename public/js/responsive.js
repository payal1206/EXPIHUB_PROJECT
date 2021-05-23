burger = document.querySelector('.burger')
nav = document.querySelector('.nav')
navList = document.querySelector('.navlist')

burger.addEventListener('click', ()=>{
    navList.classList.toggle('v-class-resp');
    nav.classList.toggle('h-nav-resp'); 
})