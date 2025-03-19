import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import Course from "../models/courseModel";
import Grade from "../models/gradeModel";

// List all grades
export const listGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const grades = await Grade.scan().exec();
    res.json({ message: "Grades retrieved successfully", data: grades });
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ message: "Error retrieving grades", error });
  }
};

// Get a specific grade by ID
export const getGrade = async (req: Request, res: Response): Promise<void> => {
  const { gradeId } = req.params;
  try {
    const grade = await Grade.get(gradeId);
    if (!grade) {
      res.status(404).json({ message: "Grade not found" });
      return;
    }

    res.json({ message: "Grade retrieved successfully", data: grade });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving grade", error });
  }
};

// Create a new grade (admin/teacher only)
export const createGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, description, order, status = "Active" } = req.body;

    // Validation
    if (!name || order === undefined) {
      res.status(400).json({
        message: "Missing required fields: name, order",
      });
      return;
    }

    const newGrade = new Grade({
      gradeId: uuidv4(),
      name,
      description,
      order,
      status,
    });

    await newGrade.save();

    res.status(201).json({
      message: "Grade created successfully",
      data: newGrade,
    });
  } catch (error) {
    console.error("Error creating grade:", error);
    res.status(500).json({ message: "Error creating grade", error });
  }
};

// Update a grade (admin/teacher only)
export const updateGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { gradeId } = req.params;
    const { name, description, order, status } = req.body;

    // Check if grade exists
    const existingGrade = await Grade.get(gradeId);
    if (!existingGrade) {
      res.status(404).json({ message: "Grade not found" });
      return;
    }

    const updatedGrade = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(order !== undefined && { order }),
      ...(status && { status }),
    };

    await Grade.update({ gradeId }, updatedGrade);

    res.json({
      message: "Grade updated successfully",
      data: { ...existingGrade, ...updatedGrade },
    });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ message: "Error updating grade", error });
  }
};

// Delete a grade (admin/teacher only)
export const deleteGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { gradeId } = req.params;

    // Check if any courses are associated with this grade
    const associatedCourses = await Course.scan("gradeId").eq(gradeId).exec();
    if (associatedCourses && associatedCourses.length > 0) {
      res.status(400).json({
        message: "Cannot delete grade that has associated courses",
        data: { courseCount: associatedCourses.length },
      });
      return;
    }

    // Delete the grade
    await Grade.delete(gradeId);

    res.json({ message: "Grade deleted successfully" });
  } catch (error) {
    console.error("Error deleting grade:", error);
    res.status(500).json({ message: "Error deleting grade", error });
  }
};

// Get courses by grade
export const getGradeCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gradeId } = req.params;

    // Check if grade exists
    const grade = await Grade.get(gradeId);
    if (!grade) {
      res.status(404).json({ message: "Grade not found" });
      return;
    }

    // Get all courses for this grade
    const courses = await Course.scan("gradeId").eq(gradeId).exec();

    res.json({
      message: "Grade courses retrieved successfully",
      data: { grade, courses },
    });
  } catch (error) {
    console.error("Error retrieving grade courses:", error);
    res.status(500).json({ message: "Error retrieving grade courses", error });
  }
};
