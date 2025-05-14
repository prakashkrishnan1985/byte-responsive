import { KBarResults, useMatches, useKBar } from "kbar";
import { useState, useEffect } from "react";
import InputResult from "./InputResult";
import { useMyContext } from "../../providers/MyContext";

export default function RenderResults({ pills }) {
  const { results } = useMatches();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const { toggle, query } = useKBar();
  const [open, setOpen] = useState(false);
  const handleMediaClick = (mediaUrl, mediaType, event) => {
    event.stopPropagation();
    setSelectedMedia(mediaUrl);
    setIsVideo(mediaType === "video"); 
    setOpen(true);
  };

  const handleCloseImage = () => {
    setSelectedMedia(null);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {pills && <InputResult pills={pills} />}
      {!open && (
        <KBarResults
          items={results}
          style={{ height: "650px", width: "100%" }}
          onRender={({ item, active }) => {
            console.log("item", item);
            return typeof item === "string" ? (
              <div
                style={{
                  paddingLeft: "13px",
                  fontWeight: 600,
                  fontSize: "15px",
                  borderBottom: "1px solid #80808038",
                }}
              >
                {item?.name}
              </div>
            ) : (
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "0px",
                  cursor: "pointer",
                  color: "rgb(11, 14, 20)",
                  background: active ? "#e2e2e29e" : "transparent",
                }}
                onClick={(event) => {
                  if (item.type === "image" || item.type === "video") {
                    handleMediaClick(item.url, item.type, event); // Prevent closing
                  } else {
                    query.toggle(); // Call toggle to close KBar for other actions
                    item.perform(); // For other actions
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {item.icon && (
                    <>
                      <div style={{ marginRight: "8px" }}>{item.icon}</div>
                    </>
                  )}

                  {item.data && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ padding: "5px" }}>{item.name}</div>
                      <div
                        style={{
                          padding: "15px 10px",
                          background: "rgb(245, 246, 250)",
                          borderRadius: "10px",
                          margin: "5px 0px 15px 0px",
                          display: "inline-block",
                          height: "auto",
                        }}
                      >
                        {item.data}
                      </div>
                    </div>
                  )}
                  {item.name && !item.data && <div
                    style={{
                      background: active ? "#eee" : "transparent",
                    }}
                  >
                    {item.name}
                  </div>}
                </div>
              </div>
            );
          }}
        />
      )}

      {selectedMedia && open && (
        <div id="overlay-section">
          <div>
            <button onClick={handleCloseImage} style={closeButtonStyle}>
              X
            </button>
            {isVideo ? (
              <video controls style={{ maxWidth: "100%", maxHeight: "100%" }}>
                <source src={selectedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedMedia}
                alt="Selected"
                style={{
                  maxWidth: "800px",
                  width: "100%",
                  maxHeight: "450px",
                  overflow: "scroll",
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  zIndex: 4,
};
