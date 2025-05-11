import React, { useContext, useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { RxCross2 } from "react-icons/rx";
import { IoMenu } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";


const Sidebar = ({ extended, setExtended }) => {
  const {
    onSent,
    prevPrompts,
    setPrevPrompts,
    setRecentPrompt,
    newChat,
  } = useContext(Context);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt, true);
  };

  const deletePrompt = (indexToDelete) => {
    const updated = prevPrompts.filter((_, idx) => idx !== indexToDelete);
    setPrevPrompts(updated);
    if (indexToDelete === prevPrompts.length - 1) setRecentPrompt("");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (type) => {
    switch (type) {
      case "activity":
        alert("Show user activity");
        break;
      case "saved":
        alert("Display saved prompts");
        break;
      case "apps":
        alert("Open app integrations");
        break;
      case "links":
        alert("Show your public links");
        break;
      case "feedback":
        alert("Redirect to feedback form");
        break;
      case "help":
        alert("Open help documentation");
        break;
      case "dark":
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("dark-mode") === "true") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  return (
    <div
      className={`sidebar ${
        extended ? "sidebar-extended" : "sidebar-collapsed"
      }`}
    >
      <div className="top">
        <IoMenu
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          size={24}
        />
        <div onClick={newChat} className="new-chat">
          <img src={assets.plus_icon} alt="plus" className="plus" />
          {extended && <p>New chat</p>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => (
              <div key={index} className="recent-entry">
                <div onClick={() => loadPrompt(item)} className="prompt-text">
                  <img
                    src={assets.message_icon}
                    alt="message"
                    className="message"
                  />
                  <p>{item.slice(0, 18)}...</p>
                </div>
                <span
                  className="delete-cross"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePrompt(index);
                  }}
                >
                  <RxCross2 size={20} className="react-icon" />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item" onClick={toggleDropdown}>
          <CiSettings size={20} className="react-icon"/>
          {extended && <p>Settings and Help</p>}
        </div>

        {isDropdownOpen && (
          <div className="settings-dropdown" ref={dropdownRef}>
            <div
              className="dropdown-item"
              onClick={() => handleAction("activity")}
            >
              Activity
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleAction("saved")}
            >
              Saved info
            </div>
            <div className="dropdown-item" onClick={() => handleAction("apps")}>
              Apps
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleAction("links")}
            >
              Your public links
            </div>
            <div className="dropdown-item" onClick={() => handleAction("dark")}>
              Dark theme:{" "}
              {document.body.classList.contains("dark-mode") ? "ON" : "OFF"}
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleAction("feedback")}
            >
              Send feedback
            </div>
            <div className="dropdown-item" onClick={() => handleAction("help")}>
              Help
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
