"use client";

import { useState } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import TextInput from "@/app/(dashboard)/dashboard/components/inputs/Text";
import NumberInput from "@/app/(dashboard)/dashboard/components/inputs/Number";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import InlineCode from "@/app/(dashboard)/dashboard/components/ui/InlineCode";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";
import {addDashboardLog} from "@/app/lib/addDashboardLog";

export default function AntiBotPage() {
  const [enabled, setEnabled] = useState(true);
  const [timeWindow, setTimeWindow] = useState(10);
  const [channelLimit, setChannelLimit] = useState(3);
  const [punishment, setPunishment] = useState("");
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([""]);

  const { notify } = useNotification();

  const handleSave = () => {
    notify("Saved!", "", "success");
  };

  const addForbiddenWord = () => {
    setForbiddenWords([...forbiddenWords, ""]);
  };

  const updateForbiddenWord = (index: number, value: string) => {
    const updated = [...forbiddenWords];
    updated[index] = value;
    setForbiddenWords(updated);
  };

  const removeForbiddenWord = (index: number) => {
    const updated = [...forbiddenWords];
    updated.splice(index, 1);
    setForbiddenWords(updated);
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Anti-Bot Settings</h1>

      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-400">Enable Anti-Bot</span>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
            enabled ? "bg-[var(--primary-color)]" : "bg-gray-700"
          }`}
        >
          <span
            className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="mb-4">
        <NumberInput
          label="Time Window (seconds)"
          value={timeWindow}
          onChange={(val) => setTimeWindow(Number(val))}
          placeholder="Example: 10"
        />
        <p className="text-sm text-gray-500">
          Users cannot send messages in more than <InlineCode text={channelLimit.toString()} /> channels within <InlineCode text={timeWindow.toString()} /> seconds.
        </p>
      </div>

      <div className="mb-4">
        <NumberInput
          label="Channel Limit"
          value={channelLimit}
          onChange={(val) => setChannelLimit(Number(val))}
          placeholder="Example: 3"
        />
      </div>

      <div className="mb-4">
        <SelectInput
          label="Punishment"
          value={punishment}
          onChange={setPunishment}
          options={[
            { value: "", label: "Select..." },
            { value: "mute", label: "Mute" },
            { value: "kick", label: "Kick" },
            { value: "ban", label: "Ban" },
          ]}
        />
      </div>

      {/* Forbidden Words/Sentences */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Forbidden Words/Sentences</label>
        {forbiddenWords.map((word, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={word}
              onChange={(e) => updateForbiddenWord(index, e.target.value)}
              placeholder="Enter forbidden word or sentence"
              className="flex-1 bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
            {forbiddenWords.length > 1 && (
              <DeleteButton
                onClick={() => {removeForbiddenWord(index)}}
              />
            )}

          </div>
        ))}
        <button
          type="button"
          onClick={addForbiddenWord}
          className="mt-2 px-3 py-1 bg-[var(--primary-color)] rounded hover:brightness-90 text-white"
        >
          Add Word/Sentence
        </button>
      </div>

      <SaveButton onClick={handleSave} />
    </section>
  );
}
