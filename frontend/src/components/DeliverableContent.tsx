import React from "react";

interface DeliverableContentProps {
  content: string | Record<string, unknown>;
  className?: string;
}

const DeliverableContent: React.FC<DeliverableContentProps> = ({
  content,
  className = "",
}) => {
  const renderContent = () => {
    if (typeof content === "string") {
      // Check if it's JSON
      try {
        const parsed = JSON.parse(content);
        return renderJSON(parsed);
      } catch {
        // Not JSON, treat as markdown/text
        return renderMarkdown(content);
      }
    } else {
      // Object, render as JSON
      return renderJSON(content);
    }
  };

  const renderJSON = (data: Record<string, unknown>) => {
    return (
      <div className="deliverable-json">
        <pre className="json-content">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="json-entry">
              <span className="json-key">{key}</span>
              <span className="json-colon">: </span>
              <div className="json-value">
                {typeof value === "string" ? (
                  <div className="json-string">
                    {value.includes("**") ||
                    value.includes("#") ||
                    value.includes("\n")
                      ? renderMarkdown(value)
                      : value}
                  </div>
                ) : (
                  <pre className="json-object">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </pre>
      </div>
    );
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown parsing
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="deliverable-h1">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="deliverable-h2">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="deliverable-h3">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={index} className="deliverable-h4">
            {line.substring(5)}
          </h4>
        );
      }
      // Bold text
      else if (line.includes("**")) {
        const parts = line.split("**");
        const formattedParts = parts.map((part, partIndex) => {
          if (partIndex % 2 === 1) {
            return <strong key={partIndex}>{part}</strong>;
          }
          return part;
        });
        elements.push(
          <p key={index} className="deliverable-p">
            {formattedParts}
          </p>
        );
      }
      // Lists
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={index} className="deliverable-li">
            {line.substring(2)}
          </li>
        );
      }
      // Empty lines
      else if (line.trim() === "") {
        elements.push(<br key={index} />);
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={index} className="deliverable-p">
            {line}
          </p>
        );
      }
    });

    return <div className="deliverable-markdown">{elements}</div>;
  };

  return (
    <div className={`deliverable-content-wrapper ${className}`}>
      {renderContent()}
    </div>
  );
};

export default DeliverableContent;
