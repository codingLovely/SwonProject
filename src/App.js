import { Fragment } from 'react';
import Routes from './Routes/Routes';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from 'react-device-detect';

function App(props) {

    return (
      <Fragment>
        <Routes/>
      </Fragment>
    );

}

export default App;
