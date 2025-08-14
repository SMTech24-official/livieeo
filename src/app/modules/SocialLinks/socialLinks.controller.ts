import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SocialLinksServices } from "./socialLinks.service";

const createSocialLinks = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await SocialLinksServices.createSocialLinkIntoDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Social link created successfully",
        data: result
    });
})

const updateSocialLinks = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await SocialLinksServices.updateSocialLinkIntoDB(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Social link updated successfully",
        data: result
    });
})

const deleteSocialLinks = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const result = await SocialLinksServices.deleteSocialLinkFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Social link deleted successfully",
        data: result
    });
})

const getSocialLinkById = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const result = await SocialLinksServices.getSocialLinkByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Social link retrieved successfully",
        data: result
    });
})

const getSocialLinks = catchAsync(async (req, res) => {
    const result = await SocialLinksServices.getSocialLinksFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Social links retrieved successfully",
        data: result
    });
})

export const SocialLinksControllers = {
    createSocialLinks,
    updateSocialLinks,
    deleteSocialLinks,
    getSocialLinkById,
    getSocialLinks
};