"use client";
import { useEffect } from "react";
export function AnalyticsTracker(){useEffect(()=>{const coarse=matchMedia("(pointer: coarse)").matches;const device=innerWidth<768?"mobile":innerWidth<1024?"tablet":"desktop";fetch("/api/analytics/visit",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({path:location.pathname,device,coarse}),keepalive:true}).catch(()=>{});},[]);return null;}
