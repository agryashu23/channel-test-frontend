import Editor from "@monaco-editor/react";
import Upload from "../../../assets/icons/Upload.svg";
import UploadLight from "../../../assets/lightIcons/upload_light.svg";
import documentImage from "../../../assets/images/document.svg";
import Close from "../../../assets/icons/Close.svg";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
  React,
  useState,
  useRef,
  useModal,
} from "../../../globals/imports.js";

const APITab = () => {
  const [activeTab, setActiveTab] = useState("api");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [APIdescription, setAPIDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const fileInputRef = useRef(null);
  const { handleOpenModal } = useModal();

  const handleClick = (document) => {
    handleOpenModal("modalDocumentOpen", document);
  };

  const clearFileData = () => {
    setFileData(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // resets the input
    }
  };
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const maxFileSize = 16 * 1024 * 1024;

    if (!selectedFile) return;
    if (selectedFile.size > maxFileSize) {
      alert(`File "${selectedFile.name}" exceeds the 16 MB size limit.`);
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData({
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(2),
        buffer: reader.result,
      });
    };
    reader.onerror = () => {
      console.error("Error reading file.");
    };
    reader.readAsArrayBuffer(selectedFile);
  };
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (error) {
      console.error("Clipboard read failed:", error);
    }
  };

  const languageOptions = [
    { label: "Node.js", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "cURL", value: "shell" },
    { label: "Go", value: "go" },
    { label: "Java", value: "java" },
    { label: "PHP", value: "php" },
    { label: "Ruby", value: "ruby" },
    { label: "C#", value: "csharp" },
    { label: "Auto Detect", value: "auto" },
  ];

  const saveAPI = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("api", code);
    formDataToSend.append("description", APIdescription);
    try {
      const response = await postRequestAuthenticated(
        "/save/admin/api",
        formDataToSend
      );
      setLoading(false);
      if (response.success) {
        setCode("");
        setAPIDescription("");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const saveUpload = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("fileData", JSON.stringify(fileData));
    formDataToSend.append("description", description);
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/save/admin/upload",
        formDataToSend
      );
      setLoading(false);
      if (response.success) {
        clearFileData();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  return (
    <div className="flex flex-col sm:pl-10 pl-5 sm:pr-0 pr-4 pt-6 h-full overflow-y-auto">
      <p className="text-theme-secondaryText text-lg md:text-xl lg:text-2xl font-normal ">
        API
      </p>
      <div className="border-[1px] border-theme-tertiaryBackground my-4 pl-6"></div>

      <div className="flex flex-col">
        <div className="flex border-b border-theme-chatDivider font-normal text-sm mt-4 w-max">
          <button
            className={`py-3 px-10 ${
              activeTab === "api"
                ? "border-b-2 text-theme-secondaryText border-theme-secondaryText"
                : "text-theme-primaryText"
            }`}
            onClick={() => setActiveTab("api")}
          >
            Add API
          </button>
          <button
            className={`py-3 px-10 ${
              activeTab === "upload"
                ? "border-b-2 text-theme-secondaryText border-theme-secondaryText"
                : "text-theme-primaryText"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload File
          </button>
          {/* <button
            className={`py-3 px-5 ${
              activeTab === "info"
                ? "border-b-2 text-theme-secondaryText border-theme-b-secondaryText"
                : "text-theme-primaryText"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Add Info
          </button> */}
        </div>{" "}
        <div className="mt-8">
          {activeTab === "api" ? (
            <div className="max-w-4xl  sm:p-6 p-4 bg-theme-tertiaryBackground  rounded-xl space-y-4">
              <div className="flex sm:flex-row flex-col justify-between items-center ">
                <h2 className="lg:text-lg text-md  sm:font-semibold font-normal text-theme-secondaryText sm:mb-0 mb-3">
                  Paste API Usage Snippet
                </h2>
                <div className="flex items-center gap-3">
                  <select
                    className="border px-3 py-1 rounded text-sm  text-theme-secondaryText bg-theme-tertiaryBackground"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handlePaste}
                    className="bg-theme-buttonEnable hover:bg-primary text-theme-secondaryText px-4 py-1 rounded text-sm"
                  >
                    Paste
                  </button>
                </div>
              </div>

              <div className="lg:h-[400px] sm:h-[300px] h-250px border border-theme-gray-700 rounded-md overflow-hidden ">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  theme="vs"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 10 },
                  }}
                />
              </div>
              <textarea
                rows={4}
                value={APIdescription}
                onChange={(e) => setAPIDescription(e.target.value)}
                placeholder="Description"
                className="w-full text-sm p-4 rounded-lg border-[1px] bg-theme-primaryBackground text-theme-secondaryText resize-none"
              />
              <button
                onClick={saveAPI}
                className="bg-theme-buttonEnable hover:bg-primary text-theme-secondaryText px-6 py-2 rounded text-sm"
              >
                Send API
              </button>
            </div>
          ) : activeTab === "upload" ? (
            <div className="flex flex-col mt-2 ml-2">
              <p className="text-sm text-theme-secondaryText font-light">
                Upload file{" "}
                <span className="italic">(.exl, .csv, .pdf, .json)</span>
              </p>
              <div className="relative  bg-theme-chatDivider px-16 py-4 rounded-xl cursor-pointer mt-4 w-max">
                <div className="flex flex-col items-center">
                  <img
                    src={Upload}
                    alt="Upload"
                    className="dark:block hidden w-5 h-5 mr-1"
                  />
                  <img
                    src={UploadLight}
                    alt="Upload"
                    className="dark:hidden w-5 h-5 mr-1"
                  />
                  <p className="text-theme-secondaryText text-xs font-light font-inter mt-2">
                    Upload image
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.csv,.json"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  ref={fileInputRef}
                />
              </div>
              {fileData && (
                <div className="flex flex-row mt-8 items-center space-x-6">
                  <div className="flex flex-row items-center justify-start rounded-md  bg-theme-tertiaryBackground min-w-56 max-w-88px">
                    <img
                      src={documentImage}
                      alt="Document Icon"
                      className="h-14 w-15 object-fill cursor-pointer pr-3"
                      onClick={() => handleClick(fileData)}
                    />
                    <div className="flex flex-col my-1  w-full-minus-68">
                      <p className="text-theme-secondaryText text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                        {fileData.name}
                      </p>
                      <p className="text-theme-primaryText mt-1  text-[10px] xs:text-xs font-light font-inter">
                        {fileData.size} Kb
                      </p>
                    </div>
                  </div>
                  <textarea
                    rows={1}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-1/3 text-sm p-4 rounded-lg border-[1px] bg-theme-primaryBackground text-theme-secondaryText resize-none"
                  />
                  <img
                    src={Close}
                    alt="close"
                    className="h-5 w-5  cursor-pointer "
                    onClick={clearFileData}
                  />
                </div>
              )}
              {fileData && (
                <button
                  onClick={saveUpload}
                  className="bg-theme-buttonEnable hover:bg-primary mt-4 text-theme-secondaryText px-10 py-2 rounded text-sm w-max"
                >
                  Add
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default APITab;
