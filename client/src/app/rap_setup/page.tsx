"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
// Use Next.js router to redirect with the search parameters
import { useRouter } from "next/navigation";

const PERSONALITIES = [
  "Default",
  "Elon Musk",
  "Jeff Bezos",
  "Mark Zuckerberg",
  "Alan Turing",
  "Joe Biden",
  "Kamala Harris",
  "Donald Trump",
];

const MODELS = [
  "mistralai/Mixtral-8x7B-Instruct-v0.1",
  "togethercomputer/CodeLlama-13b-Instruct",
  "garage-bAInd/Platypus2-70B-instruct",
  "WizardLM/WizardCoder-15B-V1.0",
];

const RapSetup = () => {
  const [botOnePersonality, setBotOnePersonality] = useState("");
  const [botOneModel, setBotOneModel] = useState("");
  const [botTwoPersonality, setBotTwoPersonality] = useState("");
  const [botTwoModel, setBotTwoModel] = useState("");
  const [judgeModel, setJudgeModel] = useState("");
  const router = useRouter();

  const startBattle = () => {
    // Create a URLSearchParams object to hold the query parameters
    const queryParams = new URLSearchParams({
      botOnePersonality: botOnePersonality,
      botOneModel: botOneModel,
      botTwoPersonality: botTwoPersonality,
      botTwoModel: botTwoModel,
      judgeModel: judgeModel,
    });

    router.push(`./rap?${queryParams.toString()}`);
  };

  return (
    <main className="h-screen w-screen bg-slate-100 flex justify-center items-center flex-col space-y-7">
      <h1 className="text-5xl text-black">
        Welcome to <span className="text-red-700 font-semibold">bAIttle</span>!
      </h1>

      <div className="flex flex-col items-center gap-4 [&>*]:text-white">
        <FormControl variant="filled" className="w-72">
          <InputLabel id="bot-one-personality-label">
            Bot 1: Personality
          </InputLabel>
          <Select
            labelId="bot-one-personality-label"
            id="bot-one-personality"
            value={botOnePersonality}
            onChange={(e) => setBotOnePersonality(e.target.value)}
            label="Bot 1: Personality"
          >
            {PERSONALITIES.map((personality) => (
              <MenuItem key={personality} value={personality}>
                {personality}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="filled" className="w-72">
          <InputLabel id="bot-one-model-label">Bot 1: Model</InputLabel>
          <Select
            labelId="bot-one-model-label"
            id="bot-one-model"
            value={botOneModel}
            onChange={(e) => setBotOneModel(e.target.value)}
            label="Bot 1: Model"
          >
            {MODELS.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="filled" className="w-72">
          <InputLabel id="bot-two-personality-label">
            Bot 2: Personality
          </InputLabel>
          <Select
            labelId="bot-two-personality-label"
            id="bot-two-personality"
            value={botTwoPersonality}
            onChange={(e) => setBotTwoPersonality(e.target.value)}
            label="Bot 2: Personality"
          >
            {PERSONALITIES.map((personality) => (
              <MenuItem key={personality} value={personality}>
                {personality}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="filled" className="w-72">
          <InputLabel id="bot-two-model-label">Bot 2: Model</InputLabel>
          <Select
            labelId="bot-two-model-label"
            id="bot-two-model"
            value={botTwoModel}
            onChange={(e) => setBotTwoModel(e.target.value)}
            label="Bot 2: Model"
          >
            {MODELS.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="filled" className="w-72">
          <InputLabel id="bot-two-model-label">Judge Model</InputLabel>
          <Select
            labelId="bot-two-model-label"
            id="bot-two-model"
            value={judgeModel}
            onChange={(e) => setJudgeModel(e.target.value)}
            label="Judge Model"
          >
            {MODELS.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Button
        variant="contained"
        className="text-black"
        onClick={() => startBattle()}
      >
        Start
      </Button>
    </main>
  );
};

export default RapSetup;
