const toggleTheme =document.querySelector('.toggle')

toggleTheme.addEventListener('click',(e)=>{
    document.body.classList.toggle('dark')
    const text=  document.querySelector('.toggle-state')
    if(document.body.classList.contains('dark')){
      text.innerHTML='Light'
    }else{
        text.innerHTML='Dark'
    }
})