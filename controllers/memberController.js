import { createMemberValidation } from "../middleware/validation.js";

export function createMember(req, res) {
  try {
    const error = createMemberValidation(req.body);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
    const { name } = req.body;

    res.send("Success");
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
