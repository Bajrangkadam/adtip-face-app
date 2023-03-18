const fs = require('fs');
const path = require("path");
module.exports = {
    getTermscondition: (req, res, next) => {
        let termscondition = fs.readFileSync(path.resolve(__dirname, `../public/Adtip_Term_Condition.html`));
        if (termscondition == "") res.status(400).send({ status: 400, message: "File Not Found.", data: '' });
        res.sendFile(path.join(path.resolve(__dirname, `../public/Adtip_Term_Condition.html`)));
    },
    getFlashScreen: (req, res, next) => {
        let filename = req.params.filename;
        const path = `./public/${filename}`;
        const stat = fs.statSync(path);
        if (stat.size == 0) {
            res.status(400).send({ status: 400, message: "File Not Found.", data: [] });
        } else {
            const fileSize = stat.size
            const range = req.headers.range
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1
                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path, { start, end })
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                }
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
        }
        // res.status(200).send({status : 200,message: "File render successfully.",data:'https://youtu.be/I2bEcv_3iMU'});
    },
    getFile : (req, res, next) =>{
        console.log(req.headers.host);
        let filename = req.params.filename;
        const path = `./public/ad_models/${filename}`;
        const stat = fs.statSync(path);
        if (stat.size == 0) {
            res.status(400).send({ status: 400, message: "File Not Found.", data: [] });
        } else {
            const fileSize = stat.size
            const range = req.headers.range
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1
                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path, { start, end })
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'image/jpeg',
                }
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'image/jpeg',
                }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
        }

    },

    getPhoto: (req, res, next) => {
        let img = fs.readFileSync(path.resolve(__dirname, `../public/${req.params.id}`));
        let encode_image = img.toString('base64');
        let orImg=new Buffer(encode_image, 'base64')
        res.contentType('image/jpeg');
       res.send(orImg)
      },

}