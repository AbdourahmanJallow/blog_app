const path = require('path');

const uploadPhoto = (MODEL) => async (req, res, next) => {
    const model = await MODEL.findById(req.user._id);

    if (!model) {
        return next(
            new ErrorResponse(
                `${model.modelName} with id ${req.user._id} not found.`,
                404
            )
        );
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
    file.name = `profile_photo_${req.user._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.log(err.message);

            return next(new ErrorResponse('Error while uploading image.', 500));
        }

        const result = await MODEL.findByIdAndUpdate(
            req.user._id,
            {
                profilePhoto: file.name
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: result.profilePhoto });

        next();
    });
};

module.exports = uploadPhoto;
