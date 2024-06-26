/**
 * @file ChatComponent.js
 * @description This component represents the chat interface for user interactions.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useState, useEffect, useRef } from "react";
import DOMPurify from 'dompurify';
import "./../../css/ChatComponent.css";
import generateRequestId from "../idComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';


let aiResponseContent = "";

/**
 * ChatComponent component
 * @param {Object} props - Component props
 * @param {Object} props.location - The location object
 * @returns {JSX.Element} The rendered chat component
 */
const ChatComponent = ({ location }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [currentPromptId, setCurrentPromptId] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const chatDisplayRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [messages, setMessages] = useState([
    { role: "System", content: "The following describes the Conversation History" }
  ]);

  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const aiMessageRef = useRef(null);

  /**
   * Handles the input change event
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Handles the key down event
   * @param {Event} e - The key down event
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() && !isLoading) {
      handleSubmit();
    }
  };

  /**
   * Cancels the ongoing request
   */
  const cancelRequest = async () => { 
    try {
      const response = await fetch('http://localhost:9000/api/cancelRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: currentPromptId}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Cancellation response:', data);
      setIsLoading(false);
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === "AI" && lastMessage.current) {
          return prevMessages.map((message, index) =>
            index === prevMessages.length - 1 ? { ...message, current: false, cancelled: true } : message
          );
        }
        return prevMessages;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Handles the prompt submission and received response
   */
  const handleSubmit = async () => {
    setFeedbackSubmitted(false);
    setIsLoading(true);
    const tempCurrentPromptId = generateRequestId();
    setCurrentPromptId(tempCurrentPromptId);
  
    setMessages(prevMessages => [
      ...prevMessages,
      { role: "user", content: inputValue, current: false, cancelled: false },
      { role: "AI", content: "", ref: aiMessageRef, current: true, cancelled: false }
    ]);
  
    setInputValue("");
    aiResponseContent = "";
  
    try {
      const filteredMessages = messages.filter(message => !message.cancelled);
      console.log(currentPromptId);
      const response = await fetch('http://localhost:9000/api/setPrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputValue,
          id: tempCurrentPromptId,
          history: filteredMessages,
          location: location.location_label + "," + location.location_country
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const reader = response.body.getReader();

      while (!isCancelled) {
        console.log("IsCancelled mid Loop" + isCancelled);
        const { done, value } = await reader.read();
        if (done || isCancelled) {
          break;
        }
  
        let newChunk = new TextDecoder().decode(value);
        newChunk = newChunk.replace('html', '').replace("markdown", "").replace('```', '');
        aiResponseContent += newChunk;
  
        if (aiMessageRef.current) {
          aiMessageRef.current.innerHTML = aiResponseContent;
        }
  
      }

      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === "AI" && lastMessage.current) {
          return prevMessages.map((message, index) => {
            if(index === prevMessages.length - 1) return { ...message, content: aiResponseContent, ref: null, current: false, cancelled: isCancelled }
            else if (index === prevMessages.length - 2) return { ...message, cancelled: isCancelled } //Change User cancelled status
            else return message;
          }
          );
        }
        return prevMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === "AI" && lastMessage.current) {
          return prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? { ...message, content: '<div className="cancelMessage">There was an error with the Request', ref: null, current: false, cancelled: true }
              : message
          );
        }
        return prevMessages;
      });
    } finally {
      setIsCancelled(false);
      setIsLoading(false);
    }
  };

  /**
   * Handles the submission of feedback (rating and location)
   */
  const handleFeedbackSubmit = async () => {
    try {
      await fetch('http://localhost:9000/api/setRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentPromptId,
          rating: rating
        }),
      });
      setRating(0);
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-title">
        {location ? `RailVision - ${location.location_label}` : 'RailVision - Location'}
      </div>
      <div className="chat-display" ref={chatDisplayRef}>
        {messages.map((message, index) => (
          index > 0 && (
            <div key={index} className="message">
              <div className="message-icon">
                {message.role === "user" ? (
                  <div className="user-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                          stroke="#D3D9DB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div className="gpt-icon">
                    <svg
                      version="1.1"
                      id="_x32_"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <path
                            fill="#D3D9DB"
                            className="st0"
                            d="M437.575,351.629V89.868C437.575,40.233,397.351,0,347.707,0H164.293c-49.625,0-89.868,40.233-89.868,89.868 v261.761c0,37.628,27.383,68.98,63.269,75.221L81.334,512h50.11l23.132-34.961h202.867L380.574,512h50.101l-56.35-85.15 C410.201,420.601,437.575,389.257,437.575,351.629z M178.182,40.348h155.636v25.94H178.182V40.348z M131.355,124.186 c0-11.284,9.137-20.438,20.421-20.438h208.456c11.276,0,20.429,9.154,20.429,20.438v86.206c0,11.284-9.154,20.429-20.429,20.429 H151.777c-11.284,0-20.421-9.145-20.421-20.429V124.186z M150.808,374.004c-13.158,0-23.826-10.668-23.826-23.818 c0-13.167,10.668-23.836,23.826-23.836c13.159,0,23.827,10.668,23.827,23.836C174.635,363.336,163.967,374.004,150.808,374.004z M169.618,454.312l17.41-26.318h137.953l17.41,26.318H169.618z M361.201,374.004c-13.158,0-23.826-10.668-23.826-23.818 c0-13.167,10.668-23.836,23.826-23.836c13.159,0,23.827,10.668,23.827,23.836C385.028,363.336,374.36,374.004,361.201,374.004z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
              <div className="message-text">
                <strong>{message.role === "user" ? "You" : "GPT"}</strong>{" "}
                <div style={{ marginTop: '0px', margin: "0px" }} ref={message.current ? message.ref : null} dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(message.content)
                }}></div>
                {isLoading && message.current && (
                  <div className="typing-indicator">
                    <div className="pulsating-ball"></div>
                  </div>
                )}
                {message.cancelled && message.role === "AI" &&(
                  <div style={{ textAlign: 'center', color: 'red', fontStyle: 'italic' }}>This message was cancelled.</div>
                )}
                {message.role === "AI" && !message.cancelled && !isLoading && index === messages.length - 1 && (
                 <div className="rating">
                    {!feedbackSubmitted && (
                      <button className="submit-button" onClick={handleFeedbackSubmit}>Rate!</button>
                    )}
                    {!feedbackSubmitted && (
                      [...Array(5)].map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={index < rating ? fasStar : farStar}
                          onClick={() => setRating(index + 1)}
                          className={`star ${index < rating ? 'selected' : ''} ${feedbackSubmitted ? 'locked' : ''}`}
                        />
                      )).reverse()
                    )}

                 {feedbackSubmitted && (
                   <div className="feedback-message">Thank you for your Feedback!</div>
                 )}
               </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Enter your message here..."
        />
        <div onClick={() => {
          if (isLoading) {
            setIsCancelled(true);
            cancelRequest();
          } else {
            handleSubmit();
          }
        }} className={isLoading ? "svg-wrapper stop-svg" : "svg-wrapper submit-svg"} role="button" aria-label={isLoading ? "Cancel" : "Submit"}>
          {!isLoading ? (
            <svg xmlns="http://www.w3.org/2000/svg">
              <path d="m3.293 11.293 1.414 1.414L11 6.414V20h2V6.414l6.293 6.293 1.414-1.414L12 2.586l-8.707 8.707z" />
            </svg>) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"></path> </g></svg>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatComponent;