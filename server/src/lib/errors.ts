import { Response } from "express";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleError(error: unknown, response: Response) {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: "An unexpected error occurred. Please try again later.",
  });
}
