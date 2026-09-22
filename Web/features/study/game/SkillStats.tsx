import { PropsWithoutRef, useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Skill from "../../../modules/share/model/skill";
import { GameObjectStatus, QuestionItem } from "./game.core";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SkillStats = (props: PropsWithoutRef<{
  /** Flatten Skills Array */
  skills: Skill[];
  questionItems: QuestionItem[];
}>) => {
  const { skills: _skills, questionItems } = props;
  const data = useMemo(() => {
    const labels: string[] = [];
    const dataCorrect: number[] = [];
    const dataIncorrect: number[] = [];
    const correctQuestions = questionItems.filter(({ correct, status }) => status === GameObjectStatus.ANSWERED && correct);
    const skills = [..._skills];
    skills
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((skill) => {
        const _correctQuestions = correctQuestions.filter(({ skillValue }) => skillValue === skill.value);
        const _totalQuestions = questionItems.filter(({ skillValue }) => skillValue === skill.value);
        const corectPercent = Math.round((100 * _correctQuestions.length) / (_totalQuestions.length || 1));
        const incorrectPercent = 100 - corectPercent;
        labels.push(skill.name);
        dataCorrect.push(corectPercent);
        dataIncorrect.push(incorrectPercent);
      });
    return { labels, dataCorrect, dataIncorrect };
  }, [_skills, questionItems]);

  return <>
    <div style={{ height: "250px" }}>
      <Bar
        title="Skill statistics"
        data={{
          labels: data.labels,
          datasets: [
            { label: "Correct", data: data.dataCorrect, backgroundColor: "#19CE7A", maxBarThickness: 30 },
            { label: "Incorrect", data: data.dataIncorrect, backgroundColor: "#F0F0F0", maxBarThickness: 30 }
          ]
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label || ''}: ${ctx.parsed.y}%`
              }
            }
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              min: 0,
              max: 100,
              ticks: {
                callback: (value) => `${value}%`
              }
            }
          }
        }}
      />
    </div>
  </>
}

export default SkillStats;
