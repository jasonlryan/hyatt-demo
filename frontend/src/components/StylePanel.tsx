import React, { useState, useEffect } from "react";

interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  shadow: string;
  spacing: string;
  fontSize: string;
}

const StylePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [styles, setStyles] = useState<StyleConfig>({
    primaryColor: "#4CAF50",
    secondaryColor: "#6c757d",
    backgroundColor: "#f8f9fa",
    textColor: "#212529",
    borderRadius: "0.375rem",
    shadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    spacing: "1rem",
    fontSize: "16px",
  });

  const [previewElement, setPreviewElement] = useState<
    "button" | "card" | "modal"
  >("button");

  const updatePreview = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", styles.primaryColor);
    root.style.setProperty("--secondary-color", styles.secondaryColor);
    root.style.setProperty("--background-color", styles.backgroundColor);
    root.style.setProperty("--text-color", styles.textColor);
    root.style.setProperty("--border-radius", styles.borderRadius);
    root.style.setProperty("--shadow", styles.shadow);
    root.style.setProperty("--spacing", styles.spacing);
    root.style.setProperty("--font-size", styles.fontSize);
  };

  useEffect(() => {
    updatePreview();
  }, [styles]);

  const generateCSS = () => {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== SIMPLIFIED DESIGN SYSTEM ===== */
/* Only the classes you actually use! */

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: ${styles.backgroundColor};
  color: ${styles.textColor};
  line-height: 1.6;
  font-size: ${styles.fontSize};
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== ONLY THE CLASSES YOU ACTUALLY USE ===== */

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${styles.spacing};
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${styles.borderRadius};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: ${styles.primaryColor};
  color: white;
}

.btn-primary:hover {
  background: ${adjustBrightness(styles.primaryColor, -10)};
}

.btn-secondary {
  background: white;
  color: ${styles.textColor};
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  border-color: #adb5bd;
}

/* Cards */
.card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: ${styles.borderRadius};
  padding: 1.5rem;
  box-shadow: ${styles.shadow};
  transition: all 0.2s ease;
}

.card:hover {
  border-color: ${styles.primaryColor};
  transform: translateY(-2px);
  box-shadow: 0 4px 16px ${styles.primaryColor}20;
}

/* Modals */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${styles.spacing};
}

.modal-content {
  background: white;
  border-radius: ${styles.borderRadius};
  max-width: 32rem;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Colors */
.text-primary { color: ${styles.textColor}; }
.text-secondary { color: ${styles.secondaryColor}; }
.text-success { color: #28a745; }
.bg-secondary { background-color: ${styles.backgroundColor}; }
.bg-success { background-color: #28a745; }

/* Special component */
.agent-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: ${styles.textColor};
  margin-bottom: 0.5rem;
}

/* Focus states */
.btn:focus,
.card:focus {
  outline: none;
  box-shadow: 0 0 0 3px ${styles.primaryColor}20;
}

/* Responsive */
@media (min-width: 768px) {
  .modal-content {
    max-width: 40rem;
  }
}`;
  };

  const adjustBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const saveCSS = async () => {
    try {
      const css = generateCSS();
      const response = await fetch("/api/save-css", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ css }),
      });

      if (response.ok) {
        alert("CSS saved successfully!");
      } else {
        alert("Failed to save CSS");
      }
    } catch (error) {
      console.error("Error saving CSS:", error);
      alert("Error saving CSS");
    }
  };

  const downloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-hover z-50"
        style={{ fontSize: "24px" }}
      >
        🎨
      </button>

      {/* Style Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Style Designer</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={styles.primaryColor}
                        onChange={(e) =>
                          setStyles({ ...styles, primaryColor: e.target.value })
                        }
                        className="w-full h-10 rounded border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        value={styles.secondaryColor}
                        onChange={(e) =>
                          setStyles({
                            ...styles,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="w-full h-10 rounded border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={styles.backgroundColor}
                        onChange={(e) =>
                          setStyles({
                            ...styles,
                            backgroundColor: e.target.value,
                          })
                        }
                        className="w-full h-10 rounded border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={styles.textColor}
                        onChange={(e) =>
                          setStyles({ ...styles, textColor: e.target.value })
                        }
                        className="w-full h-10 rounded border"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Design Properties
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Border Radius
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={parseFloat(styles.borderRadius)}
                        onChange={(e) =>
                          setStyles({
                            ...styles,
                            borderRadius: `${e.target.value}rem`,
                          })
                        }
                        className="w-full"
                      />
                      <span className="text-sm text-text-secondary">
                        {styles.borderRadius}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Spacing
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={parseFloat(styles.spacing)}
                        onChange={(e) =>
                          setStyles({
                            ...styles,
                            spacing: `${e.target.value}rem`,
                          })
                        }
                        className="w-full"
                      />
                      <span className="text-sm text-text-secondary">
                        {styles.spacing}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Font Size
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="20"
                        step="1"
                        value={parseInt(styles.fontSize)}
                        onChange={(e) =>
                          setStyles({
                            ...styles,
                            fontSize: `${e.target.value}px`,
                          })
                        }
                        className="w-full"
                      />
                      <span className="text-sm text-text-secondary">
                        {styles.fontSize}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={saveCSS} className="btn btn-primary flex-1">
                    Save CSS
                  </button>
                  <button
                    onClick={downloadCSS}
                    className="btn btn-secondary flex-1"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setPreviewElement("button")}
                      className={`px-3 py-1 rounded text-sm ${
                        previewElement === "button"
                          ? "bg-primary-light text-primary"
                          : "bg-secondary"
                      }`}
                    >
                      Button
                    </button>
                    <button
                      onClick={() => setPreviewElement("card")}
                      className={`px-3 py-1 rounded text-sm ${
                        previewElement === "card"
                          ? "bg-primary-light text-primary"
                          : "bg-secondary"
                      }`}
                    >
                      Card
                    </button>
                    <button
                      onClick={() => setPreviewElement("modal")}
                      className={`px-3 py-1 rounded text-sm ${
                        previewElement === "modal"
                          ? "bg-primary-light text-primary"
                          : "bg-secondary"
                      }`}
                    >
                      Modal
                    </button>
                  </div>

                  <div className="border rounded-lg p-4 bg-secondary">
                    {previewElement === "button" && (
                      <div className="space-y-3">
                        <button className="btn btn-primary">
                          Primary Button
                        </button>
                        <button className="btn btn-secondary">
                          Secondary Button
                        </button>
                      </div>
                    )}

                    {previewElement === "card" && (
                      <div className="card">
                        <h4 className="font-semibold mb-2">Sample Card</h4>
                        <p className="text-sm text-text-secondary">
                          This is how your cards will look with the current
                          styles.
                        </p>
                      </div>
                    )}

                    {previewElement === "modal" && (
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4>Sample Modal</h4>
                        </div>
                        <div className="modal-body">
                          <p>
                            This is how your modals will look with the current
                            styles.
                          </p>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary">Cancel</button>
                          <button className="btn btn-primary">Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StylePanel;
