var express = require("express");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var sharp = require("sharp");
var router = express.Router();

const { ImageServer } = require("../../config/config");
const PhotoModel = require("../../models/PhotoModel");
const WallModel = require("../../models/WallModel");
const VideoModel = require("../../models/VideoModel");

var photos = [];
let flag = false;
const root = path.resolve(__dirname, "../../public/images");

// 后端临时生成数据库数据
const id = "657a90347c9d2e1e93ef10f2";

const root_video = path.resolve(__dirname, '../../public/videos');
function initPhotos() {
  if (flag) {/*
    let images = fs.readdirSync(path.join(root, "/photo"));
    images.forEach((imagename) => {
      if (fs.statSync(path.join(root, "/photo", imagename)).isFile()) {
        PhotoModel.create({
          wallId: id,
          extname: path.extname(imagename),
        }).then((data) => {
          fs.renameSync(
            path.join(root, "photo", imagename),
            path.join(root, "photo", data._id + path.extname(imagename))
          );

          sharp(
            path.join(root, "photo", data._id + "." + path.extname(imagename))
          )
            .toFormat("webp")
            .resize(250, 150)
            .extract({ width: 250, height: 150, left: 0, top: 0 })
            .toFile(
              path.join(root, "/webphoto", data._id + ".webp"),
              (err, info) => {
                if (err) {
                  throw err;
                }
              }
            );
          photos.push({
            filename: imagename.split(".")[0],
            oldFilename: imagename,
            newFilename: imagename.split(".")[0] + ".webp",
            oldFilenameUrl: "/images/photo/" + imagename,
            newFilenameUrl:
              "/images/webphoto/" + imagename.split(".")[0] + ".webp",
          });
        });
      }
    });
    flag = false;*/

    let videos = fs.readdirSync(path.join(root, "/photo"));
    images.forEach((imagename) => {
      if (fs.statSync(path.join(root, "/photo", imagename)).isFile()) {
        PhotoModel.create({
          wallId: id,
          extname: path.extname(imagename),
        }).then((data) => {
          fs.renameSync(
            path.join(root, "photo", imagename),
            path.join(root, "photo", data._id + path.extname(imagename))
          );

          sharp(
            path.join(root, "photo", data._id + "." + path.extname(imagename))
          )
            .toFormat("webp")
            .resize(250, 150)
            .extract({ width: 250, height: 150, left: 0, top: 0 })
            .toFile(
              path.join(root, "/webphoto", data._id + ".webp"),
              (err, info) => {
                if (err) {
                  throw err;
                }
              }
            );
          photos.push({
            filename: imagename.split(".")[0],
            oldFilename: imagename,
            newFilename: imagename.split(".")[0] + ".webp",
            oldFilenameUrl: "/images/photo/" + imagename,
            newFilenameUrl:
              "/images/webphoto/" + imagename.split(".")[0] + ".webp",
          });
        });
      }
    });
    flag = false;
  }
}
//initPhotos();

// 处理文件上传
router.post("/photos", (req, res) => {
  const form = formidable({
    multiples: true,
    // set root
    uploadDir: path.join(root, "photo"),
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({
        code: "1000",
        msg: "上传失败",
        data: null,
      });
      return;
    }
    //console.log(files);
    let imagename = files.photo.newFilename;

    PhotoModel.create({
      wallId: id,
      extname: path.extname(imagename),
    }).then((data) => {
      fs.renameSync(
        path.join(root, "photo", imagename),
        path.join(root, "photo", data._id + path.extname(imagename))
      );

      sharp(path.join(root, "photo", data._id + path.extname(imagename)))
        .toFormat("webp")
        .resize(250, 150)
        .extract({ width: 250, height: 150, left: 0, top: 0 })
        .toFile(
          path.join(root, "/webphoto", data._id + ".webp"),
          (err, info) => {
            if (err) {
              throw err;
            }
          }
        );

      WallModel.findByIdAndUpdate(id, {size: {$inc: 1}});

      res.json({
        code: "0000",
        msg: "上传成功",
        data: data._id,
      });
    });
  });
});

/**
 * 获取已上传照片列表
 * params(路由路径参数)
 * id 墙的ID
 * start  已刷新数
 */
router.get("/photos/:id/:start", async (req, res) => {
  const perPage = 15;
  const start = Number(req.params.start);
  const id = req.params.id;
  let end = start + perPage;

  WallModel.findById(id).then((data) => {
    if (end >= data.size[0]) end = data.size[0];
    console.log(start, end);
    if (Number(start) == Number(end)) {
      res.json({
        code: "0000",
        msg: "已无图片",
        data: { photos: [], end: end },
      });
    } else {
      let newPhotos = [];
      if (Number(start) < Number(end)) {
        //console.log(photos);
        PhotoModel.find({ wallId: id })
          .sort({ _id: 1 })
          .skip(start)
          .limit(end - start)
          .exec()
          .then((datas) => {
            newPhotos = datas.map((item, index) => {
              return {
                filename: item._id,
                oldFilename: item._id + item.extname,
                newFilename: item._id + ".webp",
                oldFilenameUrl: "/images/photo/" + item._id + item.extname,
                newFilenameUrl: "/images/webphoto/" + item._id + ".webp",
              };
            });
            res.json({
              code: "0000",
              msg: "获取成功",
              data: { photos: newPhotos, end: end },
            });
          });

        //newPhotos = photos.slice(Number(start), Number(end));
      }
    }
  });
});

/**
 * 获取已上传视频列表
 * params(路由路径参数)
 * id 墙的ID
 * start  已刷新数
 */
router.get("/videos/:id/:start", async (req, res) => {
  const perPage = 15;
  const start = Number(req.params.start);
  const id = req.params.id;
  let end = start + perPage;

  WallModel.findById(id).then((data) => {
    if (end >= data.size[1]) end = data.size[1];
    console.log(start, end);
    if (Number(start) == Number(end)) {
      res.json({
        code: "0000",
        msg: "已无视频",
        data: { photos: [], end: end },
      });
    } else {
      let newVideos = [];
      if (Number(start) < Number(end)) {
        //console.log(photos);
        VideoModel.find({ wallId: id })
          .sort({ _id: 1 })
          .skip(start)
          .limit(end - start)
          .exec()
          .then((datas) => {
            newVideos = datas.map((item, index) => {
              return {
                filename: item._id,
                videoname: item._id + item.extname,
                logoname: item._id + ".webp",
                oldFilenameUrl: "/videos/videos/" + item._id + item.extname,
                newFilenameUrl: "/videos/logos/" + item._id + ".webp",
              };
            });
            res.json({
              code: "0000",
              msg: "获取成功",
              data: { videos: newVideos, end: end },
            });
          });

        //newPhotos = photos.slice(Number(start), Number(end));
      }
    }
  });
});

router.get('/walls/:start', async (req, res) => {
  const perPage = 15;
  const start = Number(req.params.start);
  let end = start+perPage;
  let size = await WallModel.countDocuments();
  if (end >= size) end = size;
    console.log(start, end);
    if (Number(start) == Number(end)) {
      res.json({
        code: "0000",
        msg: "已无集合",
        data: { walls: [], end: end },
      });
    } else {
      let newWalls = [];
      if (Number(start) < Number(end)) {
        //console.log(photos);
        WallModel.find()
          .sort({ _id: 1 })
          .skip(start)
          .limit(end - start)
          .exec()
          .then((datas) => {
            newWalls = datas.map((item, index) => {
              return {
                wallName: item.wallName,
                WallUrl: "/wall/" + item._id,
                logoUrl: item.logo
              };
            });
            res.json({
              code: "0000",
              msg: "获取成功",
              data: { walls: newWalls, end: end },
            });
          });

        //newPhotos = photos.slice(Number(start), Number(end));
      }
    }
});

module.exports = router;
