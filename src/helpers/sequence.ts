import prisma from "../shared/prisma";

export const nextSequence = async (name: string) => {
  const upd = await prisma.counter.upsert({
    where: { name },
    update: { seq: { increment: 1 } },
    create: { name, seq: 1000 }, // শুরু 1000 থেকে
  });
  return upd.seq;
};