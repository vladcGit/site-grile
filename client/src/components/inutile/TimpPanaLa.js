import React from 'react';

export default function TimpPanaLa({ data }) {
  const [str, setStr] = React.useState('');
  React.useEffect(() => {
    const timer = setInterval(() => {
      const diffTime = Math.abs(new Date(data) - new Date());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffMins = Math.ceil(diffTime / (1000 * 60));
      const diffSecs = Math.ceil(diffTime / 1000);
      if (diffDays > 0) {
        setStr(`${diffDays} zile`);
      } else if (diffHours > 0) {
        setStr(`${diffHours} ore`);
      } else if (diffMins > 0) {
        setStr(`${diffMins} minute`);
      } else if (diffSecs > 0) {
        setStr(`${diffSecs} secunde`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);
  return <div style={{ marginTop: '30px' }}>Au mai ramas: {str}</div>;
}
