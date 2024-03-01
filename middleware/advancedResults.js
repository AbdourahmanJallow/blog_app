const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    let reqQuery = { ...req.query };

    // Array of fields to be removed
    const removeFields = ['select', 'sort', 'limit', 'page'];

    removeFields.forEach((param) => delete reqQuery[param]);

    let queryString = JSON.stringify(reqQuery);

    // Create operators
    queryString = queryString.replace(
        /\b(lt|lte|gt|gte)\b/g,
        (match) => `$${match}`
    );

    // Query for top-level blogs, blogs without parentId
    const parsedQuery = JSON.parse(queryString);
    if (
        model.modelName === 'Blog' &&
        !parsedQuery.hasOwnProperty('parentBlogId')
    ) {
        parsedQuery.parentBlogId = { $in: [null, undefined] };
    }

    query = model.find(parsedQuery);

    // Check for  select query field
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Check for  sort query field
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // populate blog with comments
    if (model.modelName === 'Blog') {
        query = query.populate({
            path: 'comments',
            ref: 'Comment',
            select: 'content author featuredImage'
        });
    }

    const results = await query;

    // Handle pagination object
    let pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: results.length,
        pagination,
        data: results
    });

    next();
};

module.exports = advancedResults;
