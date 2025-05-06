import { hash, compare } from "bcrypt";


export const hashPass = async (pass) => {
  return await hash(pass, salt);
};

export const comparePass = async (pass, comparePassword) => {
  return await compare(pass, comparePassword);
};
