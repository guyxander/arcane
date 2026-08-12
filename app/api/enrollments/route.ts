import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculatePrice, type AgeRange, type Course, type Package } from "@/lib/pricing";

export async function POST(request: Request) {
  const start=Date.now(); const requestId=request.headers.get("x-vercel-id"); console.log(JSON.stringify({level:"info",msg:"start",route:"/api/enrollments",requestId}));
  try { const body=await request.json(); const {course,packageType,ageRange,location,name,whatsapp,preferredSlots,consent}=body as {course:Course;packageType:Package;ageRange:AgeRange;location:string;name:string;whatsapp:string;preferredSlots:string[];consent:boolean};
    if(!course||!packageType||!name?.trim()||!whatsapp?.trim()||!consent) return NextResponse.json({error:"Missing required fields"},{status:400});
    const computed=calculatePrice(course,packageType,ageRange,location); if(computed.kind==="unavailable") return NextResponse.json({error:"Package unavailable"},{status:400});
    const reference=`ARC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`; const supabase=createAdminClient();
    if(!supabase) return NextResponse.json({error:"Enrollment service is being configured"},{status:503});
    const {error}=await supabase.from("enrollments").insert({reference,course,package_type:packageType,age_range:ageRange,location,name:name.trim(),whatsapp:whatsapp.trim(),preferred_slots:preferredSlots||[],quoted_amount:computed.kind==="price"?computed.amount:null,price_status:computed.kind,consent_at:new Date().toISOString()}); if(error) throw error;
    console.log(JSON.stringify({level:"info",msg:"done",route:"/api/enrollments",ms:Date.now()-start,reference})); return NextResponse.json({reference},{status:201});
  } catch(error){console.error(JSON.stringify({level:"error",msg:"failed",route:"/api/enrollments",error:error instanceof Error?error.message:String(error),ms:Date.now()-start}));return NextResponse.json({error:"Unable to submit"},{status:500});}
}
