import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req:Request, res:Response) => {
    try{
        const result = await postService.createPost(req.body);
        res.status(201).json(result)
    }
    catch(err){
        res.status(400).json({
            error: "post creation faild",
            detail: err
        })
    }
}

export const PostController = {
    createPost
}