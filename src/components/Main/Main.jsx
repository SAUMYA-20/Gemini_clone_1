import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import './Main.css';
import { MdOutlineTravelExplore } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { LuCopyPlus } from "react-icons/lu";
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { SiGooglegemini } from "react-icons/si";
import { IoMdSend } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";

import { Context } from '../../context/Context';

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    abortController,
    setAbortController,
    setLoading,
    setResultData,
  } = useContext(Context);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const togglePlusMenu = () => setIsPlusMenuOpen(!isPlusMenuOpen);

  const dropdownRef = useRef(null);

  const handleOutsideClick = useCallback((e) => {
    if (isMenuOpen && !e.target.closest('.more-options-btn')) {
      setIsMenuOpen(false);
    }
    if (isPlusMenuOpen && !e.target.closest('.plus-options-btn')) {
      setIsPlusMenuOpen(false);
    }
  }, [isMenuOpen, isPlusMenuOpen]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick, isMenuOpen, isPlusMenuOpen]);

  const regenerateResponse = async () => {
    if (!recentPrompt) return;
    setInput(recentPrompt);
    await onSent(recentPrompt);
    setIsMenuOpen(false);
  };

  const markAsGood = () => {
    alert("Thank you! Response marked as good.");
    setIsMenuOpen(false);
  };

  const markAsBad = () => {
    alert("Thanks for your feedback. We'll improve!");
    setIsMenuOpen(false);
  };

  const copyToClipboard = () => {
    if (!resultData) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(resultData, 'text/html');
    const plainText = doc.body.textContent || "";

    navigator.clipboard.writeText(plainText)
      .then(() => alert("Response copied to clipboard!"))
      .catch(err => {
        console.error("Failed to copy:", err);
        alert("Failed to copy response.");
      });
    setIsMenuOpen(false);
  };

  const exportResponse = () => {
    const cleanText = resultData.replace(/<[^>]+>/g, '');
    const content = `Prompt:\n${recentPrompt}\n\nResponse:\n${cleanText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-response-${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  const reportLegalIssue = () => {
    alert("Response reported for review.");
    setIsMenuOpen(false);
  };

  // Functionality for Camera
  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();
      document.body.appendChild(videoElement);
      setIsPlusMenuOpen(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Failed to access the camera.");
      setIsPlusMenuOpen(false);
    }
  };

  // Handle adding from Drive
  const handleUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*';
    fileInput.onchange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        alert(`Added ${files.length} file(s) from Drive`);
        setIsPlusMenuOpen(false);
      }
    };
    fileInput.click();
  };

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showPopup && !e.target.closest('.popup-box') && !e.target.closest('.adv-btn')) {
        setShowPopup(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showPopup]);

  return (
    <div className="main">
      <div className="nav">
        <p className="title">Gemini</p>
        <div className="side-button">
          <button className="adv-btn" onClick={() => setShowPopup(true)}>
            <SiGooglegemini size={20} className="gemini-icon" />
            <span>Try Gemini Advanced</span>
          </button>
          <HiOutlineRectangleStack size={20} className="grid-icon" />
          <TbGridDots size={20} className="grid-icon" />
          <FaCircleUser size={20} className="grid-icon"/>
        </div>
      </div>

        {showPopup && (
            <div className="popup-container">
            <div className="popup-box">
                <h3>Google One AI Premium plan</h3>
                <p><strong style={{ color: 'green' }}>₹1,950 ₹0 for 1 month</strong>, ₹1,950/month thereafter</p>
                <hr />
                <ul className="popup-list">
                <li> Create high-quality videos with Veo 2</li>
                <li> Unlock expanded access to Gemini features, including Deep Research</li>
                <li> Understand large books and reports with 1,500 pages of file uploads</li>
                <li> Experience our most capable AI models</li>
                </ul>
                <p><strong>Also included in this Google One subscription</strong></p>
                <ul className="popup-list">
                <li> Gemini in Gmail, Docs and more</li>
                <li> NotebookLM Plus</li>
                <li> 2 TB of storage</li>
                <li> Other Google One Premium benefits</li>
                </ul>
                <p className="popup-note">Gemini Advanced and Gemini for Gmail, Docs and more are only available for ages 18+. Certain Gemini Advanced features and Gemini for Gmail, Docs and more are only <a href="#">available in selected languages</a>.</p>
                <button className="popup-btn">Start trial</button>
            </div>
            </div>
        )}


      <div className="main-container">
        {!showResult ? (
          <div className="greet">
            <p>Hello, Saumya!</p>
          </div>
        ) : (
          <div className="chat-area">
            <div className="chat-bubble prompt">
              <p>{recentPrompt}</p>
            </div>

            <div className="gemini-icons-container">
              <div className="gemini-icon-left">
                {loading ? (
                  <div className="circle-loader"></div>
                ) : (
                    <span className="gemini-loader">
                    <SiGooglegemini size={30} className='gemini-loader-icon'/>
                   </span>
                )}
              </div>

              <div
                className={`more-options-btn ${isMenuOpen ? "active" : ""}`}
                onClick={toggleMenu}
              >
                <BsThreeDotsVertical size={16} />
              </div>

              {isMenuOpen && (
                <div className="more-options-menu">
                  <div className="menu-item" onClick={regenerateResponse}>
                    Regenerate
                  </div>
                  <div className="menu-item" onClick={markAsGood}>
                    Good
                  </div>
                  <div className="menu-item" onClick={markAsBad}>
                    Bad
                  </div>
                  <div className="menu-item" onClick={copyToClipboard}>
                    Copy
                  </div>
                  <div className="menu-item" onClick={exportResponse}>
                    Export to...
                  </div>
                  <div className="menu-item" onClick={reportLegalIssue}>
                    Report legal issue
                  </div>
                </div>
              )}
            </div>

            <div
              className="result-content"
              dangerouslySetInnerHTML={{ __html: resultData || "" }}
            ></div>
          </div>
        )}
      </div>

      <div className="main-bottom">
        <div className="bottom-grid">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                onSent(e.target.value.trim());
              }
            }}
            value={input}
            type="text"
            placeholder="Ask Gemini"
            className="ask-input"
          />
          <div className="mic">
            {input.trim() === "" ? (
              <FaMicrophone size={20} className="react-icon" />
            ) : loading ? (
              <FaRegStopCircle
                size={20}
                className="react-icon"
                onClick={() => {
                  if (abortController) abortController.abort();
                  setAbortController(null);
                  setLoading(false);
                  setResultData("");
                  setInput("");
                }}
              />
            ) : (
              <IoMdSend
                size={20}
                className="react-icon"
                onClick={() => onSent(input)}
              />
            )}
          </div>

          <div className="action-box">
            <div
              className="icon-label plus-options-btn"
              onClick={togglePlusMenu}
            >
              <AiOutlinePlus size={20} className="react-icon" />
              {isPlusMenuOpen && (
                <div className={`plus-options-menu ${isPlusMenuOpen ? "active" : ""}`} ref={dropdownRef}>
                  <div className="menu-item" onClick={handleCamera}>
                    Camera
                  </div>
                  <div className="menu-item" onClick={handleUpload}>
                    Upload file
                  </div>
                  <div className="menu-item" onClick={handleUpload}>
                    Add from Drive
                  </div>
                </div>
              )}
            </div>
            <div className="icon-label">
              <MdOutlineTravelExplore size={20} className="react-icon" />
              <span className="label-text">Deep Research</span>
            </div>
            <div className="icon-label">
              <LuCopyPlus size={20} className="react-icon" />
              <span className="label-text">Canvas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
