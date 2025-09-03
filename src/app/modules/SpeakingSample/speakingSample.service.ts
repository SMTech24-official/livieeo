import { SpeakingSample } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import ApiError from "../../../errors/ApiError";

const createSpeakingSampleIntoDB = async (payload: SpeakingSample, file: IFile) => {
    const uploadToCloudinary = await fileUploader.uploadVideoToCloudinary(file);
    payload.featureMedia = uploadToCloudinary?.secure_url ?? "";
    const result = await prisma.speakingSample.create({ data: payload })
    return result
}

const getAllSpeakingSampleFromDB = async (query: Record<string, any>): Promise<IGenericResponse<SpeakingSample[]>> => {
    const queryBuilder = new QueryBuilder(prisma.speakingSample, query)
    const speakingSamples = await queryBuilder
        .range()
        .search(["category","sampleTitle", "content"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    return { meta, data: speakingSamples }
}

const getSpeakingSampleById = async (speakingSampleId: string) => {
    const result = await prisma.speakingSample.findUniqueOrThrow({
        where: {
            id: speakingSampleId
        }
    })
    return result
}
const getRelatedSpeakingSamplesFromDB = async (
    sampleId: string,
    query: Record<string, any>
): Promise<IGenericResponse<SpeakingSample[]>> => {
    // প্রথমে সেই sample পাওয়া যাক
    const currentSample = await prisma.speakingSample.findUnique({
        where: { id: sampleId }
    });

    if (!currentSample) {
        throw new ApiError(404, "Speaking sample not found");
    }

    // QueryBuilder ব্যবহার করে related samples fetch
    const queryBuilder = new QueryBuilder(prisma.speakingSample, query);
    const speakingSamples = await queryBuilder
        .range()
        .search(["category","sampleTitle", "content"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
            where: {
                id: { not: sampleId }, // নিজের exclude
                category: currentSample.category // একই category
            },
            orderBy: {
                createdAt: "desc"
            }
        });

    const meta = await queryBuilder.countTotal();

    return { meta, data: speakingSamples };
}
const updateSpeakingSampleIntoDB = async (speakingSampleId: string, payload: Partial<SpeakingSample>) => {
    const speakingSample = await prisma.speakingSample.findUnique({
        where: {
            id: speakingSampleId
        }
    })
    if (!speakingSample) {
        throw new ApiError(404, "Speaking sample not found !")
    }
    const result = await prisma.speakingSample.update({
        where: {
            id: speakingSampleId
        },
        data: payload
    })
    return result
}
const deleteSpeakingSampleFromDB = async (speakingSampleId: string) => {
    const speakingSample = await prisma.speakingSample.findUnique({
        where: {
            id: speakingSampleId
        }
    })
    if (!speakingSample) {
        throw new ApiError(404, "Speaking sample not found !")
    }
    const result = await prisma.speakingSample.delete({
        where: {
            id: speakingSampleId
        }
    })
    return result
}
export const SpeakingSampleServices = {
    createSpeakingSampleIntoDB,
    getAllSpeakingSampleFromDB,
    getSpeakingSampleById,
    updateSpeakingSampleIntoDB,
    deleteSpeakingSampleFromDB,
    getRelatedSpeakingSamplesFromDB
}