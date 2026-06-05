import fs from 'fs';
import Resume from '../models/Resume.js';
import ai from '../configs/ai.js';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

const handleAICompletion = async (systemPrompt, userPrompt) => {
  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return response.choices?.[0]?.message?.content;
};

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const systemPrompt =
      'You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills and career objectives. Make it compelling and ATS friendly.';

    const enhancedContent = await handleAICompletion(systemPrompt, userContent);

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: 'User content is required' });
    }

    const systemPrompt =
      'You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key skills and career objectives. Make it compelling and ATS friendly.';

    const enhancedContent = await handleAICompletion(systemPrompt, userContent);

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const title = req.body.title;
    const userId = req.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Resume title is required' });
    }

    const filePath = file.path;
    if (!filePath) {
      return res.status(400).json({ message: 'Uploaded file path is missing' });
    }

    const resumeBuffer = await fs.promises.readFile(filePath);
    let resumeText = '';

    if (file.mimetype === 'application/pdf') {
      const parsedPdf = await new PDFParse({ data: resumeBuffer }).getText();
      resumeText = parsedPdf.text?.trim() ?? '';
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname?.toLowerCase().endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer: resumeBuffer });
      resumeText = result.value?.trim() ?? '';
    } else {
      return res.status(400).json({
        message: 'Only PDF and DOCX resume files are supported. Please upload a PDF or DOCX file.'
      });
    }

    await fs.promises.unlink(filePath).catch(() => {});

    if (!resumeText) {
      return res.status(400).json({ message: 'Unable to parse resume text from the uploaded file.' });
    }

    const systemPrompt = 'You are an expert AI agent to extract data from a resume. Return valid JSON only.';
    const userPrompt = `Extract data from this resume text and return ONLY valid JSON with no additional text:\n\n${resumeText}\n\nReturn JSON in this exact format (use empty strings for missing fields):\n{\n  \"professional_summary\": \"\",\n  \"skills\": [],\n  \"personal_info\": {\n    \"image\": \"\",\n    \"full_name\": \"\",\n    \"profession\": \"\",\n    \"email\": \"\",\n    \"phone\": \"\",\n    \"location\": \"\",\n    \"linkedin\": \"\",\n    \"website\": \"\"\n  },\n  \"experience\": [\n    {\n      \"company\": \"\",\n      \"position\": \"\",\n      \"start_date\": \"\",\n      \"end_date\": \"\",\n      \"description\": \"\",\n      \"is_current\": false\n    }\n  ],\n  \"project\": [\n    {\n      \"name\": \"\",\n      \"type\": \"\",\n      \"description\": \"\"\n    }\n  ],\n  \"education\": [\n    {\n      \"institution\": \"\",\n      \"degree\": \"\",\n      \"field\": \"\",\n      \"graduation_date\": \"\",\n      \"gpa\": \"\"\n    }\n  ]\n}`;

    const extractedData = await handleAICompletion(systemPrompt, userPrompt);
    if (!extractedData) {
      throw new Error('AI response did not return valid JSON.');
    }

    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });

    return res.status(201).json({ resumeId: newResume._id });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(400).json({ message: error.message || 'Resume upload failed' });
  }
};







