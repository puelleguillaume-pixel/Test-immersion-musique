// Compatibility shim: shadcn-ecosystem components (like ui/image-stream-hero)
// import `cn` from "@/lib/utils" by convention. The rest of this codebase
// already has it at "@/lib/cn" — re-exported here so both paths work without
// two copies of the same function.
export { cn } from "./cn";
