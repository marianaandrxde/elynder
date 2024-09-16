import bcrypt from "bcrypt";

interface GenerateSessionDTO {
  email: string;
  passwordHash: string;
}
/**
 * @name GenerateSession
 * @param {string} email E-mail do usuário
 * @param {string} passwordHash Senha criptografada
 * @return {string} O token da sessão
 */
export function GenerateSession({
  email,
  passwordHash,
}: GenerateSessionDTO): string {
  const secret = process.env.SESSION_SECRET;

  const plainToken = `${secret}+${email}+${passwordHash}+${new Date().getTime()}`;

  const hash = bcrypt.hashSync(plainToken, 12);

  return hash;
}