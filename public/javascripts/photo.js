// 上传图片(unfinish)
function uploadPhoto() {
  var form = document.getElementById("uploadForm");
  var formData = new FormData(form);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/photos", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      // 上传成功，刷新已上传照片列表
    } else {
      console.error("文件上传失败：", xhr.statusText);
    }
  };

  xhr.send(formData);
}
let start = [0, 0]; // 刷新数
let stateFlag = [false, false]; // (false未等待刷新,true未刷新中)
const wallId = location.pathname.split("/")[2];

const listBtn = Array.from(document.getElementsByClassName("listBtn"));
const List = Array.from(document.getElementsByClassName("listItem"));
console.log(List);
let listshow = 0;

// 0 photolist
/**
 * 动态刷新图片
 * @returns void
 */
function loadPhotos() {
  if (stateFlag[0]) return; // 刷新中则退出
  stateFlag[0] = true;

  var xhr = new XMLHttpRequest();
  /**
   * params(路由路径参数)
   * wallId 墙的ID
   * start  已刷新数
   */
  xhr.open("GET", `/api/photos/${wallId}/${start[0]}`, true);
  xhr.onload = function () {
    if (xhr.readyState === 4) {
      stateFlag[0] = false;
      if (xhr.status === 200) {
        // 清空已上传照片列表
        const container = List[0];

        // 解析服务器返回的JSON数据
        var { photos, end } = JSON.parse(xhr.responseText).data;
        console.log(photos, end);
        // 更新已上传照片列表
        if (photos.length != 0) {
          photos.forEach((photo) => {
            var item = document.createElement("div");
            item.className = "photoItem";
            var a = document.createElement("a");
            a.href = photo.oldFilenameUrl;
            var img = document.createElement("img");
            //img.src = `data:image/jpeg;base64,${photo.image}`; // 图片地址
            img.src = photo.newFilenameUrl; // 图片地址
            img.alt = photo.filename; // 图片文件名作为alt文本
            img.className = "photo";
            a.appendChild(img);
            item.appendChild(a);
            container.appendChild(item);
          });
        } else {
          // 当全部刷新完后阻止刷新
          stateFlag[0] = true;
        }
        start[0] = Number(end);
      } else {
        console.error("获取已上传照片列表失败：", xhr.statusText);
      }
    }
  };

  xhr.send();
}

// 1 videolist
/**
 * 动态刷新视频
 * @marked unfinish
 * @returns void
 */
function loadVideos() {
  if (stateFlag[1]) return;
  stateFlag[1] = true;

  var xhr = new XMLHttpRequest();
  /**
   * params(路由路径参数)
   * wallId 墙的ID
   * start  已刷新数
   */
  xhr.open("GET", `/api/videos/${wallId}/${start[1]}`, true);
  xhr.onload = function () {
    if (xhr.readyState === 4) {
      stateFlag[1] = false;
      if (xhr.status === 200) {
        // 清空已上传照片列表
        const container = document.getElementById("videoList");

        // 解析服务器返回的JSON数据
        var { videos, end } = JSON.parse(xhr.responseText).data;
        console.log(videos, end);
        // 更新已上传照片列表
        if (videos.length != 0) {
          videos.forEach((video) => {
            var item = document.createElement("div");
            item.className = "photoItem";
            var a = document.createElement("a");
            a.href = video.oldFilenameUrl;
            var img = document.createElement("img");
            //img.src = `data:image/jpeg;base64,${photo.image}`; // 图片地址
            img.src = video.newFilenameUrl; // 图片地址
            img.alt = video.filename; // 图片文件名作为alt文本
            img.className = "photo";
            a.appendChild(img);
            item.appendChild(a);
            container.appendChild(item);
          });
        } else {
          stateFlag[1] = true;
        }
        start[1] = Number(end);
      } else {
        console.error("获取已上传照片列表失败：", xhr.statusText);
      }
    }
  };

  xhr.send();
}

// 根据显示列表刷新
function load() {
  if (listshow === 0) {
    loadPhotos();
  } else if (listshow === 1) {
    loadVideos();
  }
}

const scrollDiv = document.getElementById("scrollDiv");

window.addEventListener("load", load);

// 检测滚动条至底
scrollDiv.addEventListener("scroll", () => {
  if (
    scrollDiv.clientHeight + scrollDiv.scrollTop >=
    scrollDiv.scrollHeight - 150
  ) {
    load();
  }
});

function showPhoto() {}

// 列表切换按钮设置
listBtn.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    List[listshow].classList.add("hiddenList");
    listBtn[listshow].classList.remove("clickBtn");
    List[index].classList.remove("hiddenList");
    listBtn[index].classList.add("clickBtn");
    listshow = index;
  });
});
