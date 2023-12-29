/*
function uploadWall() {
    var form = document.getElementById('uploadForm');
    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/walls', true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // 上传成功，刷新已上传照片列表
        
      } else {
        console.error('文件上传失败：', xhr.statusText);
      }
    };

    xhr.send(formData);
}*/
let start = 0;
let stateFlag = false;

function loadWalls() {
    if (stateFlag) return;
    stateFlag = true;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/walls/${start}`, true);
    xhr.onload = function () {
      if (xhr.readyState === 4){
        stateFlag = false;
        if (xhr.status === 200) {
          // 清空已上传照片列表
          const container = document.getElementById('wallList');

          // 解析服务器返回的JSON数据
          var {walls, end} = JSON.parse(xhr.responseText).data;
          console.log(walls, end);
          // 更新已上传照片列表
          if (walls.length != 0){
            walls.forEach(wall=>{
              var item = document.createElement('div');
              item.className = 'wallItem';
              var a = document.createElement('a');
              a.href = wall.WallUrl;
              var imgbox = document.createElement('div');
              var img = document.createElement('img');
              //img.src = `data:image/jpeg;base64,${photo.image}`; // 图片地址
              img.src = wall.logoUrl; // 图片地址
              img.alt = wall.wallName; // 图片文件名作为alt文本
              img.className = 'photo';
              var title = document.createElement('h3');
              title.innerText = wall.wallName;
              imgbox.appendChild(img);
              a.appendChild(imgbox);
              a.appendChild(title);
              item.appendChild(a);
              container.appendChild(item);
            });
          }else{
            stateFlag = true;
          }
          start = Number(end);
        } else {
          console.error('获取已上传照片列表失败：', xhr.statusText);
        }
      }
    };

    xhr.send();
}

const scrollDiv = document.getElementById('scrollDiv');

window.addEventListener('load', loadWalls);

// Load more walls when scrolling to the bottom
scrollDiv.addEventListener('scroll', () => {
    if (scrollDiv.clientHeight + scrollDiv.scrollTop >= scrollDiv.scrollHeight - 150) {
        loadWalls();
    }
});

/*=============== SEARCH ===============*/
const search = document.getElementById('search'),
      searchBtn = document.getElementById('search-btn'),
      searchClose = document.getElementById('search-close')

/* Search show */
searchBtn.addEventListener('click', () =>{
   search.classList.add('show-search')
})

/* Search hidden */
searchClose.addEventListener('click', () =>{
   search.classList.remove('show-search')
})

/*=============== LOGIN ===============*/
const login = document.getElementById('login'),
      loginBtn = document.getElementById('login-btn'),
      loginClose = document.getElementById('login-close'),
      loginForm = document.getElementsByClassName('login__form')[0]

/* Login show */
loginBtn.addEventListener('click', () =>{
   login.classList.add('show-login')
})

/* Login hidden */
loginClose.addEventListener('click', () =>{
   login.classList.remove('show-login')
})

loginForm.onsubmit = (e)=>{
  e.preventDefault();
  console.log(loginForm);

  let fd = new FormData(loginForm);
  console.log(fd);
  console.log(fd.get('tel'), fd.get('password'));

  let xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  xhr.open('POST', '/api/login');

  xhr.setRequestHeader('Content-Type','application/json')

  xhr.send(JSON.stringify({tel: fd.get('tel'), password: fd.get('password')}));

  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4 && xhr.status === 200){
      if (xhr.response.code === '0000'){
        login.classList.remove('show-login');
        logoutBtn.classList.remove('btn__hidden');
        loginBtn.classList.add('btn__hidden');
      }
    }
  }
}

/*=============== REG ===============*/

const login__signup = document.getElementsByClassName('login__signup')[0];
const reg = document.getElementById('reg'),
      //regBtn = document.getElementById('reg-btn'),
      regClose = document.getElementById('reg-close'),
      regForm = document.getElementsByClassName('reg__form')[0];

/* reg show */
login__signup.addEventListener('click', () =>{
   reg.classList.add('show-reg')
   login.classList.remove('show-login')
})

/* reg hidden */
regClose.addEventListener('click', () =>{
   reg.classList.remove('show-reg')
})

regForm.onsubmit = (e)=>{
  e.preventDefault();
  console.log(regForm);

  let fd = new FormData(regForm);
  console.log(fd);
  console.log(fd.get('tel'), fd.get('password'));

  let xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  xhr.open('POST', '/api/reg');

  xhr.setRequestHeader('Content-Type','application/json')

  xhr.send(JSON.stringify({tel: fd.get('tel'), password: fd.get('password')}));

  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4 && xhr.status === 200){
      if (xhr.response.code === '0000'){
        reg.classList.remove('show-reg');
      }
    }
  }
}

/*=============LOGOUT=============*/

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
  let xhr = new XMLHttpRequest();

  xhr.open('POST', '/api/logout');

  xhr.send();

  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4 && xhr.status === 200){
      logoutBtn.classList.add('btn__hidden');
      loginBtn.classList.remove('btn__hidden');
    }
  }
})
