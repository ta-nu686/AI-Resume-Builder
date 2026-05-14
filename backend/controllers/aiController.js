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
            content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resumeRouter. The summary should be 1-2 sentences also highlighting key Skills,and [...]
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

//job description

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
            content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key Skills,and car[...]
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


//upload resume


export const uploadResume=async(req,res)=>{
    try{
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
        }

        const systemPrompt="You are an expert AI Agent to extract data from resume. Return valid JSON only."

        const userPrompt=`Extract data from this resume text and return ONLY valid JSON with no additional text:

${resumeText}

Return JSON in this exact format (use empty strings for missing fields):
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
  "project": [
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
}`;
       
        const response=await ai.chat.completions.create({
             model:process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: userPrompt,
        }
    ],
    response_format:{type:'json_object'}
        })
        
        const extractedData=response.choices[0].message.content;
        const parsedData=JSON.parse(extractedData)
        const newResume= await Resume.create({userId, title, ...parsedData}) 
        res.json({resumeId:newResume._id})
    }
    catch(error){
        console.error('Upload error:', error.message)
        return res.status(400).json({message:error.message})
    }
}
