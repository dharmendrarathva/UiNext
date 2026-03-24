export function validateComponentCodes(codes: any) {

  if (!codes || typeof codes !== "object") return false;

  const htmlGroup =
    typeof codes.html === "string" &&
    codes.html.trim().length > 0;

  const reactGroup =
    typeof codes.react === "string" &&
    codes.react.trim().length > 0;

  const nextGroup =
    typeof codes.next === "string" &&
    codes.next.trim().length > 0;

  const tailwindGroup =
    typeof codes.tailwind === "string" &&
    codes.tailwind.trim().length > 0;

  const groups = [
    htmlGroup,
    reactGroup,
    nextGroup,
    tailwindGroup
  ].filter(Boolean);

  return groups.length === 1;
}