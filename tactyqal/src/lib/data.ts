// Facts below were taken from https://tactyqal.com/ . Items marked DEMO are not from the site.
export const company = { name:"Tactyqal Labs", email:"tactyqal.labs@gmail.com", phone:"+91-98047-72106", hours:"Mon-Sat, 9am-7pm",
  booking:"https://calendar.google.com/calendar/appointments/schedules/AcZssZ3JlaCrNitoPs8Bdr-FUP0cRfFI-MopSIH2azaPNDpRk56h6drYLbXSh-mDc9sfEZAQUKGdsUXs?gv=true" };
export const phases = [
 {weeks:"Weeks 1-2",title:"Ideation & Market Research",text:"Find an idea that excites your teen and check that people want it."},
 {weeks:"Weeks 3-4",title:"Design & Prototyping",text:"Turn the idea into screens and a clickable prototype."},
 {weeks:"Weeks 5-6",title:"Full-Stack Development",text:"Build the real app with modern no-code tools."},
 {weeks:"Weeks 7-8",title:"Launch & Marketing",text:"Launch (including on Product Hunt) and plan marketing."}];
export const stories = [
 {name:"KrishiDrishti",text:"AI-powered soil analysis and crop recommendation app for local farmers in India."},
 {name:"Elenor Vegan Handbags",text:"Corporate gifting platform for vegan handbags, started by a 16-year-old."},
 {name:"One Last Chapter",text:"Book subscription service for kids, started by a 13-year-old."},
 {name:"Paws of Promise",text:"Virtual pet adoption app connecting pet lovers with shelter pets."},
 {name:"AudioNova",text:"AI music and video production company."},
 {name:"Converza",text:"Spanish learning app featuring Luna, a friendly AI language bot."}];
export const tools = ["Startup Idea Generator","Fundability Assessment","Team Evaluation Tool","Pitch Deck Analyzer","Top 10 Traits For Business Success","Cofounder Compatibility Test","Problem-Solution Fit","Website Landing Page Assessment"];
export const faqs = [
 ["What if my teen has no coding experience?","The program is designed for beginners. It uses no-code tools with step-by-step guidance."],
 ["How much time is required?","About 2-3 hours per week, including 1 hour of live mentoring."],
 ["What kind of apps do students build?","AI tools, e-commerce platforms, subscription services and social-good projects."]];
export type Post = {id:string;slug:string;title:string;excerpt:string;category:string;date:string;read:number;cover:string;status:"published"|"draft";body:string};
const img=(f:string)=>`https://www.tactyqal.com/application/assets/images/${f}`;
const demoBody="DEMO BODY: the full article text was not imported. Replace with content from the WordPress export.";
// Titles, excerpts, dates, read times and covers are from the site; categories and body are DEMO.
export const seedPosts: Post[] = [
 {id:"1",slug:"elevator-pitch-with-examples-for-business-entrepreneurs",title:"The elevator pitch for business entrepreneurs",excerpt:"An elevator pitch is the fastest way to describe what your startup...",category:"Pitching",date:"2024-05-01",read:3,cover:img("blog-ele.png"),status:"published",body:demoBody},
 {id:"2",slug:"how-to-build-a-tech-startup-team-2",title:"How to build a tech startup team?",excerpt:"In the early days, the fewer employees, the better. Managing people takes up a lot of time...",category:"Teams",date:"2024-04-20",read:4,cover:img("blog-startup.png"),status:"published",body:demoBody},
 {id:"3",slug:"11-reasons-why-startups-fail-at-idea-stage",title:"11 reasons why startups fail at the idea stage",excerpt:"The default state of a startup is failure and there are many...",category:"Ideas",date:"2024-04-10",read:3,cover:img("blog-fail.png"),status:"published",body:demoBody},
 {id:"4",slug:"50-no-code-startup-ideas-to-build-without-programming-skills",title:"50 No-code startup app ideas",excerpt:"Find a list of 50 unique ideas you can explore for your startup...",category:"Ideas",date:"2025-07-09",read:5,cover:img("50-No-Code-Startup-Ideas-You-Can-Build-Without-Programming-Skills.webp"),status:"published",body:demoBody},
 {id:"5",slug:"30-startup-ideas-for-solving-food-waste-problems",title:"30 Startup ideas to solve food waste problems",excerpt:"Food waste is a massive problem. Every year, we throw away one-third of all food...",category:"Ideas",date:"2024-03-15",read:4,cover:img("30-startup-ideas-for-food-waste-problems.jpg"),status:"published",body:demoBody},
 {id:"6",slug:"50-startup-ideas-for-generation-z-entrepreneurs",title:"50 Startup ideas for Gen-Z Entrepreneurs",excerpt:"Looking at the opportunities ahead, Generation Z entrepreneurs has advantages..",category:"Ideas",date:"2024-03-05",read:6,cover:img("50-Startup-Ideas-for-Generation-Z-Entrepreneurs.jpg"),status:"published",body:demoBody}];
