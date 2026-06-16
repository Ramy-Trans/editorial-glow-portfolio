import handler from "./server-bundle.js";

export default async (request, context) => {
  return handler.fetch(request, process.env, context);
};

export const config = { path: "/*" };
