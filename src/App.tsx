import { RouterProvider } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';
import { useRouter } from './context/RouterContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import CurrentBooking from './pages/CurrentBooking';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import RoomDetail from './pages/RoomDetail';
import News from './pages/News';
import client from './appwrite.ts';
import { Account } from 'appwrite';

function Router() {
  const { currentPath } = useRouter();

  const renderPage = () => {
    // Handle room detail routes
    if (currentPath.startsWith('/rooms/')) {
      const roomId = currentPath.split('/rooms/')[1];
      return <RoomDetail roomId={roomId} />;
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/rooms':
        return <Rooms />;
      case '/booking':
      case '/current-booking':
        return <CurrentBooking />;
      case '/news':
        return <News />;
      case '/menu':
      case '/dashboard': // Keep backward compatibility
        return <Dashboard />;
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

function App() {
  console.log("App loaded successfully");

  // Only test Appwrite connection if environment variables are available
  if (import.meta.env.VITE_APPWRITE_ENDPOINT && import.meta.env.VITE_APPWRITE_PROJECT_ID) {
    console.log("Appwrite client:", client);
    const account = new Account(client);
    account.get()
      .then(res => console.log("Appwrite account.get → success", res))
      .catch(err => console.log("Appwrite account.get → error", err));
  } else {
    console.warn("Appwrite environment variables not found. Some features may not work.");
  }

  return (
    <ThemeProvider>
      <RouterProvider>
        <Router />
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;
