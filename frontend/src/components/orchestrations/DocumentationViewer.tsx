import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDocumentation } from "../../hooks/useDocumentation";

interface DocumentationViewerProps {
  orchestrationId: string;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ orchestrationId }) => {
  const { markdown, loading, error } = useDocumentation(orchestrationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-text-secondary">Loading documentation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-error mb-4">Failed to load documentation</p>
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

export default DocumentationViewer;
