export declare const CourseProgressServices: {
    completeVideo: (userId: string, courseId: string, videoId: string) => Promise<{
        id: string;
        userId: string;
        courseId: string;
        currentModuleId: string | null;
        currentVideoId: string | null;
        isCompleted: boolean;
        percentCompleted: number;
        modules: any;
        certificate: {
            certificateNo: string;
            certificateUrl: string;
        } | null;
    }>;
};
//# sourceMappingURL=courseProgress.service.d.ts.map