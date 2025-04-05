import { Box } from "@mui/material";
import MindMap from "./components/MindMap";

function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
        <MindMap />
    </Box>
  )
}

export default App