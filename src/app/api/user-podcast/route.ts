import { connectDb } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import { Podcast } from "@/models/podcastModel";
import { supabaseAdmin } from "@/config/supabase";

export async function POST(req: NextRequest) {
    await connectDb();

    const body = await req.json();
    const { type } = body;

    if (type === 'create') {
        const { title, description, imagePath, storedPath, link,
            publishedOn, uniqueId, userEmail, userName } = body;

        try {
            const newPodcast = new Podcast({
                title, description, imagePath, storedPath, link,
                publishedOn, uniqueId, userEmail, userName
            });

            await newPodcast.save();

            return NextResponse.json({
                success: true,
                message: `Podcast created`,
            }, { status: 201 });
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 505 });
        }
    }
}

export async function GET(req: NextRequest) {
    await connectDb();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = req.cookies.get('token')?.value as string;

    const { payload } = await jose.jwtVerify(jwt, secret);
    const email = payload?.email;

    try {
        const found = await Podcast.find();
        return NextResponse.json({
            success: true,
            message: `All podcast fetched`,
            found
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: `Something went wrong`
        }, { status: 505 });
    }

}

export async function DELETE(req: NextRequest) {
    await connectDb();

    const url = new URL(req.url);
    const uniqueId = url.searchParams.get('uniqueId');
    const path = url.searchParams.get('path') as string;

    try {
        const { data, error } = await supabaseAdmin
            .storage
            .from('user_podcast_images')
            .remove([path])

        const deleted = await Podcast.findOneAndDelete({ uniqueId });
       
        return NextResponse.json({
            success: true,
            message: `Podcast deleted`,
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: `Something went wrong`
        }, { status: 505 });
    }
}