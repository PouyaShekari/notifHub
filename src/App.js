import React, {useEffect, useState} from 'react';
import Routes from './routes';
import SplashScreen from './components/SplashScreen';
//Import Scss
import "./assets/scss/themes.scss";

//fackbackend
// import fakeBackend from './helpers/fake-backend';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// fakeBackend();

function App() {

  const selectLayoutProperties = createSelector(
      (state) => state.Layout,
      (layout) => ({
        layoutMode: localStorage.getItem('layoutMode') ?? layout.layoutMode,
      })
  );
  const { layoutMode } = useSelector(selectLayoutProperties);

useEffect(() => {
  layoutMode && localStorage.setItem("layoutMode",layoutMode);
}, [layoutMode])



  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization/loading
    const appLoading = async () => {
      // Perform any initialization tasks here
      // For example: load user data, check authentication, etc.

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      setIsLoading(false);
    };

    appLoading();
  }, []);

  return (
      <>
        {isLoading && <SplashScreen minimumDisplayTime={3000} />}
        {!isLoading && <Routes />}
      </>
  )
};

export default App;
