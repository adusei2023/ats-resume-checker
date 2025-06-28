<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ATS Resume Checker Project Instructions

This is a comprehensive ATS (Applicant Tracking System) Resume Checker website built with React TypeScript frontend and Node.js Express backend.

## Project Structure
- Frontend: React with TypeScript, Vite, Tailwind CSS
- Backend: Node.js with Express, file processing libraries
- Key libraries: react-dropzone, pdf-parse, mammoth, natural (NLP)

## Code Conventions
- Use TypeScript for all new React components
- Follow React functional components with hooks
- Use Tailwind CSS classes for styling
- Implement proper error handling for file uploads
- Use semantic HTML elements for accessibility

## Key Features to Maintain
- File upload with drag-and-drop support (PDF, DOC, DOCX, TXT)
- Resume parsing and text extraction
- ATS compatibility scoring (0-100 scale)
- Keyword analysis and matching
- Detailed reporting with recommendations
- Mobile-responsive design

## Security Considerations
- Validate file types and sizes on both frontend and backend
- Clean up uploaded files after processing
- Sanitize user inputs
- Implement proper CORS settings

## Performance Guidelines
- Keep analysis time under 30 seconds
- Optimize file processing for large documents
- Use efficient text parsing algorithms
- Implement proper loading states

## Testing Approach
- Test with various resume formats
- Validate ATS scoring accuracy
- Ensure responsive design works across devices
- Test error handling for invalid files
