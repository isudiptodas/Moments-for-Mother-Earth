import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { User } from "@/models/userModel";
import { connectDb } from "@/config/connectDB";
import * as jose from 'jose';
import { supabaseAdmin } from "@/config/supabase";

export async function PUT(req: NextRequest) {

    await connectDb();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = req.cookies.get('token')?.value as string;

    const { payload } = await jose.jwtVerify(jwt, secret);
    const userEmail = payload?.email as string;

    const body = await req.json();

    const { type } = body;

    if (type === 'profile') {
        const { name, newEmail } = body;

        try {
            const found = await User.findOne({ email: newEmail });
            if (found && found.email !== userEmail) {
                return NextResponse.json({
                    success: false,
                    message: `Email associated with another account`,
                }, { status: 400 });
            }

            const user = await User.findOne({ email: userEmail });
            if (user) {
                user.name = name || user.name;
                user.email = newEmail || user.email;

                await user.save();

                return NextResponse.json({
                    success: true,
                    message: `User profile updated`,
                }, { status: 200 });
            }

            return NextResponse.json({
                success: false,
                message: `Can't update profile`
            }, { status: 500 });

        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 505 });
        }
    }
    else if (type === 'password') {
        const { oldPassword, newPassword } = body;

        try {
            const found = await User.findOne({ email: userEmail });
            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: `User not found`,
                }, { status: 400 });
            }

            const matched = await bcrypt.compare(oldPassword, found.password);
            if (!matched) {
                return NextResponse.json({
                    success: false,
                    message: `Old password is invalid`,
                }, { status: 400 });
            }

            const hashed = await bcrypt.hash(newPassword, 10);

            found.password = hashed;
            await found.save();

            return NextResponse.json({
                success: true,
                message: `User password updated`,
            }, { status: 200 });

        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 505 });
        }
    }
    else if (type === 'image') {

        const { photo, path } = body;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
        const jwt = req.cookies.get('token')?.value as string;

        const { payload } = await jose.jwtVerify(jwt, secret);
        const userEmail = payload?.email as string;

        try {
            const found = await User.findOne({ email: userEmail });

            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: `User not found`,
                }, { status: 400 });
            }

            const { error } = await supabaseAdmin
                .from('user_photo')
                .insert({ user_email: userEmail, photo_path: path, user_picture_url: photo });

            if (!error) {
                found.profilePhoto = photo;
                await found.save();
            }

            return NextResponse.json({
                success: true,
                message: `User photo updated`,
            }, { status: 200 });
        } catch (err) {
            return NextResponse.json({
                success: false,
                message: `Something went wrong`,
            }, { status: 500 });
        }
    }
    else {
        return NextResponse.json({
            success: false,
            message: `Invalid request`,
        }, { status: 505 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectDb();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = req.cookies.get('token')?.value as string;

    const { payload } = await jose.jwtVerify(jwt, secret);
    const userEmail = payload?.email as string;

    try {
        const found = await User.findOne({ email: userEmail });
        if (!found) {
            return NextResponse.json({
                success: false,
                message: `User not found`,
            }, { status: 400 });
        }

        const response = await supabaseAdmin
            .from('user_photo')
            .delete()
            .eq('user_email', userEmail)

        found.profilePhoto = null;
        await found.save();

        return NextResponse.json({
            success: true,
            message: `User photo removed`,
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Something went wrong`,
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectDb();

    const response = NextResponse.json({
        success: true
    }, { status: 201 });

    response.cookies.set('token', '', {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
    });

    return response;
}