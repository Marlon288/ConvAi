import React, { useState, useEffect, useRef } from "react";
import "./css/ChatComponent.css"; // Make sure to create this CSS file
import generateRequestId from "./modules/requestId";


  //const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY,  dangerouslyAllowBrowser: true});
    
  /*const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo"
  });*/

  const initilized = false;
  const requestId = generateRequestId();

  //const loader = new PDFLoader("../Documents/Documents.pdf");
  //const docs = await loader.load();


  const ChatComponent = ({location}) => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // New state variable
    //const [requestId, setRequestId] = useState(null);

    const chatDisplayRef = useRef(null); // Create a ref for the chat display container

    useEffect(() => {
        // Scroll to the bottom every time messages change
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]);

    /*useEffect(() => {
      const initializePrompts = async () => {
        if(!initilized){
          //const loader = new TextLoader("../Documents/document.txt");
          //const docs = await loader.load();

          const prompt = ChatPromptTemplate.fromMessages([
            ["system", "As EAM Expert, your primary role is to provide answers strictly based on the documentation provided for Enterprise Asset Management (EAM) systems. You should not use external sources or general knowledge to answer questions. Your responses should closely align with the specific information, guidelines, and procedures detailed in the EAM documentation. This approach ensures the utmost accuracy and relevance of the information shared, tailored specifically to inquiries about EAM systems.n"],
            ["user", "{input}"],
          ]);

          const outputParser = new StringOutputParser();
          const initialChain = prompt.pipe(chatModel).pipe(outputParser);
          setChain(initialChain);
          initilized = true;
        }
      }
    });*/

    /*useEffect(() => {
      const initializeChat = async () => {
          if (openai && threadId == null ) {
            const thread = await openai.beta.threads.create();
            console.log(thread);
            setThreadId(thread.id);
          }
      };
        initializeChat();
      }, [openai]);*/

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && inputValue.trim() && !isLoading) {
        handleSubmit();
      }
    };

    const cancelRequest = async () =>{
      try {
        const response = await fetch('http://localhost:9000/api/cancelRequest', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestId }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        console.log('Cancellation response:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    const handleSubmit = async () => {
      // Placeholder for handling message submit
      // This is where you would integrate with the ChatGPT API
      setIsLoading(true);
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      const tempInputValue = inputValue
      setInputValue("");
      console.log("This is the id: " + requestId);
      try {
        const response = await fetch('http://localhost:9000/api/setPrompt', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: tempInputValue, requestId }),
      });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        setMessages(prev => [...prev, { text: data.response, sender: "API" }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { text: "There was an error with the Request", sender: "API" }]);
      } finally {
        setIsLoading(false);
      }
      
      /*let response = "";
      try {
        response = await chain.invoke({ input: inputValue });
      } catch (error) {
        console.log(error)
      } finally {
        if(response == "") response = "There was an error with the Request"
        setMessages(prev => [...prev, { text: response, sender: "API" }]);
        setIsLoading(false); // Set loading to false regardless of the outcome
      }*/

      
      
      
      //Send to API
      // API call to OpenAI
      /*if (threadId) {
          try {
            const messageResponse = await openai.beta.threads.messages.create(
              threadId,
              {
                role: "user",
                content: inputValue
              }
            );
            const run = await openai.beta.threads.runs.create(threadId, { assistant_id: "asst_000GBcLHgWQB5INdFOacARj9"});
            let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
            
            while(runStatus.staus === 'queued' || runStatus.staus === 'in_progress' || runStatus.staus === 'cancelling'){
              await new Promise(resolve => setTimeout(resolve, 1500));
              console.log("Its Loading");
              runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            }
            const response = "Something went wrong, return code is unknown";
            if(runStatus.status === 'cancelled') response = "The run was cancelled"
            else if(runStatus.status === 'failed') response = "Something went wrong, the run failed"
            else if(runStatus.status === 'expired') response = "The run expired"
            else if(runStatus.status === 'completed'){
              const messages = await openai.beta.threads.messages.list(threadId);
              const lastMessageForRun = messages.data
                  .filter(
                      (message) => message.run_id === run.id && message.role === 'assistant'
                  )
                  .pop();
              response = lastMessageForRun.content[0].text.value;
            }
            setMessages(prev => [...prev, { text: response, sender: "API" }]);
          } catch (error) {
            console.error("Error with OpenAI API:", error);
          }
        } */
      //const response = "This is the response from the AI";

    }; 
    
    return (
      <div className="chat-container">
        <div className="chat-title">
          {location ? `RailVision - ${location.location_label}` : 'RailVision - Location'}
        </div>
        <div className="chat-display" ref={chatDisplayRef}>
          {messages.map((message, index) => (
            <div key={index} className="message">
              <div className="message-icon">
                {message.sender === "user" ? (
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
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
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
                            class="st0"
                            d="M437.575,351.629V89.868C437.575,40.233,397.351,0,347.707,0H164.293c-49.625,0-89.868,40.233-89.868,89.868 v261.761c0,37.628,27.383,68.98,63.269,75.221L81.334,512h50.11l23.132-34.961h202.867L380.574,512h50.101l-56.35-85.15 C410.201,420.601,437.575,389.257,437.575,351.629z M178.182,40.348h155.636v25.94H178.182V40.348z M131.355,124.186 c0-11.284,9.137-20.438,20.421-20.438h208.456c11.276,0,20.429,9.154,20.429,20.438v86.206c0,11.284-9.154,20.429-20.429,20.429 H151.777c-11.284,0-20.421-9.145-20.421-20.429V124.186z M150.808,374.004c-13.158,0-23.826-10.668-23.826-23.818 c0-13.167,10.668-23.836,23.826-23.836c13.159,0,23.827,10.668,23.827,23.836C174.635,363.336,163.967,374.004,150.808,374.004z M169.618,454.312l17.41-26.318h137.953l17.41,26.318H169.618z M361.201,374.004c-13.158,0-23.826-10.668-23.826-23.818 c0-13.167,10.668-23.836,23.826-23.836c13.159,0,23.827,10.668,23.827,23.836C385.028,363.336,374.36,374.004,361.201,374.004z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
              <div className="message-text">
                <strong>{message.sender === "user" ? "You" : "GPT"}</strong>{" "}
                <br></br> {message.text}
              </div>
            </div>
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
          <div onClick={!isLoading ? handleSubmit : cancelRequest} className={isLoading ? "svg-wrapper stop-svg" : "svg-wrapper submit-svg"}>
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
