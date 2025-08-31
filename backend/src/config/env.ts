import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://Noteapp:6MRLaGLacQt4AEuC@cluster0.g94cw81.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  JWT_SECRET: process.env.JWT_SECRET || "35603b7b2d9d46d1ee93b3154c34dbd4e47fb5ecd9f2527c2515439f3e5c8094",
  JWT_EXPIRES: process.env.JWT_EXPIRES || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "566099312384-vsq0ocnpl2o20lg8d9qle9ral1lpjff0.apps.googleusercontent.com",
};
