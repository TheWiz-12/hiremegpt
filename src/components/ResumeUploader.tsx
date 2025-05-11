import React, { useState, useRef } from 'react';
import { useUserData } from '../context/UserDataContext';
import { Upload, FileText, Loader, CheckCircle, Building } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import { analyzeResume } from '../services/openai';
import { toast } from 'react-toastify';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeUploader: React.FC = () => {
  const { uploadResume, userProfile } = useUserData();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit. Please select a smaller file.");
        return;
      }
      
      setFile(selectedFile);
      setUploadSuccess(false);
      
      if (selectedFile.type === 'application/pdf') {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          setResumeText(fullText);
        } catch (error) {
          console.error('Error extracting text from PDF:', error);
          toast.error("Failed to extract text from PDF. Please try another file.");
        }
      } else if (selectedFile.type === 'application/msword' || 
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeText("Resume text will be extracted after upload.");
        toast.info("Text extraction from Word documents is limited in the browser. Upload to continue.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    
    try {
      setUploading(true);
      await uploadResume(file);
      setUploading(false);
      setUploadSuccess(true);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploading(false);
      toast.error("Failed to upload resume. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      toast.error("No resume text available for analysis.");
      return;
    }

    if (!targetRole) {
      toast.error("Please specify the target role for analysis.");
      return;
    }

    if (!targetCompany) {
      toast.error("Please specify the target company for analysis.");
      return;
    }
    
    try {
      setAnalyzing(true);
      const result = await analyzeResume(resumeText, targetRole, targetCompany);
      setAnalysis(result || '');
      setAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setAnalyzing(false);
      toast.error("Failed to analyze resume. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/msword' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          
          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);
        }
      } else {
        toast.error("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
      
      {userProfile?.resumeUrl && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-green-700 font-medium">Resume already uploaded</p>
            <p className="text-green-600 text-sm">You can upload a new version if needed</p>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
          <p className="text-gray-500 text-sm">PDF, DOC, or DOCX (max 5MB)</p>
        </div>
      </div>
      
      {file && (
        <div className="mb-6">
          <div className="flex items-center p-3 bg-gray-50 rounded-md">
            <FileText className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-gray-700 truncate flex-1">{file.name}</span>
            <button 
              onClick={handleUpload}
              disabled={uploading || uploadSuccess}
              className={`btn text-sm py-1 ${uploadSuccess ? 'btn-secondary' : 'btn-primary'}`}
            >
              {uploading ? (
                <span className="flex items-center">
                  <Loader className="animate-spin h-4 w-4 mr-1" />
                  Uploading...
                </span>
              ) : uploadSuccess ? (
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Uploaded
                </span>
              ) : 'Upload'}
            </button>
          </div>
        </div>
      )}
      
      {resumeText && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Resume Analysis</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="input"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="targetCompany" className="block text-sm font-medium text-gray-700 mb-1">
                Target Company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="targetCompany"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="input pl-10"
                  placeholder="e.g., Google, Amazon, Microsoft"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={analyzing || !targetRole || !targetCompany}
            className="btn btn-primary mb-4"
          >
            {analyzing ? (
              <span className="flex items-center">
                <Loader className="animate-spin h-4 w-4 mr-1" />
                Analyzing...
              </span>
            ) : 'Analyze Resume'}
          </button>
          
          {analysis && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="text-md font-medium mb-2">Analysis Results:</h4>
              <div className="text-gray-700 whitespace-pre-line">
                {analysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;