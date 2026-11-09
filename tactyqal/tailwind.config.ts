import type { Config } from "tailwindcss";
// PLACEHOLDER PALETTE: replace with the real brand colors here (one place).
export default {content:["./src/**/*.{ts,tsx}"],theme:{extend:{colors:{ink:"#0E1B2A",lagoon:{DEFAULT:"#0F766E",dark:"#0B5A54"},sun:"#F2B01E",mist:"#F3F6F8",line:"#D9E1E7"},fontFamily:{display:["var(--font-display)"],sans:["var(--font-body)"]}}}} satisfies Config;
