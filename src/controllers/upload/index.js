const Joi = require("joi");

const BaseController = require("../base");
const express = require("express");

const {disk, memory}= require('../../middlewares/upload')
const router = express.Router();
const {uploader}= require('../../helpers/cloudinary');
class UploadController extends BaseController {
    constructor() {
        super();
        router.post("/", memory.single('file'), this.upload);
        router.post("/local", disk.single('file'), this.uploadDisk);
        //file diatas untuk nama tujuan dari postmannnya 
    }
    upload = async (req, res, next) => {
        try {
            const { file } = req;
            const allowedfile=[
                'image/jpeg',
                'image/png',
                'image/gif', 
                'image/jpg',
                'aplication/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/svg+xml',
            ]
            if(!allowedfile.includes(file.mimetype)==true) {
                return next(new ValidationError("File type not allowed"));
            }
            const fileBase64 = file.buffer.toString('base64');
            const fileDataUrl = `data:${file.mimetype};base64,${fileBase64}`;
            const fileUpload = await uploader.upload(fileDataUrl,{
                resource_type: "auto",

            });

            res.status(200).json(
                this.apiSend({
                    code: 200,
                    status: "success",
                    message: "File uploaded successfully",
                    data: {
                        url: fileUpload.secure_url,
                        width: fileUpload.width,
                        height: fileUpload.height,
                        format: fileUpload.format,
                        resource_type: fileUpload.resource_type
                    }
                })
            );
        } catch (e) {
            next(e);
        }
    };
    uploadDisk = async (req, res, next) => {
        try {
            const { file } = req;
            const allowedfile=[
                'image/jpeg',
                'image/png',
                'image/gif', 
                'image/jpg',
                'aplication/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/svg+xml',
            ]
            if(allowedfile.includes(file.mimetype)==false) {
                return next(new ValidationError("File type not allowed"));
            }
            const proxyHost =req.headers['x-forwarded-host'] || req.headers['host'];
            res.status(200).json(
                this.apiSend({
                    code: 200,
                    status: "success",
                    message: "File uploaded successfully",
                    data: {
                        url:`http://${proxyHost}/public/uploads/${file.filename}`
                    }
                })
            );
        
            
        } catch (e) {
            next(e);
        }
    }
}
new UploadController();

module.exports = router;    
