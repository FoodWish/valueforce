import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const createClient = await db.userClient.create({
      data: { ...body },
    });
    return NextResponse.json(
      { client: createClient, message: "Client created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    try {
      const userClient = await db.userClient.findMany({
       
      })

        return NextResponse.json({ userClient }, { status: 200 });
    } catch (err) {
      console.log(err);
    
    }
  }
  
  export async function DELETE(req: Request) {
    try {
      const body = await req.json();
      const { id } = body;
      const deletedClient = await db.userClient.delete({
        where: { id: Number(id) },
      });
      if (deletedClient) {
        return NextResponse.json({ message: "Client deleted successfully" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Client not found" }, { status: 404 });
      }
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
  }
  