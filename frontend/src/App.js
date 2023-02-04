import './App.css';

// Import nav from ./components/Nav.tsx
import Nav from './components/Nav.tsx';
import Sidebar from './components/Sidebar.tsx';
// Or, if you want to use the default export:
// import 'Nav' from './components/Nav';

import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Sidebar></Sidebar>
    </ChakraProvider>
  );
}

export default App;
