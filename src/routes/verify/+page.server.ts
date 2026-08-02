import type { Actions } from "@sveltejs/kit";
import { error, fail, json } from "@sveltejs/kit";
import { orm } from "$lib/db";
import { User, UserSchema } from "$lib/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "$lib/tokens";
import type { PageServerLoad, RequestEvent } from "./$types";
import { EmailVerificationAttempt } from "$lib/entities/verification.entity";

export const load: PageServerLoad = async ({url}) => {
   let publicId = url.searchParams.get("publicId") || "";
   let token = url.searchParams.get("token") || "";


   if(token == "") throw error(400, "No token provided");

   let em = orm.em.fork();
   let user = await em.findOne(User, { publicId: publicId });

   if(user == undefined) throw error(400, "User not found");
   if(user.emailVerificationStatus == "Verified") throw error(400, "User already verified");

   let verification = await em.findOne(EmailVerificationAttempt, { user: user, token: token });
   if(verification == undefined) throw error(400, "Invalid token");
   
   user.emailVerificationStatus = "Verified";
   await em.remove(verification);
   await em.flush();
}