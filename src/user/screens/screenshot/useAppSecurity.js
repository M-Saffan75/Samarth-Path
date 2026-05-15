import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const useAppSecurity = () => {

  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {

    const sub = AppState.addEventListener('change', (state) => {

      if (state !== 'active') {
        setIsSecure(true);
      } else {
        setIsSecure(false);
      }

    });

    return () => sub.remove();

  }, []);

  return { isSecure };

};

export default useAppSecurity;