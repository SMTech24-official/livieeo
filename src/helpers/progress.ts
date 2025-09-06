// helpers/progress.ts
export const sortCourseDeep = (course: any) => {
  const modules = [...course.courseModules]
    .map(m => ({
      ...m,
      courseModuleVideos: [...m.courseModuleVideos].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);
  return { ...course, courseModules: modules };
};

export const countTotals = (course: any) => {
  const totalVideos = course.courseModules.reduce(
    (sum: number, m: any) => sum + m.courseModuleVideos.length,
    0
  );
  const totalModules = course.courseModules.length;
  return { totalVideos, totalModules };
};

export const calcPercent = (completed: number, total: number) =>
  total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));
