import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AppJwtPayload extends JWTPayload {
  userId: string;
  email: string;
}
export async function signJwt(userId: string) {
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}
export async function verifyJwt(token: string): Promise<AppJwtPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AppJwtPayload;
}
