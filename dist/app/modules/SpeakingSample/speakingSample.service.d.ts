import { SpeakingSample } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { IGenericResponse } from "../../../interfaces/common";
export declare const SpeakingSampleServices: {
    createSpeakingSampleIntoDB: (payload: SpeakingSample, file: IFile) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        content: string;
        featureMedia: string;
        sampleTitle: string;
    }>;
    getAllSpeakingSampleFromDB: (query: Record<string, any>) => Promise<IGenericResponse<SpeakingSample[]>>;
    getSpeakingSampleById: (speakingSampleId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        content: string;
        featureMedia: string;
        sampleTitle: string;
    }>;
    updateSpeakingSampleIntoDB: (speakingSampleId: string, payload: Partial<SpeakingSample> & {
        data?: string;
    }, file?: Express.Multer.File) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        content: string;
        featureMedia: string;
        sampleTitle: string;
    }>;
    deleteSpeakingSampleFromDB: (speakingSampleId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        content: string;
        featureMedia: string;
        sampleTitle: string;
    }>;
    getRelatedSpeakingSamplesFromDB: (sampleId: string, query: Record<string, any>) => Promise<IGenericResponse<SpeakingSample[]>>;
};
//# sourceMappingURL=speakingSample.service.d.ts.map