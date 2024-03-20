import React, { useState, useRef } from "react";
import { Button, Container, Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const ColorBox = styled(Box)(({ color }) => ({
  width: 50,
  height: 50,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: "16px",
}));

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

const ColorButton = styled(Button)({
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
  const [selectedColorType, setSelectedColorType] = useState(null);
  const [skinColor, setSkinColor] = useState(null);
  const [hairColor, setHairColor] = useState(null);
  const [eyeColor, setEyeColor] = useState(null);
  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleColorTypeSelect = (colorType) => {
    setSelectedColorType(colorType);
  };

  const handleColorPick = (event) => {
    if (!selectedColorType || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const canvas = document.createElement("canvas");
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    const hexColor = rgbToHex(r, g, b);

    switch (selectedColorType) {
      case "skin":
        setSkinColor(hexColor);
        break;
      case "hair":
        setHairColor(hexColor);
        break;
      case "eye":
        setEyeColor(hexColor);
        break;
      default:
        break;
    }

    setSelectedColorType(null);
  };

  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  const handleSubmit = () => {
    // Perform color analysis or send data to server
    console.log("Skin Color:", skinColor);
    console.log("Hair Color:", hairColor);
    console.log("Eye Color:", eyeColor);
  };

  const isAllColorsSelected = skinColor && hairColor && eyeColor;

  return (
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
          <Typography variant="h2" align="center" gutterBottom>
            Discover Your Perfect Color Palette
          </Typography>
          <Typography variant="subtitle1" align="center">
            Upload your image and let our AI find the best colors for you!
          </Typography>
        </Box>
        <Box my={4} textAlign="center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <UploadButton variant="contained" component="span">
              Upload Image
            </UploadButton>
          </label>
        </Box>
        {selectedImage && (
          <Box mt={4}>
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Selected"
              style={{
                maxWidth: "100%",
                height: "auto",
                cursor: selectedColorType ? "crosshair" : "default",
                borderRadius: 8,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleColorPick}
            />
          </Box>
        )}
        {selectedImage && (
          <Box mt={4}>
            <Grid container spacing={2} justifyContent="center">
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <ColorButton
                  variant={
                    selectedColorType === "skin" ? "contained" : "outlined"
                  }
                  onClick={() => handleColorTypeSelect("skin")}
                >
                  Select Skin Color
                </ColorButton>
                {skinColor && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ColorBox color={skinColor} />
                    <Typography variant="body1">{skinColor}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <ColorButton
                  variant={
                    selectedColorType === "hair" ? "contained" : "outlined"
                  }
                  onClick={() => handleColorTypeSelect("hair")}
                >
                  Select Hair Color
                </ColorButton>
                {hairColor && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ColorBox color={hairColor} />
                    <Typography variant="body1">{hairColor}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <ColorButton
                  variant={
                    selectedColorType === "eye" ? "contained" : "outlined"
                  }
                  onClick={() => handleColorTypeSelect("eye")}
                >
                  Select Eye Color
                </ColorButton>
                {eyeColor && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ColorBox color={eyeColor} />
                    <Typography variant="body1">{eyeColor}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
        {isAllColorsSelected && (
          <Box mt={4} textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit}>
              Generate Palette
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ColorAnalysis;
