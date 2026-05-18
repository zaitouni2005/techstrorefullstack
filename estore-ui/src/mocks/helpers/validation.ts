import { HttpResponse } from "msw";

type FieldCheck = { name: string; type?: "string" | "number" | "boolean"; required?: boolean };

export function validateBody(
  body: Record<string, unknown>,
  fields: FieldCheck[],
): HttpResponse<any> | null {
  const errors: Record<string, string[]> = {};
  for (const field of fields) {
    const value = body[field.name];
    if (field.required && (value === undefined || value === null || value === "")) {
      errors[field.name] = ["Ce champ est requis"];
      continue;
    }
    if (value !== undefined && value !== null && field.type) {
      if (field.type === "number" && typeof value !== "number") {
        errors[field.name] = ["Doit être un nombre"];
      }
      if (field.type === "string" && typeof value !== "string") {
        errors[field.name] = ["Doit être une chaîne de caractères"];
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    return HttpResponse.json({ error: "Erreur de validation", details: errors }, { status: 422 });
  }
  return null;
}

export function notFound(entity: string) {
  return HttpResponse.json({ error: `${entity} non trouvé` }, { status: 404 });
}
