import { useEffect, useState } from "react";
import Main from './Main';
import Video from './Video';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
  
//   const useStyles = makeStyles((theme) => ({
//     root: {
//       width: '100%',
//       '& > * + *': {
//         marginTop: theme.spacing(2),
//       },
//     },
//   }));
const App=()=>{
    
    return (

        <Router>
            <Switch>
                <Route exact path="/">
                    <div className="container-fluid bg-dark text-center pt-4">
                            <Link className="text-white btn btn-outline-primary" to="/chat">CHAT </Link>
                            <Link className="text-white btn btn-outline-primary" to="/videostream">Video Stream With Friends</Link>
                    </div>
                </Route>
                <Route exact path="/chat">
                   <Main/>
                </Route>
                <Route exact path="/videostream">
                    <Video/>
                </Route>
            </Switch>
        </Router>
    )
}
export default App;