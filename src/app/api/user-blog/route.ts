import { connectDb } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import { Blog } from "@/models/blogModel";
import { SavedBlog } from "@/models/savedBlogModel";
import { supabaseAdmin } from "@/config/supabase";

export async function POST(req: NextRequest) {

    await connectDb();

    const body = await req.json();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = req.cookies.get('token')?.value as string;

    const { payload } = await jose.jwtVerify(jwt, secret);
    const userEmail = payload?.email;

    const { type } = body;

    if (type === 'blog') {

        const { title, content, linkedIn, medium,
            publishedOn, imagePath, storedPath, uid, name } = body;

        try {
            const newBlog = new Blog({
                title, content, linkedIn, medium,
                publishedOn, imagePath, storedPath, userEmail, uniqueId: uid,
                userName: name
            });

            await newBlog.save();

            return NextResponse.json({
                success: true,
                message: `Blog created`,
            }, { status: 200 });
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    else if (type === 'save') {
        const { title, content, linkedIn, medium, publishedOn,
            imagePath, storedPath, userEmail, userName, uniqueId, savedBy } = body;

        try {

            if (userEmail === savedBy) {
                return NextResponse.json({
                    success: false,
                    message: `Saving own blog now allowed`
                }, { status: 401 });
            }

            const found = await SavedBlog.findOne({ savedBy, uniqueId });
            if (found) {
                return NextResponse.json({
                    success: false,
                    message: `Blog already saved`
                }, { status: 401 });
            }

            const newSavedBlog = new SavedBlog({
                title, content, linkedIn, medium, publishedOn,
                imagePath, storedPath, userEmail, userName, uniqueId, savedBy
            });

            await newSavedBlog.save();

            return NextResponse.json({
                success: true,
                message: `Blog saved`,
            }, { status: 200 });
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
}

export async function GET(req: NextRequest) {
    await connectDb();

    const id = req.url.split('id=')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = req.cookies.get('token')?.value as string;

    const { payload } = await jose.jwtVerify(jwt, secret);
    const userEmail = payload?.email;

    if (id === 'all') {
        try {
            const found = await Blog.find();
            return NextResponse.json({
                success: true,
                message: `Fetched all blogs`,
                found
            }, { status: 200 });

        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    else if (id === 'saved') {
        try {
            const found = await SavedBlog.find({ savedBy: userEmail });
            return NextResponse.json({
                success: true,
                message: `Fetched saved blogs`,
                found
            }, { status: 200 });

        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    else {
        try {
            const found = await Blog.findOne({ uniqueId: id });
            return NextResponse.json({
                success: true,
                message: `Fetched blog`,
                found
            }, { status: 200 });

        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
}

export async function DELETE(req: NextRequest) {
    await connectDb();

    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    if (type === 'saved') {
        const unique = url.searchParams.get('uniqueId');
        const savedBy = url.searchParams.get('savedBy');
        const path = url.searchParams.get('path') as string;

        try {
            const { data, error } = await supabaseAdmin
                .storage
                .from('user_blog_images')
                .remove([path])

            const deleted = await SavedBlog.findOneAndDelete({ savedBy, storedPath: path, uniqueId: unique });

            return NextResponse.json({
                success: true,
                message: `Saved blog removed`,
            }, { status: 200 });


        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    else {
        const unique = url.searchParams.get('uniqueId');
        const path = url.searchParams.get('path') as string;

        try {
            const { data, error } = await supabaseAdmin
                .storage
                .from('user_blog_images')
                .remove([path])

            const deleted = await Blog.findOneAndDelete({ storedPath: path, uniqueId: unique });

            return NextResponse.json({
                success: true,
                message: `Saved blog removed`,
            }, { status: 200 });
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }

}