import express from "express";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import "@repo/types";

const app = express();
app.use(clerkMiddleware());
app.use(express.json());

app.listen(3000, () => {
  console.log("listening on port 3000");
});
