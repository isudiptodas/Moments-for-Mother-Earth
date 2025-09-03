import { connectDb } from "@/config/connectDB";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
    const body = await req.json();
    await connectDb();

    const { type } = body;

    if (type === 'otp') {

        const { name, email, otp } = body;
        try {

            const found = await User.findOne({ email });
            if (found) {
                return NextResponse.json({
                    success: false,
                    message: `User already exists`
                }, { status: 500 });
            }

            const mail = process.env.EMAIL_ADDRESS as string;
            const pass = process.env.EMAIL_PASSWORD as string;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: mail,
                    pass: pass,
                },
            });

            const mailOptions = {
                from: mail,
                to: email,
                subject: "ACCOUNT VERIFICATION",
                text: `Hello ${name}. \n We are really happy to see join our community. Here is a one time
                password for your account verification - ${otp}`,
            };

            const info = await transporter.sendMail(mailOptions);

            return NextResponse.json({
                success: true,
                message: `OTP sent`
            }, { status: 200 });

        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    else if (type === 'register') {
        const { name, email, password, contact, date } = body;

        try {
            const hashed = await bcrypt.hash(password, 10);
            const newUser = new User({
                name, email, dateCreated: date, contact, password: hashed
            })

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: `User Registered`
            }, { status: 200 });
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    else if (type === 'login') {
        const { email, password } = body;

        try {

            const found = await User.findOne({ email });
            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: `User not found`
                }, { status: 404 });
            }

            const matched = await bcrypt.compare(password, found?.password);
            if (!matched) {
                return NextResponse.json({
                    success: false,
                    message: `Invalid Password`
                }, { status: 400 });
            }

            const secret = process.env.JWT_SECRET as string;
            const token = jwt.sign({ id: found?._id, email: found?.email, role: 'user' }, secret, { expiresIn: '1d' });

            const response = NextResponse.json({
                success: true,
                message: `Login Successful`
            }, { status: 200 });

            response.cookies.set('token', token, {
                secure: false,
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 86400
            });

            return response;
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: `Something went wrong`
            }, { status: 500 });
        }
    }
    return NextResponse.json({
        success: false,
        message: `Invalid Request`
    }, { status: 500 });
}

export async function GET(req: NextRequest) {

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
        const jwt = req.cookies.get('token')?.value as string;

        const { payload } = await jose.jwtVerify(jwt, secret);
        const email = payload?.email;

        const found = await User.findOne({ email });
        if (found) {
            return NextResponse.json({
                success: true,
                message: `User verified`
            }, { status: 200 });
        }

        return NextResponse.json({
            success: false,
            message: `Invalid User`
        }, { status: 401 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: `Something went wrong`
        }, { status: 505 });
    }
}