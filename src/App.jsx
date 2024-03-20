import React, { useState, useRef } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    h2: {
      fontFamily: "Taviraj, serif",
    },
  },
});

const UploadButton = styled(Button)({
  background: "linear-gradient(45deg, #FF6B8B 30%, #FF8E53 90%)",
  borderRadius: 28,
  border: 0,
  color: "white",
  height: 48,
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, 0.3)",
  transition: "0.3s",
  "&:hover": {
    background: "linear-gradient(45deg, #FF8E53 30%, #FF6B8B 90%)",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, 0.5)",
  },
});

const ColorAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        const mimeType = file.type;
        setSelectedImage(reader.result);
        sendImageToAPI(reader.result, mimeType);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP).");
    }
  };

  const sendImageToAPI = async (base64Image, mimeType) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://fnna5xesrb.execute-api.ap-northeast-1.amazonaws.com/prod/processing",
        {
          image: base64Image.split(",")[1],
          media_type: mimeType,
        },
      );
      const text = response.data.text;
      console.log("Received text from API:", text);
      setAnalysisResult(text);
      setApiError(null);
      scrollToResult();
    } catch (error) {
      console.error("Error:", error);
      setApiError(error.message);
    }
    setIsLoading(false);
  };

  const scrollToResult = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md" sx={{ backgroundColor: "#f5f5f5", py: 4 }}>
          <Box my={4}>
            <Typography
              variant="h2"
              fontWeight={600}
              align="center"
              gutterBottom
              style={{ lineHeight: "1.0" }}
            >
              Discover Your Perfect Color Palette
            </Typography>
            <Typography variant="subtitle1" align="center">
              Upload your image and let our AI find the best colors for you!
            </Typography>
          </Box>
          <Box my={4} textAlign="center">
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <UploadButton
                variant="contained"
                component="span"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  "Upload Image"
                )}
              </UploadButton>
            </label>
          </Box>
          {selectedImage && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  mt={4}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: 8,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} ref={resultRef}>
                <Box mt={4}>
                  <Typography variant="h5" gutterBottom>
                    AI Analysis Result:
                  </Typography>
                  {isLoading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height={200}
                    >
                      <CircularProgress style={{ color: "#FF6B8B" }} />
                    </Box>
                  ) : apiError ? (
                    <Typography variant="body1" color="error">
                      Error: {apiError}
                    </Typography>
                  ) : (
                    <Typography variant="body1" whiteSpace="pre-wrap">
                      {analysisResult}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ColorAnalysis;
