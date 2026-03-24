export class DatabaseError extends Error {
  constructor(message = "Database connection failed") {
    super(message);
    this.name = "DatabaseError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network connection issue") {
    super(message);
    this.name = "NetworkError";
  }
}