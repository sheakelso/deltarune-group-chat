import { error, json, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { orm } from "../../../lib/db";
import { User, UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "$lib/tokens";
import { createSession } from "$lib/sessions";


export async function POST({cookies}){
    cookies.delete('sid', {path: '/', secure: false});
    throw redirect(303, '/');
}