const path = require('path');
const ErrorResponse = require('../utils/errorHandler');

const uploadPhoto =
    (MODEL, modelName, updateField) => async (req, res, next) => {
        let obj;

        if (modelName === 'Blog') {
            obj = await MODEL.findById(req.params.id);
        } else {
            obj = req?.user;
        }

        if (!obj) {
            return next(
                new ErrorResponse(
                    `${modelName} with id ${obj._id} not found.`,
                    404
                )
            );
        }

        // Make sure user is blog author
        if (modelName === 'Blog') {
            if (
                obj?.author?.toString() !== req?.user?._id.toString() &&
                req?.user?.role !== 'admin'
            ) {
                return next(
                    new ErrorResponse('Not authorized to update blog.', 401)
                );
            }
        }

        // check if user has uploaded an image
        if (!req.files) {
            return next(new ErrorResponse(`No file selected.`, 400));
        }

        const file = req.files.file;

        // Make sure image is uploaded
        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorResponse('Please upload an image.', 400));
        }

        // Make sure size is not more than max size
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(
                new ErrorResponse(
                    `Image size is greater than max size: ${process.env.MAX_FILE_UPLOAD} bytes (1 MB)`,
                    400
                )
            );
        }

        // add custom photo name
        file.name = `${updateField}_${req.user._id}${
            path.parse(file.name).ext
        }`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
            if (err) {
                console.log(err.message);

                return next(
                    new ErrorResponse('Error while uploading image.', 500)
                );
            }

            const result = await MODEL.findByIdAndUpdate(
                obj?._id,
                { [updateField]: file.name },
                { new: true, runValidators: true }
            );

            res.status(200).json({ success: true, data: result });

            next();
        });
    };

module.exports = uploadPhoto;
