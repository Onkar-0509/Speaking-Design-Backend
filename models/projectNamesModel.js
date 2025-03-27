import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true},
    projectDate: { type: String, default: Date.now },
    location:{type:String ,required:true}
}, { timestamps: true }); 

const Projects = mongoose.model("Projects", projectSchema);

export default Projects;
