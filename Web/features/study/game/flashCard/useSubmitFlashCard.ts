import { useEffect } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { updateTopicBoxCard } from "../../topic.slice";
import { ClientCardProgress, GameObjectStatus, QuestionItem } from "../game.core";
import { onAnswer, setUpdateBoxCard } from "../game.slice";
import { FlashCardGameObject } from "./FlashCardGameObject";

const useSubmitFlashCard = () => {
  const topic = useSelector((state) => state.topicState.currentTopic);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const cardProgresses = useSelector((state) => state.gameState.cardProgresses);
  const updateBoxCard = useSelector((state) => state.gameState.updateBoxCard);
  const questionItems = useSelector((state) => state.gameState.questionItems);
  const gameFunction = useSelector((state) => state.gameState.gameFunction);
  const dispatch = useDispatch();

  useEffect(() => {
    if (topic?._id) {
      if (updateBoxCard !== null) {
        dispatch(updateTopicBoxCard({ topicId: topic._id, boxCard: updateBoxCard }));
        dispatch(setUpdateBoxCard(null));
      }
    }
  }, [updateBoxCard, topic?._id]);

  const onSubmit = (args: {
    gameObject: FlashCardGameObject;
    correct: boolean;
  }) => {
    const { gameObject, correct } = args;
    const studyId = `${topic._id}_${gameObject.id}`;
    let cardProgress =
      cardProgresses[studyId]
        ? (cardProgresses[studyId]?.userId === userId ? ClientCardProgress.clone(cardProgresses[studyId]) : undefined)
        : undefined;
    if (!cardProgress) cardProgress = new ClientCardProgress({
      cardId: gameObject.id,
      topicId: topic._id,
      userId,
      correct
    });
    const newHistory = cardProgress.history?.length < 5 ? [...(cardProgress.history ?? []), correct] : [...((cardProgress.history ?? []).slice(1)), correct];
    cardProgress.setHistory(newHistory);
    const questionItem = questionItems.find(({ id }) => id === gameObject.id);
    const newQuestionItem = QuestionItem.clone(questionItem);
    newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
    dispatch(onAnswer({
      questionItem: newQuestionItem,
      cardProgress
    }))
    if (!!user) {
      if (gameFunction?.onAnswer) {
        gameFunction.onAnswer(cardProgress);
      }
    }
  }

  return {
    onSubmit
  }
}

export default useSubmitFlashCard;