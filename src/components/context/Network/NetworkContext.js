import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setOnline, setOffline } from './networkActions';

const NetworkProvider = ({ children, setOnline, setOffline }) => {
  useEffect(() => {
    const handleOnline = () => setOnline();
    const handleOffline = () => setOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, setOffline]);

  return <>{children}</>;
};

const mapDispatchToProps = {
  setOnline,
  setOffline
};

export default connect(null, mapDispatchToProps)(NetworkProvider);
