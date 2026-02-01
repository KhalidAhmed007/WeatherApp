import React from 'react';
import SearchBox from './SearchBox';  // Changed from "./components/SearchBox"
import { CssBaseline, Container } from "@mui/material";

function App() {
    return (
        <>
            <CssBaseline />
            <Container sx={{ mt: 4 }}>
                <SearchBox />
            </Container>
        </>
    );
}

export default App;