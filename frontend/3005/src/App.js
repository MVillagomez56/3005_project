import "./App.css";
import { AuthProvider } from "./store/AuthContext";
import { AppRouter } from "./AppRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
