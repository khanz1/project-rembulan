import { useNavigate } from 'react-router-dom';
import { IconCircleDashedCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const COUNTDOWN = 5;
const ONE_SECOND = 1000;

export default function OrderCompletedPage() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(COUNTDOWN);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev - 1);
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter === 0) {
      navigate('/');
    }
  }, [counter, navigate]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-10">
      <IconCircleDashedCheck className="h-32 w-32 text-green-400" />
      <div>
        <h1 className="text-2xl font-bold text-center">Order Completed</h1>
        <p className="text-dimmed text-center">Thank you for your order</p>
        <p className="text-center">Redirect to home in {counter} seconds</p>
      </div>
    </div>
  );
}
