document.addEventListener('DOMContentLoaded',function(){
    const allButtons= document.querySelectorAll('.searchBtn'); 
    const searchBar = document.querySelector('.searchBar'); 
    const searchInupt = document.getElementById('searchInupt'); 
    const searchClose= document.getElementById('searchClose'); 
    for(let i =0; i<allButtons.length; i++){
        allButtons[i].addEventListener('click',function(){
            searchBar.style.visibility='visible'; 
            searchBar.classList.add('open'); 
            this.setAttribute('aria-expanded','true'); 
            searchInput.focus(); 
        }); 
    }
    searchClose.addEventListener('click',function(){
        searchBar.style.visibility='hidden'; 
        searchClose.classList.remove('open'); 
        this.setAttribute('aria-expanded','false'); 
    }); 
}); 