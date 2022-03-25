import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export default function CountdownTimer({ targetDate }) {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const DateTimeDisplay = ({ value, type }) => {
    return (
      <span style={{ fontSize: '1.8rem' }}>{`${value} ${type}${
        type !== 'Secunde' ? ', ' : ''
      }`}</span>
    );
  };
  const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
      <div style={{ maxWidth: '80vw', textAlign: 'center' }}>
        {/* <DateTimeDisplay value={days} type={'Zile'} isDanger={days <= 3} /> */}
        <DateTimeDisplay value={hours} type={'Ore'} isDanger={false} />
        <DateTimeDisplay value={minutes} type={'Minute'} isDanger={false} />
        <DateTimeDisplay value={seconds} type={'Secunde'} isDanger={false} />
      </div>
    );
  };

  const ExpiredNotice = () => {
    return (
      <div>
        <span>Expired!!!</span>
      </div>
    );
  };

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <div style={{ marginTop: '30px' }}>
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      </div>
    );
  }
}
