import prisma from "../../config/prisma.js";

const findByEmail = (email)=>{
    return prisma.user.findUnique({
        where:{
            email
        }
    });
};

const findById = (id)=>{
    return prisma.user.findUnique({
        where:{
            id
        }
    });
};

const findByUsername = (username)=>{
    return prisma.user.findUnique({
        where:{
            username
        }
    });
};

const createUser = (data)=>{
    return prisma.user.create({
        data
    });
};

const updateUser= (id,data)=>{
    return prisma.user.update({
        where:{
            id
        },
        data,
        
    });

};

const getOtp=  (id)=>{
    return prisma.user.findUnique({
        where:{
            id
        },
        select:{
            emailVerificationToken:true,
            emailVerificationExpire:true
        }

    })
}




export {
    findByEmail,
    findByUsername,
    findById,
    updateUser,
    createUser,
    getOtp

};

