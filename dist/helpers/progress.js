"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcPercent = exports.countTotals = exports.sortCourseDeep = void 0;
// helpers/progress.ts
const sortCourseDeep = (course) => {
    const modules = [...course.courseModules]
        .map(m => ({
        ...m,
        courseModuleVideos: [...m.courseModuleVideos].sort((a, b) => a.order - b.order),
    }))
        .sort((a, b) => a.order - b.order);
    return { ...course, courseModules: modules };
};
exports.sortCourseDeep = sortCourseDeep;
const countTotals = (course) => {
    const totalVideos = course.courseModules.reduce((sum, m) => sum + m.courseModuleVideos.length, 0);
    const totalModules = course.courseModules.length;
    return { totalVideos, totalModules };
};
exports.countTotals = countTotals;
const calcPercent = (completed, total) => total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));
exports.calcPercent = calcPercent;
//# sourceMappingURL=progress.js.map