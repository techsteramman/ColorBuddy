import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

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

const SubmitButton = styled(Button)({
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
  const [userEmail, setUserEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    if (
      file &&
      allowedTypes.includes(file.type) &&
      file.size <= maxSizeInBytes
    ) {
      setSelectedImage(file);
    } else {
      alert(
        "Please upload a valid image file (JPEG, PNG, GIF, or WebP) under 5 MB.",
      );
    }
  };

  const handleSubmit = async () => {
    if (selectedImage) {
      setIsLoading(true);
      try {
        const uniqueId = uuidv4();
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
          const base64Image = reader.result.split(",")[1];
          // Send API call to Lambda function to upload image to S3
          const response = await axios.post(
            "https://fnna5xesrb.execute-api.ap-northeast-1.amazonaws.com/prod/upload",
            {
              image: base64Image,
              uniqueId: uniqueId,
              contentType: selectedImage.type, // Send the content type to the Lambda function
            },
          );
          console.log(response.data.fileName);
          const fileName = response.data.fileName;
          setIsLoading(false);
          // Redirect to Stripe payment page with prefilled email and client reference ID
          const stripeUrl = `https://buy.stripe.com/test_14k3dZ1B5drT5563cd?prefilled_email=${encodeURIComponent(
            userEmail,
          )}&client_reference_id=${fileName}`;
          window.location.href = stripeUrl;
        };
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please upload an image before submitting.");
    }
  };

  const isValidEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            <TextField
              label="Email"
              variant="outlined"
              value={userEmail}
              onChange={handleEmailChange}
              fullWidth
              margin="normal"
            />
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <UploadButton variant="contained" component="span">
                Upload Image
              </UploadButton>
            </label>
            {selectedImage && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}
            {isValidEmail(userEmail) && selectedImage && (
              <Box mt={2}>
                <SubmitButton
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Submit - $1"
                  )}
                </SubmitButton>
              </Box>
            )}
            <Typography variant="body1" mt={2}>
              Your color analysis will be sent to your email.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
export default ColorAnalysis;
