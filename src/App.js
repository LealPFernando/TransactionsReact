import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from "react-router-dom/cjs/react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Pages
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";

// Components
import Navbar from "./components/navbar/Navbar";

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/">
              {!user && <Redirect to="login" />}
              {user && <Home />}
            </Route>
            <Route exact path="/login">
              {user && <Redirect to="/" />}
              {!user && <Login />}
            </Route>
            <Route exact path="/signup">
              {user && <Redirect to="/" />}
              {!user && <Signup />}
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
