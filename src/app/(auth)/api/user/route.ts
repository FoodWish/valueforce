import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from 'bcrypt';
import * as z from 'zod';

//Schema

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters')
  })


export async function POST(req:Request) {
   try{
        const body = await req.json();

        const { email, password,username } = userSchema.parse(body);

        //check if email is already exists

        const existing = await db.user.findUnique({where:{email:email}});

        if(existing){
            return NextResponse.json({error:"Email already exists"},{status:409});
        }

        // username exists check

        const existingUsername = await db.user.findUnique({where:{username:username}});

        if(existingUsername){
            return NextResponse.json({error:"Username already exists"},{status:409});
        }

        const hashPassword = await hash(password,10);

        const newUser = await db.user.create({
            data:{
                email,
                password:hashPassword,
                username
            }
        });

        return NextResponse.json({user:newUser,message:'User created successfully'},{status:201});
   }catch(error){
        return NextResponse.json({message:"Something went wrong"},{status:500});
   }
}