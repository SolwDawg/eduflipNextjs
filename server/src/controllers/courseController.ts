import { Request, Response } from "express";
import Course from "../models/courseModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";

export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category, gradeId } = req.query;
  try {
    let courses;

    if (category && category !== "all" && gradeId) {
      // Filter by both category and grade
      courses = await Course.scan("category")
        .eq(category)
        .and()
        .where("gradeId")
        .eq(gradeId)
        .exec();
    } else if (category && category !== "all") {
      // Filter by category only
      courses = await Course.scan("category").eq(category).exec();
    } else if (gradeId) {
      // Filter by grade only
      courses = await Course.scan("gradeId").eq(gradeId).exec();
    } else {
      // No filters
      courses = await Course.scan().exec();
    }

    res.json({ message: "Courses retrieved successfully!", data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json({ message: "Course retrieved successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving course", error });
  }
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      title,
      description,
      category,
      image,
      level,
      gradeId,
      sections = [],
    } = req.body;

    // Validation
    if (!title || !category || !level) {
      res.status(400).json({
        message: "Missing required fields: title, category, level",
      });
      return;
    }

    const newCourse = new Course({
      courseId: uuidv4(),
      title,
      description,
      category,
      image,
      level,
      gradeId,
      status: "Draft", // Default to draft status
      sections: sections.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: (section.chapters || []).map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
          comments: [],
        })),
      })),
      enrollments: [],
    });

    await newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Error creating course", error });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Get existing course
    const existingCourse = await Course.get(courseId);
    if (!existingCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const {
      title,
      description,
      category,
      image,
      level,
      status,
      gradeId,
      sections,
    } = req.body;

    const updatedCourse = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(image && { image }),
      ...(level && { level }),
      ...(status && { status }),
      ...(gradeId && { gradeId }),
      ...(sections && {
        sections: sections.map((section: any) => ({
          ...section,
          sectionId: section.sectionId || uuidv4(),
          chapters: (section.chapters || []).map((chapter: any) => ({
            ...chapter,
            chapterId: chapter.chapterId || uuidv4(),
            comments: chapter.comments || [],
          })),
        })),
      }),
    };

    const updated = await Course.update({ courseId }, updatedCourse);

    res.json({
      message: "Course updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course", error });
  }
};
