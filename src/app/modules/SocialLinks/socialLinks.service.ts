import { SocialLinks } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

const createSocialLinkIntoDB = async(payload: SocialLinks)=> {
    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    })
    if(!user){
        throw new ApiError(404,'User not found !')
    }
    const result = await prisma.socialLinks.create({
        data: payload
    });
    return result;
}

const updateSocialLinkIntoDB = async(id: string, payload: SocialLinks) => {
    const result = await prisma.socialLinks.update({
        where: { id },
        data: payload
    });
    return result;
}

const deleteSocialLinkFromDB = async(id: string) => {
    const result = await prisma.socialLinks.delete({
        where: { id }
    });
    return result;
}

const getSocialLinkByIdFromDB = async(id: string) => {
    const result = await prisma.socialLinks.findUnique({
        where: { id }
    });
    return result;
}


const getSocialLinksFromDB = async() => {
    const result = await prisma.socialLinks.findMany();
    return result;
}

export const SocialLinksServices = {
    createSocialLinkIntoDB,
    updateSocialLinkIntoDB,
    deleteSocialLinkFromDB,
    getSocialLinkByIdFromDB,
    getSocialLinksFromDB
};