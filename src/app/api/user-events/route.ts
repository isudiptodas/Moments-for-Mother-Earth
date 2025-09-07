import { connectDb } from "@/config/connectDB";
import { Event } from "@/models/eventModel";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';

export async function POST(req: NextRequest) {
    await connectDb();

    const body = await req.json();
    const { type } = body;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = req.cookies.get('token')?.value as string;

    const { payload } = await jose.jwtVerify(jwt, secret);
    const email = payload?.email;

    if (type === 'create') {
        const { eventName, eventDesc, eventLocation, eventDate, occur, uniqueId } = body;

        try {
            const newEvent = new Event({
                eventName, eventDesc, eventLocation,
                eventDate, occur, userEmail: email, uniqueId
            });

            await newEvent.save();

            return NextResponse.json({
                success: true,
                message: `Event created`,
            }, { status: 200 });
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

    try {
        const found = await Event.find();

        return NextResponse.json({
            success: true,
            message: `Events fetched`,
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

    try {
        const found = await Event.findOneAndDelete({uniqueId});

        return NextResponse.json({
            success: true,
            message: `Eventt deleted`,
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