// import Resume from "../models/Resume.js";
// import ai from "../configs/ai.js";
// import { PDFParse } from "pdf-parse";

// export const enhanceProfessionalSummary=async(req,res)=>{
//     try{
//         const{userContent}=req.body;
//         if(!userContent){
//             return res.status(400).json({message: "Missing required fields"})
//         }
//         const response=await ai.chat.completions.create({
//              model:process.env.OPENAI_MODEL,
//     messages: [
//         {   role: "system",
//             content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resumeRouter. The summary should be 1-2 sentences also highlighting key Skills,and career objectives.Make it compelling and ATS friendly."
//         },
//         {
//             role: "user",
//             content: userContent,
//         },
//     ],
//         })
//         const enhancedContent=response.choices[0].message.content;
//         return res.status(200).json({enhancedContent})
//     }
//     catch(error){
//         return res.status(400).json({message:error.message})
//     }
// }

// //job description

// export const enhanceJobDescription=async(req,res)=>{
//     try{
//         const{userContent}=req.body;
//         if(!userContent){
//             return res.status(400).json({message: "User content is required"})
//         }
//         const response=await ai.chat.completions.create({
//              model:process.env.OPENAI_MODEL,
//     messages: [
//         {   role: "system",
//             content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key Skills,and career objectives.Make it compelling and ATS friendly."
//         },
//         {
//             role: "user",
//             content: userContent,
//         }
//     ],
//         })
//         const enhancedContent=response.choices[0].message.content;
//         return res.status(200).json({enhancedContent})
//     }
//     catch(error){
//         return res.status(400).json({message:error.message})
//     }
// }


// //upload resume


// export const uploadResume=async(req,res)=>{
//     try{
//         const{resumeText,title}=req.body;
//         const userId=req.userId;
//         if(!resumeText || !title){
//             return res.status(400).json({message: "Missing required fields"})
//         }

//         const systemPrompt="You are an expert AI Agent to extract data from resume. Return valid JSON only."

//         const userPrompt=`Extract data from this resume text and return ONLY valid JSON with no additional text:

// ${resumeText}

// Return JSON in this exact format (use empty strings for missing fields):
// {
//   "professional_summary": "",
//   "skills": [],
//   "personal_info": {
//     "image": "",
//     "full_name": "",
//     "profession": "",
//     "email": "",
//     "phone": "",
//     "location": "",
//     "linkedin": "",
//     "website": ""
//   },
//   "experience": [
//     {
//       "company": "",
//       "position": "",
//       "start_date": "",
//       "end_date": "",
//       "description": "",
//       "is_current": false
//     }
//   ],
//   "project": [
//     {
//       "name": "",
//       "type": "",
//       "description": ""
//     }
//   ],
//   "education": [
//     {
//       "institution": "",
//       "degree": "",
//       "field": "",
//       "graduation_date": "",
//       "gpa": ""
//     }
//   ]
// }`;
       
//         const response=await ai.chat.completions.create({
//              model:process.env.OPENAI_MODEL,
//     messages: [
//         {   role: "system",
//             content: systemPrompt
//         },
//         {
//             role: "user",
//             content: userPrompt,
//         }
//     ],
//     response_format:{type:'json_object'}
//         })
        
//         const extractedData=response.choices[0].message.content;
//         const parsedData=JSON.parse(extractedData)
//         const newResume= await Resume.create({userId, title, ...parsedData}) 
//         res.json({resumeId:newResume._id})
//     }
//     catch(error){
//         console.error('Upload error:', error.message)
//         return res.status(400).json({message:error.message})
//     }
// }


import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import PDFParse from "pdf-parse";

export const enhanceProfessionalSummary=async(req,res)=>{
    try{
        const{userContent}=req.body;
        if(!userContent){
            return res.status(400).json({message: "Missing required fields"})
        }
        const response=await ai.chat.completions.create({
             model:process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resumeRouter. The summary should be 1-2 sentences also highlighting key Skills,and career objectives.Make it compelling and ATS friendly."
        },
        {
            role: "user",
            content: userContent,
        },
    ],
        })
        const enhancedContent=response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}
import pdf from "pdf-parse-fork";

// ---------------------------------------------------
// COMMON AI RESPONSE FUNCTION
// ---------------------------------------------------

const generateAIResponse = async (systemPrompt, userPrompt) => {

export const enhanceJobDescription=async(req,res)=>{
    try{
        const{userContent}=req.body;
        if(!userContent){
            return res.status(400).json({message: "User content is required"})
        }
        const response=await ai.chat.completions.create({
             model:process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key Skills,and career objectives.Make it compelling and ATS friendly."
        },
        {
            role: "user",
            content: userContent,
        }
    ],
        })
        const enhancedContent=response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}
    const response = await ai.chat.completions.create({

        model: process.env.OPENAI_MODEL,

        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userPrompt
            }
        ],

        temperature: 0.7
    });

export const uploadResume=async(req,res)=>{
    // try{
        const {title} = req.body;
        const userId = req.userId;
        const file = req.file;

        if(!file){
            return res.status(400).json({message: "Resume file is required"})
        }
        if(!title){
            return res.status(400).json({message: "Resume title is required"})
        }

        // Extract text from PDF
        let resumeText = '';
        try {
            const pdfData = await PDFParse(file.buffer);
            resumeText = pdfData.text;
        } catch (pdfError) {
            console.error('PDF parsing error:', pdfError.message);
            return res.status(400).json({message: "Failed to parse PDF. Please ensure it's a valid PDF file."})
        }

        if(!resumeText || resumeText.trim().length === 0){
            return res.status(400).json({message: "Could not extract text from PDF"})
    return response.choices[0].message.content.trim();
        }
    }
};

// ---------------------------------------------------
// ENHANCE PROFESSIONAL SUMMARY
// ---------------------------------------------------

export const enhanceProfessionalSummary = async (req, res) => {

    try {

        const { userContent } = req.body;

        if (!userContent?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Professional summary is required"
            });
        }

        const systemPrompt = `
You are an expert ATS resume writer.

Enhance the professional summary:
- Keep it concise
- ATS optimized
- Professional tone
- Highlight technical skills
- Mention career strengths
`;

        const enhancedContent = await generateAIResponse(
            systemPrompt,
            userContent
        );

        return res.status(200).json({
            success: true,
            enhancedContent
        });

    } catch (error) {

        console.error("Professional Summary Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to enhance professional summary"
        });
    }
};

// ---------------------------------------------------
// ENHANCE JOB DESCRIPTION
// ---------------------------------------------------

export const enhanceJobDescription = async (req, res) => {

    try {

        const { userContent } = req.body;

        if (!userContent?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Job description is required"
            });
        }

        const systemPrompt = `
You are an expert ATS resume writer.

Enhance the job description:
- Use action verbs
- ATS optimized
- Professional tone
- Highlight achievements
- Keep concise and impactful
`;

        const enhancedContent = await generateAIResponse(
            systemPrompt,
            userContent
        );

        return res.status(200).json({
            success: true,
            enhancedContent
        });

    } catch (error) {

        console.error("Job Description Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to enhance job description"
        });
    }
};

// ---------------------------------------------------
// UPLOAD RESUME
// ---------------------------------------------------

export const uploadResume = async (req, res) => {

     console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    try {

        const userId = req.userId;
        const title = req.body.title;

        // ---------------------------------------------------
        // VALIDATION
        // ---------------------------------------------------

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }

        if (!title?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Resume title is required"
            });
        }

        // ---------------------------------------------------
        // PDF EXTRACTION
        // ---------------------------------------------------

        const pdfBuffer = req.file.buffer;

        const pdfData = await pdf(pdfBuffer);

        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length < 50) {

            return res.status(400).json({
                success: false,
                message: "Could not extract text from PDF"
            });
        }

        // ---------------------------------------------------
        // AI PROMPTS
        // ---------------------------------------------------

        const systemPrompt = `
You are an advanced ATS resume parser.

Extract resume information accurately.

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations
- Use empty strings for missing values
- Skills must be array
- Experience must be array
- Education must be array
`;

        const userPrompt = `
Extract structured information from this resume.

Resume Text:
${resumeText}

Return JSON in this exact structure:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "projects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

`;

        // ---------------------------------------------------
        // OPENAI RESPONSE
        // ---------------------------------------------------

        const response = await ai.chat.completions.create({

            model: process.env.OPENAI_MODEL,

            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],

            response_format: {
                type: "json_object"
            },

            temperature: 0.2
        });

        // ---------------------------------------------------
        // SAFE JSON PARSE
        // ---------------------------------------------------

        let parsedData;

        try {

            parsedData = JSON.parse(
                response.choices[0].message.content
            );

        } catch (jsonError) {

            console.error("JSON Parse Error:", jsonError);

            return res.status(500).json({
                success: false,
                message: "AI returned invalid JSON"
            });
        }

        // ---------------------------------------------------
        // SAVE TO DATABASE
        // ---------------------------------------------------

        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData
        });

        // ---------------------------------------------------
        // SUCCESS RESPONSE
        // ---------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            resumeId: newResume._id
        });

    } catch (error) {

        console.error("Resume Upload Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Resume upload failed"
        });
    }
};
