import prisma from "../../../shared/prisma";

export const getNextUserId = async () => {
  const counter = await prisma.counter.upsert({
    where: { name: "userId" },
    update: { seq: { increment: 1 } },
    create: { name: "userId", seq: 1 }
  });

  return String(counter.seq).padStart(6, "0");
}
export const getNextAdminId = async () => {
  const counter = await prisma.counter.upsert({
    where: { name: "userId" },
    update: { seq: { increment: 1 } },
    create: { name: "userId", seq: 1 }
  });

  return `A-${String(counter.seq).padStart(6, "0")}`;
}
export const getNextSpeakerId = async () => {
  const counter = await prisma.counter.upsert({
    where: { name: "userId" },
    update: { seq: { increment: 1 } },
    create: { name: "userId", seq: 1 }
  });

  return `S-${String(counter.seq).padStart(6, "0")}`;
}