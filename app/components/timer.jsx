import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Timer = ({ timeLimit }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timeOut, setTimeOut] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerId);
          setTimeOut(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <Card className="p-6 bg-blue-800 rounded-lg shadow-lg">
      <div className="text-center">
        <div className={timeOut ? "hidden" : "timer"}>
          <div className="timer-display mb-4">
            <h2 className="text-3xl text-white">Time Left: {timeLeft}s</h2>
          </div>

          <Progress value={(timeLeft / timeLimit) * 100} className="mb-4" />
        </div>

        <div className={timeOut ? "" : "hidden"}>Времето изтече. Пий веднага</div>
      </div>
    </Card>
  );
};

export default Timer;
