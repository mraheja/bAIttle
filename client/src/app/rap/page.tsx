"use client";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Rap() {
  const [shownMessage, setShownMessage] = useState("");
  const [showJudgeResponse, setShowJudgeResponse] = useState(false);
  const [turn, setTurn] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [audio] = useState(new Audio("./beat.mp3"));
  const [started, setStarted] = useState(false);
  const [rounds, setRounds] = useState(1);

  const router = useRouter();

  // // Reset server.
  // useEffect(() => {
  //   // Extract query parameters from the URL
  //   const queryParams = new URLSearchParams(window.location.search);
  //   const botOnePersonality = queryParams.get("botOnePersonality");
  //   const botOneModel = queryParams.get("botOneModel");
  //   const botTwoPersonality = queryParams.get("botTwoPersonality");
  //   const botTwoModel = queryParams.get("botTwoModel");
  //   const judgeModel = queryParams.get("judgeModel");

  //   // Prepare the JSON payload
  //   const payload = {
  //     botOnePersonality,
  //     botOneModel,
  //     botTwoPersonality,
  //     botTwoModel,
  //     judgeModel,
  //   };

  //   // Send the payload to the server
  //   void fetch("http://127.0.0.1:5000/rap_setup", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });
  // });

  const done = rounds == 7;

  const handleSubmit = async () => {
    setRounds(rounds + 1);
    if(!started) {
      setStarted(true)
    }
    setLoading(true)
    if (!audioPlayed) {
      audio.play();
      setAudioPlayed(true);
    }
    setTurn(!turn);
    console.log("[DEBUG] Sending message");
    const data = { message: "hello" };
    const response = await fetch("http://127.0.0.1:5000/rap_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    setLoading(false);

    setShowJudgeResponse(true);

    // console.log("[DEBUG] Response:", responseData['response'])
    setShownMessage(responseData["response"]);
  };

  const seeResults = () => {
    router.push(`./see_winner`);
  };

  useEffect(() => {
    console.log("[DEBUG] Showing judge response", showJudgeResponse);
    if (showJudgeResponse) {
      setTimeout(() => setShowJudgeResponse(false), 3000); // setShowJudgeResponse(false);
    }
  }, [showJudgeResponse]);

  console.log("loading", loading)

  return (
    <main className="flex min-h-screen flex-col items-center">
      <img
        src="../city.jpeg"
        className="h-screen w-screen -z-50 absolute"
      ></img>
      <div className="absolute h-screen w-screen bg-slate-950 opacity-70" />
      <img
        src={turn ? "../bot2.gif" : "../bot.gif"}
        className="h-[800px] absolute bottom-12 left-7 transition-opacity duration-1000 ease-in opacity-0"
        onLoad={(e) => e.currentTarget.style.opacity = '1'}
      ></img>
      
      {/* <Typewriter words=["You're stupid, you silly bafoon.Go back to your hood where you're the worst on your tune."]>
      
      </Typewriter> */}
      <div className="whitespace-pre-wrap flex absolute top-16 text-white text-5xl font-bold tracking-wider italic flex-wrap w-[50%] right-[20%] text-center z-20">
        {/* You're stupid, you silly bafoon.Go back to your hood where you're the worst on your tune. */}
        {loading ? <Box sx={{ width: '100%' }}> <LinearProgress /> </Box> : shownMessage.replace("\n", "\n\n")}
      </div>
      <div className="opacity-50">
        <img
          src={turn ? "../bot.gif" : "../bot2.gif"}
          className="h-[300px] absolute bottom-[40%] right-[20%] transition-opacity duration-1000 ease-in opacity-0"
          onLoad={(e) => e.currentTarget.style.opacity = '1'}
        ></img>
      </div>
      <div className="absolute top-3 right-3 bg-slate-900 p-5 flex justify-center flex-col space-y-2 items-center">
        <div className="text-white">Judges</div>
        <span className="flex flex-col space-y-3">
          <div className="h-10 w-10 rounded-full bg-red-300 flex justify-center items-center text-slate-950">M</div>
        </span>
      </div>
      {showJudgeResponse && (
        <div className="absolute top-[80px] right-[90px] bg-slate-200 w-30 h-10 rounded-l-md rounded-b-md flex justify-center items-center">
          <div className="p-2 text-black">Ooo sick burn!</div>
        </div>
      )}
      {!done ? <Button
        variant="contained"
        className="absolute bottom-20 right-20 w-[300px] h-[100px] bg-blue-500 text-xl rounded-lg"
        onClick={() => handleSubmit()}
      >
        {started ? "Next" : "Start battle"}
      </Button> :<Button
        variant="contained"
        className="absolute bottom-20 right-20 w-[300px] h-[100px] bg-blue-500 text-xl rounded-lg"
        onClick={() => seeResults()}
      >
        See Results
      </Button>}
    </main>
  );
}
