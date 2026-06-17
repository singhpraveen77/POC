import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user= await prisma.user.update({
        where:{
            email:"praveen@gmail.com"
        },
        data:{
            password:"12345678"
        }
    })
    console.log(user)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });