const { StatusCodes } = require('http-status-codes');
const Blog = require('../models/Blog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createNewBlog = async (req, res) => {
    const { title, content, tags, category } = req?.body;
    if (!title || !content || !tags || !category)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid title, content, tags or category.' });

    const loggedInUserId = req.userID;
    try {
        const newBlog = await Blog.create({
            title,
            content,
            author: loggedInUserId,
            category,
            tags
        });

        res.status(StatusCodes.CREATED).json({ newBlog });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const updateBlog = async (req, res) => {
    const { blog_id } = req?.body;
    if (!blog_id)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Blog ID is required :)' });

    const blog = await Blog.findOne({ _id: blog_id }).exec();
    if (!blog) return res.status(StatusCodes.NO_CONTENT);

    try {
        if (req?.body?.title) blog.title = req?.body?.title;
        if (req?.body?.content) blog.content = req?.body?.content;
        if (req?.body?.category) blog.category = req?.body?.category;
        if (req?.body?.tags) blog.tags = req?.body?.tags;

        const result = await blog.save();

        res.status(StatusCodes.OK).json({ result });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const deleteBlog = async (req, res) => {
    const { blog_id } = req?.body;
    if (!blog_id)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid blog ID' });

    const blog = await Blog.findOne({ _id: blog_id }).exec();
    if (!blog)
        return res
            .status(StatusCodes.NO_CONTENT)
            .json({ message: 'Blog not found' });

    try {
        const result = await Blog.deleteOne({ _id: blog_id }).exec();
        console.log(result);
        res.json({ result });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const getBlog = async (req, res) => {
    if (!req.params.id)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'No blog id provided' });

    // const blog_id = req?.params?.id;
    const blog = await Blog.findOne({ _id: req?.params?.id }).exec();
    try {
        if (!blog)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'No blog found' });

        res.status(StatusCodes.OK).json({ blog });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        if (!blogs)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'No blogs found' });

        res.status(StatusCodes.OK).json({ blogs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        console.log(error);
    }
};

const search = async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid search term' });

    try {
        const blogs = await Blog.find({ $text: { $search: searchTerm } });

        if (!blogs)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: 'No blogs found' });

        res.status(StatusCodes.OK).json({ blogs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

module.exports = {
    createNewBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    search
};
