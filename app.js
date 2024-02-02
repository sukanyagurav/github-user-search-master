const toggleTheme =document.querySelector('.toggle')
const form= document.querySelector('.search')

const template = document.getElementById('user-details')
const resultContainer = document.querySelector('.user-container')

//toggle functionality
toggleTheme.addEventListener('click',(e)=>{
    document.body.classList.toggle('dark')
    const text=  document.querySelector('.toggle-state')
    if(document.body.classList.contains('dark')){
      text.innerHTML='Light'
    }else{
        text.innerHTML='Dark'
    }
})

form.addEventListener('submit',async function(e){
  e.preventDefault()
  const formInput = document.querySelector('#username')
  if(formInput.value.trim() ===''){
    form.classList.add('show')
    form.classList.add('invalid')
    setTimeout(()=>{
      form.classList.remove('show')
      form.classList.remove('invalid')
    },1500)
    return 
  }
  
  await fetchData(formInput.value.trim())
  formInput.value=''
})
function render(data){
  const templateEle= document.importNode(template.content,true)
  //user image
  const userImages=templateEle.querySelectorAll('.user-image')
  userImages.forEach(userImage=>{
    userImage.src=data.avatar_url
  })
  // user name
  const userName=templateEle.querySelector('.user-name')
  // userName.classList.add('textAnimation')
  if(data.name){
    if(data.name.length >=15 ){
      userName.classList.add('small')
    }else{
      userName.classList.remove('small')
    }
    userName.innerText = data.name
  }else{
    userName.innerText = data.login
  }
  // user id
  const userId=templateEle.querySelector('.user-id')
  userId.innerText = `@${data.login}`
  // userId.classList.add('textAnimation')
  // date
  const userJoined=templateEle.querySelector('.user-joined')
  const dateString=new Date(data.created_at).toDateString().split(' ')
  
  const date = `Joined ${dateString[2]} ${dateString[1]} ${dateString[3]}`
  userJoined.innerText=date
  // userJoined.classList.add('textAnimation')

  // bio
  const userBio=templateEle.querySelector('.user-bio')
  if(!data.bio || data.bio.length<1){
    userBio.style.color='#697c9a'
    userBio.innerText='This profile has no bio'
  }
  else{
    userBio.innerText = data.bio
  }
  
  // stats
  const userRepoStat=templateEle.querySelector('.user-repo-stat')
  userRepoStat.innerText = data.public_repos
  const userFollowerStat=templateEle.querySelector('.user-follower-stat')
  userFollowerStat.innerText = data.followers
  const userFollowingStat=templateEle.querySelector('.user-following-stat')
  userFollowingStat.innerText = data.following

//  location
  const userLocation=templateEle.querySelector('.user-location')
  if(!data.location || data.location.length<1){
    userLocation.innerText ='Not Available'
    userLocation.parentElement.classList.add('not-available')
  }else{
    userLocation.parentElement.classList.remove('not-available')
    userLocation.innerText = data.location
  }
  // twitter
  const userTwitter=templateEle.querySelector('.user-twitter')
  if(!data.twitter_username || data.twitter_username.length<1){
    userTwitter.innerText ='Not Available'
    userTwitter.parentElement.classList.add('not-available')
  }else{
    userTwitter.parentElement.classList.remove('not-available')
    userTwitter.innerText = data.twitter_username
    userTwitter.href=`https://twitter.com/${data.twitter_username}`
  }

//  website
  const userWebsite=templateEle.querySelector('.user-website')
  if(!data.blog || data.blog.length<1){
    userWebsite.innerText ='Not Available'
    userWebsite.parentElement.classList.add('not-available')
  }else{
    userWebsite.parentElement.classList.remove('not-available')
    let  modified 
    if(data.blog.match(/\//)){
      modified = data.blog.split('/')[2]
    }
    else{
      modified=data.blog
    }
    userWebsite.innerText = modified
    userWebsite.href=data.blog
  }
  // oragnization
  const userOragnization=templateEle.querySelector('.user-organization')
  
  if(!data.company || data.company.length<1){
    userOragnization.innerText ='Not Available'
    userOragnization.parentElement.classList.add('not-available')
  }else{
    if(data.company.length >=10 ){
      userOragnization.classList.add('small')
    }else{
      userOragnization.classList.remove('small')
    }
    userOragnization.parentElement.classList.remove('not-available')
    userOragnization.innerText = data.company
    userOragnization.href=data.html_url
  }

  resultContainer.appendChild(templateEle)
 
}
async function fetchData(query){
  try{
    const username = query.replace(/\s+/g,'').toLowerCase()
    clearElement(resultContainer)
    const response = await fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()
    if(!response.ok){
      if(data.message== 'Not Found'){
        const error =document.createElement('p')
        error.style.color='#f74646'
        error.innerText = 'User not found!'
        resultContainer.appendChild(error)
        return
      }
    } 
    else{
      render(data)
    }
    
  }catch(e){
      const error =document.createElement('p')
      error.style.color='#f74646'
      error.innerText = 'Oops something went wrong!'
      resultContainer.appendChild(error)
  }
}
// clearElement(resultContainer)
fetchData('The Octocat')
function clearElement(element){
  while(element.firstChild){
    element.removeChild(element.firstChild)
}
}